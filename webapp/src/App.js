import React from "react";
import "./App.css";
import logo from "./logo.svg";
/*import Welcome from "./components/Welcome";
import EmailForm from "./components/EmailForm";
import UserList from "./components/UserList";*/
import "bootstrap/dist/css/bootstrap.min.css";
import {
  GoogleMap,
  withScriptjs,
  withGoogleMap,
  useLoadScript,
  InfoWindow,
  Marker,
} from "react-google-maps";
import credentials from "./credentials";
//import { getFriendsCoords } from "api/api";


class App extends React.Component {
  constructor() {
    super();
    this.state = {
      users: [],
      latitude: null,
      longitude: null,
      userAddress: null,
    };
    this.getLocation = this.getLocation.bind(this);
    this.getCoordinates = this.getCoordinates.bind(this);
    this.getLocation();
    /*(async () => {
      let a = await updateCoords()
      console.log(a[0].webId)
    })()*/
  }

  getLocation() {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        this.getCoordinates,
        this.handleLocationError
      );
    } else {
      alert("Geolocation is not supported by this browser.");
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
    }
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
          <Marker position={{ lat: this.state.latitude, lng: this.state.longitude }} />
        </GoogleMap>
      ))
    );

    const myStyle = {
      height: "600px",
    };

    const mapURL = `https://maps.googleapis.com/maps/api/js?v=3.exp&key=${credentials.mapsKey}`;
    return (
      <div>
        <MyMapComponent
          googleMapURL={mapURL}
          loadingElement={<div style={{ height: `100%` }} />}
          containerElement={<div style={{ height: `100vh`, width: "80vh" }} />}
          mapElement={<div style={{ height: `100%` }} />}
        ></MyMapComponent>
      </div>
    );
  }
}
export default App;
