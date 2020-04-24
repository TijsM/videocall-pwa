import React, {useState} from "react";
import { Link } from "react-router-dom";
import {authWithGoogle, singInWithEmail} from '../../firebase'


function Login() {
  const [email, setEmail] = useState();
  const [password, setpassword] = useState();


  const login = (event) => {
    event.preventDefault();
    console.log('email', email);
    console.log('password', password)

    singInWithEmail(email, password)

  }


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
    
      <button onClick={authWithGoogle}>sign in with google</button>

  <hr></hr>
      no acount yet, <Link to="/register">Register</Link>
      <hr></hr>
      continue without acc <Link to="/home">Home</Link>
      <hr></hr>
      visit a room as a guest <Link to="/visitroom">visit</Link>
    </div>
  );
}

export default Login;
