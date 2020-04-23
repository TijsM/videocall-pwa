import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>login page</h1>
      no acount yet,  <Link to="/register">Register</Link>
      <hr></hr>
      continue without acc <Link to="/home">Home</Link>
      <hr></hr>
      visit a room as a guest <Link to="/visitroom">visit</Link>
    </div>
  );
}

export default Login;
