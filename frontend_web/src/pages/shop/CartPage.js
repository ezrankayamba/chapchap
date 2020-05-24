import React, { Component } from "react";
import { connect } from "react-redux";
import { updateCart } from "../../redux/shop/actions";
import CartItem from "../../components/cart/CartItem";
import Numbers from "../../_helpers/Numbers";
@connect(
  (state) => {
    return { cart: state.shop.cart };
  },
  { updateCart: updateCart }
)
class CartPage extends Component {
  render() {
    const { cart, updateCart } = this.props;
    const total = cart
      ? cart.reduce(
          (prev, curr) => prev + curr.product.price * curr.quantity,
          0
        )
      : 0;
    return cart && cart.length ? (
      <div className="cart-container">
        <h6 className="title">My Cart</h6>
        <div className="cart-items">
          {cart.map((item) => (
            <CartItem key={item.product.id} {...item} updateCart={updateCart} />
          ))}
        </div>
        <div className="cart-footer">
          <p>Total</p>
          <p>TZS {Numbers.fmt(total)}</p>
          <a className="btn" href="/checkout">
            Checkout
          </a>
        </div>
      </div>
    ) : (
      <div>Cart is empty</div>
    );
  }
}

export default CartPage;
