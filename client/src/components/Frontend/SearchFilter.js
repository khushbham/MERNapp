import React from 'react'
import '../../css/Frontend/style.css'
import Container from '@mui/material/Container';
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import Link from '@mui/material/Link';
import {IoIosCloseCircleOutline} from "react-icons/io";
import {FiSearch} from "react-icons/fi";
import { GoSettings } from "react-icons/go";
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
      [theme.breakpoints.up('md')]: {
        width: '100%',
      },
    },
  }));
  
const SearchFilter = () => {
    return (
        <div className="SearchFilter">
           <Container>
               <FormControl variant="standard" className="w-100" >
                    <Search className="Search--Filter"> 
                        <StyledInputBase 
                        className="w-100"
                        placeholder="Search"
                        />
                        <SearchIconWrapper>
                        <FiSearch />
                        </SearchIconWrapper>
                        <div className="SearchSettings">
                            <GoSettings />
                        </div>
                    </Search>
                    <div className="SearchResults d-flex mt-4">
                        <Link href="#" className="ResultsLink me-2">Urban Dance <IoIosCloseCircleOutline/></Link>
                        <Link href="#" className="ResultsLink me-2">Riverside, CA  <IoIosCloseCircleOutline/></Link>
                    </div>
                </FormControl>
           </Container>
        </div>
    )
}
export default SearchFilter
