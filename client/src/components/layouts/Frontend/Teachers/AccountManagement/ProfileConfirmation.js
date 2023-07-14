import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';

const ProfileConfirmation = () => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (
        <Box className="SignUpFrom ResetPass">
              <Grid container>
                   <Grid item lg={5} xs={12} className="m-auto">
                        <Box className="FormOuter  py-5">
                             <Typography variant="h4" component="h2" className="loginHead mb-2">Your profile has been successfully created!</Typography>
                             <Typography variant="subtitle1" gutterBottom component="div" className="instruct-text mb-3">You can publish your first class now or work on your availability settings.</Typography>
                            <Link to="/" className="CreatebtnLink my-4">Create a class</Link>
                            <Link to="/" className="LoginbtnLink my-4">Set Availability</Link>
                        </Box>
                   </Grid>
                </Grid>
                   
        </Box>
    )
}
export default ProfileConfirmation
