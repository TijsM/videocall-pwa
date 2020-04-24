import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";

import "./Home.scss";

function Home() {
  const [newListName, setNewListName] = useState();
  const [user, setUser] = useState();

  const history = useHistory();

  useEffect(() => {
    const _user = JSON.parse(localStorage.getItem("user"));
    console.log(_user);
    if (_user) {
      setUser(_user);
    } else {
      history.push("/");
    }
    // eslint-disable-next-line
  }, []);

  const confirm = (event) => {
    event.preventDefault();
    console.log("creating", newListName);
  };

  const logout = () => {
    localStorage.setItem("authData", null);
    localStorage.setItem("user", null);
    history.push("/");
  };

  const roomJsx = (
    <div className="roomContainer">
      <div>roomname</div>
      <div>
        <Link to="/room">Go to room</Link>
      </div>
    </div>
  );

  return (
    <div>
      <h1>Home page</h1>
      <button onClick={logout}>LOGOUT</button>
      <form>
        <input
          onChange={(val) => setNewListName(val.target.value)}
          placeholder="email"
        ></input>
        <button onClick={(e) => confirm(e)}> confirm</button>
      </form>
      <section id="roomsection">
        <h2>your rooms:</h2>
        {roomJsx}
      </section>
      :
    </div>
  );
}

export default Home;
