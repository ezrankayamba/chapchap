import { WS_URL } from "../conf";
import DataType from "./DataType";
const WsHandler = (onMessage, onConnect) => {
  let url = WS_URL;
  const connection = new WebSocket(url);
  connection.onopen = onConnect;
  connection.onerror = (error) => console.error("WebSocket error: " + error);
  connection.onmessage = (e) => {
    let parse1 = JSON.parse(e.data);
    onMessage(DataType.isString(parse1) ? JSON.parse(parse1) : parse1);
  };

  return {
    send: (data) => {
      connection.send(JSON.stringify(data));
    },
  };
};

export default WsHandler;
