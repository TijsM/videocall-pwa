import firebase from "firebase/app";
import "firebase/auth";
import "firebase/firestore";
import {firebaseConfig} from './secrets'


firebase.initializeApp(firebaseConfig);
export const auth = firebase.auth();
export const firestore = firebase.firestore();

const provider = new firebase.auth.GoogleAuthProvider();
const fbProvider = new firebase.auth.FacebookAuthProvider();


export const authWithGoogle = () => {
  return auth.signInWithPopup(provider)
};

export const authWithFacebook = () => {
  return auth.signInWithPopup(fbProvider)
}

export const signUpWithEmail = (email, password) => {
  return auth.createUserWithEmailAndPassword(email, password)
};

export const singInWithEmail = (email, password) => {
  return auth.signInWithEmailAndPassword(email, password)
};


