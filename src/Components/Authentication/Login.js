import React from "react";
import { Link } from "react-router-dom";

function Login() {
  return (
    <div>
      <h1>login page</h1>
      no acount yet,  <Link to="/register">Register</Link>
      continue without acc <Link to="/Home">Home</Link>
    </div>
  );
}

export default Login;
