import React from "react";
import { ListGroup} from "react-bootstrap"
import coordsManager from "../api/coordsManager"


class AdminLocations extends React.Component {

    constructor() {
        super();
        this.state = {
            ubicaciones: [],
            nombres: []
        }
    }

    async borrarUbicacion(id) {
        alert('Borrando ubicación con id: ' + id);
        await coordsManager.removeLocation(id);
        this.getLocations();
    }


    componentDidMount() {
        this.getLocations();
    }

    async getLocations() {
        var locationsApi = (await coordsManager.getLocations());
        console.log("Component" + locationsApi);

        if (locationsApi === undefined) {
            setTimeout(this.getLocations.bind(this), 3000)
            console.log("sin ubicaciones");
            return;
        }
        this.setState({ ubicaciones: (locationsApi) })

    }


    render() {
        var i=-1;
        return (<div className="map">
            <h3>Historial de ubicaciones, presione uno para eliminar </h3>
            <ListGroup >


                {this.state.ubicaciones.map((value, index) => {
                    i++;
                    if (i ===0)
                        return <ListGroup.Item variant="primary" action onClick={() => this.borrarUbicacion(value.id)}>Día: {value.day} Sitio: {value.name}Latitud: {value.lat} Longitud: {value.lon} Hora: {value.hour}</ListGroup.Item>;
                    if (i===1)
                        return <ListGroup.Item variant="secondary" action onClick={() => this.borrarUbicacion(value.id)}>Día: {value.day} Sitio: {value.name}Latitud: {value.lat} Longitud: {value.lon} Hora: {value.hour}</ListGroup.Item>;
                    if (i===2)
                        return <ListGroup.Item variant="success"  action onClick={() => this.borrarUbicacion(value.id)}>Día: {value.day} Sitio: {value.name}Latitud: {value.lat} Longitud: {value.lon} Hora: {value.hour}</ListGroup.Item>;
                    if (i===3)
                        return <ListGroup.Item variant="danger"  action onClick={() => this.borrarUbicacion(value.id)}>Día: {value.day} Sitio: {value.name}Latitud: {value.lat} Longitud: {value.lon} Hora: {value.hour}</ListGroup.Item>;
    
                    else{
                        i=-1;
                        return <ListGroup.Item variant="warning"  action onClick={() => this.borrarUbicacion(value.id)}>Día: {value.day} Sitio: {value.name}Latitud: {value.lat} Longitud: {value.lon} Hora: {value.hour}</ListGroup.Item>;
                        
                    }
                    

                })

                }
            </ListGroup></div>);
    }
}

export default AdminLocations;