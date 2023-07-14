import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import { Link, useHistory } from "react-router-dom";
import StudentNavbar from "../StudentNavbar";
import { useDispatch } from "react-redux";
import { getSessionsOfSelectedMonthForStudent } from "../../../../../actions/frontent";
import moment from "moment";
import { Button } from "@mui/material";

const MyClasses = () => {
  const defaultValue = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  const [selectedDay, setSelectedDay] = useState(defaultValue);
  const [changeDay , setchangeDay] = useState(false)
  const [sessionDetail, setsessionDetail] = useState([]);
  const dispatch = useDispatch();
  const history = useHistory();

  const getsessionDetail = () => {
    dispatch(getSessionsOfSelectedMonthForStudent(selectedDay))
      .then((res) => {
        if(changeDay){
        setsessionDetail(res.data.filter((arr)=>{
          if(arr.day_of_class == selectedDay.day)
          return arr
        }))} else{
          setsessionDetail(res.data)
        }
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  const getsessionDetailOfMonth = (monthYearObject) => {
    dispatch(getSessionsOfSelectedMonthForStudent(monthYearObject))
      .then((res) => {
          setsessionDetail(res.data)
        
        console.log(res);
      })
      .catch((err) => {
        console.log(err);
      });
  };
const datechange=(e)=>{
    setchangeDay(true)
    setSelectedDay(e)   
  }
  useEffect(() => {
    var dataObject = {
      year : defaultValue.year,
      month : defaultValue.month
    }
    if(selectedDay){
      dataObject = {
        year: selectedDay.year,
        month: selectedDay.month
      }
    }
    getsessionDetail();
    document.querySelector(".-right").onclick = function () {
      dataObject.month = dataObject.month == 1 ? (dataObject.month ?? 0) + 11 : (dataObject.month ?? 0) - 1;
      dataObject.year = dataObject.month == 12 ? (dataObject.year ?? 0) - 1 : (dataObject.year ?? 0)
      // changeDay = false;
      // getAvailablilities(data);
      getsessionDetailOfMonth(dataObject)

    };
    document.querySelector(".-left").onclick = function () {
      dataObject.month = dataObject.month == 12 ? (dataObject.month ?? 0) - 11 : dataObject.month == 12 ? (dataObject.year ?? 0) + 1 : (dataObject.month ?? 0) + 1;
      dataObject.year = dataObject.month == 1 ? (dataObject.year ?? 0) + 1 : (dataObject.year ?? 0)
      getsessionDetailOfMonth(dataObject)
      
      // changeDay = false;
      // getAvailablilities(data);
    };
  }, [selectedDay]);

  const tConvert = (time24) => {
    const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{1,2})/).slice(1);
    const period = +sHours < 12 ? "AM" : "PM";
    const hours = +sHours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  };

  const onClick = (_id) => {
    history.push({
      pathname: "/students/class-Details",
      search: `booking_id=${_id}`
    });
  };
  return (
    <>
      <StudentNavbar />
      <Container>
        <Typography variant="h4" gutterBottom component="div" className="mt-4">
          My Calendar
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
                onChange={(e)=>datechange(e)}
                shouldHighlightWeekends
              />
            </Grid>

            <Grid item lg={6} md={6} sm={12} xs={12} className="ml-auto">
            <Typography variant="h3" gutterBottom component="div" className="classesHeading mb-4">
            My Classes List
            </Typography>
              {sessionDetail?.length ? (
                <div>
                  {sessionDetail?.map((value) => {
                    return (
                      <Button
                        onClick={(e) =>
                          onClick(
                            value?._id
                          )
                        }
                        className="availablelist"
                      >
                        <Box className="availabilityDetails">
                          <Typography variant="h5" gutterBottom component="div">
                            {value?.class_title}
                          </Typography>
                          <Typography
                            variant="subtitle1"
                            gutterBottom
                            component="div"
                            className="timingDetails"
                          >
                            {moment()
                              .month(value?.month_of_class)
                              .subtract(1, "month")
                              .format("MMMM")}{" "}
                            {value?.day_of_class} |{" "}
                            {value?.start_time_of_class ?  tConvert(value?.start_time_of_class) : "" }
                            {" "}to{" "}
                            {value?.end_time_of_class ?  tConvert(value?.end_time_of_class) : "" }
                          </Typography>
                        </Box>
                      </Button>
                    );
                  })}
                </div>
              ) : (
                <div>
                  {" "}
                  <div style={{ alignItems: "center",textAlign:"center", padding:"10px", background:"#e1e3e7" }} className="no_class_records">
                       No Record Found
                     </div>{" "}
                </div>
              )}
            </Grid>
          </Grid>
        </Box>
      </Container>
    </>
  );
};

export default MyClasses;
