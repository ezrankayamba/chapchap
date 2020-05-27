import React, { useState } from "react";
import CRUD from "../_services/CRUD";
import { Redirect } from "react-router-dom";

function MainPage() {
  const [newId, setNewId] = useState(null);
  const [start, setStart] = useState(null);
  const createCall = () => {
    let pin = document.getElementById("pin").value;
    if (pin.length === 4) {
      CRUD.create(
        "/ws/callgroup",
        null,
        { pin: pin },
        {
          onSuccess: (res) => {
            console.log(res);
            document.getElementById("pin").value = "";
            setNewId(res.id);
          },
          onFail: (res) => console.error(res),
        }
      );
    } else {
      console.error("Not valid PIN: ", pin);
    }
  };
  const startCall = () => {
    let pin = document.getElementById("callPIN").value;
    let callId = document.getElementById("callId").value;
    if (pin.length === 4 && callId) {
      CRUD.create(
        "/ws/validate",
        null,
        { pin: pin, id: callId },
        {
          onSuccess: (res) => {
            console.log(res);
            document.getElementById("callPIN").value = "";
            document.getElementById("callId").value = "";
            setStart(callId);
          },
          onFail: (res) => console.error(res),
        }
      );
    } else {
      console.error("Not valid PIN: ", pin);
    }
  };
  let shareUrl = `http://localhost:8080/chatrooms/${newId}`;
  return (
    <div className="tabs main-page">
      <div className="call-setup mt-2">
        <div className="join-call">
          <h5>Start call</h5>
          <label htmlFor="callId" className="label-input-button">
            Call ID
            <input type="number" id="callId" name="callId" />
          </label>
          <label htmlFor="callPIN" className="label-input-button">
            PIN
            <input type="number" id="callPIN" name="callPIN" />
            <button onClick={startCall}>Start</button>
          </label>
        </div>
        <span className="separator">OR</span>
        <div className="join-call">
          <h5>Create call</h5>
          <label htmlFor="pin" className="label-input-button">
            PIN
            <input type="number" id="pin" name="pin" placeholder="4 digits" />
            <button onClick={createCall}>Create</button>
          </label>
          {newId && <p>{shareUrl}</p>}
        </div>
      </div>
      {start && (
        <Redirect
          to={{ pathname: `/chatrooms/${start}`, state: { orginizer: true } }}
        />
      )}
    </div>
  );
}

export default MainPage;
