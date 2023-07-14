import React, { useState } from "react";
import Divider from '@mui/material/Divider';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import Drawer from '@mui/material/Drawer';
import IconButton from '@mui/material/IconButton';
import { Link, useHistory } from "react-router-dom";
import { FaBars } from 'react-icons/fa';
import ListItemButton from '@mui/material/ListItemButton';
import { AiOutlineHome } from 'react-icons/ai';
import ListItemIcon from '@mui/material/ListItemIcon';
import {FiSearch} from 'react-icons/fi';
import {AiOutlineCalendar} from 'react-icons/ai';
import {AiOutlineWechat} from 'react-icons/ai';
import {FiUser} from 'react-icons/fi';
import Badge from '@mui/material/Badge';
// import MenuIcon from "@material-ui/icons/Menu";
import '../../../../css/Frontend/style.css';
import { BiLogOutCircle } from "react-icons/bi";
import { IoNotificationsSharp } from "react-icons/io5";

function StudentDrawer(props) {
  const {showNotification}= props
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false);

  const logout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("profile_created");
    setOpenDrawer(false)
    window.location = '/'
    // history.push({
    //   pathname:"/"
    // })

  }
  return (
    <>
      <Drawer
        className="DesktopSidebar"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List className="MenuListt">
        <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton className="ButtonStyle" onClick={()=>history.push("/student/dashboard")}>
                <ListItemIcon className="IconsList">
                  <AiOutlineHome />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/student/dashboard" className="link">Dashboard for student</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          {/* <ListItem onClick={() => setOpenDrawer(false)}>
          <ListItemButton>
                <ListItemIcon className="IconsList">
                  <AiOutlineHome />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/teacher/dashboard" className="link">Dashboard for teachers</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem> */}
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/search")}>
                <ListItemIcon className="IconsList">
                  <FiSearch />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/search" className="link">Search</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>

          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/students/basic-info")}>
                <ListItemIcon className="IconsList">
                  <FiUser />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/students/basic-info" className="link">My Accounts</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/students/my-classes")}>
                <ListItemIcon className="IconsList">
                  <AiOutlineCalendar />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/students/my-classes" className="link">My Classes</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/student/chats")}>
                <ListItemIcon className="IconsList">
                  <AiOutlineWechat />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/student/chats" className="link">My Chats</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/students/notificationlisting")} className="notification_button">
                <ListItemIcon className="IconsList">
                <IconButton aria-label={showNotification ? showNotification : 0}>
                <Badge badgeContent={showNotification ? showNotification : 0} color="secondary">
                <IoNotificationsSharp />
                </Badge>
                </IconButton>
                </ListItemIcon>
                <ListItemText>
                  <Link to="/students/notificationlisting" className="link">Notifications</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={()=>logout()}>
           <ListItemButton>
                <ListItemIcon className="IconsList">
                  <BiLogOutCircle />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/" className="link">Logout</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
        </List>
      </Drawer>
      <IconButton onClick={() => setOpenDrawer(!openDrawer)}className="icon">
        {/* <MenuIcon /> */}
        <FaBars />
      </IconButton>
    </>
  );
}
export default StudentDrawer;
