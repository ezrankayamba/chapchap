import { SHOP_UPDATE_CART, SHOP_CLEAR_CART } from "./actions";
import { getInitialData } from "../../_helpers/StoreUtils";

let shop = getInitialData("shop");
if (!shop) {
  shop = { cart: [] };
}
let initialState = shop;

let shopReducer = (state = initialState, { type, payload }) => {
  const updateExisting = (cart, payload) => {
    return cart.map((item) =>
      item.product.id === payload.product.id ? { ...payload } : item
    );
  };

  const handleUpdate = (payload) => {
    let cart = Array.isArray(state.cart) ? state.cart : [];
    let old = cart.find((item) => item.product.id === payload.product.id);
    if (payload) {
      if (payload.quantity) {
        if (old) {
          cart = updateExisting(cart, payload);
        } else {
          cart.push(payload);
        }
      } else {
        cart = old
          ? cart.filter((item) => item.product.id !== old.product.id)
          : cart;
      }
    }

    return cart;
  };

  switch (type) {
    case SHOP_UPDATE_CART:
      let newCart = handleUpdate(payload);
      console.log("New Cart", newCart);
      return {
        ...state,
        cart: [...newCart],
      };
    case SHOP_CLEAR_CART:
      return {
        ...state,
        cart: [],
      };
    default:
      return initialState;
  }
};

export default shopReducer;
