'use client';

import { motion } from 'framer-motion';
import type { ReactNode } from 'react';

interface GlassButtonProps {
  href: string;
  children: ReactNode;
}

export default function GlassButton({ href, children }: GlassButtonProps) {
  return (
    <motion.a
      href={href}
      whileHover={{ scale: 1.04, y: -1 }}
      whileTap={{ scale: 0.95 }}
      transition={{ type: 'spring', stiffness: 400, damping: 17 }}
      className="group relative inline-flex items-center gap-3 px-7 py-3.5 rounded-full font-medium text-[15px] text-white/90 cursor-pointer overflow-hidden transition-[border-color,box-shadow] duration-300 ease-out border border-white/[0.15] hover:border-white/[0.35] active:border-white/[0.12]"
      style={{
        background: 'rgba(255,255,255,0.08)',
        backdropFilter: 'blur(40px) saturate(180%)',
        WebkitBackdropFilter: 'blur(40px) saturate(180%)',
        boxShadow: 'inset 0 1px 1px rgba(255,255,255,0.15), inset 0 -1px 1px rgba(0,0,0,0.1), 0 4px 24px rgba(0,0,0,0.3)',
      }}
    >
      <span className="relative z-10">{children}</span>
      <svg className="relative z-10 w-4 h-4 group-hover:translate-x-0.5 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={2}>
        <path strokeLinecap="round" strokeLinejoin="round" d="M13 7l5 5m0 0l-5 5m5-5H6" />
      </svg>
      {/* Glass sheen on hover */}
      <div
        className="absolute inset-0 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-500"
        style={{ background: 'linear-gradient(135deg, rgba(255,255,255,0.12) 0%, transparent 50%, rgba(255,255,255,0.04) 100%)' }}
      />
    </motion.a>
  );
}
