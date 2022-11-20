import firebase from 'firebase/compat/app';
import 'firebase/compat/firestore';
// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional


const firebaseConfig = {
  apiKey: "AIzaSyBWGc20KCxw25MejJPJ2N7cp07MJVnhLOw",
  authDomain: "sheriff-4298e.firebaseapp.com",
  projectId: "sheriff-4298e",
  storageBucket: "sheriff-4298e.appspot.com",
  messagingSenderId: "760420837491",
  appId: "1:760420837491:web:f39f5f0827841c576da206",
  measurementId: "G-VPR2ZE9HGQ"
};
 
// Initialize Firebase
firebase.initializeApp(firebaseConfig);
const db = firebase.firestore();
export default db;