import React from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Switch from '@mui/material/Switch';
import Link from '@mui/material/Link';

const label = { inputProps: { 'aria-label': 'Switch demo' } };
const Notifications = () => {
    
    return (
       <Box className="notificationSettings">
           <Container>
            <Typography variant="h4" component="h2" className="notifyHead mb-2" align="left"> Notification Settings</Typography>
            <Box className="chatWrap">
                <Typography variant="h3" component="h3" className="SessionsHead">Sessions</Typography>
                <Box className="SessionsWrap d-flex align-items-center flex-wrap">
                    <Typography variant="subtitle1" gutterBottom component="div" className="Subtitle">Session reminder</Typography>
                    <Switch {...label} defaultChecked />
                </Box>
                <Box className="SessionsWrap d-flex align-items-center flex-wrap">
                    <Typography variant="subtitle1" gutterBottom component="div" className="Subtitle">Session is canceled</Typography>
                    <Switch {...label} defaultChecked />
                </Box>
                <Box className="SessionsWrap d-flex align-items-center flex-wrap">
                    <Typography variant="subtitle1" gutterBottom component="div" className="Subtitle">Rate your experience</Typography>
                    <Switch {...label} defaultChecked />
                </Box>
             </Box>
             <Box className="chatWrap">
                 <Typography variant="h3" component="h3" className="SessionsHead">Chat</Typography>
                <Box className="SessionsWrap d-flex align-items-center flex-wrap">
                    <Typography variant="subtitle1" gutterBottom component="div" className="Subtitle">New messages</Typography>
                    <Switch {...label} defaultChecked />
                </Box>
             </Box>
             <Box className="chatWrap">
                 <Typography variant="h3" component="h3" className="SessionsHead">Financials</Typography>
                <Box className="SessionsWrap d-flex align-items-center flex-wrap">
                    <Typography variant="subtitle1" gutterBottom component="div" className="Subtitle">A refund is issued</Typography>
                    <Switch {...label} defaultChecked />
                </Box>
             </Box>
             <Link to="/" className="saveBtn">Save</Link>
            </Container>
       </Box>
    )
}

export default Notifications
