import { firestore } from "./firebase";

export const storeUserInFirestore = (email, userName) => {
  firestore
    .collection("users")
    .add({
      email: email,
      userName: userName,
    })
    .then((docref) => {
      console.log("written to firstore with id: ", docref);
    })
    .catch((err) => {
      console.error(err);
    });
};

export const storeUserInLocalStorage = (email, userName) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: email,
      userName: userName,
    })
  );
};
