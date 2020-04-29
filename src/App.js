import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import {useLocation} from "react-router-dom"
import { AnimatePresence } from "framer-motion";

import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";
import Home from "./Components/Rooms/Home";
import Room from "./Components/Rooms/Room";
import SendNotificationToAll from "./Components/Admin/SendNotificationToAll";

import './app.scss'
function App() {
  const location = useLocation()
  return (
      <div>
        <AnimatePresence exitBeforeEnter >
          <Switch location={location} key={location.pathname} >
            <Route path="/register">
              <Register />
            </Route>
            <Route path="/login">
              <Login />
            </Route>
            <Route path="/sendNotificationToAll">
              <SendNotificationToAll />
            </Route>
            <Route
              path="/room/:roomownername/:roomname"
              render={() => <Room isOwner={true} />}
            />
            <Route
              path="/visitroom/:roomownername/:roomname"
              render={() => <Room isOwner={false} />}
            />
            <Route path="/">
              <Home />
            </Route>
          </Switch>
        </AnimatePresence>
      </div>

  );
}

export default App;
