import { firestore } from "./firebase";
import swal from 'sweetalert'
export const storeUserInFirestore = (email, userName) => {
  console.log('here')
  firestore
    .collection("users").doc(email)
    .set({
      email: email,
      userName: userName,
      rooms:[],
      notificationSubscription:null
    })
    .then((docref) => {
      console.log("written to firestore with id: ", docref);
      window.location.reload()
    })
    .catch((err) => {
      console.error(err);
    });
};

export const storeUserInLocalStorage = (email, userName) => {
  localStorage.setItem(
    "user",
    JSON.stringify({
      email: email,
      userName: userName,
    })
  );
};

export const copyLink = (owner, room) => {
  if('share' in navigator){
    const shareData = {
      title: 'Join my room!',
      text: 'Click on the link and we can have a video chat ;-)',
      url: `https://videocall-pwa.netlify.app/visitroom/${owner}/${room}`,
    }
    navigator.share(shareData)
  }
  else{
    navigator.clipboard
    .writeText(`https://videocall-pwa.netlify.app/visitroom/${owner}/${room}`)
    .then(() => {
      console.log("Text copied to clipboard");
      swal("we have coppied the shareable link for you. Send it to your friends")
    })
    .catch((err) => {
      console.log("Could not copy text: ", err);
      alert(`you can share this link: https://videocall-pwa.netlify.app/visitroom/${owner}/${room}`);
    });
  }
};
