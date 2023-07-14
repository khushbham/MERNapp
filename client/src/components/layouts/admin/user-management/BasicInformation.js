import * as React from 'react';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { Select } from '@mui/material';
import MenuItem from '@mui/material/MenuItem';

export default function BasicInformation() {
  const [userstatus, setUserstatus] = React.useState('10');
  const [usertype, setUserType] = React.useState('10');
  const statChange = (event) => {
    setUserstatus(event.target.value);
  };
  const userTypeChange = (event) => {
    setUserType(event.target.value);
  };
  return (
    <Box className="mt-3 ext-spc">
      <Grid container spacing={2}>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={6}>
          <FormControl>
            <InputLabel variant="standard" htmlFor="user-status">
              User Status
            </InputLabel>
            <Select
              value={userstatus}
              defaultValue={10}
              onChange={statChange}
              displayEmpty
              className="usertype-status"
            >
              <MenuItem value={10}>Active</MenuItem>
              <MenuItem value={20}>Pending</MenuItem>
              <MenuItem value={30}>Suspended</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} sm={12} md={4} lg={4} xl={6}>
          <FormControl>
            <InputLabel variant="standard" htmlFor="user-type">
              User Type
            </InputLabel>
            <Select
              value={usertype}
              defaultValue={10}
              onChange={userTypeChange}
              displayEmpty
              className="usertype-list"
            >
              <MenuItem value={10}>Teacher</MenuItem>
              <MenuItem value={20}>Student</MenuItem>
            </Select>
          </FormControl>
        </Grid>
      </Grid>
    </Box>
  );
}
