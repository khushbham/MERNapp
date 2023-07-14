import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import FormControl from "@mui/material/FormControl";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import { Link, useHistory, useLocation } from "react-router-dom";
import Navbar from "../../Navbar";
import * as yup from "yup";
import moment from 'moment';
import { Button } from "@mui/material";
import { useDispatch } from "react-redux";
import { addAvailablility } from "../../../../../actions/frontent";

const validationSchema = yup.object({
  start_time: yup.string().required("start time cannot be empty"),
  end_time: yup
    .string()
    .required("end time cannot be empty")
    .test("is-greater", "end time should be greater", function (value) {
      const { start_time } = this.parent;
      return moment(value, "HH:mm").isSameOrAfter(moment(start_time, "HH:mm"));
    })
});
const AvailabilitySlots = () => {
  const location = useLocation();
  const history = useHistory()
  const queryParams = new URLSearchParams(window.location.search);
  const dispatch = useDispatch();
  const [Session, setVal] = React.useState("");
  const handleChange = (event) => {
    setVal(event.target.value);
  };
  const [SessionType, setType] = React.useState("");
  const ChangeVal = (event) => {
    setType(event.target.value);
  };
  const selectedDate = queryParams.get('selectedDate');
  const Secondformik = useFormik({
    initialValues: {
      start_date: "",
      start_time: "",
      end_time: "",
      repeat_period: "",
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = {
        ...values,
        start_date: selectedDate,
      };
      dispatch(addAvailablility(formData)).then((res) => {
        console.log(res, 'response')
        if (res && res.success) {
          history.push("/teacher/calendar?show=availability")
        }
      });
    },
  });

  return (
    <Box>
      <Navbar />
      <Grid container>
        <Grid
          item
          lg={5}
          md={6}
          sm={8}
          xs={12}
          className="m-auto my-5 pt-0 p-4 availabilitySlots"
        >
          <Box className="my-4">
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="mb-4 pt-4"
            >
              {" "}
              Add Availability for {selectedDate != ""
                ? moment(selectedDate).format(
                  "MMM D YYYY"
                )
                : "-"}
            </Typography>
            <FormControl className="selectDropdown w-100 mb-2">
              <InputLabel
                shrink
                htmlFor="student-name"
                className="studentNameLabel"
                align="left"
              >
                From
              </InputLabel>
              <TextField
                sx={{ mb: 1 }}
                required
                fullWidth
                name="start_time"
                type="time"
                id="name"
                variant="standard"
                placeholder="Please Select"
                className="StepsFields"
                value={Secondformik.values.start_time}
                onChange={Secondformik.handleChange}
              />
              {Secondformik.errors.start_time &&
                Secondformik.touched.start_time ? (
                <div className="error_message">
                  {Secondformik.errors.start_time}
                </div>
              ) : null}
            </FormControl>
            <FormControl className="selectDropdown w-100 mb-2">
              <InputLabel
                shrink
                htmlFor="student-name"
                className="studentNameLabel"
                align="left"
              >
                To
              </InputLabel>
              <TextField
                sx={{ mb: 1 }}
                required
                fullWidth
                name="end_time"
                type="time"
                id="name"
                variant="standard"
                placeholder="Please Select"
                className="StepsFields"
                value={Secondformik.values.end_time}
                onChange={Secondformik.handleChange}
              />
              {Secondformik.errors.end_time && Secondformik.touched.end_time ? (
                <div className="error_message">
                  {Secondformik.errors.end_time}
                </div>
              ) : null}
            </FormControl>
            <FormControl className="selectDropdown w-100 mb-2">
              <InputLabel
                shrink
                htmlFor="student-name"
                className="studentNameLabel"
                align="left"
              >
                Repeat
              </InputLabel>
              <Select
                sx={{ mb: 1 }}
                // value={Session}
                // onChange={handleChange}
                displayEmpty
                className="StepsFields"
                inputProps={{ "aria-label": "Without label" }}
                name="repeat_period"
                value={Secondformik.values.repeat_period}
                onChange={Secondformik.handleChange}
              >
                <MenuItem value={0} className="d-block p-2 text-left">
                  Never
                </MenuItem>
                <MenuItem value={1} className="d-block p-2 text-left">
                  Every day
                </MenuItem>
                <MenuItem value={2} className="d-block p-2 text-left">
                  Every week
                </MenuItem>
                <MenuItem value={3} className="d-block p-2 text-left">
                  Every 2 weeks
                </MenuItem>
                <MenuItem value={4} className="d-block p-2 text-left">
                  Every month
                </MenuItem>
                <MenuItem value={5} className="d-block p-2 text-left">
                  Every year
                </MenuItem>
              </Select>
            </FormControl>
            <Button className="savesessionBtn savesessionBtnn" onClick={Secondformik.handleSubmit}>
              Save
            </Button>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AvailabilitySlots;
