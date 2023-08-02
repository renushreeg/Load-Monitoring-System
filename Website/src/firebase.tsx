import { initializeApp } from "firebase/app";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyB9IEQad_qqvFZBljpOGs7jL27YlWPf8gM",
    authDomain: "load-monitoring-system-d1a16.firebaseapp.com",
    databaseURL: "https://load-monitoring-system-d1a16-default-rtdb.firebaseio.com",
    projectId: "load-monitoring-system-d1a16",
    storageBucket: "load-monitoring-system-d1a16.appspot.com",
    messagingSenderId: "722400669485",
    appId: "1:722400669485:web:2eb8ac6090cea6e7166da4"
};

const app = initializeApp(firebaseConfig)
const db = getFirestore(app);

export { app, db };