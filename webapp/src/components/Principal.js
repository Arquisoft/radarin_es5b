import { LoggedIn, Value, List } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";
import AdminLocations from "./AdminLocations"
import api from "../api/userDataManager";
import { BrowserRouter as Router,Route,Link } from "react-router-dom";

//export default  function Principal() {

class Principal extends React.Component {

    constructor() {
        super();
        this.state = {
            connected: false
        };
       
    }
    
    componentDidMount() {
        api.connect();
        this.setState({ connected: true });
    }


    render() {
        return (
            <Router>
                <LoggedIn>
                    <Route path="/" exact component={Mapa}></Route>
                    <Route path="/admin" exact component={AdminLocations}></Route>
                    <nav className="navbar navbar-expand-lg navbar-light bg-light">
                        <div className="container-fluid">
                            <Link className="navbar-brand" to="/admin">Administrar Ubicaciones</Link>
                            <Link className="navbar-brand" to="/">Mapa</Link>
                        </div>
                    </nav>
                    <nav className="Menu">
                        <h5>Welcome back, <Value src="user.vcard_fn" />.</h5>
                       
                        <p>Amigos:</p>
                        <List src="user.friends" />
                    </nav>
                </LoggedIn>
            </Router>);
    }
}

export default Principal;