import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Navbar from "../Navbar";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { Link, useHistory } from "react-router-dom";
import InputBase from "@mui/material/InputBase";
import moment from "moment";
import FormControl from "@mui/material/FormControl";
import { FiSearch } from "react-icons/fi";
import { styled, alpha } from "@mui/material/styles";
import {
  checkUserSwitchAccountStatus,
  getChatToken,
  getUpcomingSessionForTeacherDashboard,
  teacherDashboard,
  unreadNotificationsCount,
} from "../../../../actions/frontent";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import { VscFiles } from "react-icons/vsc";
import { FaGraduationCap, FaRegCalendarAlt } from "react-icons/fa";
import { ImProfile } from "react-icons/im";
import { BsCalendar2Check, BsGear } from "react-icons/bs";

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

const TeacherDashboard = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [dashboard, setDashboard] = useState();
  const [name, setname] = useState();
  const [count, setCount] = useState(0);
  const [upcomingSession, setupcommingSession] = useState([]);
  useEffect(() => {
    dispatch(checkUserSwitchAccountStatus())
      .then((res) => {
        if (res.data.teacherProfileCompleted == false) {
          history.push("/teacher/account-steps");
        }
      })
      .catch((err) => console.log(err, "err"));

    dispatch(getChatToken()).then((res) => {
      setname(res.data.user.first_name);
    });
    dispatch(teacherDashboard())
      .then((res) => {
        setDashboard(res.data);
      })
      .catch((err) => [console.log(err)]);
    dispatch(getUpcomingSessionForTeacherDashboard())
      .then((res) => {
        setupcommingSession(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dispatch(unreadNotificationsCount())
      .then((res) => {
        setCount(res.data);
      })
      .catch((err) => console.log("Get the error", err));
  }, []);

  const redirect = (value, class_id) => {
    history.push({
      pathname: `/teacher/session-details`,
      search: `id=${value}&class_id=${class_id}`,
      state: {
        id: value,
        class_id: class_id,
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
    <Box className="teacherDashboard test">
      <Navbar showNotificaiton={count} />
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
                        {dashboard?.studentsEnrolled}
                      </Typography>
                      <Typography
                        variant="h6"
                        gutterBottom
                        component="div"
                        className="overviewSubText"
                      >
                        Students enrolled
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
                       ${dashboard? dashboard.earning:(0)}
                      </Typography>
                      <Typography
                        variant="h6"
                        gutterBottom
                        component="div"
                        className="overviewSubText"
                      >
                        Class earnings
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
                      <Button
                        onClick={() =>
                          redirect(
                            upcomingSession?._id,
                            upcomingSession?.class_id
                          )
                        }
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
                            {hours + " hour and " + minutes + " minutes."}
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

          <Box className="main-icons-wrapper mt-5">
            <Grid container className="icons-area">
              <Grid item lg={4} md={4} sm={6} xs={6}>
              <Link to="/teacher/teacher-profile?show=classes"><Box className="three_box_areas">
                  <VscFiles />
                  <p>My classes</p>
                </Box></Link>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={6}>
              <Link to="/teacher/student"><Box className="three_box_areas">
                  <FaGraduationCap />
                  <p>My students</p>
                </Box></Link>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={6}>
              <Link to="/teacher/teacher-profile"><Box className="three_box_areas">
                  <ImProfile />
                  <p>My profile</p>
                </Box></Link>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={6}>
                <Link to="/teacher/calendar?show=availability"><Box className="three_box_areas">
                  <BsCalendar2Check />
                  <p>Manage availability</p>
                </Box></Link>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={6}>
              <Link to="/teacher/calendar"><Box className="three_box_areas">
                  <FaRegCalendarAlt />
                  <p>My calender</p>
                </Box></Link>
              </Grid>
              <Grid item lg={4} md={4} sm={6} xs={6}>
              <Link to="/teacher/teacher-profile"><Box className="three_box_areas">
                  <BsGear />
                  <p>Account Settings</p>
                </Box></Link>
              </Grid>
            </Grid>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default TeacherDashboard;
