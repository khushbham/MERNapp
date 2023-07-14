import React from 'react'
import Typography from '@mui/material/Typography';
import '../../../../css/admin/student.css'
import Button from '@mui/material/Button';
import Box from '@mui/material/Box';
import { Link } from 'react-router-dom';
import { AiOutlineUnorderedList } from "react-icons/ai";
import Grid from '@mui/material/Grid';
import { styled, alpha } from '@mui/material/styles';
import { Select } from '@mui/material';
import InputBase from '@mui/material/InputBase';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { FiSearch } from "react-icons/fi";
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
  marginTop: '18px',
  [theme.breakpoints.up('sm')]: {
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
    transition: theme.transitions.create('width'),
    width: '100%',
    [theme.breakpoints.up('md')]: {
      width: '100%',
    },
  },
}));

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        textAlign: 'center',
        fontSize: '1rem',
        fontWeight: '700',
        ...sx,
      }}
      {...other}
    />
  );
}


const SessionCalender = () => {
  const [SessionStatus, Session] = React.useState('10');
  const [SessionType, Date] = React.useState('10');
  const [PaymentStatus, pVal] = React.useState('10');
  const [PayoutStatus, poutVal] = React.useState('10');
  const statusVal = (event) => {
    Session(event.target.value);
  };
  const statusType = (event) => {
    Date(event.target.value);
  };
  const payVal = (event) => {
    pVal(event.target.value);
  };
  const payoutVal = (event) => {
    poutVal(event.target.value);
  };

  return (
    // <div className="calSecc">
    <>
       <Grid container className="main-head-sessions p-3">
        <Grid item xs={12} md={8} xl={8} lg={8}>
          <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <Item>
              <Typography variant="h5">Sessions Calendar</Typography>
            </Item>
            <Item>

            <Link to="/sessions" className="buttontext">
              <span><AiOutlineUnorderedList /></span> Switch to list view
            </Link>
            </Item>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} xl={4} lg={4}>
          <Typography align="right" variant="body1">Session Management</Typography>
        </Grid>
      </Grid>

      <Grid container className="align-items-center px-3" spacing={2}>
        <Grid item xs={12} md={4} xl={4} lg={4} sm={12}>
          <FormControl variant="standard" className="w-100">
            <InputLabel shrink htmlFor="search">
              Search
            </InputLabel>
            <Search>
              <StyledInputBase
                className="w-100"
                placeholder="By user or class name"
                inputProps={{ 'aria-label': 'search' }}
              />
              <SearchIconWrapper>
                <FiSearch />
              </SearchIconWrapper>
            </Search>
          </FormControl>

        </Grid>
        <Grid item xs={12} md={2} xl={2} lg={2} sm={12} className="text-end" spacing={2}>
          <FormControl variant="standard" className="class-type">
            <InputLabel shrink htmlFor="Filter by Session Status">Filter by Session Type</InputLabel>
            <Select
              value={SessionType}
              defaultValue={10}
              label="Filter by Session Status"
              onChange={statusType}
              displayEmpty
              className="filter-list"
              inputProps={{ 'aria-label': 'Without label' }}
              style={{ marginTop: '16px', textAlign: 'left' }}
            >
              <MenuItem value={10}>All Types</MenuItem>
              <MenuItem value={20}>On demand</MenuItem>
              <MenuItem value={30}>Single class</MenuItem>
              <MenuItem value={40}>Course Class</MenuItem>
            </Select>
          </FormControl>

        </Grid>
        <Grid item xs={12} md={2} xl={2} lg={2} sm={12}>
          <FormControl variant="standard" className="class-type">
            <InputLabel shrink htmlFor="Filter by Session Status">Filter by Session Status</InputLabel>
            <Select
              value={SessionStatus}
              defaultValue={10}
              label="Filter by Session Status"
              onChange={statusVal}
              displayEmpty
              className="filter-list"
              inputProps={{ 'aria-label': 'Without label' }}
              style={{ marginTop: '16px', textAlign: 'left' }}
            >
              <MenuItem value={10}>All Statuses</MenuItem>
              <MenuItem value={20}>Scheduled</MenuItem>
              <MenuItem value={30}>Cancelled</MenuItem>
              <MenuItem value={40}>Past</MenuItem>
              <MenuItem value={50}>In Progress</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2} xl={2} lg={2} sm={12}>
          <FormControl variant="standard" className="class-type">
            <InputLabel shrink htmlFor="Filter by Session Status">Filter by Session Payment Status</InputLabel>
            <Select
              value={PaymentStatus}
              defaultValue={10}
              label="Filter by Session Status"
              onChange={payVal}
              displayEmpty
              className="filter-list"
              inputProps={{ 'aria-label': 'Without label' }}
              style={{ marginTop: '16px', textAlign: 'left' }}
            >
              <MenuItem value={10}>All Statuses</MenuItem>
              <MenuItem value={20}>Pending</MenuItem>
              <MenuItem value={30}>Processed</MenuItem>
              <MenuItem value={40}>Refunded</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2} xl={2} lg={2} sm={12}>
          <FormControl variant="standard" className="class-type">
            <InputLabel shrink htmlFor="Filter by Session Status">Filter by Session Payout Status</InputLabel>
            <Select
              value={PayoutStatus}
              defaultValue={10}
              label="Filter by Session Status"
              onChange={payoutVal}
              displayEmpty
              className="filter-list"
              inputProps={{ 'aria-label': 'Without label' }}
              style={{ marginTop: '16px', textAlign: 'left' }}
            >
              <MenuItem value={10}>All Statuses</MenuItem>
              <MenuItem value={20}>Pending</MenuItem>
              <MenuItem value={30}>Processed</MenuItem>
              <MenuItem value={40}>Refunded</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
      </>
    // </div>
  )
}

export default SessionCalender
