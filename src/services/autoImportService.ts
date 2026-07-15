import * as XLSX from 'xlsx';
import { spaceRepository, importBatchRepository } from '@/repositories';
import { 
  normalizeHeaders, 
  parseDimensions, 
  classifyMedia, 
  generateFingerprint 
} from '@/utils/excelParser';

export interface ImportSummary {
  excelRowsCount: number;
  validRowsCount: number;
  invalidRowsCount: number;
  warningRowsCount: number;
  groupsCount: number;
  totalQuantity: number;
  createdUnitsCount: number;
  skippedDuplicatesCount: number;
  firstMgaCode: string;
  lastMgaCode: string;
  digitalCount: number;
  staticCount: number;
  unclassifiedCount: number;
  zeroPriceCount: number;
  persistenceLayer: string;
}

export const autoImportService = {
  async runAutoImport(): Promise<ImportSummary | null> {
    try {
      // Check if already auto-imported to prevent redundant operations
      const hasImported = localStorage.getItem('outdoorcore_mga_auto_imported');
      if (hasImported) {
        console.log('[AutoImport] MGA Reklam Alanları already imported previously.');
        return this.getImportSummaryFromStorage();
      }

      console.log('[AutoImport] Starting automated import of MGA Reklam Alanları...');
      
      // Fetch Excel file from public directory
      const response = await fetch('/MGA REKLAM ALANLARI.xlsx');
      if (!response.ok) {
        throw new Error(`Failed to fetch Excel file: ${response.statusText}`);
      }
      
      const buffer = await response.arrayBuffer();
      const workbook = XLSX.read(buffer, { type: 'array' });
      const sheetName = workbook.SheetNames[0];
      const sheet = workbook.Sheets[sheetName];
      const rawRows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });

      if (rawRows.length === 0) {
        throw new Error('Excel file has no rows.');
      }

      // Cleanup unlinked demo spaces
      await this.cleanupDemoSpaces();

      // Retrieve existing spaces
      const existingSpaces = await spaceRepository.list();
      const existingFingerprints = new Set(
        existingSpaces.map(s => s.importFingerprint).filter(Boolean)
      );

      // Determine starting MGA sequence code
      let currentMaxNumber = 0;
      existingSpaces.forEach(s => {
        if (s.code && s.code.startsWith('MGA-')) {
          const num = parseInt(s.code.replace('MGA-', ''), 10);
          if (!isNaN(num) && num > currentMaxNumber) {
            currentMaxNumber = num;
          }
        }
      });

      const headerMapping = normalizeHeaders(Object.keys(rawRows[0]));
      const spacesToInsert: any[] = [];
      const invalidRows: any[] = [];

      let totalQuantity = 0;
      let skippedDuplicates = 0;
      let digitalCount = 0;
      let staticCount = 0;
      let unclassifiedCount = 0;
      let zeroPriceCount = 0;

      rawRows.forEach((row, idx) => {
        const rowNum = idx + 2;
        const name = row[headerMapping['name']] || '';
        const terminal = row[headerMapping['terminal']] || '';
        const dimensions = row[headerMapping['dimensions']] || '';
        const qtyRaw = row[headerMapping['quantity']];
        const faceRaw = row[headerMapping['faceCount']];
        const screenType = row[headerMapping['screenType']] || '';
        const networkRaw = row[headerMapping['networkCount']] || '';
        const notes = row[headerMapping['notes']] || '';

        if (!name) {
          invalidRows.push({ rowNum, reason: 'Empty name' });
          return;
        }

        let quantity = parseInt(qtyRaw, 10);
        if (isNaN(quantity) || quantity <= 0) {
          const face = parseInt(faceRaw, 10);
          quantity = (!isNaN(face) && face > 0) ? face : 1;
        }

        totalQuantity += quantity;

        // Classification
        const classification = classifyMedia(name, screenType);
        if (classification.isDigital) digitalCount += quantity;
        else if (classification.isStatic) staticCount += quantity;
        else unclassifiedCount += quantity;

        zeroPriceCount += quantity;

        const groupId = 'GRP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
        const groupFingerprintKey = {
          name,
          terminal,
          dimensions,
          screenType,
          slideNo: row[headerMapping['slideNo']] || '',
          sequenceNo: row[headerMapping['sequenceNo']] || '',
          quantity,
          networkCount: networkRaw
        };

        const parsedDim = parseDimensions(dimensions);

        // Network count parsing matching generate-mga-json.cjs
        let networkCount = 0;
        const netStr = String(networkRaw).trim();
        if (netStr) {
          const match = netStr.match(/^(\d+)/);
          if (match) {
            const n = parseInt(match[1], 10);
            if (!isNaN(n) && n > 0) {
              networkCount = n;
            }
          }
        }

        // Deterministik face dağıtımı
        const faceCountTotal = parseInt(faceRaw, 10) || quantity;
        const baseFace = Math.floor(faceCountTotal / quantity);
        const remainder = faceCountTotal % quantity;

        for (let i = 1; i <= quantity; i++) {
          const fingerprint = generateFingerprint(groupFingerprintKey, i);
          if (existingFingerprints.has(fingerprint)) {
            skippedDuplicates++;
            continue;
          }

          currentMaxNumber++;
          const codeNumber = String(currentMaxNumber).padStart(6, '0');
          const spaceCode = `MGA-${codeNumber}`;
          const displayIndex = String(i).padStart(3, '0');
          
          const itemFaceCount = baseFace + (i <= remainder ? 1 : 0);

          spacesToInsert.push({
            id: `SPC-MGA${codeNumber}`,
            code: spaceCode,
            name: `${name} — ${displayIndex}`,
            groupName: name,
            location: terminal || 'Ortak Alan',
            type: classification.spaceType,
            size: dimensions || 'Muhtelif',
            price: '₺0',
            priceNumeric: 0,
            currency: 'TRY',
            status: 'bos',
            client: '',
            workingHours: classification.isDigital ? '24 Saat' : 'Statik Görünüm',
            isDigital: classification.isDigital,
            isStatic: classification.isStatic,
            isSpecial: classification.isSpecial,
            isActive: true,
            terminal: terminal || 'Ortak Alan',
            notes: notes ? String(notes) : '',
            inventoryGroupId: groupId,
            unitIndex: i,
            importFingerprint: fingerprint,
            source: 'excel_import',
            sourceFile: 'MGA REKLAM ALANLARI.xlsx',
            sourceRow: rowNum,
            faceCount: itemFaceCount,
            networkCount,
            network_capacity: networkCount,
            networkCapacity: networkCount,
            networkName: networkRaw ? String(networkRaw) : ''
          });
        }
      });

      let firstMgaCode = '';
      let lastMgaCode = '';
      if (spacesToInsert.length > 0) {
        firstMgaCode = spacesToInsert[0].code;
        lastMgaCode = spacesToInsert[spacesToInsert.length - 1].code;

        // Perform chunked bulk inserts
        const chunkSize = 200;
        for (let i = 0; i < spacesToInsert.length; i += chunkSize) {
          const chunk = spacesToInsert.slice(i, i + chunkSize);
          await spaceRepository.createBulk(chunk);
        }
      }

      const summary: ImportSummary = {
        excelRowsCount: rawRows.length,
        validRowsCount: rawRows.length - invalidRows.length,
        invalidRowsCount: invalidRows.length,
        warningRowsCount: unclassifiedCount + zeroPriceCount,
        groupsCount: rawRows.length - invalidRows.length,
        totalQuantity,
        createdUnitsCount: spacesToInsert.length,
        skippedDuplicatesCount: skippedDuplicates,
        firstMgaCode,
        lastMgaCode,
        digitalCount,
        staticCount,
        unclassifiedCount,
        zeroPriceCount,
        persistenceLayer: localStorage.getItem('outdoorcore_mock_supabase_url') ? 'Supabase' : 'localStorage'
      };

      // Store summary and set auto-imported flag
      localStorage.setItem('outdoorcore_mga_auto_imported', 'true');
      localStorage.setItem('outdoorcore_mga_import_summary', JSON.stringify(summary));
      
      console.log('[AutoImport] Automated MGA envanter import completed successfully!', summary);
      return summary;
    } catch (e) {
      console.error('[AutoImport] Automated envanter import failed:', e);
      return null;
    }
  },

  async cleanupDemoSpaces() {
    try {
      // Find all spaces
      const spaces = spaceRepository.getAllSync();
      
      // Load reservations, campaigns, offers, contracts to check for bindings
      const storedRes = localStorage.getItem('outdoorcore_mock_reservations');
      const storedCamp = localStorage.getItem('outdoorcore_mock_campaigns');
      const storedOff = localStorage.getItem('outdoorcore_mock_offers');
      const storedCon = localStorage.getItem('outdoorcore_mock_contracts');

      const reservationsList = storedRes ? JSON.parse(storedRes) : [];
      const campaignsList = storedCamp ? JSON.parse(storedCamp) : [];
      const offersList = storedOff ? JSON.parse(storedOff) : [];
      const contractsList = storedCon ? JSON.parse(storedCon) : [];

      const activeRes = reservationsList.filter((r: any) => r.status !== 'İptal');
      const activeCamp = campaignsList.filter((c: any) => c.status !== 'İptal');

      const linkedIds = new Set<string>();
      activeRes.forEach((r: any) => { if (r.spaceId) linkedIds.add(r.spaceId); });
      activeCamp.forEach((c: any) => { if (c.spaceIds) c.spaceIds.forEach((id: string) => linkedIds.add(id)); });
      offersList.forEach((o: any) => { if (o.spaceIds) o.spaceIds.forEach((id: string) => linkedIds.add(id)); });
      contractsList.forEach((con: any) => { if (con.spaceIds) con.spaceIds.forEach((id: string) => linkedIds.add(id)); });

      // Clean up spaces that are not linked to anything and are demo/mock spaces
      const idsToDelete: string[] = [];
      spaces.forEach(s => {
        if (!linkedIds.has(s.id)) {
          // If it is a demo space (not imported from Excel)
          if (s.source !== 'excel_import') {
            idsToDelete.push(s.id);
          }
        }
      });

      if (idsToDelete.length > 0) {
        console.log(`[AutoImport] Cleaning up ${idsToDelete.length} unlinked demo advertising spaces.`);
        await spaceRepository.deleteBulk(idsToDelete);
      }
    } catch (e) {
      console.warn('[AutoImport] Cleanup of demo spaces encountered an error:', e);
    }
  },

  getImportSummaryFromStorage(): ImportSummary | null {
    try {
      const summaryStr = localStorage.getItem('outdoorcore_mga_import_summary');
      return summaryStr ? JSON.parse(summaryStr) : null;
    } catch {
      return null;
    }
  }
};
