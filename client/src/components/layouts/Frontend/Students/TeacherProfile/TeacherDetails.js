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
  getTeacherPublicProfileForStudent,
  contactATeacher,
  checkContactExistsWithTeacher,
} from "../../../../../actions/frontent";
import TeacherClassTopics from "../../Teachers/TeacherProfile/TeacherClassTopics";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import { styled } from "@mui/material/styles";
import Button from "@mui/material/Button";
import IconButton from "@mui/material/IconButton";
import PropTypes from "prop-types";
import { IoMdClose } from "react-icons/io";
import { MdWavingHand } from "react-icons/md";
import { useHistory } from "react-router-dom";

const StudentTeacherDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

function StudentTeacherTitle(props) {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoMdClose />
        </IconButton>
      ) : null}
    </DialogTitle>
  );
}

StudentTeacherTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const TeacherDetails = ({ Id, setwishlist }) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [chatAlreadyExists, setChatAlreadyExists] = useState(false);
  const [teacherDetails, setteacherDetails] = useState({});
  const getTeacherProfile = () => {
    dispatch(getTeacherPublicProfileForStudent(Id)).then((res) => {
      setteacherDetails(res.data);
      setwishlist(res.data.isInWishlist);
    });
  };
  useEffect(() => {
    getTeacherProfile();
    dispatch(checkContactExistsWithTeacher(Id)).then((res) => {
      if (res && res.success) {
        setChatAlreadyExists(true);
      }
    });
  }, []);
  const createChannel = () => {
    var formData = {};
    formData.teacher_id = Id;
    dispatch(contactATeacher(formData)).then((res) => {
      if (res && res.success) {
        //console.log(res.data._id)
        // history.push({
        //     pathname: '/student/chats',
        //     search:  `channel_id=${res.data._id}`
        // })
        window.location = `/student/chats?channel_id=${res.data._id}`;
      }
    });
  };

  const [open, setOpen] = React.useState(false);

  const studentteacherhandleClickOpen = () => {
    setOpen(true);
  };
  const studentteacherhandleClose = () => {
    setOpen(false);
  };

  return (
    <div>
      <Container>
        <Typography variant="h3" component="h2" className="mt-2 mb-4">
          Teacher Profile
        </Typography>
        <div className="TeacherProfileDetails d-flex flex-wrap align-items-center">
          <Avatar alt="Remy Sharp" src={teacherDetails.profile_image} />
          <div className="mx-2">
            <Typography variant="h5" component="h5">
              {" "}
              {teacherDetails.user_name}
            </Typography>
            <Typography variant="h6" component="h6" className="deatilsSubhead">
              {teacherDetails.expertise} | {teacherDetails.city},{" "}
              {teacherDetails.state}
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
                      {teacherDetails.age}{" "}
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
                      {teacherDetails.gender}{" "}
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
                      {teacherDetails.language}{" "}
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
          <TeacherContent Content={teacherDetails.about_me} />
          <TeacherClassTopics topics={teacherDetails.planned_topics} />
          {teacherDetails.intro_video ? (
            <Gallery gallery={teacherDetails.intro_video} />
          ) : (
            ""
          )}
          <Grid className="contact-Btn" xs={12} md={8} lg={6}>
            {/* <Link href="#" className="contactBtn">Contact Teacher</Link> */}

            <Button
              variant="contained"
              className="student-teacher-chat-button"
              onClick={studentteacherhandleClickOpen}
            >
              Contact Teacher
            </Button>
          </Grid>

          <StudentTeacherDialog
            onClose={studentteacherhandleClose}
            aria-labelledby="customized-dialog-title"
            open={open}
          >
            <StudentTeacherTitle
              id="customized-dialog-title"
              onClose={studentteacherhandleClose}
            ></StudentTeacherTitle>
            <DialogContent>
              <Typography gutterBottom className="mb-3">
                {!chatAlreadyExists && (
                  <>
                    Hi <MdWavingHand className="wvng-icn" />
                  </>
                )}
              </Typography>

              <Typography variant="h5" component="h5">
                {chatAlreadyExists ? (
                  "Do you want to chat with teacher ?"
                ) : (
                  <>
                    Do you want to contact{" "}
                    <span className="teacher-name-chat">
                      {teacherDetails.user_name}
                    </span>
                    ?
                  </>
                )}
              </Typography>
              <Button
                className="mt-3"
                variant="contained"
                onClick={() => createChannel()}
              >
                {chatAlreadyExists ? "Go to chat" : "Chat"}
              </Button>
            </DialogContent>
          </StudentTeacherDialog>
        </div>
      </Container>
    </div>
  );
};
export default TeacherDetails;
