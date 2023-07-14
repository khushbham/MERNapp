import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { connect } from 'react-redux';
import Grid from '@mui/material/Grid';
import { Box } from '@mui/system';
import UserProfileContent from './UserProfileContent';
import Topbar from "../Topbar";
import classNames from "classnames";
import "../../../../css/admin/user.css";

const UserProfile = ({ auth: { loading } }) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  return (
    <div className="App wrapper">
      <Sidebar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
      <Box
        className={classNames("content", { "is-open": sidebarIsOpen })}
      >
        <Topbar toggleSidebar={toggleSidebar} />
        <UserProfileContent toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
      </Box>
    </div>
  )
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps
)(UserProfile);
