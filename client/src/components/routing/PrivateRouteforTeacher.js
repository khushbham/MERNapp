import React from 'react';
import { Redirect, Route } from "react-router-dom";
import { TeacherAuth } from './Authentication';


const PrivateRouteforTeacher = ({ component: Component, ...rest }) => {

  return (
    <Route
    {...rest}
    render={(props) =>
      TeacherAuth() ? <Component {...props} /> : <Redirect to="/" />
    }
  />
  )

}

export default PrivateRouteforTeacher