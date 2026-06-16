"use client";

import React, { useCallback, useEffect, useState } from "react";
import { FileText, Loader2, Sparkles } from "lucide-react";
import { documentService } from "@/api/services/document";
import { Document } from "@/types";
import { DocumentUpload } from "@/components/document-upload";
import { DocumentCard } from "@/components/document-card";
import { toast } from "react-hot-toast";

export default function DashboardPage() {
  const [documents, setDocuments] = useState<Document[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isUploading, setIsUploading] = useState(false);

  const fetchDocuments = useCallback(async () => {
    try {
      const docs = await documentService.list();
      setDocuments(docs);
    } catch {
      setDocuments([]);
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    let isMounted = true;

    documentService
      .list()
      .then((docs) => {
        if (isMounted) {
          setDocuments(docs);
        }
      })
      .catch(() => {
        if (isMounted) {
          setDocuments([]);
        }
      })
      .finally(() => {
        if (isMounted) {
          setIsLoading(false);
        }
      });

    return () => {
      isMounted = false;
    };
  }, []);

  const handleUpload = async (file: File) => {
    setIsUploading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      await documentService.upload(formData);
      toast.success(`${file.name} uploaded successfully`);
      await fetchDocuments();
    } finally {
      setIsUploading(false);
    }
  };

  const handleDelete = async (id: string | number) => {
    await documentService.delete(id);
    toast.success("Document deleted");
    setDocuments((prev) => prev.filter((d) => d.id !== id));
  };

  return (
    <div className="max-w-7xl mx-auto px-6 py-10">
      <div className="mb-10">
        <div className="flex items-center gap-2 mb-3">
          <Sparkles className="w-4 h-4 text-indigo-400" />
          <span className="text-xs font-display uppercase tracking-widest text-indigo-400">
            Your Vault
          </span>
        </div>
        <h1 className="font-serif text-4xl md:text-5xl text-white tracking-tight mb-3">
          Document Library
        </h1>
        <p className="text-slate-400 font-sans max-w-xl">
          Upload PDFs, vectorize them instantly, and chat with your knowledge
          base using semantic search.
        </p>
      </div>

      <div className="mb-12">
        <DocumentUpload onUpload={handleUpload} isUploading={isUploading} />
      </div>

      <div>
        <div className="flex items-center justify-between mb-6">
          <h2 className="font-display text-sm uppercase tracking-widest text-slate-400 flex items-center gap-2">
            <FileText size={16} />
            {documents.length} Document{documents.length !== 1 ? "s" : ""}
          </h2>
        </div>

        {isLoading ? (
          <div className="flex flex-col items-center justify-center py-20 gap-3">
            <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
            <p className="text-slate-400 text-sm">Loading your documents...</p>
          </div>
        ) : documents.length === 0 ? (
          <div className="text-center py-16 glass-soft rounded-3xl">
            <FileText className="w-12 h-12 text-slate-600 mx-auto mb-4" />
            <p className="text-slate-400 font-sans">
              No documents yet. Upload your first PDF above.
            </p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {documents.map((doc) => (
              <DocumentCard
                key={doc.id}
                document={doc}
                onDelete={handleDelete}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
