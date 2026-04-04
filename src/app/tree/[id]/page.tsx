'use client';

import { useState, useEffect, useMemo } from 'react';
import { use } from 'react';
import { ReactFlow, Background, BackgroundVariant, useNodesState, useEdgesState, type NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';

import { FamilyTree } from '@/lib/types';
import { getTree, cloneTree } from '@/lib/storage';
import { getLayoutedElements } from '@/lib/layout';
import PersonNodeComponent from '@/components/editor/PersonNode';
import Navbar from '@/components/shared/Navbar';

const nodeTypes: NodeTypes = {
  personNode: PersonNodeComponent,
};

export default function PublicTreeViewPage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [cloning, setCloning] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  useEffect(() => {
    async function load() {
      const data = await getTree(resolvedParams.id);
      setTree(data);
      setLoading(false);
    }
    load();
  }, [resolvedParams.id]);

  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(() => {
    if (!tree) return { nodes: [], edges: [] };
    return getLayoutedElements(tree.persons);
  }, [tree]);

  const [nodes, setNodes] = useNodesState(layoutedNodes);
  const [edges, setEdges] = useEdgesState(layoutedEdges);

  useEffect(() => {
    setNodes(layoutedNodes);
    setEdges(layoutedEdges);
  }, [layoutedNodes, setNodes, setEdges]);

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  const handleImport = async () => {
    if (!tree) return;
    setCloning(true);
    try {
      const newTree = await cloneTree(tree);
      if (newTree) {
        showToast('Successfully imported! Redirecting...');
        setTimeout(() => {
          router.push(`/editor/${newTree.id}`);
        }, 1500);
      } else {
        showToast('Please login to import this tree');
      }
    } catch (err) {
      showToast('Login required to import trees');
    } finally {
      setCloning(false);
    }
  };

  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex items-center justify-center">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
      </div>
    );
  }

  if (!tree || !tree.is_public) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="w-20 h-20 bg-white/[0.03] border border-white/[0.08] rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 tracking-tight">Private Tree</h1>
        <p className="text-neutral-500 max-w-sm mb-8 leading-relaxed text-lg">
          This family tree is either private or does not exist. The owner must share the public link.
        </p>
        <button 
          onClick={() => router.push('/')}
          className="px-8 py-3 bg-white text-black font-semibold rounded-2xl hover:bg-neutral-200 transition-colors"
        >
          Return Home
        </button>
      </div>
    );
  }

  return (
    <div className="h-screen w-full overflow-hidden bg-[#050505] flex flex-col">
      <Navbar title={tree.name} hideHome />
      
      <div className="flex-1 relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          nodeTypes={nodeTypes}
          onNodesChange={() => {}} // Read-only
          onEdgesChange={() => {}} // Read-only
          onConnect={() => {}} // Read-only
          nodesDraggable={false}
          nodesConnectable={false}
          fitView
          className="!bg-[#050505]"
          proOptions={{ hideAttribution: true }}
        >
          <Background
            variant={BackgroundVariant.Lines}
            gap={30}
            lineWidth={1}
            color="rgba(255, 255, 255, 0.04)"
          />
        </ReactFlow>

        {/* Public UI Overlays */}
        <div className="absolute top-6 left-6 z-50 flex flex-col gap-3">
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-emerald-500 text-emerald-950 text-xs font-bold uppercase tracking-wider"
          >
            <div className="w-1.5 h-1.5 rounded-full bg-emerald-950 animate-pulse" />
            Public View
          </motion.div>
          
          <motion.div 
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.1 }}
            className="px-5 py-3 rounded-2xl bg-night-card shadow-2xl border border-white/[0.08]"
          >
            <h2 className="text-white font-semibold mb-1">{tree.name}</h2>
            <p className="text-xs text-neutral-500">Shared family story</p>
          </motion.div>
        </div>

        <div className="absolute bottom-8 right-8 z-50">
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            disabled={cloning}
            onClick={handleImport}
            className="flex items-center gap-3 px-8 py-4 rounded-2xl bg-white text-black font-bold shadow-2xl shadow-white/10 hover:bg-neutral-200 transition-colors disabled:opacity-50"
          >
            {cloning ? (
              <div className="w-5 h-5 border-2 border-black/30 border-t-black rounded-full animate-spin" />
            ) : (
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 7H5a2 2 0 00-2 2v9a2 2 0 002 2h14a2 2 0 002-2V9a2 2 0 00-2-2h-3m-1 4l-3 3m0 0l-3-3m3 3V4" />
              </svg>
            )}
            Import to My Trees
          </motion.button>
        </div>

        {/* Toast */}
        {toast && (
          <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-[100] px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium shadow-2xl animate-fade-in">
            {toast}
          </div>
        )}
      </div>
    </div>
  );
}
