"use client";

import React from "react";
import { Message } from "@/types";
import { Bot, User } from "lucide-react";

interface ChatMessageProps {
  message: Message;
}

export function ChatMessage({ message }: ChatMessageProps) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 animate-slide-up ${isUser ? "flex-row-reverse" : ""}`}
    >
      <div
        className={`w-9 h-9 rounded-xl flex items-center justify-center shrink-0 ${
          isUser
            ? "bg-indigo-600 text-white"
            : "bg-white/10 text-indigo-300 border border-white/10"
        }`}
      >
        {isUser ? <User size={16} /> : <Bot size={16} />}
      </div>

      <div
        className={`max-w-[80%] rounded-2xl px-4 py-3 ${
          isUser
            ? "bg-indigo-600 text-white rounded-tr-sm"
            : "glass-strong text-slate-200 rounded-tl-sm"
        }`}
      >
        <p className="text-sm leading-relaxed whitespace-pre-wrap font-sans">
          {message.content}
        </p>
        {message.created_at && (
          <p
            className={`text-[10px] mt-2 font-display tracking-wide ${
              isUser ? "text-indigo-200" : "text-slate-500"
            }`}
          >
            {new Date(message.created_at).toLocaleString()}
          </p>
        )}
      </div>
    </div>
  );
}
