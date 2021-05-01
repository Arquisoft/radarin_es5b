import { LoggedIn, Value, List } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";

import api from "../api/userDataManager";

//export default  function Principal() {

class Principal extends React.Component {

    constructor() {
        super();
        this.state = {
            connected: false
        };
       
    }
    
    /*
      componentDidMount() {
        var f =async  () => {
            await api.connect();

            this.setState({ connected: true });
        };
        f();

        
        
    }
*/
    componentDidMount(){
        api.connect();
        this.setState({ connected: true });
    }


    render() {
/*
        if(this.state.connected){
        return (
            <LoggedIn>

                    
                <Mapa />
                <nav class="Menu">
                    <h5>Welcome back, <Value src="user.vcard_fn" />.</h5>
                    <p>Amigos:</p>
                    <List src="user.friends" />
                </nav>
            </LoggedIn>);
        }
        else{
            return(
            <div>
            <nav class="Menu">
            <h5>Welcome back, <Value src="user.vcard_fn" />.</h5>
            <p>Amigos:</p>
            <List src="user.friends" />
        </nav></div>);
        }*/
        return (
            <LoggedIn>

                    
                <Mapa />
                <nav class="Menu">
                    <h5>Welcome back, <Value src="user.vcard_fn" />.</h5>
                    <p>Amigos:</p>
                    <List src="user.friends" />
                </nav>
            </LoggedIn>);

    }
}

export default Principal;

