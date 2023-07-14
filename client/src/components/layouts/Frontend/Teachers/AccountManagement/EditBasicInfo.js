import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import TeacherAccSidebar from "./TeacherAccSidebar";
import TextField from "@mui/material/TextField";
import Navbar from "../../Navbar";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import { useDispatch } from "react-redux";
import { useFormik } from "formik";
import moment from "moment";
import * as yup from "yup";
import FormControl from "@mui/material/FormControl";
import {
  getDropdownValues,
  getStudentPublicProfile,
} from "../../../../../actions/frontent";
import { Button } from "@mui/material";
import { updateBasicProfileInfo } from "../../../../../actions/frontent";
import DatePicker from "react-date-picker";

const validationSchema = yup.object({
  first_name: yup.string().required(" First Name is required"),
  last_name: yup.string().required(" Last Name is required"),
  // dob: yup
  //   .string()
  //   .required("DOB is required")
  //   .test("DOB", "Age must be greater than 10 years", (value) => {
  //     return moment().diff(moment(value), "years") >= 10;
  //   }),
  street_address: yup.string().required("Address is required"),
  city: yup.string().required("City is required"),
  state: yup.string().required("State is required"),
  zip_code: yup
    .string()
    .required("Zip code is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(4, "Zip Code is not Valid")
    .max(6, "Zip Code is not Valid"),
});
const EditBasicInformation = () => {
  const [Gender, setVal] = React.useState("");
  const handleChange = (event) => {
    setVal(event.target.value);
  };

  const calculate_age = (dob1) => {
    var today = new Date();
    var birthDate = new Date(dob1); // create a date object directly from `dob1` argument
    var age_now = today.getFullYear() - birthDate.getFullYear();
    var m = today.getMonth() - birthDate.getMonth();
    if (m < 0 || (m === 0 && today.getDate() < birthDate.getDate())) {
      age_now--;
    }
    console.log(age_now);
    return age_now;
  };
  // const {formik} = props
  const dispatch = useDispatch();

  //  const [Gender, setVal] = React.useState('');
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [genderValue, setgenderValue] = React.useState([]);
  const [stateValue, setstateValue] = React.useState([]);
  const [studentdata, setstudentData] = React.useState({});
  const [uploadedImage, setUploadedImage] = React.useState({});
  const [loadform, setloadform] = useState(false);

  useEffect(() => {
    dispatch(getStudentPublicProfile())
      .then((res) => {
        setstudentData(res.data);
        setUploadedImage(res.data.profile_image);
        if (res?.data?.dob && res?.data?.dob != "") {
          setDatePickerDate(new Date(res?.data?.dob));
        }
        setloadform(true);
      })
      .catch((err) => console.log(err));
    getDropdown();
  }, []);
  const onChangeDate = (e) => {
    if (moment().diff(moment(e), "years") > 10) {
      return true;
    } else {
      alert("Age must be greater than 10 years");
      return false;
    }
  };
  const formik = useFormik({
    initialValues: {
      first_name: studentdata.first_name,
      last_name: studentdata.last_name,
      gender_identity: studentdata.gender,
      //dob: studentdata.dob,
      street_address: studentdata.street_address,
      city: studentdata.city,
      state: studentdata.state,
      zip_code: studentdata.zip_code,
      profile_image: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formdata = {
        ...values,
        age: calculate_age(datePickerDate),
        dob: moment(datePickerDate).format("MM-DD-YYYY"),
        profile_image: uploadedImage,
      };
      if (onChangeDate(formdata.dob)) {
        dispatch(updateBasicProfileInfo(formdata));
      }
    },
  });
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

  return (
    <>
      <Navbar />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n.react-date-picker__inputGroup{\npadding: 10px;\n}\n.react-date-picker.react-date-picker--closed.react-date-picker--enabled {\n    margin-top: 0px !important;\n}\n.react-date-picker.react-date-picker--open.react-date-picker--enabled {\n    margin-top: 0px !important;\n}\n",
        }}
      />
      {loadform ? (
        <Grid container>
          <Grid
            item
            lg={10}
            sm={10}
            md={12}
            xs={12}
            className="m-auto informationSidebar my-4"
          >
            <Box sx={{ flexGrow: 1, display: "flex" }}>
              <Grid container>
                <Grid item lg={4} sm={4} md={12} xs={12}>
                  <TeacherAccSidebar />
                </Grid>
                <Grid item lg={8} sm={8} md={12} xs={12}>
                  <Box className="notificationSettings">
                    <Container>
                      <Grid container spacing={2}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            className="w-100 mb-2"
                          >
                            <InputLabel
                              shrink
                              htmlFor="student-name"
                              className="studentNameLabel"
                            >
                              First Name
                            </InputLabel>
                            <TextField
                              InputProps={{
                                inputProps: { minlength: "0", maxlength: "15" },
                              }}
                              type="string"
                              sx={{ mb: 1 }}
                              required
                              fullWidth
                              name="first_name"
                              id="name"
                              variant="standard"
                              placeholder="Dana"
                              className="StepsFields"
                              //defaultValue={formik.values.first_name?formik.values.first_name:studentdata.first_name}
                              value={formik.values.first_name}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.first_name &&
                            formik.touched.first_name ? (
                              <div className="error_message">
                                {formik.errors.first_name}
                              </div>
                            ) : null}
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            className="w-100 mb-2"
                          >
                            <InputLabel
                              shrink
                              htmlFor="student-name"
                              className="studentNameLabel"
                            >
                              Last Name
                            </InputLabel>
                            <TextField
                              InputProps={{
                                inputProps: { minlength: "0", maxlength: "7" },
                              }}
                              type="string"
                              sx={{ mb: 1 }}
                              required
                              fullWidth
                              name="last_name"
                              id="name"
                              variant="standard"
                              placeholder="Smith"
                              className="StepsFields"
                              value={formik.values.last_name}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.last_name &&
                            formik.touched.last_name ? (
                              <div className="error_message">
                                {formik.errors.last_name}
                              </div>
                            ) : null}
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
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
                              name="gender_identity"
                              value={formik.values.gender_identity}
                              onChange={formik.handleChange}
                              displayEmpty
                              className="StepsFields same_height_othrs"
                              inputProps={{ "aria-label": "Without label" }}
                            >
                              {genderValue.map((key, index) => {
                                return (
                                  <MenuItem
                                    value={index}
                                    className="d-block p-2"
                                  >
                                    {key}
                                  </MenuItem>
                                );
                              })}
                            </Select>
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            className="w-100 mb-2"
                          >
                            <InputLabel
                              shrink
                              htmlFor="student-name"
                              className="studentNameLabel"
                            >
                              Date of Birth
                            </InputLabel>
                            {/* <TextField
                              sx={{ mb: 1 }}
                              required
                              fullWidth
                              name="dob"
                              id="name"
                              type="date"
                              variant="standard"
                              placeholder="Please Select"
                              className="StepsFields date_birth"
                              value={formik.values.dob}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.dob && formik.touched.dob ? (
                              <div className="error_message">
                                {formik.errors.dob}
                              </div>
                            ) : null} */}
                            <DatePicker
                              onChange={setDatePickerDate}
                              value={datePickerDate}
                              maxDate={new Date()}
                            />
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            className="w-100 mb-2"
                          >
                            <InputLabel
                              shrink
                              htmlFor="student-name"
                              className="studentNameLabel"
                            >
                              Street Address
                            </InputLabel>
                            <TextField
                              InputProps={{
                                inputProps: { minlength: "0", maxlength: "30" },
                              }}
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
                            {formik.errors.street_address &&
                            formik.touched.street_address ? (
                              <div className="error_message">
                                {formik.errors.street_address}
                              </div>
                            ) : null}
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            className="w-100 mb-2"
                          >
                            <InputLabel
                              shrink
                              htmlFor="student-name"
                              className="studentNameLabel"
                            >
                              City
                            </InputLabel>
                            <TextField
                              InputProps={{
                                inputProps: { minlength: "0", maxlength: "30" },
                              }}
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
                              <div className="error_message">
                                {formik.errors.city}
                              </div>
                            ) : null}
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            className="w-100 mb-2 back_white"
                          >
                            <InputLabel
                              shrink
                              htmlFor="student-name"
                              className="studentNameLabel"
                            >
                              State
                            </InputLabel>
                            {/* <TextField sx={{ mb: 1 }} 
                                            required
                                            fullWidth
                                            name="name"
                                            id="name"
                                            variant="standard"
                                            placeholder=""
                                            className="StepsFields"
                                        /> */}
                            <Select
                              sx={{ mb: 1 }}
                              name="state"
                              // value={Gender}
                              //onChange={handleChange}
                              value={formik.values.state}
                              onChange={formik.handleChange}
                              className="StepsFields state_fields"
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
                              <div className="error_message">
                                {formik.errors.state}
                              </div>
                            ) : null}
                          </FormControl>
                        </Grid>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                          <FormControl
                            variant="standard"
                            className="w-100 mb-2"
                          >
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
                              placeholder=""
                              className="StepsFields zip_area_info"
                              value={formik.values.zip_code}
                              onChange={formik.handleChange}
                            />
                            {formik.errors.zip_code &&
                            formik.touched.zip_code ? (
                              <div className="error_message">
                                {formik.errors.zip_code}
                              </div>
                            ) : null}
                          </FormControl>
                        </Grid>
                      </Grid>
                      <Button className="saveBtn" onClick={formik.handleSubmit}>
                        Save
                      </Button>
                    </Container>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Grid>
        </Grid>
      ) : (
        ""
      )}
    </>
  );
};

export default EditBasicInformation;
