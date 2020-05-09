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

import registerIllustration from "../../assets/register.svg";
import google from "../../assets/google.svg";
import facebook from "../../assets/facebook.svg";
import apple from "../../assets/apple.svg";

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

        const isNew = data.additionalUserInfo.isNewUser;
        if (isNew) {
          storeUserInFirestore(
            data.additionalUserInfo.profile.email,
            data.additionalUserInfo.profile.name
          );
        }
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
        const isNew = data.additionalUserInfo.isNewUser;
        if (isNew) {
          storeUserInFirestore(
            data.additionalUserInfo.profile.email,
            data.additionalUserInfo.profile.name
          );
        }
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
      <img
        className="authIllustration"
        src={registerIllustration}
        alt="illustration"
      />
      <form className="authForm">
        <input
          onChange={(val) => setEmail(val.target.value)}
          placeholder="email"
        ></input>
        <input
          onChange={(val) => setUserName(val.target.value)}
          placeholder="user name"
        ></input>
        <input
          type='password'
          onChange={(val) => setpassword(val.target.value)}
          placeholder="password"
        ></input>

        <button onClick={(e) => register(e)}> confirm</button>
        <div className="changeAuthMethod">
          <Link to="/">already have an account?</Link>
        </div>
      </form>
      <div className="socialsLogin">
        <h2>login with socials</h2>
        <button onClick={signUpWithGoogle}>
          <img
            className="socialIcon"
            src={google}
            alt="google authenticaitons"
          />
        </button>
        <button onClick={signupwithFacebook}>
          <img
            className="socialIcon"
            src={facebook}
            alt="facebook authenticaitons"
          />
        </button>
        <button onClick={() => alert("Sorry - not yet available")}>
          <img className="socialIcon" src={apple} alt="apple authenticaitons" />
        </button>
      </div>
    </motion.div>
  );
}

export default Register;
