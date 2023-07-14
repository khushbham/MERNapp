import React, { useState, useEffect } from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import Accordion from "@mui/material/Accordion";
import { Link } from "@mui/material";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { FiChevronUp } from "react-icons/fi";
import { Calendar } from "react-modern-calendar-datepicker";
import UserInformation from "./UserInformation";
import RealUserInformation from "./RealUserInformation";
import "../../../../css/admin/user.css";
import StudentInformation from "./StudentInformation";
import UserDetailTeacherInfo from "./UserDetailTeacherInfo";
import Chatbox from "./Chatbox";

import { userCalender } from "../../../../actions/auth";
import { connect } from "react-redux";

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
          <Typography component="div">{children}</Typography>
        </Box>
      )}
    </div>
  );
}
const myCustomLocale = {
  // months list by order
  months: [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ],

  // week days by order
  weekDays: [
    {
      name: "Sunday", // used for accessibility
      short: "S", // displayed at the top of days' rows
      isWeekend: true, // is it a formal weekend or not?
    },
    {
      name: "Monday",
      short: "M",
    },
    {
      name: "Tuesday",
      short: "T",
    },
    {
      name: "Wednesday",
      short: "W",
    },
    {
      name: "Thursday",
      short: "T",
    },
    {
      name: "Friday",
      short: "F",
    },
    {
      name: "Saturday",
      short: "S",
      isWeekend: true,
    },
  ],

  weekStartingIndex: 0,

  getToday(gregorainTodayObject) {
    return gregorainTodayObject;
  },

  toNativeDate(date) {
    return new Date(date.year, date.month - 1, date.day);
  },

  getMonthLength(date) {
    return new Date(date.year, date.month, 0).getDate();
  },

  transformDigit(digit) {
    return digit;
  },

  nextMonth: "Next Month",
  previousMonth: "Previous Month",
  openMonthSelector: "Open Month Selector",
  openYearSelector: "Open Year Selector",
  closeMonthSelector: "Close Month Selector",
  closeYearSelector: "Close Year Selector",
  defaultPlaceholder: "Select...",
  from: "from",
  to: "to",

  // used for input value when multi dates are selected
  digitSeparator: ",",

  // if your provide -2 for example, year will be 2 digited
  yearLetterSkip: 0,

  // is your language rtl or ltr?
  isRtl: false,
};
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};

function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
function UserContent({ user_id, chatDetails, userCalender }) {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const [selectedDay, setSelectedDay] = React.useState(null);
  const [calenderData, setCalenderData] = React.useState([]);
  const [apiHit, setApiHit] = React.useState(false);
  const [userRole, setUserRole] = React.useState(0);
  const [tabLabel, setTabLabel] = React.useState("");
  useEffect(() => {
    setApiHit(false);
    userCalender(user_id).then((res) => {
      if (res && res.success) {
        setCalenderData(res.data);
        setUserRole(res.userData);
        setTabLabel(
          res.userData.user_role == 1 ? "Student Profile" : "Teacher Profile"
        );
        setApiHit(true);
      }
    });
  }, []);
  const selectSessionDate = (e) => {
    setSelectedDay(e);
    console.log(e);
  };
  return (
    <>
      <Grid container className="p-3 main-head-dashboard">
        <Grid item xs={6} md={6}>
          <Typography variant="h5">User Details</Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography align="right" variant="body1">
            Users /{" "}
            <span>
              <Link className="name-user" color="secondary">
                User Detail
              </Link>
            </span>
          </Typography>
        </Grid>
      </Grid>
      <Grid
        container
        className="p-3 user-page"
        columnSpacing={{ xs: 1, sm: 2, md: 3 }}
      >
        <Grid item xs={12} md={12} lg={8} className="mr-3">
          <Paper className="p-0">
            <Box sx={{ width: "100%" }}>
              <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
                <Tabs
                  value={value}
                  onChange={handleChange}
                  aria-label="tabs-basic-info"
                  className="tabs-user-info"
                >
                  <Tab label="Basic Information" {...a11yProps(0)} />
                  {userRole && userRole.user_role != 3 && (
                    <Tab label="Student Profile" {...a11yProps(1)} />
                    )}
                  {userRole && userRole.user_role != 3 && (
                    <Tab label="Teacher Profile" {...a11yProps(2)} />
                  )}
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                {userRole.user_created_by_admin == 0 ||
                localStorage.getItem("UserRole") == 3 ? (
                  <RealUserInformation />
                ) : (
                  <UserInformation />
                )}
              </TabPanel>
              <TabPanel value={value} index={1}>
                  <StudentInformation user_id={user_id} />
              </TabPanel>
              <TabPanel value={value} index={2}>
                  <UserDetailTeacherInfo user_id={user_id} />
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
        <Grid item xs={12} md={12} lg={4}>
          <Paper className="side-accr">
            <Accordion>
              <AccordionSummary
                expandIcon={<FiChevronUp />}
                aria-controls="panel1a-content"
                id="panel1a-header"
              >
                <Typography>Chat Activity</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Chatbox chatDetails={chatDetails} />
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
                {apiHit && (
                  <Calendar
                    customDaysClassName={calenderData}
                    showNavigation={false}
                    onChange={selectSessionDate}
                    locale={myCustomLocale}
                  />
                )}
              </AccordionDetails>
            </Accordion>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { userCalender })(UserContent);
