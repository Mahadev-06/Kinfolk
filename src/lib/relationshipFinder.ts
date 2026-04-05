import { Person } from '@/lib/types';

interface RelationPath {
  person: Person;
  relation: string;
}

export function findRelationship(allPersons: Person[], startId: string, endId: string): string {
  if (startId === endId) return "Same person selected.";

  const queue: { id: string; path: RelationPath[] }[] = [{ id: startId, path: [] }];
  const visited = new Set<string>();
  visited.add(startId);

  while (queue.length > 0) {
    const { id, path } = queue.shift()!;
    const person = allPersons.find(p => p.id === id);
    if (!person) continue;

    if (id === endId) {
      return formatRelationshipPath(path, person.name);
    }

    // Neighbors: Parents, Spouse, Children, Custom
    const neighbors: { id: string; type: string }[] = [];
    
    person.parents?.forEach(pId => neighbors.push({ id: pId, type: 'parent' }));
    person.spouse?.forEach(sId => neighbors.push({ id: sId, type: 'spouse' }));
    person.children?.forEach(cId => neighbors.push({ id: cId, type: 'child' }));
    person.customRelations?.forEach(rel => neighbors.push({ id: rel.targetId, type: rel.type }));

    for (const neighbor of neighbors) {
      if (!visited.has(neighbor.id)) {
        visited.add(neighbor.id);
        const neighborPerson = allPersons.find(p => p.id === neighbor.id);
        if (neighborPerson) {
          queue.push({
            id: neighbor.id,
            path: [...path, { person, relation: neighbor.type }]
          });
        }
      }
    }
  }

  return "No direct relationship found.";
}

function formatRelationshipPath(path: RelationPath[], targetName: string): string {
  if (path.length === 0) return "";
  
  // Simple direct mappings for single-step relationships
  if (path.length === 1) {
    const rel = path[0].relation.toLowerCase();
    if (rel === 'parent') return `is the Child of ${targetName}`;
    if (rel === 'child') return `is the Parent of ${targetName}`;
    if (rel === 'spouse') return `is the Spouse of ${targetName}`;
    return `is the ${rel} of ${targetName}`;
  }

  // 2-step relationships
  if (path.length === 2) {
    const r1 = path[0].relation.toLowerCase();
    const r2 = path[1].relation.toLowerCase();

    // Sibling: Child of Parent
    if (r1 === 'parent' && r2 === 'child') return `is the Sibling of ${targetName}`;
    
    // Grandparent: Parent of Parent
    if (r1 === 'parent' && r2 === 'parent') return `is the Grandchild of ${targetName}`;
    
    // Grandchild: Child of Child
    if (r1 === 'child' && r2 === 'child') return `is the Grandparent of ${targetName}`;

    // In-laws or complex
    return `is connected to ${targetName} via ${path[1].person.name}`;
  }

  return `is related to ${targetName} (distance: ${path.length} steps)`;
}
