import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import Container from "@mui/material/Container";
import Avatar from "@mui/material/Avatar";
import MenuItem from "@mui/material/MenuItem";
import Select from "@mui/material/Select";
import * as yup from "yup";
import { useFormik } from "formik";
import { ImCross } from "react-icons/im";
import Navbar from "../../Navbar";
import { useDispatch } from "react-redux";
import {
  getClassDetailForEdit,
  getDropdownValues,
  getTags,
  updateClass,
  deleteClass,
} from "../../../../../actions/frontent";
import S3 from "react-aws-s3";
import spinner from "../../../spinner.gif";
import { Button } from "@mui/material";
import { useHistory } from "react-router-dom";

const TagTopicInput = ({ tags, settags }) => {
  // const [tagtopicData, settagtopicData] = React.useState(tags);
  const removetagtopicData = (indexToRemove) => {
    settags([...tags.filter((_, index) => index !== indexToRemove)]);
  };
  const addtagtopicData = (event) => {
    if (event.target.value !== "") {
      settags([...tags, event.target.value]);
      event.target.value = "";
    }
  };

  return (
    <div className="tag-topic-input no-top-margin">
      <ul className="tags-topic">
        {tags.map((tag, index) => (
          <li key={index} className="tag-topic">
            <span className="tag-topic-title">{tag}</span>
            <span
              className="tag-topic-close-icon"
              onClick={() => removetagtopicData(index)}
            >
              x
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        onKeyUp={(event) =>
          event.key === "Enter" ? addtagtopicData(event) : null
        }
        placeholder="Press enter to add a topic"
      />
    </div>
  );
};

const validationSchema = yup.object({
  discipline: yup.string().required("discipline is required"),
  class_title: yup.string().required("class title is required"),
  class_subtitle: yup.string().required("Class Subtitle is Required"),
  class_description: yup.string().required("Class Description is required"),
  class_level: yup.number().required("Class level is required"),
  language_of_class: yup.string().required("language of class is required"),
  price: yup.string().required("Price is required"),
});
const EditClassDetails = () => {
  const dispatch = useDispatch();
  const history = useHistory()

  const [classDetails, setclassDetails] = useState();
  const [sessiontype, setSessiontype] = React.useState();
  const [class_level, setclass_level] = React.useState();
  const [type_of_class, settype_of_class] = React.useState();
  const [uploadedImage, setUploadedImage] = React.useState({});
  const [loading, setloading] = React.useState(false);
  const [ImageError, setImageError] = useState(false);
  const [ImageSizeError, setImagesizeError] = useState(false);
  const [tags, settags] = React.useState([
    "Urban Dance",
    "Street Style",
    "Fitness",
  ]);
  const [tagstext, settagstext] = React.useState([]);
  const [tagsId, settagsId] = React.useState([]);
  const queryParams = new URLSearchParams(window.location.search);
  const id = queryParams.get("Id");
  const [defaultClassLevel, ClassLevelChange] = useState(0);
  const getClassDetail = () => {
    dispatch(getClassDetailForEdit(id))
      .then((res) => {
        if(res.success){
            setclassDetails(res?.data);
            settags(res.data?.topics_text);
            setUploadedImage(res.data?.cover_image);
            ClassLevelChange(res?.data?.class_level)
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    dispatch(getDropdownValues()).then((res) => {
      console.log(res.data, "dropdown");
      setSessiontype(
        res.data.filter((a) => {
          if (a.name == "session_type") {
            return a;
          }
        })[0].options
      );

      setclass_level(
        res.data.filter((a) => {
          if (a.name == "class_level") {
            return a;
          }
        })[0].options
      );

      settype_of_class(
        res.data.filter((a) => {
          if (a.name == "classes") {
            return a;
          }
        })[0].options
      );
    });
    getClassDetail();
  }, []);

  const tags_text = () => {
    dispatch(getTags(tagstext))
      .then((res) => {
        // console.log(res.data)
        settagsId(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    settagstext(
      tags.map((arr) => {
        return {
          tag_name: arr,
          tag_type: 2,
        };
      })
    );
    tags_text();
  }, [tags]);
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
        setImageError(false);
        setloading(true);
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

  const formik = useFormik({
    initialValues: {
      discipline: classDetails?.discipline,
      class_title: classDetails?.class_title,
      class_subtitle: classDetails?.class_subtitle,
      class_description: classDetails?.class_description,
      class_level: classDetails?.class_level,
      language_of_class: classDetails?.language_of_class,
      price: classDetails?.price,
      session_type: classDetails?.session_type,
      type_of_class: classDetails?.type_of_class,
      cover_image: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formdata = {
        ...values,
        topics: tagsId,
        topics_text: tags,
        cover_image: uploadedImage,
        class_level: defaultClassLevel
      };
      dispatch(updateClass(id, formdata)).then((res) => {
        if (res && res.success) {
          getClassDetail();
        }
      });
    },
  });

  const handleDelete = () => {
    if(window.confirm("Do you really want to delete this class ?")){
      dispatch(deleteClass(id)).then((res) => {
        if (res && res.success) {
          console.log(history)
          history.push("/teacher/teacher-profile")
        }
      });
    }
    
  }
  return (
    formik && (
      <>
        <Navbar />
        <Grid container>
          <Grid
            item
            lg={7}
            sm={10}
            md={12}
            xs={12}
            className="m-auto informationSidebar my-4"
          >
            <Grid
              item
              lg={12}
              sm={8}
              md={12}
              xs={12}
              className="teacherInfoWrap pt-3 p-5"
            >
              <Box>
                <Typography
                  variant="h4"
                  component="h2"
                  className="notifyHead mb-2"
                >
                  Edit Class
                </Typography>
                <Grid Container>
                  <Grid item lg={12} xs={12} sm={12}>
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
                            {" "}
                            {ImageError ? (
                              <div className="error_message">
                                {" "}
                                Only Image is Supported
                              </div>
                            ) : (
                              "Less than 2MB"
                            )}{" "}
                          </Typography>
                        </Box>
                      </Box>
                    </Box>

                    <FormControl variant="standard" className="w-100 mb-2">
                      <InputLabel
                        shrink
                        htmlFor="student-name"
                        className="studentNameLabel"
                      >
                        Discipline
                      </InputLabel>
                      <TextField
                        sx={{ mb: 1 }}
                        required
                        fullWidth
                        name="discipline"
                        id="name"
                        variant="standard"
                        placeholder="Smith"
                        className="StepsFields"
                        value={formik.values.discipline}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.discipline && formik.touched.discipline ? (
                        <div className="error_message">
                          {formik.errors.discipline}
                        </div>
                      ) : null}
                    </FormControl>
                    <FormControl variant="standard" className="w-100 mb-2">
                      <InputLabel
                        shrink
                        htmlFor="student-name"
                        className="studentNameLabel"
                      >
                        Class title
                      </InputLabel>
                      <TextField
                        sx={{ mb: 1 }}
                        required
                        fullWidth
                        name="class_title"
                        id="name"
                        variant="standard"
                        placeholder="Weber"
                        className="StepsFields"
                        value={formik.values.class_title}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.class_title &&
                      formik.touched.class_title ? (
                        <div className="error_message">
                          {formik.errors.class_title}
                        </div>
                      ) : null}
                    </FormControl>
                    <FormControl variant="standard" className="w-100 mb-2">
                      <InputLabel
                        shrink
                        htmlFor="student-name"
                        className="studentNameLabel"
                      >
                        Class Subtitle
                      </InputLabel>
                      <TextField
                        sx={{ mb: 1 }}
                        required
                        fullWidth
                        name="class_subtitle"
                        id="name"
                        variant="standard"
                        placeholder="Weber"
                        className="StepsFields"
                        value={formik?.values?.class_subtitle}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.class_subtitle &&
                      formik.touched.class_subtitle ? (
                        <div className="error_message">
                          {formik.errors.class_subtitle}
                        </div>
                      ) : null}
                    </FormControl>
                    <FormControl variant="standard" className="w-100 mb-2">
                      <InputLabel
                        shrink
                        htmlFor="student-name"
                        className="studentNameLabel"
                      >
                        Class Description
                      </InputLabel>
                      <TextField
                        sx={{ mb: 1 }}
                        required
                        fullWidth
                        name="class_description"
                        id="name"
                        variant="standard"
                        placeholder="Weber"
                        className="StepsFields"
                        value={formik.values?.class_description}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.class_description &&
                      formik.touched.class_description ? (
                        <div className="error_message">
                          {formik.errors.class_description}
                        </div>
                      ) : null}
                    </FormControl>
                    <FormControl variant="standard" className="w-100 mb-2">
                      <InputLabel
                        shrink
                        htmlFor="student-name"
                        className="studentNameLabel"
                      >
                        Language
                      </InputLabel>
                      <TextField
                        sx={{ mb: 1 }}
                        required
                        fullWidth
                        name="language_of_class"
                        id="name"
                        variant="standard"
                        placeholder="Weber"
                        className="StepsFields"
                        value={formik.values?.language_of_class}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.language_of_class &&
                      formik.touched.language_of_class ? (
                        <div className="error_message">
                          {formik.errors.language_of_class}
                        </div>
                      ) : null}
                    </FormControl>
                    <FormControl variant="standard" className="w-100 mb-2">
                      <InputLabel
                        shrink
                        htmlFor="student-name"
                        className="studentNameLabel"
                      >
                        Price
                      </InputLabel>
                      <TextField
                        sx={{ mb: 1 }}
                        required
                        fullWidth
                        name="price"
                        id="name"
                        variant="standard"
                        placeholder="Weber"
                        className="StepsFields"
                        value={formik.values?.price}
                        onChange={formik.handleChange}
                      />
                      {formik.errors.price && formik.touched.price ? (
                        <div className="error_message">
                          {formik.errors.price}
                        </div>
                      ) : null}
                    </FormControl>
                    {/* <FormControl className="W-100 SelectFields">
                                        <InputLabel shrink htmlFor="gender" className="studentNameLabel">
                                            Session type
                                        </InputLabel>
                                        <Select sx={{ mb: 1 }}
                                            name="session_type"
                                            className="StepsFields"
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            value={formik.values?.session_type}
                                            onChange={formik.handleChange}
                                        >
                                            {sessiontype?.map((key, index) => {
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
                                    </FormControl> */}

                    {/* 
                                    <FormControl className="W-100 SelectFields">
                                 <InputLabel shrink htmlFor="gender" className="studentNameLabel">
                                  Gender Identity
                                 </InputLabel>
                                 <Select
                                     value={genderstatus}
                                     onChange={handleGender}
                                     displayEmpty
                                     color="primary"
                                     className="StepsFields W-100"
                                     inputProps={{ 'aria-label': 'Without label' }}
                                 >
                                     <MenuItem value={0}>Female</MenuItem>
                                     <MenuItem value={1}>Male</MenuItem>
                                     <MenuItem value={2}>Other</MenuItem>
                                 </Select>
                                </FormControl>
                                 */}

                    <FormControl className="W-100 SelectFields mb-2">
                      <InputLabel
                        shrink
                        htmlFor="gender"
                        className="studentNameLabel"
                      >
                        Class level
                      </InputLabel>
                      {console.log(defaultClassLevel)}
                      <Select
                        value={defaultClassLevel}
                        name="class_level"
                        onChange={e => ClassLevelChange(e.target.value)}
                        displayEmpty
                        className="StepsFields"
                      >
                        {class_level?.map((arr, i) => {
                          return (
                            <MenuItem value={i} className="d-block p-2">
                              {arr}
                            </MenuItem>
                          );
                        })}
                      </Select>
                    </FormControl>
                    {/* <FormControl className="W-100 SelectFields">
                                        <InputLabel shrink htmlFor="gender" className="studentNameLabel">
                                            Type of Class
                                        </InputLabel>
                                        <Select sx={{ mb: 1 }}

                                            name="type_of_class"
                                            className="StepsFields"
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            value={formik.values?.type_of_class}
                                            onChange={formik.handleChange}
                                        >
                                            {type_of_class?.map((arr, i) => {
                                                return <MenuItem value={i} className="d-block p-2">{arr}</MenuItem>
                                            })}
                                        </Select>
                                    </FormControl> */}
                    {/* <FormControl className="selectDropdown w-100 mb-2">
                                        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
                                            How many students will be allowed to attend?
                                        </InputLabel>
                                        <Select sx={{ mb: 1 }}
                                            className="StepsFields"
                                            name='max_students_allowed'
                                            inputProps={{ 'aria-label': 'Without label' }}
                                            value={formik.values.max_students_allowed}
                                            onChange={formik.handleChange}
                                        >
                                            <MenuItem value={1} className="d-block p-2">1</MenuItem>
                                            <MenuItem value={2} className="d-block p-2">2</MenuItem>
                                            <MenuItem value={3} className="d-block p-2">3</MenuItem>
                                            <MenuItem value={4} className="d-block p-2">4</MenuItem>
                                            <MenuItem value={5} className="d-block p-2">5</MenuItem>
                                            <MenuItem value={6} className="d-block p-2">6</MenuItem>
                                            <MenuItem value={7} className="d-block p-2">7</MenuItem>
                                            <MenuItem value={8} className="d-block p-2">8</MenuItem>
                                            <MenuItem value={9} className="d-block p-2">9</MenuItem>
                                        </Select>
                                    </FormControl> */}
                    <FormControl variant="standard" className="w-100 mb-2">
                      <InputLabel
                        shrink
                        htmlFor="student-name"
                        className="studentNameLabel"
                      >
                        Topics
                      </InputLabel>
                      <TagTopicInput tags={tags} settags={settags} />
                      {/* <TextField sx={{ mb: 1 }} 
                                            required
                                            fullWidth
                                            name="name"
                                            id="name"
                                            variant="standard"
                                            placeholder="Enter one or more topics"
                                            className="StepsFields"
                                        /> */}
                    </FormControl>
                    <Box
                      sx={{
                        display: "flex",
                        flexWrap: "wrap",
                      }}
                    >
                      {classDetails?.topics_text?.map((arr, idx) => {
                        return (
                          <Link href="#" className="TopicLinks mb-2">
                            {arr}
                          </Link>
                        );
                      })}
                    </Box>
                    <Grid item lg={6} xs={12} sm={12} className="m-auto">
                      <Button className="saveBtn" onClick={formik.handleSubmit}>
                        Confirm modifications
                      </Button>
                    </Grid>
                    <Grid item lg={6} xs={12} sm={12} className="m-auto mt-3">
                      <Button className="saveBtn" onClick={() => handleDelete()}>
                        Delete Class
                      </Button>
                    </Grid>
                  </Grid>
                </Grid>
              </Box>
            </Grid>
          </Grid>
        </Grid>
      </>
    )
  );
};

export default EditClassDetails;
