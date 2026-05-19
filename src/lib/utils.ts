import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function generateId(): string {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 9);
}

export function getInitials(name: string): string {
  if (!name) return '';
  return name
    .split(' ')
    .map((part) => part[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
}

export function getGenderColor(gender: string): string {
  switch (gender) {
    case 'male':
      return '#38bdf8'; // Sky blue
    case 'female':
      return '#f472b6'; // Pink
    default:
      return '#a855f7'; // Purple
  }
}

export function getGenderIcon(gender: string): string {
  switch (gender) {
    case 'male':
      return '♂';
    case 'female':
      return '♀';
    default:
      return '⚥';
  }
}

export function formatDate(dateStr?: string): string {
  if (!dateStr) return '';
  try {
    return new Date(dateStr).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateStr;
  }
}
