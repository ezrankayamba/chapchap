import React from "react";
import { connect } from "react-redux";
import { updateCart } from "../redux/shop/actions";
import Numbers from "../_helpers/Numbers";
import MatIcon from "./MatIcon";
@connect((state) => {}, { updateCart: updateCart })
class ShowCaseCard extends React.Component {
  render() {
    const { category, items, updateCart } = this.props;
    return (
      <div className="showcase-card">
        <div className="category">
          <button>{category}</button>
        </div>
        <div className="images">
          {items.map((i) => (
            <div className="image-wrap">
              <img src={i.image.src} />
              <p>
                {i.name} - TZS {Numbers.fmt(i.price)}
              </p>
              <div className="buttons">
                <button
                  className="btn btn-sm btn-outline-secondary"
                  onClick={() => updateCart(i, 1)}
                >
                  Add to Cart
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}

export default ShowCaseCard;
