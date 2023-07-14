import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import StudentNavbar from "../StudentNavbar";
import { Link, useHistory, useLocation } from "react-router-dom";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import List from "@mui/material/List";
import Divider from "@mui/material/Divider";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import { BiBarChartSquare } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { BsGlobe } from "react-icons/bs";
import AvatarGroup from "@mui/material/AvatarGroup";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import moment from 'moment'
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import { useDispatch } from "react-redux";
import {
  getAvailabilityForStudent,
  getClassDetailForStudent,
  getDropdownValues,
} from "../../../../../actions/frontent";
import { Button } from "@mui/material";

const BookClassDetail = () => {
  const [classSchedule, setVal] = React.useState("");
  const [class_level, setclass_level] = React.useState([]);
  const [TeacherDetails, setTeacherDetails] = React.useState();
  const [timeavailability, settimeavailability] = React.useState([]);
  const dispatch = useDispatch();
  const history = useHistory();
  const handleChange = (event) => {
    setVal(event.target.value);
  };
  const queryParams = new URLSearchParams(window.location.search);
  //  const TeacherDetails = location.state.Details
  const Teacher_Id = queryParams.get("Teacher_Id");
  const Class_Id = queryParams.get("Class_Id");
  const date = queryParams.get("selectedDay");
  const interval = queryParams.get("interval");
 
  var dateObj = new Date(date);
  var month = dateObj.getUTCMonth() + 1; 
  var year = dateObj.getUTCFullYear();

  const startDate = `${date}?month=${month}&year=${year}&interval=${interval}`;
 
  useEffect(() => {
    dispatch(getDropdownValues()).then((res) => {
      setclass_level(
        res.data.filter((a) => {
          if (a.name == "class_level") {
            return a;
          }
        })[0].options
      );
    });
    dispatch(getAvailabilityForStudent(Teacher_Id, startDate))
      .then((res) => {
        settimeavailability(res.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dispatch(getClassDetailForStudent(Teacher_Id, Class_Id))
      .then((res) => {
        setTeacherDetails(res.data);
      })
      .catch((err) => console.log(err));
  }, []);
  const proceedPayments = () => {
    if (classSchedule) {
      history.push({
        pathname: "/students/class-payments",
        search: `amount=${
          TeacherDetails.classData.price
        }&Class_Id=${Class_Id}&class_date=${moment(date).format("MM-DD-YYYY")}&start_time_of_class=${classSchedule
          .split(" ")
          .slice(0, 2)
          .join(" ")}&class_end_time=${classSchedule
          .split(" ")
          .slice(-2)
          .join(" ")}&on_demand_class=${true}`,
      });
    }
  };
  console.log(TeacherDetails,"TeacherDetails")
  return (
    <Box>
      <StudentNavbar />
      <Container>
        <Grid container>
          <Grid
            item
            lg={12}
            md={12}
            sm={12}
            className="m-auto mt-4 StepsContentWrapper"
          >
            <Box className="contentSec">
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="classes mt-4"
              >
                {TeacherDetails?.classData?.discipline}
              </Typography>
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="classesHeading mb-3"
              >
                {TeacherDetails?.classData?.class_subtitle}
              </Typography>
              <Box className="Teacher-Profile d-flex align-items-center">
                <Avatar
                  alt="teacher Profile"
                  src={TeacherDetails?.teacherProfile?.profile_image}
                  className="me-2"
                />
                <Typography
                  variant="body1"
                  gutterBottom
                  className="descSubHead"
                >
                  {" "}
                  By {TeacherDetails?.teacherProfile?.first_name}{" "}
                  {TeacherDetails?.teacherProfile?.last_name}{" "}
                </Typography>
              </Box>
              <Box>
                <nav aria-label="main mailbox folders" className="infolist">
                  <List>
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon
                          className="listIcons"
                          style={{ minWidth: "33px" }}
                        >
                          <BiBarChartSquare />
                        </ListItemIcon>
                        <ListItemText
                          primary={class_level?.filter((a, idx) => {
                            if (idx == TeacherDetails?.classData?.class_level) {
                              return a;
                            }
                          })}
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon
                          className="listIcons"
                          style={{ minWidth: "33px" }}
                        >
                          <BsGlobe />
                        </ListItemIcon>
                        <ListItemText
                          primary={TeacherDetails?.classData?.language_of_class}
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon
                          className="listIcons"
                          style={{ minWidth: "33px" }}
                        >
                          <RiGroupLine />
                        </ListItemIcon>
                        <ListItemText
                          primary={`This is ${TeacherDetails?.classData?.max_students_allowed == 1?" an individual":" a Group"} class`}
                        />
                      </ListItemButton>
                    </ListItem>
                  </List>
                </nav>
              </Box>
              <Grid item lg={4} md={4} sm={12} xs={12}>
                <FormControl className="selectDropdown w-100 my-4">
                  <InputLabel
                    shrink
                    htmlFor="student-name"
                    className="studentNameLabel"
                  >
                    <b>Select a class schedule</b>
                  </InputLabel>
                  <Select
                    sx={{ mb: 1 }}
                    value={classSchedule}
                    onChange={handleChange}
                    displayEmpty
                    className="StepsFields"
                    placeholder="Select Class Schedule"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    {console.log(timeavailability)}
                    {timeavailability?.map((arr) => {
                      return (
                        <MenuItem value={arr} className="d-block p-2">
                          {arr}
                        </MenuItem>
                      );
                    })}

                    {/* <MenuItem value={10} className="d-block p-2">
                      8:00 am to 9:30 am
                    </MenuItem>
                    <MenuItem value={20} className="d-block p-2">
                      8:00 am to 9:30 am
                    </MenuItem> */}
                  </Select>
                </FormControl>
              </Grid>
              <Box className="paymentSettings">
                <Typography
                  variant="h5"
                  gutterBottom
                  component="div"
                  className="PayHead"
                >
                  {" "}
                  Your total payment will be:{" "}
                </Typography>
                <Typography variant="h3" gutterBottom component="div">
                  Total: ${TeacherDetails?.classData?.price}
                </Typography>
              </Box>
            </Box>
            <Grid lg={4} md={5} sm={12} xs={12} className="mt-4">
              <Button className="proceed_sessionBtn sessionBtnn" onClick={proceedPayments}>
                proceed to payment
              </Button>
            </Grid>
          </Grid>
        </Grid>
      </Container>
    </Box>
  );
};

export default BookClassDetail;
