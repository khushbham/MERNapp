import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import StudentNavbar from "./StudentNavbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Link, useHistory } from "react-router-dom";
import InputBase from "@mui/material/InputBase";
import FormControl from "@mui/material/FormControl";
import { FiSearch } from "react-icons/fi";
import { styled, alpha } from "@mui/material/styles";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  checkUserSwitchAccountStatus,
  getChatToken,
  getUpcomingSessionForStudentDashboard,
  studentDashboard,
  unreadNotificationsCount,
} from "../../../../actions/frontent";
import { Button } from "@mui/material";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.8),
  },
  marginRight: theme.spacing(2),
  marginLeft: 0,
  width: "100%",
  marginTop: "5px",
  [theme.breakpoints.up("sm")]: {
    width: "100%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  top: "0",
  left: "0",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1.5, 1, 1.5, 5),
    transition: theme.transitions.create("width"),
    width: "100%",
    borderRadius: "24px",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));

const StudentDashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [dashboard, setDashboard] = useState();
  const [count, setCount] = useState(0);
  const [name, setname] = useState();
  const [upcomingSession, setupcommingSession] = useState({});
  useEffect(() => {
    dispatch(getChatToken()).then((res) => {
      console.log(res.data.user, "data");
      setname(res.data.user.first_name);
    });
    dispatch(studentDashboard())
      .then((res) => {
        console.log(res.data, "response");

        setDashboard(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dispatch(unreadNotificationsCount())
      .then((res) => {
        // console.log("Count api is working >>>>>>>>>>>" , res.data)
        setCount(res.data);
      })
      .catch((err) => console.log("Get the error", err));

    dispatch(getUpcomingSessionForStudentDashboard())
      .then((res) => {
        console.log(res.data);
        setupcommingSession(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
    dispatch(checkUserSwitchAccountStatus())
      .then((res) => {
        if (res.data.studentProfileCompleted == false) {
          history.push("/students/accounts");
        }
      })
      .catch((err) => console.log(err, "err"));
  }, []);

  const redirect = (value) => {
    history.push({
      pathname: "/students/class-Details",
      search: `booking_id=${value}`,
      state: {
        booking_id: value,
      },
    });
  };

  var startTime = moment(upcomingSession?.start_time_of_class, "HH:mm");
  var endTime = moment(upcomingSession?.end_time_of_class, "HH:mm");
  // calculate total duration
  var duration = moment.duration(endTime.diff(startTime));
  // duration in hours
  var hours = parseInt(duration.asHours());
  // duration in minutes
  var minutes = parseInt(duration.asMinutes()) % 60;
  return (
    <Box className="teacherDashboard">
      <StudentNavbar showNotification={count} />
      <Box className="DashboardContent py-5">
        <Container>
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            className="UserName"
          >
            Hello {name},
          </Typography>
          {/* <Grid container>
            <Grid item lg={6} md={8} sm={12} xs={12} className="mb-4 mt-2">
              <FormControl variant="standard" className="w-100">
                <Search className="SearchField">
                  <StyledInputBase
                    className="w-100"
                    placeholder="What would you like to learn today?"
                  />
                  <SearchIconWrapper>
                    <FiSearch />
                  </SearchIconWrapper>
                </Search>
              </FormControl>
            </Grid>
          </Grid> */}

          <Box className="Overview-wrapper mt-4">
            <Grid container spacing={4}>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Typography
                  variant="h5"
                  gutterBottom
                  component="div"
                  className="overviewHeading"
                >
                  Overview
                </Typography>
                <Grid container>
                  <Grid item xs={4}>
                    <Box className="overviewText">
                      <Typography
                        variant="h3"
                        gutterBottom
                        component="div"
                        className="overviewHead"
                      >
                        {dashboard?.sessionsSoFar}
                      </Typography>
                      <Typography
                        variant="h6"
                        gutterBottom
                        component="div"
                        className="overviewSubText"
                      >
                        Sessions so far
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box className="overviewText">
                      <Typography
                        variant="h3"
                        gutterBottom
                        component="div"
                        className="overviewHead"
                      >
                        {dashboard?.teachers}
                      </Typography>
                      <Typography
                        variant="h6"
                        gutterBottom
                        component="div"
                        className="overviewSubText"
                      >
                        Teachers
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={4}>
                    <Box className="overviewText">
                      <Typography
                        variant="h3"
                        gutterBottom
                        component="div"
                        className="overviewHead"
                      >
                        {dashboard?.topicsLearned}
                      </Typography>
                      <Typography
                        variant="h6"
                        gutterBottom
                        component="div"
                        className="overviewSubText"
                      >
                        Topics Learned
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
              <Grid item lg={6} md={6} sm={12} xs={12}>
                {upcomingSession ? (
                  <Box className="NextscheduleWrap">
                    <Box className="detailsOuter">
                      <Typography
                        variant="h5"
                        gutterBottom
                        component="div"
                        className=""
                      >
                        Next scheduled class
                      </Typography>
                      {console.log(upcomingSession)}
                      <Button
                        onClick={() => redirect(upcomingSession?._id)}
                        className="detailsLink"
                      >
                        View Details
                      </Button>
                    </Box>
                    <Box className="scheduleClassDetails">
                      <Grid container className="innertext">
                        <Grid item lg={2} md={2} sm={4} xs={6}>
                          <Typography variant="h6" gutterBottom component="div">
                            Class
                          </Typography>
                        </Grid>
                        <Grid item lg={10} md={10} sm={8} xs={6}>
                          <Typography variant="h6" gutterBottom component="div">
                            {upcomingSession?.class_title}
                          </Typography>
                        </Grid>
                      </Grid>
                      <Grid container className="innertext">
                        <Grid item lg={2} md={2} sm={4} xs={6}>
                          <Typography variant="h6" gutterBottom component="div">
                            Date
                          </Typography>
                        </Grid>
                        <Grid item lg={10} md={10} sm={8} xs={6}>
                          <Typography variant="h6" gutterBottom component="div">
                            {moment(upcomingSession?.class_date).format(
                              "MMM D YYYY"
                            )}
                          </Typography>
                        </Grid>
                      </Grid>
                      {/* <Grid container className="innertext">
                      <Grid item lg={2} md={2} sm={4} xs={6}>
                        <Typography variant="h6" gutterBottom component="div">
                          Time
                        </Typography>
                      </Grid>
                      <Grid item lg={10} md={10} sm={8} xs={6}>
                        <Typography variant="h6" gutterBottom component="div">
                        {hours + ' hour and ' + minutes +' minutes.'}
                        </Typography>
                      </Grid>
                    </Grid> */}
                    </Box>
                  </Box>
                ) : (
                  <div className="upcomingSession"> No Upcoming Session</div>
                )}
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default StudentDashboard;
