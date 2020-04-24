import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import { authWithGoogle, singInWithEmail } from "../../firebase";

import "./Auth.scss";

function Login() {
  const history = useHistory();
  const [email, setEmail] = useState();
  const [password, setpassword] = useState();

  const login = (event) => {
    event.preventDefault()
    singInWithEmail(email, password)
      .then((data) => {
        console.log("authdata", data);
        localStorage.setItem("authData", JSON.stringify(data));
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
        history.push("/home");
      })
      .catch((error) => {
        console.error(error);
      });
  };

  return (
    <div>
      <h1>login page</h1>
      <form>
        <input
          onChange={(val) => setEmail(val.target.value)}
          placeholder="email"
        ></input>
        <input
          onChange={(val) => setpassword(val.target.value)}
          placeholder="password"
        ></input>
        <button onClick={(e) => login(e)}> confirm</button>
      </form>
      <div className="socialsLogin">
        <button onClick={singInWithGoogle}>sign in with google</button>
      </div>

      <div className="changeAuthMethod">
      No acount yet? create one: <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
