import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Link from "@mui/material/Link";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import { BsFillCameraVideoFill } from "react-icons/bs";
import Grid from "@mui/material/Grid";
import Avatar from "@mui/material/Avatar";
import { getDropdownValues } from "../../../../../actions/frontent";
import S3 from "react-aws-s3";
import spinner from "../../../spinner.gif";
import DatePicker from "react-date-picker";

const StudentAccounts = (props) => {
  const {
    formik,
    uploadedImage,
    setUploadedImage,
    setDatePickerDate,
    datePickerDate,
  } = props;
  const dispatch = useDispatch();
  const [Gender, setVal] = React.useState("");
  const [genderValue, setgenderValue] = React.useState([]);
  const [stateValue, setstateValue] = React.useState([]);
  const [ImageSizeError, setImagesizeError] = useState(false);
  const [loading, setloading] = React.useState(false);

  const handleChange = (event) => {
    setVal(event.target.value);
  };

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
  }, []);

  const [ImageError, setImageError] = useState(false);

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
    <Box>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n.react-date-picker__inputGroup{\npadding: 14px;\n}\n.react-date-picker.react-date-picker--closed.react-date-picker--enabled {\n    margin-top: 0px !important;\n}\n.react-date-picker.react-date-picker--open.react-date-picker--enabled {\n    margin-top: 0px !important;\n}\n",
        }}
      />
      <Box className="uploadImage my-4">
        <FormControl variant="standard" className="w-100 uploadfield n-z-indx">
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

      <Grid container spacing={2}>
        <Grid item lg={6} md={6} sm={12} xs={12}>
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
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Last Name
            </InputLabel>
            <TextField
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
            {formik.errors.last_name && formik.touched.last_name ? (
              <div className="error_message">{formik.errors.last_name}</div>
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
              // value={Gender}
              //onChange={handleChange}
              value={formik.values.gender_identity}
              onChange={formik.handleChange}
              displayEmpty
              className="StepsFields student_gendr"
              inputProps={{ "aria-label": "Without label" }}
            >
              {genderValue.map((key, index) => {
                return (
                  <MenuItem value={index} className="d-block p-2">
                    {key}
                  </MenuItem>
                );
              })}

              {/* <MenuItem value={10} className="d-block p-2">Male</MenuItem>
                <MenuItem value={20} className="d-block p-2">Female</MenuItem>
                <MenuItem value={30} className="d-block p-2">other</MenuItem> */}
            </Select>
            {formik.errors.gender_identity && formik.touched.gender_identity ? (
              <div className="error_message">
                {formik.errors.gender_identity}
              </div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Date of Birth
            </InputLabel>
            <DatePicker onChange={setDatePickerDate} value={datePickerDate} maxDate={new Date()} className="student_datePicker"/>
            {/* <TextField
              sx={{ mb: 1 }}
              required
              fullWidth
              name="dob"
              id="name"
              type="date"
              variant="standard"
              placeholder="Please Select"
              className="StepsFields"
              value={formik.values.dob}
              onChange={formik.handleChange}
            /> */}
            {formik.errors.dob && formik.touched.dob ? (
              <div className="error_message">{formik.errors.dob}</div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Street Address
            </InputLabel>
            <TextField
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
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <FormControl variant="standard" className="w-100 mb-2">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              City
            </InputLabel>
            <TextField
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
              <div className="error_message">{formik.errors.city}</div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
          <FormControl variant="standard" className="w-100 mb-2">
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
                    name="state"
                    id="name"
                    variant="standard"
                    placeholder=""
                    className="StepsFields"
                    value={formik.values.state}
                    onChange={formik.handleChange}
                />
                  {formik.errors.first_name && formik.touched.first_name?(<div className='error_message'>{formik.errors.first_name}</div>) : null} */}

            <Select
              sx={{ mb: 1 }}
              name="state"
              // value={Gender}
              //onChange={handleChange}
              value={formik.values.state}
              onChange={formik.handleChange}
              displayEmpty
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

              {/* <MenuItem value={10} className="d-block p-2">Male</MenuItem>
                <MenuItem value={20} className="d-block p-2">Female</MenuItem>
                <MenuItem value={30} className="d-block p-2">other</MenuItem> */}
            </Select>
            {formik.errors.state && formik.touched.state ? (
              <div className="error_message">{formik.errors.state}</div>
            ) : null}
          </FormControl>
        </Grid>
        <Grid item lg={6} md={6} sm={12} xs={12}>
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
              placeholder=""
              className="StepsFields"
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

export default StudentAccounts;
