import { LoggedIn, Value, List } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";

import restapi from "../api/api";
import api from "../api/userDataManager";

//export default  function Principal() {

class Principal extends React.Component {
  constructor() {
    super();
    api.connect();

    this.state = {
      amigos: { cercanos: [], lejanos: [] },
    };

    setTimeout(this.listarAmigos(), 2000);
  }

  async listarAmigos() {
    var listAmigos = await (await restapi.getFriendsCoords()).json();
    var result = { cercanos: [], lejanos: [] };

    for (var f of listAmigos) {
      if (f.inAdviseDist) result.cercanos.push(f);
      else result.lejanos.push(f);
    }

    result.cercanos[0] = { id: "1" };
    result.cercanos[1] = { id: "2" };

    this.setState({
      amigos: result,
    });
  }

  render() {
    return (
      <LoggedIn>
        <Mapa />
        <nav class="Menu">
          <h5>
            Welcome back, <Value src="user.vcard_fn" />.
          </h5>

          <p>Amigos cercanos:</p>
          <ul>
            {this.state.amigos.cercanos.map((amigo) => {
              return <li> {amigo.id} </li>;
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
    );
  }
}

export default Principal;