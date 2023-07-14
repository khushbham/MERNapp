import React, { useEffect, useState } from "react";
import Typography from '@mui/material/Typography';
import AppBar from '@mui/material/AppBar';
import DrawerComponent from "./Drawer";
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import { useDispatch } from "react-redux";
import { unreadNotificationsCount } from "../../actions/frontent";
function Navbar() {
  return (
    <AppBar position="static">
       <div className="TopBar">
      </div>
       <div className="HeaderWrap">
        <Container>
            <Grid container>
              <Grid item xs={10}>
                <Typography variant="h4" className="logo">
                  mern
                </Typography>
              </Grid>
              <Grid item xs={2} className="text-end">
                  <DrawerComponent />
              </Grid>
            </Grid>
        </Container>
        </div>
    </AppBar>
  );
}
export default Navbar;
