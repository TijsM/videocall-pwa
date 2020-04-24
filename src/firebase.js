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
  auth.signInWithPopup(provider).then((data) => {
    console.log("authdata", data);
    localStorage.setItem("authData", JSON.stringify(data));
  }).catch(error => {console.error(error)});
};

export const signUpWithEmail = (email, password) => {
  auth.createUserWithEmailAndPassword(email, password).then((data) => {
    console.log("authdata", data);
    localStorage.setItem("authData", JSON.stringify(data));
  }).catch(error => {console.error(error)});
};

export const singInWithEmail = (email, password) => {
  auth.signInWithEmailAndPassword(email, password).then((data) => {
    console.log("authdata", data);
    localStorage.setItem("authData", JSON.stringify(data));
  }).catch(error => {console.error(error)});
};
