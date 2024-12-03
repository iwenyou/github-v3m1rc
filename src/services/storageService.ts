import storage, { firebaseStore } from '../lib/storage';
import { STORAGE_KEYS, StorageKey } from './storageKeys';
import { QueryConstraint } from 'firebase/firestore';

export async function getData<T>(key: StorageKey): Promise<T | null> {
  return storage.getItem<T>(key);
}

export async function setData<T>(key: StorageKey, value: T): Promise<void> {
  await storage.setItem(key, value);
}

export async function removeData(key: StorageKey): Promise<void> {
  await storage.removeItem(key);
}

export async function getCollection<T>(
  key: StorageKey,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  return storage.getCollection<T>(key, constraints);
}

export async function setCollection<T>(
  key: StorageKey,
  items: T[]
): Promise<void> {
  await storage.setCollection(key, items);
}

// Firebase-specific operations
export async function getFirebaseData<T>(key: StorageKey): Promise<T | null> {
  return firebaseStore.getItem<T>(key);
}

export async function setFirebaseData<T>(key: StorageKey, value: T): Promise<void> {
  await firebaseStore.setItem(key, value);
}

export async function getFirebaseCollection<T>(
  key: StorageKey,
  constraints: QueryConstraint[] = []
): Promise<T[]> {
  return firebaseStore.getCollection<T>(key, constraints);
}