export const SHOP_UPDATE_CART = "SHOP_UPDATE_CART";
export const SHOP_CLEAR_CART = "SHOP_CLEAR_CART";

export const updateCart = (product, quantity) => {
  return {
    type: SHOP_UPDATE_CART,
    payload: {
      product,
      quantity,
    },
  };
};
export const clearCart = () => {
  return {
    type: SHOP_CLEAR_CART,
  };
};
