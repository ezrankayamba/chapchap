const configuration = {
  iceServers: [{ urls: "stun:stun.l.google.com:19302" }],
};

function WebRTC(localStream, send, peer, initiator, data) {
  console.log("Me as initiator: ", initiator, data);
  let isNegotiating = false;
  const pc = new RTCPeerConnection(configuration);
  pc.onnegotiationneeded = (e) => {
    if (isNegotiating) {
      console.log("SKIP nested negotiations");
      return;
    }
    isNegotiating = true;
    if (initiator) {
      pc.createOffer().then((offer) => {
        pc.setLocalDescription(offer).then(() => {
          send("video-offer", peer.uuid, offer);
        });
      });
    } else {
      try {
        pc.setRemoteDescription(new RTCSessionDescription(data)).then(() => {
          pc.createAnswer().then((answer) => {
            pc.setLocalDescription(answer).then(() => {
              send("video-answer", peer.uuid, answer);
            });
          });
        });
      } catch (error) {
        console.error(error);
      }
    }
  };
  pc.addStream(localStream);
  pc.onicecandidate = (e) => {
    if (e.candidate) {
      send("new-ice-candidate", peer.uuid, e.candidate);
    }
  };

  pc.onaddstream = (e) => {
    console.log("Media added on remote peer:", e.stream);
    let videoWrap = document.getElementById(peer.uuid);
    let video = videoWrap.querySelector("video");
    console.log(video);
    video.srcObject = e.stream;
    video.play();
  };

  return {
    handleNewCanditate: (data) => {
      pc.addIceCandidate(new RTCIceCandidate(data));
    },
    handleAnswer: (data) => {
      pc.setRemoteDescription(new RTCSessionDescription(data));
    },
  };
}

export default WebRTC;
