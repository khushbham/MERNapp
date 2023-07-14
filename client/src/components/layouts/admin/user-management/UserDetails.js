import React, { useState, useEffect } from "react";
import Sidebar from "../Sidebar";
import { Box } from "@mui/system";
import DetailsContent from "./DetailsContent";
import classNames from "classnames";
import Topbar from "../Topbar";
import Footer from "../Footer";
import { connect } from "react-redux";
import { getChatTokenForAdmin } from "../../../../actions/auth";
const UserDetails = ({ match, getChatTokenForAdmin }) => {
  const [sidebarIsOpen, setSidebarOpen] = useState(true);
  const toggleSidebar = () => setSidebarOpen(!sidebarIsOpen);
  const [chatDetails, getChatDetails] = useState(null);
  useEffect(() => {
    getChatTokenForAdmin(match.params.id).then((res) => {
      if (res && res.success) {
        getChatDetails(res.data);
      }
    });
  }, [match.params.id]);
  return (
    <div className="App wrapper">
      <Sidebar toggle={toggleSidebar} isOpen={sidebarIsOpen} />
      <Box className={classNames("content", { "is-open": sidebarIsOpen })}>
        <Topbar toggleSidebar={toggleSidebar} />
        {chatDetails && (
          <DetailsContent user_id={match.params.id} chatDetails={chatDetails} />
        )}
        <Footer />
      </Box>
    </div>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getChatTokenForAdmin })(UserDetails);
