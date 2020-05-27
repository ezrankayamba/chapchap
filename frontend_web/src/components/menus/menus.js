import React from "react";
import MainPage from "../../pages/MainPage";
import Icon from "../../_helpers/Icon";
import MatIcon from "../MatIcon";
import CartPage from "../../pages/shop/CartPage";
import CheckoutPage from "../../pages/shop/CheckoutPage";
import ChatRoom from "../chat/ChatRoom";
import ChatRooms from "../../pages/chatroom/ChatRooms";

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
      ]
    : [
        {
          id: getId(),
          path: "/home",
          name: "Home",
          exact: true,
          component: MainPage,
          Icon: () => <MatIcon name="home" />,
          privilege: "Anonymous",
        },
        {
          id: getId(),
          path: "/chatrooms",
          name: "Chat Rooms",
          component: ChatRooms,
          exact: false,
          Icon: () => <MatIcon name="home" />,
          privilege: "Anonymous",
        },
      ];
  return menus.filter(pFilter);
};
export default getMenus;
