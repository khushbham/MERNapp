import React from 'react'
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import Navbar from '../../Navbar';
import TeacherAccSidebar from './TeacherAccSidebar';
import TeacherTabs from '../TeacherProfile/TeacherTabs';
const ProfileTeacherView = () => {
    return (
      <>
      <Navbar/>
      <Grid container>
          <Grid item lg={10} sm={10} md={12} xs={12} className="m-auto informationSidebar my-4">
               <Box
                sx={{ flexGrow: 1, display: 'flex'}}>
                    <Grid container>
                        <Grid item lg={4} sm={4} md={12} xs={12}>
                            <TeacherAccSidebar/>
                        </Grid>
                        <Grid item lg={8} sm={8} md={12} xs={12}>
                           <TeacherTabs />
                        </Grid>
                    </Grid>
                </Box>
             </Grid>
        </Grid>
      </>
       
    )
}

export default ProfileTeacherView
