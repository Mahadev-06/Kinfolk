'use client';

import { motion } from 'framer-motion';
import Link from 'next/link';
import { FamilyTree } from '@/lib/types';
import { formatDate } from '@/lib/utils';

interface TreeCardProps {
  tree: FamilyTree;
  onDelete: (id: string) => void;
}

export default function TreeCard({ tree, onDelete }: TreeCardProps) {
  const personCount = tree.persons.length;
  const relationshipCount = tree.persons.reduce(
    (acc, p) => acc + p.children.length + p.spouse.length,
    0
  ) / 2;

  return (
    <motion.div
      layout
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.95 }}
      whileHover={{ y: -3 }}
      transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
      className="group relative bg-[#0f0f0f] rounded-2xl border border-white/[0.06] overflow-hidden hover:shadow-2xl hover:shadow-white/[0.02] hover:border-white/[0.12] transition-all duration-500 card-glow"
    >
      {/* Gradient top bar */}
      <div className="h-px bg-gradient-to-r from-transparent via-white/20 to-transparent" />

      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white truncate max-w-[200px]">
              {tree.name}
            </h3>
            <p className="text-sm text-neutral-600 mt-1">
              Last edited {formatDate(tree.updatedAt)}
            </p>
          </div>
          <button
            onClick={(e) => {
              e.preventDefault();
              onDelete(tree.id);
            }}
            className="opacity-0 group-hover:opacity-100 p-2 rounded-lg text-neutral-600 hover:text-red-400 hover:bg-white/[0.03] transition-all duration-300"
            title="Delete tree"
          >
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          </button>
        </div>

        {/* Stats */}
        <div className="flex gap-4 mb-6">
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
            </svg>
            {personCount} {personCount === 1 ? 'person' : 'people'}
          </div>
          <div className="flex items-center gap-1.5 text-sm text-neutral-500">
            <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M13.828 10.172a4 4 0 00-5.656 0l-4 4a4 4 0 105.656 5.656l1.102-1.101m-.758-4.899a4 4 0 005.656 0l4-4a4 4 0 00-5.656-5.656l-1.1 1.1" />
            </svg>
            {Math.round(relationshipCount)} relations
          </div>
        </div>

        <motion.div
           whileHover={{ scale: 1.02 }}
           whileTap={{ scale: 0.98 }}
        >
          <Link
            href={`/editor/${tree.id}`}
            className="block w-full text-center py-2.5 rounded-xl font-medium text-sm text-neutral-300 transition-all duration-300 btn-liquid-glass"
          >
            Open Editor
          </Link>
        </motion.div>
      </div>
    </motion.div>
  );
}
