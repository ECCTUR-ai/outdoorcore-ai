import React, { useState, useRef } from 'react';
import * as XLSX from 'xlsx';
import { 
  X, 
  UploadCloud, 
  FileSpreadsheet, 
  AlertTriangle, 
  CheckCircle, 
  AlertCircle, 
  Play, 
  Download, 
  RefreshCw,
  TrendingUp,
  MapPin,
  Circle,
  Tv
} from 'lucide-react';
import { Button } from './Button';
import { Badge } from './Badge';
import { Table, TableRow, TableCell } from './Table';
import { spaceRepository, importBatchRepository } from '@/repositories';
import { 
  normalizeHeaders, 
  parseDimensions, 
  classifyMedia, 
  generateFingerprint 
} from '@/utils/excelParser';

interface ExcelImportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function ExcelImportModal({ isOpen, onClose, onSuccess }: ExcelImportModalProps) {
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [excelData, setExcelData] = useState<any[]>([]);
  const [importReport, setImportReport] = useState<{
    totalRows: number;
    totalUnits: number;
    validRows: number;
    invalidRows: number;
    duplicateGroups: number;
    duplicateUnits: number;
    unclassifiedCount: number;
    zeroPriceCount: number;
    digitalCount: number;
    staticCount: number;
    otherCount: number;
    parsedUnits: any[];
    invalidList: { rowNum: number; name: string; reason: string; rowData: any }[];
  } | null>(null);

  // Stage 3 progress states
  const [progress, setProgress] = useState(0);
  const [importStats, setImportStats] = useState({
    processedGroups: 0,
    createdUnits: 0,
    skippedDuplicates: 0,
    errorsCount: 0
  });
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  if (!isOpen) return null;

  // Handle Drag & Drop
  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      processFile(e.dataTransfer.files[0]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      processFile(e.target.files[0]);
    }
  };

  // Step 1: Parse and validate file using SheetJS
  const processFile = async (selectedFile: File) => {
    const ext = selectedFile.name.split('.').pop()?.toLowerCase();
    if (ext !== 'xlsx' && ext !== 'xls') {
      alert('Yalnızca Excel dosyaları (.xlsx, .xls) kabul edilir.');
      return;
    }

    setFile(selectedFile);
    setLoading(true);
    
    try {
      const reader = new FileReader();
      reader.onload = (e) => {
        const data = e.target?.result;
        if (!data) throw new Error('Dosya içeriği okunamadı.');
        
        const workbook = XLSX.read(data, { type: 'binary' });
        const sheetName = workbook.SheetNames[0];
        const sheet = workbook.Sheets[sheetName];
        const rawRows = XLSX.utils.sheet_to_json<any>(sheet, { defval: '' });
        
        analyzeExcelData(rawRows);
      };
      reader.readAsBinaryString(selectedFile);
    } catch (err: any) {
      console.error(err);
      alert('Excel dosyası çözümlenirken hata oluştu: ' + err.message);
      setLoading(false);
    }
  };

  // Step 2: Validate fields, do classification, generate unit sequences and identify duplicates
  const analyzeExcelData = (rawRows: any[]) => {
    if (rawRows.length === 0) {
      alert('Seçilen Excel dosyasında hiç veri satırı bulunamadı.');
      setLoading(false);
      return;
    }

    // Inspect headers
    const headers = Object.keys(rawRows[0]);
    const headerMapping = normalizeHeaders(headers);

    // Retrieve existing units for duplicate fingerprints check
    const existingSpaces = spaceRepository.getAllSync();
    const existingFingerprints = new Set(
      existingSpaces.map(s => s.importFingerprint).filter(Boolean)
    );
    // Find the highest sequence of MGA to safely increments codes
    let maxMgaCode = 0;
    existingSpaces.forEach(s => {
      if (s.code && s.code.startsWith('MGA-')) {
        const num = parseInt(s.code.replace('MGA-', ''), 10);
        if (!isNaN(num) && num > maxMgaCode) {
          maxMgaCode = num;
        }
      }
    });

    const parsedUnits: any[] = [];
    const invalidList: any[] = [];
    
    let totalUnits = 0;
    let duplicateUnits = 0;
    let duplicateGroups = 0;
    let unclassifiedCount = 0;
    let zeroPriceCount = 0;
    let digitalCount = 0;
    let staticCount = 0;
    let otherCount = 0;

    rawRows.forEach((row, idx) => {
      const rowNum = idx + 2; // Row number in Excel file
      
      const seqNo = row[headerMapping['sequenceNo']] || '';
      const slideNo = row[headerMapping['slideNo']] || '';
      const name = row[headerMapping['name']] || '';
      const terminal = row[headerMapping['terminal']] || '';
      const dimensions = row[headerMapping['dimensions']] || '';
      const qtyRaw = row[headerMapping['quantity']];
      const faceRaw = row[headerMapping['faceCount']];
      const screenType = row[headerMapping['screenType']] || '';
      const networkRaw = row[headerMapping['networkCount']] || '';
      const notes = row[headerMapping['notes']] || '';

      if (!name) {
        invalidList.push({
          rowNum,
          name: `Satır ${rowNum}`,
          reason: 'Reklam alanı adı hücresi boş.',
          rowData: row
        });
        return;
      }

      // Adet validation & fallback
      let quantity = parseInt(qtyRaw, 10);
      let isFallbackUsed = false;
      let warningReason = '';

      if (isNaN(quantity) || quantity <= 0) {
        const face = parseInt(faceRaw, 10);
        if (!isNaN(face) && face > 0) {
          quantity = face;
          isFallbackUsed = true;
          warningReason = 'Adet boş veya geçersiz, "Face adet" kolonu fallback olarak kullanıldı.';
        } else {
          quantity = 1;
          isFallbackUsed = true;
          warningReason = 'Adet boş veya geçersiz, varsayılan değer "1" kullanıldı.';
        }
      }

      if (quantity <= 0 || quantity > 2000) {
        invalidList.push({
          rowNum,
          name,
          reason: `Geçersiz Adet değeri: ${qtyRaw}. Değer 1-2000 arasında olmalıdır.`,
          rowData: row
        });
        return;
      }

      // Generate distinct units
      const groupId = 'GRP-' + Math.random().toString(36).substring(2, 8).toUpperCase();
      const groupFingerprintKey = {
        name,
        terminal,
        dimensions,
        screenType,
        slideNo,
        sequenceNo: seqNo,
        quantity,
        networkCount: networkRaw
      };

      // Classification
      const classification = classifyMedia(name, screenType);
      if (classification.typeLabel === 'Özel') {
        unclassifiedCount += quantity;
      }
      
      zeroPriceCount += quantity; // default price is 0

      if (classification.isDigital) digitalCount += quantity;
      else if (classification.isStatic) staticCount += quantity;
      else otherCount += quantity;

      // Extract details
      const parsedDim = parseDimensions(dimensions);
      const faceCount = parseInt(faceRaw, 10) || 1;
      const networkCount = parseInt(networkRaw, 10) || 1;

      let groupHasDuplicates = false;

      for (let i = 1; i <= quantity; i++) {
        const fingerprint = generateFingerprint(groupFingerprintKey, i);
        const isDuplicate = existingFingerprints.has(fingerprint);
        
        if (isDuplicate) {
          duplicateUnits++;
          groupHasDuplicates = true;
        }

        // Build single space item payload
        const displayIndex = String(i).padStart(3, '0');
        parsedUnits.push({
          importFingerprint: fingerprint,
          isDuplicate,
          inventoryGroupId: groupId,
          unitIndex: i,
          groupName: name,
          displayName: `${name} — ${displayIndex}`,
          sequenceNo: parseInt(seqNo, 10) || null,
          slideNo: parseInt(slideNo, 10) || null,
          terminal: terminal || 'Ortak Alan',
          location: terminal || 'Havalimanı',
          dimensions,
          width: parsedDim.width,
          height: parsedDim.height,
          size: dimensions || 'Muhtelif',
          faceCount,
          screenType,
          type: classification.spaceType,
          mediaType: classification.typeLabel,
          networkName: networkRaw ? String(networkRaw) : '',
          networkCount,
          notes: notes ? String(notes) : '',
          status: 'bos', // default
          price: '₺0',
          priceNumeric: 0,
          currency: 'TRY',
          isDigital: classification.isDigital,
          isStatic: classification.isStatic,
          isSpecial: classification.isSpecial,
          isActive: true,
          source: 'excel_import',
          sourceFile: file?.name || 'MGA REKLAM ALANLARI.xlsx',
          sourceRow: rowNum,
          isFallbackUsed,
          warningReason,
          displayIndex
        });
      }

      if (groupHasDuplicates) {
        duplicateGroups++;
      }
      totalUnits += quantity;
    });

    setImportReport({
      totalRows: rawRows.length,
      totalUnits,
      validRows: rawRows.length - invalidList.length,
      invalidRows: invalidList.length,
      duplicateGroups,
      duplicateUnits,
      unclassifiedCount,
      zeroPriceCount,
      digitalCount,
      staticCount,
      otherCount,
      parsedUnits,
      invalidList
    });

    setLoading(false);
    setStep(2);
  };

  // Step 3: Action triggering bulk import in chunks of 200 units
  const handleStartImport = async () => {
    if (!importReport) return;
    setStep(3);
    setLoading(true);
    setProgress(0);

    const batchId = 'BAT-' + Math.random().toString(36).substring(2, 6).toUpperCase();
    const batchRecord = {
      id: batchId,
      fileName: file?.name || 'MGA REKLAM ALANLARI.xlsx',
      fileSize: file?.size || 0,
      startedAt: new Date().toISOString(),
      status: 'İçe aktarılıyor',
      totalSourceRows: importReport.totalRows,
      validRows: importReport.validRows,
      invalidRows: importReport.invalidRows,
      createdUnits: 0,
      updatedUnits: 0,
      skippedDuplicates: 0,
      warningCount: importReport.unclassifiedCount + importReport.zeroPriceCount,
      errorCount: importReport.invalidRows,
      importedBy: 'demo@outdoorcore.ai'
    };

    await importBatchRepository.create(batchRecord);

    const allSpaces = importReport.parsedUnits;
    const existingSpaces = spaceRepository.getAllSync();

    // Determine current max MGA code sequence
    let currentMaxNumber = 0;
    existingSpaces.forEach(s => {
      if (s.code && s.code.startsWith('MGA-')) {
        const num = parseInt(s.code.replace('MGA-', ''), 10);
        if (!isNaN(num) && num > currentMaxNumber) {
          currentMaxNumber = num;
        }
      }
    });

    let createdCount = 0;
    let skippedCount = 0;
    const chunkSize = 200;
    const spacesToInsert: any[] = [];

    for (let i = 0; i < allSpaces.length; i++) {
      const item = allSpaces[i];
      if (item.isDuplicate) {
        skippedCount++;
        continue;
      }

      currentMaxNumber++;
      const codeNumber = String(currentMaxNumber).padStart(6, '0');
      const spaceCode = `MGA-${codeNumber}`;

      spacesToInsert.push({
        id: `SPC-MGA${codeNumber}`,
        code: spaceCode,
        name: item.displayName,
        groupName: item.groupName,
        location: item.terminal,
        type: item.type,
        size: item.dimensions || 'Muhtelif',
        price: '₺0',
        priceNumeric: 0,
        currency: 'TRY',
        status: 'bos',
        client: '',
        workingHours: item.isDigital ? '24 Saat' : 'Statik Görünüm',
        isDigital: item.isDigital,
        isStatic: item.isStatic,
        isSpecial: item.isSpecial,
        isActive: true,
        terminal: item.terminal,
        notes: item.notes,
        inventoryGroupId: item.inventoryGroupId,
        unitIndex: item.unitIndex,
        importFingerprint: item.importFingerprint,
        importBatchId: batchId,
        source: 'excel_import',
        sourceFile: item.sourceFile,
        sourceRow: item.sourceRow,
        faceCount: item.faceCount,
        networkCount: item.networkCount,
        networkName: item.networkName
      });
      createdCount++;
    }

    // Insert to DB / localStorage in chunks of 200 to keep UI highly responsive
    const totalChunks = Math.ceil(spacesToInsert.length / chunkSize);
    
    for (let c = 0; c < totalChunks; c++) {
      const chunk = spacesToInsert.slice(c * chunkSize, (c + 1) * chunkSize);
      await spaceRepository.createBulk(chunk);
      
      // Update progress bar
      const currentPct = Math.round(((c + 1) / totalChunks) * 100);
      setProgress(currentPct);
      setImportStats(prev => ({
        ...prev,
        processedGroups: Math.min(importReport.validRows, Math.round((currentPct / 100) * importReport.validRows)),
        createdUnits: Math.round((currentPct / 100) * createdCount),
        skippedDuplicates: Math.round((currentPct / 100) * skippedCount)
      }));

      // Small async sleep to prevent visual freeze
      await new Promise(r => setTimeout(r, 80));
    }

    // Finalize batch log
    await importBatchRepository.update(batchId, {
      status: 'Tamamlandı',
      createdUnits: createdCount,
      skippedDuplicates: skippedCount,
      completedAt: new Date().toISOString()
    });

    setImportStats({
      processedGroups: importReport.validRows,
      createdUnits: createdCount,
      skippedDuplicates: skippedCount,
      errorsCount: importReport.invalidRows
    });

    setLoading(false);
    onSuccess();
  };

  // Helper to trigger failed rows download as a .txt log file
  const downloadErrorLog = () => {
    if (!importReport || importReport.invalidList.length === 0) return;
    
    let content = `OUTDOORCORE AI - IMPORT ERROR REPORT\n`;
    content += `Tarih: ${new Date().toLocaleString('tr-TR')}\n`;
    content += `Dosya: ${file?.name || ''}\n`;
    content += `Toplam Hatalı Satır: ${importReport.invalidList.length}\n`;
    content += `==========================================\n\n`;

    importReport.invalidList.forEach(err => {
      content += `Satır No: ${err.rowNum}\n`;
      content += `Alan Adı: ${err.name}\n`;
      content += `Hata Nedeni: ${err.reason}\n`;
      content += `Satır Verisi: ${JSON.stringify(err.rowData)}\n`;
      content += `------------------------------------------\n`;
    });

    const blob = new Blob([content], { type: 'text/plain;charset=utf-8' });
    const url = URL.createObjectURL(blob);
    const link = document.createElement('a');
    link.href = url;
    link.download = `import_hatalari_${file?.name.replace(/\.[^/.]+$/, '')}.txt`;
    link.click();
    URL.revokeObjectURL(url);
  };

  const handleReset = () => {
    setFile(null);
    setExcelData([]);
    setImportReport(null);
    setProgress(0);
    setImportStats({
      processedGroups: 0,
      createdUnits: 0,
      skippedDuplicates: 0,
      errorsCount: 0
    });
    setStep(1);
  };

  return (
    <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-sm" onClick={loading ? undefined : onClose} />

      {/* Modal Box */}
      <div className="w-full max-w-4xl bg-[#090f1d] border border-white/10 rounded-3xl shadow-2xl flex flex-col max-h-[85vh] overflow-hidden z-20 text-left">
        {/* Header */}
        <div className="flex justify-between items-center px-6 py-4.5 border-b border-white/5 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-blue-500/10 border border-blue-500/20 text-blue-400 flex items-center justify-center">
              <FileSpreadsheet size={15} />
            </div>
            <div>
              <h3 className="text-xs font-black text-white uppercase tracking-widest">Excel envanter yükleme portalı</h3>
              <span className="text-[8.5px] text-slate-500 font-extrabold uppercase tracking-wide">Outdoor envanter kaynak dosyası import sihirbazı</span>
            </div>
          </div>
          <button 
            onClick={loading ? undefined : onClose} 
            disabled={loading}
            className="p-1.5 text-slate-400 hover:text-white transition-colors cursor-pointer bg-white/3 hover:bg-white/7 border border-white/5 rounded-xl disabled:opacity-40"
          >
            <X size={14} />
          </button>
        </div>

        {/* Content Body */}
        <div className="flex-1 overflow-y-auto p-6 scrollbar-thin">
          
          {/* STEP 1: File Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div 
                onDragOver={handleDragOver}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-white/8 hover:border-blue-500/50 hover:bg-blue-500/2 transition-all duration-200 rounded-2xl py-12 flex flex-col items-center justify-center gap-3 cursor-pointer text-center select-none"
              >
                <UploadCloud size={32} className="text-blue-500 animate-pulse" />
                <div className="space-y-1">
                  <p className="text-[10px] font-black text-white uppercase tracking-wider">Excel dosyasını sürükleyin veya göz atın</p>
                  <p className="text-[8px] text-slate-500 font-extrabold uppercase tracking-widest">Desteklenen formatlar: .XLSX, .XLS (Maks. 20MB)</p>
                </div>
                <input 
                  type="file" 
                  ref={fileInputRef}
                  onChange={handleFileChange}
                  accept=".xlsx, .xls"
                  className="hidden"
                />
              </div>

              {loading && (
                <div className="flex flex-col items-center justify-center py-6 text-center space-y-2">
                  <div className="w-6 h-6 border-2 border-blue-500 border-t-transparent rounded-full animate-spin" />
                  <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest animate-pulse">Excel dosyası çözümleniyor...</span>
                </div>
              )}
            </div>
          )}

          {/* STEP 2: Preview & Validation */}
          {step === 2 && importReport && (
            <div className="space-y-6">
              {/* Summary Cards */}
              <div className="grid grid-cols-2 md:grid-cols-5 gap-3.5 select-none">
                <div className="bg-white/2 border border-white/5 p-3 rounded-2xl text-left space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-[8px]">Excel Satır</span>
                  <span className="text-sm font-black text-white">{importReport.totalRows}</span>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-2xl text-left space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-[8px]">Oluşacak Tekil Alan</span>
                  <span className="text-sm font-black text-emerald-450">{importReport.totalUnits}</span>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-2xl text-left space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-[8px]">Geçerli / Hatalı</span>
                  <span className="text-sm font-black text-white">
                    {importReport.validRows} <span className="text-[9px] font-normal text-slate-500">/</span> <span className="text-rose-500">{importReport.invalidRows}</span>
                  </span>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-2xl text-left space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-[8px]">Mükerrer Alan</span>
                  <span className="text-sm font-black text-amber-450">{importReport.duplicateUnits}</span>
                </div>
                <div className="bg-white/2 border border-white/5 p-3 rounded-2xl text-left space-y-1">
                  <span className="text-slate-500 font-bold block uppercase text-[8px]">Dijital / Statik / Diğer</span>
                  <span className="text-sm font-black text-white">
                    {importReport.digitalCount} <span className="text-[9px] text-slate-500">/</span> {importReport.staticCount} <span className="text-[9px] text-slate-500">/</span> {importReport.otherCount}
                  </span>
                </div>
              </div>

              {/* Warnings alert */}
              {(importReport.invalidRows > 0 || importReport.duplicateUnits > 0 || importReport.unclassifiedCount > 0) && (
                <div className="p-3.5 bg-amber-500/5 border border-amber-500/15 rounded-2xl flex items-start gap-3 text-left">
                  <AlertTriangle className="text-amber-500 shrink-0 mt-0.5" size={14} />
                  <div className="space-y-1 text-[9.5px]">
                    <span className="font-extrabold text-amber-400 block uppercase tracking-wider">Doğrulama Uyarıları Bulundu</span>
                    <ul className="list-disc pl-4 text-slate-350 space-y-0.5">
                      {importReport.invalidRows > 0 && (
                        <li><strong className="text-rose-450">{importReport.invalidRows} satırda hata bulundu.</strong> Bu satırlar içe aktarılmayacaktır.</li>
                      )}
                      {importReport.duplicateUnits > 0 && (
                        <li><strong>{importReport.duplicateUnits} reklam ünitesi sistemde zaten mevcut.</strong> Bu üniteler atlanacaktır (mükerrer koruması).</li>
                      )}
                      {importReport.unclassifiedCount > 0 && (
                        <li>{importReport.unclassifiedCount} ünitenin medya sınıflandırması belirlenemedi ("Diğer" olarak atanacaktır).</li>
                      )}
                      <li>Tüm {importReport.totalUnits} yeni kaydın varsayılan başlangıç fiyatı <strong>₺0</strong> olarak atanacaktır.</li>
                    </ul>
                  </div>
                </div>
              )}

              {/* Preview Table */}
              <div className="space-y-2">
                <span className="text-[8.5px] font-black text-slate-500 uppercase tracking-widest block">ÖN İZLEME TABLOSU (İLK 15 BİRİM)</span>
                <div className="bg-slate-950/40 rounded-2xl border border-white/5 overflow-hidden">
                  <Table
                    headers={['Excel Satır', 'Alan Grubu Adı', 'Terminal', 'Ölçü', 'Ekran Türü', 'Medya Sınıfı', 'Oluşacak Tekil', 'Mükerrer?', 'Not / Uyarı']}
                  >
                    {importReport.parsedUnits.slice(0, 15).map((item, index) => (
                      <TableRow key={index} className="border-b border-white/3">
                        <TableCell className="font-bold text-slate-500 text-[9px]">#{item.sourceRow}</TableCell>
                        <TableCell className="font-extrabold text-white text-[9.5px] max-w-[150px] truncate" title={item.groupName}>
                          {item.groupName}
                        </TableCell>
                        <TableCell className="text-slate-400 font-bold text-[9px]">{item.terminal}</TableCell>
                        <TableCell className="text-slate-400 font-bold text-[9px]">{item.dimensions}</TableCell>
                        <TableCell className="text-slate-450 font-bold text-[9px]">{item.screenType || '-'}</TableCell>
                        <TableCell>
                          <Badge variant={item.mediaType === 'Dijital' ? 'info' : (item.mediaType === 'Statik' ? 'warning' : 'muted')} className="text-[8px]">
                            {item.mediaType}
                          </Badge>
                        </TableCell>
                        <TableCell className="font-extrabold text-white text-[9px]">
                          {item.displayIndex} <span className="text-[8px] text-slate-500 font-normal">/ {item.unitIndex}</span>
                        </TableCell>
                        <TableCell>
                          {item.isDuplicate ? (
                            <Badge variant="warning" className="text-[7.5px] bg-amber-500/10 text-amber-400">Atlanacak</Badge>
                          ) : (
                            <Badge variant="success" className="text-[7.5px] bg-emerald-500/10 text-emerald-400">Yeni Ünite</Badge>
                          )}
                        </TableCell>
                        <TableCell className="text-[9px] font-bold max-w-[150px] truncate">
                          {item.isDuplicate ? (
                            <span className="text-amber-400">Mükerrer Kayıt</span>
                          ) : item.isFallbackUsed ? (
                            <span className="text-amber-500">{item.warningReason}</span>
                          ) : (
                            <span className="text-slate-500">Hazır</span>
                          )}
                        </TableCell>
                      </TableRow>
                    ))}
                  </Table>
                  {importReport.parsedUnits.length > 15 && (
                    <div className="p-3 text-center text-slate-500 text-[8.5px] font-black uppercase tracking-wider bg-slate-950/20">
                      Ön izleme için ilk 15 birim listelenmiştir. Toplam {importReport.parsedUnits.length} birim işlenecektir.
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}

          {/* STEP 3: Progress & Finish */}
          {step === 3 && (
            <div className="py-8 space-y-6 flex flex-col items-center justify-center text-center">
              {loading ? (
                // Loading / Progress Indicator
                <div className="space-y-6 w-full max-w-md">
                  <div className="w-10 h-10 border-3 border-blue-500 border-t-transparent rounded-full animate-spin mx-auto" />
                  
                  <div className="space-y-2">
                    <h4 className="text-[10px] font-black text-white uppercase tracking-widest animate-pulse">Envanter içe aktarılıyor...</h4>
                    <span className="text-[8.5px] text-slate-500 font-bold uppercase tracking-wider block">Veriler lokal veri ambarına chunklar halinde yazılıyor</span>
                  </div>

                  {/* Progress Bar */}
                  <div className="space-y-1.5 pt-2">
                    <div className="flex justify-between text-[8px] font-black uppercase text-slate-400">
                      <span>İşleniyor: {importStats.processedGroups} satır</span>
                      <span>%{progress}</span>
                    </div>
                    <div className="w-full bg-slate-950 h-2.5 rounded-full overflow-hidden border border-white/5">
                      <div 
                        className="bg-gradient-to-r from-blue-500 to-indigo-500 h-full rounded-full transition-all duration-300"
                        style={{ width: `${progress}%` }}
                      />
                    </div>
                  </div>

                  <div className="grid grid-cols-3 gap-4 pt-4 border-t border-white/5 text-[9px] font-bold uppercase">
                    <div>
                      <span className="text-slate-500 block text-[7.5px]">Oluşturulan</span>
                      <span className="text-white font-extrabold text-sm">{importStats.createdUnits}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[7.5px]">Atlanan</span>
                      <span className="text-amber-500 font-extrabold text-sm">{importStats.skippedDuplicates}</span>
                    </div>
                    <div>
                      <span className="text-slate-500 block text-[7.5px]">Hatalı</span>
                      <span className="text-rose-500 font-extrabold text-sm">{importStats.errorsCount}</span>
                    </div>
                  </div>
                </div>
              ) : (
                // Success Finish View
                <div className="space-y-6 w-full max-w-lg">
                  <CheckCircle size={44} className="text-emerald-500 mx-auto animate-bounce animate-duration-1000" />
                  
                  <div className="space-y-1">
                    <h3 className="text-xs font-black text-white uppercase tracking-widest">Excel envanter importu başarıyla tamamlandı</h3>
                    <p className="text-[9px] text-slate-500 font-bold uppercase tracking-wider">MGA reklam alanları gerçek envantere kaydedildi</p>
                  </div>

                  {/* Summary Box */}
                  <div className="p-4 bg-slate-950/40 border border-white/5 rounded-2xl text-left space-y-3.5">
                    <span className="text-[8px] font-black text-slate-500 uppercase tracking-widest block border-b border-white/5 pb-1.5">İŞLEM RAPORU</span>
                    <div className="grid grid-cols-2 gap-y-3 gap-x-4 text-[9.5px]">
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold">İşlenen Kaynak Satırı:</span>
                        <span className="text-white font-extrabold">{importStats.processedGroups + importStats.errorsCount} Satır</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold">Oluşturulan Tekil Alan:</span>
                        <span className="text-emerald-450 font-black">+{importStats.createdUnits} Yeni Alan</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold">Atlanan Mükerrer:</span>
                        <span className="text-amber-450 font-extrabold">{importStats.skippedDuplicates} Alan</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-slate-400 font-bold">Hatalı / Aktarılmayan:</span>
                        <span className="text-rose-500 font-extrabold">{importStats.errorsCount} Satır</span>
                      </div>
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex flex-col sm:flex-row justify-center gap-3.5 pt-4">
                    <Button 
                      variant="primary" 
                      onClick={() => { onClose(); }}
                      className="bg-blue-600 hover:bg-blue-700 font-black text-[9.5px] uppercase tracking-wider cursor-pointer h-10.5 px-6"
                    >
                      Reklam Alanlarını Görüntüle
                    </Button>
                    
                    {importStats.errorsCount > 0 && (
                      <Button 
                        variant="outline" 
                        leftIcon={<Download size={12} />}
                        onClick={downloadErrorLog}
                        className="border-rose-500/20 hover:bg-rose-500/5 text-rose-400 font-black text-[9.5px] uppercase tracking-wider cursor-pointer h-10.5 px-6"
                      >
                        Hatalı Satırları İndir
                      </Button>
                    )}

                    <Button 
                      variant="ghost" 
                      leftIcon={<RefreshCw size={11} />}
                      onClick={handleReset}
                      className="text-slate-400 hover:text-white font-black text-[9.5px] uppercase tracking-wider cursor-pointer h-10.5 px-6"
                    >
                      Yeni Dosya Yükle
                    </Button>
                  </div>
                </div>
              )}
            </div>
          )}

        </div>

        {/* Footer */}
        {step !== 3 && (
          <div className="px-6 py-4 border-t border-white/5 shrink-0 flex justify-between items-center select-none bg-slate-950/20">
            {step === 1 ? (
              <span className="text-[8.5px] text-slate-500 font-extrabold uppercase tracking-wide">
                Lütfen dosyayı seçerek import işlemini başlatın.
              </span>
            ) : (
              <Button 
                variant="ghost" 
                onClick={handleReset}
                className="text-slate-400 hover:text-white text-[9.5px] uppercase font-bold"
              >
                Geri Dön
              </Button>
            )}

            {step === 2 && importReport && (
              <Button 
                variant="primary"
                onClick={handleStartImport}
                leftIcon={<Play size={11} />}
                className="bg-emerald-600 hover:bg-emerald-700 text-white font-black text-[9.5px] uppercase tracking-wider cursor-pointer"
              >
                Envanteri İçe Aktar
              </Button>
            )}
          </div>
        )}

      </div>
    </div>
  );
}
