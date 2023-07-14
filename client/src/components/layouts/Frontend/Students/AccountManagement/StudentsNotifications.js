import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Switch from '@mui/material/Switch';
import { Link } from "react-router-dom";
import StudentAccSidebar from './StudentAccSidebar';
import StudentNavbar from '../StudentNavbar';
import { useDispatch, useSelector } from "react-redux"
import { getNotificationlist, notificationSettings } from '../../../../../actions/frontent';

const label = { inputProps: { 'aria-label': 'Switch demo' } };
const StudentsNotifications = () => {

    const dispatch = useDispatch();
    const state = useSelector((state) => state.buttonReducer)
    const [notificationsSettings, setNotificationsSettings] = useState({
        mainTitleArray: [],
        notificationRecord: []
    });
    const [checked, setChecked] = useState(true);
    const [stateChanged, setStateChanged] = useState(false);


    useEffect(() => {
        dispatch(getNotificationlist(1)).then(res => {
            if (res && res.success) {
                setNotificationsSettings(res.data)
            }
        })

    }, [stateChanged, checked]);

    const handleOnChange = (e, id, value) => {
        dispatch(notificationSettings(value, id)).then((res) => {
            if (res && res.success) {
                setStateChanged(!stateChanged);
                setChecked(res.data.activation_status)
            }
        }).catch((err) => { console.log(err) })
    }

    return (
        <>
            <StudentNavbar />
            <Grid container>
                <Grid item lg={10} sm={12} md={12} xs={12} className="m-auto informationSidebar my-4">
                    <Box
                        sx={{ flexGrow: 1, display: 'flex' }}>
                        <Grid container>
                            <Grid item lg={4} sm={4} md={12} xs={12}>
                                <StudentAccSidebar />
                            </Grid>
                            <Grid item lg={8} sm={8} md={12} xs={12}>
                                <Box className="notificationSettings">
                                    <Container>
                                        <Typography variant="h4" component="h2" className="notifyHead mb-2" align="left"> Notifications</Typography>
                                        {notificationsSettings.notificationRecord
                                            && notificationsSettings.notificationRecord.length > 0
                                            && notificationsSettings.notificationRecord.map((completeResult, index) => (
                                                <Box className="chatWrap">
                                                    <Typography variant="h3" component="h3" className="SessionsHead">{notificationsSettings.mainTitleArray[completeResult._id]}</Typography>

                                                    {completeResult.notifications && completeResult.notifications.length > 0 && completeResult.notifications.map((notification, i) => (
                                                        <Box className="SessionsWrap d-flex align-items-center flex-wrap">
                                                            <Typography variant="subtitle1" gutterBottom component="div" className="Subtitle">{notification.setting_title}</Typography>


                                                            <Switch {...label} checked={notification.userDetail.activation_status} onChange={e => handleOnChange(e, notification._id, !notification.userDetail.activation_status)} />
                                                        </Box>
                                                    ))}

                                                </Box>
                                            ))
                                        }

                                    </Container>
                                </Box>
                            </Grid>
                        </Grid>
                    </Box>
                </Grid>
            </Grid>
        </>

    )
}

export default StudentsNotifications
