import WebRTC from "./WebRTC";
import Numbers from "../../_helpers/Numbers";

class RTCSession {
  constructor(localUuid, localStream) {
    this.peers = [];
    this.sig = null;
    this.localUuid = localUuid;
    this.localStream = localStream;
  }

  updatePeer(updated) {
    let peer = this.peers.find((p) => p.uuid === updated.uuid);
    if (!peer) {
      this.peers.push(updated);
    } else {
      this.peers = this.peers.map((p) =>
        p.uuid === peer.uuid ? updated : peer
      );
    }
  }

  startRTC(peer, initiator = false) {
    let rtc = WebRTC(this.localStream, this.sig.send, peer, initiator);
    peer.pc = rtc;
    this.updatePeer(peer);
  }
  handleNegotiate(uuid, { flag }) {
    let peer = this.peers.find((p) => p.uuid === uuid);
    if (!peer) {
      peer = { uuid: uuid, flag: Numbers.random() };
      this.updatePeer(peer);
    }
    if (peer.flag !== flag) {
      console.log("Negotiation complete: ", peer);
      peer.status = 1;
      this.startRTC(peer, true);
    } else {
      console.log("Continue negotioation: ", peer);
      let newFlag = Numbers.random();
      peer.flag = newFlag;
      this.updatePeer(peer);
      this.sig.send("negotiate", peer.uuid, { flag: newFlag });
    }
  }

  handleVideoOffer(uuid, data) {
    let peer = this.peers.find((p) => p.uuid === uuid);
    console.log(uuid, data);
    if (!peer) {
      peer = { uuid: uuid, flag: Numbers.random() };
      this.startRTC(peer, false);
    }
    peer.pc.handleOffer(data);
  }
  handleVideoAnswer(uuid, data) {
    let peer = this.peers.find((p) => p.uuid === uuid);
    if (peer && peer.pc && data) {
      peer.pc.handleAnswer(data);
    }
  }
  handleNewIceCandicate(uuid, data) {
    let peer = this.peers.find((p) => p.uuid === uuid);
    if (peer && peer.pc && data) {
      peer.pc.handleNewCanditate(data);
    }
  }
}

export default RTCSession;
