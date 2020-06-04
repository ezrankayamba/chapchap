import HTMLHelper from "./HTMLHelper";

const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function WebRTC(localStream, send, peer, initiator) {
  console.log("Me as initiator: ", initiator, peer);
  const pc = new RTCPeerConnection(configuration);

  pc.onicecandidate = (e) => {
    if (e.candidate) {
      send("new-ice-candidate", peer.uuid, e.candidate);
    }
  };

  pc.onaddstream = (e) => {
    let screens = document.querySelector("#screens");
    let wrap = HTMLHelper.createVideo(peer.uuid);
    screens.appendChild(wrap);
    let videoWrap = document.getElementById(peer.uuid);
    let video = videoWrap.querySelector("video");
    console.log(video);
    video.srcObject = e.stream;
    video.onloadedmetadata = function () {
      video.play();
    };
  };

  function errorHandler(err) {
    console.log(err);
  }
  pc.addStream(localStream);
  if (initiator) {
    pc.createOffer()
      .then((offer) => {
        pc.setLocalDescription(offer).then(() => {
          send("video-offer", peer.uuid, offer);
        });
      })
      .catch(errorHandler);
  }
  return {
    handleNewCanditate: (data) => {
      pc.addIceCandidate(new RTCIceCandidate(data));
    },
    handleAnswer: (data) => {
      console.log("Handle answer");
      pc.setRemoteDescription(new RTCSessionDescription(data));
    },
    handleOffer: (data) => {
      console.log("Handle offer");
      pc.setRemoteDescription(new RTCSessionDescription(data)).then(() => {
        pc.createAnswer().then((answer) => {
          pc.setLocalDescription(answer).then(() => {
            send("video-answer", peer.uuid, answer);
          });
        });
      });
    },
    status: () => pc.connectionState,
  };
}

export default WebRTC;
