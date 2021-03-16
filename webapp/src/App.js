import React from "react";
import "./App.css";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";
import Mapa from "./components/Mapa";

class App extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  refreshUsers(users) {
    this.setState({ users: users });
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Radarin</h1>
        </header>

        <div className="App-content">
          <div class="opciones">
            
                <SessionProvider sessionId="log-in-example">
                  <LoginButton
                    oidcIssuer="https://inrupt.net"
                    onError={function noRefCheck() {}}
                    redirectUrl="http://localhost:3000/"
                  ></LoginButton>
                </SessionProvider>
              
          </div>

          <div class="mapa">
            <Mapa />
          </div>
        </div>
      </div>
    );
  }
}

export default App;
