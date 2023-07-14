import React, { useState } from 'react';
import { Redirect, Link  } from 'react-router-dom';
import { connect } from 'react-redux';
import { adminLogin,changeEmail } from '../../actions/auth';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import FormControlLabel from '@mui/material/FormControlLabel';
import Checkbox from '@mui/material/Checkbox';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { createTheme} from '@mui/material/styles';
import '../../css/admin/admin.css';
import Copyright from './Copyright';

const theme = createTheme({
  palette: {
    primary: {
        main: '#82005e'
    }
  },
  typography: {
    fontFamily: ['Rubik Regular'].join(','),
    h3: {
      fontFamily: ['Rubik-Semibold'].join(','),
      fontSize: 26,
   }
 },});

function AdminLogin({ adminLogin,changeEmail, auth:{isAuthenticated,forgotPasswordSteps}, alert }) {
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  });
  const [emailValidationError, setEmailValidationError] = useState('');
  const [goToForgotPassword,setGoToForgotPassword] = useState(false);
  const [passwordValidationError, setPasswordValidationError] = useState('');
  const { email, password } = formData;

  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

    const onSubmit = async (e) => {
      e.preventDefault();
      setEmailValidationError("");
      setPasswordValidationError("");
      adminLogin(email, password)
        .then((promiseValue) => {
          if(promiseValue && !promiseValue.success){
            promiseValue.forEach((element) => {
              console.log("res...", element);
              if (element.param == "email") {
                setEmailValidationError(element.msg);
              }
              if (element.param == "password") {
                setPasswordValidationError(element.msg);
              }
            });
          }
          
        })
        .catch((error) => console.log(error));
    };
  const changeCurrentEmail = async => {
    changeEmail();
    setGoToForgotPassword(true);
    
  };
  if (isAuthenticated) {
    return <Redirect to='/admin-dashboard' />;
  }
  if(goToForgotPassword){
    return <Redirect to="/forgot-password" />;
  }

  return (
      <Grid container component="main" sx={{ height: '100vh' }}>
        <CssBaseline />
          <Grid
              item
              xs={false}
              sm={4}
              md={9}
              sx={{
              backgroundImage: 'url(../../../../images/side-img.png)',
              backgroundRepeat: 'no-repeat',
              backgroundColor: (t) =>
                t.palette.mode === 'light' ? t.palette.grey[50] : t.palette.grey[900],
              backgroundSize: 'cover',
              backgroundPosition: 'center',
            }}
          />
        <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square className="login-window">
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column',
              
            }}
          >
            <Box className="header-back">
              <img src="../../../../images/logo-teachify.png" className='w-100' style={{height:'100%'}} />
              {/* <Typography component="h3" variant="h3" className="ext-h3"  sx={{ mb: 2 }} style={{textTransform: 'uppercase'}}>
                Mentors
              </Typography> */}
            </Box>
            <Typography component="h3" variant="h3" className="colr-grey font-bold">
              Welcome Back
            </Typography>
            <Typography variant="body1" className="colr-grey mb-3">
              Please enter your credentials
            </Typography>
            <form  noValidate onSubmit={e => onSubmit(e)} className="logn-form-admin">
              <FormControl variant="standard">
                <InputLabel shrink htmlFor="bootstrap-input">
                  Email
                </InputLabel>
                <TextField sx={{ mb: 1 }} 
                  required
                  fullWidth
                  name="email"
                  id="email"
                  variant="standard"
                  onChange={(e) => onChange(e)}
                />
                {emailValidationError!=''? 
                  <div className="help-block font-small-3">
                    <p className="text-danger">
                      {emailValidationError}
                    </p>
                  </div>:""}
              </FormControl>
              <FormControl variant="standard">
                <InputLabel shrink htmlFor="bootstrap-input">
                  Password
                </InputLabel>
                <TextField 
                  sx={{ mb: 1 }} 
                  required
                  fullWidth
                  type="password"
                  name="password"
                  id="password"
                  variant="standard"
                  onChange={(e) => onChange(e)}
                />
                  {passwordValidationError!=''? 
                    <div className="help-block font-small-3">
                      <p className="text-danger">
                        {passwordValidationError}
                      </p>
                    </div>:""}
              </FormControl>
            
              <FormControlLabel
                control={<Checkbox value="remember" color="primary" />}
                label="Remember me"
              />
              <Button
                type="submit"
                id="submit"
                fullWidth
                variant="contained"
                sx={{ mt: 3, mb: 2 }}
                style={{textTransform: 'Capitalize'}}
              >
                Login
              </Button>
              <Grid container>
                <Grid item xs>
                  <Box 
                    display="flex" 
                    alignItems="center"
                    justifyContent="center"
                  >
                    <InputLabel 
                      shrink 
                      htmlFor="bootstrap-input" 
                      style={{cursor:'pointer'}} 
                      onClick={() => changeCurrentEmail()}>
                        Forgot your password?
                    </InputLabel>
                  </Box>
                </Grid>
              </Grid>
            </form>
          </Box>
          <Copyright className="Footer-side font-med color-grey" sx={{ mt: 5 }} />
        </Grid>
      </Grid>
      );

}

const mapStateToProps = state => ({
  auth: state.auth,
  alert: state.alert
});

export default connect(
  mapStateToProps,
  {adminLogin,changeEmail }
)(AdminLogin);

