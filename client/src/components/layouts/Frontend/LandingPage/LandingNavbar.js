import React from "react";
import AppBar from "@mui/material/AppBar";
import { Link } from "react-router-dom";
import Container from "@mui/material/Container";
import Box from '@mui/material/Box';
import Grid from "@mui/material/Grid";
const SideMenu = {
   backgroundColor:'#82005e !important',
}
function LandingNavbar() {
  return (
    <AppBar position="static">
      <div className="TopBar"></div>
      <div className="HeaderWrap">
        <Container>
          <Grid container>
            <Grid item xs={10}>
              <Link to="/">
                <img src="../images/logo-white.png"></img>
              </Link>
            </Grid>
            {/* <Grid item xs={2} className="text-end">
                <Box className="sidbarrMenu"> 
                <DrawerComponent sx={SideMenu}/>
                </Box>           
            </Grid> */}
          </Grid>
        </Container>
      </div>
    </AppBar>
  );
}
export default LandingNavbar;
