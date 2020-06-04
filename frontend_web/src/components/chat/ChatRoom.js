import React, { useEffect } from "react";
import UUID from "../../_helpers/UUID";
import RTCSinaling from "./RTCSinaling";
import RTCSession from "./RTCSession";
const constraints = {
  video: true,
  audio: false,
};

function ChatRoom() {
  const localUuid = UUID.get();
  const session = new RTCSession(localUuid);

  const handleMessage = ({ uuid, type, data }) => {
    console.log("\n\n", uuid, type, data, "\n\n");
    switch (type) {
      case "negotiate":
        session.handleNegotiate(uuid, data);
        break;
      case "joined":
        session.handleJoined(uuid);
      case "join_ack":
        session.handleJoined(uuid, true);
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
          sig.init(handleMessage);
          session.sig = sig;
          session.localStream = stream;
        })
        .catch(errorHandler);
    } else {
      alert("Your browser does not support getUserMedia API");
    }
  }

  useEffect(() => {
    start();
  }, []);
  let parts = localUuid.split("-");
  return (
    <div className="chat-room">
      <h5>Chat room</h5>
      <div id="screens" class="videos">
        <div id="me" class="video-wrap">
          <p>Me: {parts[parts.length - 1]}</p>
          <video></video>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
