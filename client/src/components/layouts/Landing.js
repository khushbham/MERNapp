import React, { Fragment, useState, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { connect } from 'react-redux';
import '../../UserStyle';
import 'read-more-less-react/dist/index.css';
export const Landing = () => {


    return (
      <Redirect to='/admin-login' />
    )
}

const mapStateToProps = state => ({
  auth: state.auth,
  home: state.home
});
export default connect(
  mapStateToProps
)(Landing);