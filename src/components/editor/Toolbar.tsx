'use client';

import { motion } from 'framer-motion';

interface ToolbarProps {
  treeName: string;
  onAddPerson: () => void;
  onAutoLayout: () => void;
  onExportPng: () => void;
  onShare: () => void;
  isPublic?: boolean;
}

export default function Toolbar({
  treeName,
  onAddPerson,
  onAutoLayout,
  onExportPng,
  onShare,
  isPublic = false,
}: ToolbarProps) {
  return (
    <motion.div
      initial={{ y: -10, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.4, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="fixed top-3.5 right-6 z-[60] flex items-center justify-end pointer-events-none"
    >
      <div className="flex items-center gap-2 pointer-events-auto">
        <ToolbarButton onClick={onAddPerson} title="Add Person" variant="primary">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
          </svg>
          <span className="hidden sm:inline">Add Person</span>
        </ToolbarButton>

        <ToolbarButton onClick={onAutoLayout} title="Auto Layout">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 5a1 1 0 011-1h14a1 1 0 011 1v2a1 1 0 01-1 1H5a1 1 0 01-1-1V5zM4 13a1 1 0 011-1h6a1 1 0 011 1v6a1 1 0 01-1 1H5a1 1 0 01-1-1v-6zM16 13a1 1 0 011-1h2a1 1 0 011 1v6a1 1 0 01-1 1h-2a1 1 0 01-1-1v-6z" />
          </svg>
        </ToolbarButton>

        <div className="w-px h-6 bg-white/[0.06]" />

        <ToolbarButton onClick={onExportPng} title="Export PNG">
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
        </ToolbarButton>

        <ToolbarButton onClick={onShare} title={isPublic ? "Copy Share Link" : "Share Tree"} variant={isPublic ? "primary" : "default"}>
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
          </svg>
          <span className="hidden sm:inline">{isPublic ? "Shared" : "Share"}</span>
        </ToolbarButton>
      </div>
    </motion.div>
  );
}

function ToolbarButton({
  children,
  onClick,
  title,
  variant = 'default',
}: {
  children: React.ReactNode;
  onClick: () => void;
  title: string;
  variant?: 'default' | 'primary';
}) {
  return (
    <button
      onClick={onClick}
      title={title}
      className={`
        flex items-center gap-2 px-3 py-2 rounded-xl text-sm font-medium
        backdrop-blur-2xl border shadow-lg transition-all duration-300
        ${variant === 'primary'
          ? 'bg-white text-black border-white/20 hover:bg-neutral-200 hover:shadow-xl hover:shadow-white/[0.05]'
          : 'bg-night-card/90 text-neutral-400 border-white/[0.06] hover:bg-night-elevated hover:text-white'
        }
      `}
    >
      {children}
    </button>
  );
}
