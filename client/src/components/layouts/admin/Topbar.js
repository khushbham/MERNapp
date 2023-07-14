import React from "react";
import { BsChat, BsGear } from "react-icons/bs";
import { logout } from '../../../actions/auth';
import { connect } from 'react-redux';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import ToggleButton from '@mui/material/ToggleButton';
import { Link } from "react-router-dom";
import { FiMenu } from "react-icons/fi";
import MobileNavigation from "./MobileNavigation";

const Topbar = ({ toggleSidebar, logout }) => {

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };


  return (
    <>
      <Box sx={{ flexGrow: 1 }}>
        <Grid container className="admin-header shadow-sm">
          <Grid item xs={8} className="left-topbar">
            <ToggleButton size="large" value="justify" key="justify" onClick={toggleSidebar} className="nav-toggle-btn" >
              <FiMenu />
            </ToggleButton>
            <MobileNavigation />
          </Grid>
          <Grid item xs={4} className="right-topbar">
            <div className="header-right">
              <div className="dash-profile-img d-flex justify-content-end align-items-center">
                <div className="prf-img-dash">
                  <img className="w-100" src="../../../../images/dash-image.png" alt="" />
                </div>
                <div className="vrtcl-line"></div>
                {/* <button className="chat-top-button"><BsChat /></button> */}
                <button className="gear-top-button"
                  id="basic-button"
                  aria-controls="basic-menu"
                  aria-haspopup="true"
                  aria-expanded={open ? 'true' : undefined}
                  onClick={handleClick}
                >
                  <BsGear />
                </button>
                <Menu className="tgl-side-right"
                  id="basic-menu"
                  anchorEl={anchorEl}
                  open={open}
                  onClose={handleClose}
                  MenuListProps={{
                    'aria-labelledby': 'basic-button',
                  }}
                >
                  <MenuItem><Link to="/admin-change-password">Change Password</Link></MenuItem>
                  {/* <MenuItem><Link to="/admin-profile">My account</Link></MenuItem> */}
                  <MenuItem  onClick={() => logout()}><Link to="/admin-login">Logout </Link></MenuItem>
                </Menu>
              </div>
            </div>
          </Grid>
        </Grid>
      </Box>



    </>
  );
};

const mapStateToProps = state => ({
  auth: state.auth,
  alert: state.alert
});

export default connect(
  mapStateToProps,
  { logout }
)(Topbar);

//export default Topbar;
