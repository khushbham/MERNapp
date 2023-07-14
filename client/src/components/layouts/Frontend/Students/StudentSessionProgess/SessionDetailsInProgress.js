import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StudentNavbar from "../StudentNavbar";
import Avatar from "@mui/material/Avatar";
//import { useHistory } from 'react-router-dom';
import Container from "@mui/material/Container";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { BiBarChartSquare } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { BsGlobe } from "react-icons/bs";
import AvatarGroup from "@mui/material/AvatarGroup";
//import { useDispatch } from "react-redux";
import {
  endSessionByStudent,
  getDropdownValues,
} from "../../../../../actions/frontent";
import { Button, Link } from "@mui/material";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import GoogleMap from "../../GoogleMap";
const SessionDetailsInProgress = (props) => {
  const {
    singleSessiondetail,
    setInCall,
    teacherId,
    class_id,
    session_id,
    booking_id,
  } = props;
  const history = useHistory();
  const [class_level, setclass_level] = useState([]);
  const [session_type, setsession_type] = useState([]);
  const dispatch = useDispatch();
  useEffect(() => {
    dispatch(getDropdownValues()).then((res) => {
      setclass_level(
        res.data.filter((a) => {
          if (a.name == "class_level") {
            return a;
          }
        })[0].options
      );
      setsession_type(
        res.data.filter((a) => {
          if (a.name == "session_type") {
            return a;
          }
        })[0].options
      );
    });
  }, []);

  const EndSession = () => {
    const data = {
      booking_id: booking_id,
    };
    dispatch(endSessionByStudent(data)).then((res) => {
      history.push({
        pathname: "/students/end-session-rating",
        search: `teacherId=${singleSessiondetail?.teacherProfile._id}&class_id=${singleSessiondetail?.classData._id}&session_id=${singleSessiondetail?.sessionData.session_id}&booking_id=${booking_id}`,
        state: {
          teacherId: singleSessiondetail?.teacherProfile._id,
          class_id: singleSessiondetail?.classData._id,
          session_id: singleSessiondetail?.sessionData.session_id,
          booking_id: booking_id,
        },
      });
    });
  };

  return (
    <Box className="CalendarSessionDetails">
      <StudentNavbar />
      <Box className="SessionInnerDetails">
        <Box className="sessionOuter py-5">
          <Container>
            <Typography
              variant="h4"
              gutterBottom
              component="div"
              className="mt-4 sessionContent"
            >
              This class is in session.
            </Typography>
            <Box className="d-flex justify-content-end ">
              {singleSessiondetail?.classData?.session_type == 2 ? (
                <>
                  <Button className="SessionLinkss mx-2" onClick={()=>setInCall(1)}> Restart Session</Button>
                </>
              ) : (
                ""
              )}

              <Button
                className="SessionLinkss mx-2"
                onClick={() => EndSession()}
              >
                {" "}
                End Session
              </Button>
            </Box>
          </Container>
        </Box>
        <Container>
          <Box className="contentSec">
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="classes mt-4"
            >
              {singleSessiondetail?.classData?.discipline}
            </Typography>
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="classesHeading mb-3"
            >
              {singleSessiondetail?.classData?.class_description}
            </Typography>
            <Typography variant="body1" gutterBottom className="descSubHead">
              {singleSessiondetail?.classData?.class_description}
            </Typography>
            <Box className="Teacher-Profile d-flex align-items-center">
              <Avatar
                alt="teacher Profile"
                src={singleSessiondetail?.teacherProfile?.profile_image}
                className="me-2"
              />
              <Typography variant="body1" gutterBottom className="descSubHead">
                {" "}
                By {singleSessiondetail?.teacherProfile?.first_name}{" "}
                {singleSessiondetail?.teacherProfile?.last_name}{" "}
                <Link href="#" className="ContactLink mb-0">
                  contact{" "}
                </Link>{" "}
              </Typography>
            </Box>
          </Box>

          <Box className="SessionDescription my-4">
            <Grid container>
              <Grid item lg={11} md={11} sm={11} xs={12} className="m-auto">
                <Grid container>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Grid container spacing={5}>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <nav
                          aria-label="main mailbox folders"
                          className="infolist"
                        >
                          <List>
                            <ListItem className="d-flex justify-content-between">
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                Date
                              </Typography>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                {new Date(
                                  singleSessiondetail?.sessionData?.class_date
                                ).toLocaleDateString("en-us", {
                                  weekday: "long",
                                  year: "numeric",
                                  month: "short",
                                  day: "numeric",
                                })}
                              </Typography>
                            </ListItem>
                            <Divider />
                            <ListItem className="d-flex justify-content-between">
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                From
                              </Typography>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                {
                                  singleSessiondetail?.sessionData
                                    ?.start_time_of_class
                                }
                              </Typography>
                            </ListItem>
                            <Divider />
                            <ListItem className="d-flex justify-content-between">
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                To
                              </Typography>
                              <Typography
                                variant="h6"
                                gutterBottom
                                component="div"
                              >
                                {
                                  singleSessiondetail?.sessionData
                                    ?.end_time_of_class
                                }
                              </Typography>
                            </ListItem>
                          </List>
                        </nav>
                      </Grid>
                      <Grid item lg={6} md={6} sm={12} xs={12}>
                        <nav
                          aria-label="main mailbox folders"
                          className="infolist"
                        >
                          <List>
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon
                                  className="listIcons"
                                  style={{ minWidth: "33px" }}
                                >
                                  <BiBarChartSquare />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    class_level.filter((a) => {
                                      return a;
                                    })[
                                      singleSessiondetail?.classData
                                        ?.class_level
                                    ]
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon
                                  className="listIcons"
                                  style={{ minWidth: "33px" }}
                                >
                                  <BsGlobe />
                                </ListItemIcon>
                                <ListItemText primary="English" />
                              </ListItemButton>
                            </ListItem>
                            <Divider />
                            <ListItem disablePadding>
                              <ListItemButton>
                                <ListItemIcon
                                  className="listIcons"
                                  style={{ minWidth: "33px" }}
                                >
                                  <RiGroupLine />
                                </ListItemIcon>
                                <ListItemText
                                  primary={
                                    session_type.filter((a) => {
                                      return a;
                                    })[
                                      singleSessiondetail?.classData
                                        ?.session_type
                                    ]
                                  }
                                />
                              </ListItemButton>
                            </ListItem>
                          </List>
                        </nav>
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Box>
          <Grid container spcaing={4}>
          {singleSessiondetail?.classData?.session_type == 1 && (

            <Grid item lg={6} md={6} sm={12} xs={12}>
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="mt-4"
              >
                {" "}
                Location
              </Typography>
              <Box className="Location mapOuter">
                <Typography
                  variant="h5"
                  gutterBottom
                  component="div"
                  className="mt-4 mb-3"
                >
                  {" "}
                  {singleSessiondetail?.classData?.address_or_class_link}{" "}
                </Typography>
                {singleSessiondetail?.classData?.location ? (
                  <GoogleMap
                    longitude={
                      singleSessiondetail?.classData?.location?.coordinates[0]
                    }
                    latitude={
                      singleSessiondetail?.classData?.location?.coordinates[1]
                    }
                  />
                ) : (
                  <iframe
                    src="//maps.google.com/maps?q=53.3381768,-6.2613077&z=15&output=embed"
                    width="100%"
                    height="250"
                  ></iframe>
                )}
                {/* <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3314.277239053006!2d-117.57614098504361!3d33.83096028066681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcc797fe1a89e5%3A0x20c6c416f07722b1!2s3824%20S%20Main%20St%2C%20Corona%2C%20CA%2092882%2C%20USA!5e0!3m2!1sen!2shk!4v1648538080916!5m2!1sen!2shk" width="100%" height="250" ></iframe> */}
              </Box>
            </Grid>
          )}
            <Grid item lg={6} md={6} sm={12} xs={12} className="ms-auto">
              <Box className="groupChat">
                <Typography
                  variant="h3"
                  gutterBottom
                  component="div"
                  className="mt-4"
                >
                  {" "}
                  Group chat
                </Typography>
                <Box className="chatBoxx d-flex align-items-center">
                  <Box>
                    <AvatarGroup max={4} className="profileImages">
                      <Avatar
                        alt="Remy Sharp"
                        src={singleSessiondetail?.classData?.cover_image}
                      />
                      {/* <Avatar alt="Travis Howard" src="../images/teacher.jpg" />
                      <Avatar alt="Cindy Baker" src="../images/teacher.jpg" /> */}
                    </AvatarGroup>
                  </Box>
                  <Box className="ms-3">
                    <Typography
                      variant="h4"
                      gutterBottom
                      component="div"
                      className="mt-2 custt-namme"
                      onClick={() =>
                        history.push({
                          pathname: "/teacher/chat",
                          search: `channelName=${singleSessiondetail?.classData?.class_title}`,
                        })
                      }
                    >
                      {singleSessiondetail?.classData?.class_title}
                    </Typography>
                    <Typography variant="body2" gutterBottom>
                      {" "}
                      Check here to chat.
                    </Typography>
                    <Typography variant="body2" gutterBottom align="right">
                      {singleSessiondetail?.sessionData.start_time_of_class}{" "}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            </Grid>
          </Grid>
          <Grid container className="mt-4 pb-4">
            <Grid item lg={8} md={8} sm={12} xs={12} className="m-auto">
              <Grid container spacing={2} className="mt-4">
                {/* <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Link to="/" className="sessionCancelbtn">
                    Cancel Session
                  </Link>
                </Grid> */}
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Button className="sessionBtn" onClick={() => EndSession()}>
                    End Session
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default SessionDetailsInProgress;
