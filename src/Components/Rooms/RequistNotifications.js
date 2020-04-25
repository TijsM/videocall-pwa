import React, { useState, useEffect } from "react";
import {messaging} from '../../firebase'

function RequestNotifications(){

  const request = async () => {
    console.log('here')

    const sw = await navigator.serviceWorker.ready;
    let push = await sw.pushManager.subscribe({
      userVisibleOnly: true,
      applicationServerKey: 'BEV0UUVQ_akT0b0168P6JVwebBpOqLtbl7-kejmlUijGA01VtfkXR7irgn9yLwZhYvO3FZVnn_7mVyRd9Jv85Zw'
    })

    //store this push object (the subscription) in the database with the user
    console.log(JSON.stringify(push))
    
  }

  return <button onClick={request}>request</button>
}

export default RequestNotifications 