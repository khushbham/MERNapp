import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import { Link, useHistory } from 'react-router-dom';
import { useFormik } from 'formik';
import { IoIosPhonePortrait } from "react-icons/io";
import Input from '@mui/material/Input';
import { Button, InputAdornment } from '@mui/material';
import { FormControl } from '@mui/material';
import { BiLeftArrowCircle } from "react-icons/bi";
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
import { reset_password } from '../../../../../actions/frontent';

const phoneRegExp = /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/
const validationSchema = yup.object({
    phone: yup.string()
    .required("required")
   .matches(phoneRegExp, 'Phone number is not valid')
   .min(10, "Phone number should be 10 digit")
   .max(10, "Phone number should be 10 digit"),
      });
const ResetPassword = () => {
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const dispatch = useDispatch()
    const history = useHistory()
    const formik = useFormik({
        initialValues: {
          phone:"",
        },
        validationSchema: validationSchema,
        onSubmit: (values) => {
          dispatch(reset_password(values)).then((res)=>{  
              if (res && res.success) {
                    history.push({
                      pathname:`/validation-for-reset`,
                      search:`phone=${values.phone}`,
                      state: {phone:values.phone }
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
                   <Grid item lg={4} md={5} xs={12} className="m-auto">
                        <Box className="FormOuter">
                             <Typography variant="h4" component="h2" className="loginHead mb-2">Reset password</Typography>
                             <Typography variant="subtitle1" gutterBottom component="div" className="instruct-text mb-3"> Enter the Phone number associated with your account and we’ll send a message with instructions to reset your password.</Typography>
                             <FormControl variant="standard" className="FiledsOuter InputsWrap">
                                    <Input
                                    type="number"
                                    className="FieldsText no-arrows"
                                    placeholder="Phone number"
                                    id="input-with-icon-adornment"
                                    startAdornment={
                                        <InputAdornment position="start">
                                            <IoIosPhonePortrait/>
                                        </InputAdornment>
                                    }
                                    name="phone"
                                    onChange={formik.handleChange}
                               //  error={formik.touched.phone && Boolean(formik.errors.phone)}
                                  helperText={formik.touched.phone && formik.errors.phone}
                                  />
                             {formik.errors.phone && formik.touched.phone?(<div className='error_message'>{formik.errors.phone}</div>) : null}
                                </FormControl>
                                <Button className="LoginbtnLink my-4" onClick={formik.handleSubmit}>Send instructions</Button>
                                <Link to="/login" className="BackToHome mt-4"><BiLeftArrowCircle />Back to login</Link>
                        </Box>
                   </Grid>
                </Grid>
                   
        </Box>
    )
}

export default ResetPassword
