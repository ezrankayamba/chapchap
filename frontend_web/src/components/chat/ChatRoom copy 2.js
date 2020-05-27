import React, { useEffect, useState } from "react";
import WsHandler from "../../_helpers/WsHandler";
import CRUD from "../../_services/CRUD";
import { useHistory } from "react-router-dom";
import Numbers from "../../_helpers/Numbers";
const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};
const guid = Numbers.guid(true);

function ChatRoom(props) {
  const [connected, setConnected] = useState(false);

  const history = useHistory();
  let state = history.location.state;
  const orginizer = (state && state.orginizer) || false;
  const id = history.location.pathname.split("/")[2];
  let ws;
  let pc;
  let localStream;
  let constraints = { video: true };
  const handleLocalIceCandicates = (e) => {
    console.log(guid);
    if (e.candidate) {
      console.log(e.candidate);
      ws.send({ guid: guid, cmd: "candidate", message: e.candidate });
    }
  };
  const setupComplete = () => {
    console.log("Setup is complete!");
  };
  const handleRemoteStream = (e) => {
    console.log("Remote stream.....");
    let video = document.querySelector("video#you");
    video.srcObject = e.stream;
    video.play();
  };
  const makeCall = () => {
    pc = new RTCPeerConnection(configuration);
    pc.onicecandidate = handleLocalIceCandicates;
    pc.addEventListener("connectionstatechange", (event) => {
      if (pc.connectionState === "connected") {
        console.log("Connected................");
      }
    });
    pc.onaddstream = handleRemoteStream;
    navigator.getUserMedia(constraints, successCallback, errorCallback);
  };
  const answerCall = () => {
    pc = new RTCPeerConnection(configuration);
    pc.onicecandidate = handleLocalIceCandicates;
    pc.addEventListener("connectionstatechange", (event) => {
      if (pc.connectionState === "connected") {
        console.log("Connected................");
      }
    });
    pc.onaddstream = handleRemoteStream;
    navigator.getUserMedia(constraints, successCallback, errorCallback);
  };
  const onConnect = () => {
    setConnected(true);
    ws.send({ message: "Hi!" });
    if (orginizer) {
      makeCall();
    } else {
      answerCall();
    }
  };
  const onMessage = (data) => {
    if (orginizer && data.type === "answer") {
      const remoteDesc = new RTCSessionDescription(data);
      pc.setRemoteDescription(remoteDesc).then(() => setupComplete());
    } else if (data.type === "answer") {
      setupComplete();
    } else if (data.type === "candidate" && data.guid !== guid) {
      console.log("Candidate message received: ", data);
      pc.addIceCandidate(data.data);
    }
  };

  function successCallback(stream) {
    let video = document.querySelector("video#me");
    video.srcObject = stream;
    video.play();
    localStream = stream;
    pc.addStream(localStream);
    if (orginizer) {
      pc.createOffer().then((desc) => {
        pc.setLocalDescription(desc).then(() => {
          CRUD.update(
            `/ws/chatroom/${id}`,
            null,
            {
              offer: desc,
              status: 1,
            },
            {
              onSuccess: (res) => {
                // navigator.getUserMedia(constraints, successCallback, errorCallback);
              },
              onFail: (res) => console.error(res),
            }
          );
        });
      });
    } else {
      CRUD.read(`/ws/callgroup/${id}`, null, {
        onSuccess: (res) => {
          pc.setRemoteDescription(
            new RTCSessionDescription(JSON.parse(res.offer))
          );
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer);
            ws.send({ cmd: "answer", message: answer });
          });
        },
      });
    }
  }

  function errorCallback(error) {
    console.log("navigator.getUserMedia error: ", error);
  }
  useEffect(() => {
    ws = new WsHandler({
      onMessage,
      onConnect,
    });
  }, []);
  return (
    <div className="chat-room">
      <h5>Chat room</h5>
      <div className="screens">
        <div>
          <video id="me"></video>
        </div>
        <div>
          <video id="you"></video>
        </div>
      </div>
      <button>Close Call</button>
    </div>
  );
}

export default ChatRoom;
