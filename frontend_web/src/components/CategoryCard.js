import React from "react";
import { connect } from "react-redux";
import { updateCart } from "../redux/shop/actions";
@connect(() => {}, { updateCart: updateCart })
class CategoryCard extends React.Component {
  state = { show: false };
  render() {
    const { category, items, setCategory } = this.props;
    return (
      <div className="category-card">
        <div className="image-wrap">
          <img src={items[0].image.src} />
          <div className="buttons">
            <button
              className="btn btn-sm btn-outline-secondary"
              onClick={() => setCategory(category)}
            >
              {category.name}
            </button>
          </div>
        </div>
      </div>
    );
  }
}

export default CategoryCard;
