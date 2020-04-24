import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { authWithGoogle, signUpWithEmail } from "../../firebase";

import "./Auth.scss";

function Register() {
  const [email, setEmail] = useState();
  const [userName, setUserName] = useState();
  const [password, setpassword] = useState();
  const [confirmPassword, setConfirmPassword] = useState();
  const history = useHistory();

  const register = (event) => {
    event.preventDefault();
    signUpWithEmail(email, password)
      .then((data) => {
        console.log("authdata", data);
        localStorage.setItem("authData", JSON.stringify(data));
        history.push("/home");

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
        history.push("/home");
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
        <input
          onChange={(val) => setConfirmPassword(val.target.value)}
          placeholder="confirm password"
        ></input>
        <button onClick={(e) => register(e)}> confirm</button>
        <hr></hr>
        <br></br>
      </form>
      <div className="socialsLogin">
        <button onClick={signUpWithGoogle}>sign up with google</button>
      </div>

      <div className="changeAuthMethod">
        already have an account, <Link to="/">login</Link>
      </div>
    </div>
  );
}

export default Register;
