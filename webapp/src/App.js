import React from 'react';
import './App.css';
import logo from './logo.svg';
import EmailForm from "./components/EmailForm";
import 'bootstrap/dist/css/bootstrap.min.css';
import BotonLogIn from './components/BotonLogIn';

class App extends React.Component{
  constructor(){
    super()
    this.state = {users:[]}
  }

  refreshUsers(users){
    this.setState({users:users})
  }

  render(){
    return(
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
    )
  }
}

export default App;