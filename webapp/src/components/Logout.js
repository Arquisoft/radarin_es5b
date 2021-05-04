import React from "react";
import user from "../api/userDataManager";



class Logout extends React.Component{
    constructor(){
        super();
        if(user.isLogged())
            user.disconnect();            
    }

    render(){
        return(
            <h2 id="welcomeMsg">Bienvenido</h2>
        );
    }

}

export default Logout;