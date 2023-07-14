import React,{useEffect, useState} from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { useFormik } from 'formik';
import Grid from '@mui/material/Grid';
import Input from '@mui/material/Input';
import { Button, InputAdornment } from '@mui/material';
import { FormControl } from '@mui/material';
import { IoIosPhonePortrait } from "react-icons/io";
import { IoMdLock } from "react-icons/io";
import { BiLeftArrowCircle } from "react-icons/bi";
import { Link , useHistory } from 'react-router-dom';
import { useDispatch, useSelector } from "react-redux";
import * as yup from 'yup';
import { login } from '../../../../../actions/frontent';
import { getMessaging , getToken } from "firebase/messaging";
import {app} from '../../../../../firebase';

  const validationSchema = yup.object({
    phone: yup.number()
              .typeError("That doesn't look like a phone number")
               .positive(" phone number can't start with a minus")
               .integer(" phone number can't include a decimal point")
                 .min(10, "Phone number must be 10 digit")
                .required(' phone number is required'),
     password:yup.string().required('Password is required').min(8),
      });
   const Login = () => {
    const dispatch = useDispatch();
    const messaging = getMessaging(app);
    const history = useHistory()
    const [checked, setChecked] = useState(true);
    const [fcm_token , setfcm_token] = useState();
    const [Ip , setIp] = useState();


        const formik = useFormik({
          initialValues: {
            phone:"",
	        password:"",
          },
          validationSchema: validationSchema,
          onSubmit: (values) => {
            const formdata = {
                ...values,
                fcmToken: fcm_token,
                ipAddress: Ip,
                deviceId:null,
                platform:'web',
              };
            dispatch(login(formdata)).then((res)=>{  
                localStorage.setItem("token", res.data.token )
                localStorage.setItem("user_role", res.data.user_role )
                localStorage.setItem("profile_created", res.data.profile_created )
                if (res && res.success) {
                    if(res.data.user_role == 1){
                        history.push({
                            pathname: "/student/dashboard",
                            // state: { phone: values.phone }
                        })
                    }else{
                        history.push({
                            pathname: "/teacher/dashboard",
                            // state: { phone: values.phone }
                        })
                    }
                     
                }
            }).catch((err)=>{
                console.log(err , "error")
            })
                
            console.log(values, "values")
          },
        });
        useEffect(()=>{
            fetch("https://api.ipify.org?format=json")
            .then((response) => response.json())
            .then((data)=> setIp(data.ip))
            getToken(messaging, { vapidKey: 'BG_ff9xfhUXwax2eWj-6ikGC2Mm_Mgcygj56YwkgcLZZBC4X_oX25bmroUZLxXsirFjmB5ZUlPYHF1oBYarse_I' }).then((currentToken) => {
                if (currentToken) {
                  console.log(currentToken , "current Token")
                  setfcm_token(currentToken)
                } else {
                  // Show permission request UI
                  console.log('No registration token available. Request permission to generate one.');
                  // ...
                }
              }).catch((err) => {
                console.log('An error occurred while retrieving token. ', err);
                // ...
              });
               
        },[Ip,fcm_token])
    return (
        <Box className="LoginWrapper">
             <Container>
                 <Grid container>
                        <Grid item lg={5} xs={12} className="m-auto">
                             <Box className="outerWrapper">
                                <Typography variant="h4" component="h2" className="HeadingText mb-2"> Log in to your account</Typography>
                                    <Box className="LoginForm">


                                        <FormControl variant="standard" className="FiledsOuter">
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

                                             name='phone'
                                             value={formik.values.phone}
                                             onChange={formik.handleChange}
                                             helperText={formik.touched.phone && formik.errors.phone}
                                                 />
                                 {formik.errors.phone && formik.touched.phone?(<div className='error_message'>{formik.errors.phone}</div>) : null}
                                        </FormControl>
                                         <FormControl variant="standard" className="FiledsOuter">
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
                                            name = 'password'
                                            value={formik.values.password}
                                            onChange={formik.handleChange}
                                            error={formik.touched.password && Boolean(formik.errors.password)}
                                            helperText={formik.touched.password && formik.errors.password}
                                                />
                                      {formik.errors.password && formik.touched.password?(<div className='error_message'>{formik.errors.password}</div>) : null}
                                          </FormControl>
                                        </Box>

                                       <Box>
                                       <Link to="/reset-password" className="passLink mt-4">Forgot Password</Link>
                                       </Box>
                                       <Box className="LoginBtn">
                                         <Grid item lg={10} xs={12} className="m-auto mb-4">
                                            <Button onClick={formik.handleSubmit}>LOG IN</Button>
                                        </Grid>
                                       </Box>
                                       <Typography variant="p" component="p" className="mt-5"> <p>Don’t have an account yet? <Link to="/students/sign-up" className="AccountName create_account_text"> Create account</Link></p></Typography>
                                       <Link to="/" className="BackToHome"><BiLeftArrowCircle />Back to home</Link>
                             </Box>
                        </Grid>
                    </Grid>
             </Container>
        </Box>
    )
}
export default Login
