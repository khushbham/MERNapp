import React, { useState } from 'react';
import Sidebar from '../Sidebar';
import { connect } from 'react-redux';
import { Box } from '@mui/system';
import PagesContent from './PagesContent';
import Topbar from "../Topbar";
import classNames from "classnames";

const PagesContentDashboard = ({ auth: { loading } }) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  return (
    <div className="App wrapper">
      <Sidebar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
      <Box
        className={classNames("content", { "is-open": sidebarIsOpen })}
      >
        <Topbar toggleSidebar={toggleSidebar} />
        <PagesContent toggleSidebar={toggleSidebar} sidebarIsOpen={sidebarIsOpen} />
      </Box>
    </div>
  )
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps
)(PagesContentDashboard);
