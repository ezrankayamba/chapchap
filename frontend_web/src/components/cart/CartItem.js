import React, { useState } from "react";
import Numbers from "../../_helpers/Numbers";
import MatIcon from "../MatIcon";

const CartItem = ({ product, quantity, updateCart }) => {
  const [newQuantity, setNewQuantity] = useState(quantity);
  const handleChange = (evt) => {
    const { name, value } = evt.target;
    console.log(name, value);
    const quantity = parseInt(value);
    setNewQuantity(quantity);
    if (quantity >= 0) {
      updateCart(product, quantity);
    }
  };
  const handleDelete = () => {
    updateCart(product, 0);
  };
  const total = quantity * product.price;
  return (
    <div className="cart-item">
      <img src={product.image.src} />
      <p>
        {product.name} - TZS {Numbers.fmt(product.price)}
      </p>
      <div className="actions">
        <button className="btn btn-sm btn-link" onClick={handleDelete}>
          <MatIcon name="delete" extra="text-danger" />
        </button>
        <input
          onChange={handleChange}
          value={newQuantity}
          type="number"
          name="quantity"
          id="quantity"
        />
        <b>TZS {Numbers.fmt(total)}</b>
      </div>
    </div>
  );
};

export default CartItem;
