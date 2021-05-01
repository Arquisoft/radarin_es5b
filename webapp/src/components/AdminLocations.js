import React from "react";
import {Button,ListGroup,ListGroupItem} from "react-bootstrap"
import coordsManager from "../api/coordsManager"
import Geocode from "react-geocode";
import credentials from "./credentials";
class AdminLocations extends React.Component {
    
    constructor(){
        super();
        this.state={
            ubicaciones:[],
            nombres:[]
        }
    }
    
    alertClicked(i) {
        console.log(i);
        alert('You clicked the third ListGroupItem'+i);
      }
    componentDidMount(){
        this.getLocations();
      
    }

    async getLocations(){
        var locationsApi= (await coordsManager.getLocations());
        console.log("Component"+locationsApi);
        
        if(locationsApi == undefined){
            setTimeout(this.getLocations.bind(this), 3000)
            console.log("sin ubicaciones");
            return;
        }
        this.setState({ubicaciones :(locationsApi)})

    }

    
    render(){
       
        return(  <ListGroup>
             
             <ListGroup.Item   action onClick={()=>this.alertClicked(1)}>Ubicaciones</ListGroup.Item>
            {this.state.ubicaciones.map((value,index)=>{
            return <ListGroup.Item > Sitio: {value.name}Latitud: {value.lat} Longitud: {value.lon} Hora: {value.hour}</ListGroup.Item>;})

            }
        </ListGroup>);
    }
}

export default AdminLocations;