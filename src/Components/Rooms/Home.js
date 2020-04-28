import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { firestore } from "../../firebase";
import RequestNotifications from "./RequistNotifications";
import {motion} from 'framer-motion'
import { pageTransition } from "../../Transitions";

import "./Home.scss";

function Home() {
  const [newRoomName, setNewRoomName] = useState();
  const [user, setUser] = useState();
  const [rooms, setRooms] = useState();

  const history = useHistory();

  useEffect(() => {
    const _user = JSON.parse(localStorage.getItem("user"));
    const fetchRooms = async () => {

      const userPromise = await fetch('https://firestore.googleapis.com/v1/projects/videocall-pwa/databases/(default)/documents/users/'+_user.email)
      const user = await userPromise.json()

      const _rooms = user.fields.rooms.arrayValue.values.map((room) => {
        return room.stringValue
      })

      setRooms(_rooms)
    }
    

    if (_user) {
      setUser(_user);

      fetchRooms()

      // const userRef = firestore.collection("users").doc(_user.email);
      // userRef.get().then((prom) => {
      //   setRooms(prom.data().rooms);
      // });
    } else {
      history.push("/login");
    }

    // eslint-disable-next-line
  }, []);

  const confirm = (event) => {
    event.preventDefault();
    console.log("creating", newRoomName);

    const userRef = firestore.collection("users").doc(user.email);
    let _rooms;
    userRef.get().then((prom) => {
      _rooms = prom.data().rooms;
      _rooms.push(newRoomName);
      setRooms(_rooms);
      userRef.set(
        {
          rooms: _rooms,
        },
        { merge: true }
      );
    });
    setNewRoomName("");
  };

  const removeRoom = (room) => {
    console.log("deleting", room.room);

    const userRef = firestore.collection("users").doc(user.email);
    let _rooms;
    userRef.get().then((prom) => {
      _rooms = prom.data().rooms;
      const index = _rooms.indexOf(room.room);
      if (index > -1) {
        _rooms.splice(index, 1);
      }
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
    history.push("/login");
  };

  let roomsJsx;
  if (rooms) {
    roomsJsx = rooms.map((room) => {
      return (
        <div key={room} className="roomContainer">
          <div>{room}</div>
          <div>
            <button onClick={() => removeRoom({ room })}>remove room</button>
            <Link
              to={`/room/${user.userName.split(" ").join("")}/${room
                .split(" ")
                .join("")}`}
            >
              Go to room
            </Link>
          </div>
        </div>
      );
    });
  }

  return (
    <motion.div variants={pageTransition} initial="out" exit="out" animate="in">
      <h1>Welcome {user && user.userName}</h1>

      <form>
        <input
          onChange={(val) => setNewRoomName(val.target.value)}
          placeholder="new room name"
        ></input>
        <button onClick={(e) => confirm(e)}> confirm</button>
      </form>
      <section id="roomsection">
        <h2>your rooms:</h2>
        {roomsJsx}
      </section>
      <button style={{ marginTop: 200 }} onClick={logout}>
        LOGOUT
      </button>
      <RequestNotifications />
    </motion.div>
  );
}

export default Home;
