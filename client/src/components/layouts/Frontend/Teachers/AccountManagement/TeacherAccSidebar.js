import React from 'react'
import Box from '@mui/material/Box';
import { FiBook } from 'react-icons/fi';
import { FaRegEdit } from 'react-icons/fa';
import {IoMdNotifications} from 'react-icons/io';
import {AiOutlineHeart} from 'react-icons/ai';
import {BsCheck2Circle} from 'react-icons/bs';
import {AiOutlineUser} from 'react-icons/ai';
import {CgSupport} from 'react-icons/cg';
import {BsCurrencyDollar} from 'react-icons/bs';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useHistory } from "react-router-dom";
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import { TiFlowSwitch } from 'react-icons/ti';
import { useDispatch } from 'react-redux';
import { checkUserSwitchAccountStatus } from '../../../../../actions/frontent';
import { Button } from '@mui/material';
const TeacherAccSidebar = () => {
    const dispatch = useDispatch()
    const history = useHistory()
  const onSwitch =()=>{
   const proceed =  window.confirm("Are you sure you want to Switch the account ")
   if(proceed){
    dispatch(checkUserSwitchAccountStatus()).then((res)=>{
       // console.log(res.data.studentProfileCompleted,"studentProfileCompleted")
        if(res.data.studentProfileCompleted === false){
            localStorage.setItem("user_role", 1)
            history.push("/accountsetup")
        }else{
            localStorage.setItem("user_role", 1)
         history.push("/student/dashboard")
        }
       }).catch((err)=>{
        console.log(err , "err")
       })
       }
   }
   
    return (
        <Box className="SidebarList">
            <Button className="switchProfileLink" onClick={()=>onSwitch()}><TiFlowSwitch/>Switch to student profile</Button>
            <List>
                <ListSubheader component="div" id="nested-list-subheader">
                    Account Settings
                </ListSubheader>
                <ListItem>
                    <ListItemIcon>
                        <FaRegEdit />
                    </ListItemIcon>
                    <ListItemText> 
                    <Link to="/teacher/editbasic-info" className="link">Edit Basic Information</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <IoMdNotifications />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to="/teacher/notification-settings" className="link">Notifications</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListSubheader component="div" id="nested-list-subheader">
                My Teacher Profile
                </ListSubheader>
                <ListItem>
                    <ListItemIcon>
                        <AiOutlineUser />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to="/teacher/teacher-profile" className="link">View Teacher Profile</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <FaRegEdit />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to="/teacher/edit-profile" className="link">Edit Teacher Profile</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <BsCheck2Circle />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to='/teacher/calendar?show=availability' className="link">My Availability</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <FiBook />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to="/teacher/student" className="link">My Students</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <BsCurrencyDollar />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to='/teacher/payouts' className="link">My Payouts</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListSubheader component="div" id="nested-list-subheader">
                Account Settings
                </ListSubheader>
                <ListItem>
                    <ListItemIcon>
                        <CgSupport />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to="#" className="link">File a Support Ticket</Link>
                    </ListItemText>
                </ListItem>
            </List>
        </Box>
    )
}

export default TeacherAccSidebar
