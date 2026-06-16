"use client";

import React from 'react';

interface GlassPanelProps {
  children: React.ReactNode;
  variant?: 'soft' | 'strong';
  className?: string;
}

export const GlassPanel: React.FC<GlassPanelProps> = ({ children, variant = 'soft', className = '' }) => {
  const styles = variant === 'soft' ? 'glass-soft' : 'glass-strong';
  return (
    <div className={`${styles} ${className}`}>
      {children}
    </div>
  );
};
