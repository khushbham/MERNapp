import React from 'react'
import { Redirect, Route } from "react-router-dom";
import { studentAuth, TeacherAuth } from './Authentication';

const PublicRoute = ({ component: Component, ...rest }) => {
    return (
        <Route
        {...rest}
        render={(props) =>
          studentAuth()||TeacherAuth() ?<Redirect to="/" />:<Component {...props}/> 
        }
      /> )
}
export default PublicRoute;