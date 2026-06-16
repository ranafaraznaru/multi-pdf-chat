"use client";

import React, { useState } from 'react';
import { ArrowUp, Paperclip } from 'lucide-react';

interface VibeInputProps {
  onSend: (text: string) => void;
  onAttach?: (file: File) => void;
}

export const VibeInput: React.FC<VibeInputProps> = ({ onSend, onAttach }) => {
  const [text, setText] = useState('');

  const handleSend = () => {
    if (!text.trim()) return;
    onSend(text);
    setText('');
  };

  return (
    <div className="relative group w-full max-w-3xl mx-auto">
      {/* The Glow Effect */}
      <div className="absolute -inset-1 bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500 rounded-2xl blur-lg opacity-30 group-hover:opacity-60 transition-opacity duration-300"></div>

      {/* Main Container */}
      <div className="relative bg-white rounded-2xl p-4 shadow-2xl flex flex-col gap-3">
        <textarea
          className="w-full resize-none border-none focus:ring-0 text-xl text-slate-900 placeholder-slate-400 px-2 py-1 min-h-[100px]"
          placeholder="Ask anything about your documents..."
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === 'Enter' && !e.shiftKey) {
              e.preventDefault();
              handleSend();
            }
          }}
        />

        <div className="flex items-center justify-between border-t border-slate-100 pt-3">
          <div className="flex gap-2">
            <button
              onClick={() => {
                const input = document.createElement('input');
                input.type = 'file';
                input.onchange = (e: any) => {
                  if (e.target.files[0] && onAttach) onAttach(e.target.files[0]);
                };
                input.click();
              }}
              className="p-2 rounded-lg text-slate-400 hover:text-indigo-600 hover:bg-slate-50 transition-colors"
            >
              <Paperclip size={20} />
            </button>
          </div>

          <button
            onClick={handleSend}
            disabled={!text.trim()}
            className="p-3 rounded-xl bg-indigo-600 text-white hover:bg-indigo-700 disabled:bg-slate-200 disabled:text-slate-400 transition-all shadow-lg shadow-indigo-200"
          >
            <ArrowUp size={20} strokeWidth={3} />
          </button>
        </div>
      </div>
    </div>
  );
};
