"use client";

import React, { useState } from 'react';
import { ChevronDown } from 'lucide-react';

interface FAQItem {
  question: string;
  answer: string;
}

interface FAQProps {
  items: FAQItem[];
}

export const FAQ: React.FC<FAQProps> = ({ items }) => {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  return (
    <div className="max-w-4xl mx-auto w-full px-4 py-20">
      <h2 className="text-center font-serif text-5xl mb-12 text-slate-900 tracking-tight">
        Frequently Asked Questions
      </h2>
      <div className="flex flex-col gap-4">
        {items.map((item, index) => (
          <div
            key={index}
            className="bg-[#f3f4f6] rounded-2xl overflow-hidden transition-all duration-300"
          >
            <button
              onClick={() => setOpenIndex(openIndex === index ? null : index)}
              className="w-full p-6 text-left flex justify-between items-center font-sans font-medium text-slate-800 hover:bg-slate-200 transition-colors"
            >
              <span>{item.question}</span>
              <ChevronDown
                className={`transition-transform duration-300 ${openIndex === index ? 'rotate-180' : ''}`}
                size={20}
              />
            </button>
            <div
              className={`overflow-hidden transition-all duration-300 ease-in-out ${
                openIndex === index ? 'max-h-[500px] opacity-100' : 'max-h-0 opacity-0'
              }`}
            >
              <div className="p-6 pt-0 text-slate-600 leading-relaxed">
                {item.answer}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
