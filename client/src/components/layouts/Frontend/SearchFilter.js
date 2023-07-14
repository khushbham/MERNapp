import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import RadioGroup from "@mui/material/RadioGroup";
import FormControl from "@mui/material/FormControl";
import { Link } from "react-router-dom";
import Slider from "@mui/material/Slider";
import { useDispatch } from "react-redux";
import { Button } from "@mui/material";
import CircularProgress from "@mui/material/CircularProgress";
const ratingText = {
  color: "rgba(33, 33, 33, 0.7) !important",
  fontSize: "14px",
  fontWeight: "500 !important",
  padding: "0px",
};
function valuetext(value) {
  return `${value}°C`;
}
const SearchFilter = (props) => {
  const {
    setsession_type,
    session_type,
    setprivate_or_group,
    private_or_group,
    setclass_level,
    class_level,
    setValue,
    value,
    search,
    setminimum_price,
    setmaximum_price,
    filterClose,
  } = props;
  const dispatch = useDispatch();
  const [sessionType, setsessionType] = useState([
    "",
    "Local",
    "Online (Anywhere)",
  ]);
  const [classes, setclasses] = useState(["", "Private", "Group"]);
  const [skill_level, setskill_level] = useState([
    "All",
    "Basic",
    "Intermediate",
    "Advanced",
  ]);
  const [showLoader, setShowLoader] = useState(false);

  const handleChange = (event, newValue) => {
    setValue(newValue);
    setminimum_price(
      newValue.filter((arr, idx) => {
        return idx == 0;
      })[0]
    );
    setmaximum_price(
      newValue.filter((arr, idx) => {
        return idx == 1;
      })[0]
    );
  };
  const clearFilters = () => {
    setShowLoader(true);
    setsession_type(0);
    setprivate_or_group("");
    setclass_level(0);
    //filterClose();
    setTimeout(() => {
      setShowLoader(false);
    }, 400);
  };
  return (
    <Box>
      <Grid container>
        {!showLoader ? (
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            className="m-auto  mb-4 StepsContentWrapper SearchFilterWrap"
          >
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="mt-2 mb-3"
            >
              Filter your search{" "}
              <button className="clear_filter" onClick={() => clearFilters()}>
                Clear Filter
              </button>
            </Typography>
            <Box className="searchFilter">
              <Typography className="FilerHeadingg">
                Local or online?
              </Typography>

              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group"
                  className="filter_radio_labels"
                >
                  {" "}
                  {sessionType.map(
                    (arr, idx) =>
                      arr != "" && (
                        <label for={arr} className="filterLabel">
                          <input
                            type="radio"
                            id={arr}
                            name="radio-group1"
                            className="filterData"
                            value={idx}
                            defaultChecked={session_type == idx}
                            onChange={(e) => setsession_type(e.target.value)}
                          />
                          <Box className="filterText">{arr}</Box>
                        </label>
                      )
                  )}
                </RadioGroup>
              </FormControl>
            </Box>

            <Box className="searchFilter">
              <Typography className="FilerHeadingg">Classes</Typography>
              <FormControl>
                <RadioGroup
                  row
                  className="filter_radio_labels"
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group1"
                >
                  {classes.map(
                    (arr, idx) =>
                      arr != "" && (
                        <label for={arr} className="filterLabel">
                          <input
                            type="radio"
                            id={arr}
                            name="radio-group2"
                            className="filterData"
                            value={idx}
                            defaultChecked={private_or_group == idx}
                            onChange={(e) =>
                              setprivate_or_group(e.target.value)
                            }
                          />
                          <Box className="filterText">{arr}</Box>
                        </label>
                      )
                  )}
                </RadioGroup>
              </FormControl>
            </Box>
            <Box className="searchFilter">
              <Typography className="FilerHeadingg">Skill Level</Typography>
              <FormControl>
                <RadioGroup
                  row
                  aria-labelledby="demo-row-radio-buttons-group-label"
                  name="row-radio-buttons-group2"
                >
                  {skill_level.map((arr, idx) => {
                    return (
                      <label for={arr} className="filterLabel">
                        <input
                          type="radio"
                          id={arr}
                          name="radio-group3"
                          className="filterData"
                          value={idx}
                          defaultChecked={class_level == idx}
                          onChange={(e) => setclass_level(e.target.value)}
                        />
                        <Box className="filterText">{arr}</Box>
                      </label>
                    );
                  })}
                </RadioGroup>
              </FormControl>
            </Box>
            <Box className="searchFilter">
              <Typography className="FilerHeadingg">Price Range</Typography>
              <Slider
                // getAriaLabel={() => "Temperature range"}
                defaultValue={value}
                onChange={handleChange}
                valueLabelDisplay="auto"
                getAriaValueText={valuetext}
                min={0}
                max={1000}
              />
            </Box>
            {/* <Box className="searchFilter">
            <Typography className="FilerHeadingg">Minimum Rating</Typography>
            <Box className="d-flex align-items-center pb-2">
              <Rating
                name="size-large"
                defaultValue={2}
                size="large"
                onChange={(event, newValue) => {
                  setValue(newValue);
                }}
              />
              <Typography className="FilerHeadingg" sx={ratingText}>
                4 Star
              </Typography>
            </Box>
          </Box> */}
            <Grid container>
              <Grid item lg={12} md={12} sm={12} xs={12}>
                <Button className="sessionBtn" onClick={search}>
                  Show Results
                </Button>
              </Grid>
            </Grid>
          </Grid>
        ) : (
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            className="m-auto  mb-4 StepsContentWrapper SearchFilterWrap loader_svg_on_clear_filter"
          >
            <CircularProgress color="inherit" />
          </Grid>
        )}
      </Grid>
    </Box>
  );
};

export default SearchFilter;
