import React from "react";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  Marker,
  InfoWindow,
  Circle
} from "react-google-maps";

import credentials from "./credentials";
import restapi from "../api/api";
import userDataManager from "../api/userDataManager";
import elemsSize from "../elementsSize.js"

class Mapa extends React.Component {
  constructor() {
    super();
    this.state = {
      radius: 1,
      users: [],
      latitude: null,
      longitude: null,
      userAddress: null,
    };
   
  }

  componentDidMount(){
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.getLocation();
    //setTimeout(this.updateFriendsPos.bind(this), 1000)
    this.updateFriendsPos()
    elemsSize.updateSize()
  }
  
  componentDidUpdate() {
    setTimeout(elemsSize.updateMarkers, 200)
  }

  async updateFriendsPos() {
    // or you can set markers list somewhere else
    // please also set your correct lat & lng
    // you may only use 1 image for all markers, if then, remove the img_src attribute ^^
    
    var response = await restapi.getFriendsCoords()
    if(response.status !== 200){
      console.log("update");
      setTimeout(this.updateFriendsPos.bind(this), 3000)
      return;
    }
    let initRad = userDataManager.getRadius()
    if (initRad != null)
      this.setRadius(initRad)
    
    else {
      initRad = sessionStorage.getItem("radius")
      if (initRad != null)
        this.setState({radius: initRad})
    }
    
    var friends = (await response.json()).logged;
   
    var result = [];
    for(var friend of friends) {
      result.push({"lat": friend.coords.lat, "lng": friend.coords.lon,"webId":friend.webId});
    }
    
    console.log(result);
    this.setState({
      users: result,
    });
   this.getLocation()
  }
  
  async changeRadius() {
    let newRadius = document.getElementById("inputRad").value
    this.setRadius(newRadius)
    restapi.updateRadius(newRadius < 0 ? -newRadius : newRadius)
  }
  
  setRadius(value) {
    this.setState({radius: value})
    sessionStorage.setItem("radius", value)
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getCoordinates,
        this.handleLocationError
      );
    } else {
      console.log("Geolocation is not supported by this browser.");
    }
  }

  getCoordinates(position) {
    this.setState({
      latitude: position.coords.latitude,
      longitude: position.coords.longitude,
    });
  }

  handleLocationError(error) {
    switch (error.code) {
      case error.PERMISSION_DENIED:
        alert("User denied the request for Geolocation.");
        break;
      case error.POSITION_UNAVAILABLE:
        alert("Location information is unavailable.");
        break;
      case error.TIMEOUT:
        alert("The request to get user location timed out.");
        break;
      case error.UNKNOWN_ERROR:
        alert("An unknown error occurred.");
        break;
      default:
        break;
    }
  }

  actualizar() {
    this.updateFriendsPos.bind(this);
    
  }

  render() {
    const MyMapComponent = withScriptjs(
      withGoogleMap((props) => (
        <GoogleMap
          defaultZoom={8}
          defaultCenter={{
            lat: this.state.latitude,
            lng: this.state.longitude,
          }}
        >
          <Marker position={{ lat: this.state.latitude, lng: this.state.longitude }} 
           icon= 'http://maps.google.com/mapfiles/ms/icons/yellow-dot.png'
           >
             <InfoWindow onClose={this.onInfoWindowClose}>
                <span className="marker">Usted está aquí</span>
              </InfoWindow>
            </Marker>
          
          
          <Circle
                  defaultCenter={{
                    lat: this.state.latitude,
                    lng: this.state.longitude
                  }}
                  radius={this.state.radius * 1000}
                />
          {this.state.users.map((user, i) =>{
           
            console.log(user);
              return(
                <Marker position={{ lat: user.lat, lng: user.lng }} 
                icon= 'http://maps.google.com/mapfiles/ms/icons/red-dot.png'
                >
                  <InfoWindow    onClose={this.onInfoWindowClose} >
                                 <div>
                                     <span className="marker">{user.webId}</span>
                                 </div>
                             </InfoWindow>
                 </Marker>

              )
            })} 
        </GoogleMap>
      ))
    );
    const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${credentials.mapsKey}`;
    return (
      <div id="mapBlock">
        <div id="controls">
          <button id="updateMapBt" onClick={this.updateFriendsPos.bind(this)}>Actualizar mapa</button>
          <div id="radiusPanel">
            <input id="inputRad" type="number" placeholder="Radio en km"></input>
            <button onClick={this.changeRadius.bind(this)}>Actualizar radio</button>
          </div>
        </div>
        <MyMapComponent
          googleMapURL={mapURL}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100%` }} />}
          mapElement={<div style={{ height: `100%` }} />}
        ></MyMapComponent>
        
      </div>
    );
  }
}
export default Mapa;