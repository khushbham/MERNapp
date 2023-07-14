import React, { useEffect } from 'react';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import { FormControl, Typography } from "@mui/material";
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { Calendar } from "react-modern-calendar-datepicker";
import UserDataTableContent from "./UserDataTableContent";
import TransactionHistory from "./RecentTransaction";
import TeacherPayouts from "../user-management/TeacherPayouts";
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import Footer from '../Footer';
import { sessionsOfDashboard } from '../../../../actions/auth';
import { connect } from 'react-redux';

const Content = ({ loggedInUserDetails, sessionsOfDashboard, auth: { dashboardSessions } }) => {
  const [paymentstatus, setPaymentStatus] = React.useState(1);
  const [selectedDay, setSelectedDay] = React.useState(null);
  const handlePayment = (event) => {
    setPaymentStatus(event.target.value);
  };
  useEffect(() => {
    sessionsOfDashboard();
  }, []);
  const selectSessionDate = e => {
    setSelectedDay(e);
    console.log(e);
  }
  return (
    <>
      <Grid container className="p-3 main-head-dashboard">
        <Grid item xs={6} md={6}>
          <Typography variant="h5">My Dashboard</Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography align="right" variant="body1">Dashboard</Typography>
        </Grid>
      </Grid>
      <Grid container className="p-3" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} md={12} lg={8} className="mr-3">
          <Paper className="p-2">
            <List sx={{ width: '100%', maxWidth: 360, bgcolor: 'background.paper' }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Avatar alt="Remy Sharp" src="../../../../images/dash-image.png" />
                </ListItemAvatar>
                <ListItemText>
                  {loggedInUserDetails &&
                    <>
                      <Typography variant="h5">{loggedInUserDetails.firstname} {loggedInUserDetails.lastname}</Typography>
                      <Typography variant="fntEleven">{loggedInUserDetails.address}</Typography>
                    </>
                  }
                </ListItemText>
              </ListItem>
            </List>
          </Paper>
          <Paper className="mt-3 recent-user-dash">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Typography variant="h5" className="spc-extra-rght">Recent Users</Typography>
              <Link className="add-new-user-btn" to="/users" style={{ borderRadius: '50px', marginLeft: '10px' }}> View All</Link>

            </Box>
            <UserDataTableContent />
          </Paper>

          <Paper className="mt-3">
            <Box
              sx={{
                display: 'flex',
                alignItems: 'center',
                p: 2,
              }}
            >
              <Typography variant="h5" className="spc-extra-rght">Recent Transactions</Typography>
              <FormControl sx={{ m: 1 }} className="slct-paymnt">
                <Select className="payment-selection"
                  value={paymentstatus}
                  onChange={handlePayment}
                  displayEmpty
                  color="secondary"
                  inputProps={{ 'aria-label': 'Without label' }}
                >
                  <MenuItem value={1}>Payments</MenuItem>
                  <MenuItem value={2}>Payouts</MenuItem>
                </Select>
              </FormControl>
              <Link className="add-new-user-btn" to="/payments" style={{ borderRadius: '50px', marginLeft: '10px' }}> View All</Link>
              {/* <Button variant="contained" style={{ borderRadius: 50 }}>View all</Button> */}
            </Box>
            {paymentstatus == 1 ? 
            <TransactionHistory /> : <TeacherPayouts  user_id="" session_id="" />}
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Paper className="p-2 side-calender">
            <Box
              sx={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'space-between',
                alignItems: 'center',
                p: 1,
                m: 1,
              }}
            >
              <Typography variant="h5">Upcoming Sessions</Typography>
              <Link className="view-calender" to="/calendar-sessions/" style={{ borderRadius: '50px' }}> View Calendar</Link>
              {/* <Button variant="contained" style={{borderRadius: 50, textTransform: 'Capitalize'}}>View Calendar</Button> */}
            </Box>
            <Calendar
              customDaysClassName={dashboardSessions}
              showNavigation={false}
              onChange={selectSessionDate}
            />
          </Paper>
        </Grid>
      </Grid>
      {/* <Calendar /> */}

      {/* </Paper> */}
      {/* </Grid>
      </Grid> */}
      <Footer />

    </>
  );
}

const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  { sessionsOfDashboard }
)(Content);