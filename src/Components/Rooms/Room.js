import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

function Room({ isOwner }) {
  const [yourSocketId, setYourSocketId] = useState();
  const [partnerSocketId, setPartnerSocketid] = useState();

  const [roomOwnerId, setRoomOwnerId] = useState();
  const [roomVisitorId, setRoomVisitorId] = useState();

  const [yourVideoStream, setYourVideoStream] = useState();

  const yourVideo = useRef();
  const partnerVideo = useRef();
  const socket = useRef();
  useEffect(() => {
    socket.current = io.connect("http://localhost:8000");

    navigator.mediaDevices
      .getUserMedia({video: true, audio: false})
      .then(stream => {
        setYourVideoStream(stream)
        if(yourVideo.current){
          yourVideo.current.srcObject = stream
        }
      })


    socket.current.on('yourSocketId',(id) => {
      setYourSocketId(id)
      if(isOwner){
        setRoomOwnerId(id)
        socket.current.emit('setOwnerId', id)
      }else{
        setRoomVisitorId(id)
        socket.current.emit('setVisitorId', id)
      }
    })

    socket.current.on('users', users => {
      if(isOwner){
        setRoomVisitorId(users.visitorId?users.visitorId:'the visitor is not yet online')
        setPartnerSocketid(users.visitorId?users.visitorId:'the visitor is not yet online')
      }
      else{
        setRoomOwnerId(users.ownerId?users.ownerId:'the room owner is not yet online')
        setPartnerSocketid(users.ownerId?users.ownerId:'the room owner is not yet online')
      }
    })

    if(isOwner){
      socket.current.on('visitorOnline', (id) => {
        setRoomVisitorId(id)
        setPartnerSocketid(id)
        console.log('the visitor is online!!')
      })
    }else{
      socket.current.on('ownerOnline', (id) => {
        setRoomOwnerId(id)
        setPartnerSocketid(id)
        console.log('the owner is online!!')
      })
    }
    // eslint-disable-next-line
  }, []);





  let yourVideoEelement
  if(yourVideoStream){
    yourVideoEelement = <video playsInline ref={yourVideo} autoPlay />
  }

  return (
    <div>
      <h1> chatroom</h1>
      <div>your socket: {yourSocketId}</div>
      <div>partner socket: {partnerSocketId}</div>

      <div>room owner id: {roomOwnerId}</div>
      <div>room visitor id: {roomVisitorId}</div>
      <div>is owner: {isOwner.toString()}</div>
      
      <h2>your video:</h2>
      {yourVideoEelement}
    </div>
  );
}

export default Room;
