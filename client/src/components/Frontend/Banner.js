import React from 'react'
import Grid from '@mui/material/Grid';
import Container from '@mui/material/Container';
import Box from '@mui/material/Box';
import '../../css/Frontend/style.css';
import Typography from '@mui/material/Typography';
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import {FiSearch} from "react-icons/fi";
import { styled, alpha } from '@mui/material/styles';

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
    marginTop:'16px',
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
      padding: theme.spacing(1, 1, 1, 5),
      transition: theme.transitions.create('width'),
      width: '100%',
      borderRadius:'24px',
      [theme.breakpoints.up('md')]: {
        width: '100%',
      },
    },
  }));
  
const Banner = () => {
    return (
           <div className="bannerWrap">
             <Box>
                <Container>
                    <Grid container className="align-items-center">
                        <Grid item xs={12} lg={6}>
                        <Typography variant="h2" component="h2" gutterBottom> Find your next teacher today</Typography>
                           <Grid item xs={12} md={12} lg={6}>
                           <FormControl variant="standard" className="w-100" >
                                <Search className="SearchField"> 
                                    <StyledInputBase 
                                    className="w-100"
                                    placeholder="What would you like to learn?"
                                    />
                                    <SearchIconWrapper>
                                    <FiSearch />
                                    </SearchIconWrapper>
                                </Search>
                             </FormControl>
                           </Grid>
                           <Grid item xs={12} md={12} lg={6}>
                               <a href="/search" className="SearchBtn mt-3">Or try the advanced search</a>
                           </Grid>
                        </Grid>
                        <Grid item xs={12} lg={6} className="ms-auto banner--img">
                         <img width="100%" src="../images/landing-web.png" alt="BannerImg"/>
                        </Grid>
                    </Grid>
                </Container>
            </Box>
         </div>
    )
}

export default Banner
