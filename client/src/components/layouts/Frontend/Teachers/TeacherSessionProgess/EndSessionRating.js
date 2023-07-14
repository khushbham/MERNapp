import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import Container from "@mui/material/Container";
import Rating from "@mui/material/Rating";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Link, useLocation } from "react-router-dom";
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import {
  addRating
} from "../../../../../actions/frontent";
import { useHistory } from "react-router-dom";

const EndSessionRating = () => {
  const location = useLocation();
  const [value, setValue] = React.useState(-1);
  const [feedback, setfeedback] = React.useState("");
  const [studentList, setstudentlist] = React.useState(
    location.state.booked_by
  );
  const dispatch = useDispatch();
  const history = useHistory();
  const [showIndex, setShowIndex] = React.useState(0);
  const queryParams = new URLSearchParams(window.location.search);
  const classId = queryParams.get("class_id");
  const sessionId = queryParams.get("session_id");

  const add_rating = (booking_id, student_id, index) => {
    if (feedback != "" && value != -1) {
      const data = {
        rating_given_to: student_id,
        class_id: classId,
        session_id: sessionId,
        booking_id: booking_id,
        rating: value,
        feedback: feedback,
        user_role: localStorage.getItem("user_role"),
      };
      dispatch(addRating(data))
        .then((res) => {
          console.log("res", res);
          if (res && res.success) {
            setValue(-1);
            setfeedback("");
            setShowIndex(index + 1);
            if (studentList.length == index + 1) {
              history.push({
                pathname: "/teacher/session-details",
                search: `class_id=${classId}&id=${sessionId}`,
                state: {
                  class_id: classId,
                  session_id: sessionId,
                  booking_id: booking_id,
                },
              });
            }
          }
        })
        .catch((err) => {
          console.log(err);
        });
    }
  };
  return (
    <Box>
      <Container>
        <Grid container>
          {studentList?.map((arr, index) => {
            return (
              showIndex == index && (
                <Grid
                  item
                  lg={7}
                  md={12}
                  sm={12}
                  className="m-auto mt-4 mb-4  StepsContentWrapper"
                  key={index}
                >
                  <Typography
                    variant="h3"
                    gutterBottom
                    component="div"
                    className="mt-2 mb-3"
                    align="left"
                  >
                    ({index + 1}) How was your session? Please rate your
                    Student: ( {index + 1} out of {studentList.length})
                  </Typography>
                  <Grid container className="my-3">
                    <Grid item lg={2} sm={2} md={12} xs={12}>
                      <Avatar
                        alt="Remy Sharp"
                        src={arr?.booked_by.profile_image}
                        sx={{ width: 90, height: 90 }}
                      />
                    </Grid>
                    <Grid item lg={10} sm={10} md={12} xs={12}>
                      <Typography variant="h3" gutterBottom component="div">
                        {arr?.booked_by.first_name} {arr?.booked_by.last_name}{" "}
                      </Typography>
                      <Typography>
                        {" "}
                        {arr?.booked_by.street_address}, {arr?.booked_by.city}
                      </Typography>
                      <Rating
                        className="ratingWrap"
                        name="simple-controlled"
                        //value={value}
                        id={`rating_${index}`}
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
                      id={`feedback_${index}`}
                      name="feedback"
                      onChange={(e) => setfeedback(e.target.value)}
                    />
                  </FormControl>
                  <Grid item lg={6} md={6} sm={12} xs={12} className="m-auto">
                    <Button
                      className="reatingsessionBtn"
                      onClick={() =>
                        add_rating(arr._id, arr.booked_by._id, index)
                      }
                    >
                      Submit
                    </Button>
                  </Grid>
                </Grid>
              )
            );
          })}
        </Grid>
      </Container>
    </Box>
  );
};

export default EndSessionRating;
