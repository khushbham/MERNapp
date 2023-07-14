import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from "react-modern-calendar-datepicker";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link, useHistory, useLocation } from "react-router-dom";
import StudentNavbar from "../StudentNavbar";
import { useDispatch } from "react-redux";
import {
  getClassDetailForStudent,
  checkClassIsAlreadyBookedOrNot,
} from "../../../../../actions/frontent";
import { Button } from "@mui/material";
import moment from "moment";

const BookClass = () => {
  const [selectedDay, setSelectedDay] = useState(null);
  const dispatch = useDispatch();
  const history = useHistory();
  const [classDetails, setclassDetails] = useState();
  const [Details, setDetails] = useState([]);
  const queryParams = new URLSearchParams(window.location.search);

  const TeacherID = queryParams.get("teacher_Id");
  const ClassID = queryParams.get("Class_Id");
  const interval = queryParams.get("interval");
  const [highlighSelectedDate, setHighlightSelectedDate] = useState("");
  const [showConfirmButton, setShowConfirmButton] = useState(false);
  const [errorMessage, setErrorMessage] = useState(false);
  const getClassDetail = () => {
    dispatch(getClassDetailForStudent(TeacherID, ClassID))
      .then((res) => {
        //console.log(res.data)
        setclassDetails(res.data.classData);
        setDetails(res.data);
      })
      .catch((err) => console.log(err));
  };
  useEffect(() => {
    getClassDetail();
  }, []);
  const bookclass = () => {
    var availabilityDate = `${selectedDay.year}-${(
      "0" + selectedDay.month
    ).slice(-2)}-${("0" + selectedDay.day).slice(-2)}`;
    if (highlighSelectedDate != "") {
      history.push({
        pathname: "/students/book-class-detail",
        search: `Teacher_Id=${TeacherID}&Class_Id=${ClassID}&selectedDay=${availabilityDate}&interval=${interval}`,
        state: {
          Teacher_Id: TeacherID,
          Class_Id: ClassID,
          selectedDay: availabilityDate,
          Details: Details,
        },
      });
    }
  };
  const dateChanged = (e) => {
    setSelectedDay(e);
    var selectedMonthAvail = `${("0" + e.month).slice(-2)}`;

    const dateForGetAvailablity = `${selectedMonthAvail}-${("0" + e.day).slice(
      -2
    )}-${e.year}`;
    setHighlightSelectedDate(
      moment(dateForGetAvailablity).format("MMM D YYYY")
    );
    var availabilityDateForClass = `${e.year}-${("0" + e.month).slice(-2)}-${(
      "0" + e.day
    ).slice(-2)}`;

    dispatch(
      checkClassIsAlreadyBookedOrNot(availabilityDateForClass, ClassID)
    ).then((res) => {
      if (res && res.success) {
        setShowConfirmButton(res.data.classDetailData.length > 0 ? false : true);
        setErrorMessage(res.data.classDetailData.length > 0 ? true : false);
      }
    });
  };
  return (
    <>
      <StudentNavbar />
      <Container>
        <Typography variant="h4" gutterBottom component="div" className="mt-4">
          Book a Class
        </Typography>
        <Box className="calendarSec SessionsOuter mt-2">
          <Grid container spacing={6}>
            <Grid
              item
              lg={5}
              md={6}
              sm={12}
              xs={12}
              className="SessionsCalendar"
            >
              <Calendar
                className="SessionsCalendar"
                value={selectedDay}
                onChange={(e) => dateChanged(e)}
                shouldHighlightWeekends
                minimumDate={utils().getToday()}
              />
            </Grid>
            <Grid item lg={6} md={6} sm={12} xs={12} className="ml-auto">
              <Link to="#" className="sessionLink">
                <Box className="availabilityDetails">
                  <Typography variant="h5" gutterBottom component="div">
                    {" "}
                    {classDetails?.discipline}
                  </Typography>
                  <Typography
                    variant="subtitle1"
                    gutterBottom
                    component="div"
                    className="timingDetails"
                  >
                    {highlighSelectedDate == ""
                      ? "Please Select a date"
                      : highlighSelectedDate}
                  </Typography>
                </Box>
              </Link>
            </Grid>
          </Grid>
        </Box>
        <Grid container>
          <Grid item lg={4} md={8} sm={8} xs={12} className="m-auto my-3">
            {errorMessage && (
              <p className="text-danger">
                This class is already booked on selected date
              </p>
            )}
            {showConfirmButton && (
              <Button className="sessionBtn sessionBtnn" onClick={bookclass}>
                Confirm
              </Button>
            )}
          </Grid>
        </Grid>
      </Container>
    </>
  );
};

export default BookClass;
