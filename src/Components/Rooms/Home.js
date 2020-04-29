import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { firestore } from "../../firebase";
import RequestNotifications from "./RequistNotifications";
import { motion } from "framer-motion";
import { pageTransition, pageVariant } from "../../Transitions";

import "./Home.scss";

import deleteIcon from "../../assets/delete.svg";
import copyIcon from "../../assets/copy.svg";
import logoutIllustration from "../../assets/logout.svg";
import notificationIllustration from "../../assets/notifications.svg";
import installIllustration from "../../assets/install.svg";

function Home() {
  const [newRoomName, setNewRoomName] = useState();
  const [user, setUser] = useState();
  const [rooms, setRooms] = useState();

  const history = useHistory();

  useEffect(() => {
    const _user = JSON.parse(localStorage.getItem("user"));
    const fetchRooms = async () => {
      const userPromise = await fetch(
        "https://firestore.googleapis.com/v1/projects/videocall-pwa/databases/(default)/documents/users/" +
          _user.email
      );
      const user = await userPromise.json();
      const _rooms = user.fields.rooms.arrayValue.values.map((room) => {
        return room.stringValue;
      });
      setRooms(_rooms);
    };

    if (_user) {
      setUser(_user);
      fetchRooms();
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
        <div key={room} className="roomListItem">
          <Link
            to={`/room/${user.userName.split(" ").join("")}/${room
              .split(" ")
              .join("")}`}
          >
            {room}
          </Link>

          <div className="roomActions">
            <button
              className="roomActionButton"
              onClick={() => alert("not yet implemented")}
            >
              <img src={copyIcon} alt="delete icon" />
            </button>
            <button
              className="roomActionButton"
              onClick={() => removeRoom({ room })}
            >
              <img src={deleteIcon} alt="delete icon" />
            </button>
          </div>
        </div>
      );
    });
  }

  return (
    <motion.div
      variants={pageVariant}
      transition={pageTransition}
      initial="initial"
      exit="out"
      animate="in"
      className="homeContainer"
    >
      <form className="addRoomForm">
        <input
          onChange={(val) => setNewRoomName(val.target.value)}
          placeholder="new room name"
        ></input>
        <button className="highlightedButton" onClick={(e) => confirm(e)}>
          create
        </button>
      </form>

      <h1>your rooms:</h1>
      <section className="roomsContainer">{roomsJsx}</section>
      <section className="actionCards">
        <div className="card">
          <img
            className="cardIllustration"
            src={installIllustration}
            alt="illustration"
          />
          <h2 className="cardText">add to homescreen</h2>
        </div>
        <div className="card">
          <img
            className="cardIllustration"
            src={notificationIllustration}
            alt="illustration"
          />
          <h2 className="cardText">get notifications</h2>
        </div>
        <div className="card">
          <img
            className="cardIllustration"
            src={logoutIllustration}
            alt="illustration"
          />
          <h2 className="cardText">logout</h2>
        </div>

        {/* <button style={{ marginTop: 200 }} onClick={logout}>
        LOGOUT
      </button>
      <RequestNotifications /> */}
      </section>
    </motion.div>
  );
}

export default Home;
