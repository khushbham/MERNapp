import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navbar from "../../Navbar";
import Avatar from "@mui/material/Avatar";
import { Link } from 'react-router-dom';
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useDispatch } from "react-redux";
import { getUpcomingSessionForTeacherDashboard } from "../../../../../actions/frontent";

const SessionComingUp = () => {
  const [sesssionComingup , setsesssionComingup] = useState()
  const dispatch = useDispatch()

  useEffect(()=>{
    dispatch(getUpcomingSessionForTeacherDashboard()).then((res)=>{
      console.log(res,'res')
      setsesssionComingup(res.data)
    })
  },[])
  return (
    <Box className="CalendarSessionDetails sessionComingUp">
      <Navbar />
      <Box className="SessionInnerDetails mt-3">
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            className="mt-4"
          >
            You have a new session coming up
          </Typography>
          <Box className="contentSec SessionComingSec">
            <Typography
              className="mt-4 sessionTimings"
            >
              {sesssionComingup?.class_date} | {sesssionComingup?.start_time_of_class} to {sesssionComingup?.end_time_of_class}
            </Typography>
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="classesHeading mb-3"
            >
              {sesssionComingup?.class_title}
            </Typography>
            <Box className="Teacher-Profile d-flex align-items-center">
              <Avatar
                alt="teacher Profile"
                src="../images/teacher.jpg"
                className="me-2"
              />
              <Typography variant="body1" gutterBottom className="descSubHead">
                {" "}
                By Julia Tatello{" "}
                <Link href="#" className="ContactLink mb-0">
                  contact{" "}
                </Link>{" "}
              </Typography>
            </Box>
          </Box>

          <Grid container className="align-item-center py-3" spacing={5}>
            <Grid item lg={5} md={6} sm={12} xs={12}>
              <Box className="Location">
                <Typography
                  variant="h5"
                  gutterBottom
                  component="div"
                  className="mt-4"
                >
                  {" "}
                  3824 Main St Riverside, CA{" "}
                </Typography>
                <Typography className="locationInstructions">
                 Once you reach your location and meet your  teacher / student please confirm that the class has started.
                </Typography>
                  <Box className="mt-5">
                    <Link to="/" className="sessionBtn">
                      Confirm class has started
                    </Link>
                 </Box>
              </Box>
            </Grid>
            <Grid item lg={7} md={6} sm={12} xs={12}>
               <iframe src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3314.277239053006!2d-117.57614098504361!3d33.83096028066681!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x80dcc797fe1a89e5%3A0x20c6c416f07722b1!2s3824%20S%20Main%20St%2C%20Corona%2C%20CA%2092882%2C%20USA!5e0!3m2!1sen!2shk!4v1648538080916!5m2!1sen!2shk" width="100%" height="350" ></iframe>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default SessionComingUp;
