import { AuthButton, Like, LoggedIn, Value, List, Follow, useWebId, } from "@solid/react";
import "bootstrap/dist/css/bootstrap.min.css";
import React from "react";
import Mapa from "./Mapa";

import restapi from "../api/api";

export default  function Principal() {


    restapi.connect(useWebId());
    
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

