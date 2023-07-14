import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import StudentNavbar from "../StudentNavbar";
import Container from "@mui/material/Container";
import Rating from "@mui/material/Rating";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  addRating,
  getTeacherPublicProfileForStudent,
} from "../../../../../actions/frontent";
import { useHistory } from "react-router-dom";

const EndSessionRating = () => {
  const [value, setValue] = React.useState(-1);
  const [feedback, setfeedback] = React.useState("");
  const [techerDetail, seteacherDetail] = React.useState({});
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();

  const queryParams = new URLSearchParams(window.location.search);
  //  console.log(queryParams.get("teacherId"))
  const teacherId = queryParams.get("teacherId");
  const classId = queryParams.get("class_id");
  const sessionId = queryParams.get("session_id");
  const booking_id = queryParams.get("booking_id");

  useEffect(() => {
    dispatch(getTeacherPublicProfileForStudent(teacherId))
      .then((res) => {
        console.log(res, "response");
        seteacherDetail(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  const add_rating = () => {
    if (feedback != "" && value > 0) {
      const data = {
        rating_given_to: teacherId,
        class_id: classId,
        session_id: sessionId,
        booking_id: booking_id,
        rating: value,
        feedback: feedback,
        user_role: localStorage.getItem("user_role"),
      };
      dispatch(addRating(data))
        .then((res) => {
          console.log(res);
          if (res && res.success) {
            history.push({
              pathname: "/students/class-Details",
              search: `booking_id=${booking_id}`,
              state: {
                booking_id: booking_id,
              },
            });
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <Box>
      <StudentNavbar />
      <Container>
        <Grid container>
          <Grid
            item
            lg={7}
            md={12}
            sm={12}
            className="m-auto mt-4 mb-4  StepsContentWrapper"
          >
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="mt-2 mb-3"
              align="left"
            >
              How was your session? Please rate your teacher:
            </Typography>
            <Grid container className="my-3">
              <Grid item lg={2} sm={2} md={12} xs={12}>
                <Avatar
                  alt="Remy Sharp"
                  src={techerDetail?.profile_image}
                  sx={{ width: 90, height: 90 }}
                />
              </Grid>
              <Grid item lg={10} sm={10} md={12} xs={12}>
                <Typography variant="h3" gutterBottom component="div">
                  {techerDetail?.user_name}{" "}
                </Typography>
                <Typography>
                  {techerDetail?.expertise} | {techerDetail?.street_address},{" "}
                  {techerDetail?.city}
                </Typography>
                <Rating
                  className="ratingWrap"
                  name="simple-controlled"
                  //value={value}
                  onChange={(event, newValue) => {
                    setValue(newValue);
                  }}
                />
              </Grid>
            </Grid>
            <FormControl variant="standard" className="w-100 mb-5">
              <InputLabel
                shrink
                htmlFor="student-name"
                className="studentNameLabel"
              >
                Tell us about your experience
              </InputLabel>
              <TextareaAutosize
                aria-label="minimum height"
                minRows={3}
                placeholder="Your comment will be displayed on the teacher’s profile and will be visible to the student and
                                 other users"
                className="StepsFields w-100"
                name="feedback"
                onChange={(e) => setfeedback(e.target.value)}
              />
            </FormControl>
            <Grid item lg={6} md={6} sm={12} xs={12} className="m-auto">
              <Button
                className="reatingsessionBtn"
                onClick={() => add_rating()}
              >
                Submit
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default EndSessionRating;
