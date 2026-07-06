import React, { useState, useRef, DragEvent } from 'react';
import { Upload, X, FileText, Film, Image as ImageIcon, CheckCircle, AlertTriangle } from 'lucide-react';
import { storageService } from '@/services/storageService';
import { StorageBucket } from '@/types/storage';
import { Notification } from './Notification';

interface FileUploadProps {
  bucket: StorageBucket;
  onUploadSuccess: (url: string, path: string, file?: File) => void;
  onUploadError?: (error: string) => void;
  allowedTypes?: string[];
  maxSizeOverride?: number; // bytes
  label?: string;
  currentFileUrl?: string;
  onRemove?: () => void;
}

const DEFAULT_ALLOWED_TYPES = [
  'image/png',
  'image/jpeg',
  'image/webp',
  'image/svg+xml',
  'application/pdf',
  'video/mp4'
];

export function FileUpload({
  bucket,
  onUploadSuccess,
  onUploadError,
  allowedTypes = DEFAULT_ALLOWED_TYPES,
  maxSizeOverride,
  label = 'Dosya Yükle',
  currentFileUrl,
  onRemove
}: FileUploadProps) {
  const [dragActive, setDragActive] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);
  const [fileName, setFileName] = useState<string | null>(null);
  
  const fileInputRef = useRef<HTMLInputElement>(null);

  const getLimitDetails = (file: File): { limit: number; label: string } => {
    if (maxSizeOverride) {
      return { limit: maxSizeOverride, label: `${Math.round(maxSizeOverride / (1024 * 1024))} MB` };
    }
    const mime = file.type;
    if (bucket === 'logos') {
      return { limit: 2 * 1024 * 1024, label: '2 MB' };
    }
    if (mime.startsWith('video/')) {
      return { limit: 200 * 1024 * 1024, label: '200 MB' };
    }
    if (mime === 'application/pdf') {
      return { limit: 20 * 1024 * 1024, label: '20 MB' };
    }
    if (mime.startsWith('image/')) {
      return { limit: 10 * 1024 * 1024, label: '10 MB' };
    }
    return { limit: 20 * 1024 * 1024, label: '20 MB' }; // default
  };

  const handleDrag = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true);
    } else if (e.type === "dragleave") {
      setDragActive(false);
    }
  };

  const validateAndUpload = async (file: File) => {
    setError(null);
    setSuccess(false);

    // 1. Type validation
    if (!allowedTypes.includes(file.type)) {
      const errMsg = `Geçersiz dosya türü (${file.type}). Desteklenen formatlar: PNG, JPG, WEBP, SVG, PDF, MP4`;
      setError(errMsg);
      if (onUploadError) onUploadError(errMsg);
      return;
    }

    // 2. Size validation
    const { limit, label: limitLabel } = getLimitDetails(file);
    if (file.size > limit) {
      const errMsg = `Dosya boyutu limitini aşıyor. En fazla ${limitLabel} yükleyebilirsiniz.`;
      setError(errMsg);
      if (onUploadError) onUploadError(errMsg);
      return;
    }

    // Start upload process
    setUploading(true);
    setFileName(file.name);
    setProgress(10);

    // Fake progress simulation
    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 90) {
          clearInterval(interval);
          return 90;
        }
        return prev + 15;
      });
    }, 150);

    // Perform actual upload
    const cleanFileName = `${Date.now()}_${file.name.replace(/[^a-zA-Z0-9.-]/g, '_')}`;
    const filePath = `${cleanFileName}`;
    
    try {
      const result = await storageService.uploadFile(bucket, filePath, file);
      
      clearInterval(interval);
      setProgress(100);

      if (result.success && result.url) {
        setSuccess(true);
        onUploadSuccess(result.url, result.path || filePath, file);
      } else {
        throw new Error(result.error || 'Yükleme başarısız oldu.');
      }
    } catch (err: any) {
      const errMsg = err.message || 'Dosya yüklenirken bir hata oluştu.';
      setError(errMsg);
      if (onUploadError) onUploadError(errMsg);
    } finally {
      setTimeout(() => {
        setUploading(false);
      }, 300);
    }
  };

  const handleDrop = (e: DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      validateAndUpload(e.dataTransfer.files[0]);
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      validateAndUpload(e.target.files[0]);
    }
  };

  const onButtonClick = () => {
    fileInputRef.current?.click();
  };

  const handleRemove = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setFileName(null);
    setSuccess(false);
    setError(null);
    setProgress(0);
    if (onRemove) onRemove();
  };

  // Determine which icon to display for current/uploaded file
  const getFileIcon = (url: string) => {
    if (url.includes('.mp4') || url.startsWith('data:video/')) return <Film className="w-8 h-8 text-blue-500" />;
    if (url.includes('.pdf') || url.startsWith('data:application/pdf')) return <FileText className="w-8 h-8 text-rose-500" />;
    return <ImageIcon className="w-8 h-8 text-indigo-500" />;
  };

  const isImage = (url: string) => {
    const lower = url.toLowerCase();
    return (
      lower.includes('.png') ||
      lower.includes('.jpg') ||
      lower.includes('.jpeg') ||
      lower.includes('.webp') ||
      lower.includes('.svg') ||
      lower.startsWith('data:image/')
    );
  };

  return (
    <div className="space-y-3">
      {label && <label className="text-[10px] font-black text-slate-400 dark:text-slate-500 uppercase tracking-wider block">{label}</label>}

      {error && (
        <Notification
          title="Yükleme Hatası"
          description={error}
          type="alert"
          onClose={() => setError(null)}
        />
      )}

      {/* Main Drag-Drop Area */}
      {!uploading && !success && !currentFileUrl ? (
        <div
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
          onClick={onButtonClick}
          className={`border-2 border-dashed rounded-2xl p-6 flex flex-col items-center justify-center cursor-pointer transition-all duration-200 select-none ${
            dragActive
              ? 'border-indigo-500 bg-indigo-50/10 dark:bg-indigo-950/10'
              : 'border-slate-200 hover:border-slate-350 dark:border-slate-800 dark:hover:border-slate-700 bg-slate-50/30 dark:bg-slate-900/10'
          }`}
        >
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            accept={allowedTypes.join(',')}
            onChange={handleChange}
          />
          <Upload className="w-6 h-6 text-slate-400 dark:text-slate-500 mb-2.5" />
          <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block text-center">
            Dosyayı buraya sürükleyin veya tıklayarak seçin
          </span>
          <span className="text-[10px] font-semibold text-slate-400 dark:text-slate-500 block text-center mt-1 uppercase tracking-wider">
            PNG, JPG, WEBP, PDF veya MP4
          </span>
        </div>
      ) : uploading ? (
        /* Uploading State */
        <div className="border border-slate-100 dark:border-slate-850 bg-slate-50/40 dark:bg-slate-900/30 rounded-2xl p-5 space-y-3 flex flex-col">
          <div className="flex items-center justify-between">
            <span className="text-xs font-black text-slate-850 dark:text-slate-200 truncate uppercase max-w-[80%]">
              {fileName || 'Dosya yükleniyor...'}
            </span>
            <span className="text-xs font-bold text-indigo-600 dark:text-indigo-400">{progress}%</span>
          </div>
          {/* Progress Bar Container */}
          <div className="w-full bg-slate-100 dark:bg-slate-800 rounded-full h-2 overflow-hidden">
            <div 
              className="bg-indigo-600 dark:bg-indigo-500 h-2 rounded-full transition-all duration-150" 
              style={{ width: `${progress}%` }}
            />
          </div>
        </div>
      ) : (
        /* Uploaded/Preview State */
        <div className="border border-slate-150 dark:border-slate-800/80 bg-slate-50/40 dark:bg-slate-900/30 rounded-2xl p-4 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3.5 min-w-0">
            {/* Visual Thumbnail or Icon */}
            <div className="w-12 h-12 rounded-xl bg-slate-100 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-800 flex items-center justify-center shrink-0 overflow-hidden">
              {currentFileUrl && isImage(currentFileUrl) ? (
                <img 
                  src={currentFileUrl} 
                  alt="Preview" 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    // Fallback to file icon if image loading fails
                    e.currentTarget.style.display = 'none';
                    e.currentTarget.parentElement?.appendChild(
                      document.createTextNode('📄')
                    );
                  }}
                />
              ) : (
                getFileIcon(currentFileUrl || fileName || '')
              )}
            </div>

            <div className="min-w-0">
              <span className="text-xs font-black text-slate-850 dark:text-slate-200 block truncate uppercase">
                {fileName || 'Yüklenen Dosya'}
              </span>
              <div className="flex items-center gap-1.5 mt-0.5">
                <CheckCircle size={10} className="text-emerald-500" />
                <span className="text-[10px] font-bold text-emerald-600 dark:text-emerald-400 uppercase tracking-wide">
                  Yüklendi
                </span>
              </div>
            </div>
          </div>

          <button
            type="button"
            onClick={handleRemove}
            className="text-slate-400 hover:text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/20 p-2 rounded-xl transition-all cursor-pointer select-none"
          >
            <X size={15} />
          </button>
        </div>
      )}
    </div>
  );
}
