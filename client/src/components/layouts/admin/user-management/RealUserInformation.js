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
import { Select } from "@mui/material";
import MenuItem from "@mui/material/MenuItem";
import { connect } from "react-redux";
import { loadSingleUser } from "../../../../actions/auth";
import { useParams } from "react-router-dom";
// Get ID from URL
import { changeAccountStatus } from "../../../../actions/auth";

const UserInformation = ({
  loadSingleUser,
  auth: { singleUserInfo },
  changeAccountStatus,
}) => {
  const [userData, setUserData] = useState(null);
  const [message, setMessage] = React.useState("");

  const [apiHit, setApiHit] = useState(false);
  const [accountStatus, setAccountStatus] = useState(0);
  //const id  = '61ee5cf8e88d1929e34e1769'
  const { id } = useParams();

  useEffect(() => {
    console.log(id);
    loadSingleUser(id).then((res) => {
      if (res) {
        setAccountStatus(res.account_status);
      }
    });
    setUserData(singleUserInfo);
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
  return singleUserInfo != null ? (
    <>
      <style
        dangerouslySetInnerHTML={{
          __html:
            "\n.MuiGrid-root.MuiGrid-item.MuiGrid-grid-xs-12.MuiGrid-grid-sm-12.MuiGrid-grid-md-12.MuiGrid-grid-lg-12.MuiGrid-grid-xl-12.css-1idn90j-MuiGrid-root{\nmargin: 25% 0%;\n}\n",
        }}
      />
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
                {accountStatus == 3 ? (
                  <Select
                    value={accountStatus}
                    displayEmpty
                    className="usertype-status"
                  >
                    <MenuItem value={3}>Archive</MenuItem>
                  </Select>
                ) : (
                  <Select
                    value={accountStatus}
                    onChange={(e) => changeStatus(e.target.value)}
                    displayEmpty
                    className="usertype-status"
                  >
                    <MenuItem value={0}>Pending</MenuItem>
                    <MenuItem value={1}>Active</MenuItem>
                    <MenuItem value={2}>Suspended</MenuItem>
                    <MenuItem value={3}>Archive</MenuItem>
                  </Select>
                )}
              </FormControl>
            </Grid>
            <Grid item xs={12} sm={12} md={4} lg={4} xl={6}>
              <FormControl>
                <InputLabel variant="standard" htmlFor="user-type">
                  User Type
                </InputLabel>
                <Select
                  value={singleUserInfo && singleUserInfo.user_role}
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
          <Grid item xs={12} md={12} lg={8} xl={8}>
            <Box component="form" className="user-info-form">
              <Grid container>
                <Grid item xs={12} md={12} lg={6} xl={3}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="first-name">
                      First Name
                      {/* {console.log(singleUserInfo.first_name)} */}
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      placeholder="Meg"
                      name="First Name"
                      id="first-name"
                      variant="standard"
                      readOnly
                      value={singleUserInfo && singleUserInfo.first_name}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={6} xl={3}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="last-name">
                      Last Name
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      placeholder="Ridgen"
                      name="Last Name"
                      id="last-name"
                      value={singleUserInfo && singleUserInfo.last_name}
                      variant="standard"
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={6} xl={3}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="birth-date">
                      Birth Date
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      placeholder="DOB"
                      name="dob"
                      id="dob"
                      variant="standard"
                      readOnly
                      value={singleUserInfo && singleUserInfo.dob}
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={6} xl={3}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="gender">
                      Gender Identity
                      {/* {console.log(singleUserInfo.gender)} */}
                    </InputLabel>
                    {/* {singleUserInfo && singleUserInfo.gender} */}
                    <Select
                      //value={singleUserInfo && singleUserInfo.gender}
                      value={singleUserInfo && singleUserInfo.gender}
                      //onChange={genderChange}
                      displayEmpty
                      className="gender-list"
                    >
                      {/* <MenuItem value={singleUserInfo && singleUserInfo.gender}>{singleUserInfo && singleUserInfo.gender}</MenuItem>   */}
                      {singleUserInfo && singleUserInfo.gender == 0 && (
                        <MenuItem value={0}>Female</MenuItem>
                      )}
                      {singleUserInfo && singleUserInfo.gender == 1 && (
                        <MenuItem value={1}>Male</MenuItem>
                      )}
                      {singleUserInfo && singleUserInfo.gender == 2 && (
                        <MenuItem value={2}>Other</MenuItem>
                      )}
                    </Select>
                  </FormControl>
                </Grid>
              </Grid>
              <Grid container>
                <Grid item xs={12} md={12} lg={6} xl={3}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="street-address">
                      Street Address
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      value={singleUserInfo && singleUserInfo.street_address}
                      placeholder="Sulivan"
                      name="address"
                      id="address"
                      variant="standard"
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={6} xl={3}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="city">
                      City
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      value={singleUserInfo && singleUserInfo.city}
                      placeholder="New York"
                      name="city"
                      id="city"
                      variant="standard"
                      readOnly
                    />
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={12} lg={6} xl={3}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="state">
                      State
                      {/* {console.log(singleUserInfo.state)} */}
                    </InputLabel>
                    <Select
                      value={singleUserInfo && singleUserInfo.state}
                      className="states-list"
                      //onChange={statesChange}
                    >
                      <MenuItem value={singleUserInfo && singleUserInfo.state}>
                        {singleUserInfo && singleUserInfo.state}
                      </MenuItem>
                    </Select>
                  </FormControl>
                </Grid>

                <Grid item xs={12} md={12} lg={6} xl={3}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="postal">
                      Postal Code
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      value={singleUserInfo && singleUserInfo.zip_code}
                      placeholder="11235"
                      name="postal-code"
                      id="postal-code"
                      variant="standard"
                      readOnly
                    />
                  </FormControl>
                </Grid>
              </Grid>
              
              <Grid container>
              
                {singleUserInfo && singleUserInfo.email ? (
                  <Grid item xs={12} md={12} lg={6} xl={6}>
                    <FormControl variant="standard">
                      <InputLabel shrink htmlFor="phone">
                        Email:
                      </InputLabel>
                      <TextField
                        id="phone-number"
                        variant="standard"
                        value={singleUserInfo && singleUserInfo.email}
                        placeholder="email@domain.com"
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                ) : (
                  <Grid item xs={12} md={12} lg={6} xl={6}>
                    <FormControl variant="standard">
                      <InputLabel shrink htmlFor="phone">
                        Phone Number:
                      </InputLabel>
                      <TextField
                        id="phone-number"
                        variant="standard"
                        value={singleUserInfo && singleUserInfo.phone}
                        placeholder="(555) 444 7777"
                        readOnly
                      />
                    </FormControl>
                  </Grid>
                )}
              </Grid>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} lg={4} xl={4}>
            <Box component="form" className="user-profile-pic">
              <FormControl variant="standard">
                <InputLabel shrink htmlFor="profile-pic">
                  Profile Picture
                </InputLabel>
                <div className="profile-pic-area">
                  <div className="profile-pic">
                    <img
                      src={singleUserInfo && singleUserInfo.profile_image}
                      className="ProfilePic_user w-100"
                    />
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
          {singleUserInfo && singleUserInfo.user_created_by_admin == 1 ? (
            <Grid item xs={12} md={12} lg={7}>
              <FormControl variant="standard" className="mb-0">
                <Button
                  variant="contained"
                  className="mt-3 sve-btn"
                  color="primary"
                  disabled={
                    localStorage.getItem("UserRole") == 3 &&
                    singleUserInfo.user_role == 3
                  }
                >
                  Save Changes
                </Button>
              </FormControl>
              <FormControl variant="standard" className="mb-0">
                <Button variant="contained" className="mt-3" color="secondary">
                  Cancel
                </Button>
              </FormControl>
            </Grid>
          ) : (
            <Grid item xs={12} md={12} lg={7}>
              <FormControl variant="standard" className="mb-0">
                <div className="alert alert-success mt-3">
                  NOTE : Information of real users can't be changed.
                </div>
              </FormControl>
            </Grid>
          )}
          {console.log(singleUserInfo.dob)}
          {localStorage.getItem("UserRole") == 3 &&
          singleUserInfo &&
          singleUserInfo.user_role == 3 ? (
            <></>
          ) : (
            singleUserInfo &&
            singleUserInfo.account_status != 3 && (
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
            )
          )}
        </Grid>
      </div>
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
