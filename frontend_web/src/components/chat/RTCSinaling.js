import WsHandler from "../../_helpers/WsHandler";
import Numbers from "../../_helpers/Numbers";

class RTCSinaling {
  constructor(localUuid) {
    this.localUuid = localUuid;
    this.send = this.send.bind(this);
    this.received = this.received.bind(this);
    this.connect = this.connect.bind(this);
    this.init = this.init.bind(this);
  }
  init(handleMessage) {
    this.handleMessage = handleMessage;
    this.ws = WsHandler(this.received, this.connect);
  }
  connect() {
    this.send("negotiate", "all", { flag: Numbers.random() });
  }
  received(sig) {
    if (
      (sig.dest === "all" || sig.dest === this.localUuid) &&
      sig.uuid !== this.localUuid
    ) {
      console.log(sig);
      this.handleMessage(sig);
    }
  }
  send(type, dest, data) {
    this.ws.send({
      uuid: this.localUuid,
      dest,
      data,
      type,
    });
  }
}

export default RTCSinaling;
