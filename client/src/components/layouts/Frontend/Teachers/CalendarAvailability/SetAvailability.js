import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar, utils } from "react-modern-calendar-datepicker";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import { Button, Typography } from "@mui/material";
import { getAvailablilitiesList, getAvailablilityDetail } from "../../../../../actions/frontent";
var changeDay = false;
const SetAvailability = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const defaultValue = {
    year: new Date().getFullYear(),
    month: new Date().getMonth() + 1,
    day: new Date().getDate(),
  };
  const [Availability, SetAvailability] = useState([]);
  const [selectedDay, setSelectedDay] = useState(null);
  // const [changeDay, setchangeDay] = useState(false);
  const [customDaysClassName, setCustomDaysClassName] = useState([]);

  const onChange = () => {
  const selectedDatee = `${('0' + selectedDay.month).slice(-2)}-${('0' + selectedDay.day).slice(-2)}-${selectedDay.year}`;

    console.log(selectedDay);
    var selectedDate = new Date(
      selectedDay.year,
      selectedDay.month,
      selectedDay.day
    );
    selectedDate = selectedDate.toString().split("GMT");
    selectedDate = selectedDate.toString().split("00:00:00");
    selectedDate.pop(selectedDate[1]);
    history.push({
      pathname: "/teacher/availability-slots",
      search: `selectedDate=${selectedDatee}`,
    });
  };
  
  const datechange = (e) => {
    console.log(e)
    setSelectedDay(e);
    var selectedMonthAvail = `${('0' + e.month).slice(-2)}`;
    const dateForGetAvailablity = `${e.year}-${selectedMonthAvail}-${('0' + e.day).slice(-2)}`;

    dispatch(getAvailablilityDetail(dateForGetAvailablity,selectedMonthAvail, e.year)).then(res => {
    changeDay = true;

      if(res && res.success){
        SetAvailability(res.data)
      }
    })
  };

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


  const getdata = (data) => {
    getAvailablilities(data);
    document.querySelector(".-right").onclick = function () {
      data.month = data.month == 1 ? (data.month ?? 0) + 11 : (data.month ?? 0) - 1;
      data.year = data.month == 12 ? (data.year ?? 0) - 1 : (data.year ?? 0)
      changeDay = false;
      getAvailablilities(data);
    };
    document.querySelector(".-left").onclick = function () {
      data.month = data.month == 12 ? (data.month ?? 0) - 11 : data.month == 12 ? (data.year ?? 0) + 1 : (data.month ?? 0) + 1;
      data.year = data.month == 1 ? (data.year ?? 0) + 1 : (data.year ?? 0)
      changeDay = false;
      getAvailablilities(data);
    };
  };
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
  dispatch(getAvailablilitiesList(dataObject))
      .then((res) => {
        if(res.success){
          setCustomDaysClassName(res.data);
        }
      });
      getdata(dataObject);
},[])
  const getAvailablilities = (data) => {
    dispatch(getAvailablilitiesList(data))
      .then((res) => {
        if(res.success){
          setCustomDaysClassName(res.data);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  return (
    <Box>
      {/* <Navbar /> */}
      <style dangerouslySetInnerHTML={{__html: "\nbutton.Calendar__monthText {\n    pointer-events: none;\n}\nbutton.Calendar__yearText {\n    pointer-events: none;\n}\n" }} />
      <style dangerouslySetInnerHTML={{__html: "\n.Calendar__day.-ltr.orangeDay.-disabled {\n    color: #d4d4d4 !important;\n    border: 0;\n    }\n" }} />
      <Grid container spacing={6}>
        <Grid item lg={5} md={6} sm={12} xs={12} className="SessionsCalendar">
          <Calendar
            className="SessionsCalendar"
            value={selectedDay}
            onChange={(e) => datechange(e)}
            shouldHighlightWeekends
            customDaysClassName={customDaysClassName}
            minimumDate={utils().getToday()}
          />
        </Grid>
        <Grid
          item
          lg={6}
          md={6}
          sm={12}
          xs={12}
          className="sessionlist ml-auto"
        >
          <Typography variant="h3" gutterBottom component="div" className="classesHeading mb-4">
            Availability List
          </Typography>
          {Availability?.length ? (
            <div>
              {Availability?.map((value) => (
                <Button>
                  <Box className="availabilityDetails">
                    <Typography variant="h5" gutterBottom component="div">
                      {value?.title}
                    </Typography>
                    <Typography
                      variant="subtitle1"
                      gutterBottom
                      component="div"
                      className="timingDetails"
                    >
                      {tConvert(value?.start)} to{" "}
                      {tConvert(value?.end)}
                    </Typography>
                  </Box>
                </Button>
              ))}
            </div>
          ) : (
            !changeDay ? "Please select a date to check the available time of selected date." :
            <div style={{ alignItems: "center", textAlign: "center", padding: "10px", background: "#e1e3e7" }}>
              No Record Found
            </div>
          )}

          <Box className="mt-4">
            {changeDay ? (
              <Button className="saveBtn" onClick={() => onChange()}>
                Add New Availability
              </Button>
            ) : (
              ""
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default SetAvailability;
