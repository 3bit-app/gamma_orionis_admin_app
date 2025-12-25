/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * Firebase Authentication v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

import { firebaseConfig } from './firebase-config.js';

// Firebase state
let firebaseApp = null;
let firebaseAuth = null;
let googleProvider = null;
let isInitialized = false;

/**
 * Initialize Firebase
 * @returns {Promise<boolean>} True if initialized successfully
 */
export async function initializeFirebase() {
  if (isInitialized) {
    console.log('Orionis ★ Firebase already initialized');
    return true;
  }

  try {
    console.log('Orionis ★ Initializing Firebase...');

    // Dynamically load Firebase SDK
    if (!window.firebase) {
      await loadFirebaseSDK();
    }

    const firebase = window.firebase;

    // Initialize Firebase app
    firebaseApp = firebase.initializeApp(firebaseConfig);
    console.log('Orionis ★ Firebase app initialized');

    // Get Auth instance
    firebaseAuth = firebase.auth(firebaseApp);
    console.log('Orionis ★ Firebase Auth initialized');

    // Create Google provider
    googleProvider = new firebase.auth.GoogleAuthProvider();
    googleProvider.addScope('profile');
    googleProvider.addScope('email');
    console.log('Orionis ★ Google Auth Provider initialized');

    isInitialized = true;
    console.log('Orionis ★ Firebase initialization complete');

    return true;
  } catch (error) {
    console.error('Orionis ★ Firebase initialization failed:', error);
    return false;
  }
}

/**
 * Load Firebase SDK dynamically
 * @returns {Promise<void>}
 */
function loadFirebaseSDK() {
  return new Promise((resolve, reject) => {
    const script = document.createElement('script');
    script.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-app.js';
    
    script.onload = () => {
      // Load Firebase Auth
      const authScript = document.createElement('script');
      authScript.src = 'https://www.gstatic.com/firebasejs/10.12.2/firebase-auth.js';
      
      authScript.onload = () => {
        console.log('Orionis ★ Firebase SDKs loaded');
        resolve();
      };
      
      authScript.onerror = () => {
        reject(new Error('Failed to load Firebase Auth SDK'));
      };
      
      document.head.appendChild(authScript);
    };
    
    script.onerror = () => {
      reject(new Error('Failed to load Firebase App SDK'));
    };
    
    document.head.appendChild(script);
  });
}

/**
 * Sign in with Google popup
 * @returns {Promise<Object>} { idToken, user: { email, name, picture } }
 */
export async function signInWithGoogle() {
  if (!isInitialized) {
    const initialized = await initializeFirebase();
    if (!initialized) {
      throw new Error('Firebase initialization failed');
    }
  }

  try {
    console.log('Orionis ★ Starting Google Sign-In popup');

    const result = await firebaseAuth.signInWithPopup(googleProvider);
    
    console.log('Orionis ★ Google Sign-In successful');
    console.log('Orionis ★ User:', result.user.email);

    // Get ID token
    const idToken = await result.user.getIdToken(true);
    
    console.log('Orionis ★ ID Token obtained');

    return {
      idToken,
      user: {
        email: result.user.email,
        name: result.user.displayName,
        picture: result.user.photoURL,
        uid: result.user.uid,
      },
    };
  } catch (error) {
    console.error('Orionis ★ Google Sign-In failed:', error);
    
    // Handle specific errors
    if (error.code === 'auth/popup-closed-by-user') {
      throw new Error('Sign-in popup was closed');
    }
    if (error.code === 'auth/popup-blocked') {
      throw new Error('Sign-in popup was blocked by browser');
    }
    if (error.code === 'auth/cancelled-popup-request') {
      throw new Error('Sign-in request was cancelled');
    }
    
    throw new Error(`Google Sign-In failed: ${error.message}`);
  }
}

/**
 * Get current Firebase user
 * @returns {Object|null} Current user or null
 */
export function getCurrentFirebaseUser() {
  if (!firebaseAuth) return null;
  return firebaseAuth.currentUser;
}

/**
 * Get ID token of current user
 * @returns {Promise<string|null>} ID token or null
 */
export async function getCurrentIdToken() {
  const user = getCurrentFirebaseUser();
  if (!user) return null;
  
  try {
    return await user.getIdToken(true);
  } catch (error) {
    console.error('Orionis ★ Failed to get ID token:', error);
    return null;
  }
}

/**
 * Sign out from Firebase
 * @returns {Promise<void>}
 */
export async function signOutFromFirebase() {
  if (!firebaseAuth) return;

  try {
    console.log('Orionis ★ Signing out from Firebase');
    await firebaseAuth.signOut();
    console.log('Orionis ★ Signed out successfully');
  } catch (error) {
    console.error('Orionis ★ Sign-out failed:', error);
    throw error;
  }
}

/**
 * Check if Firebase is initialized
 * @returns {boolean}
 */
export function isFirebaseInitialized() {
  return isInitialized;
}

/**
 * Set up Firebase auth state listener
 * @param {Function} callback - Called with (user) when auth state changes
 * @returns {Function} Unsubscribe function
 */
export function onAuthStateChanged(callback) {
  if (!firebaseAuth) {
    console.warn('Orionis ★ Firebase not initialized');
    return () => {};
  }

  return firebaseAuth.onAuthStateChanged(callback);
}
