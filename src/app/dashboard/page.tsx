'use client';

import { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FamilyTree } from '@/lib/types';
import { loadTrees, saveTree, deleteTree } from '@/lib/storage';
import { createSeedData } from '@/lib/seedData';
import Navbar from '@/components/shared/Navbar';
import TreeCard from '@/components/dashboard/TreeCard';
import CreateTreeModal from '@/components/dashboard/CreateTreeModal';
import ConfirmDialog from '@/components/shared/ConfirmDialog';
import BackgroundWaves from '@/components/landing/BackgroundWaves';

export default function DashboardPage() {
  const [trees, setTrees] = useState<FamilyTree[]>([]);
  const [showCreateModal, setShowCreateModal] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchTrees = useCallback(async () => {
    setLoading(true);
    const data = await loadTrees();
    setTrees(data);
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchTrees();
  }, [fetchTrees]);

  const handleCreateTree = useCallback(async (name: string) => {
    const newTreeStub: any = {
      name,
      persons: [],
    };
    const saved = await saveTree(newTreeStub);
    if (saved) {
      setTrees(prev => [saved, ...prev]);
    }
  }, []);

  const handleDeleteTree = useCallback((id: string) => {
    setDeleteTargetId(id);
    setShowDeleteConfirm(true);
  }, []);

  const confirmDelete = useCallback(async () => {
    if (!deleteTargetId) return;
    const success = await deleteTree(deleteTargetId);
    if (success) {
      setTrees(prev => prev.filter(t => t.id !== deleteTargetId));
    }
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
  }, [deleteTargetId]);

  const handleLoadSeed = useCallback(async () => {
    const seed = createSeedData();
    // Remove individual storage ID so Supabase generates its own
    const { id, ...seedContent } = seed;
    const saved = await saveTree(seedContent as any);
    if (saved) {
      setTrees(prev => [saved, ...prev]);
    }
  }, []);

  return (
    <div className="min-h-screen bg-black relative">
      <BackgroundWaves />
      <div className="relative z-[1]">
        <Navbar
          rightActions={
            <motion.button
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              onClick={() => setShowCreateModal(true)}
              className="group inline-flex items-center p-3 rounded-2xl text-white text-[15px] font-medium transition-all duration-300 btn-liquid-glass pointer-events-auto"
            >
              <div className="w-5 h-5 flex items-center justify-center shrink-0">
                <svg className="w-5 h-5 text-white/90" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
                </svg>
              </div>
              <span className="max-w-0 overflow-hidden whitespace-nowrap transition-[max-width,opacity] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)] opacity-0 group-hover:max-w-[100px] group-hover:opacity-100">
                <span className="pl-2.5 pr-1 inline-block">New Tree</span>
              </span>
            </motion.button>
          }
        />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-12 md:pb-16">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, ease: [0.25, 0.46, 0.45, 0.94] }}
          className="flex flex-col md:flex-row md:items-center justify-between gap-6 mb-8 md:mb-10"
        >
          <div>
            <h1 className="text-3xl font-bold text-white tracking-tight">
              Your Family Trees
            </h1>
            <p className="text-neutral-500 mt-1.5">
              Securely stored in the cloud
            </p>
          </div>
        </motion.div>

        {loading ? (
          <div className="flex justify-center py-24">
            <div className="loader-kinfolk"></div>
          </div>
        ) : trees.length > 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6"
          >
            <AnimatePresence>
              {trees.map((tree) => (
                <TreeCard key={tree.id} tree={tree} onDelete={handleDeleteTree} />
              ))}
            </AnimatePresence>
          </motion.div>
        ) : (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="text-center py-24"
          >
            <div className="w-20 h-20 mx-auto mb-6 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
              <svg className="w-10 h-10 text-neutral-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </div>
            <h2 className="text-xl font-semibold text-neutral-300 mb-2">
              No Family Trees Yet
            </h2>
            <p className="text-neutral-600 mb-8 max-w-md mx-auto">
              Create your first tree on the cloud to start your journey
            </p>
            <div className="flex flex-col sm:flex-row gap-3 justify-center">
              <button
                onClick={() => setShowCreateModal(true)}
                className="px-6 py-3 rounded-xl text-sm font-medium text-black bg-white hover:bg-neutral-200 transition-all duration-300"
              >
                Create New Tree
              </button>
              <button
                onClick={handleLoadSeed}
                className="px-6 py-3 rounded-xl text-sm font-medium bg-white/[0.03] text-neutral-400 border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all duration-300"
              >
                Load Sample Tree
              </button>
            </div>
          </motion.div>
        )}
      </main>

      <CreateTreeModal
        isOpen={showCreateModal}
        onClose={() => setShowCreateModal(false)}
        onCreate={handleCreateTree}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Family Tree"
        message="This will permanently delete this family tree from the cloud. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        }}
        variant="danger"
      />
      </div>
    </div>
  );
}
