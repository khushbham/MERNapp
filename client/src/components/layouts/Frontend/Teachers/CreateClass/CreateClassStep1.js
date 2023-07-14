import React, { useEffect } from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import CustomStepper from "./CustomStepper";
import StepOneContent from "./StepOneContent";
import StepTwoContent from "./StepTwoContent";
import Navbar from "../../../Frontend/Navbar";
import { useFormik } from "formik";
import { BsArrowRight } from "react-icons/fa";
import StepThreeContent from "./StepThreeContent";
import StepFourthContent from "./StepFourthContent";
import SingleClassStep3 from "./SingleClassStep3";
import CourseSessionStep3 from "./CourseSessionStep3";
import CourseScheduleStep4 from "./CourseScheduleStep4";
import * as yup from "yup";
import { BsArrowLeft } from "react-icons/bs";
import { CreateClass, getTags } from "../../../../../actions/frontent";
import { useDispatch } from "react-redux";
import { useHistory } from "react-router-dom";
import ClassScheduleStep4 from "./ClassScheduleStep4";
import moment from "moment";

const steps = [
  "",
  "Step 3 On Demand Session Settings",
  "Step 3 Single Class Session Settings",
  "Step 3 Course Session Settings",
  "Step 3 Course Session Settings",
];
const step3Text = [
  "",
  "Step 3 On Demand Session Settings",
  "Step 3 Single Class Session Settings",
  "Step 3 Course Session Settings",
];
const step4Text = [
  "",
  "Step 4 Class Schedule",
  "Step 4 Class Schedule",
  "Step 4 Course Schedule",
];

let patternTwoDigisAfterComma = /^\d+(\.\d{0,2})?$/;

const validationSchema = yup.object({
  discipline: yup.string().trim().required("Discipline is required"),
  class_title: yup.string().trim().required("Class title is required"),
  class_subtitle: yup.string().trim().required("Class subtitle is required"),
  class_description: yup
    .string()
    .trim()
    .required("Class description is required"),
  class_level: yup.string().required("Class level is required"),
  session_type: yup.string().required("Session Type is required"),
  language_of_class: yup
    .string()
    .trim()
    .required("Language of Class is required"),
  price: yup
    .number()
    .typeError("Price must be a number")
    .required("Price must be numerical.")
    .test(
      "is-decimal",
      "The Price should be a decimal with maximum two digits after comma",
      (val) => {
        if (val != undefined) {
          return patternTwoDigisAfterComma.test(val);
        }
        return true;
      }
    )
    .min(1, "minimum 1")
    .required("Price is required"),
});

const CreateClassStep1 = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [activeStep, setActiveStep] = React.useState(1);
  const [progress, setProgress] = React.useState(0);
  const [classType, setClassType] = React.useState(0);
  const [addressmessage, setAddressmessage] = React.useState(false);
  const [sessionerror, setSessionerror] = React.useState(false);
  const [sessiontypeerror, setSessiontypeerror] = React.useState(false);
  const [priceerror, setPriceerror] = React.useState(false);
  const [maxerror, setMaxerror] = React.useState(false);
  const [ImageError, setImageError] = React.useState(false);
  const [all, setAll] = React.useState(false);
  const [imageerrMessage, setimageerrMessage] = React.useState("");
  const [uploadedImage, setUploadedImage] = React.useState("");
  const [tags, settags] = React.useState([]);
  const [arrayOptions, setArrayOptions] = React.useState([
    { class_date: "", class_start_time: "", class_end_time: "" },
  ]);
  const [arrayOptionsForCourse, setArrayOptionsForCourse] = React.useState([
    { class_date: "", class_start_time: "", class_end_time: "" },
    { class_date: "", class_start_time: "", class_end_time: "" },
  ]);
  const [tagstext, settagstext] = React.useState([]);
  const [tagsId, settagsId] = React.useState([]);
  const [address, setAddress] = React.useState("");
  const [cordinates, setcordinates] = React.useState({});

  useEffect(() => {
    settagstext(
      tags.map((arr) => {
        return {
          tag_name: arr,
          tag_type: 2,
        };
      })
    );
  }, [tags]);

  const tags_text = () => {
    var tagObj = {
      "tags": tagstext,
      "added_tags": tags
  }
    dispatch(getTags(tagObj))
      .then((res) => {
        settagsId(res.data);
      })
      .catch((err) => {
        // console.log(err);
      });
  };

  const checkarray = (arr) => {
    for (let i = 0; i < arr.length; i++) {
      if (
        arr[i].class_date == "" &&
        arr[i].class_start_time == "" &&
        arr[i].class_end_time == ""
      ) {
        return false;
      }
    }
    return true;
  };
  const formik = useFormik({
    initialValues: {
      discipline: "",
      topics: [],
      topics_text: [],
      class_title: "",
      class_subtitle: "",
      class_description: "",
      class_level: "",
      language_of_class: "",
      type_of_class: "",
      session_duration: "",
      session_type: "",
      price: "",
      max_students_allowed: "",
      address_or_class_link: "",
      cover_image: "",
      class_detail: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      var updatedArrayOptions = arrayOptions.map(data => {
        return {
          class_date : moment(data.class_date).format("MM-DD-YYYY"),
          class_start_time : data.class_start_time,
          class_end_time : data.class_end_time,
        }
      });
      var updatedArrayOptionsForCourse = arrayOptionsForCourse.map(data => {
        return {
          class_date : moment(data.class_date).format("MM-DD-YYYY"),
          class_start_time : data.class_start_time,
          class_end_time : data.class_end_time,
        }
      })
      const formData = {
        discipline: values.discipline,
        topics: tagsId,
        topics_text: tags,
        class_title: values.class_title,
        class_subtitle: values.class_subtitle,
        class_description: values.class_description,
        class_level: values.class_level,
        language_of_class: values.language_of_class,
        session_duration: values.session_duration,
        session_type: values.session_type,
        price: values.price,
        max_students_allowed: values.max_students_allowed,
        type_of_class: classType,
        cover_image: uploadedImage,
        address_or_class_link: address,
        longitude: cordinates.lng,
        latitude: cordinates.lat,
        class_detail: (classType == 3 ? updatedArrayOptionsForCourse : updatedArrayOptions),
        class_created_from: "Wep app",
      };
      const status = checkarray(formData.class_detail);
      //console.log("formData",formData)
      if (
        classType == "1" ||
        (classType == "2" && status == true) ||
        (classType == "3" && status == true)
      ) {
        // console.log(formData)
        dispatch(CreateClass(formData))
          .then((res) => {
            if (res && res.success) {
              history.push("/teacher/class-confirmation");
            }else{
              console.log(res)
            }
          })
          .catch((err) => console.log("api error", err));
      } else {
        return alert("Plase fill class details!");
      }
    },
  });

  const handleNext = () => {
    tags_text(); 
    //for set the in form
    if ((!formik.values.discipline) || (!formik.values.class_title) || (!formik.values.class_subtitle) || (!formik.values.class_description) || (!formik.values.class_level) || (!formik.values.language_of_class ) || (uploadedImage == "")){
      formik.handleSubmit()
      if(!uploadedImage){
      setImageError(true)
      setimageerrMessage("Image Is Required") 
    }}
     else if ((activeStep == 3 && (classType == '1' ||classType == '2' || classType == '3' )) && !formik.values.session_type ) {
      console.log(formik.handleSubmit());
      setSessiontypeerror(true);
    }
     else if ((activeStep == 3 && ( classType == '2' ||classType == '1' || classType == '3')) && formik.values.session_type == 1 & !address) {
      setAddressmessage(true)
       console.log("Address is required")
    }
     else if ((activeStep == 3 && (classType == '1')) && !formik.values.price ) {
      setPriceerror(true)
       console.log("Price  is required")
    }
     else if ((activeStep == 3 && classType == '1') && !formik.values.session_duration) {
      setSessionerror(true)
       console.log("Session Duration is required")
    }
     else if ((activeStep == 3 && (classType == '2' || classType == '3' ) && !formik.values.max_students_allowed)) {
      setMaxerror(true)
      console.log("max students is required")
    }
     else {
      setSessiontypeerror(false);
      setImageError(false);
      setMaxerror(false);
      setSessionerror(false);
      setPriceerror(false);
      setAddressmessage(false);
      progress < 100 ? setProgress((prev) => prev + 1) : nextStep();
      setActiveStep(activeStep + 1);
  };
}

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

  const selectedTypeHandler = (val) => {
    setClassType(val);
  };

  return (
    <Box>
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
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="mb-0 py-2"
              >
                {" "}
                Create Class
              </Typography>

              <Box className="accountHeading">
                <CustomStepper
                  steps={steps}
                  current={activeStep}
                  progress={progress}
                />
                {activeStep == 1 && "Step 1 Class Details"}
                {activeStep == 2 && "Step 2 Class Type"}
                {activeStep == 3 && step3Text[classType]}
                {activeStep == 4 && step4Text[classType]}
              </Box>
              {activeStep === 1 && (
                <div>
                  <StepOneContent
                    formik={formik}
                    setUploadedImage={setUploadedImage}
                    uploadedImage={uploadedImage}
                    ImageError={ImageError}
                    setImageError={setImageError}
                    setimageerrMessage={setimageerrMessage}
                    imageerrMessage={imageerrMessage}
                    all={all}
                    setAll={setAll}
                    settags={settags}
                    tags={tags}
                    
                  />
                </div>
              )}
              {activeStep === 2 && (
                <div>
                  <StepTwoContent selectedTypeHandler={selectedTypeHandler} />
                </div>
              )}
              {activeStep === 3 && (
                <div>
                  {classType == 1 && (
                    <StepThreeContent
                      formik={formik}
                      setAddress={setAddress}
                      addressmessage={addressmessage}
                      setcordinates={setcordinates}
                      setAddressmessage={setAddressmessage}
                      sessionerror={sessionerror}
                      priceerror={priceerror}
                      sessiontypeerror={sessiontypeerror}
                    />
                  )}
                  {classType == 2 && (
                    <SingleClassStep3
                      formik={formik}
                      setAddress={setAddress}
                      setcordinates={setcordinates}
                      addressmessage={addressmessage}
                      maxerror={maxerror}
                    />
                  )}
                  {classType == 3 && (
                    <CourseSessionStep3
                      formik={formik}
                      setAddress={setAddress}
                      addressmessage={addressmessage}
                      setcordinates={setcordinates}
                      maxerror={maxerror}
                    />
                  )}
                </div>
              )}
              {activeStep === 4 && (
                <div>
                  {classType == 1 && <StepFourthContent formik={formik} />}
                  {classType == 2 && (
                    <ClassScheduleStep4
                      formik={formik}
                      setArrayOptions={setArrayOptions}
                      arrayOptions={arrayOptions}
                    />
                  )}
                  {classType == 3 && (
                    <CourseScheduleStep4
                      formik={formik}
                      setArrayOptions={setArrayOptionsForCourse}
                      arrayOptions={arrayOptionsForCourse}
                    />
                  )}
                </div>
              )}

              <Box className="NextPrevBtns">
                <Box className="text-end btnn--outerr">
                  {activeStep === steps.length - 1 ? (
                    <Button
                      variant="contained"
                      className="nextBttn mt-4"
                      onClick={formik.handleSubmit}
                    >
                      Finish
                    </Button>
                  ) : (
                    <Button
                      variant="contained"
                      onClick={handleNext}
                      className="nextBttn mt-4"
                      disabled={
                        activeStep == 2 && classType == 0 ? true : false
                      }
                    >
                      Next
                    </Button>
                  )}
                </Box>

                {activeStep > 1 ? (
                  <Box className="text-end btnn--outerr">
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

export default CreateClassStep1;
