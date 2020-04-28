import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import {motion} from "framer-motion"
import { pageTransition } from "../../Transitions";


import "./Room.scss";

function Room({ isOwner }) {
  const [yourSocketId, setYourSocketId] = useState();
  const [partnerSocketId, setPartnerSocketid] = useState();

  const [roomOwnerId, setRoomOwnerId] = useState();
  const [roomVisitorId, setRoomVisitorId] = useState();

  const [yourVideoStream, setYourVideoStream] = useState();

  const [callAccepted, setCallAccepted] = useState(false);

  const [partnerSignal, setPartnerSignal] = useState();

  const yourVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  const { roomname, roomownername } = useParams();
  console.log(roomname);
  console.log(roomownername);
  useEffect(() => {
    // socket.current = io.connect("https://videocall-pwa.glitch.me/");
    socket.current = io.connect("http://localhost:8001");

    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setYourVideoStream(stream);
        if (yourVideo.current) {
          yourVideo.current.srcObject = stream;
        }
      });

    socket.current.on("yourSocketId", (id) => {
      setYourSocketId(id);
      if (isOwner) {
        setRoomOwnerId(id);
        socket.current.emit("setOwnerId", id);
      } else {
        setRoomVisitorId(id);
        socket.current.emit("setVisitorId", id);
      }
    });

    socket.current.on("users", (users) => {
      if (isOwner) {
        setRoomVisitorId(users.visitorId ? users.visitorId : "not online");
        setPartnerSocketid(users.visitorId ? users.visitorId : "not online");
      } else {
        setRoomOwnerId(users.ownerId ? users.ownerId : "not online");
        setPartnerSocketid(users.ownerId ? users.ownerId : "not online");
      }
    });

    if (isOwner) {
      socket.current.on("visitorOnline", (id) => {
        setRoomVisitorId(id);
        setPartnerSocketid(id);
        console.log("the visitor is online!!");
      });
    } else {
      socket.current.on("ownerOnline", (id) => {
        setRoomOwnerId(id);
        setPartnerSocketid(id);
        console.log("the owner is online!!");
      });
    }

    socket.current.on("hey", (data) => {
      console.log("in hey", data.signal);
      setPartnerSignal(data.signal);
    });

    if (!isOwner) {
      fetch("http://localhost:8001/sendNotificationEnteredRoom", {
        method: "post",
        headers:{
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          roomname,
          roomownername
        }),
      });
    }
    // eslint-disable-next-line
  }, []);

  const startConversation = () => {
    console.log("initiate the call");
    const peer = new Peer({
      initiator: true,
      trickle: false,
      stream: yourVideoStream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("callUser", {
        userToCall: partnerSocketId, //id of the user to call
        signalData: data, //our signal data
        from: yourSocketId, //the receiver want's to know who is calling, so we pass our ID as wel
      });
    });

    peer.on("stream", (stream) => {
      // displaying the video of the other person
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    socket.current.on("callAccepted", (signal) => {
      console.log("call accepted");
      setCallAccepted(true);
      peer.signal(signal);
    });
  };

  const acceptCall = () => {
    console.log("in acceptCall method");
    setCallAccepted(true);

    const peer = new Peer({
      initiator: false,
      trickle: false,
      stream: yourVideoStream,
    });

    peer.on("signal", (data) => {
      socket.current.emit("acceptCall", {
        signal: data,
        to: roomOwnerId,
      });
    });

    peer.on("stream", (stream) => {
      console.log("stream", stream);
      console.log(partnerVideo);

      partnerVideo.current.srcObject = stream;
    });

    peer.signal(partnerSignal);
  };

  const copyLink = () => {
    navigator.clipboard
      .writeText(`http://localhost:3000/visitroom/${roomownername}/${roomname}`)
      .then(() => {
        console.log("Text copied to clipboard");
        alert("coppied!! share the coppied link with somebody");
      })
      .catch((err) => {
        console.log("Could not copy text: ", err);
        alert("ERROR" + err);
      });
  };

  let yourVideoElement;
  if (yourVideoStream) {
    yourVideoElement = <video playsInline ref={yourVideo} autoPlay />;
  }

  let partnerVideoElement;
  if (callAccepted) {
    partnerVideoElement = <video playsInline ref={partnerVideo} autoPlay />;
  }

  if (
    isOwner &&
    yourSocketId &&
    partnerSocketId &&
    partnerSocketId !== "not online"
  ) {
    startConversation();
  }

  return (
    <motion.div variants={pageTransition} initial="out" exit="out" animate="in">
      <h1>
        {isOwner
          ? "YOU ARE THE OWNER OF THIS ROOM: "
          : "YOU ARE THE VISITOR OF THE ROOM: "}{" "}
        {roomname}
      </h1>

      {isOwner && <button onClick={copyLink}>share this room</button>}

      {partnerSignal ? (
        <button onClick={acceptCall}>start call with room owner</button>
      ) : (
        <h2>the other person is not yet online</h2>
      )}

      <h2>your video:</h2>

      {yourVideoElement}
      <h2>partner video:</h2>
      {partnerVideoElement}

      <h2>dev info</h2>
      <div>your socket: {yourSocketId}</div>
      <div>partner socket: {partnerSocketId}</div>
      <hr></hr>
      <div>room owner id: {roomOwnerId}</div>
      <div>room visitor id: {roomVisitorId}</div>
      <hr></hr>
      <div>is owner: {isOwner.toString()}</div>
      <hr></hr>
    </motion.div>
  );
}

export default Room;
