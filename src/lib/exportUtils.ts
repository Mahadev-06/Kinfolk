import { toPng } from 'html-to-image';
import { FamilyTree } from './types';

/**
 * Export the React Flow canvas as a PNG image.
 */
export async function exportToPng(element: HTMLElement, fileName: string): Promise<void> {
  try {
    const dataUrl = await toPng(element, {
      backgroundColor: '#0f172a',
      quality: 1,
      pixelRatio: 2,
    });
    const link = document.createElement('a');
    link.download = `${fileName}.png`;
    link.href = dataUrl;
    link.click();
  } catch (err) {
    console.error('Failed to export PNG:', err);
    throw err;
  }
}

/**
 * Download a family tree as a JSON file.
 */
export function downloadJson(tree: FamilyTree): void {
  const json = JSON.stringify(tree, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  link.download = `${tree.name.replace(/\s+/g, '_')}_backup.json`;
  link.href = url;
  link.click();
  URL.revokeObjectURL(url);
}

/**
 * Import a JSON file and parse it as a FamilyTree.
 */
export function importJson(file: File): Promise<FamilyTree> {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      try {
        const data = JSON.parse(e.target?.result as string) as FamilyTree;
        // Basic validation
        if (!data.id || !data.name || !Array.isArray(data.persons)) {
          throw new Error('Invalid family tree file format.');
        }
        resolve(data);
      } catch (err) {
        reject(err);
      }
    };
    reader.onerror = () => reject(new Error('Failed to read file.'));
    reader.readAsText(file);
  });
}
