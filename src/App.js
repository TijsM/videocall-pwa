import React from "react";
import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { AnimatePresence, motion } from "framer-motion";

import Login from "./Components/Authentication/Login";
import Register from "./Components/Authentication/Register";
import Home from "./Components/Rooms/Home";
import Room from "./Components/Rooms/Room";
import SendNotificationToAll from "./Components/Admin/SendNotificationToAll";

function App() {
  return (
    <Router>
      <div>
        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <AnimatePresence>
          <Switch>
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
    </Router>
  );
}

export default App;
