import React , { useEffect, useState } from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import MyPayoutsTabs from './MyPayoutsTabs';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { FiDollarSign } from "react-icons/fi";
import { AiOutlineRise } from "react-icons/ai";
import StudentNavbar from '../Students/StudentNavbar';
import { totalEarningFromRefund } from '../../../../actions/frontent';
import { useDispatch } from 'react-redux';
import { useHistory } from 'react-router-dom';
const MyPayouts = () => {
    const history = useHistory()
    const dispatch = useDispatch()
    const [Earning, setEarning] = useState();
    useEffect(()=>{
        dispatch(totalEarningFromRefund()).then((res)=>{
            setEarning(res.data.refundDetail)
        }).catch((err)=>{
            console.log(err)
        })
    },[])
    return (
        <Box className="payoutWrapper">
            <StudentNavbar />
                <Box>
                    <Grid container> 
                        <Grid item lg={6} sm={10} md={8} xs={12} className="m-auto mt-4">
                            <Box className="payOutsettings">
                            <Typography variant="caption" display="block" gutterBottom className="headinggg">My Refunds</Typography>
                                <Grid container spacing={2}>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Box className="payBox" onClick={()=>history.push('/payout')}>
                                            <Typography variant="caption" display="block" gutterBottom className="PayoutText"><AiOutlineRise />My Earnings </Typography>
                                            <Typography variant="h4" gutterBottom component="div" className="PayoutHead mb-0"> ${Earning?.[0]?.refund_amount}</Typography>
                                        </Box>
                                    </Grid>
                                    <Grid item lg={6} sm={6} xs={12}>
                                        <Box className="payBox">
                                            <Typography variant="caption" display="block" gutterBottom  className="PayoutText"><FiDollarSign />Refund Settings</Typography>
                                            <Typography variant="h4" gutterBottom component="div" className="PayoutHead mb-0">Debit Card</Typography>
                                        </Box>
                                    </Grid>
                                    <Typography className="fieldTextt text-center d-block w-100">How would you like to get your refund?</Typography>
                                </Grid>
                            </Box>
                        </Grid>
                    </Grid>
                </Box>
                <MyPayoutsTabs />
        </Box>
    )
}
export default MyPayouts
