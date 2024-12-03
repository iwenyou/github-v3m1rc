import { db } from './firebase';
import { collection, doc, getDoc, setDoc, deleteDoc, getDocs, query, QueryConstraint } from 'firebase/firestore';

type StorageType = 'local' | 'firebase';

class StorageService {
  private storageType: StorageType;

  constructor(type: StorageType = 'local') {
    this.storageType = type;
  }

  async getItem<T>(key: string): Promise<T | null> {
    if (this.storageType === 'local') {
      const value = localStorage.getItem(key);
      return value ? JSON.parse(value) : null;
    } else {
      try {
        const docRef = doc(db, key, 'data');
        const docSnap = await getDoc(docRef);
        return docSnap.exists() ? (docSnap.data() as T) : null;
      } catch (error) {
        console.error('Error getting item from Firebase:', error);
        return null;
      }
    }
  }

  async setItem<T>(key: string, value: T): Promise<void> {
    if (this.storageType === 'local') {
      localStorage.setItem(key, JSON.stringify(value));
    } else {
      try {
        const docRef = doc(db, key, 'data');
        await setDoc(docRef, value);
      } catch (error) {
        console.error('Error setting item in Firebase:', error);
        throw error;
      }
    }
  }

  async removeItem(key: string): Promise<void> {
    if (this.storageType === 'local') {
      localStorage.removeItem(key);
    } else {
      try {
        const docRef = doc(db, key, 'data');
        await deleteDoc(docRef);
      } catch (error) {
        console.error('Error removing item from Firebase:', error);
        throw error;
      }
    }
  }

  async getCollection<T>(collectionName: string, constraints: QueryConstraint[] = []): Promise<T[]> {
    if (this.storageType === 'local') {
      const value = localStorage.getItem(collectionName);
      return value ? JSON.parse(value) : [];
    } else {
      try {
        const collectionRef = collection(db, collectionName);
        const q = query(collectionRef, ...constraints);
        const snapshot = await getDocs(q);
        return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() })) as T[];
      } catch (error) {
        console.error('Error getting collection from Firebase:', error);
        return [];
      }
    }
  }

  async setCollection<T>(collectionName: string, items: T[]): Promise<void> {
    if (this.storageType === 'local') {
      localStorage.setItem(collectionName, JSON.stringify(items));
    } else {
      try {
        const batch = db.batch();
        const collectionRef = collection(db, collectionName);
        
        items.forEach((item: any) => {
          const docRef = doc(collectionRef);
          batch.set(docRef, item);
        });

        await batch.commit();
      } catch (error) {
        console.error('Error setting collection in Firebase:', error);
        throw error;
      }
    }
  }
}

// Create instances for different storage types
export const localStore = new StorageService('local');
export const firebaseStore = new StorageService('firebase');

// Default export using localStorage
export default localStore;