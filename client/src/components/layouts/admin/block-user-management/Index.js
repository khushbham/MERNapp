import React,{useState} from 'react';
import Sidebar from '../Sidebar';
import Topbar from "../Topbar";
import { connect } from 'react-redux';
import { Box } from '@mui/system';
import classNames from "classnames";

const BlockDashboard = ({auth:{loading}}) => {
    const [sidebarIsOpen, setSidebarOpen] = useState(true);
    const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  return (
    <div className="App wrapper">
        <Sidebar toggle={toggleSidebar} isOpen={sidebarIsOpen}/>
        <Box className={classNames("content", { "is-open": sidebarIsOpen })}>
        <Topbar toggleSidebar={toggleSidebar} />
        </Box>
    </div>
  )
}
const mapStateToProps = state => ({
    auth: state.auth
  });
  export default connect(
    mapStateToProps
  )(BlockDashboard);