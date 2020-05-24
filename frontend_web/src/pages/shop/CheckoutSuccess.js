import React, { useState } from "react";
import MatIcon from "../../components/MatIcon";
import { Redirect } from "react-router-dom";

function CheckoutSuccess({ message, clearCart }) {
  const [go, setGo] = useState(false);
  const goHome = () => {
    clearCart();
    setGo(true);
  };
  return !go ? (
    <div className="checkout-page success">
      <h5>
        Checkout Success <MatIcon name="check_circle_outline" />
      </h5>
      <p>{message}</p>
      <button onClick={goHome} className="btn btn-outline-primary btn-sm">
        Continue shopping
      </button>
    </div>
  ) : (
    <Redirect to="/home" />
  );
}

export default CheckoutSuccess;
