import React, { useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { BsFillCameraVideoFill } from "react-icons/bs";
import Input from "@mui/material/Input";
import Avatar from "@mui/material/Avatar";
import S3 from "react-aws-s3";
import spinner from "../../../spinner.gif";
import { GrAddCircle } from "react-icons/gr";

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
    <div className="tag-topic-input class_desc_tags">
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
        className="input_tggs"
        onKeyUp={(event) =>
          event.key === "Enter" ? addtagtopicData(event) : null
        }
        placeholder="Press enter to add a topic"
      />
    </div>
  );
};
const AccountStep2 = (props) => {
  const {
    Secondformik,
    setUploadedImage,
    uploadedImage,
    setUploadVideo,
    uploadVideo,
    settags,
    tags,
  } = props;
  const [ImageError, setImageError] = useState(false);
  const [videoError, setvideoError] = useState(false);
  const [loading, setloading] = React.useState(false);
  const [ImageSizeError, setImagesizeError] = useState(false);
  const [videoloading, setvideoloading] = React.useState(false);
  const [VideoerrMsg, setVideoErrorMsg] = useState("");
  const [imageerrMsg, setimageerrMsg] = useState("");

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
        setimageerrMsg("Please upload Image less then 2mb");
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
        setvideoError(true);
        setVideoErrorMsg("Video size shoud be less 200mb");
      } else if (!file.name.match(/\.(mp4|mov)$/)) {
        setvideoError(true);
        setVideoErrorMsg("This File Format is Not Accepted ");
      } else {
        setvideoError(false);
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

  return (
    <Box className="class_first_sect">
      <Box className="uploadImage my-4">
        <FormControl variant="standard" className="w-100 uploadfield">
          <TextField
            sx={{ mb: 1 }}
            required
            fullWidth
            type="file"
            onChange={onChangePicture}
          />
        </FormControl>
        <Box className="UploadImageIcon teacherProfile d-flex align-items-center">
          <Avatar alt="profile" src={loading ? spinner : uploadedImage} />
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
              className={ImageSizeError ? "error_message" : "subtextt"}
            >
              {" "}
              {ImageError ? (
                <div className="error_message"> Only Image is Supported</div>
              ) : (
                "Less than 2MB"
              )}{" "}
            </Typography>
          </Box>
        </Box>
      </Box>
      <FormControl variant="standard" className="w-100 mb-2">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          What is your expertise?
        </InputLabel>
        <TextField
          sx={{ mb: 1 }}
          required
          fullWidth
          name="expertise"
          id="name"
          variant="standard"
          placeholder="e.g. yoga instructor, dance teacher"
          className="StepsFields"
          value={Secondformik.values.expertise}
          onChange={Secondformik.handleChange}
        />
        {Secondformik.errors.expertise && Secondformik.touched.expertise ? (
          <div className="error_message">{Secondformik.errors.expertise}</div>
        ) : null}
      </FormControl>
      <FormControl variant="standard" className="w-100 mb-2">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          Tell us a little about that
        </InputLabel>
        <TextareaAutosize
          sx={{ mb: 1 }}
          aria-label="minimum height"
          minRows={3}
          placeholder="What makes you special at your expertise?"
          className="StepsFields"
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
      <FormControl variant="standard" className="w-100 topics-teach mb-3">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          What topics do you plan to teach?
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
      {!videoloading ? (
        <video width="320" height="240" controls preload="none">
          <source src={uploadVideo} type="video/mp4" autostart="false" />
          <source src={uploadVideo} type="video/ogg" autostart="false" />
        </video>
      ) : (
        <img src={spinner} width="320" height="240" />
      )}

      <Box className="file_upl_techr videoInstructtt">
         <Box className="AddVideoInstructt">
          {" "}
          <label for="file-upload" class="custom-file-upload">
            <BsFillCameraVideoFill className="me-2" />
            Add video introduction
          </label>
        </Box>
        <input id="file-upload" onChange={onUploadVideo} type="file" />
        {videoError ? <div className="error_message">{VideoerrMsg}</div> : ""}
      </Box>
      {/* <Box className="videoInstructt">
        <Input type="file" onChange={onUploadVideo} />
        <Box className="AddVideoInstruct">
          {" "}
          <BsFillCameraVideoFill className="me-2" />
          Add video introduction
        </Box>
        {videoError ? <div className="error_message">{VideoerrMsg}</div> : ""}
      </Box> */}
    </Box>
  );
};

export default AccountStep2;
