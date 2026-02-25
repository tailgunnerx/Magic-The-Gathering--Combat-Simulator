import { initializeApp } from 'firebase/app';
import { getDatabase } from 'firebase/database';

const firebaseConfig = {
    projectId: "mtgcombat",
    appId: "1:419018442824:web:5b9aa3c7d5df94d8f1307d",
    storageBucket: "mtgcombat.firebasestorage.app",
    apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
    authDomain: "mtgcombat.firebaseapp.com",
    messagingSenderId: "419018442824",
    measurementId: "G-8Y7M4GZJNT",
    databaseURL: "https://mtgcombat-default-rtdb.firebaseio.com"
};

const app = initializeApp(firebaseConfig);
export const rtdb = getDatabase(app);
