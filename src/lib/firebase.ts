import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyCtsXqK2rgOs9e0CThmOnwvGJfYt9OSBzk",
  authDomain: "quote-firebase-3c7b6.firebaseapp.com",
  projectId: "quote-firebase-3c7b6",
  storageBucket: "quote-firebase-3c7b6.firebasestorage.app",
  messagingSenderId: "306199188493",
  appId: "1:306199188493:web:7c097f341be15989463144",
  measurementId: "G-3KF2L6XQZ1"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);

// Initialize Firestore and Auth
export const auth = getAuth(app);
export const db = getFirestore(app);

// Export the Firebase app instance
export default app;