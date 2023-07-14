import React,{useEffect} from 'react';
import { Route, Redirect } from 'react-router-dom';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Spinner from '../layouts/Spinner';
import { loadUser } from '../../actions/auth';
import Loader from '../Loader'
const PrivateRoute = ({
  loadUser,
  component: Component,
  auth: { isAuthenticated, loading },
  ...rest
}) => {
  useEffect(() => {
    
    loadUser();
  
}, []);
return (
  <div>
 {loading ? <Loader /> : 

(isAuthenticated ? <Route
  {...rest}
  render={props =>
    (
      <Component {...props} />
    )
  }
/> : <Redirect to='/admin-login' />
)}
  </div>
  
)};

PrivateRoute.propTypes = {
  auth: PropTypes.object.isRequired
};

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(mapStateToProps,{loadUser})(PrivateRoute);
