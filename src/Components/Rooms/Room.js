import React, { useState, useRef, useEffect } from "react";
import io from "socket.io-client";
import Peer from "simple-peer";

function Room({ isOwner }) {
  const [yourSocketId, setYourSocketId] = useState();
  const [roomOwnerId, setRoomOwnerId] = useState();
  const [roomVisitorId, setRoomVisitorId] = useState();

  const socket = useRef();

  useEffect(() => {
    //excecuts one time

    socket.current = io.connect("http://localhost:8000");
    // socket.current = io.connect("https://video-chat-backend.glitch.me/");

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
        setRoomVisitorId(users.visitorId?users.visitorId:'the user is not yet online')
      }
      else{
        setRoomOwnerId(users.ownerId?users.ownerId:'the room owner is not yet online')
      }
    })

    if(isOwner){
      socket.current.on('visitorOnline', (id) => {
        setRoomVisitorId(id)
        console.log('the visitor is online!!')
      })
    }else{
      socket.current.on('ownerOnline', (id) => {
        setRoomOwnerId(id)
        console.log('the owner is online!!')
      })
    }

   

    

    // eslint-disable-next-line
  }, []);

  return (
    <div>
      <h1> chatroom</h1>
      <div>your socket: {yourSocketId}</div>
      <div>room owner id: {roomOwnerId}</div>
      <div>room visitor id: {roomVisitorId}</div>
      <div>is owner: {isOwner.toString()}</div>
    </div>
  );
}

export default Room;
