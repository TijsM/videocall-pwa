import React from "react";
import {firestore} from '../../firebase'

function RequestNotifications(){

  const request = async () => {
    const sw = await navigator.serviceWorker.ready;
    let pushSub = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BEV0UUVQ_akT0b0168P6JVwebBpOqLtbl7-kejmlUijGA01VtfkXR7irgn9yLwZhYvO3FZVnn_7mVyRd9Jv85Zw'
    })


    console.log('here')
    //store this push object (the subscription) in the database with the user
    console.log(JSON.stringify(pushSub))

    console.log("storing subscription in the database");
    const _user = JSON.parse(localStorage.getItem("user"));

    const userRef = firestore.collection("users").doc(_user.email);
    userRef.get().then((prom) => {
      userRef.set(
        {
          notificationSubscription: JSON.stringify(pushSub),
        },
        { merge: true }
      );
    });
    
  }

  return <button onClick={request}>request</button>
}

export default RequestNotifications 