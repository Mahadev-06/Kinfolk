import { Person, FamilyTree } from './types';
import { generateId } from './utils';

export function createSeedData(): FamilyTree {
  const grandpa: Person = {
    id: 'seed-grandpa',
    name: 'Robert Johnson',
    gender: 'male',
    birthDate: '1940-03-15',
    deathDate: '2015-11-20',
    parents: [],
    spouse: ['seed-grandma'],
    children: ['seed-dad', 'seed-aunt'],
  };

  const grandma: Person = {
    id: 'seed-grandma',
    name: 'Margaret Johnson',
    gender: 'female',
    birthDate: '1942-07-22',
    parents: [],
    spouse: ['seed-grandpa'],
    children: ['seed-dad', 'seed-aunt'],
  };

  const dad: Person = {
    id: 'seed-dad',
    name: 'James Johnson',
    gender: 'male',
    birthDate: '1965-01-10',
    parents: ['seed-grandpa', 'seed-grandma'],
    spouse: ['seed-mom'],
    children: ['seed-child1', 'seed-child2'],
  };

  const mom: Person = {
    id: 'seed-mom',
    name: 'Sarah Johnson',
    gender: 'female',
    birthDate: '1968-05-28',
    parents: [],
    spouse: ['seed-dad'],
    children: ['seed-child1', 'seed-child2'],
  };

  const aunt: Person = {
    id: 'seed-aunt',
    name: 'Elizabeth Parker',
    gender: 'female',
    birthDate: '1970-09-12',
    parents: ['seed-grandpa', 'seed-grandma'],
    spouse: ['seed-uncle'],
    children: ['seed-cousin'],
  };

  const uncle: Person = {
    id: 'seed-uncle',
    name: 'William Parker',
    gender: 'male',
    birthDate: '1967-04-03',
    parents: [],
    spouse: ['seed-aunt'],
    children: ['seed-cousin'],
  };

  const child1: Person = {
    id: 'seed-child1',
    name: 'Emily Johnson',
    gender: 'female',
    birthDate: '1995-12-01',
    parents: ['seed-dad', 'seed-mom'],
    spouse: [],
    children: [],
  };

  const child2: Person = {
    id: 'seed-child2',
    name: 'Michael Johnson',
    gender: 'male',
    birthDate: '1998-08-14',
    parents: ['seed-dad', 'seed-mom'],
    spouse: [],
    children: [],
  };

  const cousin: Person = {
    id: 'seed-cousin',
    name: 'Sophie Parker',
    gender: 'female',
    birthDate: '1997-06-20',
    parents: ['seed-aunt', 'seed-uncle'],
    spouse: [],
    children: [],
  };

  return {
    id: generateId(),
    name: 'The Johnson Family',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    persons: [grandpa, grandma, dad, mom, aunt, uncle, child1, child2, cousin],
  };
}
