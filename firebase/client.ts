import { initializeApp, getApp, getApps } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

// Firebase configuration
const firebaseConfig = {
  apiKey: "AIzaSyC1a6NQ9I_CU4mnBJ2jeU0ddOSMYzF_9b8",
  authDomain: "prepwise-5bc0c.firebaseapp.com",
  projectId: "prepwise-5bc0c",
  storageBucket: "prepwise-5bc0c.appspot.com",
  messagingSenderId: "723608920202",
  appId: "1:723608920202:web:480edbcc75e3d7bcee0d73",
  measurementId: "G-EHPZ1GPTMX",
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

// Initialize Firebase Analytics only on the client side
if (typeof window !== "undefined") {
  import("firebase/analytics").then(({ getAnalytics }) => {
    const analytics = getAnalytics(app);
    console.log("Analytics initialized:", analytics);
  });
}

export const auth = getAuth(app);
export const db = getFirestore(app);
