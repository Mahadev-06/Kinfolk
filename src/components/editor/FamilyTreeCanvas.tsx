'use client';

import { useCallback, useMemo, useRef, useState, useEffect } from 'react';
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  useNodesState,
  useEdgesState,
  type Node,
  type NodeTypes,
  BackgroundVariant,
  Panel,
} from '@xyflow/react';
import '@xyflow/react/dist/style.css';

import { FamilyTree, Person, Gender } from '@/lib/types';
import { saveTree } from '@/lib/storage';
import { addChild, addSpouse, removePerson, removeRelationship } from '@/lib/relationships';
import { getLayoutedElements, deriveEdges } from '@/lib/layout';
import { generateId } from '@/lib/utils';
import { exportToPng } from '@/lib/exportUtils';

import PersonNodeComponent from './PersonNode';
import Toolbar from './Toolbar';
import PersonPanel from './PersonPanel';
import AddPersonModal from './AddPersonModal';
import ConnectRelationshipModal from './ConnectRelationshipModal';
import ShareModal from './ShareModal';
import ConfirmDialog from '../shared/ConfirmDialog';

const nodeTypes: NodeTypes = {
  personNode: PersonNodeComponent,
};

interface FamilyTreeCanvasProps {
  tree: FamilyTree;
  onTreeUpdate: (tree: FamilyTree) => void;
}

export default function FamilyTreeCanvas({ tree, onTreeUpdate }: FamilyTreeCanvasProps) {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);

  // Compute layout from persons
  const { nodes: layoutedNodes, edges: layoutedEdges } = useMemo(
    () => getLayoutedElements(tree.persons),
    [tree.persons]
  );

  const [nodes, setNodes, onNodesChange] = useNodesState(layoutedNodes);
  const [edges, setEdges] = useEdgesState(layoutedEdges);

  // UI State
  const [selectedPersonId, setSelectedPersonId] = useState<string | null>(null);
  const [showAddPerson, setShowAddPerson] = useState(false);
  const [showConnectModal, setShowConnectModal] = useState(false);
  const [connectType, setConnectType] = useState<'parent' | 'spouse' | 'child' | 'custom'>('child');
  const [connectSourceId, setConnectSourceId] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [deleteTargetId, setDeleteTargetId] = useState<string | null>(null);
  const [toast, setToast] = useState<string | null>(null);
  const [showShareModal, setShowShareModal] = useState(false);
  const [shareUrl, setShareUrl] = useState('');
  
  // Relationship Discovery State
  const [findingRelationWith, setFindingRelationWith] = useState<Person | null>(null);
  const [relationshipResult, setRelationshipResult] = useState<string | null>(null);

  const selectedPerson = useMemo(
    () => tree.persons.find((p) => p.id === selectedPersonId) || null,
    [tree.persons, selectedPersonId]
  );

  // Sync nodes/edges when tree changes
  useEffect(() => {
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(tree.persons);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [tree.persons, setNodes, setEdges]);

  // Auto-save
  const updateTree = useCallback(
    (newPersons: Person[]) => {
      const updated = {
        ...tree,
        persons: newPersons,
        updatedAt: new Date().toISOString(),
      };
      onTreeUpdate(updated);
      saveTree(updated);
    },
    [tree, onTreeUpdate]
  );

  const showToast = (message: string) => {
    setToast(message);
    setTimeout(() => setToast(null), 3000);
  };

  // ================== PERSON CRUD ==================

  const handleAddPerson = useCallback(
    (name: string, gender: Gender, birthDate?: string) => {
      const newPerson: Person = {
        id: generateId(),
        name,
        gender,
        birthDate,
        parents: [],
        spouse: [],
        children: [],
      };
      updateTree([...tree.persons, newPerson]);
      showToast(`Added ${name}`);
    },
    [tree.persons, updateTree]
  );

  const handleEditPerson = useCallback(
    (updated: Person) => {
      const newPersons = tree.persons.map((p) => (p.id === updated.id ? updated : p));
      updateTree(newPersons);
    },
    [tree.persons, updateTree]
  );

  const handleDeletePerson = useCallback(
    (personId: string) => {
      setDeleteTargetId(personId);
      setShowDeleteConfirm(true);
    },
    []
  );

  const confirmDelete = useCallback(() => {
    if (!deleteTargetId) return;
    const person = tree.persons.find((p) => p.id === deleteTargetId);
    const newPersons = removePerson(tree.persons, deleteTargetId);
    updateTree(newPersons);
    if (selectedPersonId === deleteTargetId) setSelectedPersonId(null);
    setShowDeleteConfirm(false);
    setDeleteTargetId(null);
    if (person) showToast(`Deleted ${person.name}`);
  }, [deleteTargetId, tree.persons, updateTree, selectedPersonId]);

  // ================== RELATIONSHIPS ==================

  const handleAddRelationship = useCallback(
    (personId: string, type: 'parent' | 'spouse' | 'child' | 'custom') => {
      setConnectSourceId(personId);
      setConnectType(type);
      setShowConnectModal(true);
    },
    []
  );

  const handleConnectRelationship = useCallback(
    (targetId: string, customType?: string) => {
      if (!connectSourceId) return;

      try {
        let newPersons: Person[];
        if (connectType === 'parent') {
          newPersons = addChild(tree.persons, targetId, connectSourceId);
        } else if (connectType === 'child') {
          newPersons = addChild(tree.persons, connectSourceId, targetId);
        } else if (connectType === 'custom' && customType) {
          import('@/lib/relationships').then((mod) => {
            const updated = mod.addCustomRelationship(tree.persons, connectSourceId, targetId, customType);
            updateTree(updated);
            showToast('Custom relationship added');
          });
          return;
        } else {
          newPersons = addSpouse(tree.persons, connectSourceId, targetId);
        }
        updateTree(newPersons);
        showToast('Relationship added');
      } catch (err) {
        showToast((err as Error).message);
      }
    },
    [connectSourceId, connectType, tree.persons, updateTree]
  );

  const handleRemoveRelationship = useCallback(
    (personAId: string, personBId: string, type: 'parent-child' | 'spouse' | 'custom', relId?: string) => {
      const newPersons = removeRelationship(tree.persons, personAId, personBId, type, relId);
      updateTree(newPersons);
      showToast('Relationship removed');
    },
    [tree.persons, updateTree]
  );

  // ================== NODE CLICK ==================

  const onNodeClick = useCallback((_event: React.MouseEvent, node: Node) => {
    if (findingRelationWith) {
      if (node.id === findingRelationWith.id) {
        showToast("Cannot select the same person.");
        return;
      }
      
      const personB = tree.persons.find(p => p.id === node.id);
      if (personB) {
        import('@/lib/relationshipFinder').then(mod => {
          const result = mod.findRelationship(tree.persons, findingRelationWith.id, node.id);
          setRelationshipResult(result);
          setFindingRelationWith(null); // Exit selection mode
          showToast(`Found connection to ${personB.name}`);
        });
      }
      return;
    }
    
    setSelectedPersonId(node.id);
    setRelationshipResult(null); // Clear previous results when selecting a new person
  }, [findingRelationWith, tree.persons]);

  // ================== LAYOUT ==================

  const handleAutoLayout = useCallback(() => {
    const { nodes: newNodes, edges: newEdges } = getLayoutedElements(tree.persons);
    setNodes(newNodes);
    setEdges(newEdges);
  }, [tree.persons, setNodes, setEdges]);

  // ================== EXPORT/IMPORT ==================

  const handleExportPng = useCallback(async () => {
    const viewport = document.querySelector('.react-flow__viewport') as HTMLElement;
    if (viewport) {
      try {
        await exportToPng(viewport, tree.name.replace(/\s+/g, '_'));
        showToast('PNG exported!');
      } catch {
        showToast('Failed to export PNG');
      }
    }
  }, [tree.name]);
  
  const handleShare = useCallback(async () => {
    // Make tree public if not already
    if (!tree.is_public) {
      const success = await import('@/lib/storage').then(mod => mod.shareTree(tree.id, true));
      if (success) {
        onTreeUpdate({ ...tree, is_public: true });
      } else {
        showToast('Failed to generate share link');
        return;
      }
    }
    const url = `${window.location.origin}/tree/${tree.id}`;
    setShareUrl(url);
    setShowShareModal(true);
  }, [tree, onTreeUpdate]);

  const handleSelectPerson = useCallback((personId: string) => {
    setSelectedPersonId(personId);
  }, []);

  return (
    <div ref={reactFlowWrapper} className="w-full h-[calc(100vh-64px)] md:h-screen relative">
      <Toolbar
        treeName={tree.name}
        onAddPerson={() => setShowAddPerson(true)}
        onAutoLayout={handleAutoLayout}
        onExportPng={handleExportPng}
        onShare={handleShare}
      />

      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onNodeClick={onNodeClick}
        nodeTypes={nodeTypes}
        fitView
        fitViewOptions={{ padding: 0.2 }}
        minZoom={0.05}
        maxZoom={1.5}
        panOnScroll={true}
        selectionOnDrag={false}
        className="!bg-[#050505]"
        proOptions={{ hideAttribution: true }}
      >
        <Background
          variant={BackgroundVariant.Dots}
          gap={24}
          size={1}
          color="rgba(255, 255, 255, 0.05)"
        />
        <Controls 
          className="!bg-[#0f0f0f]/90 !border-white/[0.06] !rounded-xl !shadow-2xl [&>button]:!bg-transparent [&>button]:!border-white/[0.06] [&>button]:!text-neutral-400 [&>button:hover]:!bg-white/[0.05] [&>button:hover]:!text-white !mb-24 !ml-6 [&>button]:!w-11 [&>button]:!h-11 [&>button>svg]:!w-5 [&>button>svg]:!h-5" 
        />

        <MiniMap
          nodeColor={() => '#ffffff'}
          className="!bg-[#0f0f0f]/90 !border-white/[0.06] !rounded-xl !shadow-2xl"
          maskColor="rgb(0 0 0 / 0.3)"
        />

        {/* Empty state */}
        {tree.persons.length === 0 && (
          <Panel position="top-center" className="!top-1/2 !-translate-y-1/2">
            <div className="text-center">
              <div className="w-16 h-16 mx-auto mb-4 rounded-2xl bg-white/[0.03] border border-white/[0.06] flex items-center justify-center">
                <svg className="w-8 h-8 text-neutral-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M18 9v3m0 0v3m0-3h3m-3 0h-3m-2-5a4 4 0 11-8 0 4 4 0 018 0zM3 20a6 6 0 0112 0v1H3v-1z" />
                </svg>
              </div>
              <h3 className="text-lg font-semibold text-neutral-300 mb-2">
                Start Your Family Tree
              </h3>
              <p className="text-sm text-neutral-600 mb-4">
                Click &quot;Add Person&quot; to add your first family member
              </p>
              <button
                onClick={() => setShowAddPerson(true)}
                className="px-6 py-2.5 rounded-xl text-sm font-medium text-black bg-white hover:bg-neutral-200 transition-all duration-300"
              >
                Add First Person
              </button>
            </div>
          </Panel>
        )}
      </ReactFlow>

      {/* Side Panel */}
      <PersonPanel
        person={selectedPerson}
        allPersons={tree.persons}
        onClose={() => setSelectedPersonId(null)}
        onEdit={handleEditPerson}
        onDelete={handleDeletePerson}
        onAddRelationship={handleAddRelationship}
        onRemoveRelationship={handleRemoveRelationship}
        onSelectPerson={handleSelectPerson}
        onFindRelationship={() => {
          if (selectedPerson) {
            setFindingRelationWith(selectedPerson);
            setRelationshipResult(null);
            showToast(`Now select another person to find relationship...`);
          }
        }}
        findingRelationWith={findingRelationWith}
        relationshipResult={relationshipResult}
      />

      {/* Modals */}
      <AddPersonModal
        isOpen={showAddPerson}
        onClose={() => setShowAddPerson(false)}
        onAdd={handleAddPerson}
      />

      <ConnectRelationshipModal
        isOpen={showConnectModal}
        onClose={() => setShowConnectModal(false)}
        sourcePerson={tree.persons.find((p) => p.id === connectSourceId) || null}
        relationshipType={connectType}
        allPersons={tree.persons}
        onConnect={handleConnectRelationship}
      />

      <ConfirmDialog
        isOpen={showDeleteConfirm}
        title="Delete Person"
        message="This will remove the person and all their relationships. This action cannot be undone."
        confirmLabel="Delete"
        onConfirm={confirmDelete}
        onCancel={() => {
          setShowDeleteConfirm(false);
          setDeleteTargetId(null);
        }}
        variant="danger"
      />

      <ShareModal
        isOpen={showShareModal}
        onClose={() => setShowShareModal(false)}
        shareUrl={shareUrl}
      />

      {/* Toast */}
      {toast && (
        <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-50 px-5 py-2.5 rounded-full bg-white text-black text-sm font-medium shadow-[0_0_30px_rgba(255,255,255,0.1)] animate-fade-in">
          {toast}
        </div>
      )}
    </div>
  );
}
