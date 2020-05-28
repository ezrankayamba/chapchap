import React, { useEffect } from "react";
import WsHandler from "../../_helpers/WsHandler";
import UUID from "../../_helpers/UUID";
import WebRTC from "./WebRTC";
const constraints = {
  video: true,
  audio: true,
};

function ChatRoom() {
  const localUuid = UUID.get();
  let peers = [];
  let ws;
  let localStream;

  const createVideo = (uuid) => {
    let parts = uuid.split("-");
    let template = document.createElement("template");
    let html = `
    <div id="${uuid}" class="video-wrap">
        <p>You: ${parts[parts.length - 1]}</p>
        <video></video>
    </div>
    `;

    html = html.trim(); // Never return a text node of whitespace as the result
    template.innerHTML = html;
    return template.content.firstChild;
  };
  function startRTC(peer, initiator = false, data) {
    let rtc = WebRTC(localStream, send, peer, initiator, data);
    peers = peers.map((p) => (p.uuid === peer.uuid ? { ...p, pc: rtc } : peer));
  }
  const handleJoined = (uuid, ack = false) => {
    let peer = peers.find((p) => p.uuid === uuid);
    if (!peer) {
      peer = { uuid: uuid };
      peers.push(peer);
      let screens = document.querySelector("#screens");
      let wrap = createVideo(uuid);
      screens.appendChild(wrap);
    }
    if (!ack) {
      send("join_ack", uuid);
      startRTC(peer, true);
    }
  };

  const send = (type, dest, data) => {
    ws.send({
      uuid: localUuid,
      dest,
      data,
      type,
    });
  };
  const log = (msg) => {
    let now = new Date().toLocaleString();
    console.log(`${now} - ${msg}`);
  };
  const handleVideoOffer = (uuid, data) => {
    let peer = peers.find((p) => p.uuid === uuid);
    startRTC(peer, false, data);
  };
  const handleVideoAnswer = (uuid, data) => {
    let peer = peers.find((p) => p.uuid === uuid);
    if (peer && peer.pc && data) {
      peer.pc.handleAnswer(data);
    }
  };
  const handleNewIceCandicate = (uuid, data) => {
    let peer = peers.find((p) => p.uuid === uuid);
    if (peer && peer.pc && data) {
      peer.pc.handleNewCanditate(data);
    }
  };
  const handleMessage = ({ uuid, type, data }) => {
    switch (type) {
      case "joined":
        handleJoined(uuid);
      case "join_ack":
        handleJoined(uuid, true);
        break;
      case "video-offer":
        handleVideoOffer(uuid, data);
        break;
      case "video-answer":
        handleVideoAnswer(uuid, data);
        break;
      case "new-ice-candidate":
        handleNewIceCandicate(uuid, data);
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
          localStream = stream;
          let video = document.querySelector("#me video");
          video.srcObject = stream;
          video.play();
          initWs();
        })
        .catch(errorHandler);
    } else {
      alert("Your browser does not support getUserMedia API");
    }
  }

  function initWs() {
    ws = WsHandler({
      onMessage: (sig) => {
        if (
          (sig.dest === "all" || sig.dest === localUuid) &&
          sig.uuid !== localUuid
        ) {
          handleMessage(sig);
        }
      },
      onConnect: () => {
        send("joined", "all");
      },
    });
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
