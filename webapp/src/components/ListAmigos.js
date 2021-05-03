import { Value } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";

import restapi from "../api/api";
import api from "../api/userDataManager";

class ListAmigos extends React.Component {
  constructor() {
    super();
    this.state = {
      amigos: { cercanos: [], lejanos: [] },
      amigosNoLogeados: []
    };
  }

  async componentDidMount() {
    await api.connect();
    this.listarAmigos();
  }

  async listarAmigos() {
    var result = { cercanos: [], lejanos: [] };
    var response = await restapi.getFriendsCoords();

    if (response.status !== 200) {
      setTimeout(this.listarAmigos.bind(this), 3000);
      return;
    }

    var listAmigos = await response.json();
    var logged = listAmigos.logged
    for (var f of logged) {
      var fin = f.webId.indexOf(".inrupt");
      var inicio = f.webId.indexOf("//");

      f.webId = f.webId.slice(inicio + 2, fin);

      if (f.inAdviseDist) result.cercanos.push(f);
      else result.lejanos.push(f);
    }

    this.setState({
      amigos: result,
      amigosNoLogeados: listAmigos.notLogged
    });
  }

  render() {
    return (
      <nav className="Menu">
        <h5>
          Welcome back, <Value src="user.vcard_fn" />.
        </h5>

        <p>Amigos cercanos:</p>
        <ul>
          {this.state.amigos.cercanos.map((amigo) => {
            return <div className="FriendCard {amigo.inAdviseDist}"><p>{amigo.webId}</p><p>{amigo.dist} km</p></div>;
          })}
        </ul>

        <p>Amigos lejanos:</p>
        <ul>
          {this.state.amigos.lejanos.map((amigo) => {
            return <div className="FriendCard {amigo.inAdviseDist}"><p>{amigo.webId}</p><p>{amigo.dist} km</p></div>;
          })}
        </ul>
        
        <p>Amigos deslogueados:</p>
        <ul>
          {this.state.amigosNoLogeados.map((amigo) => {
            return <li> {amigo} </li>;
          })}
        </ul>
      </nav>
    );
  }
}
export default ListAmigos;
