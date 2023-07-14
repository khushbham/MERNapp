import React, { useState } from 'react'
import Sidebar from '../Sidebar';
import { Box } from '@mui/system';
import { connect } from 'react-redux';
import Topbar from "../Topbar";
import classNames from "classnames";
import RefundData from "./RefundData";
import "../../../../css/admin/refund.css";
//import InvoiceData from './InvoiceData';

import Footer from '../Footer';
const RefundDetails = ({ auth: { loading } }) => {
const [sidebarIsOpen, setSidebarOpen] = useState(true);
const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  return (
    <div className="App wrapper">
      <Sidebar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
      <Box
        className={classNames("content", { "is-open": sidebarIsOpen })}>
        <Topbar toggleSidebar={toggleSidebar} />
        <RefundData />
        <Footer />
      </Box>
    </div>
  )
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps
)(RefundDetails);
