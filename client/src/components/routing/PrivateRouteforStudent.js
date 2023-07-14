import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { studentAuth } from './Authentication';


const PrivateRouteforStudent = ({ component: Component, ...rest }) => {

  return (
    <Route
    {...rest}
    render={(props) =>
      studentAuth() ? <Component {...props} /> : <Redirect to="/" />
    }
  />
  )

}

export default PrivateRouteforStudent