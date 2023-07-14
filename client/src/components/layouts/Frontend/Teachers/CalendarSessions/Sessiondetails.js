import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Modal from "@mui/material/Modal";
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
import { Button } from "@mui/material";
import VideoCall from "../../../../../VideoCall";
import Navbar from "../../Navbar";
import moment from "moment";
import SessionDetailsInProgress from "../TeacherSessionProgess/SessionDetailsInProgress";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  cancelSessionByTeaher,
  endSessionByTeacher,
  getDropdownValues,
  getSingleSessionDetail,
  updateClassSessionStatus,
  startSessionByTeacher,
} from "../../../../../actions/frontent";
import GoogleMap from "../../GoogleMap";

function Sessiondetails() {
  const [inCall, setInCall] = useState();
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
  const history = useHistory();
  const dispatch = useDispatch();
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("id");
  const class_id = queryParams.get("class_id");
  //const booking_id = queryParams.get("booking_id");

  const [class_level, setclass_level] = useState([]);
  const [session_type, setsession_type] = useState([]);
  //const [inCall, setInCall] = useState(0);
  const [token, settoken] = useState("");
  const [appId, setappId] = useState("");
  const [channelName, setchannelName] = useState("");
  const [sessionDetail, setsessionDetail] = useState();
  const [open, setOpen] = React.useState(false);
  const [reason, setreason] = useState("");
  const [gmtTime, setGmtTime] = useState();
  const [cancelAPIHit, setCancelAPIHit] = useState(false);
  const [triggerTime, setTriggerTime] = useState(0);
  const [startTime, setStartTime] = useState("00:01");
  const [triggerTimeCame, setTriggerTimeCame] = useState(false);
  const getDropdown = () => {
    dispatch(getDropdownValues()).then((res) => {
      console.log(res);
      if (res && res.success) {
        setclass_level(
          res.data?.filter((a) => {
            if (a.name == "class_level") {
              return a;
            }
          })[0].options
        );
        setsession_type(
          res.data?.filter((a) => {
            if (a.name == "session_type") {
              return a;
            }
          })[0].options
        );
      }
    });
  };

  useEffect(() => {
    getDropdown();
  }, []);
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
      if (nowUpdated == start_time && !triggerTimeCame && triggerTime != 0) {
        setTriggerTimeCame(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [triggerTime, startTime]);
  const handleOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const cancelSession = () => {
    const data = {
      session_id: sessionDetail?.sessionData._id,
      reason: reason,
    };
    dispatch(cancelSessionByTeaher(data))
      .then((res) => {
        console.log(res);
        if (res && res.success) {
          setCancelAPIHit(!cancelAPIHit);

          handleClose();
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };

  useEffect(() => {
    dispatch(getSingleSessionDetail(id, class_id))
      .then((res) => {
        if (res && res.success) {
          setTriggerTime(res.data.triggerTime);
          setStartTime(res.data.sessionData.start_time_of_class);
          setsessionDetail(res.data);
        }
        // console.log(res , "response")
      })
      .catch((err) => {
        console.log(err, "error");
      });
  }, [cancelAPIHit, triggerTimeCame]);

  const onClickSessionHandler = async (e) => {
    if (sessionDetail?.hitApiOf === 2) {
      // window.location=`/students/end-session-rating?teacherId=${sessionDetail?.teacherProfile._id}&class_id=${sessionDetail?.classData._id}&session_id=${sessionDetail?.sessionData._id}`
      const data = {
        session_id: sessionDetail?.sessionData._id,
      };
      dispatch(endSessionByTeacher(data)).then((res) => {
        history.push({
          pathname: "/teacher/end-session-rating",
          search: `teacherId=${sessionDetail?.teacherProfile._id}&class_id=${sessionDetail?.classData._id}&session_id=${sessionDetail?.sessionData._id}`,
          state: {
            booked_by: res.data,
          },
        });
      });
    } else {
      // const data = {
      //   session_progress_status: e,
      // };
      // dispatch(updateClassSessionStatus(data, id))
      //   .then((res) => {
      //     if (res && res.success) {
      const data = {
        session_id: id,
      };
      dispatch(startSessionByTeacher(data))
        .then((res) => {
          if (res && res.success) {
            settoken(res.data.agora_token);
            setappId(res.data.app_id);
            setchannelName(res.data.channel_name);
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
          setInCall={setInCall}
          singleSessiondetail={sessionDetail}
        />
      ) : (
        <Box className="SessionInnerDetails mt-3">
          <Navbar />
          <Container>
            <Typography
              variant="h4"
              gutterBottom
              component="div"
              className="mt-4"
            >
              Session Details
            </Typography>
            <Box className="contentSec">
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="classes mt-4"
              >
                {sessionDetail?.classData?.discipline}
              </Typography>
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="classesHeading mb-3"
              >
                {sessionDetail?.classData?.class_subtitle}
              </Typography>
              <Typography variant="body1" gutterBottom className="descSubHead">
                {sessionDetail?.classData?.class_description}
              </Typography>
              <Box className="Teacher-Profile d-flex align-items-center">
                <Avatar
                  alt="teacher Profile"
                  src={sessionDetail?.teacherProfile?.profile_image}
                  className="me-2"
                />
                <Typography
                  variant="body1"
                  gutterBottom
                  className="descSubHead"
                >
                  {" "}
                  By {sessionDetail?.teacherProfile?.first_name}{" "}
                  {sessionDetail?.teacherProfile?.last_name}{" "}
                  {/* <Link href="#" className="ContactLink mb-0">
                  {" "} {sessionDetail?.teacherProfile.phone}
                </Link>{" "} */}
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
                                  {moment(
                                    sessionDetail?.sessionData?.class_date
                                  ).format("MMM D YYYY")}
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
                                    sessionDetail?.sessionData
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
                                    sessionDetail?.sessionData
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
                                      })[sessionDetail?.classData?.class_level]
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
                                      sessionDetail?.classData
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
                                      session_type?.filter((a) => {
                                        return a;
                                      })[sessionDetail?.classData?.session_type]
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
              {sessionDetail?.classData?.session_type == 1 ? (
                <Grid item lg={12} md={12} sm={12} xs={12}>
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
                          {sessionDetail?.classData?.address_or_class_link}{" "}
                        </Typography>
                      </Grid>
                      <Grid item lg={7} md={7} sm={12} xs={12}>
                        {sessionDetail?.classData?.location ? (
                          <GoogleMap
                            longitude={
                              sessionDetail?.classData?.location?.coordinates[0]
                            }
                            latitude={
                              sessionDetail?.classData?.location?.coordinates[1]
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
              {sessionDetail?.classData?.enrolled_students != 0 && (
                <Grid item lg={12} md={12} sm={12} xs={12}>
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
                            src={sessionDetail?.classData?.cover_image}
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
                              pathname: "/teacher/chat",
                              search: `channelName=${sessionDetail?.classData?.class_title}`,
                            })
                          }
                        >
                          {sessionDetail?.classData?.class_title}
                        </Typography>
                        <Typography variant="body2" gutterBottom>
                          {" "}
                          Click here to open chat.
                        </Typography>
                        {/* <Typography variant="body2" gutterBottom align="right">
                          {sessionDetail?.sessionData?.start_time_of_class}{" "}
                        </Typography> */}
                      </Box>
                    </Box>
                  </Box>
                </Grid>
              )}
            </Grid>
            <Grid container className="mt-4 pb-4">
              <Grid item lg={12} md={12} sm={12} xs={12} className="m-autoo">
                <Grid container spacing={2} className="mt-4">
                  {sessionDetail?.showCancelClassButton && (
                    <Grid item lg={6} md={6} sm={6} xs={12}>
                      <Button
                        className="sessionCancelbtn sessn_button"
                        //onClick={()=>onClick(2)}
                        onClick={handleOpen}
                        // disabled={
                        //   sessionDetail?.hitApiOf === 0
                        //     ? true
                        //     : false
                        // }
                      >
                        Cancel Session
                      </Button>
                    </Grid>
                  )}
                  <Grid item lg={6} md={6} sm={6} xs={12}>
                    <Button
                      className="sessionBtn sessn_button"
                      disabled={sessionDetail?.hitApiOf === 0 ? true : false}
                      onClick={() =>
                        onClickSessionHandler(sessionDetail?.hitApiOf)
                      }
                    >
                      {sessionDetail?.sessionLable
                        ? sessionDetail?.sessionLable
                        : "Offline Class"}
                    </Button>
                  </Grid>
                </Grid>
              </Grid>
            </Grid>
          </Container>
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
                  className="modal-button cancel_modal_button"
                  onClick={() => cancelSession()}
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
}

export default Sessiondetails;
