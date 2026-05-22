'use client';

import { useState, useEffect } from 'react';
import { FamilyTree } from '@/lib/types';
import { getTree, saveTree } from '@/lib/storage';
import Navbar from '@/components/shared/Navbar';
import FamilyTreeCanvas from '@/components/editor/FamilyTreeCanvas';
import { use } from 'react';

export default function EditorPage({ params }: { params: Promise<{ treeId: string }> }) {
  const resolvedParams = use(params);
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const data = await getTree(resolvedParams.treeId);
      setTree(data);
      setLoading(false);
    }
    load();
  }, [resolvedParams.treeId]);

  const handleTreeUpdate = async (updatedTree: FamilyTree) => {
    setTree(updatedTree);
    await saveTree(updatedTree);
  };

  if (loading) {
    return (
      <div className="loader-overlay">
        <div className="loader-kinfolk"></div>
      </div>
    );
  }

  if (!tree) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white">
        <h1 className="text-2xl font-bold mb-4">Tree not found</h1>
        <p className="text-neutral-500">The tree you are looking for doesn't exist or you don't have access.</p>
      </div>
    );
  }

  return (
    <div className="h-screen w-full relative overflow-hidden bg-black">
      <Navbar isEditor title={tree.name} showBack />
      <FamilyTreeCanvas tree={tree} onTreeUpdate={handleTreeUpdate} />
    </div>
  );
}
