import { initializeApp } from "firebase/app";
import { getAuth, GoogleAuthProvider, GithubAuthProvider } from "firebase/auth";
import { getFirestore } from "firebase/firestore";

const firebaseConfig = {
    apiKey: "AIzaSyCsrXnm7PX2yMobqdjnxBt_0SSykEEW8Bw",
    authDomain: "test-frontend-d6954.firebaseapp.com",
    projectId: "test-frontend-d6954",
    storageBucket: "test-frontend-d6954.firebasestorage.app",
    messagingSenderId: "211535324371",
    appId: "1:211535324371:web:b8477d74cef89f49e92026",
    measurementId: "G-37NHGR51HD"
  };

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const googleProvider = new GoogleAuthProvider();
const githubProvider = new GithubAuthProvider();

export { auth, googleProvider, githubProvider };
export const db = getFirestore(app)
