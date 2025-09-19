// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app"
import { getAuth } from "firebase/auth"
import { getFirestore } from "firebase/firestore"
import { getStorage } from "firebase/storage"
import { getAnalytics } from "firebase/analytics"

// Your web app's Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyDzSgbMVoJyMkS7bWQ5SLdbtzgy3V8oNYM",
  authDomain: "legalease-ai-931f0.firebaseapp.com",
  projectId: "legalease-ai-931f0",
  storageBucket: "legalease-ai-931f0.firebasestorage.app",
  messagingSenderId: "162910030487",
  appId: "1:162910030487:web:b0fe8515dc2eabb45037d2",
  measurementId: "G-MS50WHYQH5",
}

// Initialize Firebase
const app = initializeApp(firebaseConfig)

// Initialize Firebase services
export const auth = getAuth(app)
export const db = getFirestore(app)
export const storage = getStorage(app)

// Initialize Analytics (only in browser)
export const analytics = typeof window !== "undefined" ? getAnalytics(app) : null

export default app
