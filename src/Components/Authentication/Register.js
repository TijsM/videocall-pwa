import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  authWithGoogle,
  signUpWithEmail,
  authWithFacebook,
  firestore,
} from "../../firebase";

import "./Auth.scss";

function Register() {
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [password, setpassword] = useState();

  const history = useHistory();

  const storeUserInFirestore = (email, userName) => {
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

  const storeUserInLocalStorage = (email, userName) => {
    localStorage.setItem(
      "user",
      JSON.stringify({
        email: email,
        userName: userName,
      })
    );
  };

  const register = (event) => {
    event.preventDefault();
    signUpWithEmail(email, password)
      .then((data) => {
        console.log("authdata", data);
        localStorage.setItem("authData", JSON.stringify(data));
        storeUserInLocalStorage(email, userName);
        history.push("/home");

        storeUserInFirestore(email, userName);
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signUpWithGoogle = () => {
    authWithGoogle()
      .then((data) => {
        console.log("authdata", data);
        localStorage.setItem("authData", JSON.stringify(data));
        storeUserInLocalStorage(
          data.additionalUserInfo.profile.email,
          data.additionalUserInfo.profile.name
        );
        history.push("/home");

        storeUserInFirestore(
          data.additionalUserInfo.profile.email,
          data.additionalUserInfo.profile.name
        );
      })

      .catch((error) => {
        console.error(error);
      });
  };

  const signupwithFacebook = () => {
    authWithFacebook()
      .then((data) => {
        console.log("authdata", data);
        localStorage.setItem("authData", JSON.stringify(data));
        storeUserInLocalStorage(
          data.additionalUserInfo.profile.email,
          data.additionalUserInfo.profile.name
        );
        history.push("/home");
        storeUserInFirestore(
          data.additionalUserInfo.profile.email,
          data.additionalUserInfo.profile.name
        );
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div className="container">
      <h1>Register page</h1>
      <form>
        <input
          onChange={(val) => setEmail(val.target.value)}
          placeholder="email"
        ></input>
        <input
          onChange={(val) => setUserName(val.target.value)}
          placeholder="user name"
        ></input>
        <input
          onChange={(val) => setpassword(val.target.value)}
          placeholder="password"
        ></input>

        <button onClick={(e) => register(e)}> confirm</button>
        <hr></hr>
        <br></br>
      </form>
      <div className="socialsLogin">
        <button onClick={signUpWithGoogle}>sign up with google</button>
        <button onClick={signupwithFacebook}>sign up with facebook</button>
      </div>

      <div className="changeAuthMethod">
        already have an account, <Link to="/">login</Link>
      </div>
    </div>
  );
}

export default Register;
