export type Gender = 'male' | 'female' | 'other';

export interface Person {
  id: string;
  name: string;
  gender: Gender;
  birthDate?: string;
  deathDate?: string;
  profileImage?: string; // base64 data URL
  parents: string[];     // array of person IDs
  spouse: string[];      // array of person IDs
  children: string[];    // array of person IDs
  customRelations?: { id: string; targetId: string; type: string }[];
}

export interface FamilyTree {
  id: string;
  user_id?: string;
  name: string;
  createdAt: string;
  updatedAt: string;
  is_public?: boolean;
  persons: Person[];
}

export interface StorageData {
  trees: FamilyTree[];
}
