import React from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import SignUpTabs from '../../Students/AccountManagement/SignUpTabs';
const TeacherSignUp = () => {
    return (
        <Box className="SignUpFrom">
              <Grid container>
                   <Grid item lg={5} xs={12} className="m-auto">
                        <Box className="FormOuter">
                             <Typography variant="h4" component="h2" className="loginHead mb-2"> Create account</Typography>
                             <SignUpTabs />
                        </Box>
                   </Grid>
                </Grid>
                   
        </Box>
    )
}

export default TeacherSignUp
