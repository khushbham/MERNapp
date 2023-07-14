import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import Avatar from "@mui/material/Avatar";
import Select from "@mui/material/Select";
import S3 from "react-aws-s3";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { BsImageFill } from "react-icons/bs";
import { useDispatch } from "react-redux";
import { getDropdownValues } from "../../../../../actions/frontent";
import spinner from ".././../../spinner.gif";

const TagTopicInput = ({ tags, settags }) => {
  // const [tagtopicData, settagtopicData] = React.useState(tags);
  // console.log(tags)
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
        onKeyUp={(event) =>
          event.key === "Enter" ? addtagtopicData(event) : null
        }
        placeholder="Press enter to add a topic"
      />
    </div>
  );
};

const StepOneContent = (props) => {
  const { formik, uploadedImage, setUploadedImage, settags, tags, ImageError, imageerrMessage, setImageError, setimageerrMessage, } = props;
  const dispatch = useDispatch();
  const [classlevel, setclasslevel] = React.useState();
  const [loading, setloading] = React.useState(false);
  // console.log("tags", )

  // const handleChange = (event) => {
  //     setAge(event.target.value);
  // };
  useEffect(() => {
    dispatch(getDropdownValues()).then((res) => {
      //  console.log(res,"response")
      setclasslevel(
        res.data.filter((a) => {
          if (a.name == "class_level") {
            return a;
          }
        })[0].options
      );
    });
  }, []);

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
        setImageError(true);
        setimageerrMessage("Less than 2MB");
      } else {
        setImageError(false);
        setloading(true);
        
        ReactS3Client.uploadFile(file, newFileName).then((data) => {
          // console.log(data.location,"location")
          setUploadedImage(data.location);
          setloading(false);
          
          if (data.status === 204) {
            // console.log("berhasil diupload");
          } else {
            // console.log("gagal");
          }
        });
      }
    }
  };
  return (
    <Box className="class_first_sect">
      <Box className="my-4">
        
        <Typography variant="h3" gutterBottom component="div" className="mb-0">
          {" "}
          What will you be teaching on your class?{" "}
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          component="div"
          className="mb-0"
        >
          Please complete the form below
        </Typography>
      </Box>
      <FormControl variant="standard" className="w-100 mb-2">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          Discipline
        </InputLabel>
        <TextField
          sx={{ mb: 1 }}
          required
          fullWidth
          name="discipline"
          id="name"
          variant="standard"
          placeholder="Enter the main discipline"
          className="StepsFields"
          value={formik.values.discipline}
          onChange={formik.handleChange}
          error={formik.touched.discipline && Boolean(formik.errors.discipline)}
        />
        {formik.errors.discipline && formik.touched.discipline ? (
          <div className="error_message">{formik.errors.discipline}</div>
        ) : null}
      </FormControl>
      <FormControl variant="standard" className="w-100 mb-2">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          Topic
        </InputLabel>
        <TagTopicInput tags={tags} settags={settags} />
        {/* <TextField sx={{ mb: 1 }} 
                    required
                    fullWidth
                    name="topics"
                    id="name"
                    variant="standard"
                    placeholder="Enter one or more topics"
                    className="StepsFields"
                    value={formik.values.topics}
                    onChange={formik.handleChange}
                    error={formik.touched.topics && Boolean(formik.errors.topics)}
                    helperText={formik.touched.topics && formik.errors.topics}
                    /> */}
      </FormControl>
      <FormControl variant="standard" className="w-100 mb-2">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          Class Title
        </InputLabel>
        <TextField
          sx={{ mb: 1 }}
          required
          fullWidth
          name="class_title"
          id="name"
          variant="standard"
          placeholder="A few words on what you are
                    teaching"
          className="StepsFields"
          value={formik.values.class_title}
          onChange={formik.handleChange}
          error={
            formik.touched.class_title && Boolean(formik.errors.class_title)
          }
        />
        {formik.errors.class_title && formik.touched.class_title ? (
          <div className="error_message">{formik.errors.class_title}</div>
        ) : null}
      </FormControl>

      <FormControl variant="standard" className="w-100 mb-2">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          Class Subtitle
        </InputLabel>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          placeholder="Minimum 3 rows"
          className="StepsFields"
          name="class_subtitle"
          value={formik.values.class_subtitle}
          onChange={formik.handleChange}
          error={
            formik.touched.class_subtitle &&
            Boolean(formik.errors.class_subtitle)
          }
        />
        {formik.errors.class_subtitle && formik.touched.class_subtitle ? (
          <div className="error_message">{formik.errors.class_subtitle}</div>
        ) : null}
      </FormControl>
      <FormControl variant="standard" className="w-100 mb-2">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          Class Description
        </InputLabel>
        <TextareaAutosize
          aria-label="minimum height"
          minRows={3}
          placeholder="Minimum 3 rows"
          className="StepsFields"
          name="class_description"
          value={formik.values.class_description}
          onChange={formik.handleChange}
          error={
            formik.touched.class_description &&
            Boolean(formik.errors.class_description)
          }
        />
        {formik.errors.class_description && formik.touched.class_description ? (
          <div className="error_message">{formik.errors.class_description}</div>
        ) : null}
      </FormControl>
      <FormControl className="selectDropdown w-100 mb-2 classlevel_drp">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          Class Level
        </InputLabel>
        <Select
          //value={Session}
          //onChange={handleChange}
          // displayEmpty
          name="class_level"
          className="class_levelMenuItem step_one_class_level"
          value={formik.values.class_level}
          onChange={formik.handleChange}
          error={
            formik.touched.class_level && Boolean(formik.errors.class_level)
          }
        >
          {classlevel?.map((arr, index) => {
            return (
              <MenuItem className="MenuItem" value={index} key={index}>
                {arr}
              </MenuItem>
            );
          })}
          {/* <MenuItem value={10} className="d-block p-2">02:00</MenuItem>
                     <MenuItem value={20} className="d-block p-2">03:00</MenuItem> */}
        </Select>
        {formik.errors.class_level && formik.touched.class_level ? (
          <div className="error_message">{formik.errors.class_level}</div>
        ) : null}
      </FormControl>
      <FormControl variant="standard" className="w-100 mb-3">
        <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
          Class Language
        </InputLabel>
        <TextareaAutosize
          sx={{ mb: 1 }}
          required
          fullWidth
          minRows={3}
          name="language_of_class"
          id="name"
          variant="standard"
          placeholder="What makes it special? Give us more details on your class, what students will learn, etc."
          className="StepsFields"
          value={formik.values.language_of_class}
          onChange={formik.handleChange}
          error={
            formik.touched.language_of_class &&
            Boolean(formik.errors.language_of_class)
          }
        />
        {formik.errors.language_of_class && formik.touched.language_of_class ? (
          <div className="error_message">{formik.errors.language_of_class}</div>
        ) : null}
      </FormControl>

      <InputLabel shrink htmlFor="cover-photo" className="studentCoverPhoto">
        Add Cover Photo
      </InputLabel>

      <Box className="uploadImage">
        <FormControl variant="standard" className="w-100 mb-2 uploadfield">
          <TextField
            sx={{ mb: 1 }}
            required
            fullWidth
            type="file"
            name="cover_image"
            // value={formik.values.cover_image}
            onChange={onChangePicture}
          />
        </FormControl>
        <Box className="UploadImageIcon d-flex align-items-center">
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
              className={ ImageError ? "error_message" : "subtextt"}
              >
              {ImageError?  imageerrMessage : "Less than 2MB"}
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StepOneContent;
