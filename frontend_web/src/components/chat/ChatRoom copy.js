import React, { useEffect, useState } from "react";
import WsHandler from "../../_helpers/WsHandler";
import CRUD from "../../_services/CRUD";
import { useHistory } from "react-router-dom";
import Numbers from "../../_helpers/Numbers";
import VideoBox from "./VideoBox";
import UUID from "../../_helpers/UUID";
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
const constraints = {
  video: {
    width: { max: 320 },
    height: { max: 240 },
    frameRate: { max: 30 },
  },
  audio: false,
};

function ChatRoom(props) {
  let localStream;
  const peersPool = {};
  const localUuid = UUID.get();
  let ws;

  function start() {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices
        .getUserMedia(constraints)
        .then((stream) => {
          localStream = stream;
          let video = document.getElementById("localVideo");
          video.srcObject = stream;
          video.play();
        })
        .catch(errorHandler)
        .then(() => {
          ws = WsHandler({
            onMessage: gotMessageFromServer,
            onConnect: onConnect,
          });
        })
        .catch(errorHandler);
    } else {
      alert("Your browser does not support getUserMedia API");
    }
  }
  function errorHandler(err) {
    console.error(err);
  }
  function checkPeerDisconnect(event, peerUuid) {
    let state = peersPool[peerUuid].pc.iceConnectionState;
    console.log(`connection with peer ${peerUuid} ${state}`);
    if (state === "failed" || state === "closed" || state === "disconnected") {
      delete peersPool[peerUuid];
      document
        .getElementById("videos")
        .removeChild(document.getElementById("remoteVideo_" + peerUuid));
      updateLayout();
    }
  }
  function gotRemoteStream(event, peerUuid) {
    console.log(`got remote stream, peer ${peerUuid}`);
    let video = document.createElement("video");
    video.setAttribute("autoplay", "");
    video.setAttribute("muted", "");
    video.srcObject = event.streams[0];
    let container = document.createElement("div");
    container.setAttribute("id", "remoteVideo_" + peerUuid);
    container.setAttribute("class", "videoContainer");
    container.appendChild(video);
    document.getElementById("videos").appendChild(container);
    updateLayout();
  }
  function updateLayout() {
    let rowHeight = "98vh";
    let colWidth = "98vw";

    let numVideos = Object.keys(peerConnections).length + 1;

    if (numVideos > 1 && numVideos <= 4) {
      rowHeight = "48vh";
      colWidth = "48vw";
    } else if (numVideos > 4) {
      rowHeight = "32vh";
      colWidth = "32vw";
    }
    document.documentElement.style.setProperty(`--rowHeight`, rowHeight);
    document.documentElement.style.setProperty(`--colWidth`, colWidth);
  }
  function gotIceCandidate(e, peerUuid) {
    if (e.candidate) {
      ws.send({
        uuid: localUuid,
        dest: peerUuid,
        ice: e.candidate,
      });
    }
  }
  function createdDescription(description, peerUuid) {
    peersPool[peerUuid].pc.setLocalDescription(description);
    ws.send({
      uuid: localUuid,
      dest: peerUuid,
      sdp: description,
    });
  }

  function setUpPeer(peerUuid, initCall = false) {
    if (peersPool[peerUuid]) {
      return;
    }
    peersPool[peerUuid] = {
      pc: new RTCPeerConnection(configuration),
    };
    peersPool[peerUuid].pc.onicecandidate = (event) =>
      gotIceCandidate(event, peerUuid);
    peersPool[peerUuid].pc.onaddstream = (event) =>
      gotRemoteStream(event, peerUuid);
    peersPool[peerUuid].pc.oniceconnectionstatechange = (event) =>
      checkPeerDisconnect(event, peerUuid);
    peersPool[peerUuid].pc.addStream(localStream);
    console.log("Added stream: ", peerUuid);

    if (initCall) {
      peersPool[peerUuid].pc
        .createOffer()
        .then((description) => createdDescription(description, peerUuid))
        .catch(errorHandler);
    }
  }
  function gotMessageFromServer(signal) {
    let peerUuid = signal.uuid;
    if (peerUuid == localUuid) {
      return;
    }
    let toMe = signal.dest === localUuid || signal.dest === "all";
    if (!toMe) {
      return;
    }

    console.log("Process message", signal);
    if (signal.dest == "all") {
      setUpPeer(peerUuid);
      ws.send({
        uuid: localUuid,
        dest: peerUuid,
      });
    } else if (signal.dest == localUuid) {
      setUpPeer(peerUuid, true);
    } else if (signal.sdp) {
      console.log("SDP?");
      peersPool[peerUuid].pc
        .setRemoteDescription(new RTCSessionDescription(signal.sdp))
        .then(function () {
          if (signal.sdp.type == "offer") {
            peersPool[peerUuid].pc
              .createAnswer()
              .then((description) => createdDescription(description, peerUuid))
              .catch(errorHandler);
          }
        })
        .catch(errorHandler);
    } else if (signal.ice) {
      peersPool[peerUuid].pc
        .addIceCandidate(new RTCIceCandidate(signal.ice))
        .catch(errorHandler);
    }
  }
  function onConnect() {
    ws.send({ uuid: localUuid, dest: "all" });
  }

  useEffect(() => {
    start();
  }, []);
  return (
    <div className="chat-room">
      <h5>Chat room - {localUuid}</h5>
      <div id="videos" class="videos">
        <div id="localVideoContainer" class="videoContainer">
          <video id="localVideo" autoplay muted></video>
        </div>
      </div>
    </div>
  );
}

export default ChatRoom;
