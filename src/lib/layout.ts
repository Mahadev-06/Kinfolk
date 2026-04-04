import dagre from 'dagre';
import { Person } from './types';
import { type Node, type Edge } from '@xyflow/react';

const NODE_WIDTH = 220;
const NODE_HEIGHT = 100;

export interface LayoutResult {
  nodes: Node[];
  edges: Edge[];
}

/**
 * Derive React Flow edges from person relationships.
 */
export function deriveEdges(persons: Person[]): Edge[] {
  const edges: Edge[] = [];
  const edgeSet = new Set<string>();

  for (const person of persons) {
    // Parent → Child edges
    for (const childId of person.children) {
      const edgeId = `parent-${person.id}-${childId}`;
      if (!edgeSet.has(edgeId)) {
        edgeSet.add(edgeId);
        edges.push({
          id: edgeId,
          source: person.id,
          target: childId,
          type: 'smoothstep',
          style: { stroke: 'rgba(56, 189, 248, 0.4)', strokeWidth: 1.5 },
          label: 'child',
          labelStyle: { fontSize: 10, fill: '#38bdf8' },
          animated: false,
        });
      }
    }

    // Spouse edges (only add once per pair)
    for (const spouseId of person.spouse) {
      const key1 = `spouse-${person.id}-${spouseId}`;
      const key2 = `spouse-${spouseId}-${person.id}`;
      if (!edgeSet.has(key1) && !edgeSet.has(key2)) {
        edgeSet.add(key1);
        edges.push({
          id: key1,
          source: person.id,
          target: spouseId,
          type: 'smoothstep',
          style: { stroke: 'rgba(244, 114, 182, 0.4)', strokeWidth: 1.5, strokeDasharray: '6 3' },
          label: 'spouse',
          labelStyle: { fontSize: 10, fill: '#f472b6' },
          animated: false,
        });
      }
    }
  }

  return edges;
}

/**
 * Compute auto-layout positions using dagre.
 */
export function getLayoutedElements(
  persons: Person[],
  direction: 'TB' | 'LR' = 'TB'
): LayoutResult {
  const g = new dagre.graphlib.Graph();
  g.setDefaultEdgeLabel(() => ({}));

  g.setGraph({
    rankdir: direction,
    nodesep: 160,
    ranksep: 200,
    marginx: 80,
    marginy: 80,
  });

  // Add nodes
  for (const person of persons) {
    // If the person has spouses, we artificially inflate their width
    // in Dagre so it leaves enough room for the side-by-side adjustment.
    const isSpouse = person.spouse.length > 0;
    g.setNode(person.id, { 
      width: isSpouse ? NODE_WIDTH * 1.5 : NODE_WIDTH, 
      height: NODE_HEIGHT 
    });
  }

  // Add edges for layout calculation
  // We use parent→child for hierarchy and spouse as same-rank constraint
  for (const person of persons) {
    for (const childId of person.children) {
      g.setEdge(person.id, childId);
    }
  }

  dagre.layout(g);

  // Build React Flow nodes from dagre positions
  const nodes: Node[] = persons.map((person) => {
    const nodeWithPosition = g.node(person.id);
    return {
      id: person.id,
      type: 'personNode',
      position: {
        x: nodeWithPosition.x - NODE_WIDTH / 2,
        y: nodeWithPosition.y - NODE_HEIGHT / 2,
      },
      data: { person },
    };
  });

  // Now adjust spouse nodes to be side-by-side
  const processedSpouses = new Set<string>();
  for (const person of persons) {
    for (const spouseId of person.spouse) {
      if (processedSpouses.has(person.id) || processedSpouses.has(spouseId)) continue;
      processedSpouses.add(person.id);
      processedSpouses.add(spouseId);

      const nodeA = nodes.find((n) => n.id === person.id);
      const nodeB = nodes.find((n) => n.id === spouseId);
      if (nodeA && nodeB) {
        // Respect dagre's natural left-to-right sorting
        const leftNode = nodeA.position.x < nodeB.position.x ? nodeA : nodeB;
        const rightNode = nodeA.position.x < nodeB.position.x ? nodeB : nodeA;

        // Place spouses at same Y, side by side, perfectly centered
        const avgY = (leftNode.position.y + rightNode.position.y) / 2;
        const avgX = (leftNode.position.x + rightNode.position.x) / 2;
        
        leftNode.position = { x: avgX - NODE_WIDTH / 2 - 25, y: avgY };
        rightNode.position = { x: avgX + NODE_WIDTH / 2 + 25, y: avgY };
      }
    }
  }

  const edges = deriveEdges(persons);

  return { nodes, edges };
}
