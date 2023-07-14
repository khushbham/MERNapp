import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import { Button } from '@mui/material';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { FaMobileAlt } from 'react-icons/fa';
import { FaEye, FaEyeSlash } from "react-icons/fa";

const CreateAccountStudent = () => {
    const [studentpwd, setStudentPwd] = useState('');
    const [studentpasswordView, setStudentPasswordView] = useState('password');
    const [studentconfirmpasswordView, setStudentConfirmPasswordView] = useState('password');
    const generateStudentPassword = () => {
        var length = 10,
            charset = "@#*&!.abcdefghijk@#*&!.lmnopqrstuvwxyz@#*&!.ABCDEFGHIJKLM@#*&!.NOPQRSTUVWXYZ@#*&!.0123@#*&!.456789",
            retVal = "";
        for (var i = 0, n = charset.length; i < length; ++i) {
            retVal += charset.charAt(Math.floor(Math.random() * n));
        }
        setStudentPwd(retVal)    
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
                    <InputLabel shrink htmlFor="password" className="new-student-password">
                        Password
                    </InputLabel>
                    <div className="input-group mb-3" style={{ marginTop: '20px' }}>
                        <input type={studentpasswordView} className="form-control" defaultValue={studentpwd} />
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                {studentpasswordView == 'password' ?
                                    <FaEye onClick={() => setStudentPasswordView('text')} /> :
                                    <FaEyeSlash onClick={() => setStudentPasswordView('password')} />}
                            </span>
                        </div>
                    </div>
                </FormControl>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
                <FormControl fullWidth variant="standard" className="genrr-pass">
                    <InputLabel shrink htmlFor="confirmpassword" className="new-student-password">
                        Confirm Password
                    </InputLabel>
                    <div className="input-group mb-3" style={{ marginTop: '20px' }}>
                        <input type={studentconfirmpasswordView} className="form-control" defaultValue={studentpwd} />
                        <div className="input-group-prepend">
                            <span className="input-group-text" id="basic-addon1">
                                {studentconfirmpasswordView == 'password' ?
                                    <FaEye onClick={() => setStudentConfirmPasswordView('text')} /> :
                                    <FaEyeSlash onClick={() => setStudentConfirmPasswordView('password')} />}
                            </span>
                        </div>
                    </div>
                </FormControl>
            </Grid>

            <Grid item xs={12} md={4} lg={4} xl={4}>
                <FormControl variant="standard">
                    <Button name="generate-password" className="generate-button" variant="contained" color="secondary" onClick={generateStudentPassword}>Generate Password</Button>
                </FormControl>
            </Grid>
        </Grid>
    )
};


export default CreateAccountStudent;

