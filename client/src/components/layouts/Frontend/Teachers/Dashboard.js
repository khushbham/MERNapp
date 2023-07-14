import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Navbar from '../Navbar';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { Link } from 'react-router-dom';
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import {FiSearch} from "react-icons/fi";
import { styled, alpha } from '@mui/material/styles';
import { useDispatch } from 'react-redux';
import { teacherDashboard } from '../../../../actions/frontent';
const Search = styled('div')(({ theme }) => ({
    position: 'relative',
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    '&:hover': {
      backgroundColor: alpha(theme.palette.common.white, 0.80),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: '100%',
    marginTop:'5px',
    [theme.breakpoints.up('sm')]: {
      width: '100%',
    },
  }));
  
  const SearchIconWrapper = styled('div')(({ theme }) => ({
    padding: theme.spacing(0, 2),
    height: '100%',
    position: 'absolute',
    top: '0',
    left: '0',
    pointerEvents: 'none',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
  }));
  const StyledInputBase = styled(InputBase)(({ theme }) => ({
    color: 'inherit',
    '& .MuiInputBase-input': {
      padding: theme.spacing(1.5, 1, 1.5, 5),
      transition: theme.transitions.create('width'),
      width: '100%',
      borderRadius:'24px',
      [theme.breakpoints.up('md')]: {
        width: '100%',
      },
    },
  }));
  
const Dashboard = () => {

    return (
        <Box className="teacherDashboard">
           <Navbar/>
           <Box className="DashboardContent py-5">
            <Container>
                <Typography variant="h6" gutterBottom component="div" className="UserName">Hello Tom,</Typography>
                <Grid  container>
                     <Grid item lg={6} md={8} sm={12} xs={12} className="mb-4 mt-2" >
                        <FormControl variant="standard" className="w-100" >
                            <Search className="SearchField"> 
                                <StyledInputBase 
                                className="w-100"
                                placeholder="What would you like to learn today?"
                                />
                                <SearchIconWrapper>
                                <FiSearch />
                                </SearchIconWrapper>
                            </Search>
                        </FormControl>
                     </Grid>
                </Grid>

                <Box className="Overview-wrapper mt-4">
                    <Grid container spacing={4}>
                        <Grid item lg={6} md={6} sm={12} xs={12}>
                           <Typography variant="h5" gutterBottom component="div" className="overviewHeading">Overview</Typography>
                           <Grid container>
                                <Grid item xs={4}>
                                    <Box className="overviewText">
                                    <Typography variant="h3" gutterBottom component="div" className="overviewHead">68</Typography>
                                    <Typography variant="h6" gutterBottom component="div" className="overviewSubText">Sessions so far</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box className="overviewText">
                                        <Typography variant="h3" gutterBottom component="div" className="overviewHead">230</Typography>
                                        <Typography variant="h6" gutterBottom component="div" className="overviewSubText">Students enrolled</Typography>
                                    </Box>
                                </Grid>
                                <Grid item xs={4}>
                                    <Box className="overviewText">
                                    <Typography variant="h3" gutterBottom component="div" className="overviewHead">$3687</Typography>
                                    <Typography variant="h6" gutterBottom component="div" className="overviewSubText">Class earnings</Typography>
                                    </Box>
                                </Grid>
                            </Grid>
                         </Grid>
                         <Grid item lg={6} md={6} sm={12} xs={12}>
                            <Box className="NextscheduleWrap">
                                <Box className="detailsOuter">
                                    <Typography variant="h5" gutterBottom component="div" className="">Next scheduled class</Typography>
                                    <Link to="/" className="detailsLink">View Details</Link>
                                </Box>
                                <Box className="scheduleClassDetails">
                                    <Grid container className="innertext">
                                        <Grid item lg={2} md={2} sm={4} xs={6}>
                                        <Typography variant="h6" gutterBottom component="div">Class</Typography>
                                        </Grid>
                                        <Grid item lg={10} md={10} sm={8} xs={6}>
                                        <Typography variant="h6" gutterBottom component="div">Illustration techniques to unlock…</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container className="innertext">
                                        <Grid item lg={2} md={2} sm={4} xs={6}>
                                        <Typography variant="h6" gutterBottom component="div">Date</Typography>
                                        </Grid>
                                        <Grid item lg={10} md={10} sm={8} xs={6}>
                                        <Typography variant="h6" gutterBottom component="div">June 8, 2020</Typography>
                                        </Grid>
                                    </Grid>
                                    <Grid container className="innertext">
                                        <Grid item lg={2} md={2} sm={4} xs={6}>
                                        <Typography variant="h6" gutterBottom component="div">Time</Typography>
                                        </Grid>
                                        <Grid item lg={10} md={10} sm={8} xs={6}>
                                        <Typography variant="h6" gutterBottom component="div">2 pm (1 hour session)</Typography>
                                        </Grid>
                                    </Grid>
                                </Box>
                            </Box>
                         </Grid>
                    </Grid>
                </Box>
            </Container>
           </Box>
              
        </Box>
    )
}

export default Dashboard
