import React, { useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import { useFormik } from "formik";
import Typography from "@mui/material/Typography";
import { GoDeviceMobile } from "react-icons/go";
import { TextField } from "@mui/material";
import Input from "@mui/material/Input";
import Checkbox from "@mui/material/Checkbox";
import {
  resend_otp,
  verifyOtpAfterForgotPassword,
  verify_otp,
} from "../../../../../actions/frontent";
import { useDispatch, useSelector } from "react-redux";
import { Link, useHistory, useLocation } from "react-router-dom";
import * as yup from "yup";
import { Button } from "@mui/material";


const TeacherValidationResetPass = () => {
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const queryParams = new URLSearchParams(window.location.search);
  const [otp, setOtp] = useState(null);
  const location = useLocation();
  const dispatch = useDispatch();
  const history = useHistory();
  const formik = useFormik({
    initialValues: {
      phone: queryParams.get('phone'),
      otp: ''
    },
    onSubmit: (values) => {
      const formData = {
        ...values,
        otp: otp
      }
      dispatch(verifyOtpAfterForgotPassword(formData))
        .then((res) => {
          if (res && res.success) {
            localStorage.setItem("token", res.data.token);
            history.push({
              pathname: "/create-password",
              search: `id=${res.data.id}`,
            });
          }
        })
        .catch((err) => {
          console.log(err, "error");
        });
    },
  });
  const resendOtp = () => {
    const data = {
      phone: location.state.phone,
    };
    dispatch(resend_otp(data))
      .then((res) => {
        // localStorage.setItem("token", res.data.token )
      })
      .catch((err) => {
        console.log(err, "error");
      });
  };
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
            <Typography variant="h4" component="h2" className="loginHead mb-2">
              {" "}
              Enter validation code
            </Typography>
            <Typography
              variant="subtitle1"
              gutterBottom
              component="div"
              className="instruct-text"
            >
              {" "}
              We’ve sent you a 6-digit validation token to your phone. Please
              enter the code below.{" "}
            </Typography>
            <Box className="mt-4">
              <TextField type={'number'}
                className="resetField no-arrows"
                name='otp'
                inputProps={
                  { max: 6, min: 0 }
                }
                value={otp}
                onChange={(e) => {
                  if (e.target.value.length < 7) {
                    setOtp(e.target.value);
                  }
                }}></TextField>
            </Box>
            <Box className="terms-conditions d-flex align-items-center">
              <Checkbox {...label} defaultChecked />
              <Typography
                variant="subtitle1"
                gutterBottom
                component="div"
                className="mb-0 conditions"
              >
                Remember me on this device
              </Typography>
            </Box>
            <Button className="LoginbtnLink my-4" onClick={formik.handleSubmit}>
              Submit
            </Button>
            <p className="text-center">
              <Button className="acc-link" onClick={resendOtp}>
                {" "}
                Resend code via text message
              </Button>
            </p>
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default TeacherValidationResetPass;
