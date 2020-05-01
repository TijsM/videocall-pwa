import React, { useState } from "react";
import { motion } from "framer-motion";
import { pageVariant, pageTransition } from "../../Transitions";

import { Link, useHistory } from "react-router-dom";
import {
  authWithGoogle,
  singInWithEmail,
  authWithFacebook,
  firestore,
} from "../../firebase";
import { storeUserInLocalStorage } from "../../helpers";

import "./Auth.scss";

import fingerAuth from "../../assets/finger.svg";
import google from "../../assets/google.svg";
import facebook from "../../assets/facebook.svg";
import apple from "../../assets/apple.svg";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setpassword] = useState();


  const login = (event) => {
    event.preventDefault();
    singInWithEmail(email, password)
      .then((data) => {
        console.log("authdata", data);
        localStorage.setItem("authData", JSON.stringify(data));

        firestore
          .collection("users")
          .where("email", "==", email)
          .get()
          .then((doc) => {
            console.log(doc.docs[0].data());
            storeUserInLocalStorage(
              doc.docs[0].data().email,
              doc.docs[0].data().userName
            );
          });

        history.push("/home");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const singInWithGoogle = async () => {
    authWithGoogle()
      .then((data) => {
        console.log("authdata", data);
        localStorage.setItem("authData", JSON.stringify(data));
        storeUserInLocalStorage(
          data.additionalUserInfo.profile.email,
          data.additionalUserInfo.profile.name
        );
        history.push("/home");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  const signInWithFacebook = () => {
    authWithFacebook()
      .then((data) => {
        console.log("authdata", data);
        localStorage.setItem("authData", JSON.stringify(data));
        storeUserInLocalStorage(
          data.additionalUserInfo.profile.email,
          data.additionalUserInfo.profile.name
        );
        history.push("/home");
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
      <img className="authIllustration" src={fingerAuth} alt="illustration" />
      <form className="authForm">
        <input
          onChange={(val) => setEmail(val.target.value)}
          placeholder="email"
        ></input>
        <input
          onChange={(val) => setpassword(val.target.value)}
          placeholder="password"
        ></input>
        <button className="confirmButton" onClick={(e) => login(e)}>
          confirm
        </button>
        <div className="changeAuthMethod">
          <Link to="/register">no account yet?</Link>
        </div>
      </form>
      <div className="socialsLogin">
        <h2>login with socials</h2>
        <button onClick={singInWithGoogle}>
          <img
            className="socialIcon"
            src={google}
            alt="google authenticaitons"
          />
        </button>
        <button onClick={signInWithFacebook}>
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

export default Login;
