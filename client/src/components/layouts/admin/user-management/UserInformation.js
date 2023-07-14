import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import TextField from "@mui/material/TextField";
import { Button, Divider } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import CircularProgress from "@mui/material/CircularProgress";
import { Typography } from "@mui/material";
import { Box } from "@mui/system";
import { Link } from "@mui/material";
import { BsArchive } from "react-icons/bs";
import { styled } from "@mui/material/styles";
import { FiEdit } from "react-icons/fi";
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { connect } from "react-redux";
import { loadSingleUser } from "../../../../actions/auth";
import { useParams } from "react-router-dom";
import { Redirect } from "react-router-dom";
import moment from "moment";

import { getDropdownValues, createUser } from "../../../../actions/auth";

import DatePicker from "react-date-picker";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { useDispatch, useSelector } from "react-redux";

import S3 from "react-aws-s3";
// Get ID from URL
import { changeAccountStatus } from "../../../../actions/auth";

// function UserInformation({loadSingleUser,auth:{singleUserInfo,loading}}) {
//     let { id } = useParams();
//     console.log('{ id }');
const UserInformation = ({
  loadSingleUser,
  auth: { singleUserInfo },
  changeAccountStatus,
}) => {
  //const [userData, setUserData] = useState(null);
  const [message, setMessage] = React.useState("");
  const dispatch = useDispatch();
  const { id } = useParams();
  const [datePickerDate, setDatePickerDate] = useState(new Date());
  const [formData, setFormData] = useState({
    edit: true,
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
    _id: id,
  });
  const [uploadedImage, setUploadedImage] = useState(
    "https://mymentorbucket.s3.us-east-2.amazonaws.com/user.png"
  );

  const [apiHit, setApiHit] = useState(false);
  const [resetPassword, setResetPassword] = useState(false);
  const [accountStatus, setAccountStatus] = useState(0);
  //const id  = '61ee5cf8e88d1929e34e1769'

  useEffect(() => {
    console.log(id);
    setApiHit(false);
    loadSingleUser(id).then((res) => {
      if (res) {
        setAccountStatus(res.account_status);
        setFormData(res);
        if (res.dob && res.dob != "") {
          setDatePickerDate(new Date(res.dob));
        }
        setApiHit(true);
        setUploadedImage(res && res.profile_image);

        //uploadedImage = res.
      }
    });
    //setUserData(singleUserInfo);
  }, []);

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
    //console.log(formData);
    var newFormData = formData;
    newFormData.profile_image = uploadedImage;
    newFormData.edit = true;
    newFormData.reset_password = resetPassword;
    newFormData.dob = moment(datePickerDate).format("MM-DD-YYYY");
    if(onChangeDate(newFormData.dob)){
      
    dispatch(createUser(newFormData)).then((res) => {
      if (res && res.success) {
        //console.log(res);
        <Redirect to="users" />;
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
  const changeStatus = (status) => {
    if (window.confirm("Are You Sure ?")) {
      changeAccountStatus(id, status).then((res) => {
        if (res && res.success) {
          setAccountStatus(status);
          setMessage(res.message);
          setApiHit(!apiHit);
        }
      });
    }
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

      ReactS3Client.uploadFile(file, newFileName).then((data) => {
        setUploadedImage(data.location);

        if (data.status === 204) {
          console.log("berhasil diupload");
        } else {
          console.log("gagal");
        }
      });
    }
  };
  const Input = styled("input")({
    display: "none",
  });
  return singleUserInfo != null ? (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12.MuiGrid-grid-xl-12.css-1idn90j-MuiGrid-root{\nmargin: 25% 0%;\n}\n",
        }}
      />
      {apiHit && (
        <form onSubmit={(e) => onSubmit(e)}>
          <div className="admni-sect">
            <Typography variant="h5" className="pb-3">
              Administrative Controls
            </Typography>
            <Divider />
            {message != "" && (
              <Box className="alert alert-success mt-3">{message}</Box>
            )}
            <Box className="mt-3 ext-spc">
              <Grid container spacing={2}>
                <Grid item xs={12} sm={12} md={4} lg={4} xl={6}>
                  <FormControl>
                    <InputLabel variant="standard" htmlFor="user-status">
                      User Status
                    </InputLabel>
                    <Select
                      value={formData && formData.account_status}
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
                <Grid item xs={12} sm={12} md={4} lg={4} xl={6}>
                  <FormControl>
                    <InputLabel variant="standard" htmlFor="user-type">
                      User Type
                    </InputLabel>
                    <Select
                      value={singleUserInfo && singleUserInfo.user_role}
                      // value={usertype}
                      // value={10}
                      // onChange={userTypeChange}
                      displayEmpty
                      className="usertype-list"
                      disabled
                    >
                      <MenuItem value={1}>Student</MenuItem>
                      <MenuItem value={2}>Teacher</MenuItem>
                      <MenuItem value={3}>Platform Administrator</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </div>
          <div className="user-infor-sect">
            <Grid container className="p-3">
              <Grid item xs={12} md={12} lg={12}>
                <div className="user-head">
                  <Typography variant="h5">User Information</Typography>
                </div>
              </Grid>
            </Grid>
            <Grid container className="p-3">
              <Grid item xs={12} md={12} lg={10} xl={10}>
                <Box className="user-info-form">
                  <Grid container>
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
                          defaultValue={formData && formData.first_name}
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
                          defaultValue={formData && formData.last_name}
                          required
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={6} lg={6} xl={6}>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="birth-date">
                          Birth Date
                        </InputLabel>
                        <DatePicker onChange={setDatePickerDate} value={datePickerDate} />
                        
                      </FormControl>
                    </Grid>
                  </Grid>
                  <Grid container>
                    <Grid item xs={12} md={3} lg={3} xl={3}>
                      <FormControl variant="standard">
                        <InputLabel shrink htmlFor="gender">
                          Gender Identity
                        </InputLabel>
                        <Select
                          onChange={onChange}
                          //displayEmpty
                          value={formData && formData.gender}
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
                          defaultValue={formData && formData.street_address}
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
                          defaultValue={formData && formData.city}
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
                          value={formData && formData.state}
                          displayEmpty
                          className="states-list"
                          name="state"
                          required
                        >
                          <MenuItem value={0}>Please select state</MenuItem>

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
                          defaultValue={formData && formData.zip_code}
                        />
                      </FormControl>
                    </Grid>
                    <Grid item xs={12} md={3} lg={3} xl={3}>
                      {formData && formData.user_role == 3 ? (
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
                            //onChange={onChange}
                            value={formData && formData.email}
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
                            //onChange={onChange}
                            value={formData && formData.phone}
                          />
                        </FormControl>
                      )}
                    </Grid>
                    {resetPassword && (
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
                    )}
                    <Grid item xs={12} md={3} lg={3} xl={3}>
                      <FormControl variant="standard">
                        {!resetPassword ? (
                          <Button
                            variant="contained"
                            className="mt-3 mb-3 rest-passwrd"
                            color="secondary"
                            onClick={() => setResetPassword(true)}
                          >
                            Reset Password
                          </Button>
                        ) : (
                          <Button
                            variant="contained"
                            className="mt-3 mb-3 rest-passwrd"
                            color="secondary"
                            onClick={() => setResetPassword(false)}
                          >
                            Undo
                          </Button>
                        )}
                      </FormControl>
                    </Grid>
                  </Grid>
                </Box>
              </Grid>
              <Grid item xs={12} md={12} lg={2} xl={2}>
                <Box className="user-profile-pic">
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="profile-pic">
                      Profile Picture
                    </InputLabel>
                    <div className="profile-pic-area">
                      <div className="profile-pic">
                        <img
                          src={uploadedImage}
                          className="ProfilePic_user w-100"
                        />
                      </div>
                      <div className="upload-icon">
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
                            <Input
                              accept="image/*"
                              id="icon-button-file"
                              type="file"
                              onChange={onChangePicture}
                            />
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
                </Box>
              </Grid>
            </Grid>

            <Grid container className="save-sct pb-5">
              <Grid item xs={12} md={12} lg={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={12} lg={7}>
                <FormControl variant="standard" className="mb-0">
                  <Button
                    type="submit"
                    variant="contained"
                    className="mt-3 sve-btn"
                    color="primary"
                  >
                    Save Changes
                  </Button>
                </FormControl>
                <FormControl variant="standard" className="mb-0">
                  <Button
                    variant="contained"
                    className="mt-3"
                    color="secondary"
                  >
                    Cancel
                  </Button>
                </FormControl>
              </Grid>

              {singleUserInfo && singleUserInfo.account_status != 3 && (
                <Grid item xs={12} md={12} lg={5} className="text-rght archve">
                  <FormControl variant="standard" className="mb-0">
                    <Typography variant="h6" className="mt-3">
                      <Link color="secondary" onClick={() => changeStatus(3)}>
                        <span>
                          <BsArchive />
                        </span>
                        Archive User
                      </Link>
                    </Typography>
                  </FormControl>
                </Grid>
              )}
            </Grid>
          </div>
        </form>
      )}
    </>
  ) : (
    <Grid container spacing={2}>
      <Grid item xs={12} sm={12} md={12} lg={12} xl={12} align="center">
        <CircularProgress color="primary" />
      </Grid>
    </Grid>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  loadSingleUser,
  changeAccountStatus,
})(UserInformation);
