import React from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Navbar from '../../Navbar';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { BsCheck2Circle } from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import { BiErrorAlt } from 'react-icons/bi';
const Payoutpending = () => {
    return (
        <Box className="payoutWrapper">
            <Navbar />
                <Box>
                    <Grid container> 
                        <Grid item lg={8} sm={10} xs={12} className="m-auto mt-4">
                            <Box className="payOutsettings">
                            <Typography variant="caption" display="block" gutterBottom className="headinggg">My Payouts</Typography>
                                     <Grid container>
                                            <Grid item lg={8} sm={8} xs={12}>
                                                <Grid container spacing={2}>
                                                    <Grid item lg={6} sm={6} xs={12}>
                                                        <Box className="payBox">
                                                            <Typography variant="caption" display="block" gutterBottom className="PayoutText"><AiOutlineRise />My Earnings </Typography>
                                                            <Typography variant="h4" gutterBottom component="div" className="PayoutHead mb-0">$13,989.54</Typography>
                                                            <Typography variant="caption" display="block" gutterBottom className="subbTexttt"> All time</Typography>
                                                        </Box>
                                                    </Grid>
                                                    <Grid item lg={6} sm={6} xs={12}>
                                                        <Box className="payBox">
                                                            <Typography variant="caption" display="block" gutterBottom  className="PayoutText"><BiErrorAlt />Payout Settings</Typography>
                                                            <Typography variant="h4" gutterBottom component="div" className="PayoutHead mb-0">All set!</Typography>
                                                            <Typography variant="caption" display="block" gutterBottom className="subbTexttt"> Tap to update</Typography>
                                                        </Box>
                                                    </Grid>
                                            </Grid>
                                    </Grid>
                                </Grid>
                            </Box>
                            <Box className="NotificationsSettingss">
                               <Box className="d-flex align-items-center ">
                                   <span className="checkIcon error"><BiErrorAlt/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Please update your payout settings</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> Tap here and enter your account details so we can transfer funds over to you, </Typography>
                                   </Box>
                               </Box>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
        </Box>
    )
}
export default Payoutpending
