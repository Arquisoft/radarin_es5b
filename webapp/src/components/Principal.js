import { AuthButton, Like, LoggedIn, Value, List, Follow, useWebId, } from "@solid/react";
import auth from "solid-auth-client"
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";

import api from "../api/userDataManager";
import { render } from "@testing-library/react";
import { useLDflexValue, useLDflexList } from '@solid/react';

//export default  function Principal() {

class Principal extends React.Component{
    constructor(){
        super();
        api.connect();
    }

  

    render(){

        
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

