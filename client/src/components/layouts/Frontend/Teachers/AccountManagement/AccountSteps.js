import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Navbar from "../../Navbar";
import { useFormik } from "formik";
import * as yup from "yup";
import CustomStepper from "../CreateClass/CustomStepper";
import { BsArrowLeft } from "react-icons/bs";
import AccountStep1 from "./AccountStep1";
import AccountStep2 from "./AccountStep2";
import { useDispatch } from "react-redux";
import moment from "moment";
import {
  updateBasicProfileInfo,
  updateBasicProfileInfo2,
} from "../../../../../actions/frontent";
import { useHistory } from "react-router-dom";

const validationSchema = yup.object({
  first_name: yup.string().required(" First Name is required"),
  last_name: yup.string().required(" Last Name is required"),
  // dob:yup.string()
  // .required("DOB is required")
  // .test("DOB", "Your date of birth should be greater than 10", (value) => {
  //   return moment().diff(moment(value), "years") >= 10;
  // }),
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

const SecondvalidationSchema = yup.object({
  expertise: yup.string().required("Required"),
  about_expertise: yup.string().required("Required"),
});

const steps = ["", "Step 1 Basic Information", "Step 2 Teacher profile"];
const AccountSteps = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const [uploadVideo, setUploadVideo] = React.useState("");
  const [uploadedImage, setUploadedImage] = React.useState(
    "https://mymentorbucket.s3.us-east-2.amazonaws.com/user.png"
  );
  const [tags, settags] = React.useState([
    "Urban Dance",
    "Street Style",
    "Fitness",
  ]);
  const [datePickerDate, setDatePickerDate] = React.useState();

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
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formData = {
        ...values,
        age: calculate_age(datePickerDate),
        dob: moment(datePickerDate).format("MM-DD-YYYY"),
      };
      // console.log(values , "values")
      if (onChangeDate(formData.dob)) {
        dispatch(updateBasicProfileInfo(formData)).then((res) => {
          progress < 100 ? setProgress((prev) => prev + 1) : nextStep();
          setActiveStep(activeStep + 1);
        });
      }
    },
  });

  const Secondformik = useFormik({
    initialValues: {
      profile_image: "",
      gallery_video: "",
      expertise: "",
      about_expertise: "",
      planned_topics: [],
    },
    validationSchema: SecondvalidationSchema,
    onSubmit: (values) => {
      const formData = {
        ...values,
        profile_image: uploadedImage,
        gallery_video: uploadVideo,
        planned_topics: tags,
      };
      dispatch(updateBasicProfileInfo2(formData)).then((res) => {
        localStorage.setItem("profile_created", res.data.profile_created);
        if (res) {
          history.push("/teacher/dashboard");
        }
      });
    },
  });

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
    if (profile_created == true) {
      // console.log(profile_created, "profile_created");
      history.push("/teacher/dashboard");
    }
  }, []);
  return (
    <Box>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n.react-date-picker__inputGroup{\npadding: 10px;\n}\n.react-date-picker.react-date-picker--closed.react-date-picker--enabled {\n    margin-top: 0px !important;\n}\n.react-date-picker.react-date-picker--open.react-date-picker--enabled {\n    margin-top: 0px !important;\n}\n",
        }}
      />
      <Navbar />
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
                    Create your teacher profile
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
                  Create your teacher profile
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
                  <AccountStep1
                    formik={formik}
                    datePickerDate={datePickerDate}
                    setDatePickerDate={setDatePickerDate}
                  />
                </div>
              ) : activeStep === 2 ? (
                <div>
                  <AccountStep2
                    Secondformik={Secondformik}
                    setUploadedImage={setUploadedImage}
                    setUploadVideo={setUploadVideo}
                    uploadedImage={uploadedImage}
                    uploadVideo={uploadVideo}
                    settags={settags}
                    tags={tags}
                  />
                </div>
              ) : (
                0
              )}
              <Box className="NextPrevBtns">
                <Box ClassName="text-end btnn--outerr">
                  <Button
                    variant="contained"
                    onClick={
                      activeStep == 1
                        ? formik.handleSubmit
                        : Secondformik.handleSubmit
                    }
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

export default AccountSteps;
