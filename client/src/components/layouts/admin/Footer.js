import React from 'react';
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';

export const Footer = () => {
  return (
    <footer className="sticky-footer admin-footer">
      <Grid container className="p-3">
        <Grid item xs={12} md={12} lg={6} xl={6}>
          <Typography variant="body1" color="secondary">2021 © mern Platform</Typography>
        </Grid>
        <Grid item xs={12} md={12} lg={6} xl={6}>
          <Typography align="right" variant="body1" color="secondary" className="orange-txt">Web App by <span>app</span></Typography>
        </Grid>
      </Grid>
    </footer>
  );
}
export default Footer