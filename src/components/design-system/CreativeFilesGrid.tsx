import React from 'react';
import { CreativeFile } from '@/data/campaigns';
import { Badge } from './Badge';
import { PlayCircle, Image, FileText, Paperclip } from 'lucide-react';

interface CreativeFilesGridProps {
  files: CreativeFile[];
}

export function CreativeFilesGrid({ files }: CreativeFilesGridProps) {
  const getFileIcon = (type: string) => {
    if (type.includes('Video')) return <PlayCircle size={18} className="text-blue-400" />;
    if (type.includes('Banner') || type.includes('IMG')) return <Image size={18} className="text-emerald-450" />;
    return <FileText size={18} className="text-purple-400" />;
  };

  return (
    <div className="dark-glass-card border border-white/5 rounded-2xl p-5 space-y-4 text-left">
      <div className="flex items-center gap-1.5 pb-2 border-b border-white/5 select-none text-slate-400">
        <Paperclip size={13} />
        <h4 className="text-xs font-black text-white uppercase tracking-wider">Kreatif Dosya Kütüphanesi</h4>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-5 gap-3.5 pt-1">
        {files.map((file, idx) => (
          <div 
            key={idx}
            className="p-3 rounded-2xl bg-white/3 border border-white/5 flex flex-col justify-between h-28 hover:bg-white/5 duration-150 text-center relative group"
          >
            <div className="mx-auto mt-1 shrink-0">{getFileIcon(file.type)}</div>
            <div className="space-y-0.5 my-auto truncate max-w-full px-1">
              <span className="text-[9.5px] font-black text-white block truncate uppercase leading-none">{file.name}</span>
              <span className="text-[7.5px] text-slate-550 font-bold block uppercase tracking-wider mt-1">{file.type}</span>
            </div>
            <div className="mx-auto mb-1 scale-[0.8] origin-bottom shrink-0">
              <Badge variant={file.status === 'Onaylandı' ? 'success' : file.status === 'Revize' ? 'danger' : 'warning'}>
                {file.status}
              </Badge>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
