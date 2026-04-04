'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Gender } from '@/lib/types';

interface AddPersonModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (name: string, gender: Gender, birthDate?: string) => void;
}

export default function AddPersonModal({ isOpen, onClose, onAdd }: AddPersonModalProps) {
  const [name, setName] = useState('');
  const [gender, setGender] = useState<Gender>('male');
  const [birthDate, setBirthDate] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (name.trim()) {
      onAdd(name.trim(), gender, birthDate || undefined);
      setName('');
      setGender('male');
      setBirthDate('');
      onClose();
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-black/80 backdrop-blur-md"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="bg-[#0f0f0f] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/[0.06]"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="flex items-center gap-3 mb-6">
              <div className="w-10 h-10 rounded-xl bg-white flex items-center justify-center">
                <svg className="w-5 h-5 text-black" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <div>
                <h3 className="text-lg font-semibold text-white">
                  Add New Person
                </h3>
                <p className="text-sm text-neutral-500">
                  Add a family member to the tree
                </p>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">
                  Full Name *
                </label>
                <input
                  type="text"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="e.g., John Smith"
                  autoFocus
                  className="w-full px-4 py-3 rounded-xl bg-night-input border border-white/[0.08] text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">
                  Gender *
                </label>
                <div className="flex gap-2">
                  {(['male', 'female', 'other'] as Gender[]).map((g) => (
                    <button
                      key={g}
                      type="button"
                      onClick={() => setGender(g)}
                      className={`flex-1 py-2.5 rounded-xl text-sm font-medium border transition-all duration-300 ${
                        gender === g
                          ? 'border-white/30 bg-white/[0.08] text-white'
                          : 'border-white/[0.06] text-neutral-500 hover:border-white/15 hover:text-neutral-300'
                      }`}
                    >
                      {g === 'male' ? '♂ Male' : g === 'female' ? '♀ Female' : '⚥ Other'}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">
                  Birth Date (optional)
                </label>
                <input
                  type="date"
                  value={birthDate}
                  onChange={(e) => setBirthDate(e.target.value)}
                  className="w-full px-4 py-3 rounded-xl bg-night-input border border-white/[0.08] text-white focus:outline-none focus:ring-1 focus:ring-white/30 focus:border-transparent transition-all duration-300 text-sm"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium bg-night-elevated text-neutral-400 hover:bg-night-border hover:text-white transition-all duration-300"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={!name.trim()}
                  className="flex-1 py-2.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-neutral-200 disabled:opacity-30 disabled:cursor-not-allowed transition-all duration-300"
                >
                  Add Person
                </button>
              </div>
            </form>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
