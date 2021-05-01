import React from "react";
import "./App.css";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { AuthButton, LoggedIn, LoggedOut} from "@solid/react";

import Principal from "./components/Principal";


import Logout from "./components/Logout";
class App extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  refreshUsers(users) {
    this.setState({ users: users });
  }

  render(){

      return <div>
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Radarin_ES5B</h1>
          <AuthButton popup="https://solid.github.io/solid-auth-client/dist/popup.html" login="Entrar" logout="Salir"/>
         
        </header>
       
        <LoggedOut>
          <Logout></Logout>
        </LoggedOut>
        <div className="layout">
          <LoggedIn>
          <Principal></Principal>
          </LoggedIn>
        </div>

  </div>
  }
}

export default App;