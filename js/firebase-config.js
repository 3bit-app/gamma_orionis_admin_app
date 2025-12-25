/*
 * Gamma Orionis ★ (Bellātrix) JS Module
 * Bellātrix The White Blue Giant, The Lion warrior, Conqueror
 * Amon Ra Eye
 * Firebase Configuration v.1.0.0 (ESM)
 * 3bit.app | 2025
 */

/**
 * Firebase configuration for Gamma Orionis project
 * @type {Object}
 */
export const firebaseConfig = {
  apiKey: "AIzaSyCxxdqj-0sXoFE--yYzvNHWBzNjQ99TOHQ",
  authDomain: "gamma-orionis.firebaseapp.com",
  projectId: "gamma-orionis",
  storageBucket: "gamma-orionis.firebasestorage.app",
  messagingSenderId: "994374646318",
  appId: "1:994374646318:web:0fd42e84bd135ea0c1bdbf",
  measurementId: "G-G5GC8KEER1"
};

/**
 * Initialize Firebase
 * Called from firebase-auth.js
 */
export function getFirebaseConfig() {
  return firebaseConfig;
}
