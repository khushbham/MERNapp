import React, { useState } from "react";
import Typography from "@mui/material/Typography";
import TextField from "@mui/material/TextField";
import Grid from "@mui/material/Grid";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { styled } from "@mui/material/styles";
import { Button } from "@mui/material";
import InputAdornment from "@mui/material/InputAdornment";
import IconButton from "@mui/material/IconButton";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiEdit } from "react-icons/fi";
import Box from "@mui/material/Box";
import FormLabel from "@mui/material/FormLabel";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormHelperText from "@mui/material/FormHelperText";
import Checkbox from "@mui/material/Checkbox";

const NewStudentProfile = () => {
  const [state, setState] = React.useState({
    programming: true,
    business: false,
    design: false,
    science: false,
    languages: false,
    mindfulness: false,
  });
  const handleChange = (event) => {
    setState({
      ...state,
      [event.target.name]: event.target.checked,
    });
  };
  const { programming, business, design, science, languages, mindfulness } =
    state;
  // const error = [programming, business, design, science].filter((v) => v).length !== 2;

  return (
    <Grid container spacing={2} className="topics-section-area">
      <Grid item xs={12} md={12} lg={12} xl={12}>
        <Box>
          <InputLabel shrink htmlFor="tell" className="tell-area">
            Topics
          </InputLabel>
          <FormHelperText className="mt-2 mb-2">
            Tell us about your interests so we can make better recomendations!{" "}
          </FormHelperText>
          <Grid container spacing={2}>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={programming}
                        onChange={handleChange}
                        name="programming"
                      />
                    }
                    label="Programming"
                  />
                </FormGroup>
              </FormControl>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={business}
                        onChange={handleChange}
                        name="business"
                      />
                    }
                    label="Business"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={design}
                        onChange={handleChange}
                        name="design"
                      />
                    }
                    label="Design"
                  />
                </FormGroup>
              </FormControl>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={science}
                        onChange={handleChange}
                        name="science"
                      />
                    }
                    label="Science"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
            <Grid item xs={12} md={4} lg={4} xl={4}>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={languages}
                        onChange={handleChange}
                        name="languages"
                      />
                    }
                    label="Languages"
                  />
                </FormGroup>
              </FormControl>
              <FormControl component="fieldset" variant="standard">
                <FormGroup>
                  <FormControlLabel
                    control={
                      <Checkbox
                        checked={mindfulness}
                        onChange={handleChange}
                        name="mindfulness"
                      />
                    }
                    label="Mindfulness"
                  />
                </FormGroup>
              </FormControl>
            </Grid>
          </Grid>
        </Box>
      </Grid>
    </Grid>
  );
};

export default NewStudentProfile;
