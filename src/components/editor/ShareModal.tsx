'use client';

import { motion, AnimatePresence } from 'framer-motion';
import { useState } from 'react';

interface ShareModalProps {
  isOpen: boolean;
  onClose: () => void;
  shareUrl: string;
}

export default function ShareModal({ isOpen, onClose, shareUrl }: ShareModalProps) {
  const [copied, setCopied] = useState(false);

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(shareUrl);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    } catch {
      // Fallback for older browsers
      const input = document.createElement('input');
      input.value = shareUrl;
      document.body.appendChild(input);
      input.select();
      document.execCommand('copy');
      document.body.removeChild(input);
      setCopied(true);
      setTimeout(() => setCopied(false), 2500);
    }
  };

  const handleWhatsApp = () => {
    window.open(`https://wa.me/?text=${encodeURIComponent(`Check out my family tree on Kinfolk!\n${shareUrl}`)}`, '_blank');
  };

  const handleEmail = () => {
    window.open(`mailto:?subject=${encodeURIComponent('My Family Tree on Kinfolk')}&body=${encodeURIComponent(`I'd like to share my family tree with you!\n\n${shareUrl}`)}`, '_blank');
  };

  const handleTwitter = () => {
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(`Check out my family tree on Kinfolk! ${shareUrl}`)}`, '_blank');
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[200] flex items-center justify-center p-4"
          onClick={onClose}
        >
          {/* Backdrop */}
          <div className="absolute inset-0 bg-black/70 backdrop-blur-sm" />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            transition={{ duration: 0.3, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="relative w-full max-w-md bg-night-card border border-white/[0.08] rounded-3xl shadow-2xl overflow-hidden"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Top glow */}
            <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[70%] h-24 bg-white/[0.04] blur-[40px] rounded-full pointer-events-none" />

            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 z-30 p-2 rounded-full bg-white/[0.05] text-neutral-400 hover:text-white hover:bg-white/[0.1] transition-all duration-300"
            >
              <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>

            <div className="p-8 relative z-10">
              {/* Header */}
              <div className="text-center mb-6">
                <div className="w-14 h-14 mx-auto mb-4 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white tracking-tight">Share Your Tree</h2>
                <p className="text-neutral-500 text-sm mt-1">
                  Anyone with this link can view and save a copy
                </p>
              </div>

              {/* Link input + copy */}
              <div className="flex items-center gap-2 mb-6">
                <div className="flex-1 px-4 py-3 bg-black/50 border border-white/[0.08] rounded-xl text-sm text-neutral-300 truncate font-mono">
                  {shareUrl}
                </div>
                <button
                  onClick={handleCopy}
                  className={`shrink-0 px-5 py-3 rounded-xl text-sm font-semibold transition-all duration-300 ${
                    copied
                      ? 'bg-emerald-500 text-emerald-950'
                      : 'bg-white text-black hover:bg-neutral-200'
                  }`}
                >
                  {copied ? (
                    <span className="flex items-center gap-1.5">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                      </svg>
                      Copied
                    </span>
                  ) : (
                    'Copy'
                  )}
                </button>
              </div>

              {/* Share options */}
              <div className="space-y-2">
                <p className="text-xs font-medium text-neutral-500 uppercase tracking-wider mb-3">Share via</p>
                <div className="grid grid-cols-3 gap-2">
                  {/* WhatsApp */}
                  <button
                    onClick={handleWhatsApp}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-[#25D366]/10 flex items-center justify-center group-hover:bg-[#25D366]/20 transition-colors">
                      <svg className="w-5 h-5 text-[#25D366]" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413z"/>
                      </svg>
                    </div>
                    <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">WhatsApp</span>
                  </button>

                  {/* Email */}
                  <button
                    onClick={handleEmail}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-blue-500/10 flex items-center justify-center group-hover:bg-blue-500/20 transition-colors">
                      <svg className="w-5 h-5 text-blue-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                      </svg>
                    </div>
                    <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">Email</span>
                  </button>

                  {/* Twitter / X */}
                  <button
                    onClick={handleTwitter}
                    className="flex flex-col items-center gap-2 p-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.08] hover:border-white/[0.15] transition-all duration-300 group"
                  >
                    <div className="w-10 h-10 rounded-full bg-white/[0.06] flex items-center justify-center group-hover:bg-white/[0.12] transition-colors">
                      <svg className="w-5 h-5 text-white" viewBox="0 0 24 24" fill="currentColor">
                        <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
                      </svg>
                    </div>
                    <span className="text-xs text-neutral-400 group-hover:text-white transition-colors">X</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
