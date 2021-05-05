import { LoggedIn } from "@solid/react";
import React from "react";
import Mapa from "./Mapa";

import AdminLocations from "./AdminLocations";
import api from "../api/userDataManager";
import restapi from "../api/api"
import { HashRouter as Router, Route, Link } from "react-router-dom";
import ListAmigos from "./ListAmigos";

class Principal extends React.Component {
  constructor() {
    super();
    this.state = {
      amigos: { cercanos: [], lejanos: [] }
    };
  }

  async componentDidMount() {
    await api.connect();
    this.setState({ connected: true });

    if (!("Notification" in window)) {
      console.log("This browser does not support desktop notification");
    } else {
      Notification.requestPermission();
      this.notificaciones();
    }
  }

  async notificaciones() {
    if(api.isLogged()){
    var response = await restapi.getNotifications();

    if (response.status !== 200) {
      setTimeout(this.notificaciones.bind(this), 3000);
      return;
    }

    var notificaciones = await response.json();

    for (var n of notificaciones) {
      var distancia = api.quitDecimals(n.dist);
      new Notification("El usuario " + n.webId + " esta a " + distancia + " kilómetros.");
    }
    
    setTimeout(this.notificaciones.bind(this), 20000);
    }
   
  }

  render() {
    return (
      <Router>
        <LoggedIn>
          <ListAmigos />
          
          <Route path="/" exact component={Mapa}></Route>
          <Route path="/admin" exact component={AdminLocations}></Route>
          <nav id="bottomMenu">
            <Link to="/">
              <button type="button">
                Mapa
              </button>
            </Link>
            <Link to="/admin">
              <button type="button">
                Administrar ubicaciones
              </button>
            </Link>
          </nav>
        </LoggedIn>
      </Router>
    );
  }
}
export default Principal;
