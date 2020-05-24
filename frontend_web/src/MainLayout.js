import React from "react";
import NavBar from "./components/NavBar";
import MainPage from "./pages/MainPage";
import Pages from "./components/menus/Pages";
import SideMenu from "./components/menus/SideMenu";

const MainLayout = ({ user, shop }) => {
  return (
    <div className="main-layout">
      <NavBar />
      <section className="main-content-wraper">
        <Pages />
      </section>
    </div>
  );
};

export default MainLayout;
