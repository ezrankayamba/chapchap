import React, { Component } from "react";
import { connect } from "react-redux";
import { updateCart, clearCart } from "../../redux/shop/actions";
import Numbers from "../../_helpers/Numbers";
import CRUD from "../../_services/CRUD";
import { Redirect } from "react-router-dom";
import CheckoutSuccess from "./CheckoutSuccess";
@connect(
  (state) => {
    return { cart: state.shop.cart };
  },
  { updateCart: updateCart, clearCart: clearCart }
)
class CheckoutPage extends Component {
  state = { address: {}, done: false, message: "" };
  constructor(props) {
    super(props);
    this.handleChange = this.handleChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }
  handleChange(e) {
    const { address } = this.state;
    const { name, value } = e.target;
    console.log(name, value);
    this.setState({ address: { ...address, [name]: value } });
  }
  onSubmit(e) {
    e.preventDefault();
    const { cart } = this.props;
    const { address } = this.state;
    console.log(address);
    CRUD.create(
      "/shop/checkout",
      null,
      { cart, address },
      {
        onSuccess: (res) => this.setState({ done: true, message: res.message }),
        onFail: (err) => console.log(err),
      }
    );
  }
  render() {
    const { cart, clearCart } = this.props;
    const { done, message } = this.state;
    const total = cart
      ? cart.reduce(
          (prev, curr) => prev + curr.product.price * curr.quantity,
          0
        )
      : 0;

    return !done ? (
      <div className="checkout-page">
        <h5>Checkout</h5>
        <div className="checkout-content">
          <div className="checkout-items">
            <h6>Items</h6>
            {cart.map((item) => (
              <div className="checkout-item">
                <p>
                  {item.product.name} - {item.quantity} x{" "}
                  {Numbers.fmt(item.product.price)}
                </p>
                <p>TZS {Numbers.fmt(item.quantity * item.product.price)}</p>
              </div>
            ))}
            <div className="checkout-item total">
              <p>Total</p>
              <p>TZS {Numbers.fmt(total)}</p>
            </div>
          </div>
          <div className="delivery-address">
            <h6>Delivery Address</h6>
            <form onSubmit={this.onSubmit}>
              <label htmlFor="name">
                Name{" "}
                <input
                  type="text"
                  name="name"
                  id="name"
                  className="form-control"
                  onChange={this.handleChange}
                  required={true}
                />
              </label>
              <label htmlFor="phone">
                Phone{" "}
                <input
                  type="tel"
                  name="phone"
                  id="phone"
                  className="form-control"
                  onChange={this.handleChange}
                  required={true}
                />
              </label>
              <label htmlFor="email">
                Email{" "}
                <input
                  type="email"
                  name="email"
                  id="email"
                  className="form-control"
                  onChange={this.handleChange}
                  required={true}
                />
              </label>
              <div className="buttons">
                <button type="submit" className="btn">
                  Place Order
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    ) : (
      <CheckoutSuccess message={message} clearCart={clearCart} />
    );
  }
}

export default CheckoutPage;
