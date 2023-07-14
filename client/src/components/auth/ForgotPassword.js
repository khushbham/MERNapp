import React,{useState,useEffect} from 'react';
import '../../css/admin/admin.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
import Copyright from './Copyright';
import { Redirect,Link } from 'react-router-dom';
import { forgotPassword,changeEmail,verifyOtp,resetPassword } from '../../actions/auth';
import { connect } from 'react-redux';
import { faAngleLeft } from "@fortawesome/free-solid-svg-icons";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

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
function ForgotPassword({
  forgotPassword,
  changeEmail,
  verifyOtp, 
  resetPassword,
  auth:{forgotPasswordSteps,changePasswordLink,goBackToLogin}}) {
  const [formData, setFormData] = useState({
    email: '',
    otp: '',
    password:'',
    confirm_password : ''
  });
  const [userVerifiedStep,setUserVerifiedStep] = useState(forgotPasswordSteps);
  const { email, otp, password , confirm_password } = formData;
  function diff_minutes(dt2, dt1) 
  {

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return (Math.round(diff));
    
  }
  useEffect(() => {
    setUserVerifiedStep(forgotPasswordSteps);
    if(forgotPasswordSteps == 3){
      let otp_expired = localStorage.getItem('expiry_time');
      let currentDateTime = new Date();
      let expiredDateTime = new Date(otp_expired);
      var expiringDifference = diff_minutes(currentDateTime, expiredDateTime);
      if(expiringDifference<0){
        console.log('you can stay on change password page');
      }else{
        console.log('show expiry link text');
      }
    }
  }, [forgotPasswordSteps]);
  const onChange = e =>
    setFormData({ ...formData, [e.target.name]: e.target.value });

  const sendVerificationOtp = async e => {
    e.preventDefault();
    console.log('email send',e.target.email.value);
    forgotPassword(email);
  };
  const handleVerifyOtp = async e => {
    e.preventDefault();

    console.log('email send',e.target.otp.value);
    verifyOtp(email,otp);
  };
  const handleChangePassword = async e => {
    e.preventDefault();
    var changePasswordObject = {
      email : email,
      password :password,
      confirm_password:confirm_password
    }
    resetPassword(changePasswordObject);
  };
  const changeCurrentEmail = async => {
    changeEmail();
  };
  if(goBackToLogin){
    return <Redirect to="admin-login" />;

  }
  return (
    <ThemeProvider theme={theme}>
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
              backgroundPosition: 'center'
          }}>
        </Grid>
        <Grid item xs={12} sm={8} md={3} component={Paper} elevation={6} square className="login-window">
       
          <Box
            sx={{
              my: 8,
              mx: 4,
              display: 'flex',
              flexDirection: 'column'
            }}
          >
             
            <Box className="header-back">
              <img src="../../../../images/logo-teachify.png" className='w-100' style={{height:'100%'}} />
              {/* <Typography component="h3" variant="h3" className="ext-h3"  sx={{ mb: 2 }} style={{textTransform: 'uppercase'}}>
                Mentors
              </Typography> */}
            </Box>
            {userVerifiedStep == 1 &&
              <>
              <Typography component="h3" variant="h3" className="colr-grey font-bold">
                Forgot Password
              </Typography>
              <Typography variant="body1" className="colr-grey mb-3">
                Please enter your email
              </Typography>
              <Box component="form" onSubmit={e => sendVerificationOtp(e)} noValidate className="frgt-pass-form">
                <FormControl variant="standard" >
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
                </FormControl>
                <Button
                  type="submit"
                  id="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{textTransform: 'Capitalize'}}
                >
                  Send Verification Link
                </Button>
                
              </Box>
              </>
            }
            {userVerifiedStep == 2 &&
              <>
              <Typography component="h3" variant="h3" className="colr-grey font-bold">
                Enter validation code
              </Typography>
              <Typography variant="body1" className="colr-grey mb-3">
                We’ve sent you a 6-digit validation token to your email. Please enter the code below.
              </Typography>
              <Box component="form" onSubmit={e => handleVerifyOtp(e)} noValidate className="frgt-pass-form">
                <FormControl variant="standard" >
                  <TextField sx={{ mb: 1 }} 
                    required
                    fullWidth
                    name="otp"
                    id="otp"
                    variant="standard"
                    onChange={(e) => onChange(e)}
                  />
                </FormControl>
                <InputLabel 
                  shrink 
                  htmlFor="bootstrap-input" 
                  style={{cursor:'pointer'}} 
                  onClick={() => changeCurrentEmail()}>
                  <FontAwesomeIcon icon={faAngleLeft} /> Change Email
                </InputLabel>
                <Button
                  type="submit"
                  id="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{textTransform: 'Capitalize'}}
                >
                  Submit
                </Button>
                
              </Box>
              </>
            }
            {userVerifiedStep == 3 &&
            <>
            <Typography component="h3" variant="h3" className="colr-grey font-bold">
            Change Password
              </Typography>
              <Typography variant="body1" className="colr-grey mb-3">
              Please enter your new password
              </Typography>
              <Box component="form"  onSubmit={e => handleChangePassword(e)} noValidate className="change-passwrd-form">
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="bootstrap-input">
                    New Password
                  </InputLabel>
                  <TextField sx={{ mb: 1 }} 
                    required
                    fullWidth
                    type="password"
                    name="password"
                    id="password"
                    variant="standard"
                    onChange={(e) => onChange(e)}

                  />
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="bootstrap-input">
                      Confirm Password
                  </InputLabel>
                  <TextField sx={{ mb: 1 }} 
                      required
                      fullWidth
                      type="password"
                      name="confirm_password"
                      id="newpassword"
                      variant="standard"
                      onChange={(e) => onChange(e)}

                    />
                </FormControl>
                
                <Button
                  type="submit"
                  id="submit"
                  fullWidth
                  variant="contained"
                  sx={{ mt: 3, mb: 2 }}
                  style={{textTransform: 'Capitalize'}}
                >
                  Reset Password
                </Button>
              </Box>
              
            </>
            }
            <Box>
              <Grid container>
                <Grid item xs>
                  <Box 
                    display="flex" 
                    alignItems="center"
                    justifyContent="center">
                    <Link to="/admin-login" variant="body2" className="color-grey no-text-decoration font-weight-bold">
                      Go back to Login Page 
                    </Link>
                  </Box>
                </Grid>
              </Grid>
            </Box>
          </Box>
          <Copyright className="Footer-side font-med color-grey" sx={{ mt: 5 }} />
        </Grid>
      </Grid>
    </ThemeProvider>
  );

}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {forgotPassword,changeEmail,verifyOtp,resetPassword }
)(ForgotPassword);

