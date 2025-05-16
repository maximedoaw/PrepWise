// Import the functions you need from the SDKs you need
import { initializeApp, getApps, getApp } from "firebase/app";
import { getAuth } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
  apiKey: "AIzaSyC1-8-kywqcdFrl7W9Du_xcGP1jB7X1UqE",
  authDomain: "prepwise-1dfd4.firebaseapp.com",
  projectId: "prepwise-1dfd4",
  storageBucket: "prepwise-1dfd4.firebasestorage.app",
  messagingSenderId: "49406500701",
  appId: "1:49406500701:web:8a242be6a303c5f7e812b4",
  measurementId: "G-BHTM0XK89X"
};

// Initialize Firebase
const app = !getApps().length ? initializeApp(firebaseConfig) : getApp();

export const auth = getAuth(app);
export const db = getFirestore(app);