import React,{useState} from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useFormik } from 'formik';
import Typography from '@mui/material/Typography';
import { GoDeviceMobile } from 'react-icons/go';
import {TextField} from '@mui/material';
import Checkbox from '@mui/material/Checkbox';
import { Link, useHistory, useLocation } from 'react-router-dom';
import { Button } from '@mui/material';
import { resend_otp, verify_otp } from '../../../../../actions/frontent';
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';

const Validation = () => {
  const [otp, setOtp] = useState(null);
    const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
    const queryParams = new URLSearchParams(window.location.search);
    const location = useLocation();
    const dispatch = useDispatch() ;
    const history = useHistory()
     const formik = useFormik({
        initialValues: {
          phone:queryParams.get("phone"),
          otp:""
        },
        onSubmit: (values) => {
          const FormData = {
            ...values,
            otp:otp

          }
          dispatch(verify_otp(FormData)).then((res)=>{  
              if (res && res.success) {
                localStorage.setItem("token", res.data.token )
                localStorage.setItem("user_role", res.data.user_role )
                    history.push({
                      pathname: "/student-account-confirmation",
                  })
                }
          }).catch((err)=>{
              console.log(err , "error")
          })
        },
      });
      const resendOtp = ()=>{
        const data = {
            phone:queryParams.get("phone")
        }
        dispatch(resend_otp(data)).then((res)=>{
            if (res && res.success) {
                // localStorage.setItem("token", res.data.token )
                // localStorage.setItem("user_role", res.data.user_role )
                console.log(res , "response")
                }
        }).catch((err)=>{
            console.log(err , "error")
        })
      }
      return (
        <Box className="SignUpFrom ResetPass">
              <Grid container>
                   <Grid item lg={5} xs={12} className="m-auto">
                        <Box className="FormOuter">
                            <Box className="Mob-icon">
                                 <Box className="mobileImage">
                                    <GoDeviceMobile />
                                 </Box>
                            </Box>
                             <Typography variant="h4" component="h2" className="loginHead mb-2"> Enter validation code</Typography>
                             <Typography variant="subtitle1" gutterBottom component="div" className="instruct-text"> We’ve sent you a 6-digit validation token to your phone. Please enter the code below. </Typography>
                            <Box className="mt-4">
                            <TextField  type={'number'} 
                            className="resetField no-arrows"
                            name='otp'
                           inputProps= { 
                                  {max:6, min: 0} 
                              }
                           value={otp}
                            onChange={(e) => {
                              if(e.target.value.length < 7){
                                setOtp(e.target.value);
                              }
                            }}
                            />
                         {formik.errors.otp && formik.touched.otp?(<div className='error_message'>{formik.errors.otp}</div>) : null}
                            </Box>
                            <Box className="terms-conditions d-flex align-items-center" >
                            <Checkbox {...label} defaultChecked />
                            <Typography variant="subtitle1" gutterBottom component="div" className="mb-0 conditions">
                                Remember me on this device
                            </Typography>
                            </Box>
                                <Button className="LoginbtnLink my-4"  onClick={formik.handleSubmit}>Submit</Button>
                                <p><Button className="acc-link" onClick={resendOtp} >  Resend code via text message</Button></p>
                            </Box>
                   </Grid>
                </Grid>
                </Box>
    )
}

export default Validation;
