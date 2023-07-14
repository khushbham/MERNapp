import React, { Fragment } from 'react';
import { Redirect } from 'react-router-dom';
const mystyle = {
      margin: "70px"
    };

const NotFound = ({isAuthenticated}) => {
    if (!isAuthenticated) {
      return <Redirect to='/admin-login' />;
    }
  return (
    <Fragment>
      <h1 className='x-large text-primary' >
        <i className='fas fa-exclamation-triangle'  /> Page Not Found
      </h1>
      <p className='large' style={mystyle}>Sorry, this page does not exist</p>
    </Fragment>
  );
};

export default NotFound;
