import React, { useEffect, useState } from "react";
import UUID from "../../_helpers/UUID";
import RTCSinaling from "./RTCSinaling";
import RTCSession from "./RTCSession";
import LocalDB from "../../_helpers/LocalDB";
const constraints = {
  video: true,
  audio: false,
};
const LOCAL_NAME_KEY = "LOCAL_NAME";
function ChatRoom() {
  const localUuid = UUID.get();
  const session = new RTCSession(localUuid);
  const [name, setName] = useState(LocalDB.get(LOCAL_NAME_KEY));

  const handleMessage = ({ uuid, type, data }) => {
    switch (type) {
      case "negotiate":
        session.handleNegotiate(uuid, data);
        break;
      case "negotiate_ack":
        session.handleNegotiateAck(uuid, data);
        break;
      case "video-offer":
        session.handleVideoOffer(uuid, data);
        break;
      case "video-answer":
        session.handleVideoAnswer(uuid, data);
        break;
      case "new-ice-candidate":
        session.handleNewIceCandicate(uuid, data);
        break;
      default:
        console.log("Not handled", type, data);
    }
  };
  function errorHandler(e) {
    console.error("Error", e);
  }
  function start() {
    if (!name) return;
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          let video = document.querySelector("#me video");
          video.srcObject = stream;
          video.onloadedmetadata = function () {
            video.play();
          };
          let sig = new RTCSinaling(localUuid);
          sig.init(handleMessage, name);
          session.sig = sig;
          session.localStream = stream;
        })
        .catch(errorHandler);
    } else {
      alert("Your browser does not support getUserMedia API");
    }
  }
  const handleJoin = (e) => {
    let name = document.getElementById("name").value;
    if (name) {
      LocalDB.set(LOCAL_NAME_KEY, name);
      setName(name);
    }
  };

  useEffect(() => {
    start();
  }, [name]);
  let parts = localUuid.split("-");
  return (
    <div className="chat-room">
      {name ? (
        <div id="screens" class="videos">
          <div id="me" class="video-wrap">
            <p>{name}</p>
            <video></video>
          </div>
        </div>
      ) : (
        <div className="join-call">
          <h5>To join provide your name</h5>
          <label htmlFor="pin" className="label-input-button">
            Name
            <input type="text" id="name" name="name" />
            <button onClick={handleJoin}>Join</button>
          </label>
        </div>
      )}
    </div>
  );
}

export default ChatRoom;
