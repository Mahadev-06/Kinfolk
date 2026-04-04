'use client';

import { useState, useMemo } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Person } from '@/lib/types';
import { getInitials, getGenderColor } from '@/lib/utils';

interface ConnectRelationshipModalProps {
  isOpen: boolean;
  onClose: () => void;
  sourcePerson: Person | null;
  relationshipType: 'parent' | 'spouse' | 'child' | 'custom';
  allPersons: Person[];
  onConnect: (targetId: string, customType?: string) => void;
}

export default function ConnectRelationshipModal({
  isOpen,
  onClose,
  sourcePerson,
  relationshipType,
  allPersons,
  onConnect,
}: ConnectRelationshipModalProps) {
  const [search, setSearch] = useState('');
  const [customRelationType, setCustomRelationType] = useState('brother');

  const availablePersons = useMemo(() => {
    if (!sourcePerson) return [];

    return allPersons.filter((p) => {
      if (p.id === sourcePerson.id) return false;
      if (relationshipType === 'parent' && sourcePerson.parents.includes(p.id)) return false;
      if (relationshipType === 'spouse' && sourcePerson.spouse.includes(p.id)) return false;
      if (relationshipType === 'child' && sourcePerson.children.includes(p.id)) return false;
      if (search && !p.name.toLowerCase().includes(search.toLowerCase())) return false;
      return true;
    });
  }, [sourcePerson, allPersons, relationshipType, search]);

  const typeLabels = {
    parent: { title: 'Add Parent', desc: 'Select a person to add as parent' },
    spouse: { title: 'Add Spouse', desc: 'Select a person to add as spouse' },
    child: { title: 'Add Child', desc: 'Select a person to add as child' },
    custom: { title: 'Add Custom Relation', desc: 'Select a person and define the relation type' },
  };

  const label = typeLabels[relationshipType] || typeLabels.custom;

  return (
    <AnimatePresence>
      {isOpen && sourcePerson && (
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
            className="bg-[#0f0f0f] rounded-2xl p-6 max-w-md w-full shadow-2xl border border-white/[0.06] max-h-[80vh] flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            <div className="mb-4">
              <h3 className="text-lg font-semibold text-white">
                {label.title}
              </h3>
              <p className="text-sm text-neutral-500">
                {label.desc} for <strong className="text-white">{sourcePerson.name}</strong>
              </p>
            </div>

            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name..."
              className="w-full px-4 py-2.5 rounded-xl bg-night-input border border-white/[0.08] text-white placeholder-neutral-600 focus:outline-none focus:ring-1 focus:ring-white/30 text-sm mb-4 transition-all duration-300"
            />

            {relationshipType === 'custom' && (
              <div className="mb-4">
                <label className="block text-xs font-medium text-neutral-500 mb-1.5 tracking-wide uppercase">Relation Type</label>
                <select
                  value={customRelationType}
                  onChange={(e) => setCustomRelationType(e.target.value)}
                  className="w-full px-3 py-2.5 rounded-lg bg-night-input border border-white/[0.08] text-white text-sm focus:outline-none focus:ring-1 focus:ring-white/30 transition-all duration-300"
                >
                  <option value="brother">Brother</option>
                  <option value="sister">Sister</option>
                  <option value="cousin">Cousin</option>
                  <option value="uncle">Uncle</option>
                  <option value="aunt">Aunt</option>
                  <option value="friend">Friend</option>
                  <option value="other">Other</option>
                </select>
              </div>
            )}

            <div className="flex-1 overflow-y-auto space-y-1.5 min-h-0">
              {availablePersons.length > 0 ? (
                availablePersons.map((person) => (
                  <button
                    key={person.id}
                    onClick={() => {
                      onConnect(person.id, relationshipType === 'custom' ? customRelationType : undefined);
                      setSearch('');
                      onClose();
                    }}
                    className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl hover:bg-white/[0.05] transition-all duration-300 text-left"
                  >
                    <div
                      className="w-9 h-9 rounded-full flex items-center justify-center text-xs font-bold shrink-0"
                      style={{ backgroundColor: getGenderColor(person.gender), color: '#000' }}
                    >
                      {getInitials(person.name)}
                    </div>
                    <div className="min-w-0">
                      <div className="text-sm font-medium text-white truncate">
                        {person.name}
                      </div>
                      <div className="text-xs text-neutral-600">
                        {person.gender} {person.birthDate && `• ${person.birthDate}`}
                      </div>
                    </div>
                  </button>
                ))
              ) : (
                <div className="text-center py-8 text-sm text-neutral-600">
                  {allPersons.length <= 1
                    ? 'Add more people to create relationships'
                    : 'No available persons to connect'}
                </div>
              )}
            </div>

            <button
              onClick={onClose}
              className="w-full mt-4 py-2.5 rounded-xl bg-night-elevated text-neutral-400 text-sm font-medium hover:bg-night-border hover:text-white transition-all duration-300"
            >
              Cancel
            </button>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
