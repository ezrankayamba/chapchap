import React from "react";
import MainPage from "../../pages/MainPage";
import Icon from "../../_helpers/Icon";
import MatIcon from "../MatIcon";
import CartPage from "../../pages/shop/CartPage";
import CheckoutPage from "../../pages/shop/CheckoutPage";

const getMenus = (loggedIn, privileges) => {
  let pFilter = (m) => {
    return (
      m.privilege === "Anonymous" ||
      (loggedIn && privileges.includes(m.privilege))
    );
  };
  let id = 0;
  const getId = () => id++;
  let menus = loggedIn
    ? [
        {
          id: getId(),
          path: "/home",
          name: "Home",
          component: MainPage,
          Icon: () => <MatIcon name="home" />,
          privilege: "Anonymous",
        },
        {
          id: getId(),
          path: "/home",
          name: "Home",
          component: MainPage,
          Icon: () => <MatIcon name="shopping_cart" />,
          privilege: "Anonymous",
        },
      ]
    : [
        {
          id: getId(),
          path: "/home",
          name: "Home",
          component: MainPage,
          Icon: () => <MatIcon name="home" />,
          privilege: "Anonymous",
        },
        {
          id: getId(),
          path: "/cart",
          name: "Cart",
          component: CartPage,
          Icon: () => <MatIcon name="shopping_cart" />,
          privilege: "Anonymous",
        },
        {
          id: getId(),
          path: "/checkout",
          name: "Checkout",
          component: CheckoutPage,
          Icon: () => <MatIcon name="payment" />,
          privilege: "Anonymous",
        },
      ];
  return menus.filter(pFilter);
};
export default getMenus;
