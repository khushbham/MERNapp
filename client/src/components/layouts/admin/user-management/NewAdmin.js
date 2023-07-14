import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import IconButton from '@mui/material/IconButton';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiEdit } from 'react-icons/fi';
import OutlinedInput from '@mui/material/OutlinedInput';


const NewAdmin = () => {
  const [adminpicture, setadminpicture] = useState(null);
  const [imgadminData, setimgadminData] = useState(null);
  const onChangeadminpicture = e => {
    if (e.target.files[0]) {
      console.log("adminpicture: ", e.target.files);
      setadminpicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setimgadminData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const Input = styled('input')({
    display: 'none',
  });
  const [adminpwd, setAdminPwd] = useState('');
  const [passwordView, setPasswordView] = useState('password');
  const generatePassword = () => {
    var length = 10,
      charset = "@#*&!.abcdefghijk@#*&!.lmnopqrstuvwxyz@#*&!.ABCDEFGHIJKLM@#*&!.NOPQRSTUVWXYZ@#*&!.0123@#*&!.456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    setAdminPwd(retVal)          
  }
  return (
    <Grid container className="py-3">
      <Grid item xs={12} md={12} lg={12} xl={12}>
        <div className="admin-area">
          <Box component="form">
            <Grid container>
              <Grid item xs={12} md={12} lg={12} xl={12}>
                <FormControl className="mt-3 mb-5">
                  <InputLabel shrink htmlFor="profile-pic">
                    Upload profile picture
                  </InputLabel>
                  <div className="profile-pic-area">
                    <div className="profile-pic">
                      <img src={imgadminData} className="ProfilePic_user w-100" />
                    </div>
                    <div className="upload-icon">
                      <label htmlFor="icon-button-file">
                        <Input accept="image/*" id="icon-button-file" type="file" onChange={onChangeadminpicture} />
                        <Button variant="contained" component="span" className="side-upload-button">
                          <FiEdit />
                        </Button>
                      </label>
                    </div>
                  </div>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container className="main-new-user-area" spacing={2}>
              <Grid item xs={12} md={12} lg={6} xl={6}>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="admin-name" className="new-user-name">
                    Name
                  </InputLabel>
                  <TextField sx={{ mb: 1 }}
                    required
                    fullWidth
                    name="name"
                    id="name"
                    variant="standard"
                    placeholder="Enter admin name"
                    className="new-user-fields"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6}>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="admin-email" className="new-user-email">
                    Email
                  </InputLabel>
                  <TextField sx={{ mb: 1 }}
                    required
                    fullWidth
                    name="email"
                    id="email"
                    variant="standard"
                    placeholder="Enter admin email"
                    className="new-user-fields"
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6} className="generate-passwrd">
                {/* <InputLabel htmlFor="outlined-adornment-password">Password</InputLabel> */}
                <FormControl fullWidth variant="standard" className="genrr-pass">
                  <InputLabel shrink htmlFor="admin-password" className="new-admin-password">
                    Password
                  </InputLabel>
                  <div className="input-group mb-3" style={{ marginTop: '20px' }}>
                    <input type={passwordView} className="form-control" defaultValue={adminpwd} />
                    <div className="input-group-prepend">
                      <span className="input-group-text" id="admin-gen-pass">
                        {passwordView == 'password' ?
                          <FaEye onClick={() => setPasswordView('text')} /> :
                          <FaEyeSlash onClick={() => setPasswordView('password')} />}
                      </span>
                    </div>
                  </div>


                </FormControl>

              </Grid>
              <Grid item xs={12} md={12} lg={6} xl={6}>
                <FormControl variant="standard" style={{ marginTop: '20px' }}>
                  <Button name="generate-password" className="generate-button" variant="contained" color="secondary" onClick={generatePassword}>Generate Password</Button>
                </FormControl>
              </Grid>
            </Grid>
            <Grid container className="save-sct-user pb-5">
              <Grid item xs={12} md={12} lg={12}>
                <FormControl variant="standard" className="mb-0">
                  <Button variant="contained" className="mt-3 add-user-btn" color="primary">Add Admin</Button>
                </FormControl>
              </Grid>
            </Grid>


          </Box>
        </div>
      </Grid>
    </Grid>
  )
};


export default NewAdmin;