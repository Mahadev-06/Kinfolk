import { createClient } from '@/lib/supabase/client';
import { FamilyTree, Person } from './types';
import { v4 as uuidv4 } from 'uuid';

export async function loadTrees(): Promise<FamilyTree[]> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  
  if (!user) return [];

  const { data, error } = await supabase
    .from('trees')
    .select('*')
    .order('updated_at', { ascending: false });

  if (error) {
    console.error('Error loading trees:', error);
    return [];
  }

  return data.map((item: any) => ({
    id: item.id,
    user_id: item.user_id,
    name: item.name,
    is_public: item.is_public,
    persons: (item.data as any).persons || [],
    createdAt: item.created_at,
    updatedAt: item.updated_at
  }));
}

export async function getTree(id: string): Promise<FamilyTree | null> {
  const supabase = createClient();
  const { data, error } = await supabase
    .from('trees')
    .select('*')
    .eq('id', id)
    .single();

  if (error || !data) {
    console.error('Error fetching tree:', error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    is_public: data.is_public,
    persons: (data.data as any).persons || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function saveTree(tree: FamilyTree): Promise<FamilyTree | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  const treeData = {
    user_id: user.id,
    name: tree.name,
    is_public: tree.is_public ?? false,
    data: { persons: tree.persons },
    updated_at: new Date().toISOString(),
  };

  const { data, error } = await supabase
    .from('trees')
    .upsert({ 
      id: tree.id?.match(/^[0-9a-fA-F-]{36}$/) ? tree.id : undefined,
      ...treeData 
    })
    .select()
    .single();

  if (error) {
    console.error('Error saving tree:', error);
    return null;
  }

  return {
    id: data.id,
    user_id: data.user_id,
    name: data.name,
    is_public: data.is_public,
    persons: (data.data as any).persons || [],
    createdAt: data.created_at,
    updatedAt: data.updated_at
  };
}

export async function deleteTree(id: string): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('trees')
    .delete()
    .eq('id', id);

  if (error) {
    console.error('Error deleting tree:', error);
    return false;
  }
  return true;
}

export async function shareTree(id: string, isPublic: boolean): Promise<boolean> {
  const supabase = createClient();
  const { error } = await supabase
    .from('trees')
    .update({ is_public: isPublic })
    .eq('id', id);

  if (error) {
    console.error('Error sharing tree:', error);
    return false;
  }
  return true;
}

export async function cloneTree(tree: FamilyTree): Promise<FamilyTree | null> {
  const supabase = createClient();
  const { data: { user } } = await supabase.auth.getUser();
  if (!user) return null;

  // 1. Generate new IDs and create a mapping
  const idMap = new Map<string, string>();
  tree.persons.forEach(p => {
    idMap.set(p.id, uuidv4());
  });

  // 2. Transfrom persons with new IDs
  const newPersons: Person[] = tree.persons.map(p => ({
    ...p,
    id: idMap.get(p.id)!,
    parents: p.parents.map(oldId => idMap.get(oldId) || oldId),
    spouse: p.spouse.map(oldId => idMap.get(oldId) || oldId),
    children: p.children.map(oldId => idMap.get(oldId) || oldId),
    customRelations: p.customRelations?.map(rel => ({
      ...rel,
      targetId: idMap.get(rel.targetId) || rel.targetId
    }))
  }));

  // 3. Create the new tree
  const newTree: FamilyTree = {
    id: uuidv4(),
    name: `${tree.name} (Imported)`,
    persons: newPersons,
    is_public: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString()
  };

  return await saveTree(newTree);
}
