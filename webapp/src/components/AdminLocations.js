import React from "react";
import {Button,ListGroup,ListGroupItem} from "react-bootstrap"
import coordsManager from "../api/coordsManager"


class AdminLocations extends React.Component {
    
    constructor(){
        super();
        this.state={
            ubicaciones:[],
            nombres:[]
        }
    }
    
    async borrarUbicacion(id) {
        alert('Borrando ubicación con id: '+id);
        await coordsManager.removeLocation(id);
        this.getLocations();
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
       
        return(  <div  className="map">
            <h3>Historial de ubicaciones, presione uno para eliminar </h3>
        <ListGroup >
             
            
            {this.state.ubicaciones.map((value,index)=>{
            return <ListGroup.Item key="value.id"  action onClick={()=>this.borrarUbicacion(value.id)}>Día: {value.day} Sitio: {value.name}Latitud: {value.lat} Longitud: {value.lon} Hora: {value.hour}</ListGroup.Item>;})

            }
        </ListGroup></div>);
    }
}

export default AdminLocations;