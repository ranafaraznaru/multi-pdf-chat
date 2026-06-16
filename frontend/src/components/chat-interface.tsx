"use client";

import React, { useEffect, useRef, useState } from "react";
import { ArrowLeft, BookOpen, Loader2 } from "lucide-react";
import Link from "next/link";
import { chatService } from "@/api/services/chat";
import { ChatResponse, Message, Source } from "@/types";
import { ChatMessage } from "@/components/chat-message";
import { VibeInput } from "@/components/vibe-input";
import { GlassPanel } from "@/components/glass-panel";

interface ChatInterfaceProps {
  docId: string;
  docName: string;
}

export function ChatInterface({ docId, docName }: ChatInterfaceProps) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [sources, setSources] = useState<Source[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);
  const [isQuerying, setIsQuerying] = useState(false);
  const [showSources, setShowSources] = useState(false);
  const scrollRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const loadHistory = async () => {
      try {
        const history = await chatService.getHistory(docId);
        setMessages(history);
      } catch {
        setMessages([]);
      } finally {
        setIsLoadingHistory(false);
      }
    };
    void loadHistory();
  }, [docId]);

  useEffect(() => {
    scrollRef.current?.scrollTo({
      top: scrollRef.current.scrollHeight,
      behavior: "smooth",
    });
  }, [messages, isQuerying]);

  const handleSend = async (text: string) => {
    const userMessage: Message = { role: "user", content: text };
    setMessages((prev) => [...prev, userMessage]);
    setIsQuerying(true);

    try {
      const response: ChatResponse = await chatService.query(docId, text);
      setMessages((prev) => [
        ...prev,
        { role: "assistant", content: response.answer },
      ]);
      setSources(response.sources);
      setShowSources(response.sources.length > 0);
    } catch {
      setMessages((prev) => prev.slice(0, -1));
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto px-6 py-8 flex flex-col h-[calc(100vh-73px)]">
      <div className="mb-6 flex items-center gap-4">
        <Link
          href="/dashboard"
          className="p-2 rounded-xl glass-soft text-slate-400 hover:text-white hover:bg-white/10 transition-all duration-300"
        >
          <ArrowLeft size={20} />
        </Link>
        <div className="min-w-0">
          <p className="text-xs font-display uppercase tracking-widest text-indigo-400 mb-1">
            Document Chat
          </p>
          <h1 className="font-serif text-2xl text-white truncate">{docName}</h1>
        </div>
      </div>

      <div className="flex-1 flex flex-col gap-4 min-h-0">
        <GlassPanel
          variant="strong"
          className="flex-1 rounded-3xl overflow-hidden flex flex-col min-h-0"
        >
          <div ref={scrollRef} className="flex-1 overflow-y-auto p-6 space-y-6">
            {isLoadingHistory ? (
              <div className="flex flex-col items-center justify-center h-full gap-3">
                <Loader2 className="w-6 h-6 text-indigo-400 animate-spin" />
                <p className="text-slate-400 text-sm">
                  Loading conversation...
                </p>
              </div>
            ) : messages.length === 0 ? (
              <div className="flex flex-col items-center justify-center h-full text-center px-4">
                <div className="w-14 h-14 rounded-2xl bg-indigo-600/20 flex items-center justify-center mb-4">
                  <BookOpen className="w-7 h-7 text-indigo-400" />
                </div>
                <h2 className="font-serif text-xl text-white mb-2">
                  Start a conversation
                </h2>
                <p className="text-slate-400 text-sm max-w-sm">
                  Ask anything about &ldquo;{docName}&rdquo;. Answers are
                  grounded in your document&apos;s content.
                </p>
              </div>
            ) : (
              messages.map((msg, i) => (
                <ChatMessage
                  key={`${msg.role}-${i}-${msg.content.slice(0, 20)}`}
                  message={msg}
                />
              ))
            )}

            {isQuerying && (
              <div className="flex gap-3 animate-slide-up">
                <div className="w-9 h-9 rounded-xl bg-white/10 flex items-center justify-center">
                  <Loader2 size={16} className="text-indigo-400 animate-spin" />
                </div>
                <div className="glass-soft rounded-2xl rounded-tl-sm px-4 py-3">
                  <div className="flex gap-1">
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:0ms]" />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:150ms]" />
                    <span className="w-2 h-2 bg-indigo-400 rounded-full animate-bounce [animation-delay:300ms]" />
                  </div>
                </div>
              </div>
            )}
          </div>
        </GlassPanel>

        {showSources && sources.length > 0 && (
          <GlassPanel
            variant="soft"
            className="rounded-2xl p-4 animate-slide-down"
          >
            <button
              onClick={() => setShowSources((prev) => !prev)}
              className="w-full flex items-center justify-between text-left"
            >
              <span className="text-xs font-display uppercase tracking-widest text-indigo-400">
                Sources ({sources.length})
              </span>
            </button>
            <div className="mt-3 space-y-2 max-h-32 overflow-y-auto">
              {sources.map((source, i) => (
                <div
                  key={i}
                  className="text-xs text-slate-400 border-l-2 border-indigo-500/50 pl-3 py-1"
                >
                  <span className="text-indigo-300 font-display">
                    Page {source.page}
                  </span>
                  <span className="text-slate-600 mx-2">·</span>
                  <span className="text-slate-500">
                    Score {(source.score * 100).toFixed(0)}%
                  </span>
                  <p className="text-slate-400 mt-1 line-clamp-2">
                    {source.text}
                  </p>
                </div>
              ))}
            </div>
          </GlassPanel>
        )}

        <VibeInput
          onSend={handleSend}
          disabled={isQuerying}
          isLoading={isQuerying}
          placeholder={`Ask about ${docName}...`}
          showAttach={false}
        />
      </div>
    </div>
  );
}
