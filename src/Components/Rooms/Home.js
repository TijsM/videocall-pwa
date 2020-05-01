import React, { useState, useEffect } from "react";
import { Link, useHistory } from "react-router-dom";
import { firestore } from "../../firebase";
import { motion } from "framer-motion";
import { pageTransition, pageVariant } from "../../Transitions";
import { copyLink } from "../../helpers";
import "./Home.scss";

import deleteIcon from "../../assets/delete.svg";
import copyIcon from "../../assets/copy.svg";
import logoutIllustration from "../../assets/logout.svg";
import notificationIllustration from "../../assets/notifications.svg";
import installIllustration from "../../assets/install.svg";
import swal from "sweetalert";

function Home() {
  const [newRoomName, setNewRoomName] = useState();
  const [user, setUser] = useState();
  const [rooms, setRooms] = useState();
  const [prompt, setPrompt] = useState();

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
      const url = window.location.href;
      const urlArr = url.split("/");
      if (urlArr[3] !== "visitroom") {
        history.push("/login");
      }
    }

    window.addEventListener("beforeinstallprompt", (event) => {
      event.preventDefault();
      console.log("caught");
      setPrompt(event);
    });

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

  const RequestNotifications = async () => {
    console.log("requesting notifications");
    const sw = await navigator.serviceWorker.ready;
    let pushSub = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey:
        "BEV0UUVQ_akT0b0168P6JVwebBpOqLtbl7-kejmlUijGA01VtfkXR7irgn9yLwZhYvO3FZVnn_7mVyRd9Jv85Zw",
    });
    console.log("here");
    //store this push object (the subscription) in the database with the user
    console.log(JSON.stringify(pushSub));

    console.log("storing subscription in the database");
    const _user = JSON.parse(localStorage.getItem("user"));

    const userRef = firestore.collection("users").doc(_user.email);
    userRef.get().then((prom) => {
      console.log("in update");
      userRef.set(
        {
          notificationSubscription: JSON.stringify(pushSub),
        },
        { merge: true }
      );
    });

    swal("succesfully subscribed to notifications");
  };

  const addToHome = () => {
    console.log("in install, the state is", prompt);
    if (prompt) {
      console.log("state", prompt);
      prompt.prompt();
    } else {
      console.log("state", prompt);
      console.log("installing is not supported");
    }
  };

  let roomsJsx;
  if (rooms) {
    roomsJsx = rooms.map((room) => {
      const splittedUsername = user.userName.split(" ").join("");
      const splittedRoomName = room.split(" ").join("");
      return (
        <div key={room} className="roomListItem">
          <Link to={`/room/${splittedUsername}/${splittedRoomName}`}>
            {room}
          </Link>

          <div className="roomActions">
            <button
              className="roomActionButton"
              onClick={() => copyLink(splittedUsername, splittedRoomName)}
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
        <div className="card" onClick={addToHome}>
          <img
            className="cardIllustration"
            src={installIllustration}
            alt="illustration"
          />
          <h2 className="cardText">add to homescreen</h2>
        </div>
        <div className="card" onClick={RequestNotifications}>
          <img
            className="cardIllustration"
            src={notificationIllustration}
            alt="illustration"
          />
          <h2 className="cardText">get notifications</h2>
        </div>
        <div className="card" onClick={logout}>
          <img
            className="cardIllustration"
            src={logoutIllustration}
            alt="illustration"
          />
          <h2 className="cardText">logout</h2>
        </div>
      </section>
    </motion.div>
  );
}

export default Home;
