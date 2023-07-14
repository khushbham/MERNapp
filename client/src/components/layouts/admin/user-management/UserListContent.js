import React from 'react';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import AllUsersList from "./AllUsersList";
import Grid from '@mui/material/Grid';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { BiUserPlus } from "react-icons/bi";
import { Link } from "react-router-dom";

function UserListContent() {
  return (
    <>
      <Grid container className="p-3 main-head-dashboard" style={{alignItems:'center'}}>
        <Grid item xs={9} md={9} lg={9} xl={9}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Typography variant="h5">Users List</Typography>
            {/* <Link className="add-new-user" component={Button} variant="contained" href="/new-user" style={{borderRadius:'50px'}}> <span><BiUserPlus /></span> Add New User</Link> */}
            <Link className="add-new-user-btn" to="/new-user" style={{ borderRadius: '50px', marginLeft: '10px' }}> <span><BiUserPlus /></span> Add New User</Link>
          </Box>
        </Grid>
        <Grid item xs={3} md={3} lg={3} xl={3}>
          <Typography align="right" variant="body1">User Management</Typography>
        </Grid>
      </Grid>

      <AllUsersList />
    </>
  );
}

export default UserListContent;
