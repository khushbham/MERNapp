import React, { useEffect, useState } from "react";
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
import {FiUser} from 'react-icons/fi';
import {AiOutlineWechat} from 'react-icons/ai';
import {IoCreateOutline, IoNotificationsSharp} from 'react-icons/io5';
// import MenuIcon from "@material-ui/icons/Menu";
import '../../../css/Frontend/style.css';
import { BiLogOutCircle } from "react-icons/bi";
import { useDispatch } from "react-redux";
import { unreadNotificationsCount } from "../../../actions/frontent";
import Badge from '@mui/material/Badge';

function DrawerComponent(props) {
  const history = useHistory()
  const [openDrawer, setOpenDrawer] = useState(false);

  

  const logout = ()=>{
    localStorage.removeItem("token");
    localStorage.removeItem("user_role");
    localStorage.removeItem("profile_created")

    setOpenDrawer(false)
    window.location = '/'

  // history.push({
  //   pathname:"/"
  // })
}
  return (
    <>
    {/* {console.log("count of notification " , )} */}
      <Drawer
        className="DesktopSidebar"
        open={openDrawer}
        onClose={() => setOpenDrawer(false)}
      >
        <List className="MenuListt">
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
             <ListItemButton onClick={()=>history.push("/teacher/dashboard")}>
                <ListItemIcon className="IconsList">
                  <AiOutlineHome />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/teacher/dashboard" className="link">Dashboard for teachers</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/classes-steps")}>
                <ListItemIcon className="IconsList">
                  <IoCreateOutline />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/classes-steps" className="link">Create Class</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/teacher/teacher-profile")}>
                <ListItemIcon className="IconsList">
                  <FiUser />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/teacher/teacher-profile" className="link">My Account</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>

          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/teacher/calendar")}>
                <ListItemIcon className="IconsList">
                  <AiOutlineCalendar />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/teacher/calendar" className="link">My Calendar</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/teacher/chat")}>
                <ListItemIcon className="IconsList">
                <AiOutlineWechat />
                </ListItemIcon>
                <ListItemText>
                  <Link to="/teacher/chat" className="link">My Chat</Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={() => setOpenDrawer(false)}>
           <ListItemButton onClick={()=>history.push("/teacher/notification")} className="notification_button">
                <ListItemIcon className="IconsList">
                <IconButton aria-label={props.showNotificaiton ? props.showNotificaiton : 0}>
                <Badge badgeContent={props.showNotificaiton ? props.showNotificaiton : 0} color="secondary">
                <IoNotificationsSharp />
                </Badge>
                </IconButton>
                </ListItemIcon>
                <ListItemText>
                  <Link to="/teacher/notification" className="link">Notifications  </Link>
                </ListItemText>
            </ListItemButton>
          </ListItem>
          <Divider className="LinksBorder"/>
          <ListItem onClick={()=>logout()}>
           <ListItemButton >
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
export default DrawerComponent;
