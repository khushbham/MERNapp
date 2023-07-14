import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CustomStepper from "../../Teachers/CreateClass/CustomStepper";
import { useFormik } from "formik";
import * as yup from "yup";
import { BsArrowRight } from "react-icons/fa";
import { BsArrowLeft } from "react-icons/bs";
import StudentAccounts from "./StudentAccounts";
import StudentAccount2 from "./StudentAccount2";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  updateBasicProfileInfo,
  updateBasicProfileInfo2,
} from "../../../../../actions/frontent";
import { Redirect, useHistory } from "react-router-dom";
import StudentNavbar from "../StudentNavbar";

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
    .min(4, "Zip Code is not Valid ")
    .max(6, "Zip Code is not Valid"),
});

const steps = ["", "Step 1 Personal info", "Step 2 Topics"];
const MyAccounts = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [uploadedImage, setUploadedImage] = useState(
    "https://mymentorbucket.s3.us-east-2.amazonaws.com/user.png"
  );
  const [activeStep, setActiveStep] = React.useState(1);

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
  const [progress, setProgress] = React.useState(0);
  const [datePickerDate, setDatePickerDate] = useState();
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
      first_name: "",
      last_name: "",
      gender_identity: "",
      dob: "",
      street_address: "",
      city: "",
      state: "",
      zip_code: "",
      profile_image: uploadedImage,
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formdata = {
        ...values,
        age: calculate_age(datePickerDate),
        dob: moment(datePickerDate).format("MM-DD-YYYY"),
      };
      if (onChangeDate(formdata.dob)) {
        dispatch(updateBasicProfileInfo(formdata)).then((res) => {
          progress < 100 ? setProgress((prev) => prev + 1) : nextStep();
          setActiveStep(activeStep + 1);
        });
      }
    },
  });

  const [topics, settopics] = React.useState([]);
  const onSubmit = () => {
    const formdata = {
      topics: topics,
    };
    dispatch(updateBasicProfileInfo2(formdata)).then((res) => {
      localStorage.setItem("profile_created", res.data.profile_created);
      history.push("/student/dashboard");
    });
  };
  const handlePrev = () => {
    progress < 100 ? setProgress((prev) => prev + 1) : prevStep();
    setActiveStep(activeStep - 1);
  };
  const nextStep = () => {
    setProgress(0);
    setActiveStep((prev) => prev + 1);
  };
  const prevStep = () => {
    setProgress(0);
    setActiveStep((next) => next - 1);
  };

  useEffect(() => {
    const profile_created = localStorage.getItem("profile_created");
    // alert(profile_created)
    if (profile_created == true) {
      history.push("/student/dashboard");
    }
  }, []);
  return (
    <Box>
      <StudentNavbar />
      <Box className="classesWrap">
        <Container>
          <Grid container>
            <Grid
              item
              lg={6}
              md={7}
              sm={12}
              className="m-auto StepsContentWrapper"
            >
              {activeStep === 1 ? (
                <Box className="mb-1">
                  <Typography
                    variant="h3"
                    gutterBottom
                    component="div"
                    className="mb-0"
                  >
                    {" "}
                    Create your student profile
                  </Typography>
                </Box>
              ) : activeStep === 2 ? (
                <Typography
                  variant="h3"
                  gutterBottom
                  component="div"
                  className="mb-0"
                >
                  {" "}
                  Create your student profile
                </Typography>
              ) : (
                0
              )}
              <Box className="accountHeading">
                <CustomStepper
                  steps={steps}
                  current={activeStep}
                  progress={progress}
                />
                {activeStep === 1 ? steps[1] : activeStep === 2 ? steps[2] : ""}
              </Box>
              {activeStep === 1 ? (
                <div>
                  <StudentAccounts
                    formik={formik}
                    setUploadedImage={setUploadedImage}
                    uploadedImage={uploadedImage}
                    datePickerDate={datePickerDate}
                    setDatePickerDate={setDatePickerDate}
                  />
                </div>
              ) : activeStep === 2 ? (
                <div>
                  <StudentAccount2 settopics={settopics} topics={topics} />
                </div>
              ) : (
                0
              )}
              <Box className="NextPrevBtns">
                <Box ClassName="text-end btnn--outerr">
                  <Button
                    variant="contained"
                    onClick={activeStep === 1 ? formik.handleSubmit : onSubmit}
                    className="nextBttn mt-4"
                  >
                    {activeStep === 2 ? "Finish" : "Next"}
                  </Button>
                </Box>

                {activeStep > 1 ? (
                  <Box ClassName="text-end btnn--outerr">
                    <Button
                      variant="contained"
                      onClick={handlePrev}
                      className="PrevBttn mt-4"
                    >
                      <BsArrowLeft className="me-2" /> Previous
                    </Button>
                  </Box>
                ) : (
                  ""
                )}
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default MyAccounts;
