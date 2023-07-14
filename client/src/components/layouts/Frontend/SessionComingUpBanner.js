import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Navbar from "./Navbar";
import { Link } from 'react-router-dom';
import Container from "@mui/material/Container";

const SessionComingUpBanner = () => {
  return (
    <Box className="CalendarSessionDetails sessionComingUp">
      <Navbar />
      <Box className="SessionInnerDetails py-5">
        <Container>
          <Typography
            variant="h4"
            gutterBottom
            component="div"
            className="mt-4 sessionContent"
          >
           <strong>Illustration techniques to unlock your creativity is </strong> coming up
          </Typography>
          <Box className="d-flex justify-content-end ">
              <Link to="/" className="SessionLinkss mx-2">Session Details</Link>
              <Link to="/" className="SessionLinkss mx-2"> Dismiss</Link>
          </Box>
        </Container>
      </Box>
    </Box>
  );
};

export default SessionComingUpBanner;
