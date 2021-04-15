import { useWebId, List } from "@solid/react";
import Button from "react-bootstrap/Button";
import React from "react";

import restapi from "../api/api";

export default  function Admin() {


    restapi.connect(useWebId());

    function banear(userId) {
        if(userId == null || userId == ""){
            alert("ERROR")
            return
        }

        alert("Banear usuario: " + userId)
        restapi.ban(userId)
    }

    function desbanear(userId) {
        if(userId == null || userId == ""){
            alert("ERROR")
            return
        }

        alert("Desbanear usuario: " + userId)
        restapi.unban(userId)
    }

    let users = restapi.listUsers()

    return (
        <div class="users">
            <div>
                <h3>USUARIOS</h3>
                <List src="users"></List>
            </div>
            <div class="ban">
                <input type="text" id="user"></input>
                <Button onClick={() => banear(document.getElementById("user").value)}>
                    BANEAR USUARIO
                </Button>
                <Button onClick={() => desbanear(document.getElementById("user").value)}>
                    DESBANEAR USUARIO
                </Button>
            </div>
        </div>
    );

}