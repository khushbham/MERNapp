import React, { useState, useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import { Paper } from "@mui/material";
import { Divider } from "@mui/material";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Payments from "./Payments";
import Payouts from "./Payouts";
import { FormControl, Typography } from "@mui/material";
import "../../../../css/admin/sessions.css";
import { Link } from "@mui/material";
import Footer from "../Footer";
import { getSingleSessionDetail } from "../../../../actions/sessions";
import { useDispatch, useSelector } from "react-redux";
import { useParams } from "react-router-dom";
import Chatbox from "./ChatBox";
import Loader from "../../../Loader";
import Reports from "./Report";
import TeacherPayouts from "../user-management/TeacherPayouts"
const SessionsContent = () => {
  const dispatch = useDispatch();
  const { id } = useParams();
  const [apiHit, setApiHit] = useState(false);
  const [progressLabel, setProgressLabel] = useState("-");
  const [sessionDetail, setSessionDetail] = useState(false);
  const [chatData, setChatData] = useState({
    channel_id: "",
    chatToken: "",
    user_id: "",
  });

  useEffect(() => {
    setApiHit(false);
    dispatch(getSingleSessionDetail(id)).then((res) => {
      console.log(res);
      if (res && res.success) {
        setChatData(res.data.chat);
        setSessionDetail(res.data.sessionDetail);
        setProgressLabel(res.data.sessionLable);
        setApiHit(true);
      }
    });
  }, []);
  function tConvert(time) {
    // Check correct time format and split into components
    time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];

    if (time.length > 1) {
      // If time format correct
      time = time.slice(1); // Remove full string match value
      time[5] = +time[0] < 12 ? " AM" : " PM"; // Set AM/PM
      time[0] = +time[0] % 12 || 12; // Adjust hours
    }
    return time.join(""); // return adjusted time or original string
  }
  return sessionDetail && apiHit ? (
    <>
      <section className="session-details-content">
        <Grid container className="p-3 main-head-dashboard">
          <Grid item xs={12} md={8} xl={8} lg={8}>
            <Typography variant="h5">Session details</Typography>
          </Grid>
          <Grid item xs={12} md={4} xl={4} lg={4}>
            <Typography align="right" variant="body1">
              Sessions List /{" "}
              <span>
                <Link
                  className="name-session"
                  color="secondary"
                  href="/session-details"
                >
                  Session Details
                </Link>
              </span>
            </Typography>
          </Grid>
        </Grid>

        <Grid container className="p-3" spacing={2}>
          <Grid item xs={12} md={8} xl={8} lg={8}>
            <Paper className="p-3">
              <div className="main-details-head">
                <Typography variant="h5">Overview</Typography>
                <Divider className="mt-2 mb-2" />
              </div>
              <Box>
                <Grid container>
                  <Grid item xs={12} md={4} xl={4} lg={4}>
                    <Typography variant="h6">Teacher</Typography>
                    <List sx={{ width: "100%" }} className="avt-list">
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          {sessionDetail.users.profile_image &&
                          sessionDetail.users.profile_image != "" ? (
                            <Avatar
                              alt="Remy Sharp"
                              src={sessionDetail.users.profile_image}
                            />
                          ) : (
                            <Avatar
                              alt="Remy Sharp"
                              src="../../../../images/dash-image.png"
                            />
                          )}
                        </ListItemAvatar>
                        <ListItemText>
                          <Typography variant="h5">
                            {sessionDetail.users.first_name}{" "}
                            {sessionDetail.users.last_name}
                          </Typography>
                          <Typography
                            variant="fntEleven"
                            className="profession"
                          >
                            {sessionDetail.users.expertise}{" "}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Grid>
                  {console.log(sessionDetail)}

                  <Grid item xs={12} md={4} xl={4} lg={4}>
                    <Typography variant="h6">Date & Time</Typography>
                    <Typography variant="h5">
                      {sessionDetail.class_session_date.split("T")[0]}
                      {/* Monday, November 16, 2021 */}
                    </Typography>
                    <Typography
                      variant="fntThirteen"
                      color="secondary"
                      className="time-txt"
                    >
                      {tConvert(sessionDetail.start_time_of_class)} -{" "}
                      {tConvert(sessionDetail.end_time_of_class)}
                    </Typography>
                  </Grid>
                  <Grid item xs={12} md={4} xl={4} lg={4}>
                    <Typography variant="h6">Class</Typography>
                    <Typography variant="h5">
                      {sessionDetail.classes.class_title}
                    </Typography>
                    <Typography
                      variant="fntThirteen"
                      color="secondary"
                      className="Intermedia"
                    >
                      {/* 1 => "Beginner", 2 => "Intermediate", 3 => "Advanced" */}
                      $ {sessionDetail.classes.price}.{" "}
                      {sessionDetail.classes.class_level == 1 && "Beginner"}
                      {sessionDetail.classes.class_level == 2 && "Intermediate"}
                      {sessionDetail.classes.class_level == 3 && "Advanced"},{" "}
                      {/* // 1 => on demand, 2 => single class, 3 => course */}
                      {sessionDetail.classes.type_of_class == 1 && "On Demand"}
                      {sessionDetail.classes.type_of_class == 2 && "1:1"}
                      {sessionDetail.classes.type_of_class == 3 && "Course"}

                      ,,{" "}{sessionDetail.classes.session_type ==  1 && sessionDetail.classes.address_or_class_link}
                      {sessionDetail.classes.session_type ==  2 && "Online Mode"}
                    </Typography>
                    <Typography variant="h6" className="mt-3">
                      Session Status
                    </Typography>
                    <Typography variant="h5" className="completed-txt mt-2">
                      {progressLabel}
                    </Typography>
                  </Grid>
                </Grid>
              </Box>
              {/* <Box>
                <Grid container>
                  <Grid item xs={12} md={4} xl={4} lg={4}>
                    <Typography variant="h6">Student (s) </Typography>
                    <List sx={{ width: "100%" }} className="avt-list">
                      <ListItem alignItems="flex-start">
                        <ListItemAvatar>
                          <Avatar
                            alt="Remy Sharp"
                            src="../../../../images/dash-image.png"
                          />
                        </ListItemAvatar>
                        <ListItemText>
                          <Typography variant="h5">Dana Smith</Typography>
                          <Typography
                            variant="fntEleven"
                            className="stud-email"
                          >
                            email@serveraddress.com{" "}
                          </Typography>
                        </ListItemText>
                      </ListItem>
                    </List>
                  </Grid>
                  <Grid item xs={12} md={4} xl={4} lg={4}></Grid>
                  <Grid item xs={12} md={4} xl={4} lg={4}></Grid>
                </Grid>
              </Box> */}
              <Box className="mt-5">
                <Typography variant="h5">Payments</Typography>
                <Payments class_id={sessionDetail.classes._id} />
              </Box>
              <Box className="mt-3">
                <Typography variant="h5">Payouts</Typography>
                <TeacherPayouts user_id={sessionDetail?.users?._id} session_id={id}/>
              </Box>
              <Box className="mt-3">
                <Typography variant="h5">Reports</Typography>
                <Reports reports={sessionDetail?.report_classes} />
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={4} xl={4} lg={4}>
            <Paper className="p-3">
              <div className="main-details-head">
                <Typography variant="h5">Chat Activity</Typography>
                <Divider className="mt-2 mb-2" />
              </div>

              <div className="chat-section">
                {apiHit && chatData.channel_id != "" ? (
                  <Chatbox chatData={chatData} />
                ) : (
                  <div
                    style={{
                      alignItems: "center",
                      textAlign: "center",
                      padding: "10px",
                      background: "#e1e3e7",
                    }}
                  >
                    There is no chat activity yet.
                  </div>
                )}
              </div>
            </Paper>
          </Grid>
        </Grid>
      </section>
      <Footer />
    </>
  ) : !apiHit && !sessionDetail ? (
    <Loader />
  ) : (
    <section className="session-details-content">
      <Grid container className="p-3 main-head-dashboard">
        <Box className="w-100 alert alert-danger">Something went wrong.</Box>
      </Grid>
    </section>
  );
};

export default SessionsContent;
