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
  handleNegotiate(uuid, { flag, name, ...rest }) {
    console.log("Negotiating: ", uuid, flag, name, rest);
    let peer = this.peers.find((p) => p.uuid === uuid);
    if (!peer) {
      let newFlag = Numbers.random();
      peer = { uuid: uuid, flag: newFlag, name: name };
      this.updatePeer(peer);
      this.sig.send("negotiate", peer.uuid, {
        flag: newFlag,
        name: this.sig.name,
      });
    } else {
      let type = "negotiate";
      let myFlag = peer.flag || Numbers.random();
      if (peer.flag !== flag && name) {
        console.log("Negotiation complete: ", peer);
        peer.status = 1;
        type = "negotiate_ack";
      } else {
        console.log("Continue negotioation: ", peer);
        myFlag = Numbers.random();
      }
      peer.name = name || peer.name;
      peer.flag = myFlag;
      this.updatePeer(peer);
      this.sig.send(type, peer.uuid, {
        flag: myFlag,
        name: this.sig.name,
      });
    }
  }
  handleNegotiateAck(uuid, { flag, name, ...rest }) {
    let peer = this.peers.find((p) => p.uuid === uuid);
    if (!peer) {
      let newFlag = flag === 1 ? 2 : 1;
      peer = { uuid: uuid, flag: newFlag, name: name };
      this.updatePeer(peer);
    }
    console.log("Negotiation complete Ack: ", peer);
    peer.status = 1;
    peer.name = name || peer.name;
    this.startRTC(peer, true);
  }

  handleVideoOffer(uuid, data) {
    let peer = this.peers.find((p) => p.uuid === uuid);
    console.log(uuid, data);
    if (!peer || !peer.pc) {
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
