import React from "react";
import "./App.css";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";
import Mapa from "./components/Mapa";
import Prueba from "./components/Prueba";
import { AuthButton, Like, LoggedIn, Value, List, Follow } from "@solid/react";
import UserList from "./components/UserList";

import 'react-notifications/lib/notifications.css';
import {
  NotificationContainer,
  NotificationManager,
} from "react-notifications";

class App extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  refreshUsers(users) {
    this.setState({ users: users });
  }

  notificacion = (type) => {
    return () => {
      switch (type) {
        case "info":
          NotificationManager.info("Info message");
          break;
        case "success":
          NotificationManager.success("Success message", "Title here");
          break;
        case "warning":
          NotificationManager.warning(
            "Warning message",
            "Close after 3000ms",
            3000
          );
          break;
        case "error":
          NotificationManager.error("Error message", "Click me!", 5000, () => {
            alert("callback");
          });
          break;
      }
    };
  };

  render() {
    return (
      <div>
        <header class="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Radarin_ES5B</h1>
          <AuthButton
            onClick={() => {
              console.log("xd");
            }}
            popup="https://solid.github.io/solid-auth-client/dist/popup.html"
            login="Iniciar sesion"
            logout="Cerrar sesion"
          />
        </header>

        <div class="layout">
          <LoggedIn>
            <Mapa />
            <nav class="Menu">
              <button
                className="btn btn-info"
                onClick={this.notificacion("info")}
              >
                Info
              </button>

              <h5>
                Welcome back, <Value src="user.name" />.
              </h5>
              <p>Amigos:</p>
              <List src="user.friends" />
            </nav>
            <NotificationContainer/>
          </LoggedIn>
        </div>

        
      </div>
    );
  }
}

export default App;
