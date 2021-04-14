import React from "react";
import "./App.css";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";
import Mapa from "./components/Mapa";
import Prueba from "./components/Prueba";
import { AuthButton,Like, LoggedIn, Value,List,Follow} from "@solid/react";
import UserList from "./components/UserList";

class App extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  refreshUsers(users) {
    this.setState({ users: users });
  }

  render(){
    /*return(
    
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
     
    )*/
      /*
    return (<SessionProvider sessionId="example"><div className="App">  
      <div className="App-content"><BotonLogIn /></div>      </div>
      
      </SessionProvider> );*/

      return <div>
        <header class="App-header">
          <img src={logo} className="App-logo" alt="logo" />
          <h1>Radarin_ES5B</h1>
          <AuthButton popup="https://solid.github.io/solid-auth-client/dist/popup.html" login="Entrar" logout="Salir"/>
        </header>

        <div class="layout">
          <LoggedIn>
            <Mapa/>
            <nav class="Menu">
              <h5>Welcome back, <Value src="user.name"/>.</h5>
              <p>Amigos:</p>
              <List src="user.friends"/>
            </nav>
          </LoggedIn>
        </div>

  </div>
  }
}

export default App;