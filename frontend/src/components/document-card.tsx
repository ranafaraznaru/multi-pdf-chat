"use client";

import React, { useState } from "react";
import Link from "next/link";
import {
  FileText,
  Loader2,
  MessageSquare,
  Trash2,
  ExternalLink,
} from "lucide-react";
import { Document } from "@/types";
import { GlassPanel } from "@/components/glass-panel";

interface DocumentCardProps {
  document: Document;
  onDelete: (id: string | number) => Promise<void>;
}

const statusStyles: Record<Document["status"], string> = {
  completed: "bg-emerald-500/20 text-emerald-400 border-emerald-500/30",
  processing: "bg-amber-500/20 text-amber-400 border-amber-500/30",
  failed: "bg-red-500/20 text-red-400 border-red-500/30",
};

export function DocumentCard({ document, onDelete }: DocumentCardProps) {
  const [isDeleting, setIsDeleting] = useState(false);
  const [confirmDelete, setConfirmDelete] = useState(false);

  const handleDelete = async () => {
    if (!confirmDelete) {
      setConfirmDelete(true);
      return;
    }
    setIsDeleting(true);
    try {
      await onDelete(document.id);
    } finally {
      setIsDeleting(false);
      setConfirmDelete(false);
    }
  };

  return (
    <GlassPanel
      variant="strong"
      className="rounded-2xl p-6 flex flex-col gap-5 group hover:border-indigo-500/30 transition-all duration-500"
    >
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-start gap-3 min-w-0">
          <div className="w-11 h-11 rounded-xl bg-indigo-600/20 flex items-center justify-center shrink-0">
            <FileText className="w-5 h-5 text-indigo-400" />
          </div>
          <div className="min-w-0">
            <h3 className="text-white font-medium truncate" title={document.file_name}>
              {document.file_name}
            </h3>
            <p className="text-slate-400 text-xs mt-1 font-display tracking-wide">
              {document.total_pages} page{document.total_pages !== 1 ? "s" : ""}
            </p>
          </div>
        </div>
        <span
          className={`shrink-0 px-2.5 py-1 rounded-full text-[10px] font-display uppercase tracking-widest border ${statusStyles[document.status]}`}
        >
          {document.status}
        </span>
      </div>

      <div className="flex items-center gap-2 mt-auto">
        <Link
          href={`/dashboard/${document.id}`}
          className="flex-1 flex items-center justify-center gap-2 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-sm font-semibold transition-all duration-300 shadow-lg shadow-indigo-500/20"
        >
          <MessageSquare size={16} />
          Chat
        </Link>
        <a
          href={document.url}
          target="_blank"
          rel="noopener noreferrer"
          className="p-2.5 rounded-xl glass-soft text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300"
          title="Open PDF"
        >
          <ExternalLink size={16} />
        </a>
        <button
          onClick={handleDelete}
          disabled={isDeleting}
          className={`p-2.5 rounded-xl transition-all duration-300 ${
            confirmDelete
              ? "bg-red-600 text-white hover:bg-red-700"
              : "glass-soft text-slate-400 hover:text-red-400 hover:bg-red-500/10"
          }`}
          title={confirmDelete ? "Confirm delete" : "Delete document"}
        >
          {isDeleting ? (
            <Loader2 size={16} className="animate-spin" />
          ) : (
            <Trash2 size={16} />
          )}
        </button>
      </div>

      {confirmDelete && !isDeleting && (
        <p className="text-red-400 text-xs text-center animate-slide-down">
          Click delete again to confirm
        </p>
      )}
    </GlassPanel>
  );
}
