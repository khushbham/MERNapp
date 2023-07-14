import React, { useState, useEffect } from "react";
import Container from "@mui/material/Container";
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
import ClassTopics from "./ClassTopics1";
import { MdOutlineDesktopWindows } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { BiBarChartSquare } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { BsGlobe } from "react-icons/bs";
import "../../../../css/Frontend/style.css";
import { useDispatch } from "react-redux";
import Checkbox from "@mui/material/Checkbox";
import Box from "@mui/material/Box";
import { FiEdit } from "react-icons/fi";
import { BiBlock } from "react-icons/bi";
import Modal from "@mui/material/Modal";
import Input from "@mui/material/Input";
import IconButton from "@mui/material/IconButton";
import Menu from "@mui/material/Menu";
import * as yup from "yup";
import MenuItem from "@mui/material/MenuItem";
import { BsThreeDotsVertical, BsFlag } from "react-icons/bs";
import {
  addwishlist,
  getClassDetailForStudent,
  getDropdownValues,
  ReportClass,
} from "../../../../actions/frontent";
import { useFormik } from "formik";
const validationSchema = yup.object({
  report_title: yup.string().required(" First Name is required"),
  report_description: yup.string().required(" Last Name is required"),
});
const Classes = () => {
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
  const label = { inputProps: { "aria-label": "Checkbox demo" } };
  const dispatch = useDispatch();
  const [classDetails, setclassDetails] = useState();
  const [class_level, setclass_level] = useState([]);
  const [session_type, setsession_type] = useState([]);
  const [session_duration, setsession_duration] = useState([]);
  const [classes, setclasses] = useState([
    "",
    "On Demand",
    "Single Class",
    "Course",
  ]);
  const queryParams = new URLSearchParams(window.location.search);
  const TeacherID = queryParams.get("teacher_Id");
  const ClassID = queryParams.get("Class_Id");

  useEffect(() => {
    dispatch(getClassDetailForStudent(TeacherID, ClassID))
      .then((res) => {
        console.log(res.data);
        setclassDetails(res.data);
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
      // setclasses(
      //   res.data.filter((a) => {
      //     if (a.name == "classes") {
      //       return a;
      //     }
      //   })[0].options
      // )
    });
  }, []);

  const [reason, setreason] = React.useState("");
  const [wishlists, setwishlist] = React.useState(false);
  const [openModal, setOpenModal] = React.useState(false);

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);

  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const wishlist = (id) => {
    dispatch(addwishlist(id))
      .then((res) => {
        if (res.success == true) {
          setwishlist(true);
        } else {
          setwishlist(false);
        }
      })
      .catch((err) => {
        console.log(err);
      });
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
  const tConvert = (time24) => {
    const [sHours, minutes] = time24
      .match(/([0-9]{1,2}):([0-9]{1,2})/)
      .slice(1);
    const period = +sHours < 12 ? "AM" : "PM";
    const hours = +sHours % 12 || 12;
    return `${hours}:${minutes} ${period}`;
  };
  return (
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
                    <Divider />
                    <ListItem disablePadding>
                      <ListItemButton>
                        <ListItemIcon
                          className="listIcons"
                          style={{ minWidth: "33px" }}
                        >
                          <BiTimeFive />
                        </ListItemIcon>
                        {(classDetails?.classData?.type_of_class == 2 ||
                          classDetails?.classData?.type_of_class == 3) &&
                          classDetails?.sessionData &&
                          classDetails?.sessionData.length > 0 &&
                          classDetails?.sessionData.map(
                            (singleSession, index) => (
                              <ListItemText>
                                {singleSession.class_date} at{" "}
                                {tConvert(singleSession.start_time_of_class)} to{" "}
                                {tConvert(singleSession.end_time_of_class)}
                              </ListItemText>
                            )
                          )}
                        {classDetails?.classData?.type_of_class == 1 && (
                          <ListItemText
                            primary={
                              session_duration?.filter((a) => {
                                return a;
                              })[classDetails?.classData?.session_duration]
                            }
                          />
                        )}
                      </ListItemButton>
                    </ListItem>
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
                            classes[classDetails?.classData?.type_of_class]
                          }
                        />
                      </ListItemButton>
                    </ListItem>
                    <Divider />
                  </List>
                </nav>
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
                  <Typography paragraph={true}>*Rate is per student</Typography>
                </Grid>
              </Grid>
            </div>
          </div>
        </div>
      </Container>
    </div>
  );
};
export default Classes;
