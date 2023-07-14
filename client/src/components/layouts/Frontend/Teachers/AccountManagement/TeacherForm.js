import { Box, Button } from "@mui/material";
import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import Input from "@mui/material/Input";
import { useFormik } from "formik";
import { InputAdornment } from "@mui/material";
import { FormControl } from "@mui/material";
import { IoIosPhonePortrait } from "react-icons/io";
import { IoMdLock } from "react-icons/io";
import Checkbox from "@mui/material/Checkbox";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import * as yup from "yup";
import { signup } from "../../../../../actions/frontent";
import { BiLeftArrowCircle } from "react-icons/bi";
const label = { inputProps: { "aria-label": "Checkbox demo" } };
const phoneRegExp =
  /^((\\+[1-9]{1,4}[ \\-]*)|(\\([0-9]{2,3}\\)[ \\-]*)|([0-9]{2,4})[ \\-]*)*?[0-9]{3,4}?[ \\-]*[0-9]{3,4}?$/;
const validationSchema = yup.object({
  phone: yup
    .string()
    .required("Phone number is required")
    .matches(phoneRegExp, "Phone number is not valid")
    .min(10, "Phone number should be 10 digit")
    .max(10, "Phone number should be 10 digit"),
  password: yup.string().required("Password is required").min(8),
  confirm_password: yup
    .string()
    .oneOf([yup.ref("password"), null], "Passwords must match"),
  accept_terms_and_conditions: yup
    .array()
    .min(1, "You must accept the terms and conditions"),
});
const TeacherForm = (props) => {
  const dispatch = useDispatch();
  const history = useHistory();
  const { fcm_token, Ip } = props;
  // const [checked, setChecked] = useState(true);
  const formik = useFormik({
    initialValues: {
      phone: "",
      password: "",
      confirm_password: "",
      user_role: 2,
      accept_terms_and_conditions: [],
    },
    validationSchema: validationSchema,
    onSubmit: (values) => {
      const formdata = {
        ...values,
        accept_terms_and_conditions: values.accept_terms_and_conditions.length
          ? 1
          : false,
        fcmToken: fcm_token,
        ipAddress: Ip,
        deviceId: null,
        platform: "web",
      };
      dispatch(signup(formdata))
        .then((res) => {
          if (res && res.success) {
            history.push({
              pathname: "/validation-pass",
              search: `phone=${values.phone}`,
            });
          }
        })
        .catch((err) => {
          console.log(err, "error");
        });
    },
  });
  return (
    <Box>
      <FormControl variant="standard" className="FiledsOuter InputsWrap">
        <div className="input-group teachers_phn">
          <span className="input-group-text" id="teachers_phonee">
            <IoIosPhonePortrait />
          </span>
          <span
            className="input-group-text pink-plus-one"
            id="plus-one-teachers"
          >
            +1
          </span>
          <input
            type="number"
            className="form-control no-arrows-login"
            placeholder="Phone number"
            aria-label="Phone number"
            name="phone"
            aria-describedby="teachers_phonee"
            defaultValue={formik.values.phone}
            onChange={formik.handleChange}
          />
        </div>

        {/* <Input
          type="number"
          className="FieldsText no-arrows"
          placeholder="Phone number"
          id="input-with-icon-adornment"
          startAdornment={
            <InputAdornment position="start">
              <IoIosPhonePortrait />
            </InputAdornment>
          }
          name="phone"
          value={formik.values.phone}
          onChange={formik.handleChange}
          helperText={formik.touched.phone && formik.errors.phone}
        /> */}
        {formik.errors.phone && formik.touched.phone ? (
          <div className="error_message">{formik.errors.phone}</div>
        ) : null}
      </FormControl>
      <FormControl variant="standard" className="FiledsOuter InputsWrap">
        <Input
          type="password"
          className="FieldsText"
          placeholder="Password"
          id="input-with-icon-adornment"
          startAdornment={
            <InputAdornment position="start">
              <IoMdLock />
            </InputAdornment>
          }
          name="password"
          value={formik.values.password}
          onChange={formik.handleChange}
          error={formik.touched.password && Boolean(formik.errors.password)}
          helperText={formik.touched.password && formik.errors.password}
        />
        {formik.errors.password && formik.touched.password ? (
          <div className="error_message">{formik.errors.password}</div>
        ) : null}
      </FormControl>
      <FormControl variant="standard" className="FiledsOuter">
        <Input
          type="password"
          className="FieldsText"
          placeholder="Confirm Password"
          id="input-with-icon-adornment"
          startAdornment={
            <InputAdornment position="start">
              <IoMdLock />
            </InputAdornment>
          }
          name="confirm_password"
          value={formik.values.confirm_password}
          onChange={formik.handleChange}
          //error={formik.touched.confirm_passowrd && Boolean(formik.errors.confirm_passowrd)}
          helperText={
            formik.touched.confirm_passowrd && formik.errors.confirm_passowrd
          }
        />
        {formik.errors.confirm_password && formik.touched.confirm_password ? (
          <div className="error_message">{formik.errors.confirm_password}</div>
        ) : null}
      </FormControl>
      <Box className="terms-conditions d-flex align-items-center">
        <Checkbox
          {...label}
          name="accept_terms_and_conditions"
          defaultChecked={formik.values.accept_terms_and_conditions.length}
          onChange={formik.handleChange}
          helperText={
            formik.touched.term_condition && formik.errors.term_condition
          }
        />
        <a
          href="https://mern.com/mern-app-terms-of-use/"
          style={{ textDecoration: "none" }}
        >
          <Typography
            variant="subtitle1"
            gutterBottom
            component="div"
            className="mb-0 conditions"
          >
            Accept terms & conditions
          </Typography>
        </a>
      </Box>
      {formik.errors.accept_terms_and_conditions &&
      formik.touched.accept_terms_and_conditions ? (
        <div className="error_message">
          {formik.errors.accept_terms_and_conditions}
        </div>
      ) : null}
      <Button className="LoginbtnLink my-4" onClick={formik.handleSubmit}>
        {" "}
        Sign up
      </Button>
      <p>
        Already have an account?{" "}
        <Link to="/teacher/sign-in" className="acc-link">
          Log in
        </Link>
      </p>
      <br/>
      <br/>
      <p>
        By signing up, You are agree with our{" "}
        <a href="https://mern.com/mern-app-terms-of-use/" className="acc-link">
          Terms
        </a>
        .Learn how we use your data in our{" "}
        <a href="https://mern.com/mern-app-privacy-policy/" className="acc-link">
          Privacy Policy
        </a>
        .
      </p>
      <Link to="/" className="BackToHome mt-4">
        <BiLeftArrowCircle />
        Back to home
      </Link>
    </Box>
  );
};

export default TeacherForm;
