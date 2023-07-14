import React from "react";
import GoogleMapReact from 'google-map-react';

const AnyReactComponent = ({ text }) => <div>{text}</div>;
export default function GoogleMap(props){
  const defaultProps = {
    center: {
      lat: props.latitude?props.latitude :59.955413,
      lng: props.longitude?props.longitude :30.337844
    },
    zoom: 11
  };
  return (
    // Important! Always set the container height explicitly
    <div style={{ height: '150px', width: '100%' }}>
      <GoogleMapReact
        bootstrapURLKeys={{ key:"AIzaSyDHG3-7xfdn3RyvqGlj9DfsPfJ9aAFCD54" }}
        defaultCenter={defaultProps.center}
        defaultZoom={defaultProps.zoom}
      >
        <AnyReactComponent
          lat={props.latitude}
          lng={props.latitude}
          text="My Marker"
        />
      </GoogleMapReact>
    </div>
  );
}