import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import StudentNavbar from "../StudentNavbar";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Container from "@mui/material/Container";
import Modal from "@mui/material/Modal";
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
import { useHistory, useLocation } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  cancelSession,
  getDropdownValues,
  getSessionDetailForStudent,
  startSessionByStudent,
  updateClassSessionStatus,
  startSessionByTeacher
} from "../../../../../actions/frontent";
import { Button } from "@mui/material";
import SessionDetailsInProgress from "../../Students/StudentSessionProgess/SessionDetailsInProgress";
import VideoCall from "../../../../../VideoCall";
import GoogleMap from "../../GoogleMap";

const StudClassDetails = () => {
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    borderRadius: "15px",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const [singleSessiondetail, setsingleSessiondetail] = useState({});
  const [class_level, setclass_level] = useState([]);
  const [session_type, setsession_type] = useState([]);
  const [inCall, setInCall] = useState();
  const [token, settoken] = useState("");
  const [appId, setappId] = useState("");
  const [channelName, setchannelName] = useState("");
  const [open, setOpen] = React.useState(false);
  const [reason, setreason] = useState("");
  const [gmtTime, setGmtTime] = useState();
  const queryParams = new URLSearchParams(window.location.search);
  const [cancelAPIHit, setCancelAPIHit] = useState(false);
  const [triggerTime,setTriggerTime] = useState(0);
  const [startTime,setStartTime] = useState("00:01");
  const [triggerTimeCame, setTriggerTimeCame] = useState(false);
  var booking_id = queryParams.get("booking_id");

  useEffect(() => {
    dispatch(getSessionDetailForStudent(booking_id))
      .then((res) => {
        setTriggerTime(res.data.triggerTime);
        setStartTime(res.data.sessionData.start_time_of_class);
        setsingleSessiondetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

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
  }, [cancelAPIHit, triggerTimeCame]);

  // ✅ Format GMT time as hh:mm:ss
  function padTo2Digits(num) {
    return num.toString().padStart(2, "0");
  }

  function getGMTTime(date = new Date()) {
    var gmtTimeCalculated =
      padTo2Digits(date.getUTCHours()) +
      ":" +
      padTo2Digits(date.getUTCMinutes()) +
      ":" +
      padTo2Digits(date.getUTCSeconds());
    setGmtTime(gmtTimeCalculated);
    return gmtTimeCalculated;
  }
  useEffect(() => {
    const interval = setInterval(() => {
      var gmtTime = getGMTTime();
      var time = startTime.split(":");
      var start_time = time[0] * 60 + time[1] * 1;
      var now = gmtTime.split(":");
      var nowUpdated = now[0] * 60 + now[1] * 1;
      if(nowUpdated == start_time && !triggerTimeCame && triggerTime != 0){
        setTriggerTimeCame(true);
      }
    }, 1000);
    
    return () => clearInterval(interval);
  }, [triggerTime,startTime]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const oncancelSession = () => {
    const data = {
      booking_id: booking_id,
      reason: reason,
    };
    dispatch(cancelSession(data))
      .then((res) => {
        if (res.success) {
          setCancelAPIHit(!cancelAPIHit);
          handleClose();
        }
        console.log(res, "response");
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };
  const onSessionLabelClicked = (e) => {
    if (singleSessiondetail?.hitApiOf === 2) {
      history.push({
        pathname: "/students/end-session-rating",
        search: `teacherId=${singleSessiondetail?.teacherProfile._id}&class_id=${singleSessiondetail?.classData._id}&session_id=${singleSessiondetail?.sessionData._id}&booking_id=${booking_id}`,
        state: {
          teacherId: singleSessiondetail?.teacherProfile._id,
          class_id: singleSessiondetail?.classData._id,
          session_id: singleSessiondetail?.sessionData._id,
          booking_id: booking_id,
        },
      });
    } else {
      // const data = {
      //   session_progress_status: e,
      // };
      // dispatch(
      //   updateClassSessionStatus(data, singleSessiondetail?.sessionData.session_id)
      // )
      //   .then((res) => {
      //     if (res && res.success == true) {
            const data = {
              booking_id: booking_id,
              session_id:singleSessiondetail?.sessionData.session_id
            };
            dispatch(startSessionByStudent(data))
              .then((res) => {
                //console.log(res.data.app_id, "response");
                if(res && res.success){
                  settoken(res.data.agora_token);
                  setappId(res.data.app_id);
                  setchannelName(res.data.channel_name);
                }
                
                // history.push({
                //   pathname:"/students/start-video-class",
                //   state:{
                //     token:res.data.agora_token,
                //     appId:res.data.app_id,
                //     channelName:res.data.channel_name
                //   }
                //})
                if (singleSessiondetail?.classData?.session_type == 1) {
                  setInCall(2);
                } else {
                  setInCall(1);
                }
              })
              .catch((err) => {
                console.log(err);
              });
        //   }
        // })
        // .catch((err) => console.log(err));
    }
  };
  return (
    <div className="App-wrap" style={{ height: "100%" }}>
      {inCall === 1 ? (
        <VideoCall
          setInCall={setInCall}
          token={token}
          appId={appId}
          channelName={channelName}
        />
      ) : inCall === 2 ? (
        <SessionDetailsInProgress
          singleSessiondetail={singleSessiondetail}
          setInCall={setInCall}
          teacherId={singleSessiondetail?.teacherProfile._id}
          class_id={singleSessiondetail?.classData._id}
          session_id={singleSessiondetail?.sessionData._id}
          booking_id={booking_id}
        />
      ) : (
        <Box>
          <StudentNavbar />
          <Box className="SessionInnerDetails my-3 p-4">
            <Container>
              <Box className="contentSec">
                <Typography
                  variant="h3"
                  gutterBottom
                  component="div"
                  className="classesHeading mb-3"
                >
                  {singleSessiondetail?.classData?.discipline}
                </Typography>
                <Typography
                  variant="body1"
                  gutterBottom
                  className="descSubHead"
                >
                  {singleSessiondetail?.classData?.class_description}
                </Typography>
                <Box className="Teacher-Profile d-flex align-items-center">
                  <Avatar
                    alt="teacher Profile"
                    src={singleSessiondetail?.teacherProfile?.profile_image}
                    className="me-2"
                  />
                  <Typography
                    variant="body1"
                    gutterBottom
                    className="descSubHead"
                  >
                    {" "}
                    By {singleSessiondetail?.teacherProfile?.first_name}{" "}
                    {singleSessiondetail?.teacherProfile?.last_name}{" "}
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
                                    <ListItemText
                                      primary={
                                        singleSessiondetail?.classData
                                          ?.language_of_class
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
                      <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        xs={12}
                        className="text-center startsessionBtn"
                      >
                        GMT Time - {gmtTime}
                      </Grid>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
              <Grid container spacing={3}>
                {singleSessiondetail?.classData?.session_type == 1 ? (
                  <Grid item lg={8} md={8} sm={12} xs={12}>
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
                      <Grid container>
                        <Grid item lg={5} md={5} sm={12} xs={12}>
                          <Typography
                            variant="h5"
                            gutterBottom
                            component="div"
                            className="mt-4"
                          >
                            {" "}
                            {
                              singleSessiondetail?.classData
                                ?.address_or_class_link
                            }{" "}
                          </Typography>
                        </Grid>
                        <Grid item lg={7} md={7} sm={12} xs={12}>
                          {singleSessiondetail?.classData?.location ? (
                            <GoogleMap
                              longitude={
                                singleSessiondetail?.classData?.location
                                  ?.coordinates[0]
                              }
                              latitude={
                                singleSessiondetail?.classData?.location
                                  ?.coordinates[1]
                              }
                            />
                          ) : (
                            <iframe
                              src="//maps.google.com/maps?q=53.3381768,-6.2613077&z=15&output=embed"
                              width="100%"
                              height="250"
                            ></iframe>
                          )}

                          {/* <iframe src="//maps.google.com/maps?q=53.3381768,-6.2613077&z=15&output=embed" width="100%" height="250"></iframe> */}
                        </Grid>
                      </Grid>
                    </Box>
                  </Grid>
                ) : (
                  ""
                )}
                <Grid item lg={4} md={4} sm={12} xs={12}>
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
                              pathname: "/student/chats",
                              search: `channelName=${singleSessiondetail?.classData?.class_title}`,
                            })
                          }
                        >
                          {singleSessiondetail?.classData?.class_title}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {" "}
                          Click here to open chat.
                        </Typography>
                        {/* <Typography variant="body2" gutterBottom align="right">
                          {
                            singleSessiondetail?.sessionData
                              ?.start_time_of_class
                          }{" "}
                        </Typography> */}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
              <Grid container className="my-4 pb-4">
                <Grid item lg={8} md={8} sm={12} xs={12} className="m-auto">
                  <Grid container spacing={2} className="mt-4">
                    {singleSessiondetail?.showCancelClassButton && (
                      //singleSessiondetail?.sessionData.class_session_date != "" &&
                      <Grid item lg={6} md={6} sm={6} xs={12}>
                        <Button
                          className="sessionCancelbtn"
                          // disabled={
                          //   singleSessiondetail?.hitApiOf === 0 ? true : false
                          // }
                          onClick={() => handleOpen()}
                        >
                          Cancel Session
                        </Button>
                      </Grid>
                    )}
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                      <Button
                        className="startsessionBtn"
                        disabled={
                          singleSessiondetail?.hitApiOf === 0 ? true : false
                        }
                        onClick={() =>
                          onSessionLabelClicked(singleSessiondetail?.hitApiOf)
                        }
                      >
                        {singleSessiondetail?.sessionLable}
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
              {/* <Grid container className="my-4 pb-4">
            <Grid item lg={8} md={8} sm={12} xs={12} className="m-auto">
              <Grid container spacing={2} className="mt-4">
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Link to="/" className="sessionCancelbtn">
                    Cancel Session
                  </Link>
                </Grid>
                <Grid item lg={6} md={6} sm={6} xs={12}>
                  <Link to="/" className="sessionBtn">
                    Start Session
                  </Link>
                </Grid>
              </Grid>
            </Grid>
          </Grid> */}
            </Container>
          </Box>
          <Modal
            open={open}
            onClose={handleClose}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style, width: 600 }}>
              <h2 className="parent-modal-title cancel_title">
                Reason For Cancel Session
              </h2>
              <div className="parent-modal-container">
                <input
                  type="textarea"
                  className="parent-modal-description nobrdr_inpt_cancel"
                  name="reason"
                  onChange={(e) => setreason(e.target.value)}
                  placeholder="Reason"
                />
                <button
                  className="modal-button"
                  onClick={() => oncancelSession()}
                >
                  Submit
                </button>
              </div>
            </Box>
          </Modal>
        </Box>
      )}
    </div>
  );
};

export default StudClassDetails;
