import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import Typography from '@mui/material/Typography';
import { Link , useHistory ,useLocation } from 'react-router-dom';
import Input from '@mui/material/Input';
import { useDispatch } from "react-redux";
import { IoMdLock } from "react-icons/io";
import { Button, InputAdornment } from '@mui/material';
import { FormControl } from '@mui/material';
import * as yup from 'yup';
import { newPassword } from '../../../../../actions/frontent';

const validationSchema = yup.object({
     new_password:yup.string().required('Password is required').min(8),
     confirm_password:yup.string().required("Confirm Password is required").oneOf([yup.ref('new_password'), null],'Passwords must match'),
    //  accept_terms_and_conditions: yup.array().oneOf(["on"], "You must accept the terms and conditions")

      });
const CreateNewPassword = () => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const queryParams = new URLSearchParams(window.location.search);
    const dispatch = useDispatch();
    const location = useLocation();
    const history = useHistory()

    const id = queryParams.get('id')
    const formik = useFormik({
        initialValues: {
            new_password:"",
            confirm_password:"",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          dispatch(newPassword(values,id)).then((res)=>{  
              if (res && res.success) {
                    history.push({
                      pathname: "/teacher/sign-in",
                  })
                }
          }).catch((err)=>{
              console.log(err , "error")
          })
        },
      });
    return (
        <Box className="SignUpFrom ResetPass">
              <Grid container>
                   <Grid item lg={5} xs={12} className="m-auto">
                        <Box className="FormOuter">
                             <Typography variant="h4" component="h2" className="loginHead mb-2">Create new password 
                             </Typography>
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
                                 name="new_password"
                                 value={formik.values.new_password}
                                 onChange={formik.handleChange}
                                 error={formik.touched.new_password && Boolean(formik.errors.new_password)}
                                  helperText={formik.touched.new_password && formik.errors.new_password}
                                  />
                 {formik.errors.new_password && formik.touched.new_password?(<div className='error_message'>{formik.errors.new_password}</div>) : null}
                             </FormControl>
                             <Typography align='left' className="passwordInstructions">Must be at least 8 characters.</Typography>
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
                                    name="confirm_password"
                                    value={formik.values.confirm_password}
                                    onChange={formik.handleChange}
                                    helperText={formik.touched.confirm_passowrd && formik.errors.confirm_passowrd}
                                    />
                                {formik.errors.confirm_password && formik.touched.confirm_password?(<div className='error_message'>{formik.errors.confirm_password}</div>) : null}
                                </FormControl>
                                <Typography align='left' className="passwordInstructions">Both passwords must match.</Typography>
                            <Button  className="LoginbtnLink my-4" onClick={formik.handleSubmit}>Reset password</Button>
                        </Box>
                   </Grid>
                </Grid>
                   
        </Box>
    )
}
export default CreateNewPassword
