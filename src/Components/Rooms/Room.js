import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";
import { useParams } from "react-router-dom";
import { motion } from "framer-motion";
import { pageTransition, pageVariant } from "../../Transitions";
import WaitAsOwner from "./WaitAsOwner";
import WaitAsVisitor from "./WaitAsVisitor";
import { useHistory } from "react-router-dom";

import stopIcon from "../../assets/stop.svg";
import muteIcon from "../../assets/mute.svg";
import disableVidIcon from "../../assets/disableVideo.svg";

import "./Room.scss";

function Room({ isOwner }) {
  console.log("in room");
  const [yourSocketId, setYourSocketId] = useState();
  const [partnerSocketId, setPartnerSocketid] = useState();

  const [roomOwnerId, setRoomOwnerId] = useState();
  const [, setRoomVisitorId] = useState();

  const [yourVideoStream, setYourVideoStream] = useState();
  const [streamAudio, setStreamAudio] = useState(true);
  const [streamVideo, setStreamVideo] = useState(true);

  const [callAccepted, setCallAccepted] = useState(false);
  const [partnerSignal, setPartnerSignal] = useState();

  const [displayStats] = useState(false);

  const [stats, setStats] = useState({
    yourVid: {
      fps: 0,
      dropped: 0,
    },
    receivingVid: {
      fps: 0,
      dropped: 0,
    },
  });

  const yourVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  const history = useHistory();

  const { roomname, roomownername } = useParams();

  useEffect(() => {
    console.log("in room");
    socket.current = io.connect("https://videocall-pwa.glitch.me/");
    // socket.current = io.connect("http://localhost:8000");

    navigator.mediaDevices
      .getUserMedia({ video: streamVideo, audio: streamAudio })
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
      console.log(data);
      if (data.users[roomownername][roomname].ownerId) {
        console.log("chekc");
        setPartnerSignal(data.signal);
      } else {
        console.log("no check");
      }
    });

    if (isOwner && displayStats) {
      measureFrames(document.getElementById("partnerVid"), "partnerVid");
      measureFrames(document.getElementById("yourVid"), "yourVid");
    }

    // eslint-disable-next-line
  }, [streamAudio, streamVideo]);

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

  const closeCall = () => {
    console.log("here");
    if (isOwner) {
      history.push("/home");
    } else {
      window.location.reload();
    }
  };

  const toggleAudio = () => {
    console.log("in audo");
    setStreamAudio(!streamAudio);
  };

  const toggleVideo = () => {
    console.log("in video");
    setStreamVideo(!streamVideo);
  };

  let yourVideoElement;
  if (yourVideoStream) {
    yourVideoElement = (
      <video
        muted
        id="yourVid"
        className="yourVideo"
        playsInline
        ref={yourVideo}
        autoPlay
      />
    );
  }

  let partnerVideoElement;
  if (callAccepted) {
    partnerVideoElement = (
      <video
        id="partnerVid"
        className="partnerVideo"
        playsInline
        ref={partnerVideo}
        autoPlay
      />
    );
  }

  if (
    isOwner &&
    yourSocketId &&
    partnerSocketId &&
    partnerSocketId !== "not online"
  ) {
    startConversation();
  }

  const measureFrames = (vid, vidname) => {
    let timer = 0;
    setInterval(() => {
      timer++;
      let fps;
      if (vid) {
        fps = vid.webkitDecodedFrameCount / timer;
        const _stats = { ...stats };
        if (vidname === "yourVid") {
          _stats.yourVid.fps = fps;
          _stats.yourVid.dropped = vid.webkitDroppedFrameCount;
          _stats.yourVid.resolution = `${vid.videoWidth}x${vid.videoHeight}`;
        } else {
          _stats.receivingVid.fps = fps;
          _stats.receivingVid.dropped = vid.webkitDroppedFrameCount;
          _stats.receivingVid.resolution = `${vid.videoWidth}x${vid.videoHeight}`;
        }
        _stats.timePassed = timer;
        setStats(_stats);
      }
    }, 1000);
  };

  let statsContainer = null;
  statsContainer = displayStats && (
    <div className="statsContainer">
      <div> duration: {stats.timePassed} </div>
      <div> your video fps: {stats.yourVid.fps.toFixed(2)} </div>
      <div> your video frame drops: {stats.yourVid.dropped}</div>
      <div> your video resolution: {stats.yourVid.resolution}</div>
      <div> receiving video fps: {stats.receivingVid.fps.toFixed(2)}</div>
      <div> receiving frame drops: {stats.receivingVid.dropped}</div>
      <div> receiving video resolution: {stats.receivingVid.resolution}</div>
    </div>
  );

  return (
    <motion.div
      variants={pageVariant}
      transition={pageTransition}
      initial="initial"
      exit="out"
      animate="in"
      className="roomContainer"
    >
      {!callAccepted &&
        (isOwner ? (
          <WaitAsOwner roomownername={roomownername} roomname={roomname} />
        ) : (
          <WaitAsVisitor
            partnerSignal={partnerSignal}
            roomname={roomname}
            roomownername={roomownername}
            acceptCall={acceptCall}
          />
        ))}
      {yourVideoElement}
      {partnerVideoElement}
      {statsContainer}
      <div className="roomControlls">
        <div
          className={
            streamAudio
              ? "roomControllsIconContainer"
              : "roomControllsIconContainer selected"
          }
          onClick={toggleAudio}
        >
          <img src={muteIcon} alt="mute icon" />
        </div>
        <div>
          <img onClick={closeCall} src={stopIcon} alt="delete icon" />
        </div>
        <div
          className={
            streamVideo
              ? "roomControllsIconContainer"
              : "roomControllsIconContainer selected"
          }
          onClick={toggleVideo}
        >
          <img src={disableVidIcon} alt="video icon" />
        </div>
      </div>
    </motion.div>
  );
}

export default Room;
