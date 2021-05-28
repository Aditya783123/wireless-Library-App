import firebase from 'firebase';
require('@firebase/firestore')

// Your web app's Firebase configuration
var firebaseConfig = {
    apiKey: "AIzaSyB0FpeLaisAmgSV6QdY02X8sCmxXf4LIpo",
    authDomain: "wireless-library-app-51798.firebaseapp.com",
    projectId: "wireless-library-app-51798",
    storageBucket: "wireless-library-app-51798.appspot.com",
    messagingSenderId: "637351997345",
    appId: "1:637351997345:web:65d0a5cc5084bb2ed4e5e0"
  };
  // Initialize Firebase
  firebase.initializeApp(firebaseConfig);
export default firebase.firestore();