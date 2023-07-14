import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import Avatar from "@mui/material/Avatar";
import StudentAccSidebar from "./StudentAccSidebar";
import TextField from "@mui/material/TextField";
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
import S3 from "react-aws-s3";
import { updateBasicProfileInfoOfStudent } from "../../../../../actions/frontent";
import StudentNavbar from "../StudentNavbar";
import spinner from "../../../spinner.gif";
import DatePicker from "react-date-picker";
import { Button, Checkbox, List, ListItem } from "@mui/material";

const validationSchema = yup.object({
  first_name: yup.string().required(" First Name is required"),
  last_name: yup.string().required(" Last Name is required"),
  // dob: yup
  //   .string()
  //   .required("DOB is Required")
  //   .test("DOB", "Age must be greater than 10 years", (value) => {
  //     return moment().diff(moment(value), "years") >= 10;
  //   }),
  street_address: yup.string().required("Address is required"),
  city: yup.string().required("City name is required"),
  state: yup.string().required("State is required"),
  zip_code: yup
    .string()
    .required("Zip code is required")
    .matches(/^[0-9]+$/, "Must be only digits")
    .min(4, "Zip code is not Valid")
    .max(6, "Zip code is not Valid"),
});
const BasicInformation = () => {
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

  const [genderValue, setgenderValue] = React.useState([]);
  const [stateValue, setstateValue] = React.useState([]);
  const [studentdata, setstudentData] = React.useState();
  const [uploadedImage, setUploadedImage] = React.useState();
  const [loadform, setloadform] = useState(false);
  const [ImageError, setImageError] = useState(false);
  const [ImageSizeError, setImagesizeError] = useState(false);
  const [loading, setloading] = React.useState(false);
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [topics, settopics] = React.useState([]);
  const [selectfeilds, setselectfeilds] = React.useState([]);

  const handleChange = (event) => {
    var updatedList = [...topics];
    if (event.target.checked) {
      updatedList = [...topics, event.target.value];
    } else {
      updatedList.splice(topics.indexOf(event.target.value), 1);
    }
    settopics(updatedList);
  };

  useEffect(() => {
    dispatch(getStudentPublicProfile())
      .then((res) => {
        setstudentData(res?.data);
        settopics(res?.data.topics);

        if (res?.data?.dob && res?.data?.dob != "") {
          setDatePickerDate(new Date(res?.data?.dob));
        }
        setUploadedImage(res?.data?.profile_image);
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
      first_name: studentdata?.first_name,
      last_name: studentdata?.last_name,
      gender_identity: studentdata?.gender,
      //dob: studentdata?.dob,
      street_address: studentdata?.street_address,
      city: studentdata?.city,
      state: studentdata?.state,
      zip_code: studentdata?.zip_code,
      profile_image: "",
      topics: topics,
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
        dispatch(updateBasicProfileInfoOfStudent(formdata));
      }
    },
  });

  const getDropdown = () => {
    dispatch(getDropdownValues())
      .then((res) => {
        if (res && res.success) {
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
          setselectfeilds(
            res.data.filter((a) => {
              if (a.name == "topics") {
                return a;
              }
            })[0].options
          );
        }
      })
      .catch((err) => {
        console.log(err, " error");
      });
  };

  const onChangePicture = (e) => {
    if (e.target.files[0]) {
      const file = e.target.files[0];
      const newFileName = Date.now() + e.target.files[0].name;
      const config = {
        bucketName: "mymentorbucket",
        //dirName: "portfolio",
        region: "us-east-2",
        accessKeyId: "AKIAR24QKRRD7IO5GTGZ",
        secretAccessKey: "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",
      };
      const ReactS3Client = new S3(config);
      const fileSize = file.size / 1024 / 1024; // in MiB
      if (fileSize > 2) {
        setImagesizeError(true);
      } else if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
        setImageError(true);
      } else {
        setloading(true);
        setImageError(false);
        ReactS3Client.uploadFile(file, newFileName).then((data) => {
          setUploadedImage(data.location);
          setloading(false);
          if (data.status === 204) {
            console.log("berhasil diupload");
          } else {
            console.log("gagal");
          }
        });
      }
    }
  };

  return (
    <>
      <StudentNavbar />
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n.react-date-picker__inputGroup{\npadding: 10px;\n}\n.react-date-picker.react-date-picker--closed.react-date-picker--enabled {\n    margin-top: 0px !important;\n}\n.react-date-picker.react-date-picker--open.react-date-picker--enabled {\n    margin-top: 0px !important;\n}\n",
        }}
      />
      <style dangerouslySetInnerHTML={{__html: "\nli.account {\n    width: unset !important\n    }\n" }} />
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
                  <StudentAccSidebar />
                </Grid>
                <Grid item lg={8} sm={8} md={12} xs={12}>
                  <Box className="notificationSettings">
                    <Container>
                      <Box className="uploadImage my-4">
                        <FormControl
                          variant="standard"
                          className="w-100 uploadfield"
                        >
                          <TextField
                            sx={{ mb: 1 }}
                            required
                            fullWidth
                            type="file"
                            onChange={onChangePicture}
                          />
                        </FormControl>
                        <Box className="UploadImageIcon teacherProfile d-flex align-items-center">
                          <Avatar
                            alt="profile"
                            src={loading ? spinner : uploadedImage}
                          />
                          <Box className="ms-4">
                            <Typography
                              variant="h5"
                              gutterBottom
                              component="div"
                              className="uploadInstructions"
                            >
                              {" "}
                              Upload a cover picture{" "}
                            </Typography>
                            <Typography
                              variant="caption"
                              display="block"
                              gutterBottom
                              className={
                                ImageSizeError ? "error_message" : "subtextt"
                              }
                            >
                              {ImageError ? (
                                <div className="error_message">
                                  {" "}
                                  Only Image is Supported
                                </div>
                              ) : (
                                "Less than 2MB"
                              )}
                            </Typography>
                          </Box>
                        </Box>
                      </Box>
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
                                inputProps: { minlength: "0", maxlength: "10" },
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
                              className="StepsFields student_gendr"
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
                            className="w-100 mb-2 date_birth"
                          >
                            <InputLabel
                              shrink
                              htmlFor="student-name"
                              className="studentNameLabel"
                            >
                              Date of Birth
                            </InputLabel>
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
                                inputProps: { minlength: "0", maxlength: "20" },
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
                                inputProps: { minlength: "0", maxlength: "10" },
                              }}
                              type="string"
                              sx={{ mb: 1 }}
                              required
                              fullWidth
                              name="city"
                              id="name"
                              variant="standard"
                              placeholder=""
                              className="StepsFields"
                              value={formik.values.city}
                              onChange={formik.handleChange}
                            />
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
                            className="w-100 mb-2"
                          >
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
                              value={formik.values.state}
                              onChange={formik.handleChange}
                              className="StepsFields stud_field_state"
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

                        <Grid item lg={12} md={12} sm={12} xs={12}>
                          <ul className="multiSlectors">
                            {
                              <List
                                row
                                sx={{
                                  "--List-gap": "0px",
                                  "--List-item-radius": "20px",
                                  flexWrap: "wrap",
                                  gap: 1,
                                  width:"100%"
                                }}
                              >
                                {selectfeilds?.map((item, index) => (
                                  <ListItem key={index} className="account">
                                    <Checkbox
                                      overlay
                                      value={index}
                                      disableIcon
                                      variant="soft"
                                      InputLabel={item}
                                      defaultChecked={topics.includes(index)}
                                      onChange={(e) => handleChange(e)}
                                    />
                                    {item}
                                  </ListItem>
                                ))}
                              </List>
                            }
                          </ul>
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

export default BasicInformation;
