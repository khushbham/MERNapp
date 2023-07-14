import React, { useState } from "react";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { FormGroup } from "@mui/material";
import { FormControl } from "@mui/material";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import { Button } from "@mui/material";
import Footer from "../Footer";
import { Paper } from "@mui/material";
import { connect } from "react-redux";
import { changePassword } from "../../../../actions/auth";
import Typography from "@mui/material/Typography";

const ChangePassContent = ({ changePassword, auth: { isAuthenticated } }) => {
  const [formDataa, setFormData] = useState({
    previous_password: "",
    new_password: "",
    confirm_password: "",
  });
  const [previousPasswordValidationError, setPreviousPasswordValidationError] =
    useState("");
  const [newPasswordValidationError, setNewPasswordValidationError] =
    useState("");
  const [confirmPasswordValidationError, setConfirmPasswordValidationError] =
    useState("");
  const { previous_password, new_password, confirm_password } = formDataa;
  const [message, setMessage] = useState("");
  const [alertType, setAlertType] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [buttonClass, setButtonClass] = useState("btn btn-primary");
  const onkeyUp = (e) => {
    // setSuccessMessage("Save Changes");
    setButtonClass("btn btn-secondary");
    switch (e.target.id) {
      case "previous_password":
        if (e.target.value == "") {
          setPreviousPasswordValidationError("Required!");
        } else {
          setPreviousPasswordValidationError("");
        }
        break;
      case "new_password":
        if (e.target.value == "") {
          setNewPasswordValidationError("Required!");
        } else {
          setNewPasswordValidationError("");
        }
        break;
      case "confirm_password":
        if (e.target.value == "") {
          setConfirmPasswordValidationError("Required!");
        } else {
          setConfirmPasswordValidationError("");
        }
        break;
      default:
        return "";
    }
  };
  const onChange = (e) => {
    setFormData({ ...formDataa, [e.target.name]: e.target.value });
  };

  const onSubmit = async (e) => {
    setPreviousPasswordValidationError("");
    setConfirmPasswordValidationError("");
    setNewPasswordValidationError("");
    e.preventDefault();

    formDataa.previous_password = e.target.previous_password.value;
    formDataa.new_password = e.target.new_password.value;

    formDataa.confirm_password = e.target.confirm_password.value;

    if (formDataa.previous_password == "") {
      setPreviousPasswordValidationError("Required!");
    }
    if (formDataa.new_password == "") {
      setNewPasswordValidationError("Required!");
    }
    if (formDataa.confirm_password == "") {
      setConfirmPasswordValidationError("Required!");
    }
    if (
      formDataa.new_password != "" &&
      formDataa.confirm_password != "" &&
      formDataa.new_password != formDataa.confirm_password
    ) {
      setConfirmPasswordValidationError("Confirm password does not matched with new password!");
    }
    if (
      formDataa.previous_password != "" &&
      formDataa.new_password != "" &&
      formDataa.confirm_password != "" &&
      formDataa.new_password == formDataa.confirm_password
    ) {
      changePassword(formDataa)
        .then((PromiseValue) => {
          console.log(PromiseValue)
          e.target.previous_password.value = "";
          e.target.new_password.value = "";
          e.target.confirm_password.value = "";
          if (PromiseValue.status) {
            setSuccessMessage("Saved");
            setFormData({
              previous_password: "",
              new_password: "",
              confirm_password: "",
            });
            setTimeout(() => {
              setSuccessMessage("");
            }, 3000);

            setButtonClass("btn btn-success");
          }else{
            PromiseValue.forEach((element) => {
              if (element.param == "previous_password") {
                setPreviousPasswordValidationError(element.msg);
              }
              if (element.param == "new_password") {
                setNewPasswordValidationError(element.msg);
              }
              if (element.param == "confirm_password") {
                setConfirmPasswordValidationError(element.msg);
              }
            });
          }
          
        })
        .catch((error) => console.log(error));
    }
  };

  return (
    <>
      <section className="chnge-pass">
        <Grid container className="p-3 main-head-dashboard">
          <Grid item xs={6} md={6}>
            <Typography variant="h5">Change Password</Typography>
          </Grid>
          <Grid item xs={6} md={6}></Grid>
        </Grid>

        <Grid container className="p-3">
          <Grid item xs={12} md={2} lg={2} xl={2}></Grid>
          <Grid item xs={12} md={8} lg={8} xl={8}>
            <Paper className="change-pass-area p-5">
              {successMessage != "" && (
                <div className="alert alert-success loggedAuth">
                  Password changed successfully.
                </div>
              )}
              <Box
                component="form"
                noValidate
                onSubmit={(e) => onSubmit(e)}
                className="logn-form-admin"
              >
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="password">
                    Previous Password
                  </InputLabel>
                  <TextField
                    sx={{ mb: 1 }}
                    required
                    fullWidth
                    variant="standard"
                    type="password"
                    name="previous_password"
                    id="previous_password"
                    onChange={(e) => onChange(e)}
                    value={previous_password}
                    onKeyUp={(e) => onkeyUp(e)}
                  />
                  {previousPasswordValidationError != "" ? (
                    <div className="help-block font-small-3">
                      <p className="text-danger">
                        {previousPasswordValidationError}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="new-password">
                    New Password
                  </InputLabel>
                  <TextField
                    sx={{ mb: 1 }}
                    required
                    fullWidth
                    variant="standard"
                    type="password"
                    name="new_password"
                    id="new_password"
                    value={new_password}
                    onChange={(e) => onChange(e)}
                    onKeyUp={(e) => onkeyUp(e)}
                  />
                  {newPasswordValidationError != "" ? (
                    <div className="help-block font-small-3">
                      <p className="text-danger">
                        {newPasswordValidationError}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </FormControl>

                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="new-password">
                    Confirm Password
                  </InputLabel>
                  <TextField
                    sx={{ mb: 1 }}
                    required
                    fullWidth
                    variant="standard"
                    type="password"
                    name="confirm_password"
                    id="confirm_password"
                    onChange={(e) => onChange(e)}
                    onKeyUp={(e) => onkeyUp(e)}
                    value={confirm_password}
                  />
                  {confirmPasswordValidationError != "" ? (
                    <div className="help-block font-small-3">
                      <p className="text-danger">
                        {confirmPasswordValidationError}
                      </p>
                    </div>
                  ) : (
                    ""
                  )}
                </FormControl>

                <FormGroup className="admn-log">
                  <Button
                    type="submit"
                    id="submit"
                    fullWidth
                    variant="contained"
                    sx={{ mb: 2 }}
                    style={{ textTransform: "Capitalize" }}
                  >
                    Update Password
                  </Button>
                </FormGroup>
              </Box>
            </Paper>
          </Grid>
          <Grid item xs={12} md={2} lg={2} xl={2}></Grid>
        </Grid>
      </section>
      <Footer />
    </>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { changePassword })(ChangePassContent);
