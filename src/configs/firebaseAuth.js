import { initializeApp } from 'firebase/app';
import { getAuth } from 'firebase/auth';
import { getFirestore } from 'firebase/firestore';

const firebaseConfig = {
  apiKey: "AIzaSyDWoHdR9DiqVjq7NTmY9EO6PV_BGbJj2Q4",
  authDomain: "soundxpand-dashboard.firebaseapp.com",
  projectId: "soundxpand-dashboard",
  storageBucket: "soundxpand-dashboard.appspot.com",
  messagingSenderId: "979423374841",
  appId: "1:979423374841:web:053eef6fd4149a96892128",
  measurementId: "G-7E2N6BE8QP"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app); // Initialize Firebase Authentication
const db = getFirestore(app); // Initialize Firestore Database

export { auth, db };

