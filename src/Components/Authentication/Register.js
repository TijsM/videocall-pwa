import React, { useState } from "react";
import { Link } from "react-router-dom";
import {authWithGoogle, signUpWithEmail} from '../../firebase'

import "./Auth.scss";

function Register() {
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [password, setpassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();

  const register = (event) => {
    console.log("here");
    console.log("email", email);
    console.log("username", userName);
    console.log("password", password);
    console.log("confirmPassword", confirmPassword);
    event.preventDefault();
    signUpWithEmail(email, password)
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
        <input
          onChange={(val) => setConfirmPassword(val.target.value)}
          placeholder="confirm password"
        ></input>
        <button onClick={(e) => register(e)}> confirm</button>
        <hr></hr>
        <br></br>
      </form>
      <button onClick={authWithGoogle}>sign up with google</button>


      <div>
        already have an account, <Link to="/">login</Link>
      </div>
    </div>
  );
}

export default Register;
