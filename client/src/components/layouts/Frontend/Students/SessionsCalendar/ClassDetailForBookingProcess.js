import React, { useState, useEffect } from "react";
import {Container,Box} from "@mui/material";
import Typography from "@mui/material/Typography";
import Avatar from "@mui/material/Avatar";
import Link from "@mui/material/Link";
import Grid from "@mui/material/Grid";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
import Divider from "@mui/material/Divider";
import ClassTopics from "../../Teachers/ClassDetails/ClassTopics1";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { BiBarChartSquare } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { BsGlobe } from "react-icons/bs";
import { useDispatch } from "react-redux";
import {
  getClassDetailForStudent,
  getDropdownValues,
  ReportClass
} from "../../../../../actions/frontent";
import { useHistory } from "react-router-dom";
import StudentNavbar from "../StudentNavbar";
import moment from "moment";
import CircularProgress from "@mui/material/CircularProgress";
import GoogleMap from "../../GoogleMap";
import Modal from "@mui/material/Modal";
import IconButton from "@mui/material/IconButton";
import { useFormik } from "formik";
import * as yup from "yup";
import Menu from "@mui/material/Menu";
import MenuItem from "@mui/material/MenuItem";
import { BsThreeDotsVertical, BsFlag } from "react-icons/bs";
import Input from "@mui/material/Input";

const validationSchema = yup.object({
  report_title: yup.string().required(" First Name is required"),
  report_description: yup.string().required(" Last Name is required"),
});
const Classes = () => {
  const dispatch = useDispatch();
  const history = useHistory();
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    border: "2px solid #000",
    borderRadius: "30px",
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [classDetails, setclassDetails] = useState();
  const [class_level, setclass_level] = useState([]);
  const [session_type, setsession_type] = useState([]);
  const [session_duration, setsession_duration] = useState([]);
  const [classes, setclasses] = useState([]);
  const [apiHit, setApiHit] = useState(false);
  const queryParams = new URLSearchParams(window.location.search);
  const ClassID = queryParams.get("class_id");
  const teacher_id = queryParams.get("teacher_id");
  const [openModal, setOpenModal] = useState(false);
  const [anchorEl, setAnchorEl] = useState(null);
  const [sessionDurationInterval, setSessionDurationInterval] = useState(null);
  const open = Boolean(anchorEl);

  const tConvert = (time24) => {
    const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{1,2})/).slice(1);
    const period = +sHours < 12 ? "AM" : "PM";
    const hours = +sHours % 12 || 12;
    return `${hours}:${minutes} ${period}`; 
  };

  useEffect(() => {
    dispatch(getClassDetailForStudent(teacher_id, ClassID))
      .then((res) => {
        if(res && res.success){
          console.log(res.data);
          setclassDetails(res.data);
          setSessionDurationInterval(res?.data?.classData?.session_duration*60)
          setApiHit(true)
        }
        
      })
      .catch((err) => console.log(err));

    dispatch(getDropdownValues()).then((res) => {
      console.log(res, "response");
      setclass_level(
        res.data.filter((a) => {
          if (a.name == "class_level") {
            return a;
          }
        })[0].options
      );
      setsession_type(
        res.data.filter((a) => {
          if (a.name == "session_type") {
            return a;
          }
        })[0].options
      );
      setsession_duration(
        res.data.filter((a) => {
          if (a.name == "duration") {
            return a;
          }
        })[0].options
      );
      setclasses(
        res.data.filter((a) => {
          if (a.name == "classes") {
            return a;
          }
        })[0].options
      );
    });
  }, []);
  const bookClass = (id, price, type_of_class) => {
    if (type_of_class == 1) {
      history.push({
        pathname: "/students/book-class",
        search: `teacher_Id=${teacher_id}&Class_Id=${id}&interval=${sessionDurationInterval}`,
        state: {
          teacher_Id: teacher_id,
          Class_Id: id,
        },
      });
    } else {
      history.push({
        pathname: "/students/class-payments",
        search: `teacher_Id=${teacher_id}&Class_Id=${id}&amount=${price}`,
        state: {
          teacher_Id: teacher_id,
          Class_Id: id,
          amount: price,
        },
      });
    }
  };
  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setAnchorEl(null);
  };
  const formik = useFormik({
    initialValues: {
      report_title: "",
      report_description: "",
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, {resetForm}) => {
      const formdata = {
        ...values,
        class_id: ClassID,
      };
      dispatch(ReportClass(formdata));
      handleCloseModal();
      resetForm({values : ''})
    }
  });
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };
  return (
    <>
      <StudentNavbar />
      {apiHit ? 
      <div className="classes-details">
        <Container>
          <div className="classDetailsContainer">
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="classesHeading mb-4"
            >
              Class details
            </Typography>
            <div className="subcontainer">
            <div>
              <IconButton
                aria-label="more"
                id="long-button"
                aria-controls={open ? "long-menu" : undefined}
                aria-expanded={open ? "true" : undefined}
                aria-haspopup="true"
                onClick={handleClick}
                className="threeDoticon"
              >
                <BsThreeDotsVertical />
              </IconButton>
              <Menu
                anchorEl={anchorEl}
                id="account-menu"
                open={open}
                onClose={handleClose}
                onClick={handleClose}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem onClick={handleOpenModal} className="menuItem">
                  {" "}
                  <BsFlag /> <span className="report-title">Report Class</span>
                </MenuItem>
              </Menu>
            </div>
          </div>
          <Modal
            open={openModal}
            onClose={handleCloseModal}
            aria-labelledby="parent-modal-title"
            aria-describedby="parent-modal-description"
          >
            <Box sx={{ ...style, width: 457 }}>
              <h2 className="parent-modal-title">Report this Class</h2>
              <div className="parent-modal-container">
                <label> Title </label>
                <Input
                  type="text"
                  className="FieldsText"
                  id="input-with-icon-adornment"
                  name="report_title"
                  placeholder="Reason for reporting"
                  value={formik.values.report_title}
                  onChange={formik.handleChange}
                />
                {formik.errors.report_title && formik.touched.report_title ? (
                  <div className="error_message">
                    {formik.errors.report_title}
                  </div>
                ) : null}

                <label> Description </label>
                <Input
                  type="textarea"
                  className="FieldsText"
                  id="input-with-icon-adornment"
                  name="report_description"
                  placeholder="Brief description of the issue"
                  value={formik.values.report_description}
                  onChange={formik.handleChange}
                />
                {formik.errors.report_description &&
                formik.touched.report_description ? (
                  <div className="error_message">
                    {formik.errors.report_description}
                  </div>
                ) : null}

                <button
                  className="modal-button"
                  onClick={() => formik.handleSubmit()}
                >
                  CONFIRM REPORT
                </button>
              </div>
            </Box>
          </Modal>
          </div>
          <img
            src={classDetails?.classData?.cover_image}
            alt="banner"
            className="cover-image w-100"
          />
          <div className="contentSec">
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="classes mt-4"
            >
              {classDetails?.classData?.discipline}
            </Typography>
            <Typography
              variant="h3"
              gutterBottom
              component="div"
              className="classesHeading mb-3"
            >
              {classDetails?.classData?.class_title}
            </Typography>
            <Typography variant="body1" gutterBottom className="descSubHead">
              {classDetails?.classData?.class_subtitle}
            </Typography>
            <div className="Teacher-Profile d-flex align-items-center">
              <Avatar
                alt="teacher Profile"
                src={classDetails?.teacherProfile?.profile_image}
                className="me-2"
              />
              <Typography variant="body1" gutterBottom className="descSubHead">
                {" "}
                By {classDetails?.teacherProfile?.first_name}{" "}
                {classDetails?.teacherProfile?.last_name}{" "}
                <Link href="#" className="ContactLink mb-0">
                  {classDetails?.teacherProfile?.phone}{" "}
                </Link>{" "}
              </Typography>
            </div>
            <div className="ClassesDescription">
              <Grid container spacing={2}>
                <Grid item xs={12} md={6} lg={4}>
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
                            primary={classDetails?.classData?.type_of_class == 1 ? "On Demand Class" : (
                              classDetails?.classData?.type_of_class == 2 ? "Single Session Class" : "Multi Sessions Class"
                            )
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                      {classDetails?.classData?.session_type ? (
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon
                              className="listIcons"
                              style={{ minWidth: "33px" }}
                            >
                              <MdOutlineDesktopWindows />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                session_type?.filter((a) => {
                                  return a;
                                })[classDetails?.classData?.session_type]
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      ) : (
                        ""
                      )}
                      <Divider />
                      {classDetails?.classData?.session_duration ? (
                        <ListItem disablePadding>
                          <ListItemButton>
                            <ListItemIcon
                              className="listIcons"
                              style={{ minWidth: "33px" }}
                            >
                              <BiTimeFive />
                            </ListItemIcon>
                            <ListItemText
                              primary={
                                session_duration?.filter((a) => {
                                  return a;
                                })[classDetails?.classData?.session_duration]
                              }
                            />
                          </ListItemButton>
                        </ListItem>
                      ) : (
                        ""
                      )}
                      <Divider />
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon
                            className="listIcons"
                            style={{ minWidth: "33px" }}
                          >
                            <BiBarChartSquare />
                          </ListItemIcon>
                          <ListItemText
                            primary={
                              class_level.filter((a) => {
                                return a;
                              })[classDetails?.classData?.class_level]
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </List>
                  </nav>
                </Grid>
                <Grid item xs={12} md={6} lg={4} className="mob--list">
                  <nav aria-label="main mailbox folders" className="infolist">
                    <List>
                      <ListItem disablePadding>
                        <ListItemButton>
                          <ListItemIcon
                            className="listIcons"
                            style={{ minWidth: "33px" }}
                          >
                            <BsGlobe />
                          </ListItemIcon>
                          <ListItemText
                            primary={classDetails?.classData?.language_of_class}
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
                            primary={
                              classDetails?.classData?.max_students_allowed == 1
                                ? "This is an individual class"
                                : "This is a group class"
                            }
                          />
                        </ListItemButton>
                      </ListItem>
                      <Divider />
                    </List>
                  </nav>
                </Grid>
                <ListItem>
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    component="h4"
                    className="desc-heading"
                  >
                    Session Date/Time{" "}
                  </Typography>
                </Grid>
                </ListItem>
                
                {classDetails?.sessionData?.length > 0 ? classDetails?.sessionData.map((session, index) => (
                  <ListItem key={index}>
                    <ListItemButton>
                      <ListItemIcon
                        className="listIcons"
                        style={{ minWidth: "33px" }}
                      >
                        <BiTimeFive />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          `Session ${index + 1} : ${moment(session.class_date).format("MMM D, YYYY")} at ${tConvert(session.start_time_of_class)} to ${tConvert(session.end_time_of_class)}`
                        }
                      />
                    </ListItemButton>
                  </ListItem>)) :
                  <ListItem>
                    <ListItemButton>
                      <ListItemIcon
                        className="listIcons"
                        style={{ minWidth: "33px" }}
                      >
                        <BiTimeFive />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          "No session record found it will be shown when any student booked this class (Note : On demand class does not have start or end time.)"
                        }
                      />
                    </ListItemButton>
                  </ListItem>

                }
                <Divider />

                <Grid container spcaing={4}>
            {classDetails?.classData?.session_type == 1 && (
              <Grid item lg={6} md={6} sm={12} xs={12}>
                <Typography
                  variant="h3"
                  gutterBottom
                  component="div"
                  className="mt-4"
                >
                  {" "}
                  Location
                </Typography>
                <Box className="Location mapOuter">
                  <Typography
                    variant="h5"
                    gutterBottom
                    component="div"
                    className="mt-4 mb-3"
                  >
                    {" "}
                    {classDetails?.classData?.address_or_class_link}{" "}
                  </Typography>
                  {classDetails?.classData?.location ? (
                    <GoogleMap
                      longitude={
                        classDetails?.classData?.location?.coordinates[0]
                      }
                      latitude={
                        classDetails?.classData?.location?.coordinates[1]
                      }
                    />
                  ) : (
                    <iframe
                      src="//maps.google.com/maps?q=53.3381768,-6.2613077&z=15&output=embed"
                      width="100%"
                      height="250"
                    ></iframe>
                  )}
                </Box>
              </Grid>
            )}
          </Grid>
                <Grid item xs={12} lg={12} md={12} sm={12}>
                  <Typography
                    variant="h4"
                    gutterBottom
                    component="h4"
                    className="desc-heading"
                  >
                    Description{" "}
                  </Typography>
                  <Typography
                    paragraph={true}
                    style={{ fontSize: "14px", color: "rgba(0, 0, 0, 0.54)" }}
                  >
                    {classDetails?.classData?.class_description}
                  </Typography>
                </Grid>

              </Grid>
              <ClassTopics topics={classDetails?.classData?.topics_text} />
              <div className="SessionDetails">
                <Grid container spacing={2}>
                  <Grid item lg={8} xs={12}>
                    <Typography
                      variant="h4"
                      gutterBottom
                      component="h1"
                      className="PriceDetail mb-0"
                    >
                      <span className="Price">
                        ${classDetails?.classData?.price}
                      </span>
                      /Session*
                    </Typography>
                    <Typography paragraph={true}>
                      *Rate is per student
                    </Typography>
                  </Grid>
                  <Grid item lg={4} xs={12}>
                    <Link
                      href="#"
                      className="contactBtn"
                      onClick={() =>
                        bookClass(
                          classDetails?.classData?._id,
                          classDetails?.classData?.price,
                          classDetails?.classData?.type_of_class
                        )
                      }
                    >
                      Book
                    </Link>
                  </Grid>
                </Grid>
              </div>
            </div>
          </div>
        </Container>
      </div> : 
      <Grid
      item
      lg={12}
      md={12}
      sm={12}
      className="m-auto mb-4 loader_svg_on_clear_filter"
    >
      <CircularProgress color="inherit" />
    </Grid>
}
    </>
  );
};
export default Classes;
