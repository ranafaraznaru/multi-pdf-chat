"use client";

import React, { useState } from "react";
import { VibeInput } from "@/components/VibeInput";
import { GlassPanel } from "@/components/GlassPanel";
import { StickyFeatureNav } from "@/components/StickyFeatureNav";
import { FAQ } from "@/components/FAQ";
import { Navbar } from "@/components/Navbar";
import { chatService } from "@/api/services/chat";
import { ChatResponse } from "@/types";

const FEATURES = [
  {
    id: "smart-analysis",
    title: "Smart Analysis",
    description:
      "Our AI doesn’t just read; it understands. Using advanced semantic search, we extract the core meaning of your documents, providing answers that are grounded in actual context.",
    visual: " la-dark-block",
  },
  {
    id: "multi-doc-sync",
    title: "Multi-Doc Sync",
    description:
      "Query across multiple PDFs simultaneously. The system synthesizes information from diverse sources to give you a comprehensive overview of your library.",
    visual: "la-blueprint",
  },
  {
    id: "secure-vault",
    title: "Secure Vault",
    description:
      "Enterprise-grade encryption for your private documents. Your data is stored securely and is only accessible to you through authenticated sessions.",
    visual: "la-security",
  },
];

const TESTIMONIALS = [
  {
    name: "Alex Rivers",
    handle: "@arivers_dev",
    quote:
      "The precision of the document retrieval is uncanny. It has completely changed how I handle research papers.",
    avatar: "https://i.pravatar.cc/150?u=alex",
  },
  {
    name: "Sarah Chen",
    handle: "@schen_ai",
    quote:
      "Finally, a PDF tool that actually understands context instead of just keyword matching. Truly premium feel.",
    avatar: "https://i.pravatar.cc/150?u=sarah",
  },
  {
    name: "Marcus Thorne",
    handle: "@mthorne_ops",
    quote:
      "Sleek design and blazing fast responses. The glassmorphic UI is just the cherry on top of a powerful engine.",
    avatar: "https://i.pravatar.cc/150?u=marcus",
  },
];

const FAQS = [
  {
    question: "How does the AI handle large PDFs?",
    answer:
      "We use a recursive character splitter to break documents into optimized chunks, which are then embedded into a high-dimensional vector space for efficient retrieval.",
  },
  {
    question: "Is my data private?",
    answer:
      "Absolutely. Documents are stored in private buckets and vector namespaces are isolated per user to ensure zero leakage between accounts.",
  },
  {
    question: "Which PDF formats are supported?",
    answer:
      "We support all standard PDF versions. For best results, we recommend text-based PDFs rather than scanned images.",
  },
];

export default function LandingPage() {
  const [isQuerying, setIsQuerying] = useState(false);
  const [lastResponse, setLastResponse] = useState<ChatResponse | null>(null);

  const handleSend = async (text: string) => {
    setIsQuerying(true);
    try {
      // Note: Using a hardcoded docId for demo purposes in landing page.
      // In a real flow, this would come from the active document context.
      const response = await chatService.query(1, text);
      setLastResponse(response);
    } catch (e) {
      console.error("Query failed", e);
    } finally {
      setIsQuerying(false);
    }
  };

  return (
    <main className="min-h-screen">
      <Navbar />
      {/* --- HERO SECTION --- */}
      <section className="relative h-[110vh] flex items-center justify-center overflow-hidden">
        <div className="absolute inset-0 z-0">
          <div className="absolute inset-0 bg-slate-900 opacity-80 z-10" />
          <div className="absolute inset-0 bg-gradient-to-b from-transparent to-slate-900 z-20" />
          <img
            src="https://images.unsplash.com/photo-1451187580450-de86905eB085?q=80&w=2070"
            className="w-full h-full object-cover"
            alt="Background"
          />
        </div>

        <div className="relative z-30 text-center px-4 flex flex-col items-center gap-8">
          <div className="px-4 py-1 rounded-full bg-indigo-500/20 border border-indigo-500/30 text-indigo-400 text-xs font-display uppercase tracking-widest">
            <span className="mr-2">✨</span> Now with Multi-PDF Sync
          </div>

          <h1 className="font-serif text-6xl md:text-8xl text-white tracking-tight leading-tight max-w-5xl">
            Understand your{" "}
            <span className="italic text-indigo-400">knowledge</span> <br /> in
            a new dimension.
          </h1>

          <div className="text-slate-300 text-xl md:text-2xl font-sans max-w-2xl animate-typing">
            Experience the next generation of document intelligence.
          </div>

          <VibeInput onSend={handleSend} />

          {lastResponse && (
            <div className="mt-8 p-6 bg-white/10 backdrop-blur-lg border border-white/20 rounded-2xl max-w-2xl text-left animate-in fade-in slide-in-from-bottom-4 duration-500">
              <p className="text-indigo-300 text-xs font-display uppercase tracking-widest mb-2">
                AI Response
              </p>
              <p className="text-white font-sans leading-relaxed">
                {lastResponse.answer}
              </p>
            </div>
          )}
        </div>

        {/* Integration Bar */}
        <div className="absolute bottom-10 left-1/2 -translate-x-1/2 z-30 w-full max-w-4xl px-4">
          <GlassPanel
            variant="soft"
            className="flex items-center justify-between p-4 rounded-2xl overflow-hidden"
          >
            <div className="flex items-center gap-4 px-4">
              <span className="text-xs font-display uppercase tracking-widest text-slate-400">
                Frameworks
              </span>
              <div className="flex gap-4 opacity-60">
                <div className="w-6 h-6 bg-white rounded-full" />
                <div className="w-6 h-6 bg-white rounded-full" />
                <div className="w-6 h-6 bg-white rounded-full" />
              </div>
            </div>
            <div className="h-8 w-px bg-white/10" />
            <div className="flex items-center gap-4 px-4 overflow-hidden w-full max-w-sm">
              <span className="text-xs font-display uppercase tracking-widest text-slate-400 shrink-0">
                Integrations
              </span>
              <div className="flex gap-6 animate-marquee whitespace-nowrap">
                <span className="text-sm text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer">
                  Pinecone
                </span>
                <span className="text-sm text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer">
                  Gemini
                </span>
                <span className="text-sm text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer">
                  Cloudinary
                </span>
                <span className="text-sm text-slate-300 hover:text-indigo-400 transition-colors cursor-pointer">
                  LangChain
                </span>
              </div>
            </div>
          </GlassPanel>
        </div>
      </section>

      {/* --- FEATURE SCROLL-SPY --- */}
      <section className="bg-[#f8f9fa] py-24 px-8 lg:px-20" id="features">
        <div className="max-w-7xl mx-auto flex gap-20">
          <div className="hidden lg:block w-1/4">
            <StickyFeatureNav features={FEATURES} />
          </div>

          <div className="w-full lg:w-3/4 flex flex-col gap-32">
            {FEATURES.map((f) => (
              <div
                key={f.id}
                id={f.id}
                className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center"
              >
                <div className="space-y-6">
                  <h3 className="font-serif text-4xl text-slate-900 tracking-tight">
                    {f.title}
                  </h3>
                  <p className="text-slate-600 text-lg leading-relaxed font-sans">
                    {f.description}
                  </p>
                </div>
                <div className="bg-slate-900 rounded-2xl h-64 w-full overflow-hidden shadow-2xl relative group">
                  <div className="absolute inset-0 bg-indigo-500/10 opacity-0 group-hover:opacity-100 transition-opacity" />
                  <div className="p-6 font-mono text-xs text-indigo-300 overflow-auto h-full">
                    <pre>{`// Intelligence logic for ${f.title}\nconst analyze = (doc) => {\n  return vectorIndex.query({\n    id: doc.id,\n    topK: 4,\n    filter: { user_id: current_user }\n  });\n};`}</pre>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* --- TESTIMONIALS --- */}
      <section className="bg-slate-900 py-24 px-4 overflow-hidden">
        <div className="max-w-7xl mx-auto text-center mb-16">
          <h2 className="font-serif text-5xl text-white tracking-tight">
            Loved by visionaries.
          </h2>
        </div>
        <div className="max-w-7xl mx-auto grid grid-cols-1 md:grid-cols-3 gap-6">
          {TESTIMONIALS.map((t, i) => (
            <GlassPanel
              key={i}
              variant="strong"
              className="p-8 rounded-3xl text-left"
            >
              <p className="text-slate-200 text-sm leading-relaxed mb-8 italic">
                "{t.quote}"
              </p>
              <div className="flex items-center gap-4">
                <img
                  src={t.avatar}
                  className="w-10 h-10 rounded-full border border-white/20"
                  alt={t.name}
                />
                <div className="flex flex-col">
                  <span className="text-white font-medium text-sm">
                    {t.name}
                  </span>
                  <span className="text-slate-400 text-xs">{t.handle}</span>
                </div>
              </div>
            </GlassPanel>
          ))}
        </div>
      </section>

      {/* --- FAQ --- */}
      <section className="bg-white py-24">
        <FAQ items={FAQS} />
      </section>

      {/* --- FOOTER --- */}
      <footer className="bg-slate-900 py-12 border-t border-white/10 text-center">
        <div className="text-slate-500 text-sm font-display tracking-tight">
          &copy; {new Date().getFullYear()} Superdesign. All rights reserved.
        </div>
      </footer>
    </main>
  );
}
