'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Person } from '@/lib/types';
import { getInitials, getGenderColor, getGenderIcon, formatDate } from '@/lib/utils';

interface PersonPanelProps {
  person: Person | null;
  allPersons: Person[];
  onClose: () => void;
  onEdit: (person: Person) => void;
  onDelete: (personId: string) => void;
  onAddRelationship: (personId: string, type: 'parent' | 'spouse' | 'child' | 'custom') => void;
  onRemoveRelationship: (personAId: string, personBId: string, type: 'parent-child' | 'spouse' | 'custom', relId?: string) => void;
  onSelectPerson: (personId: string) => void;
}

export default function PersonPanel({
  person,
  allPersons,
  onClose,
  onEdit,
  onDelete,
  onAddRelationship,
  onRemoveRelationship,
  onSelectPerson,
}: PersonPanelProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [editName, setEditName] = useState('');
  const [editGender, setEditGender] = useState<Person['gender']>('male');
  const [editBirth, setEditBirth] = useState('');
  const [editDeath, setEditDeath] = useState('');

  const startEdit = () => {
    if (!person) return;
    setEditName(person.name);
    setEditGender(person.gender);
    setEditBirth(person.birthDate || '');
    setEditDeath(person.deathDate || '');
    setIsEditing(true);
  };

  const saveEdit = () => {
    if (!person || !editName.trim()) return;
    onEdit({
      ...person,
      name: editName.trim(),
      gender: editGender,
      birthDate: editBirth || undefined,
      deathDate: editDeath || undefined,
    });
    setIsEditing(false);
  };

  const getPersonById = (id: string) => allPersons.find((p) => p.id === id);

  return (
    <AnimatePresence>
      {person && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.2 }}
          className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
          onClick={onClose}
        >
          <motion.div
            initial={{ scale: 0.95, opacity: 0, y: 10 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.95, opacity: 0, y: 10 }}
            transition={{ type: 'spring', stiffness: 400, damping: 30 }}
            className="relative w-full max-w-[380px] max-h-[85vh] bg-[#0f0f0f]/95 backdrop-blur-2xl border border-white/[0.08] shadow-[0_0_80px_rgba(0,0,0,0.8)] rounded-3xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
          {/* Header */}
          <div className="shrink-0 bg-white/[0.02] border-b border-white/[0.06] p-4 flex items-center justify-between">
            <h3 className="font-semibold text-white tracking-wide">Person Details</h3>
            <button
              onClick={onClose}
              className="p-1.5 rounded-full hover:bg-white/[0.1] text-neutral-500 hover:text-white transition-colors duration-300"
            >
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          </div>

          <div className="p-5 space-y-6 overflow-y-auto flex-1 min-h-0 custom-scrollbar pb-6">
            {isEditing ? (
              <div className="space-y-4">
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">Name</label>
                  <input
                    type="text"
                    value={editName}
                    onChange={(e) => setEditName(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-night-input border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">Gender</label>
                  <select
                    value={editGender}
                    onChange={(e) => setEditGender(e.target.value as Person['gender'])}
                    className="w-full px-3 py-2.5 rounded-lg bg-night-input border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300"
                  >
                    <option value="male">Male</option>
                    <option value="female">Female</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">Birth Date</label>
                  <input
                    type="date"
                    value={editBirth}
                    onChange={(e) => setEditBirth(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-night-input border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300"
                  />
                </div>
                <div>
                  <label className="block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">Death Date</label>
                  <input
                    type="date"
                    value={editDeath}
                    onChange={(e) => setEditDeath(e.target.value)}
                    className="w-full px-3 py-2.5 rounded-lg bg-night-input border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300"
                  />
                </div>
                <div className="flex gap-2">
                  <button
                    onClick={() => setIsEditing(false)}
                    className="flex-1 py-2.5 rounded-lg bg-night-elevated text-neutral-400 text-sm font-medium hover:bg-night-border hover:text-white transition-all duration-300"
                  >
                    Cancel
                  </button>
                  <button
                    onClick={saveEdit}
                    className="flex-1 py-2.5 rounded-lg bg-white text-black text-sm font-medium hover:bg-neutral-200 transition-all duration-300"
                  >
                    Save
                  </button>
                </div>
              </div>
            ) : (
              <>
                {/* Profile */}
                <div className="text-center">
                  <label className="inline-block relative mb-3 cursor-pointer group">
                    {person.profileImage ? (
                      <img
                        src={person.profileImage}
                        alt={person.name}
                        className="w-20 h-20 rounded-full object-cover border-2 border-white/20 group-hover:border-white/50 transition-all duration-300"
                      />
                    ) : (
                      <div
                        className="w-20 h-20 rounded-full flex items-center justify-center text-2xl font-bold border-2 border-white/10 group-hover:border-white/40 transition-all duration-300"
                        style={{ backgroundColor: getGenderColor(person.gender), color: '#000' }}
                      >
                        {getInitials(person.name)}
                      </div>
                    )}
                    <div className="absolute inset-0 bg-black/50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all duration-300">
                      <svg className="w-7 h-7 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-8l-4-4m0 0L8 8m4-4v12" />
                      </svg>
                    </div>
                    <span className="absolute -bottom-1 -right-1 text-lg bg-night-card rounded-full w-8 h-8 flex items-center justify-center border border-white/[0.08] shadow-lg">
                      {getGenderIcon(person.gender)}
                    </span>
                    <input
                      type="file"
                      accept="image/*"
                      className="hidden"
                      onChange={(e) => {
                        const file = e.target.files?.[0];
                        if (file) {
                          const reader = new FileReader();
                          reader.onload = (ev) => {
                            onEdit({ ...person, profileImage: ev.target?.result as string });
                          };
                          reader.readAsDataURL(file);
                        }
                      }}
                    />
                  </label>
                  <h4 className="text-lg font-bold text-white">{person.name}</h4>
                  {(person.birthDate || person.deathDate) && (
                    <p className="text-sm text-neutral-500 mt-1">
                      {formatDate(person.birthDate)}
                      {person.deathDate && ` — ${formatDate(person.deathDate)}`}
                    </p>
                  )}
                </div>

                {/* Actions */}
                <div className="flex gap-2">
                  <button
                    onClick={startEdit}
                    className="flex-1 py-2.5 rounded-lg bg-night-elevated text-neutral-400 text-sm font-medium hover:bg-white/[0.1] hover:text-white transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                    </svg>
                    Edit
                  </button>
                  <button
                    onClick={() => onDelete(person.id)}
                    className="flex-1 py-2.5 rounded-lg bg-white/[0.03] text-neutral-500 text-sm font-medium hover:bg-red-950/30 hover:text-red-400 transition-all duration-300 flex items-center justify-center gap-1.5"
                  >
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                    </svg>
                    Delete
                  </button>
                </div>

                {/* Relationships */}
                <div className="space-y-4">
                  <RelationshipSection
                    title="Parents"
                    icon="↑"
                    ids={person.parents}
                    allPersons={allPersons}
                    onAdd={() => onAddRelationship(person.id, 'parent')}
                    onRemove={(relId) => onRemoveRelationship(relId, person.id, 'parent-child')}
                    onSelect={onSelectPerson}
                    getPersonById={getPersonById}
                  />
                  <RelationshipSection
                    title="Spouse"
                    icon="♥"
                    ids={person.spouse}
                    allPersons={allPersons}
                    onAdd={() => onAddRelationship(person.id, 'spouse')}
                    onRemove={(relId) => onRemoveRelationship(person.id, relId, 'spouse')}
                    onSelect={onSelectPerson}
                    getPersonById={getPersonById}
                  />
                  <RelationshipSection
                    title="Children"
                    icon="↓"
                    ids={person.children}
                    allPersons={allPersons}
                    onAdd={() => onAddRelationship(person.id, 'child')}
                    onRemove={(relId) => onRemoveRelationship(person.id, relId, 'parent-child')}
                    onSelect={onSelectPerson}
                    getPersonById={getPersonById}
                  />

                  {/* Custom Relations Dynamic Rendering */}
                  {person.customRelations && person.customRelations.length > 0 && (
                    <div className="pt-2">
                       {Object.entries(
                        person.customRelations.reduce((acc, rel) => {
                          acc[rel.type] = acc[rel.type] || [];
                          acc[rel.type].push(rel);
                          return acc;
                        }, {} as Record<string, { id: string; targetId: string; type: string }[]>)
                      ).map(([type, rels]) => (
                        <RelationshipSection
                          key={type}
                          title={`${type}s`}
                          icon="✧"
                          ids={rels.map((r) => r.targetId)}
                          allPersons={allPersons}
                          onAdd={() => onAddRelationship(person.id, 'custom')}
                          onRemove={(targetId) => {
                            const rel = rels.find(r => r.targetId === targetId);
                            if (rel) onRemoveRelationship(person.id, targetId, 'custom', rel.id);
                          }}
                          onSelect={onSelectPerson}
                          getPersonById={getPersonById}
                          hideAddButton={true}
                        />
                      ))}
                    </div>
                  )}

                  {/* Add Custom button */}
                  <div className="pt-2 border-t border-white/[0.06]">
                    <button
                      onClick={() => onAddRelationship(person.id, 'custom')}
                      className="w-full py-2 rounded-lg border border-dashed border-white/[0.1] text-xs font-medium text-neutral-400 hover:text-white hover:border-white/30 transition-all duration-300"
                    >
                      + Add Custom Relation
                    </button>
                  </div>
                </div>

                {/* Bottom spacer is removed as photo upload moved to Avatar */}
              </>
            )}
          </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}

function RelationshipSection({
  title,
  icon,
  ids,
  allPersons,
  onAdd,
  onRemove,
  onSelect,
  getPersonById,
  hideAddButton = false,
}: {
  title: string;
  icon: string;
  ids: string[];
  allPersons: Person[];
  onAdd: () => void;
  onRemove: (relId: string) => void;
  onSelect: (personId: string) => void;
  getPersonById: (id: string) => Person | undefined;
  hideAddButton?: boolean;
}) {
  return (
    <div className="mb-4 last:mb-0">
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs font-medium text-neutral-600 uppercase tracking-wider">
          {icon} {title}
        </span>
        {!hideAddButton && (
          <button
            onClick={onAdd}
            className="text-xs text-neutral-500 hover:text-white font-medium flex items-center gap-1 transition-colors duration-300"
          >
            <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v16m8-8H4" />
            </svg>
            Add
          </button>
        )}
      </div>
      {ids.length > 0 ? (
        <div className="space-y-1.5">
          {ids.map((id) => {
            const rel = getPersonById(id);
            if (!rel) return null;
            return (
              <div
                key={id}
                className="flex items-center justify-between px-3 py-2 rounded-lg bg-night-surface group"
              >
                <button
                  onClick={() => onSelect(id)}
                  className="flex items-center gap-2 text-sm text-neutral-400 hover:text-white transition-colors duration-300 min-w-0"
                >
                  <div
                    className="w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold shrink-0"
                    style={{ backgroundColor: getGenderColor(rel.gender), color: '#000' }}
                  >
                    {getInitials(rel.name)}
                  </div>
                  <span className="truncate">{rel.name}</span>
                </button>
                <button
                  onClick={() => onRemove(id)}
                  className="opacity-0 group-hover:opacity-100 text-neutral-600 hover:text-red-400 transition-all duration-300 p-1"
                  title="Remove relationship"
                >
                  <svg className="w-3.5 h-3.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            );
          })}
        </div>
      ) : (
        <p className="text-xs text-neutral-700 italic">None</p>
      )}
    </div>
  );
}
