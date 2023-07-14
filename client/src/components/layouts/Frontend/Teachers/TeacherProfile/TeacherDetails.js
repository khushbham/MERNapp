import React, { useEffect, useState } from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import { FiCheckCircle } from "react-icons/fi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import Divider from "@mui/material/Divider";
import Grid from "@mui/material/Grid";
import Gallery from "./Gallery";
import TeacherContent from "./TeacherContent";
import { useDispatch } from "react-redux";
import {
  getDropdownValues,
  viewPublicProfile,
} from "../../../../../actions/frontent";
import TeacherClassTopics from "./TeacherClassTopics";
const TeacherDetails = () => {
  const dispatch = useDispatch();
  const [teacherDetails, setteacherDetails] = useState({});
  const [gender_identity, setgender_identity] = useState([]);
  const getTeacherProfile = () => {
    dispatch(viewPublicProfile()).then((res) => {
      setteacherDetails(res.data);
    });
  };

  useEffect(() => {
    getTeacherProfile();
    dispatch(getDropdownValues()).then((res) => {
      setgender_identity(
        res.data.filter((a) => {
          if (a.name == "gender") {
            return a;
          }
        })[0].options
      );
    });
  }, []);

  return (
    <div>
      <Container>
        <Typography variant="h3" component="h2" className="mt-2 mb-4">
          Teacher Profile
        </Typography>
        <div className="TeacherProfileDetails d-flex flex-wrap align-items-center">
          <Avatar alt="Remy Sharp" src={teacherDetails?.profile_image} />
          <div className="mx-2">
            <Typography variant="h5" component="h5">
              {" "}
              {teacherDetails?.first_name} {teacherDetails?.last_name}
            </Typography>
            <Typography variant="h6" component="h6" className="deatilsSubhead">
              {teacherDetails?.expertise} | {teacherDetails?.city},{" "}
              {teacherDetails?.state}
            </Typography>
          </div>
          <Link href="#" className="onlineClassesBtn">
            Online classes <FiCheckCircle />
          </Link>
        </div>
        <div className="TeacherPersonalDeatils">
          <nav aria-label="main mailbox folders">
            <List>
              <ListItem disablePadding>
                <Grid container>
                  <Grid item xs={6} lg={4}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="detailhead"
                    >
                      {" "}
                      Age{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} lg={4}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="detailList"
                    >
                      {" "}
                      {teacherDetails?.age}{" "}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider style={{ color: "#fff" }} />
              <ListItem disablePadding>
                <Grid container>
                  <Grid item xs={6} lg={4}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="detailhead"
                    >
                      {" "}
                      Gender{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} lg={4}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="detailList"
                    >
                      {" "}
                      {gender_identity?.filter((arr, i) => {
                        if (i == teacherDetails?.gender) return arr;
                      })}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider style={{ color: "#fff" }} />
              <ListItem disablePadding>
                <Grid container>
                  <Grid item xs={6} lg={4}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="detailhead"
                    >
                      {" "}
                      Language{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} lg={4}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="detailList"
                    >
                      {" "}
                      {teacherDetails?.language}{" "}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
              <Divider style={{ color: "#fff" }} />
              <ListItem disablePadding>
                <Grid container>
                  <Grid item xs={6} lg={4}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="detailhead"
                    >
                      {" "}
                      Timezone{" "}
                    </Typography>
                  </Grid>
                  <Grid item xs={6} lg={4}>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="detailList"
                    >
                      {" "}
                      GMT{" "}
                    </Typography>
                  </Grid>
                </Grid>
              </ListItem>
            </List>
          </nav>
        </div>
        <div className="AboutContentSec">
          <TeacherContent Content={teacherDetails?.about_expertise} />
          <TeacherClassTopics topics={teacherDetails?.planned_topics} />

          {teacherDetails?.intro_video ? (
            <div>
              <Gallery gallery={teacherDetails?.intro_video} />

              {/* <Grid className="contact-Btn" xs={12} md={8} lg={6}>
                <Link href="#" className="contactBtn">
                  Contact Teacher
                </Link>
              </Grid> */}
            </div>
          ) : (
            <span></span>
          )}
        </div>
      </Container>
    </div>
  );
};
export default TeacherDetails;
