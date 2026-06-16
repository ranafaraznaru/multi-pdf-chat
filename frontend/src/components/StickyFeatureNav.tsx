"use client";

import React, { useEffect, useState } from 'react';

interface Feature {
  id: string;
  title: string;
}

interface StickyFeatureNavProps {
  features: Feature[];
}

export const StickyFeatureNav: React.FC<StickyFeatureNavProps> = ({ features }) => {
  const [activeId, setActiveId] = useState<string | null>(null);

  useEffect(() => {
    const observerOptions = {
      root: null,
      rootMargin: '-20% 0px -70% 0px',
      threshold: 0,
    };

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveId(entry.target.id);
        }
      });
    }, observerOptions);

    features.forEach((feature) => {
      const element = document.getElementById(feature.id);
      if (element) observer.observe(element);
    });

    return () => observer.disconnect();
  }, [features]);

  return (
    <nav className="sticky top-20 h-fit py-10 flex flex-col gap-6">
      {features.map((feature) => (
        <a
          key={feature.id}
          href={`#${feature.id}`}
          className={`group relative flex items-center gap-4 transition-all duration-500 ease-in-out ${
            activeId === feature.id
              ? 'text-slate-900 font-bold translate-x-2'
              : 'text-slate-400 font-medium hover:text-slate-600'
          }`}
        >
          <div
            className={`w-1.5 h-1.5 rounded-full bg-black transition-all duration-500 ${
              activeId === feature.id ? 'opacity-100 scale-125' : 'opacity-0'
            }`}
          />
          <span className="text-sm tracking-tight uppercase">{feature.title}</span>
        </a>
      ))}
    </nav>
  );
};
