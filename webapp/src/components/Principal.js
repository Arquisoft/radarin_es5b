import { LoggedIn, Value, List } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";

import restapi from "../api/api";
import AdminLocations from "./AdminLocations";
import api from "../api/userDataManager";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";

//export default  function Principal() {

class Principal extends React.Component {
  constructor() {
    super();
    this.state = {
      connected: false,
      amigos: { cercanos: [], lejanos: [] },
    };
  }

  async componentDidMount() {
    await api.connect();
    this.setState({ connected: true });
    this.listarAmigos();
  }

  async listarAmigos() {
    var result = { cercanos: [], lejanos: [] };
    var response = await restapi.getFriendsCoords()

    if(response.status !== 200) {
      setTimeout(this.listarAmigos.bind(this), 3000)
      return;
    }

    var listAmigos = await response.json();
    for (var f of listAmigos) {
      if (f.inAdviseDist) result.cercanos.push(f);
      else result.lejanos.push(f);
    }

    this.setState({
      amigos: result
    });
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
          <nav className="Menu">
            <h5>
              Welcome back, <Value src="user.vcard_fn" />.
            </h5>

            <p>Amigos cercanos:</p>
            <ul>
              {this.state.amigos.cercanos.map((amigo) => {
                return <li> {amigo.webId} </li>;
              })}
            </ul>

            <p>Amigos lejanos:</p>
            <ul>
              {this.state.amigos.lejanos.map((amigo) => {
                return <li> {amigo.webId} </li>;
              })}
            </ul>
          </nav>
        </LoggedIn>
      </Router>
    );
  }
}
export default Principal;
