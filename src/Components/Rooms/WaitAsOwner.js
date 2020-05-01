import React, { useRef, useEffect, useState } from "react";
import {copyLink} from '../../helpers'
import "./Wait.scss";

function WaitAsOwner({ roomname, roomownername }) {
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
  }, []);

  let yourVideoElement;
  if (yourVideoStream) {
    yourVideoElement = (
      <video playsInline className="waitVideo" ref={yourVideo} autoPlay />
    );
  }

  return (
    <div className="waitContainer">
      <div className="waitHead">
        <h1>{roomname} is still empty</h1>
        <button
          className="highlightedButton"
          onClick={() => copyLink(roomownername, roomname)}
        >
          share link
        </button>
      </div>
      {yourVideoElement}
    </div>
  );
}

export default WaitAsOwner;
