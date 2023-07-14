import React from 'react'
import Grid from '@mui/material/Grid';
import { Typography } from '@mui/material';
import '../../../../css/admin/student.css'
import { BsCalendar4 } from "react-icons/bs";
import { FiDollarSign } from "react-icons/fi";
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Button from '@mui/material/Button';
import StudentInfoDataTable from "./StudentInfoDataTable"
import TeacherPayouts from "./TeacherPayouts"
const TeacherInfo = ({user_id}) => {
    return (
        <div className="teacherTesing">
            <Grid container>
                <Grid item lg={4} md={4} sm={12} xs={12} className="GridVal">
                    <Grid container className="studRecord">
                        <Grid item lg={9} md={9} sm={12} xs={12}>
                            <Typography variant="h5" component="h2"> Teacher Rating</Typography>
                            <p className="totalval">4.3 (255)</p>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <div className="Circle">
                                <BsCalendar4 />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} className="GridVal">
                    <Grid container className="studRecord">
                        <Grid item lg={9} md={9} sm={12} xs={12}>
                            <Typography variant="h5" component="h2"> Sessions Hosted</Typography>
                            <p className="totalval">255</p>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <div className="Circle">
                                <BsCalendar4 />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} className="GridVal">
                    <Grid container className="studRecord">
                        <Grid item lg={9} md={9} sm={12} xs={12}>
                            <Typography variant="h5" component="h2">Total Earnings</Typography>
                            <p className="totalval">$ 10,298.98</p>
                        </Grid>
                        <Grid item lg={3} md={3} sm={12} xs={12}>
                            <div className="Circle">
                                <FiDollarSign />
                            </div>
                        </Grid>
                    </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Paper className="mt-3 p-2">
                        <Box
                            sx={{
                                display: 'flex',
                                alignItems: 'center',
                                p: 1,
                                m: 1,
                            }}
                        >
                            <Typography variant="h5" className="spc-extra-rght">Recent Users</Typography>
                            <Button variant="contained" style={{ borderRadius: 50 }}>View all</Button>
                        </Box>
                    </Paper>
                    <StudentInfoDataTable />
                </Grid>
                <Grid container>
                    <Grid item lg={12} md={12} sm={12} xs={12}>
                        <Paper className="mt-3 p-2">
                            <Box
                                sx={{
                                    display: 'flex',
                                    alignItems: 'center',
                                    p: 1,
                                    m: 1,
                                }}
                            >
                                <Typography variant="h5" className="spc-extra-rght">Recent Payouts</Typography>
                                <Button variant="contained" style={{ borderRadius: 50 }}>View all</Button>
                            </Box>
                        </Paper>
                        <TeacherPayouts user_id={user_id} session_id=""/>
                    </Grid>
                </Grid>
            </Grid>
        </div>
    )
}

export default TeacherInfo
