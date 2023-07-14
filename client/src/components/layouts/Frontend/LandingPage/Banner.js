import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import "../../../../css/Frontend/style.css";
import Typography from "@mui/material/Typography";
import InputBase from "@mui/material/InputBase";
import FormControl from "@mui/material/FormControl";
import { FiSearch } from "react-icons/fi";
import { styled, alpha } from "@mui/material/styles";
import { studentAuth, TeacherAuth } from "../../../routing/Authentication";
import LandingNavbar from "./LandingNavbar";
import TextField from "@mui/material/TextField";
import Autocomplete from "@mui/material/Autocomplete";
import { useDispatch } from "react-redux";
import { getTopicsAndDiscipline } from "../../../../actions/frontent";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const Banner = () => {
  const ifUserNotlogin = ["please sign in"];
  const [topTags , setTopTags] = useState([])
  const [seachVal , setSearchVal] = useState("")
  const dispatch = useDispatch()
  const history = useHistory()

  useEffect(() => {
    dispatch(getTopicsAndDiscipline()).then((res)=>{
      if(res.success){
        // console.log("comeing tags" , res.data)
        setTopTags(res.data)
      }else{
        console.log("err" , res)
      }
  }).catch((err)=>{
      console.log(err)
  })
  }, [])
  //search data from url 
  function searchData(){
    // http://localhost:3000/search
    
    if(seachVal != "" && studentAuth()){
      history.push({pathname:"/search", search:`e=${seachVal}`})
    }else if(!studentAuth()){
      history.push("/students/sign-up")
    }
  }

  return (
    <div>
      <LandingNavbar />
      <Box>
        <Container>
          <Grid container className="align-items-center">
            <Grid item xs={12} lg={6}>
              <Typography variant="h2" component="h2" gutterBottom>
                {TeacherAuth()
                  ? "Welcome Teacher"
                  : "Find your next teacher today"}
              </Typography>
              {!TeacherAuth() && (
                <Grid item xs={12} md={12} lg={6}>
                  <Autocomplete
                    freeSolo
                    id="free-solo-2-demo"
                    disableClearable
                    className="home_search_box"
                    options={topTags}

                    onInputChange={(event, newInputValue) => {
                      // console.log("working change input fields" , newInputValue)
                      setSearchVal(newInputValue)
                    }}
                    renderInput={(params) => (
                      <TextField
                      {...params}
                      variant="outlined"
                      placeholder="What would you like to learn?"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <>
                              <button className="srch_home_bttn" onClick={searchData}><FiSearch className="srch_btn_icn"/>
                              </button>
                              {params.InputProps.startAdornment}
                            </>
                          ),
                        }}
                      />
                    )}
                  />
                </Grid>
              )}
              <Grid item xs={12} md={12} lg={6}>
                {!studentAuth() ? (
                  TeacherAuth() ? (
                    <></>
                  ) : (
                    <a href="/students/sign-up" className="SearchBtn mt-3">
                      Or try the advanced search
                    </a>
                  )
                ) : (
                  <a href="/search" className="SearchBtn mt-3">
                    Or try the advanced search
                  </a>
                )}
              </Grid>
            </Grid>
            <Grid item xs={12} lg={6} className="ms-auto banner--img">
              <img
                width="100%"
                src="../images/landing-web.png"
                alt="BannerImg"
              />
            </Grid>
          </Grid>
        </Container>
      </Box>
    </div>
  );
};

export default Banner;
