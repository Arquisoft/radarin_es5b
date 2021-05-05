import { useWebId, List } from "@solid/react";
import Button from "react-bootstrap/Button";
import React from "react";

import restapi from "../api/api";

export default  function Admin() {

    function banear(userId) {
        alert("Banear usuario: " + userId)
    }

    function desbanear(userId) {
        alert("Desbanear usuario: " + userId)
    }

    return (
        <div class="users">
            <div>
                <h3>USUARIOS</h3>
                <List src={["user1","user2","user3","user4"]}></List>
                <table>
                    <tr>
                        <td> <input type="text" id="user"></input> </td>
                        <td> 
                            <Button class="botonAdmin" onClick={() => banear(document.getElementById("user").value)}>
                                BANEAR USUARIO
                            </Button> 
                        </td>
                        <td>
                            <Button  class="botonAdmin" onClick={() => desbanear(document.getElementById("user").value)}>
                                DESBANEAR USUARIO
                            </Button>
                        </td>
                    </tr>
                </table>
            </div>
        </div>
    );

}