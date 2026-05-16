'use client';

import { useState, useEffect, useMemo } from 'react';
import { use } from 'react';
import { ReactFlow, Background, BackgroundVariant, useNodesState, useEdgesState, type NodeTypes } from '@xyflow/react';
import '@xyflow/react/dist/style.css';
import { motion } from 'framer-motion';
import { useRouter } from 'next/navigation';
import Link from 'next/link';

import { FamilyTree } from '@/lib/types';
import { getPublicTree, cloneTree } from '@/lib/storage';
import { getLayoutedElements } from '@/lib/layout';
import PersonNodeComponent from '@/components/editor/PersonNode';
import { createClient } from '@/lib/supabase/client';
import { User } from '@supabase/supabase-js';

const nodeTypes: NodeTypes = {
  personNode: PersonNodeComponent,
};

export default function SharedTreePage({ params }: { params: Promise<{ id: string }> }) {
  const resolvedParams = use(params);
  const router = useRouter();
  const [tree, setTree] = useState<FamilyTree | null>(null);
  const [loading, setLoading] = useState(true);
  const [authChecked, setAuthChecked] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [cloning, setCloning] = useState(false);
  const [cloned, setCloned] = useState(false);
  const [treeNotFound, setTreeNotFound] = useState(false);
  const [toast, setToast] = useState<string | null>(null);

  // Step 1: Check auth first
  useEffect(() => {
    async function checkAuth() {
      const supabase = createClient();
      const { data: { user } } = await supabase.auth.getUser();
      setUser(user);
      setAuthChecked(true);
    }
    checkAuth();
  }, []);

  // Step 2: Once auth is checked, handle the flow
  useEffect(() => {
    if (!authChecked) return;

    // Not logged in — don't even try to fetch tree, just show login prompt
    if (!user) {
      setLoading(false);
      return;
    }

    // Logged in — fetch the tree and auto-clone
    async function fetchAndClone() {
      const data = await getPublicTree(resolvedParams.id);
      
      if (!data) {
        setTreeNotFound(true);
        setLoading(false);
        return;
      }

      setTree(data);
      setLoading(false);
      
      // Auto-clone the tree to user's dashboard
      setCloning(true);
      try {
        const newTree = await cloneTree(data);
        if (newTree) {
          setCloned(true);
          setToast('Tree saved to your dashboard!');
          setTimeout(() => {
            router.push(`/editor/${newTree.id}`);
          }, 2000);
        } else {
          setToast('Could not save tree. Try again.');
        }
      } catch {
        setToast('Failed to save tree');
      } finally {
        setCloning(false);
      }
    }

    fetchAndClone();
  }, [authChecked, user, resolvedParams.id, router]);

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

  // Loading state
  if (loading) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center gap-4">
        <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin" />
        <p className="text-neutral-500 text-sm">Loading shared tree...</p>
      </div>
    );
  }

  // Tree not found (only shown to logged-in users after fetch fails)
  if (treeNotFound) {
    return (
      <div className="h-screen w-full bg-black flex flex-col items-center justify-center text-white p-4 text-center">
        <div className="w-20 h-20 bg-white/[0.03] border border-white/[0.08] rounded-3xl flex items-center justify-center mb-6">
          <svg className="w-10 h-10 text-neutral-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
          </svg>
        </div>
        <h1 className="text-3xl font-bold mb-4 tracking-tight">Link Expired or Invalid</h1>
        <p className="text-neutral-500 max-w-sm mb-8 leading-relaxed text-lg">
          This family tree link is no longer available or doesn&apos;t exist.
        </p>
        <button 
          onClick={() => router.push('/dashboard')}
          className="px-8 py-3 bg-white text-black font-semibold rounded-2xl hover:bg-neutral-200 transition-colors"
        >
          Go to Dashboard
        </button>
      </div>
    );
  }

  // Not logged in — show login/signup prompt
  if (!user) {
    return (
      <div className="h-screen w-full bg-black flex flex-col relative overflow-hidden">
        {/* Login prompt */}
        <div className="relative z-10 flex-1 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.6, ease: [0.25, 0.46, 0.45, 0.94] }}
            className="w-full max-w-md"
          >
            <div className="bg-night-card/95 backdrop-blur-3xl border border-white/[0.08] p-8 sm:p-10 rounded-3xl shadow-2xl relative overflow-hidden text-center">
              {/* Glow */}
              <div className="absolute top-0 left-1/2 -translate-x-1/2 w-[80%] h-32 bg-white/[0.03] blur-[50px] rounded-full pointer-events-none" />

              <div className="relative z-10">
                {/* Icon */}
                <div className="w-16 h-16 mx-auto mb-5 rounded-2xl bg-white/[0.06] border border-white/[0.08] flex items-center justify-center">
                  <svg className="w-8 h-8 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24" strokeWidth={1.5}>
                    <path strokeLinecap="round" strokeLinejoin="round" d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0z" />
                  </svg>
                </div>

                <h1 className="text-2xl font-bold text-white tracking-tight mb-2">
                  Someone shared a family tree
                </h1>
                <p className="text-neutral-500 text-sm mb-8">
                  Sign in or create an account to view and save this tree to your dashboard
                </p>

                <div className="flex flex-col gap-3">
                  <Link
                    href={`/login?redirect=/tree/${resolvedParams.id}`}
                    className="w-full py-3.5 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors duration-300 shadow-[0_0_20px_rgba(255,255,255,0.1)] text-center block"
                  >
                    Sign In
                  </Link>
                  <Link
                    href={`/signup?redirect=/tree/${resolvedParams.id}`}
                    className="w-full py-3.5 bg-white/[0.05] text-white font-medium rounded-xl border border-white/[0.08] hover:bg-white/[0.1] transition-colors duration-300 text-center block"
                  >
                    Create Account
                  </Link>
                </div>

                <p className="mt-6 text-xs text-neutral-600">
                  After signing in, this tree will be automatically saved to your dashboard
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      </div>
    );
  }

  // Logged in — show tree with cloning state
  return (
    <div className="h-screen w-full overflow-hidden bg-[#050505] flex flex-col">
      <div className="flex-1 relative">
        {tree && (
          <ReactFlow
            nodes={nodes}
            edges={edges}
            nodeTypes={nodeTypes}
            onNodesChange={() => {}}
            onEdgesChange={() => {}}
            onConnect={() => {}}
            nodesDraggable={false}
            nodesConnectable={false}
            fitView
            className="!bg-[#050505]"
            proOptions={{ hideAttribution: true }}
          >
            <Background
              variant={BackgroundVariant.Dots}
              gap={24}
              size={1}
              color="rgba(255, 255, 255, 0.05)"
            />
          </ReactFlow>
        )}

        {/* Status overlay */}
        <div className="absolute inset-0 flex items-center justify-center z-50 pointer-events-none">
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="bg-night-card/95 backdrop-blur-2xl border border-white/[0.08] px-8 py-6 rounded-3xl shadow-2xl text-center pointer-events-auto"
          >
            {cloned ? (
              <>
                <div className="w-12 h-12 mx-auto mb-4 rounded-full bg-emerald-500/10 flex items-center justify-center">
                  <svg className="w-6 h-6 text-emerald-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M5 13l4 4L19 7" />
                  </svg>
                </div>
                <p className="text-white font-semibold mb-1">Tree Saved!</p>
                <p className="text-neutral-500 text-sm">Redirecting to editor...</p>
              </>
            ) : cloning ? (
              <>
                <div className="w-8 h-8 border-2 border-white/20 border-t-white rounded-full animate-spin mx-auto mb-4" />
                <p className="text-white font-medium">Saving to your dashboard...</p>
              </>
            ) : (
              <>
                <p className="text-white font-medium mb-3">View {tree?.name}</p>
                <button
                  onClick={() => router.push('/dashboard')}
                  className="px-6 py-2.5 bg-white text-black font-semibold rounded-xl hover:bg-neutral-200 transition-colors text-sm"
                >
                  Go to Dashboard
                </button>
              </>
            )}
          </motion.div>
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
