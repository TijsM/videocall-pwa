import React, { useState } from "react";
import { Link } from "react-router-dom";

import './Home.scss'


function Home() {
  const [newListName, setNewListName] = useState();


  const confirm = (event) => {
    event.preventDefault();
    console.log('creating', newListName)
  }

  const roomJsx = (
    <div className = 'roomContainer'>
      <div>roomname</div>
      <div><Link to="/room">Go to room</Link></div>
    </div>
  )

  return (
    <div>
      <h1>Home page</h1>
      <form>
        <input
          onChange={(val) => setNewListName(val.target.value)}
          placeholder="email"
        ></input>
        <button onClick={(e) => confirm(e)}> confirm</button>
      </form>

      <section id='roomsection'>
        <h2>your rooms:</h2>
        {roomJsx}
      </section>
    </div>
  );
}

export default Home;
