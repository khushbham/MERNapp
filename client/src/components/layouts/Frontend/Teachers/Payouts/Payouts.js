import React, { useState, useEffect } from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MyPayoutsTabs from './MyPayoutsTabs';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FiDollarSign } from "react-icons/fi";
import { AiOutlineRise } from "react-icons/ai";
import Navbar from '../../Navbar';
import { useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { totalEarning } from '../../../../../actions/frontent';

const Payouts = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [Earning, setEarning] = useState();
    useEffect(()=>{
        dispatch(totalEarning()).then((res)=>{
            setEarning(res.data.payoutsDetail)
          }).catch((err)=>{
            console.log(err , 'error')
          })
    },[])
    return (
        <Box className="payoutWrapper">
            <Navbar />
                <Box>
                    <Grid container> 
                        <Grid item lg={6} sm={10} md={8} xs={12} className="m-auto mt-4">
                            <Box className="payOutsettings">
                            <Typography variant="caption" display="block" gutterBottom className="headinggg">My Payouts</Typography>
                                <Grid container spacing={2}>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Box className="payBox" onClick={()=>history.push('/teacher/payouts')}>
                                            <Typography variant="caption" display="block" gutterBottom className="PayoutText"><AiOutlineRise />My Earnings </Typography>
                                            <Typography variant="h4" gutterBottom component="div" className="PayoutHead mb-0">${Earning?.length ? Earning?.[0]?.paid_amount : '0' }</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Box className="payBox">
                                            <Typography variant="caption" display="block" gutterBottom  className="PayoutText"><FiDollarSign />Payout Settings</Typography>
                                            <Typography variant="h4" gutterBottom component="div" className="PayoutHead mb-0">Debit Card</Typography>
                                        </Box>
                                    </Grid>
                                    <Typography className="fieldTextt text-center d-block w-100">How would you like to get your payment?</Typography>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <MyPayoutsTabs />
        </Box>
    )
}
export default Payouts;
