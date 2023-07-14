import React, { useEffect, useState } from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import Navbar from '../../Navbar';
import Switch from '@mui/material/Switch';
import { Link } from "react-router-dom";
import TeacherAccSidebar from './TeacherAccSidebar';
import { useDispatch, useSelector } from 'react-redux';
import { notificationSettings, getNotificationlist } from '../../../../../actions/frontent';
const label = { inputProps: { 'aria-label': 'Switch demo' } };

const NotificationsSettings = () => {
    const dispatch = useDispatch();
    const state = useSelector((state) => state.teachButton)
    const [teachNotification, setTeachNotification] = useState({
        notificationRecord: [],
        mainTitleArray: []

    });
    const [checked, setChecked] = useState(true);
    const [stateChanged, setStateChanged] = useState(false);

    useEffect(() => {

        dispatch(getNotificationlist(2)).then(res => {
            if (res && res.success) {
                setTeachNotification(res.data);
            }
        }).catch(err => console.log(err, "this is errror"))

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
            <Navbar />
            <Grid container>
                <Grid item lg={10} sm={10} md={12} xs={12} className="m-auto informationSidebar my-4">
                    <Box
                        sx={{ flexGrow: 1, display: 'flex' }}>
                        <Grid container>
                            <Grid item lg={4} sm={4} md={12} xs={12}>
                                <TeacherAccSidebar />
                            </Grid>
                            <Grid item lg={8} sm={8} md={12} xs={12}>
                                <Box className="notificationSettings">
                                    <Container>
                                        <Typography variant="h4" component="h2" className="notifyHead mb-2" align="left"> Notifications</Typography>

                                        {teachNotification.notificationRecord
                                            && teachNotification.notificationRecord.length > 0
                                            && teachNotification.notificationRecord.map((completeResult, index) => (
                                                <Box className="chatWrap">
                                                    <Typography variant="h3" component="h3" className="SessionsHead">{teachNotification.mainTitleArray[completeResult._id]}</Typography>

                                                    {completeResult.notifications && completeResult.notifications.length > 0 && completeResult.notifications.map((notification, i) => (

                                                        <Box className="SessionsWrap d-flex align-items-center flex-wrap">
                                                            {console.log(i)}
                                                            <Typography variant="subtitle1" gutterBottom component="div" className="Subtitle">{notification.setting_title}</Typography>


                                                            <Switch  {...label} checked={notification.userDetail.activation_status} onChange={e => handleOnChange(e, notification._id, !notification.userDetail.activation_status)} />
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

export default NotificationsSettings
