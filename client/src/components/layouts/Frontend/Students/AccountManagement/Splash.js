import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
const Splash = () => {
    return (
        <Box className="spashWrapper">
              <Grid container>
                  <Grid item lg={9} sm={12} xs={12}>
                      <Box className="splash-bg-img">
                      </Box>
                  </Grid>
                  <Grid item lg={3} sm={12} xs={12}>
                       <Box className="splashOuter">
                             <Typography variant="h4" component="h2" className="loginHead mb-2" align="left"> <img src="../images/logo-teachify.png" className="ImageStyle"/></Typography>
                             <Typography variant="h2" component="h2" className="loginHead mb-2" align="left">Learn anything, anywhere with a live teacher</Typography>
                             <Typography variant="subtitle1" gutterBottom component="div" className="instruct-text mb-3" align="left">Learn anything, anywhere with a live teacher</Typography>
                             <Link to="/" className="LoginbtnLink my-2">Login</Link>
                             <Link to="/" className="LoginbtnLink my-2">Sign up</Link>
                             <Typography align="center"> <Link to="/">Or continue as a guest</Link></Typography>
                        </Box>
                  </Grid>
                </Grid>
                   
        </Box>
    )
}

export default Splash
