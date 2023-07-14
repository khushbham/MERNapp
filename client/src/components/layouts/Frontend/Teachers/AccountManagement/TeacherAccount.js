import React from 'react'
import Box from '@mui/material/Box';
import Navbar from '../../Navbar';
import AccountSidebar from './NotificationsSettings';
const TeacherAccount = () => {
    return (
       <Box className="Myaccounts">
            <Navbar/>
            <AccountSidebar />
       </Box>
    )
}

export default TeacherAccount
