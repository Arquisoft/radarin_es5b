import React from "react";
import coordsManager from "../api/coordsManager"
import elemsSize from "../elementsSize.js"

class AdminLocations extends React.Component {

    constructor() {
        super();
        
        this.state = {
            ubicaciones: [],
            nombres: [],
        }
    }

    async borrarUbicacion(id) {
        alert('Borrando ubicación con id: ' + id);
        await coordsManager.removeLocation(id);
        this.getLocations();
    }


    componentDidMount() {
        this.getLocations();
        elemsSize.updateSize()
    }

    async getLocations() {
        var locationsApi = (await coordsManager.getLocations());
        console.log("Component" + locationsApi);

        if (locationsApi == null) {
            setTimeout(this.getLocations.bind(this), 3000)
            console.log("sin ubicaciones");
            return;
        }
        this.setState({ ubicaciones: (locationsApi) })

    }


    render() {
        var i = 0;
        return (
            <div id="mapBlock">
                <h5>Historial de ubicaciones, presione uno para eliminar</h5>
                <div>
                    {
                        this.state.ubicaciones.map((value, index) => {
                            if (value.info.city.length != 0) {
                                return <button className={"location location" + (i++ % 2)} onClick={() => this.borrarUbicacion(value.id)}>
                                    <div className="locStreet">{value.info.street}</div>
                                    <div className="locCity">{value.info.city} - {value.info.region}</div>
                                    <div className="locCountry">{value.info.country}</div>
                                    <div className="locTime">
                                        <div className="locHour">
                                            {value.hour}
                                        </div>
                                        <div className="locDay">
                                            {value.day}
                                        </div>
                                    </div>
                                    <div className="locCoords">
                                        Latitud: {value.lat}<br />Longitud: {value.lon}
                                    </div>
                                </button>
                            }
                            else {
                                return <button className={"location location" + (i++ % 2)} onClick={() => this.borrarUbicacion(value.id)}>
                                    <div className="locStreet">{value.info.street}</div>
                                    <div className="locTime">
                                        <div className="locHour">
                                            {value.hour}
                                        </div>
                                        <div className="locDay">
                                            {value.day}
                                        </div>
                                    </div>
                                    <div className="locCoords">
                                        Latitud: {value.lat}<br />Longitud: {value.lon}
                                    </div>
                                </button>
                            }
                        })
                    }
                </div>
            </div>
            );
    }
}

export default AdminLocations;