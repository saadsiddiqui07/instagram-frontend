import firebase from "firebase";

const firebaseApp = firebase.initializeApp({
  apiKey: "AIzaSyBu_2puBgIFknUS7QwLONufvfzXGLjdlE0",
  authDomain: "instagram-clone-bb24a.firebaseapp.com",
  databaseURL: "https://instagram-clone-bb24a.firebaseio.com",
  projectId: "instagram-clone-bb24a",
  storageBucket: "instagram-clone-bb24a.appspot.com",
  messagingSenderId: "996264575163",
  appId: "1:996264575163:web:12671fe6e8fbec66b6699e",
  measurementId: "G-DZ446H9ZJS",
});

const db = firebaseApp.firestore();
const auth = firebaseApp.auth();
const storage = firebaseApp.storage();

export { db, auth, storage };
