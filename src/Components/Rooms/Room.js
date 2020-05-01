import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition, pageVariant } from "../../Transitions";
import WaitAsOwner from "./WaitAsOwner";
import WaitAsVisitor from "./WaitAsVisitor";

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
  useEffect(() => {
    // socket.current = io.connect("https://videocall-pwa.glitch.me/");
    socket.current = io.connect("http://localhost:8000");

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
        socket.current.emit("setOwnerId", { id, roomname, roomownername });
      } else {
        setRoomVisitorId(id);
        socket.current.emit("setVisitorId", { id, roomname, roomownername });
      }
    });

    socket.current.on("users", (users) => {
      if (isOwner) {
        console.log("users on users emit", users);
        if (users && users[roomownername] && users[roomownername][roomname]) {
          console.log("check passed");
          console.log("check if everything is present, and setup the state");
          setRoomVisitorId(
            users[roomownername][roomname].visitorId
              ? users[roomownername][roomname].visitorId
              : "not online"
          );
          setPartnerSocketid(
            users[roomownername][roomname].visitorId
              ? users[roomownername][roomname].visitorId
              : "not online"
          );
        }
        // setRoomVisitorId(users.visitorId ? users.visitorId : "not online");
        // setPartnerSocketid(users.visitorId ? users.visitorId : "not online");
      } else {

        if (users && users[roomownername] && users[roomownername][roomname]) {
          console.log("check passed");
          console.log("check if everything is present, and setup the state");
          setRoomOwnerId(
            users[roomownername][roomname].ownerId
              ? users[roomownername][roomname].ownerId
              : "not online"
          );
          setPartnerSocketid(
            users[roomownername][roomname].ownerId
              ? users[roomownername][roomname].ownerId
              : "not online"
          );
        }
        // setRoomOwnerId(users.ownerId ? users.ownerId : "not online");
        // setPartnerSocketid(users.ownerId ? users.ownerId : "not online");
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

    console.log("your vid stream", yourVideoStream);

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
    <motion.div
      variants={pageVariant}
      transition={pageTransition}
      initial="initial"
      exit="out"
      animate="in"
    >
      {!callAccepted ? (
        isOwner ? (
          <WaitAsOwner />
        ) : (
          <WaitAsVisitor
            partnerSignal={partnerSignal}
            roomname={roomname}
            roomownername={roomownername}
            acceptCall={acceptCall}
          />
        )
      ) : (
        <div></div>
      )}

      <h2>your video:</h2>
      {yourVideoElement}
      <h2>partner video:</h2>
      {partnerVideoElement}
    </motion.div>
  );
}

export default Room;
