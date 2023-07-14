import React from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import StudentAccSidebar from './StudentAccSidebar';
import StudentTabs from './StudentTabs';
import StudentNavbar from '../StudentNavbar';

const StudentProfileView = () => {
    return (
      <>
      <StudentNavbar/>
      <Grid container>
          <Grid item lg={10} sm={10} md={12} xs={12} className="m-auto informationSidebar my-4">
               <Box
                sx={{ flexGrow: 1, display: 'flex'}}>
                    <Grid container>
                        <Grid item lg={4} sm={4} md={12} xs={12}>
                            <StudentAccSidebar/>
                        </Grid>
                        <Grid item lg={8} sm={8} md={12} xs={12}>
                           <StudentTabs />
                        </Grid>
                    </Grid>
                </Box>
             </Grid>
        </Grid>
      </>
       
    )
}

export default StudentProfileView
