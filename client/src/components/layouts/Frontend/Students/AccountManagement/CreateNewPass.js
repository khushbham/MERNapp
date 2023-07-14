import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link } from 'react-router-dom';
import '../../../../css/Frontend/style.css';
import Input from '@mui/material/Input';
import { IoMdLock } from "react-icons/io";
import { InputAdornment } from '@mui/material';
import { FormControl } from '@mui/material';
const CreateNewPass = () => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    return (
        <Box className="SignUpFrom ResetPass">
              <Grid container>
                   <Grid item lg={5} xs={12} className="m-auto">
                        <Box className="FormOuter">
                             <Typography variant="h4" component="h2" className="loginHead mb-2">Create new password</Typography>
                             <Typography variant="subtitle1" gutterBottom component="div" className="instruct-text mb-3"> Your new password must be different from previous used password.</Typography>
                             <FormControl variant="standard" className="FiledsOuter InputsWrap">
                                <Input
                                type="password"
                                className="FieldsText"
                                placeholder="Password"
                                id="input-with-icon-adornment"
                                startAdornment={
                                    <InputAdornment position="start">
                                        <IoMdLock/>
                                    </InputAdornment>
                                }
                                />
                             </FormControl>
                                <FormControl variant="standard" className="FiledsOuter">
                                    <Input
                                    type="password"
                                    className="FieldsText"
                                    placeholder="Confirm Password"
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <IoMdLock/>
                                        </InputAdornment>
                                    }
                                    />
                                </FormControl>
                            <Link to="/" className="LoginbtnLink my-4">Reset password</Link>
                        </Box>
                   </Grid>
                </Grid>
                   
        </Box>
    )
}
export default CreateNewPass
