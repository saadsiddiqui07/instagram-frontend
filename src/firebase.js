import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyDSdRYQdpTgBCdQM0k6_khY-jPZdIlluFo",
  authDomain: "instagram-mern-7.firebaseapp.com",
  databaseURL: "https://instagram-mern-7.firebaseio.com",
  projectId: "instagram-mern-7",
  storageBucket: "instagram-mern-7.appspot.com",
  messagingSenderId: "726166877442",
  appId: "1:726166877442:web:531628f76519ee603e3e1b",
  measurementId: "G-P95H0CZPST",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
