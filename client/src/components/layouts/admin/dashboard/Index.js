import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { connect } from 'react-redux';
import { Box } from '@mui/system';
import PageContent from './PageContent';
import Topbar from "../Topbar";
import classNames from "classnames";
import "../../../../css/admin/dashboard.css";
const AdminDashboard = ({ auth: { user } }) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  return (
    <div className="App wrapper">
        <Sidebar toggle={toggleSidebar} isOpen={sidebarIsOpen}/>
        <Box
            className={classNames("content", { "is-open": sidebarIsOpen })}
        >
            <Topbar toggleSidebar={toggleSidebar} />
            <PageContent toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} loggedInUserDetails={user} />

      </Box>
    </div>
  )
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps
)(AdminDashboard);
