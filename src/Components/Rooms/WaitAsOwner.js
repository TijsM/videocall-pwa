import React from "react";
import {copyLink} from '../../helpers'
import "./Wait.scss";

function WaitAsOwner({ roomname, roomownername }) {



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
      <div className="waitIllustration"></div>

      {/* {yourVideoElement} */}
    </div>
  );
}

export default WaitAsOwner;
