import { LoggedIn } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";

import AdminLocations from "./AdminLocations";
import api from "../api/userDataManager";
import { HashRouter as Router, Route, Link } from "react-router-dom";
import ListAmigos from "./ListAmigos";

class Principal extends React.Component {
  constructor() {
    super();
    this.state = {
      connected: false,
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
    var response = await restapi.getNotifications();

    if (response.status !== 200) {
      setTimeout(this.notificaciones.bind(this), 3000);
      return;
    }

    var notificaciones = await response.json();
    console.log(notificaciones);
    for (var n of notificaciones) {
      var distancia = n.dist.toString().slice(0, 4);
      new Notification("El usuario " + n.webId + " esta a " + distancia + " kilómetros.");
    }
    
    setTimeout(this.notificaciones.bind(this), 20000);
  }

  render() {
    return (
      <Router>
        <LoggedIn>
          <Route path="/" exact component={Mapa}></Route>
          <Route path="/admin" exact component={AdminLocations}></Route>
          <nav className="navbar navbar-expand-lg navbar-light bg-light">
            <div className="container-fluid">
              <Link className="navbar-brand" to="/admin">
                Administrar Ubicaciones
              </Link>
              <Link className="navbar-brand" to="/">
                Mapa
              </Link>
            </div>
          </nav>
          <ListAmigos />
        </LoggedIn>
      </Router>
    );
  }
}
export default Principal;
