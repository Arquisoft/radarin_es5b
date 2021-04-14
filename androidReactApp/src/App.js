import React from "react";
import "./App.css";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";
import Mapa from "./components/Mapa";
import Prueba from "./components/Prueba";
import { AuthButton, Like, LoggedIn, Value, List, Follow } from "@solid/react";
import UserList from "./components/UserList";

class App extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
    this.showNotification = this.showNotification.bind(this);
  }

  refreshUsers(users) {
    this.setState({ users: users });
  }

  componentDidMount() {
    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      Notification.requestPermission();
    }
  }

  showNotification(txt) {
    new Notification(txt);
  }

  render() {
    return (
      <div>
        <header class="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Radarin_ES5B</h1>
          <AuthButton
            popup="https://solid.github.io/solid-auth-client/dist/popup.html"
            login="Iniciar sesion"
            logout="Cerrar sesion"
          />
        </header>

        <div class="layout">
          <LoggedIn>
            <div>
              <button onClick={() => new Notification("Not")}>
                Click to show notification
              </button>
            </div>

            <Mapa />
            <nav class="Menu">
              <h5>
                Welcome back, <Value src="user.name" />.
              </h5>
              <p>Amigos:</p>
              <List src="user.friends" />
            </nav>
          </LoggedIn>
        </div>
      </div>
    );
  }
}

export default App;