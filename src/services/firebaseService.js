import { initializeApp } from 'firebase/app';
import { getFirestore, collection, addDoc, getDocs, query, orderBy } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyAl6jFFWPzHKiY8A3GWF2qNd40JUyhKQ7Q",
  authDomain: "acts-2-formation.firebaseapp.com",
  projectId: "acts-2-formation",
  storageBucket: "acts-2-formation.appspot.com",
  messagingSenderId: "1095669570938",
  appId: "1:1095669570938:web:949bd62e7b0f237f574ac3",
  measurementId: "G-7GTGHSSXJY"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

/**
 * Submit user profile to Firestore
 * @param {Object} userProfile - User profile data (name, email, phone)
 * @returns {Promise<string>} - Document ID of submitted profile
 */
export const submitUserProfile = async (userProfile) => {
  try {
    if (!userProfile.name || !userProfile.email) {
      throw new Error('Name and email are required');
    }

    const userWithTimestamp = {
      ...userProfile,
      submittedAt: new Date().toISOString(),
      userAgent: navigator.userAgent,
      timestamp: new Date()
    };

    const docRef = await addDoc(collection(db, 'users'), userWithTimestamp);
    console.log('User profile submitted with ID:', docRef.id);
    return docRef.id;
  } catch (error) {
    console.error('Error submitting user profile:', error);
    throw error;
  }
};

/**
 * Fetch all user profiles from Firestore
 * @returns {Promise<Array>} - Array of user profile objects with IDs
 */
export const getAllUsers = async () => {
  try {
    const q = query(collection(db, 'users'), orderBy('timestamp', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const users = [];
    querySnapshot.forEach((doc) => {
      users.push({
        id: doc.id,
        ...doc.data()
      });
    });
    
    console.log('Fetched', users.length, 'users from Firestore');
    return users;
  } catch (error) {
    console.error('Error fetching users:', error);
    throw error;
  }
};

/**
 * Check if admin password is correct
 * @param {string} password - Password to verify
 * @returns {boolean} - True if password matches
 */
export const verifyAdminPassword = (password) => {
  // Simple authentication - in production, use proper auth
  // For now, use a hardcoded password (change this!)
  const ADMIN_PASSWORD = 'Acts2@dmin1986!';
  return password === ADMIN_PASSWORD;
};
