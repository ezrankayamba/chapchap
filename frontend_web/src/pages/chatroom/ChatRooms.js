import React from "react";
import ChatRoom from "../../components/chat/ChatRoom";
import { Route, Link, useRouteMatch, Switch } from "react-router-dom";

function ChatRooms() {
  let { path, url } = useRouteMatch();
  return (
    <div>
      <Switch>
        <Route exact path={path}>
          <h3>Please select a topic.</h3>
        </Route>
        <Route path={`${path}/:id`}>
          <ChatRoom />
        </Route>
      </Switch>
    </div>
  );
}

export default ChatRooms;
