import React from "react";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import { useEffect } from "react";
import { Button, Checkbox, List, ListItem } from "@mui/material";
import { Link, useHistory } from "react-router-dom";
import { useDispatch } from "react-redux";
import {
  getDropdownValues,
  updateBasicProfileInfo2,
} from "../../../../../actions/frontent";

const AccountSteps2 = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const [topics, settopics] = React.useState([]);
  const [selectfeilds, setselectfeilds] = React.useState([]);

  const handleChange = (event) => {
    var updatedList = [...topics];
    if (event.target.checked) {
      updatedList = [...topics, event.target.value];
    } else {
      updatedList.splice(topics.indexOf(event.target.value), 1);
    }
    settopics(updatedList);
  };

  useEffect(() => {
    dispatch(getDropdownValues()).then((res) => {
      setselectfeilds(
        res.data.filter((a) => {
          if (a.name == "topics") {
            return a;
          }
        })[0].options
      );
    });
  }, []);

  const onSubmit = () => {
    const formdata = {
      topics: topics,
    };
    dispatch(updateBasicProfileInfo2(formdata)).then((res) => {
      console.log(res.data, "data");
      history.push("/student/dashboard");
    });
  };
  return (
    <Box>
      <Box className="classesWrap">
        <Container>
          <Grid container>
            <Grid
              item
              lg={6}
              md={7}
              sm={12}
              className="m-auto StepsContentWrapper"
            >
              <Box className="mb-1">
                <Typography
                  variant="h3"
                  gutterBottom
                  component="div"
                  className="mb-0"
                >
                  {" "}
                  Create your student profile
                </Typography>
              </Box>
              <Box className="accountHeading">
                <Typography
                  variant="subtitle1"
                  gutterBottom
                  component="div"
                  className="AccountSubtitle"
                >
                  Tell us about your interests so we can make better
                  recomendations!{" "}
                </Typography>
                <Link to="/StudentProfileConfirmation" className="Skip-profile">
                  Skip
                </Link>
                <ul className="multiSlectors">
                  {
                    <List
                      row
                      sx={{
                        "--List-gap": "0px",
                        "--List-item-radius": "20px",
                        flexWrap: "wrap",
                        gap: 1,
                      }}
                    >
                      {selectfeilds?.map((item, index) => (
                        <ListItem key={index} className="account">
                          <Checkbox
                            overlay
                            value={index}
                            disableIcon
                            variant="soft"
                            InputLabel={item}
                            onChange={(e) => handleChange(e)}
                          />
                          {item}
                        </ListItem>
                      ))}
                    </List>
                  }
                </ul>
                <Box ClassName="text-end btnn--outerr">
                  <Button
                    variant="contained"
                    onClick={() => onSubmit()}
                    className="saveBtn"
                  >
                    Save
                  </Button>
                </Box>
              </Box>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default AccountSteps2;
