import React, { Component } from "react";
import { Route, Switch, Redirect } from "react-router-dom";
import getMenus from "./menus";
import { connect } from "react-redux";
import { getPrivileges } from "../../_services/AuthService";
import ChatRooms from "../../pages/chatroom/ChatRooms";
import MainPage from "../../pages/MainPage";

@connect((state) => {
  return {
    loggedIn: state.auth.loggedIn,
    user: state.auth.user,
  };
})
class Pages extends Component {
  render() {
    const { loggedIn, user } = this.props;
    let privileges = getPrivileges(user);
    let menus = getMenus(this.props.loggedIn, privileges);
    return (
      <Switch>
        <Route exact path="/home">
          <MainPage />
        </Route>
        <Route path="/chatrooms">
          <ChatRooms />
        </Route>
        <Redirect to="/home" />
      </Switch>
    );
  }
}

export default Pages;
