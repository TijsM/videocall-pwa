import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { firestore } from "../../firebase";

import "./Home.scss";

function Home() {
  const [newListName, setNewListName] = useState();
  const [user, setUser] = useState();
  const [rooms, setRooms] = useState();

  const history = useHistory();

  useEffect(() => {
    const _user = JSON.parse(localStorage.getItem("user"));
    if (_user) {
      setUser(_user);
    } else {
      history.push("/");
    }

    const userRef = firestore.collection("users").doc(_user.email);
    userRef.get().then((prom) => {
      setRooms(prom.data().rooms);
    });
    // eslint-disable-next-line
  }, []);

  const confirm = (event) => {
    event.preventDefault();
    console.log("creating", newListName);

    const userRef = firestore.collection("users").doc(user.email);
    let _rooms;
    userRef.get().then((prom) => {
      _rooms = prom.data().rooms;
      _rooms.push(newListName);
      setRooms(_rooms);
      userRef.set(
        {
          rooms: _rooms,
        },
        { merge: true }
      );
    });
  };

  const logout = () => {
    localStorage.setItem("authData", null);
    localStorage.setItem("user", null);
    history.push("/");
  };

  let roomsJsx;
  if (rooms) {
    roomsJsx = rooms.map((room) => {
      return (
        <div key={room} className="roomContainer">
          <div>{room}</div>
          <div>
            <Link to="/room">Go to room</Link>
          </div>
        </div>
      );
    });
  }

  // const roomJsx = (
  //   <div className="roomContainer">
  //     <div>roomname</div>
  //     <div>
  //       <Link to="/room">Go to room</Link>
  //     </div>
  //   </div>
  // );

  return (
    <div>
      <h1>Welcome {user && user.userName}</h1>
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
        {roomsJsx}
      </section>
    </div>
  );
}

export default Home;
