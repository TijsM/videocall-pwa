import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

function Room() {
  const [yourID, setYourID] = useState("");
  const [users, setUsers] = useState({});
  const [stream, setStream] = useState();
  const [receivingCall, setReceivingCall] = useState(false);
  const [caller, setCaller] = useState("");
  const [callerSignal, setCallerSignal] = useState();
  const [callAccepted, setCallAccepted] = useState(false);

  const userVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();

  useEffect(() => {
    //creating a socket with our backend
    // socket.current = io.connect("https://videocall-pwa.glitch.me/");
    socket.current = io.connect("https://video-chat-backend.glitch.me/");

    //getting the video and the audio from our device
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setStream(stream);
        if (userVideo.current) {
          userVideo.current.srcObject = stream;
        }
      });

    // when a user connects, the backend will assign him an id
    // this ID is emitted so the user knows what his id is
    socket.current.on("yourID", (id) => {
      setYourID(id);
    });

    // getting all the users that are connected with the on the server with socket.io
    socket.current.on("allUsers", (users) => {
      setUsers(users);
    });

    // backend reaches out to us when somebody tries to call us
    //based on these state changes, a message will be shown on the screen 'xxx tries to call you'
    socket.current.on("hey", (data) => {
      setReceivingCall(true); // setting state - we are receiving a call
      setCaller(data.from); // setting state - se id of the person that's calling us
      setCallerSignal(data.signal); // setting state - the signal of the person that's callin us (the peer-data)
    });

    /* eslint-disable*/
  }, []);
  /* eslint-enable*/

  console.log("users", users);

  function callPeer(id) {
    // object from the library simple peer
    // simple peer makes webRTC easier to work with
    const peer = new Peer({
      initiator: true, // is this person the person who is calling
      trickle: false, // should always be false
      stream: stream, // the video object
    });

    //everytime a Peer is created, a signal event is fired

    // NOT A SOCKET IO EVENT but a peer event (webrtc)
    // signalling is letting all the other peers know what our intent/ capabilities are
    // when signalling, there is no server involved
    peer.on("signal", (data) => {
      //socket is ref to the socket (useRef)

      //passing the data on who we want to call
      socket.current.emit("callUser", {
        userToCall: id, //id of the user to call
        signalData: data, //our signal data
        from: yourID, //the receiver want's to know who is calling, so we pass our ID as wel
      });
    });

    // NOT A SOCKET IO EVENT but a peer event (webrtc)
    // this evet is fired whe the peer object has a key with the name 'stream'
    // the param we receive is the video stream of the person that's called
    peer.on("stream", (stream) => {
      // displaying the video of the other person
      if (partnerVideo.current) {
        partnerVideo.current.srcObject = stream;
      }
    });

    // triggered when the call was accepted by the person that's called
    socket.current.on("callAccepted", (signal) => {
      setCallAccepted(true); //update state
      peer.signal(signal); //setting the signal of our peer with the data we received
    });
  }

  // when the user clicks 'acceptCall'
  function acceptCall() {
    setCallAccepted(true); // updating state

    //creating the peer for the person who is receiving the call
    const peer = new Peer({
      initiator: false, // this person is NOT the caller
      trickle: false, // always false
      stream: stream, // storing the video on the peer
    });

    //everytime a Peer is created, a signal event is fired

    // NOT A SOCKET IO EVENT but a peer event (webrtc)
    // signalling is letting all the other peers know what our intent/ capabilities are
    // when signalling, there is no server involved
    peer.on("signal", (data) => {
      //when the peer is created, we want to let the server know that we have accepted the call
      socket.current.emit("acceptCall", { signal: data, to: caller });
    });

    // NOT A SOCKET IO EVENT but a peer event (webrtc)
    // this evet is fired whe the peer object has a key with the name 'stream'
    // the param we receive is the video stream of the person that's called
    peer.on("stream", (stream) => {
      //inserting the video stream we receive in a html video element
      partnerVideo.current.srcObject = stream;
    });

    // establishing the connection between the two peers (caller and person who is called)
    peer.signal(callerSignal);
  }

  let UserVideo;
  if (stream) {
    UserVideo = <video playsInline muted ref={userVideo} autoPlay />;
  }

  let PartnerVideo;
  if (callAccepted) {
    PartnerVideo = <video playsInline ref={partnerVideo} autoPlay />;
  }

  let incomingCall;
  if (receivingCall) {
    incomingCall = (
      <div>
        <h1>{caller} is calling you</h1>
        <button onClick={acceptCall}>Accept</button>
      </div>
    );
  }

  return (
    <div className="container">
      <h2> your ID: {yourID}</h2>
      <div className="row">
        {UserVideo}
        {PartnerVideo}
      </div>
      <div>
        {/* constantly loop over all the keys that are in socket.io in the users object */}
        {Object.keys(users).length === 1 ? (
          <div> there are no users online</div>
        ) : (
          // remove the users id
          Object.keys(users).map((key) => {
            if (key === yourID) {
              return null;
            }
            return (
              <button key={key} onClick={() => callPeer(key)}>
                Call {key}
              </button>
            );
          })
        )}
      </div>
      <div>{incomingCall}</div>
    </div>
  );
}

export default Room;
