// Firebase Configuration
// Import the functions you need from the SDKs you need
import { initializeApp } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.7.1/firebase-firestore.js";

// TODO: Replace with your project's customized Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyDV4iS26ErnIcKyj7eTXIGPSQ83dkjDNxo",
    authDomain: "foodstore-12748.firebaseapp.com",
    projectId: "foodstore-12748",
    storageBucket: "foodstore-12748.firebasestorage.app",
    messagingSenderId: "970930347623",
    appId: "1:970930347623:web:3df1d4747df833639d7ec2"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };
