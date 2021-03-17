import React from "react";
import "./App.css";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";
import Mapa from "./components/Mapa";
import Prueba from "./components/Prueba";
import { AuthButton,Like, LoggedIn, Value,List,Follow} from "@solid/react";

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
        
        
        <AuthButton popup="https://solid.github.io/solid-auth-client/dist/popup.html"
      login="Entrar" logout="Salir"/>

      <LoggedIn>
        <Mapa/>
        <p>Welcome back, <Value src="user.name"/>.</p>
        <p>Amigos:</p>
        <List src="user.friends.firstName"/>
        <Like object="https://github.com/">GitHub</Like>
        <Follow object="https://ruben.verborgh.org/profile/#me">Ruben</Follow>
        <Prueba></Prueba>
      </LoggedIn>

  </div>
  }
}

export default App;
