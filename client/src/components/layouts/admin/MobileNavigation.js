import React, { useState } from "react";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { FiHome, FiUsers, FiCalendar, FiDollarSign, FiType, FiBell } from "react-icons/fi";
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { Link } from "react-router-dom";
import Box from '@mui/material';
import { FaBars } from 'react-icons/fa';


function MobileNavigation() {
    const [openmobileDrawer, setOpenMobileDrawer] = useState(false);
    return (
      <>
        <Drawer
          className="MobileSidebar"
          open={openmobileDrawer}
          onClose={() => setOpenMobileDrawer(false)}
        >
          <div className="mobile-sidebar-logo">
            <div className="mobile-side-logo">
                <Link to="/admin-dashboard">
                <img src="../../../../images/logo-teachify.png" className='w-100' style={{height:'100%'}} />
                </Link>
            </div>
          </div>
        
          <List className="admn-sidebar-list">
          <Link to="/admin-dashboard"><ListItem disablePadding>
              <ListItemButton>
                <ListItemIcon>
                  <FiHome />
                </ListItemIcon>
                <ListItemText primary="Dashboard" />
              </ListItemButton>

            </ListItem>
            </Link>
            <Link to="/users">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FiUsers />
                  </ListItemIcon>
                  <ListItemText primary="User Management" />
                </ListItemButton>
              </ListItem>
            </Link>

            <Link to="/sessions">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FiCalendar />
                  </ListItemIcon>
                  <ListItemText primary="Session Management" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/payments">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FiDollarSign />
                  </ListItemIcon>
                  <ListItemText primary="Financial Management" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/content-management">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FiType />
                  </ListItemIcon>
                  <ListItemText primary="Content Management" />
                </ListItemButton>
              </ListItem>
            </Link>
            <Link to="/notification-management">
              <ListItem disablePadding>
                <ListItemButton>
                  <ListItemIcon>
                    <FiBell />
                  </ListItemIcon>
                  <ListItemText primary="Notification Management" />
                </ListItemButton>
              </ListItem>
            </Link>
          {/* <Link to="/admin-dashboard" className="link"><ListItem>
              <ListItemText>
               Dashboard
              </ListItemText>
            </ListItem>
            </Link> */}
            {/* <Link to="/users" className="link"><ListItem>
              <ListItemText>
               User Management
              </ListItemText>
            </ListItem>
            </Link> */}
           
          </List>
        </Drawer>
        <IconButton onClick={() => setOpenMobileDrawer(!openmobileDrawer)}className="icon mobile-nav">
          {/* <MenuIcon /> */}
          <FaBars />
        </IconButton>
      </>
    );
  }
  export default MobileNavigation;