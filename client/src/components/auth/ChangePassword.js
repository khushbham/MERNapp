import React,{useEffect} from 'react';
import '../../css/admin/admin.css';
import Button from '@mui/material/Button';
import CssBaseline from '@mui/material/CssBaseline';
import TextField from '@mui/material/TextField';
import Link from '@mui/material/Link';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Typography from '@mui/material/Typography';
import { createTheme, ThemeProvider } from '@mui/material/styles';
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


function ChangePassword() {
  function diff_minutes(dt2, dt1) 
  {

    var diff =(dt2.getTime() - dt1.getTime()) / 1000;
    diff /= 60;
    return (Math.round(diff));
    
  }
  useEffect(() => {
    let otp_expired = localStorage.getItem('expiry_time');
    let currentDateTime = new Date();
          let expiredDateTime = new Date(otp_expired);
          var expiringDifference = diff_minutes(currentDateTime, expiredDateTime);
          if(expiringDifference<0){
            console.log('you can stay on change password page');
          }else{
            console.log('show expiry link text');
          }
  },[]);
  return (
    <>
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
             <div className="header-back">
                <img src="../../../../images/logo-teachify.png" className='w-100' style={{height:'100%'}} />
             {/* <Typography component="h3" variant="h3" className="ext-h3"  sx={{ mb: 2 }} style={{textTransform: 'uppercase'}}>
               Mentors
             </Typography> */}
             </div>
             <Typography component="h3" variant="h3" className="colr-grey font-bold">
             Change Password
             </Typography>
             <Typography variant="body1" className="colr-grey mb-3">
             Please enter your new password
             </Typography>
              <Box component="form" noValidate className="change-passwrd-form">
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="bootstrap-input">
                    Password
                  </InputLabel>
                  <TextField sx={{ mb: 1 }} 
                    required
                    fullWidth
                    type="password"
                    name="password"
                    id="password"
                    variant="standard"
                  />
                </FormControl>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="bootstrap-input">
                      New Password
                  </InputLabel>
                  <TextField sx={{ mb: 1 }} 
                      required
                      fullWidth
                      type="password"
                      name="newpassword"
                      id="newpassword"
                      variant="standard"
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
                <Grid container>
                  <Grid item xs>
                    <Box display="flex" 
                          alignItems="center"
                          justifyContent="center">
                      <Link href="/admin-login" variant="body2" className="color-grey no-text-decoration font-weight-bold">
                        Go Back to login Page
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
     </>
      );

}

export default ChangePassword;

