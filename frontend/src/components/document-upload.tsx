"use client";

import React, { useRef, useState } from "react";
import { FileUp, Loader2, Upload } from "lucide-react";
import { GlassPanel } from "@/components/glass-panel";
import { toast } from "react-hot-toast";

interface DocumentUploadProps {
  onUpload: (file: File) => Promise<void>;
  isUploading: boolean;
}

export function DocumentUpload({ onUpload, isUploading }: DocumentUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [isDragging, setIsDragging] = useState(false);

  const handleFile = async (file: File) => {
    if (file.type !== "application/pdf") {
      toast.error("Only PDF files are supported");
      return;
    }
    await onUpload(file);
  };

  const onDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file) await handleFile(file);
  };

  return (
    <div
      onDragOver={(e) => {
        e.preventDefault();
        setIsDragging(true);
      }}
      onDragLeave={() => setIsDragging(false)}
      onDrop={onDrop}
    >
    <GlassPanel
      variant="strong"
      className={`rounded-3xl p-8 transition-all duration-500 border-2 border-dashed ${
        isDragging
          ? "border-indigo-400 bg-indigo-500/10"
          : "border-white/10 hover:border-indigo-500/40"
      }`}
    >
      <input
        ref={inputRef}
        type="file"
        accept="application/pdf"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) void handleFile(file);
          e.target.value = "";
        }}
      />

      <div className="flex flex-col items-center text-center gap-4">
        <div className="w-16 h-16 rounded-2xl bg-indigo-600/20 flex items-center justify-center">
          {isUploading ? (
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
          ) : (
            <Upload className="w-8 h-8 text-indigo-400" />
          )}
        </div>

        <div>
          <h3 className="font-serif text-2xl text-white mb-2">
            Upload a document
          </h3>
          <p className="text-slate-400 text-sm font-sans max-w-md">
            Drop your PDF here or browse. We&apos;ll vectorize and index it for
            intelligent chat.
          </p>
        </div>

        <button
          type="button"
          disabled={isUploading}
          onClick={() => inputRef.current?.click()}
          className="flex items-center gap-2 px-6 py-3 bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white rounded-xl font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/20"
        >
          <FileUp size={18} />
          {isUploading ? "Processing..." : "Choose PDF"}
        </button>
      </div>
    </GlassPanel>
    </div>
  );
}
