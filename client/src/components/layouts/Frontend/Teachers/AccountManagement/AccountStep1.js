import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import DatePicker from "react-date-picker";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import Grid from "@mui/material/Grid";
import { getDropdownValues } from "../../../../../actions/frontent";
const AccountStep1 = (props) => {
  const { formik , setDatePickerDate, datePickerDate } = props;
  const dispatch = useDispatch();
  // const [Gender, setVal] = React.useState('');
  const [genderValue, setgenderValue] = React.useState([]);
  const [stateValue, setstateValue] = React.useState([]);
  // const handleChange = (event) => {
  //     setVal(event.target.value);
  // };
  const profile_created = localStorage.getItem("profile_created");
  const getDropdown = () => {
    dispatch(getDropdownValues())
      .then((res) => {
        const gender = res.data
          .filter((arr) => {
            return arr.name == "gender_identity";
          })
          .map((arr) => {
            setgenderValue(arr.options);
          });

        const state = res.data
          .filter((arr) => {
            return arr.name == "state";
          })
          .map((arr) => {
            setstateValue(arr.options);
          });
      })
      .catch((err) => {
        console.log(err, " error");
      });
  };
  useEffect(() => {
    getDropdown();
    // if (profile_created) {
    // }
  }, []);
  return (
    <Box>
      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              First Name
            </InputLabel>
            <TextField
              InputProps={{ inputProps: { minlength: "0", maxlength: "15" } }}
              type="string"
              sx={{ mb: 1 }}
              required
              fullWidth
              name="first_name"
              id="name"
              variant="standard"
              placeholder="Dana"
              className="StepsFields"
              value={formik.values.first_name}
              onChange={formik.handleChange}
            />
            {formik.errors.first_name && formik.touched.first_name ? (
              <div className="error_message">{formik.errors.first_name}</div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Last Name
            </InputLabel>
            <TextField
              InputProps={{ inputProps: { minlength: "0", maxlength: "15" } }}
              type="string"
              sx={{ mb: 1 }}
              required
              fullWidth
              name="last_name"
              id="name"
              variant="standard"
              placeholder="Dana"
              className="StepsFields"
              //defaultValue={formik.values.first_name?formik.values.first_name:studentdata.first_name}
              value={formik.values.last_name}
              onChange={formik.handleChange}
            />
            {formik.errors.last_name && formik.touched.last_name ? (
              <div className="error_message">{formik.errors.last_name}</div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12}>
          <FormControl className="selectDropdown w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Gender Identity
            </InputLabel>
            <Select
              sx={{ mb: 1 }}
              // value={Gender}
              // onChange={handleChange}
              displayEmpty
              className="StepsFields same_height_othrs student_gendr"
              inputProps={{ "aria-label": "Without label" }}
              name="gender_identity"
              value={formik.values.gender_identity}
              onChange={formik.handleChange}
            >
              {genderValue.map((key, index) => {
                return (
                  <MenuItem value={index} className="d-block p-2">
                    {key}
                  </MenuItem>
                );
              })}
            </Select>
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Date of Birth
            </InputLabel>
            <DatePicker onChange={setDatePickerDate} value={datePickerDate} maxDate={new Date()}/>
            {/* <TextField
              sx={{ mb: 1 }}
              required
              fullWidth
              name="dob"
              id="name"
              type="date"
              variant="standard"
              placeholder="Please Select"
              className="StepsFields dateofbirth"
              value={formik.values.dob}
              onChange={formik.handleChange}
            />
            {formik.errors.dob && formik.touched.dob ? (
              <div className="error_message">{formik.errors.dob}</div>
            ) : null} */}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Street Address
            </InputLabel>
            <TextField
              InputProps={{ inputProps: { minlength: "0", maxlength: "30" } }}
              type="string"
              sx={{ mb: 1 }}
              required
              fullWidth
              name="street_address"
              id="name"
              variant="standard"
              placeholder="Smith"
              className="StepsFields"
              value={formik.values.street_address}
              onChange={formik.handleChange}
            />
            {formik.errors.street_address && formik.touched.street_address ? (
              <div className="error_message">
                {formik.errors.street_address}
              </div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              City
            </InputLabel>
            <TextField
              InputProps={{ inputProps: { minlength: "0", maxlength: "30" } }}
              type="string"
              sx={{ mb: 1 }}
              required
              fullWidth
              name="city"
              id="name"
              variant="standard"
              placeholder="City"
              className="StepsFields"
              value={formik.values.city}
              onChange={formik.handleChange}
            ></TextField>
            {formik.errors.city && formik.touched.city ? (
              <div className="error_message">{formik.errors.city}</div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              State
            </InputLabel>
            <Select
              sx={{ mb: 1 }}
              name="state"
              placeholder="State"
              value={formik.values.state}
              onChange={formik.handleChange}
              displayEmpty
              className="StepsFields state_fields stud_field_state"
              inputProps={{ "aria-label": "Without label" }}
            >
              {stateValue.map((key, index) => {
                return (
                  <MenuItem value={key} className="d-block p-2">
                    {key}
                  </MenuItem>
                );
              })}
            </Select>
            {formik.errors.state && formik.touched.state ? (
              <div className="error_message">{formik.errors.state}</div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Zip code
            </InputLabel>
            <TextField
              sx={{ mb: 1 }}
              required
              fullWidth
              name="zip_code"
              id="name"
              type="number"
              variant="standard"
              placeholder=" Zip code"
              className="StepsFields zip_area_info"
              value={formik.values.zip_code}
              onChange={formik.handleChange}
            />
            {formik.errors.zip_code && formik.touched.zip_code ? (
              <div className="error_message">{formik.errors.zip_code}</div>
            ) : null}
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
};

export default AccountStep1;
