import React, {useState} from 'react'
import '../../../../css/admin/student.css';
import Button from '@mui/material/Button';
import Grid from '@mui/material/Grid';
import { styled, alpha } from '@mui/material/styles';
import InputBase from '@mui/material/InputBase';
import FormControl from '@mui/material/FormControl';
import { FiSearch } from "react-icons/fi";
import InputLabel from '@mui/material/InputLabel';
import DatePicker from "react-date-picker";

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
  marginTop: '16px',
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

const PaymentsFilter = () => {
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const convert = (str) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  };
  return (
    <div className="PaymentFilter p-2">
      <Grid container className="mb-3 text-right-filter">
        <Grid item xs={12} md={12} lg={12}>
         <Button variant="contained" className="ExportBtn">Export as .CSV</Button> 
        </Grid>
      </Grid>
      <Grid container className="align-items-end" spacing={2}>
        <Grid item xs={10} md={10} lg={10}>
          <Grid container>
            <Grid item xs={6} md={6} lg={6}>
              <FormControl variant="standard" className="w-100 pl-2 fieldsWrap" >
                <InputLabel shrink htmlFor="search">
                  Search
                </InputLabel>
                <Search>
                  <StyledInputBase
                    className="w-100 search--Field no-mrgn_top"
                    placeholder="By user, email or transacion ID"
                    inputProps={{ 'aria-label': 'search' }}
                  />
                  <SearchIconWrapper>
                    <FiSearch />
                  </SearchIconWrapper>
                </Search>
              </FormControl>
            </Grid>
            <Grid item xs={3} md={3} lg={3}>
              <FormControl variant="standard" className="w-100 date-filter">
                <InputLabel shrink htmlFor="Filter by Session Status">Filter by Start Date</InputLabel>
                <DatePicker
                                className="form-control date-pickr"
                                onChange={(e) => {
                                  setStartDate((e))
                                }}
                                value={startDate}
                              />
              </FormControl>

            </Grid>
            <Grid item xs={3} md={3} lg={3}>
              <FormControl variant="standard" className="w-100 date-filter">
                <InputLabel shrink htmlFor="Filter by Session Status">Filter by End Date</InputLabel>
                <DatePicker
                                className="form-control date-pickr"
                                onChange={(e) => {
                                  setEndDate((e))
                                }}
                                value={endDate}
                              />
              </FormControl>

            </Grid>
            {/* <Grid item xs={3} md={3} lg={3}>
              <FormControl variant="standard" className="class-type financial-filter-status">
                <InputLabel shrink htmlFor="Filter by Session Status">Filter by Session Status</InputLabel>
                <Select
                  value={SessionStatus}
                  defaultValue={20}
                  label="Filter by Session Status"
                  onChange={statusVal}
                  displayEmpty
                  className="filter-list me-2"
                  inputProps={{ 'aria-label': 'Without label' }}
                  style={{ marginTop: '16px' }}
                >
                  <MenuItem value={10}>All Statuses</MenuItem>
                  <MenuItem value={20}>Scheduled</MenuItem>
                  <MenuItem value={30}>Cancelled</MenuItem>
                  <MenuItem value={40}>Past</MenuItem>
                  <MenuItem value={50}>In Progress</MenuItem>
                </Select>
              </FormControl>
            </Grid> */}
          </Grid>
        </Grid>
        <Grid item xs={2} md={2} lg={2} className="text-enddd">
          <Button variant="contained" className="Search_fltr">Search</Button>
          {/* <Button variant="contained" className="ExportBtn me-3">Export as .PDF</Button> */}
          {/* <Button variant="contained" className="ExportBtn">Export as .CSV</Button> */}
        </Grid>
      </Grid>
    </div>
  )
}

export default PaymentsFilter
