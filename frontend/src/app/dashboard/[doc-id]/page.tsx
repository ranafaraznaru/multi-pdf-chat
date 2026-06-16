"use client";

import React, { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { Loader2 } from "lucide-react";
import { documentService } from "@/api/services/document";
import { ChatInterface } from "@/components/chat-interface";
export default function DocumentChatPage() {
  const params = useParams();
  const router = useRouter();
  const docId = params["doc-id"] as string;
  const [docName, setDocName] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadDocument = async () => {
      try {
        const docs = await documentService.list();
        const doc = docs.find((d) => String(d.id) === docId);
        if (!doc) {
          router.replace("/dashboard");
          return;
        }
        setDocName(doc.file_name);
      } catch {
        router.replace("/dashboard");
      } finally {
        setIsLoading(false);
      }
    };
    void loadDocument();
  }, [docId, router]);

  if (isLoading) {
    return (
      <div className="flex flex-col items-center justify-center h-[calc(100vh-73px)] gap-3">
        <Loader2 className="w-8 h-8 text-indigo-400 animate-spin" />
        <p className="text-slate-400 text-sm">Loading document...</p>
      </div>
    );
  }

  return <ChatInterface docId={docId} docName={docName} />;
}
