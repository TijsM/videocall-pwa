import React, { useRef, useEffect, useState } from "react";

import "./Wait.scss";

function WaitAsVisitor({ acceptCall, roomownername,roomname, partnerSignal }) {
  const [yourVideoStream, setYourVideoStream] = useState();
  const yourVideo = useRef();

  useEffect(() => {
    navigator.mediaDevices
      .getUserMedia({ video: true, audio: false })
      .then((stream) => {
        setYourVideoStream(stream);
        if (yourVideo.current) {
          yourVideo.current.srcObject = stream;
        }
      });

      console.log('before firing noti')
      fetch("https://videocall-pwa.glitch.me/sendNotificationEnteredRoom", {
        method: "post",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          roomname,
          roomownername,
        }),
      });

  }, [roomname, roomownername]);

  let yourVideoElement;
  if (yourVideoStream) {
    yourVideoElement = (
      <video playsInline className="waitVideo" ref={yourVideo} autoPlay />
    );
  }

  return (
    <div className="waitContainer">
      <div className="waitHead">
        {partnerSignal ? (
          <div>
            <h1>
              hi there! You’re about to enter a room created by {roomownername}.
            </h1>
            <button
              className="highlightedButton"
              onClick={acceptCall}
            >
              enter room
            </button>
          </div>
        ) : (
          <h1>
            hi there! You’re in {roomownername}'s room. He is not here yet, please wait
          </h1>
        )}
      </div>

      {yourVideoElement}
    </div>
  );
}

export default WaitAsVisitor;
