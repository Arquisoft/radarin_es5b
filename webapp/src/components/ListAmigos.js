import { Value } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";


import userDataManager from "../api/userDataManager";

class ListAmigos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amigos: { cercanos: [], lejanos: [] }
    };
  }

  async componentDidMount() {
    this.listarAmigos();
  }

  async listarAmigos() {
    var result = await userDataManager.listarAmigos()
   console.log("Resultado: "+result);
    if (result === -1) { //Esto quiere decir que el usuario se ha desconectado
      return;
    }
    if (result === 0) { //Esto quiere decir que el usuario aun no está conectado
      setTimeout(this.listarAmigos.bind(this), 3000);
      return;
    }

    this.setState({
      amigos: result,
    });

    setTimeout(this.listarAmigos.bind(this), 5000);

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
    );
  }
}
export default ListAmigos;
