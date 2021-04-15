import { AuthButton, Like, LoggedIn, Value, List, Follow, useWebId, } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";

import restapi from "../api/api";

import Button from "react-bootstrap/Button";
import Admin from "./Admin";

export default  function Principal() {


    restapi.connect(useWebId());   

    function admin() {
        alert("Administrando usuarios...");
        return (<Admin></Admin>);
    }

    return (
        <LoggedIn>
            
            <Mapa />
            <nav class="Menu">
                <h5>Welcome back, <Value src="user.vcard_fn" />.</h5>
                <p>Amigos:</p>
                <List src="user.friends" />
            </nav>

            <div class="admin">
                <Button onClick={() => admin()}>
                    ADMINISTRAR USUARIOS
                </Button>
                <Admin></Admin>
            </div>
            
        </LoggedIn>);

}

