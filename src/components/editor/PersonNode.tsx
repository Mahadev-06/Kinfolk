'use client';

import { memo } from 'react';
import { Handle, Position, type NodeProps } from '@xyflow/react';
import { Person } from '@/lib/types';
import { getInitials, getGenderColor, getGenderIcon } from '@/lib/utils';

interface PersonNodeData {
  person: Person;
  [key: string]: unknown;
}

function PersonNodeComponent({ data, selected }: NodeProps) {
  const { person } = data as PersonNodeData;
  const genderColor = getGenderColor(person.gender);

  return (
    <>
      <Handle
        type="target"
        position={Position.Top}
        className="!w-3 !h-3 !border-2 !border-night-card !-top-1.5"
        style={{ backgroundColor: genderColor }}
      />
      <div
        className={`
          w-[200px] bg-night-card rounded-xl border 
          shadow-lg hover:shadow-xl transition-all duration-300 cursor-pointer
        `}
        style={{ 
          borderColor: selected ? genderColor : `${genderColor}35`,
          boxShadow: selected ? `0 0 20px ${genderColor}30` : undefined
        }}
      >
        <div className="p-3 flex items-center gap-3">
          {/* Avatar */}
          <div className="relative shrink-0">
            {person.profileImage ? (
              <img
                src={person.profileImage}
                alt={person.name}
                className="w-11 h-11 rounded-full object-cover border-2 border-white/20"
              />
            ) : (
              <div
                className="w-11 h-11 rounded-full flex items-center justify-center text-sm font-bold border-2 border-white/10"
                style={{ backgroundColor: genderColor, color: '#000' }}
              >
                {getInitials(person.name)}
              </div>
            )}
            <span
              className="absolute -bottom-0.5 -right-0.5 text-xs bg-night-card rounded-full w-5 h-5 flex items-center justify-center border"
              style={{ color: genderColor, borderColor: `${genderColor}50` }}
              title={person.gender}
            >
              {getGenderIcon(person.gender)}
            </span>
          </div>

          {/* Info */}
          <div className="min-w-0 flex-1">
            <div className="text-sm font-semibold text-white truncate">
              {person.name}
            </div>
            {person.birthDate && (
              <div className="text-xs text-neutral-500 truncate">
                {person.birthDate}
                {person.deathDate && ` — ${person.deathDate}`}
              </div>
            )}
          </div>
        </div>

        {/* Bottom stats bar */}
        <div className="px-3 py-1.5 bg-night-surface rounded-b-[10px] flex items-center gap-3 text-[10px] text-neutral-600">
          {person.parents.length > 0 && (
            <span>↑ {person.parents.length} parent{person.parents.length > 1 ? 's' : ''}</span>
          )}
          {person.spouse.length > 0 && (
            <span>♥ {person.spouse.length}</span>
          )}
          {person.children.length > 0 && (
            <span>↓ {person.children.length} child{person.children.length > 1 ? 'ren' : ''}</span>
          )}
        </div>
      </div>
      <Handle
        type="source"
        position={Position.Bottom}
        className="!w-3 !h-3 !border-2 !border-night-card !-bottom-1.5"
        style={{ backgroundColor: genderColor }}
      />
    </>
  );
}

export default memo(PersonNodeComponent);
