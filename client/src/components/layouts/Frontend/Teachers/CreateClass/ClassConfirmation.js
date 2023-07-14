import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import {Link} from 'react-router-dom';
// import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Navbar from '../../Navbar';
const ClassConfirmation = () => {
    return (
    <>
    <Navbar/>
    <Box className="classesWrap confirmationSec">
       <Container>
        <Grid container>
            <Grid item lg={6} md={7} sm={12} className="m-auto StepsContentWrapper py-4">
                <Typography variant="h4" gutterBottom component="div" className="confirmationHead" align='center'>Your class has been successfully created!</Typography>
                <Typography variant="subtitle1" gutterBottom component="div"  align='center'>You can publish your first class now or work on your availability settings.</Typography>
                <Box className="confimationLinks text-center mt-5">
                    <Link to="/classes-steps" className="SignBtn">Create another class</Link>
                    <Link to="/teacher/calendar?show=availability" className="SignUpBtn"> Set Availability</Link>
                </Box>
            </Grid>
         </Grid>
        </Container>
    </Box>
    </>
    )
}

export default ClassConfirmation
