import { Value } from "@solid/react";
import React from "react";

import userDataManager from "../api/userDataManager";


class ListAmigos extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      amigos: { cercanos: [], lejanos: [] },
      amigosNoLogeados: []
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

    this.setState(result);
    setTimeout(this.listarAmigos.bind(this), 5000);

  }

  render() {
    return (
      <nav id="Menu">
        <h5>
          Welcome back, <Value src="user.vcard_fn" />.
        </h5>

        <p>Amigos cercanos</p>
        <div>
          {this.state.amigos.cercanos.map((amigo) => {
            return <div className={"FriendCard " + (amigo.inAdviseDist ? "inAdvise" : "notInAdvise")}>
              <div className="WebId">{amigo.webId}</div>
              <div className="Distance">{amigo.dist} km</div>
            </div>
          })}
        </div>

        <p>Amigos lejanos</p>
        <div>
          {this.state.amigos.lejanos.map((amigo) => {
            return <div className={"FriendCard " + (amigo.inAdviseDist ? "inAdvise" : "notInAdvise")}>
              <div className="WebId">{amigo.webId}</div>
              <div className="Distance">{amigo.dist} km</div>
            </div>;
          })}
        </div>
        
        <p>Amigos desconectados</p>
        <div>
          {this.state.amigosNoLogeados.map((amigo) => {
            return <div className="FriendCard notLogged">{amigo}</div>;
          })}
        </div>
      </nav>
    );
  }
}
export default ListAmigos;
