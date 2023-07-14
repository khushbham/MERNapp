import React, { useState } from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Accordion from '@mui/material/Accordion';
import AccordionSummary from '@mui/material/AccordionSummary';
import AccordionDetails from '@mui/material/AccordionDetails';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import { FiChevronUp } from 'react-icons/fi'
import { Calendar } from "react-modern-calendar-datepicker";
import BasicInformation from './BasicInformation';
import UserInformation from './UserInformation';
import '../../../../css/admin/user.css';
import { Divider } from '@mui/material';


function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        textAlign: 'center',
        fontSize: 12,
        fontWeight: '300',
        ...sx,
      }}
      {...other}
    />
  );
}

Item.propTypes = {
  sx: PropTypes.oneOfType([
    PropTypes.arrayOf(
      PropTypes.oneOfType([PropTypes.func, PropTypes.object, PropTypes.bool]),
    ),
    PropTypes.func,
    PropTypes.object,
  ]),
};

function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box>
          <Typography
            component="div"
          >{children}</Typography>
        </Box>
      )}
    </div>
  );
}

TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    'aria-controls': `simple-tabpanel-${index}`,
  };
}



function UserContent() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Grid container className="p-3 main-head-dashboard">
        <Grid item xs={6} md={6}>
          <h3>User Details</h3>
        </Grid>
        <Grid item xs={6} md={6}>
          <p align="right">Users / <span>Meg Ridgen</span></p>
        </Grid>
      </Grid>
      <Grid container className="p-3" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} md={12} lg={8} className="mr-3">
          <Paper className="p-0">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs-basic-info" className="tabs-user-info">
                  <Tab label="Basic Information" {...a11yProps(0)} />
                  <Tab label="Student Profile" {...a11yProps(1)} />
                  <Tab label="Teacher Profiles" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <div className="admni-sect">
                  <Typography variant="h5" className="pb-3">Administrative Controls</Typography>
                  <Divider />
                  <BasicInformation />
                </div>
                <div className="user-infor-sect">
                  <UserInformation />
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                Item Two
              </TabPanel>
              <TabPanel value={value} index={2}>
                Item Three
              </TabPanel>
            </Box>

          </Paper>

        </Grid>
        <Grid item item xs={12} md={12} lg={4}>
          <Paper className="p-2 side-accr">
            <Accordion>
              <AccordionSummary
                expandIcon={<FiChevronUp />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Chat Activity</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Typography>
                  Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                  malesuada lacus ex, sit amet blandit leo lobortis eget.
                </Typography>
              </AccordionDetails>
            </Accordion>
          </Paper>
          <Paper className="mt-2 p-2 side-accr user-side-calender">
            <Accordion>
              <AccordionSummary
                expandIcon={<FiChevronUp />}
                aria-controls="panel2a-content"
                id="panel2a-header"
              >
                <Typography>User Calendar</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Calendar />
                <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
                  <Item className="not-available">Not available</Item>
                  <Item className="available">Available</Item>
                  <Item className="schedule">Scheduled</Item>
                </Box>
              </AccordionDetails>
            </Accordion>
          </Paper>

        </Grid>
      </Grid>

    </>


  );
}

export default UserContent;
