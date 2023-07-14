import React from 'react'
import Box from '@mui/material/Box';
import { FiBook } from 'react-icons/fi';
import { FaRegEdit } from 'react-icons/fa';
import {IoMdNotifications} from 'react-icons/io';
import {AiOutlineHeart} from 'react-icons/ai';
import {AiOutlineUser} from 'react-icons/ai';
import {CgSupport} from 'react-icons/cg';
import {MdOutlinePayment , MdOutlinePayments} from 'react-icons/md';
import List from '@mui/material/List';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import { Link, useHistory } from "react-router-dom";
import ListItem from '@mui/material/ListItem';
import ListSubheader from '@mui/material/ListSubheader';
import Divider from '@mui/material/Divider';
import { TiFlowSwitch } from 'react-icons/ti';
import { Button } from '@mui/material';
import { checkUserSwitchAccountStatus } from '../../../../../actions/frontent';
import { useDispatch } from 'react-redux';
const StudentAccSidebar = () => {
    const dispatch = useDispatch();
    const history = useHistory();
    const onSwitch =()=>{
     const proceed =  window.confirm("Are you sure you want to Switch the account ")
       if(proceed){
        dispatch(checkUserSwitchAccountStatus()).then((res)=>{
         if(res.data.teacherProfileCompleted === false){
             localStorage.setItem("user_role", 2)
          history.push("/expertiseAccountsetup")
         }else{
             localStorage.setItem("user_role", 2)
          history.push("/teacher/dashboard")
         }
        }).catch((err)=>{
         console.log(err , "err")
        })
        }
    }
    return (
        <Box className="SidebarList">
            <Button className="switchProfileLink" onClick={()=>onSwitch()}><TiFlowSwitch/>Switch to Teacher profile</Button>
            <List>
                <ListSubheader component="div" id="nested-list-subheader">
                    Account Settings
                </ListSubheader>
                <ListItem>
                    <ListItemIcon>
                        <FaRegEdit />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to="/basic-information" className="link">Edit Basic Information</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <IoMdNotifications />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to="/students/notifications" className="link">Notifications</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListSubheader component="div" id="nested-list-subheader">
                My Student Profile
                </ListSubheader>
                <ListItem>
                    <ListItemIcon>
                        <AiOutlineUser />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to="/students/basic-info" className="link">View Public Profile</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <AiOutlineHeart />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to='/students/favourite' className="link">My Favorites</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <MdOutlinePayments />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to='/students/payments' className="link">My Payments</Link>
                    </ListItemText>
                </ListItem>
                <Divider/>
                <ListItem>
                    <ListItemIcon>
                        <MdOutlinePayment />
                    </ListItemIcon>
                    <ListItemText>
                    <Link to='/payout' className="link">My Refunds</Link>
                    </ListItemText>
                </ListItem>
               
                <ListSubheader component="div" id="nested-list-subheader">
                Support
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

export default StudentAccSidebar
