import React, { useState } from "react";
import { Link, useHistory } from "react-router-dom";
import {
  authWithGoogle,
  singInWithEmail,
  authWithFacebook,
  firestore,
} from "../../firebase";
import { storeUserInLocalStorage } from "../../helpers";

import "./Auth.scss";

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
        <button onClick={signInWithFacebook}>sign in with facebook</button>
      </div>

      <div className="changeAuthMethod">
        No acount yet? create one: <Link to="/register">Register</Link>
      </div>
    </div>
  );
}

export default Login;
