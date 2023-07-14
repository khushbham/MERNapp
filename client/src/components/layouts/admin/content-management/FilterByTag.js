import React from 'react';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import { FiSearch } from "react-icons/fi";
import { FormControl } from "@mui/material";
import Grid from '@mui/material/Grid';
import Box from '@mui/material/Box';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

const Search = styled('div')(({ theme }) => ({
  position: 'relative',
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  '&:hover': {
    backgroundColor: alpha(theme.palette.common.white, 0.80),
  },
  marginTop: 20,
  height: 36,
  marginLeft: 0,
  width: '100%',
  border: 1,
  borderStyle: 'solid',
  borderColor: '#ced4da',
  [theme.breakpoints.up('sm')]: {
    // marginLeft: theme.spacing(3),
    width: '100%',
  },
}));

const SearchIconWrapper = styled('div')(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: '100%',
  position: 'absolute',
  top: '0',
  right: '0',
  pointerEvents: 'none',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: 'inherit',
  '& .MuiInputBase-input': {
    padding: theme.spacing(1, 5, 1, 1),
    // vertical padding + font size from searchIcon
    // paddingRight: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
}));

function FilterByTag() {
const [filtertag, setFilterTag] = React.useState('10');
const FilterTagChange = (event) => {
    setFilterTag(event.target.value);
};

const [filtercontentstatus, setFilterContentStatus] = React.useState('10');
const FilterContentStatusChange = (event) => {
    setFilterContentStatus(event.target.value);
};

return (

    <Box sx={{
      display: 'flex',
      backgroundColor: 'rgb(106 113 135 / 10%)'
    }}>
      <Grid container className="p-3 top-btm" spacing={2}>
        <Grid item xs={12} md={5} lg={5} xl={5} className="srch-page-fld">
          <FormControl variant="standard" className="page-search-field">
            <InputLabel shrink htmlFor="search">
              Search
            </InputLabel>
            <Search>
              <StyledInputBase
                placeholder="By tag"
                inputProps={{ 'aria-label': 'search' }}
              />
              <SearchIconWrapper className="srch-fltr">
                <FiSearch />
              </SearchIconWrapper>
            </Search>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3} lg={3} xl={3} className="filter-page-slct">
          <FormControl>
            <InputLabel variant="standard" htmlFor="filter-by-page">
              Label :
            </InputLabel>
            <Select
              value={filtertag}
              defaultValue={10}
              onChange={FilterTagChange}
              displayEmpty
              className="filtertype-pagestatus"
            >
              <MenuItem value={10}>All</MenuItem>
              <MenuItem value={20}>Published</MenuItem>
              <MenuItem value={30}>Draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={3} lg={3} xl={3} className="filter-page-slct">
          <FormControl>
            <InputLabel variant="standard" htmlFor="filter-by-page">
              Filter by Content Status
            </InputLabel>
            <Select
              value={filtercontentstatus}
              defaultValue={10}
              onChange={FilterContentStatusChange}
              displayEmpty
              className="filtertype-pagestatus"
            >
              <MenuItem value={10}>All Statuses</MenuItem>
              <MenuItem value={20}>Published</MenuItem>
              <MenuItem value={30}>Draft</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}

export default FilterByTag;