import React, { useState, useRef } from 'react';
import { Send, Mic, Keyboard } from 'lucide-react';

interface CopilotInputProps {
  onSend: (text: string) => void;
  placeholder?: string;
  disabled?: boolean;
}

export function CopilotInput({ onSend, placeholder = "OutdoorCore AI'ye sorun...", disabled = false }: CopilotInputProps) {
  const [query, setQuery] = useState('');
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (query.trim() && !disabled) {
      onSend(query.trim());
      setQuery('');
      if (textareaRef.current) {
        textareaRef.current.style.height = 'auto';
      }
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    setQuery(e.target.value);
    // Auto grow height
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = `${Math.min(textareaRef.current.scrollHeight, 120)}px`;
    }
  };

  const handleMicClick = () => {
    const speechPrompts = [
      "Samsung için boş premium alanları göster",
      "THY sözleşmesi ne zaman bitiyor?",
      "Bu ay tahsilat riski olan firmaları göster",
      "Bugün ne yapmam gerekiyor?"
    ];
    // Pick a random speech text to simulate microphone input
    const randomPrompt = speechPrompts[Math.floor(Math.random() * speechPrompts.length)];
    setQuery(randomPrompt);
    if (textareaRef.current) {
      textareaRef.current.focus();
    }
    alert(`[Simüle Edildi] Sesli komut algılandı: "${randomPrompt}"`);
  };

  return (
    <form onSubmit={handleSubmit} className="relative dark-glass-card border border-white/5 rounded-2xl p-2.5 flex items-end gap-2.5">
      {/* Mic Input Indicator Icon */}
      <button
        type="button"
        onClick={handleMicClick}
        disabled={disabled}
        className="w-9 h-9 shrink-0 rounded-xl bg-white/5 border border-white/5 flex items-center justify-center text-slate-400 hover:text-white hover:bg-white/10 transition-all cursor-pointer disabled:opacity-50"
        title="Sesli Komut Gir (Simüle)"
      >
        <Mic size={14} />
      </button>

      {/* Main Textarea */}
      <textarea
        ref={textareaRef}
        rows={1}
        value={query}
        onChange={handleInputChange}
        onKeyDown={handleKeyDown}
        placeholder={placeholder}
        disabled={disabled}
        className="flex-1 bg-transparent border-0 text-[10px] font-semibold text-white placeholder-slate-500 focus:ring-0 focus:outline-none resize-none no-scrollbar py-2 max-h-[120px]"
      />

      {/* Keyboard Shortcuts marker & Send button */}
      <div className="flex items-center gap-2">
        <span className="hidden sm:flex items-center gap-1 text-[8.5px] text-slate-550 font-bold uppercase tracking-wider select-none shrink-0 pr-1.5">
          <Keyboard size={10} />
          <span>Enter</span>
        </span>
        <button
          type="submit"
          disabled={!query.trim() || disabled}
          className="w-9 h-9 shrink-0 rounded-xl bg-blue-500 hover:bg-blue-600 disabled:bg-white/5 disabled:text-slate-500 text-white flex items-center justify-center transition-all cursor-pointer shadow shadow-blue-500/10"
        >
          <Send size={12} />
        </button>
      </div>
    </form>
  );
}
