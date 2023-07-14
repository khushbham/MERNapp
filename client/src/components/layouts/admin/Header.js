import React, { Fragment } from 'react';
import { logout } from '../../../actions/auth';
import { connect } from 'react-redux';
import { SITE_URL } from '../../../actions/types';
import { Link } from 'react-router-dom';

export const Header = ({ logout }) => {
  return (
    <Fragment>
      <nav className="navbar navbar-expand navbar-light bg-white topbar mb-4 static-top shadow">
        {/* Sidebar Toggle (Topbar) */}
        <button id="sidebarToggleTop" onClick={() => {
          var element = document.querySelector('#accordionSidebar');
          element.classList.toggle("toggled");
        }} className="btn btn-link d-md-none rounded-circle mr-3">
          <i className="fa fa-bars" />
        </button>
        {/* Topbar Navbar */}
        <ul className="navbar-nav ml-auto">


          <div className="topbar-divider d-none d-sm-block" />
          <li className="nav-item dropdown no-arrow">
            <a className="nav-link dropdown-toggle" href="#" id="userDropdown" role="button" data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
              <span className="mr-2 d-none d-lg-inline text-gray-600 small">Admin</span>
              <img className="img-profile rounded-circle" src={`${SITE_URL}/img/undraw_profile.svg`} />
            </a>
            <div className="dropdown-menu dropdown-menu-right shadow animated--grow-in" aria-labelledby="userDropdown">
              <Link className="dropdown-item" to={`/change-password`}>
                <i className="fas fa-cogs fa-sm fa-fw mr-2 text-gray-400" />
                Change Password
              </Link>
              <div className="dropdown-divider" />
              <a className="dropdown-item" href="/admin-login" onClick={() => { logout() }}>
                <i className="fas fa-sign-out-alt fa-sm fa-fw mr-2 text-gray-400" />
                Logout
              </a>
            </div>
          </li>
        </ul>
      </nav>
    </Fragment>
  );
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { logout }
)(Header);