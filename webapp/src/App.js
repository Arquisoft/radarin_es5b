import React from "react";
import "./App.css";
import logo from "./logo.svg";
import menuLogo from "./menuLogo.svg";
import { AuthButton, LoggedIn, LoggedOut} from "@solid/react";

import Principal from "./components/Principal";
import Logout from "./components/Logout";
import elementsSize from "./elementsSize";

class App extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }
  
  componentDidMount() {
    elementsSize.updateSize()
  }

  refreshUsers(users) {
    this.setState({ users: users });
  }

  render(){

      return <div>
        <header className="App-header">
          <img id="menuBt" onClick={elementsSize.toogleMenu} src={menuLogo} alt="menu"></img>
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Radarin</h1>
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