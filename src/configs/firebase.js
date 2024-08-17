import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';

const FirebaseConfig = {
  apiKey: "AIzaSyDWoHdR9DiqVjq7NTmY9EO6PV_BGbJj2Q4",
  authDomain: "soundxpand-dashboard.firebaseapp.com",
  projectId: "soundxpand-dashboard",
  storageBucket: "soundxpand-dashboard.appspot.com",
  messagingSenderId: "979423374841",
  appId: "1:979423374841:web:053eef6fd4149a96892128",
  measurementId: "G-7E2N6BE8QP"
};

const app = initializeApp(FirebaseConfig);
const db = getFirestore(app);

export { db };
