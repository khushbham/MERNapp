import React from 'react'
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
const Input = styled('input')({
    display: 'none',
    });
const AccountSteps = () => {
  const [genderstatus, setGenderStatus] = React.useState('0');
  const handleGender = (event) => {
    setGenderStatus(event.target.value);
  };
    return (
        <Box className="AccountSteps">
           <Container>
           <Grid container>
                <Grid item xs={8} className="m-auto">
                   <Box className="FormOuter accountSteps">
                        <Typography variant="h4" component="h2" className="loginHead mb-2">Create your student profile</Typography>
                         <Grid Container>
                              <Grid item lg={8} xs={12} sm={12} className="m-auto">
                                  <Box className="UploadProfile  my-3">
                                       <img src="../images/oval.png" alt="profile-img" className="profileimgg"/>
                                       <Box className="ms-2">
                                        <Typography variant="h6" gutterBottom component="div" className="profileeHeading">Upload profile picture</Typography>
                                        <Typography variant="caption" display="block" gutterBottom className="subText">Less than 2MB </Typography>  
                                      </Box>
                                  </Box>

                                 <FormControl variant="standard" className="w-100 mb-2">
                                    <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
                                    First Name
                                    </InputLabel>
                                    <TextField sx={{ mb: 1 }} 
                                        required
                                        fullWidth
                                        name="name"
                                        id="name"
                                        variant="standard"
                                        placeholder="Tom"
                                        className="StepsFields"
                                        />
                                </FormControl>
                                <FormControl variant="standard" className="w-100 mb-2">
                                    <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
                                    Last Name
                                    </InputLabel>
                                    <TextField sx={{ mb: 1 }} 
                                        required
                                        fullWidth
                                        name="name"
                                        id="name"
                                        variant="standard"
                                        placeholder="Weber"
                                        className="StepsFields"
                                        />
                                </FormControl>
                                {/* <FormControl className="W-100 SelectFields">
                                    <InputLabel shrink htmlFor="gender" className="studentNameLabel">
                                     Gender Identity
                                    </InputLabel>
                                    <Select
                                        value={genderstatus}
                                        onChange={handleGender}
                                        displayEmpty
                                        color="primary"
                                        className="StepsFields W-100"
                                        inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                        <MenuItem value={0}>Female</MenuItem>
                                        <MenuItem value={1}>Male</MenuItem>
                                        <MenuItem value={2}>Other</MenuItem>
                                    </Select>
                                 </FormControl> */}

                                   <FormControl variant="standard" className="w-100 mb-2">
                                        <InputLabel shrink htmlFor="bootstrap-input" className="studentNameLabel">
                                        Birth Date
                                        </InputLabel>
                                        <TextField
                                            fullWidth
                                            id="date"
                                            type="date"
                                            className="StepsFields"
                                            variant="standard"
                                        />
                                    </FormControl>
                                <FormControl variant="standard" className="w-100 mb-2">
                                    <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
                                    Street Address
                                    </InputLabel>
                                    <TextField sx={{ mb: 1 }} 
                                        required
                                        fullWidth
                                        name="name"
                                        id="name"
                                        variant="standard"
                                        placeholder=""
                                        className="StepsFields"
                                        />
                                </FormControl>
                                <FormControl variant="standard" className="w-100 mb-2">
                                    <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
                                     CIty
                                    </InputLabel>
                                    <TextField sx={{ mb: 1 }} 
                                        required
                                        fullWidth
                                        name="name"
                                        id="name"
                                        variant="standard"
                                        placeholder="CIty"
                                        className="StepsFields"
                                        />
                                </FormControl>
                                <FormControl variant="standard" className="w-100 mb-2">
                                    <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
                                    State
                                    </InputLabel>
                                    <TextField sx={{ mb: 1 }} 
                                        required
                                        fullWidth
                                        name="name"
                                        id="name"
                                        variant="standard"
                                        placeholder="CIty"
                                        className="StepsFields"
                                        />
                                </FormControl>
                                <FormControl variant="standard" className="w-100 mb-2">
                                    <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
                                    Zip code
                                    </InputLabel>
                                    <TextField sx={{ mb: 1 }} 
                                        required
                                        fullWidth
                                        name="name"
                                        id="name"
                                        variant="standard"
                                        placeholder="CIty"
                                        className="StepsFields"
                                        />
                                </FormControl>
                                
                                
                              </Grid>
                         </Grid>
                   </Box>
                </Grid>
             </Grid>
           </Container>
        </Box>
    )
}

export default AccountSteps
