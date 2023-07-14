import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import moment from "moment";
import TextField from "@mui/material/TextField";
const ClassScheduleStep4 = (props) => {
  const { formik, setArrayOptions, arrayOptions } = props;
  var currentMonth = new Date().getMonth()+1;
  var currentDate =
    new Date().getFullYear() +
    "-" +
    ("0" + currentMonth).slice(-2) +
    "-" +
    ("0" + new Date().getDate()).slice(-2);
  console.log(currentDate);
  const [fourthFormData, setFourthFormData] = useState({
    class_date: "",
    class_start_time: "",
    class_end_time: "",
  });

  const checkTime = (start = null, end = null) => {
    if (start && end) {
      if (moment(end, "HH:mm").isBefore(moment(start, "HH:mm"))) {
        return true;
      }
    }
    return false;
  };

  const handleInputChange = (e) => {
    //check for end time every time
    if (e.target.name == "class_end_time") {
      var checkResult = checkTime(
        fourthFormData.class_start_time,
        e.target.value
      );
      if (checkResult == true) {
        alert("Class End Time Should be greater than Start Time");
        return;
      }
    }
    if (
      e.target.name == "class_start_time" &&
      fourthFormData.class_end_time != ""
    ) {
      var checkResult = checkTime(
        e.target.value,
        fourthFormData.class_end_time
      );
      if (checkResult == true) {
        alert("Class End Time Should be greater than Start Time");
        return;
      }
    }

    setFourthFormData({ ...fourthFormData, [e.target.name]: e.target.value });
    //console.log(fourthFormData)
    setArrayOptions([{ ...fourthFormData, [e.target.name]: e.target.value }]);
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
        <Box className="SessionClassDetails mb-2">
          <Typography
            variant="h6"
            gutterBottom
            component="div"
            className="CourseHeadingss"
          >
            CLASS SESSION
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
              className="StepsFields date_fields_hover"
              value={fourthFormData.class_date}
              onChange={(e) => handleInputChange(e)}
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
              className="StepsFields time_fields_hover"
              value={fourthFormData.class_start_time}
              onChange={(e) => handleInputChange(e)}
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
              className="StepsFields time_fields_hover"
              value={fourthFormData.class_end_time}
              onChange={(e) => handleInputChange(e)}
            />
          </FormControl>
        </Box>

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

export default ClassScheduleStep4;
