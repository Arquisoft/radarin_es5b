<<<<<<< HEAD
import React from 'react';
import './App.css';
import logo from './logo.svg';
import EmailForm from "./components/EmailForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import BotonLogIn from './components/BotonLogIn';
import { SessionProvider} from "@inrupt/solid-ui-react";


=======
import React from "react";
import "./App.css";
import logo from "./logo.svg";
import "bootstrap/dist/css/bootstrap.min.css";
import { SessionProvider, LoginButton } from "@inrupt/solid-ui-react";
import Mapa from "./components/Mapa";
>>>>>>> nacho

class App extends React.Component {
  constructor() {
    super();
    this.state = { users: [] };
  }

  refreshUsers(users) {
    this.setState({ users: users });
  }

<<<<<<< HEAD
  render(){
    /*return(
      

      
    
=======
  render() {
    return (
>>>>>>> nacho
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
<<<<<<< HEAD
     
    )*/

    return (<SessionProvider sessionId="example"><div className="App">    <div className="App-content"><BotonLogIn /></div>      </div></SessionProvider> );
=======
    );
>>>>>>> nacho
  }
}

export default App;
