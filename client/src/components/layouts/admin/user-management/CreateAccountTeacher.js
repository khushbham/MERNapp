import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import { Button } from '@mui/material';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { FaMobileAlt } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from "react-icons/fa";



const CreateAccountTeacher = () => {
    const [teacherpwd, setTeacherPwd] = useState('');
    const [teacherpasswordView, setTeacherPasswordView] = useState('password');
    const [teacherconfirmpasswordView, setTeacherConfirmPasswordView] = useState('password');
    const generateTeacherPassword = () => {
        var length = 10,
            charset = "@#*&!.abcdefghijk@#*&!.lmnopqrstuvwxyz@#*&!.ABCDEFGHIJKLM@#*&!.NOPQRSTUVWXYZ@#*&!.0123@#*&!.456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setTeacherPwd(retVal)
        //   console.log (retVal);          
    }
    return (
        <Grid container spacing={2} className="create-account-section">
            <Grid item xs={12} md={4} lg={4} xl={4}>
                <FormControl variant="standard">
                    <InputLabel shrink htmlFor="phone">
                        Phone
                    </InputLabel>
                    <TextField sx={{ mb: 1 }}
                        required
                        fullWidth
                        name="phone"
                        id="phone"
                        variant="standard"
                        className="account-fields"
                        InputProps={{
                            startAdornment: (
                                <InputAdornment position="start">
                                    <FaMobileAlt />
                                </InputAdornment>
                            ),
                        }}
                    />
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
                <FormControl fullWidth variant="standard" className="genrr-pass">
                    <InputLabel shrink htmlFor="password" className="new-teacher-password">
                        Password
                    </InputLabel>
                    <div className="input-group mb-3" style={{ marginTop: '20px' }}>
                        <input type={teacherpasswordView} className="form-control" defaultValue={teacherpwd} />
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                {teacherpasswordView == 'password' ?
                                    <FaEye onClick={() => setTeacherPasswordView('text')} /> :
                                    <FaEyeSlash onClick={() => setTeacherPasswordView('password')} />}
                            </span>
                        </div>
                    </div>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
                <FormControl fullWidth variant="standard" className="genrr-pass">
                    <InputLabel shrink htmlFor="confirmpassword" className="new-teacher-password">
                        Confirm Password
                    </InputLabel>
                    <div className="input-group mb-3" style={{ marginTop: '20px' }}>
                        <input type={teacherconfirmpasswordView} className="form-control" defaultValue={teacherpwd} />
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                {teacherconfirmpasswordView == 'password' ?
                                    <FaEye onClick={() => setTeacherConfirmPasswordView('text')} /> :
                                    <FaEyeSlash onClick={() => setTeacherConfirmPasswordView('password')} />}
                            </span>
                        </div>
                    </div>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4}>
                <FormControl variant="standard">
                    <Button name="generate-password" className="generate-button" variant="contained" color="secondary" onClick={generateTeacherPassword}>Generate Password</Button>
                </FormControl>
            </Grid>
        </Grid>
    )
};


export default CreateAccountTeacher;

