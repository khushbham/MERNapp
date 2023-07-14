import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Navbar from "../../Navbar";
import { useFormik } from "formik";
import * as yup from "yup";
import { Link } from "react-router-dom";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import Input from "@mui/material/Input";
import TeacherAccSidebar from "./TeacherAccSidebar";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import Avatar from "@mui/material/Avatar";
import { useDispatch } from "react-redux";
import { GrAddCircle } from "react-icons/gr";
import {
  getTeacherPublicProfile,
  updateBasicProfileInfo2,
} from "../../../../../actions/frontent";
import S3 from "react-aws-s3";
import spinner from "../../../spinner.gif";
import { Button } from "@mui/material";

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
    <div className="tag-topic-input no-tags-margin">
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
const SecondvalidationSchema = yup.object({
  expertise: yup.string().required("Required"),
  about_expertise: yup.string().required("Required"),
});
const EditTeacherProfile = () => {
  const dispatch = useDispatch();
  const [teacherData, setteacherData] = useState({});
  const [uploadVideo, setUploadVideo] = React.useState({});
  const [loading, setloading] = React.useState(false);
  const [videoloading, setvideoloading] = React.useState(false);
  const [uploadedImage, setUploadedImage] = React.useState({});
  const [ImageError, setImageError] = useState(false);
  const [VideoerrMsg, setVideoErrorMsg] = useState("");
  const [ImageSizeError, setImagesizeError] = useState(false);
  const [imageerrMessage, setimageerrMessage] = useState("");

  const [tags, settags] = React.useState([
    "Urban Dance",
    "Street Style",
    "Fitness",
  ]);

  const Secondformik = useFormik({
    initialValues: {
      profile_image: "",
      intro_video: "",
      expertise: teacherData.expertise,
      about_expertise: teacherData.about_expertise,
      planned_topics: [],
    },
    validationSchema: SecondvalidationSchema,
    enableReinitialize: true,
    onSubmit: (values) => {
      const formdata = {
        ...values,
        profile_image: uploadedImage,
        intro_video: uploadVideo,
        planned_topics: tags,
      };
      dispatch(updateBasicProfileInfo2(formdata)).then((res) => {
        console.log(res);
        // history.push("/teacher/dashboard")
      });
    },
  });
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
      if (!file.name.match(/\.(jpg|jpeg|png)$/)) {
        setImageError(true);
        setimageerrMessage("File format is not supported");
      } else if (fileSize > 2) {
        setImagesizeError(true);
        setimageerrMessage("Less than 2MB");
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
  const onUploadVideo = (e) => {
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
      var mbSize = file.size / 1024 / 1024;
      if (mbSize > 100) {
        setImageError(true);
        setVideoErrorMsg("Video size shoud be less 200mb");
      } else if (!file.name.match(/\.(mp4|mov)$/)) {
        setImageError(true);
        setVideoErrorMsg("This File Format is Not Accepted ");
      } else {
        setImageError(false);
        setvideoloading(true);
        ReactS3Client.uploadFile(file, newFileName).then((data) => {
          console.log(data.location, "location");
          setUploadVideo(data.location);
          if (data.status === 204) {
            setvideoloading(false);
            console.log("berhasil diupload");
          } else {
            console.log("gagal");
          }
        });
      }
    }
  };

  useEffect(() => {
    dispatch(getTeacherPublicProfile())
      .then((res) => {
        setteacherData(res.data);
        setUploadedImage(res.data.profile_image);
        setUploadVideo(res.data.intro_video);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);

  return (
    <>
      <Navbar />
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
              <Grid
                item
                lg={8}
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
                    Edit Teacher Profile
                  </Typography>

                  {/* <Box className="New_Upload_Section">
                                 <Box className="custom-teacherfile-upload">
                                      
                                      <Box className="d-flex">
                                      <Avatar className="teacher_cover_edit" alt="profile" src={loading ? spinner : uploadedImage} /> 
                                      <Box className="ms-4 main-upld">
                                            <Typography variant="h5" gutterBottom component="div" className="uploadInstructions">  Upload a cover picture </Typography>
                                            <Typography variant="caption" display="block" gutterBottom className={ImageError?"error_message":"subtextt"}>{ImageError ? imageerrMessage : 'Less than 2MB'} </Typography>    
                                        </Box>
                                      </Box>
                                  </Box>
                                  <input required id="file-upload-image-teacher" onChange={onChangePicture} type="file"/>
                                 </Box> */}

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
                        className="hover-cursor"
                        onChange={onChangePicture}
                      />
                    </FormControl>
                    <Box className="UploadImageIcon teacherProfile d-flex align-items-center">
                      <Avatar
                        className="teacher_cover_edit"
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
                      What is your expertise?{" "}
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      InputProps={{
                        inputProps: { minlength: "0", maxlength: "25" },
                      }}
                      name="expertise"
                      id="name"
                      variant="standard"
                      placeholder="e.g. yoga instructor, dance teacher"
                      className="StepsFields what-expertise"
                      // defaultValue={teacherData.expertise}
                      value={Secondformik.values.expertise}
                      onChange={Secondformik.handleChange}
                    />
                    {Secondformik.errors.expertise &&
                    Secondformik.touched.expertise ? (
                      <div className="error_message">
                        {Secondformik.errors.expertise}
                      </div>
                    ) : null}
                  </FormControl>
                  <FormControl variant="standard" className="w-100 mb-2">
                    <InputLabel
                      shrink
                      htmlFor="student-name"
                      className="studentNameLabel"
                    >
                      Tell us a little about that
                    </InputLabel>
                    <TextareaAutosize
                      sx={{ mb: 1 }}
                      aria-label="minimum height"
                      minRows={3}
                      placeholder="What makes you special at your expertise?"
                      className="StepsFields tell_us_field"
                      name="about_expertise"
                      value={Secondformik.values.about_expertise}
                      onChange={Secondformik.handleChange}
                    />
                    {Secondformik.errors.about_expertise &&
                    Secondformik.touched.about_expertise ? (
                      <div className="error_message">
                        {Secondformik.errors.about_expertise}
                      </div>
                    ) : null}
                  </FormControl>
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
                </Box>
                <Box className="TopicsWrap">
                  <Box
                    sx={{
                      display: "flex",
                      flexWrap: "wrap",
                    }}
                    className="Topics_tags_info"
                  >
                    {teacherData.planned_topics?.map((arr, idx) => {
                      {
                        console.log(arr, "arry");
                      }
                      return (
                        <Link href="#" className="TopicLinks mb-2">
                          {arr}
                        </Link>
                      );
                    })}

                    {/* <Link href="#" className="TopicLinks mb-2">
                                        Illustration
                                        </Link>
                                        <Link href="#" className="TopicLinks mb-2">
                                        Design business
                                        </Link>
                                        <Link href="#" className="TopicLinks mb-2">
                                        Characters
                                        </Link>
                                        <Link href="#" className="TopicLinks mb-2">
                                        Urban Graffitti
                                        </Link>
                                        <Link href="#" className="TopicLinks mb-2">
                                        Portfolio
                                        </Link>
                                        <Link href="#" className="TopicLinks mb-2">
                                        Editorial
                                        </Link> */}
                  </Box>
                </Box>
                <Box></Box>
                <Typography
                  variant="h4"
                  component="h3"
                  className="studentNameLabel mb-2"
                >
                  Gallery
                </Typography>
                {uploadVideo ? (
                  <div>
                    {uploadVideo && !videoloading ? (
                      <video width="320" height="240" controls preload="none">
                        <source
                          src={uploadVideo}
                          type="video/mp4"
                          autostart="false"
                        />
                        <source
                          src={uploadVideo}
                          type="video/ogg"
                          autostart="false"
                        />
                      </video>
                    ) : (
                      <img src={spinner} width="320" height="240" />
                    )}

                    {ImageError ? (
                      <div className="error_message">{VideoerrMsg}</div>
                    ) : (
                      ""
                    )}
                  </div>
                ) : (
                  ""
                )}
                {/* <Box className="videoInstructt">
                            <div className="video-instrct-divv">
                               <Input type="file" onChange={onUploadVideo} />
                               
                               <Box className="AddVideoInstruct"> <GrAddCircle className="me-2" />Add photo or video</Box>
                            </div>
                            </Box> */}
                <Box className="file_upl_techr">
                  <label for="file-upload" class="custom-file-upload">
                    <GrAddCircle className="me-2" />
                    Add video introduction
                  </label>
                  <input
                    id="file-upload"
                    onChange={onUploadVideo}
                    type="file"
                  />
                </Box>
                <Box className="extreme-mrgn">
                  <Button
                    className="saveBtn mt-3"
                    onClick={Secondformik.handleSubmit}
                  >
                    Save
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default EditTeacherProfile;