import React from 'react';
import {
  BrowserRouter as Router,
  Switch,
  Route,
} from "react-router-dom";

import Login from './Components/Authentication/Login'
import Register from './Components/Authentication/Register'
import Home from './Components/Rooms/Home'
import Room from './Components/Rooms/Room'


function App() {
  return (
    <Router>
      <div>
        

        {/* A <Switch> looks through its children <Route>s and
            renders the first one that matches the current URL. */}
        <Switch>
          <Route path="/register">
            <Register />
          </Route>
          <Route path="/home">
            <Home />
          </Route>
          <Route path="/room" render={() => <Room isOwner={true}/>}/>
          <Route path="/visitroom" render={() => <Room isOwner={false}/>}/>
          <Route path="/">
            <Login />
          </Route>
        </Switch>
      </div>
    </Router>
  );
}

export default App;
