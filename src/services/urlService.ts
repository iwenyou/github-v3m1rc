import { customAlphabet } from 'nanoid';

// Create a custom nanoid generator with a specific alphabet
const generateId = customAlphabet('23456789abcdefghjkmnpqrstuvwxyzABCDEFGHJKMNPQRSTUVWXYZ', 12);

interface UrlMapping {
  id: string;
  originalId: string;
  type: 'quote' | 'receipt' | 'order';
  expiresAt?: string;
}

const URL_MAPPINGS_KEY = 'urlMappings';

function getMappings(): UrlMapping[] {
  try {
    return JSON.parse(localStorage.getItem(URL_MAPPINGS_KEY) || '[]');
  } catch {
    return [];
  }
}

function saveMappings(mappings: UrlMapping[]): void {
  localStorage.setItem(URL_MAPPINGS_KEY, JSON.stringify(mappings));
}

export function generateRandomUrl(originalId: string, type: 'quote' | 'receipt' | 'order', expiresAt?: string): string {
  const mappings = getMappings();
  
  // Check if a mapping already exists
  const existingMapping = mappings.find(m => m.originalId === originalId && m.type === type);
  if (existingMapping) {
    return existingMapping.id;
  }

  // Generate new random ID
  const randomId = generateId();
  
  // Save new mapping
  mappings.push({
    id: randomId,
    originalId,
    type,
    expiresAt
  });
  
  saveMappings(mappings);
  return randomId;
}

export function getOriginalId(randomId: string): string | null {
  const mapping = getMappings().find(m => m.id === randomId);
  
  if (!mapping) {
    return null;
  }

  // Check if URL has expired
  if (mapping.expiresAt && new Date(mapping.expiresAt) < new Date()) {
    // Remove expired mapping
    const mappings = getMappings().filter(m => m.id !== randomId);
    saveMappings(mappings);
    return null;
  }

  return mapping.originalId;
}

export function removeUrlMapping(originalId: string, type: 'quote' | 'receipt' | 'order'): void {
  const mappings = getMappings().filter(m => !(m.originalId === originalId && m.type === type));
  saveMappings(mappings);
}