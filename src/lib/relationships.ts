import { Person } from './types';

/**
 * Add a parent-child relationship (bidirectional).
 * Updates parent.children and child.parents.
 */
export function addChild(
  persons: Person[],
  parentId: string,
  childId: string
): Person[] {
  if (parentId === childId) throw new Error('A person cannot be their own child.');
  if (wouldCreateCycle(persons, parentId, childId)) {
    throw new Error('This relationship would create a circular parent-child loop.');
  }

  return persons.map((p) => {
    if (p.id === parentId && !p.children.includes(childId)) {
      return { ...p, children: [...p.children, childId] };
    }
    if (p.id === childId && !p.parents.includes(parentId)) {
      return { ...p, parents: [...p.parents, parentId] };
    }
    return p;
  });
}

/**
 * Add a spouse relationship (bidirectional).
 */
export function addSpouse(
  persons: Person[],
  personAId: string,
  personBId: string
): Person[] {
  if (personAId === personBId) throw new Error('A person cannot be their own spouse.');

  return persons.map((p) => {
    if (p.id === personAId && !p.spouse.includes(personBId)) {
      return { ...p, spouse: [...p.spouse, personBId] };
    }
    if (p.id === personBId && !p.spouse.includes(personAId)) {
      return { ...p, spouse: [...p.spouse, personAId] };
    }
    return p;
  });
}

/**
 * Add a custom relationship.
 */
export function addCustomRelationship(
  persons: Person[],
  personAId: string,
  personBId: string,
  type: string
): Person[] {
  if (personAId === personBId) throw new Error('A person cannot have a Custom Relation to themselves.');

  return persons.map((p) => {
    if (p.id === personAId) {
      const exists = (p.customRelations || []).some((r) => r.targetId === personBId && r.type === type);
      if (!exists) {
        return {
          ...p,
          customRelations: [
            ...(p.customRelations || []),
            { id: `${personAId}-${personBId}-${type}`, targetId: personBId, type },
          ],
        };
      }
    }
    return p;
  });
}

/**
 * Remove a specific relationship between two persons.
 */
export function removeRelationship(
  persons: Person[],
  personAId: string,
  personBId: string,
  type: 'parent-child' | 'spouse' | 'custom',
  relId?: string
): Person[] {
  if (type === 'custom' && relId) {
    return persons.map((p) => {
      if (p.id === personAId && p.customRelations) {
        return { ...p, customRelations: p.customRelations.filter((r) => r.id !== relId) };
      }
      return p;
    });
  }
  if (type === 'spouse') {
    return persons.map((p) => {
      if (p.id === personAId) {
        return { ...p, spouse: p.spouse.filter((id) => id !== personBId) };
      }
      if (p.id === personBId) {
        return { ...p, spouse: p.spouse.filter((id) => id !== personAId) };
      }
      return p;
    });
  }

  // parent-child: personA is parent, personB is child
  return persons.map((p) => {
    if (p.id === personAId) {
      return { ...p, children: p.children.filter((id) => id !== personBId) };
    }
    if (p.id === personBId) {
      return { ...p, parents: p.parents.filter((id) => id !== personAId) };
    }
    return p;
  });
}

/**
 * Remove a person and clean up all references to them from every other person.
 */
export function removePerson(persons: Person[], personId: string): Person[] {
  return persons
    .filter((p) => p.id !== personId)
    .map((p) => ({
      ...p,
      parents: p.parents.filter((id) => id !== personId),
      children: p.children.filter((id) => id !== personId),
      spouse: p.spouse.filter((id) => id !== personId),
      customRelations: (p.customRelations || []).filter((r) => r.targetId !== personId),
    }));
}

/**
 * Detect if adding parentId as a parent of childId would create a cycle.
 * A cycle exists if childId is already an ancestor of parentId.
 */
function wouldCreateCycle(
  persons: Person[],
  parentId: string,
  childId: string
): boolean {
  const personMap = new Map(persons.map((p) => [p.id, p]));
  const visited = new Set<string>();

  function isAncestor(currentId: string, targetId: string): boolean {
    if (currentId === targetId) return true;
    if (visited.has(currentId)) return false;
    visited.add(currentId);

    const current = personMap.get(currentId);
    if (!current) return false;

    for (const pid of current.parents) {
      if (isAncestor(pid, targetId)) return true;
    }
    return false;
  }

  // Check if parentId is a descendant of childId (which would create a cycle)
  // i.e., is childId an ancestor of parentId?
  return isAncestor(parentId, childId);
}

/**
 * Validate the entire person array for consistency.
 */
export function validatePersons(persons: Person[]): string[] {
  const errors: string[] = [];
  const ids = new Set(persons.map((p) => p.id));

  for (const person of persons) {
    // Check for references to non-existent persons
    for (const parentId of person.parents) {
      if (!ids.has(parentId)) {
        errors.push(`${person.name} references non-existent parent ${parentId}`);
      }
    }
    for (const childId of person.children) {
      if (!ids.has(childId)) {
        errors.push(`${person.name} references non-existent child ${childId}`);
      }
    }
    for (const spouseId of person.spouse) {
      if (!ids.has(spouseId)) {
        errors.push(`${person.name} references non-existent spouse ${spouseId}`);
      }
    }

    // Check bidirectional consistency
    for (const childId of person.children) {
      const child = persons.find((p) => p.id === childId);
      if (child && !child.parents.includes(person.id)) {
        errors.push(
          `${person.name} lists ${child.name} as child, but child doesn't list them as parent`
        );
      }
    }
    for (const spouseId of person.spouse) {
      const spouse = persons.find((p) => p.id === spouseId);
      if (spouse && !spouse.spouse.includes(person.id)) {
        errors.push(
          `${person.name} lists ${spouse.name} as spouse, but spouse doesn't list them back`
        );
      }
    }
  }

  return errors;
}
