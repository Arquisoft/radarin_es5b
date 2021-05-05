import React from "react";
import user from "../api/userDataManager";
import elementsSize from "../elementsSize";

class Logout extends React.Component{
    constructor(){
        super();
        if(user.isLogged())
            user.disconnect();            
    }
    
    componentDidMount() {
        elementsSize.logout();
    }

    render(){
        return(
            <h2 id="welcomeMsg">Bienvenido</h2>
        );
    }

}

export default Logout;