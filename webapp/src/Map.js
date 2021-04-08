import React from 'react';
import {
    GoogleMap,
    withScriptjs,
    withGoogleMap
} from 'react-google-maps';

const Map = (props)=>{
    return (
        <GoogleMap defaultZoom={9} defaultCenter={{lat: 30, lng: 30}}/>
    );
}

function setCenter(lat, lng){
    Map.setCenter(lat, lng);
}

export default withScriptjs (
    withGoogleMap(
        Map
    )
)