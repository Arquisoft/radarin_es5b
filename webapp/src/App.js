import React from 'react';
import './App.css';
import logo from './logo.svg';
import EmailForm from "./components/EmailForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import BotonLogIn from './components/BotonLogIn';
import { SessionProvider} from "@inrupt/solid-ui-react";



class App extends React.Component{
  constructor(){
    super()
    this.state = {users:[]}
  }

  refreshUsers(users){
    this.setState({users:users})
  }

  render(){
    /*return(
      

      
    
      <div className="App">

        <header className="App-header">
          <img src={logo} className="App-logo" alt="logo"/>
          <h1>Radarin</h1>
        </header>

        <div className="App-content">
          <EmailForm refreshUsers={this.refreshUsers.bind(this)}/>
          <BotonLogIn />
        </div>

      </div>
     
    )*/

    return (<SessionProvider sessionId="example"><div className="App">    <div className="App-content"><BotonLogIn /></div>      </div></SessionProvider> );
  }
}

export default App;