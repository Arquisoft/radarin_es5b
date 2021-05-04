import { LoggedIn } from "@solid/react";
import React from "react";
import Mapa from "./Mapa";


import AdminLocations from "./AdminLocations";
import api from "../api/userDataManager";
import { BrowserRouter as Router, Route, Link } from "react-router-dom";
import ListAmigos from "./ListAmigos";

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
