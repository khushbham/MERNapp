import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import moment from "moment";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";

const CourseScheduleStep4 = (props) => {
  const { formik, setArrayOptions, arrayOptions } = props;
  var currentMonth = new Date().getMonth() + 1;
  var currentDate =
    new Date().getFullYear() +
    "-" +
    ("0" + currentMonth).slice(-2) +
    "-" +
    ("0" + new Date().getDate()).slice(-2);
  const checkTime = (start = null, end = null) => {
    if (start && end) {
      if (moment(end, "HH:mm").isBefore(moment(start, "HH:mm"))) {
        return true;
      }
    }
    return false;
  };

  const checkDateDiff = (date, Index) => {
    if (Index > 0) {
      for (let i = Index; i >= 0; i--) {
        if (moment(date).isBefore(moment(arrayOptions[i]?.class_date))) {
          return true;
        }
      }

      for (let i = 0; i < 4; i++) {
        if (moment(date).isBefore(moment(arrayOptions[i]?.class_date))) {
          return true;
        }
      }
    }
    return false;
  };

  const handleInputChange = async (e, index) => {
    const { name, value } = e.target;
    if (name == "class_end_time") {
      var checkResult = checkTime(arrayOptions[index]?.class_start_time, value);
      if (checkResult == true) {
        alert("Class End Time Should be greater than Start Time");
        return;
      }
    }

    if (
      name == "class_start_time" &&
      arrayOptions[index]?.class_end_time != ""
    ) {
      var checkResult = checkTime(value, arrayOptions[index].class_end_time);
      if (checkResult == true) {
        alert("Class End Time Should be greater than Start Time");
        return;
      }
    }

    if (name == "class_date") {
      var checkDateErr = checkDateDiff(value, index);
      if (checkDateErr == true) {
        alert("Class Date should be greater than Previous class Date");
        return;
      }
    }
    const list = [...arrayOptions];
    list[index][name] = value;
    setArrayOptions(list);
    return true;
  };

  const handleAddinput = (e) => {
    e.preventDefault();
    var count = e.target.value;
    var outputOptions = [];
    for (var i = 0; i < count; i++) {
      outputOptions.push({
        class_date: "",
        class_start_time: "",
        class_end_time: "",
      });
    }
    setArrayOptions(outputOptions);
  };

  return (
    <Box>
      <Box className="my-4">
        <Typography variant="h3" gutterBottom component="div" className="mb-0">
          {" "}
          Set up your class schedule
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          component="div"
          className="mb-0"
        >
          Let your students know when the class will take place so they can plan
          accordingly
        </Typography>
      </Box>
      <Box ClassName="StepsForm">
        <FormControl className="selectDropdown w-100 mb-2">
          <InputLabel
            shrink
            htmlFor="student-name"
            className="studentNameLabel"
          >
            How many Classes in this Course?
          </InputLabel>
          <Select
            sx={{ mb: 1 }}
            onChange={(e) => handleAddinput(e)}
            displayEmpty
            className="StepsFields"
            inputProps={{ "aria-label": "Without label" }}
          >
            {/* <MenuItem value={1} className="d-block p-2">
              1
            </MenuItem> */}
            <MenuItem value={2} className="d-block p-2">
              2
            </MenuItem>
            <MenuItem value={3} className="d-block p-2">
              3
            </MenuItem>
            <MenuItem value={4} className="d-block p-2">
              4
            </MenuItem>
          </Select>
        </FormControl>

        {arrayOptions &&
          arrayOptions.length > 0 &&
          arrayOptions.map((x, i) => (
            <Box className="SessionClassDetails mb-2">
              <Typography
                variant="h6"
                gutterBottom
                component="div"
                className="CourseHeadingss"
              >
                CLASS SESSION {i + 1}{" "}
              </Typography>
              <FormControl variant="standard" className="w-100 my-2">
                <InputLabel
                  shrink
                  htmlFor="student-name"
                  className="studentNameLabel"
                >
                  Class Date
                </InputLabel>
                <TextField
                  sx={{ mb: 1 }}
                  required
                  fullWidth
                  name="class_date"
                  id="name"
                  type="date"
                  variant="standard"
                  placeholder="Please Select"
                  value={arrayOptions[i]?.class_date}
                  className="StepsFields date_fields_hover"
                  onChange={(e) => handleInputChange(e, i)}
                  inputProps={{
                    min: currentDate,
                  }}
                />
              </FormControl>
              <FormControl variant="standard" className="w-100 my-2">
                <InputLabel
                  shrink
                  htmlFor="student-name"
                  className="studentNameLabel"
                >
                  Class Start Time
                </InputLabel>
                <TextField
                  sx={{ mb: 1 }}
                  required
                  fullWidth
                  name="class_start_time"
                  id="name"
                  type="time"
                  variant="standard"
                  placeholder="Please Select"
                  value={arrayOptions[i]?.class_start_time}
                  className="StepsFields time_fields_hover"
                  onChange={(e) => handleInputChange(e, i)}
                />
              </FormControl>
              <FormControl variant="standard" className="w-100 my-2">
                <InputLabel
                  shrink
                  htmlFor="student-name"
                  className="studentNameLabel"
                >
                  Class End Time
                </InputLabel>
                <TextField
                  sx={{ mb: 1 }}
                  required
                  fullWidth
                  name="class_end_time"
                  id="name"
                  type="time"
                  variant="standard"
                  placeholder="Please Select"
                  value={arrayOptions[i]?.class_end_time}
                  className="StepsFields time_fields_hover"
                  onChange={(e) => handleInputChange(e, i)}
                />
              </FormControl>
            </Box>
          ))}

        <FormControl variant="standard" className="w-100 my-2">
          <InputLabel
            shrink
            htmlFor="student-name"
            className="studentNameLabel"
          >
            Price per Student
          </InputLabel>
          <TextField
            sx={{ mb: 1 }}
            required
            fullWidth
            name="price"
            id="name"
            type="text"
            variant="standard"
            placeholder="$ 30.00"
            className="StepsFields"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
          />
          {formik.errors.price && formik.touched.price ? (
            <div className="error_message">{formik.errors.price}</div>
          ) : null}
        </FormControl>
        <Box>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            align="right"
            className="SubText policyInstructions"
          >
            {" "}
            *Subject to the sites cancellation policy.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default CourseScheduleStep4;
