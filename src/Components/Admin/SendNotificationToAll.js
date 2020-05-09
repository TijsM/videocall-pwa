import React, { useState } from "react";

import "./admin.scss";

function SendNotificationsToAll() {
  const [title, setTitle] = useState();
  const [body, setBody] = useState();

  const sendNotification = () => {
    console.log("sending noti", title, body);

    fetch("http://localhost:8001/sendNotificationToAll", {
      method: "post",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        title,
        body,
      }),
    });
  };

  return (
    <div className="adminContainer">
      <h1>Send a notification to all the users </h1>
      <input
        onChange={(val) => setTitle(val.target.value)}
        placeholder="Title"
      ></input>
      <textarea
        rows={4}
        onChange={(val) => setBody(val.target.value)}
        placeholder="Notification body"
      ></textarea>
      <button className='sendNotidButton' onClick={sendNotification}>send notification</button>
    </div>
  );
}

export default SendNotificationsToAll;
