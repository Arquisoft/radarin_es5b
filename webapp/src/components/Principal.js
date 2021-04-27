import { AuthButton, Like, LoggedIn, Value, List, Follow, useWebId, } from "@solid/react";
import auth from "solid-auth-client"
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";
import Button from "react-bootstrap/Button";

import api from "../api/userDataManager";
import { render } from "@testing-library/react";
import { useLDflexValue, useLDflexList } from '@solid/react';
import Admin from "./Admin";

import $ from "jquery";

//export default  function Principal() {

class Principal extends React.Component{
    constructor(){
        super();
        api.connect();
    }

    administrar() {
        console.log("prueba")
        $(".admin").append($("<p></p>").text("añadido"))
        $(".prueba").css("color", "red")
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
            <div class="admin">
                <Button onClick={this.administrar} class="boton"> Administrar usuarios (Prueba) </Button>
                <p class="prueba">Texto de prueba</p>
                <Admin></Admin>
            </div>
        </LoggedIn>);
    }
}

export default Principal;

