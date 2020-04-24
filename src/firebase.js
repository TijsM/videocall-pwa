import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";


var firebaseConfig = {
  apiKey: "AIzaSyCtsL2akWayjxJvdR1Up-M5JJziDFfJzoo",
  authDomain: "videocall-pwa.firebaseapp.com",
  databaseURL: "https://videocall-pwa.firebaseio.com",
  projectId: "videocall-pwa",
  storageBucket: "videocall-pwa.appspot.com",
  messagingSenderId: "254689319136",
  appId: "1:254689319136:web:211be973f20dd3f05b9885",
  measurementId: "G-BYSR9ZQYPM",
};

firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();


export const authWithGoogle = () => {
  return auth.signInWithPopup(provider)
};

export const signUpWithEmail = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password)
};

export const singInWithEmail = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
};
