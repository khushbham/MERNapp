import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputAdornment from '@mui/material/InputAdornment';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';
import { styled } from '@mui/material/styles';
import { FaMobileAlt } from 'react-icons/fa';
import IconButton from '@mui/material/IconButton';
import { FaEye, FaEyeSlash } from "react-icons/fa";
import OutlinedInput from '@mui/material/OutlinedInput';


const NewTeacherBasicInfo = () => {
  const [genderstatus, setGenderStatus] = React.useState('0');
  const handleGender = (event) => {
    setGenderStatus(event.target.value);
  };
  return (
    <Grid container spacing={2} className="create-basic-section">
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="full-name">
            Full Name
          </InputLabel>
          <TextField sx={{ mb: 1 }}
            required
            fullWidth
            name="full-name"
            id="full-name"
            variant="standard"
            placeholder="Dana"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="last-name">
            Last Name
          </InputLabel>
          <TextField sx={{ mb: 1 }}
            required
            fullWidth
            name="last-name"
            id="last-name"
            variant="standard"
            placeholder="Smith"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <FormControl className="slct-gender">
          <InputLabel shrink htmlFor="gender">
            Gender
          </InputLabel>
          <Select className="gender-selection"
            value={genderstatus}
            onChange={handleGender}
            displayEmpty
            color="primary"
            inputProps={{ 'aria-label': 'Without label' }}
          >
            <MenuItem value={0}>Female</MenuItem>
            <MenuItem value={1}>Male</MenuItem>
            <MenuItem value={2}>Other</MenuItem>
          </Select>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="bootstrap-input">
            Birth Date
          </InputLabel>
          <TextField
            fullWidth
            id="date"
            type="date"
            variant="standard"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="address">
            Street Address
          </InputLabel>
          <TextField sx={{ mb: 1 }}
            required
            fullWidth
            placeholder="Enter street address"
            name="street address"
            id="street-address"
            variant="standard"
          />

        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="city">
            City
          </InputLabel>
          <TextField sx={{ mb: 1 }}
            required
            fullWidth
            placeholder="Enter City"
            name="city"
            id="city"
            variant="standard"
          />

        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="state">
            State
          </InputLabel>
          <TextField sx={{ mb: 1 }}
            required
            fullWidth
            placeholder="Enter State"
            name="state"
            id="state"
            variant="standard"
          />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={6} lg={4} xl={4}>
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="zip-code">
            Zip code
          </InputLabel>
          <TextField sx={{ mb: 1 }}
            required
            fullWidth
            placeholder="Enter zip code"
            name="zip code"
            id="zip-code"
            variant="standard"
          />
        </FormControl>
      </Grid>
    </Grid>
  );

}

export default NewTeacherBasicInfo;
