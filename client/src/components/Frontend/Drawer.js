import React, { useState } from "react";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import Link from '@mui/material/Link';
import { FaBars } from 'react-icons/fa';
// import MenuIcon from "@material-ui/icons/Menu";
import '../../css/Frontend/style.css'
function DrawerComponent() {
  const [openDrawer, setOpenDrawer] = useState(false);
  return (
    <>
      <Drawer
        className="DesktopSidebar"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List>
        <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/" className="link">Home</Link>
            </ListItemText>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/about" className="link">About</Link>
            </ListItemText>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/contact" className="link">Contact</Link>
            </ListItemText>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
            <ListItemText>
              <Link to="/about" className="link">Faq</Link>
            </ListItemText>
          </ListItem>
          <Divider className="LinksBorder"/>
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}className="icon">
        {/* <MenuIcon /> */}
        <FaBars />
      </IconButton>
    </>
  );
}
export default DrawerComponent;
