import React from "react";
import Icon from "../_helpers/Icon";
import { connect } from "react-redux";
import { updateCart } from "../redux/shop/actions";

@connect(
  (state) => {
    return { cart: state.shop.cart };
  },
  { updateCart: updateCart }
)
class NavBar extends React.Component {
  render() {
    console.log(this.props);
    const { cart } = this.props;
    const cartSize = cart
      ? cart.reduce((prev, current) => prev + current.quantity, 0)
      : 0;
    // const cartSize = 10;
    return (
      <div className="navbar">
        <button className="menu">
          <Icon name="menu" />
        </button>
        <div className="title">
          <h3>
            <a href="/" className="btn btn-link-secondary btn-sm ">
              OnlineShop
            </a>
          </h3>
        </div>
        <div className="buttons">
          <button>
            <Icon name="search" />
          </button>
          <button>
            <Icon name="person_outline" />
          </button>
          <a className="btn btn-sm btn-link-secondary cart-button" href="/cart">
            <Icon name="shopping_cart" />
            <i className="cart-count">{cartSize}</i>
          </a>
        </div>
      </div>
    );
  }
}

export default NavBar;
