import React from "react";
import Icon from "../_helpers/Icon";
import { connect } from "react-redux";
import { updateCart } from "../redux/shop/actions";
import { APP_NAME } from "../conf";

@connect(
  (state) => {
    return { cart: state.shop.cart };
  },
  { updateCart: updateCart }
)
class NavBar extends React.Component {
  render() {
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
              {APP_NAME}
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
        </div>
      </div>
    );
  }
}

export default NavBar;
