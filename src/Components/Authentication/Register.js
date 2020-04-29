import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition, pageVariant } from "../../Transitions";

import {
  authWithGoogle,
  signUpWithEmail,
  authWithFacebook,
} from "../../firebase";
import { storeUserInFirestore, storeUserInLocalStorage } from "../../helpers";

import "./Auth.scss";

function Register() {
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [password, setpassword] = useState();

  const history = useHistory();

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
    <motion.div
      variants={pageVariant}
      transition={pageTransition}
      initial="initial"
      exit="out"
      animate="in"
      className="authContainer"
    >
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
    </motion.div>
  );
}

export default Register;
