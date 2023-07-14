import React, { useState, useEffect, useRef } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Redirect } from "react-router-dom";
import { FormControl, Typography } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import Footer from "../Footer";
import { getDropdownValues, createUser } from "../../../../actions/auth";
import { useDispatch, useSelector } from "react-redux";
import { FiEdit } from "react-icons/fi";
import moment from "moment";
import DatePicker from "react-date-picker";

import S3 from "react-aws-s3";

const UserProfileContent = () => {
  const dispatch = useDispatch();
  const [uploadedImage, setUploadedImage] = useState(
    "https://mymentorbucket.s3.us-east-2.amazonaws.com/user.png"
  );

  const Upload = () => {
    const fileInput = useRef();
    const imageChange = (e) => {
      e.preventDefault();
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

      ReactS3Client.uploadFile(file, newFileName).then((data) => {
        setUploadedImage(data.location);

        if (data.status === 204) {
          console.log("berhasil diupload");
        } else {
          console.log("gagal");
        }
      });
    };
    return (
      <>
        <input
          accept="image/*"
          ref={fileInput}
          placeholder="User Profile"
          onChange={imageChange}
          type="file"
          className="w-100"
          //onChange={onChangePicture}
        />
      </>
    );
  };
  const [formData, setFormData] = useState({
    edit: false,
    phone: "",
    email: "",
    password: "",
    confirm_password: "",
    first_name: "",
    last_name: "",
    gender: 0,
    dob: new Date(),
    street_address: "",
    city: "",
    state: 0,
    zip_code: "",
    profile_image: "",
    account_status: 0,
    user_role: 1,
    topics: "",
    expertise: "",
    about_expertise: "",
    planned_topics: "",
  });
  const [userCreated, setUserCreated] = useState(false);
  const [datePickerDate, setDatePickerDate] = useState(null);

  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const onChangeDate = (e) => {
    if (moment().diff(moment(e), "years") > 10) {
      return true
    } else {
      alert("Age must be greater than 10 years");
      return false;
    }
  };

  const onSubmit = (e) => {
    e.preventDefault();
    var newFormData = formData;
    newFormData.profile_image = uploadedImage;
    newFormData.edit = false;
    newFormData.dob = moment(datePickerDate).format("MM-DD-YYYY");

    if(onChangeDate(newFormData.dob)){
    dispatch(createUser(newFormData)).then((res) => {
      if (res && res.success) {
        //console.log(res);
        setUserCreated(true);
      }
    });
  }
  };
  const [genderIdentity, setGenderIdentity] = useState([]);
  const [statesArray, setStateArray] = useState([]);

  useEffect(() => {
    dispatch(getDropdownValues()).then((res) => {
      if (res && res.success) {
        setGenderIdentity(
          res.data.filter((a) => {
            if (a.name == "gender_identity") {
              return a;
            }
          })[0].options
        );
        setStateArray(
          res.data.filter((a) => {
            if (a.name == "state") {
              return a;
            }
          })[0].options
        );
      }
    });
  }, []);

  if (userCreated) {
    return <Redirect to="users" />;
  }
  return (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12.MuiGrid-grid-xl-12.css-1idn90j-MuiGrid-root{\nmargin: 25% 0%;\n}\n",
        }}
      />
      <section className="m-3 profile-cnt">
        <form onSubmit={(e) => onSubmit(e)}>
          <Paper className="p-3">
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} lg={12}>
                <Typography variant="h5">Add User</Typography>
                <Divider className="mt-3 mb-3" />
              </Grid>
            </Grid>

            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6} xl={6}>
                <Box sx={{ display: "flex" }}>
                  <Grid container spacing={2}>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={6}
                      xl={6}
                      className="wdth-all"
                    >
                      <FormControl>
                        <InputLabel variant="standard" htmlFor="user-status">
                          User Status
                        </InputLabel>
                        <Select
                          value={formData.account_status}
                          onChange={onChange}
                          displayEmpty
                          name="account_status"
                          className="usertype-status"
                          required
                        >
                          <MenuItem value={0}>Pending</MenuItem>
                          <MenuItem value={1}>Active</MenuItem>
                          <MenuItem value={2}>Suspended</MenuItem>
                        </Select>
                      </FormControl>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={6}
                      lg={6}
                      xl={6}
                      className="wdth-all"
                    >
                      <FormControl>
                        <InputLabel variant="standard" htmlFor="user-type">
                          User Type
                        </InputLabel>
                        <Select
                          onChange={onChange}
                          name="user_role"
                          value={formData.user_role}
                          displayEmpty
                          className="usertype-list"
                          required
                        >
                          <MenuItem value={1}>Student</MenuItem>
                          <MenuItem value={2}>Teacher</MenuItem>
                          {localStorage.getItem("UserRole") == 0 && (
                            <MenuItem value={3}>Administrator</MenuItem>
                          )}
                        </Select>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} md={6} lg={6} xl={6}></Grid>
            </Grid>
            <Grid container spacing={2} className="mt-3">
              <Grid item xs={12} md={12} lg={12} xl={12}>
                <Typography variant="h5">User Information</Typography>
                <Divider className="mt-3 mb-3" />

                <Box>
                  <Grid container>
                    <Grid item xs={12} md={8} lg={9} xl={9}>
                      <Box className="profile-info-form">
                        <Grid container spacing={2}>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="first-name">
                                First Name
                              </InputLabel>
                              <TextField
                                sx={{ mb: 1 }}
                                onChange={onChange}
                                fullWidth
                                placeholder="Meg"
                                id="first-name"
                                variant="standard"
                                name="first_name"
                                required
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="last-name">
                                Last Name
                              </InputLabel>
                              <TextField
                                sx={{ mb: 1 }}
                                onChange={onChange}
                                fullWidth
                                placeholder="Ridgen"
                                id="last-name"
                                variant="standard"
                                name="last_name"
                                required
                              />
                            </FormControl>
                          </Grid>
                          {formData.dob && formData.dob != "" && 
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="birth-date">
                                Birth Date
                              </InputLabel>
                              <DatePicker onChange={setDatePickerDate} value={datePickerDate} />
                            </FormControl>
                          </Grid>}
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="gender">
                                Gender Identity
                              </InputLabel>
                              <Select
                                onChange={onChange}
                                //displayEmpty
                                value={formData.gender}
                                className="gender-list"
                                name="gender"
                                required
                              >
                                {genderIdentity.length > 0 &&
                                  genderIdentity.map((val, i) => (
                                    <MenuItem value={i} key={i}>
                                      {val}
                                    </MenuItem>
                                  ))}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="street-address">
                                Street Address
                              </InputLabel>
                              <TextField
                                sx={{ mb: 1 }}
                                required
                                fullWidth
                                placeholder="Sulivan"
                                id="address"
                                variant="standard"
                                name="street_address"
                                onChange={onChange}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="city">
                                City
                              </InputLabel>
                              <TextField
                                sx={{ mb: 1 }}
                                required
                                fullWidth
                                placeholder="New York"
                                name="city"
                                id="city"
                                variant="standard"
                                onChange={onChange}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="state">
                                State
                              </InputLabel>
                              <Select
                                onChange={onChange}
                                //displayEmpty
                                value={formData.state}
                                displayEmpty
                                className="states-list"
                                name="state"
                                required
                              >
                                <MenuItem value={0}>
                                  Please select state
                                </MenuItem>

                                {statesArray.length > 0 &&
                                  statesArray.map(
                                    (val, i) =>
                                      i > 0 && (
                                        <MenuItem value={val} key={i}>
                                          {val}
                                        </MenuItem>
                                      )
                                  )}
                              </Select>
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="postal">
                                Postal Code
                              </InputLabel>
                              <TextField
                                sx={{ mb: 1 }}
                                required
                                fullWidth
                                placeholder="11235"
                                name="zip_code"
                                id="postal-code"
                                variant="standard"
                                onChange={onChange}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            {formData.user_role == 3 ? (
                              <FormControl variant="standard">
                                <InputLabel shrink htmlFor="email">
                                  Email:
                                </InputLabel>
                                <TextField
                                  id="email"
                                  name="email"
                                  variant="standard"
                                  placeholder="user@gmail.com"
                                  required
                                  onChange={onChange}
                                />
                              </FormControl>
                            ) : (
                              <FormControl variant="standard">
                                <InputLabel shrink htmlFor="phone">
                                  Phone Number:
                                </InputLabel>
                                <TextField
                                  name="phone"
                                  id="phone-number"
                                  variant="standard"
                                  placeholder="(555) 444 7777"
                                  required
                                  onChange={onChange}
                                />
                              </FormControl>
                            )}
                          </Grid>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <FormControl variant="standard">
                              <InputLabel shrink htmlFor="email">
                                Password
                              </InputLabel>
                              <TextField
                                name="password"
                                type="password"
                                id="password"
                                variant="standard"
                                placeholder="********"
                                required
                                onChange={onChange}
                              />
                            </FormControl>
                          </Grid>
                          <Grid item xs={12} md={3} lg={3} xl={3}>
                            <Button
                              sx={{ width: "100%" }}
                              variant="contained"
                              style={{ marginTop: "20px" }}
                              type="submit"
                            >
                              Save Changes
                            </Button>
                          </Grid>
                        </Grid>
                      </Box>
                    </Grid>
                    <Grid
                      item
                      xs={12}
                      md={3}
                      lg={3}
                      xl={3}
                      className="new-user-image-area"
                    >
                      <FormControl variant="standard">
                        <div className="new-profile-pic-area">
                          <div className="new-user-profile-pic">
                            <img
                              src={uploadedImage}
                              className="ProfilePic_user w-100"
                            />
                          </div>
                          <div className="upload-icon edit-wrap">
                            <label
                              htmlFor="icon-button-file"
                              style={{
                                position: "relative",
                                opacity: 0,
                                zIndex: 9999,
                              }}
                            >
                              <Button
                                variant="contained"
                                component="span"
                                className="side-upload-button"
                              >
                                <Upload />
                              </Button>
                            </label>
                            <div
                              className="edit-icon-wrap"
                              style={{
                                position: "absolute",
                                top: 0,
                                left: 0,
                                bottom: 0,
                                right: 0,
                              }}
                            >
                              <FiEdit />
                            </div>
                          </div>
                        </div>
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </form>
      </section>
      <Footer />
    </>
  );
};

export default UserProfileContent;
