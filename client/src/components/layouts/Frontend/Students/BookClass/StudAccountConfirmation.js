import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const StudAccountConfirmation = () => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (
        <Box className="SignUpFrom ResetPass">
              <Grid container>
                   <Grid item lg={5} xs={12} className="m-auto">
                        <Box className="FormOuter  py-5">
                             <Typography variant="h4" component="h2" className="loginHead mb-2">Your payment was approved</Typography>
                             <Typography variant="subtitle1" gutterBottom component="div" className="instruct-text mb-3">Now you can check the booked class by clicking on below button.</Typography>
                            <Link to="/students/my-classes" className="CreatebtnLink my-4" style={{textDecoration:"none"}}>View class on calendar</Link>
                        </Box>
                   </Grid>
                </Grid>
                   
        </Box>
    )
}

export default StudAccountConfirmation