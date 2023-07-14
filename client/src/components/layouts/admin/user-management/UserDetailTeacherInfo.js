import React, { useState, useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import "../../../../css/admin/student.css";
import Loader from "../../../Loader";

import Avatar from "@mui/material/Avatar";
import FormControl from "@mui/material/FormControl";
import { AiOutlineArrowDown } from "react-icons/ai";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import TextareaAutosize from "@mui/material/TextareaAutosize";
import { Link } from "react-router-dom";
import { BsCalendar4 } from "react-icons/bs";
import { FiDollarSign } from "react-icons/fi";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
import TeacherPayouts from "./TeacherPayouts";
import { userDetailsTeach } from "../../../../actions/auth";
import { connect } from "react-redux";
import "react-smart-data-table/dist/react-smart-data-table.css";
import SmartDataTable from "react-smart-data-table";
const UserDetailTeacherInfo = ({ user_id, userDetailsTeach }) => {
  const [teacherDetail, setTeacherDetail] = useState({
    recentSessions: [],
    sessionsAttended: 0,
    totalRatingCount: 0,
    totalSpent: 0,
    userData: [],
    classData: [],
    sessionsHostedTeacher: 0,
    totalRatingCountT: 0,
    averageRatingTeacher: 0,
  });

  const headers = {
    class_title: {
      text: "ClassName",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <div className="StudentData">
              <p>{value}</p>
            </div>
          </>
        );
      },
    },
    class_type: {
      text: "Class Type",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    class_date: {
      text: "Date And Time",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    session_type: {
      text: "Session Type",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    session_status: {
      text: "Session Status",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    _id: {
      text: "ID",
      invisible: true,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
  };
  const classesHeaders = {
    class_title: {
      text: "ClassName",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <div className="StudentData">
              <p>{value}</p>
            </div>
          </>
        );
      },
    },
    session_type: {
      text: "Session Type",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    price: {
      text: "Price",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>$ {value}</p>
          </>
        );
      },
    },
    _id: {
      text: "ID",
      invisible: true,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
  };
  const [tableData, setTableData] = useState([]);
  const [classesData, setClassesData] = useState([]);
  const [apiHit, setApiHit] = useState(false);

  const classType = ["", "On Demand", "Single Class", "Course"];
  const sessionType = ["", "Local", "Online"];
  useEffect(() => {
    userDetailsTeach(user_id).then((res) => {
      console.log(res);
      if (res && res.success) {
        setTeacherDetail(res.data);
        var dataArray = [];
        for (let i = 0; i < res.data.recentSessions.length; i++) {
          var session = res.data.recentSessions[i];
          dataArray.push({
            _id: session._id,
            class_title: session.class_title,
            class_type:
              session.class_id && classType[session.class_id.type_of_class],
            class_date: session.class_date,
            session_type:
              sessionType[session.class_id && session.class_id.session_type],
            session_status: "Scheduled",
          });
        }
        setTableData(dataArray);
        var classesArray = [];
        for (let i = 0; i < res.data.classData.length; i++) {
          var classDetail = res.data.classData[i];
          classesArray.push({
            _id: classDetail._id,
            class_title: classDetail.class_title,
            session_type:
              sessionType[
                classDetail.class_id && classDetail.class_id.session_type
              ],
            price: classDetail.class_id && classDetail.class_id.price
          });
        }
        setClassesData(classesArray);
        setApiHit(true);
      }
    });
  }, [user_id]);
  return (
    <>
      {!apiHit ? (
        <Loader />
      ) : (
        <>
          <div className="UserDetails">
            <Grid container spacing={2}>
              <Grid item xs={12} sm={12} p-5>
                <Typography variant="h5" component="h5" className="testHeading">
                  {" "}
                  Select a Profile{" "}
                </Typography>
              </Grid>
              <Grid item xs={4} sm={4} p-5>
                <div className="profileWrap mb-1 ">
                  <Grid container className="teacherProfile">
                    <Grid item xs={11} sm={11}>
                      <div className="d-flex">
                        <Avatar
                          alt="Sharp"
                          src={
                            teacherDetail.userData &&
                            teacherDetail.userData.profile_image
                          }
                          className="me-2"
                        />
                        <div>
                          <Typography variant="h5" component="h5">
                            {teacherDetail.userData &&
                              teacherDetail.userData.first_name}
                          </Typography>
                        </div>
                      </div>
                    </Grid>
                    <Grid item xs={1} sm={1}>
                      <AiOutlineArrowDown />
                    </Grid>
                  </Grid>
                </div>
                <div className="ExpertInfo">
                  <FormControl variant="standard" className="mt-2 w-100">
                    <InputLabel
                      shrink
                      htmlFor="text"
                      className="FiledText pb-2"
                    >
                      Expertise
                    </InputLabel>
                    <TextField
                      className="InputField mt-4"
                      id="text"
                      variant="standard"
                      readOnly={true}
                      value={
                        teacherDetail.userData &&
                        teacherDetail.userData.expertise
                      }
                      placeholder="Piano Teacher"
                    />
                  </FormControl>
                  <FormControl variant="standard" className="mt-2 w-100">
                    <InputLabel
                      shrink
                      htmlFor="text"
                      className="FiledText pb-2"
                    >
                      Spoken Languages
                    </InputLabel>
                    <TextField
                      className="InputField mt-4"
                      id="text"
                      variant="standard"
                      placeholder="Piano Teacher"
                      readOnly={true}
                      value={
                        teacherDetail.userData &&
                        teacherDetail.userData.language
                      }
                    />
                  </FormControl>
                  <FormControl variant="standard" className="mt-2 w-100">
                    <InputLabel
                      shrink
                      htmlFor="text"
                      className="FiledText pb-2 w-100"
                    >
                      About Me
                    </InputLabel>
                    <TextareaAutosize
                      className="InputField mt-4"
                      aria-label="minimum height"
                      minRows={3}
                      placeholder="Piano Teacher"
                      style={{ width: "100%" }}
                      readOnly={true}
                      value={
                        teacherDetail.userData &&
                        teacherDetail.userData.about_expertise
                      }
                    />
                  </FormControl>
                </div>
              </Grid>
              <Grid item xs={8} lg={8}>
                <div className="DataTable">
                  <Typography variant="h5" component="h5" className="pt-2">
                    Classes
                  </Typography>
                  <div className="DataTablewrap1">
                    <SmartDataTable
                      data={classesData}
                      name="test-table"
                      className="ui compact selectable table recent-users"
                      sortable
                      headers={classesHeaders}
                      emptyTable={
                        <div
                          style={{
                            alignItems: "center",
                            textAlign: "center",
                            padding: "10px",
                            background: "#e1e3e7",
                          }}
                        >
                          No Record Found
                        </div>
                      }
                    />
                  </div>
                </div>
              </Grid>
            </Grid>
          </div>
          <div className="TeacherInfo">
            <div className="teacherTesing">
              <Grid container>
                <Grid item lg={4} md={4} sm={12} xs={12} className="GridVal">
                  <Grid container className="studRecord">
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                      <Typography variant="h5" component="h2">
                        {" "}
                        Teacher Rating
                      </Typography>
                      <p className="totalval">
                        {teacherDetail.averageRating} (
                        {teacherDetail.totalRatingCount})
                      </p>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                      <div className="Circle">
                        <BsCalendar4 />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} className="GridVal">
                  <Grid container className="studRecord">
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                      <Typography variant="h5" component="h2">
                        {" "}
                        Sessions Hosted
                      </Typography>
                      <p className="totalval">
                        {teacherDetail.sessionsHostedTeacher}{" "}
                      </p>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                      <div className="Circle">
                        <BsCalendar4 />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={4} md={4} sm={12} xs={12} className="GridVal">
                  <Grid container className="studRecord">
                    <Grid item lg={9} md={9} sm={12} xs={12}>
                      <Typography variant="h5" component="h2">
                        Total Earnings
                      </Typography>
                      <p className="totalval">$ 0</p>
                    </Grid>
                    <Grid item lg={3} md={3} sm={12} xs={12}>
                      <div className="Circle">
                        <FiDollarSign />
                      </div>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Paper className="mt-3 p-2">
                    <Box
                      sx={{
                        display: "flex",
                        alignItems: "center",
                        p: 1,
                        m: 1,
                      }}
                    >
                      <Typography variant="h5" className="spc-extra-rght">
                        Recent Sessions
                      </Typography>
                      <Link to="/sessions" style={{ textDecoration: "none" }}>
                        <Button
                          variant="contained"
                          style={{ borderRadius: 50 }}
                        >
                          View all
                        </Button>
                      </Link>
                    </Box>
                  </Paper>
                  <SmartDataTable
                    data={tableData}
                    name="test-table"
                    className="ui compact selectable table recent-users"
                    sortable
                    headers={headers}
                    emptyTable={
                      <div
                        style={{
                          alignItems: "center",
                          textAlign: "center",
                          padding: "10px",
                          background: "#e1e3e7",
                        }}
                      >
                        No Record Found
                      </div>
                    }
                  />
                </Grid>
                <Grid container>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <Paper className="mt-3 p-2">
                      <Box
                        sx={{
                          display: "flex",
                          alignItems: "center",
                          p: 1,
                          m: 1,
                        }}
                      >
                        <Typography variant="h5" className="spc-extra-rght">
                          Recent Payouts
                        </Typography>
                        <Link to="/payments" style={{ textDecoration: "none" }}>
                          <Button
                            variant="contained"
                            style={{ borderRadius: 50 }}
                          >
                            View all
                          </Button>
                        </Link>
                      </Box>
                    </Paper>
                    <TeacherPayouts user_id={user_id} session_id="" />
                  </Grid>
                </Grid>
              </Grid>
            </div>
          </div>
        </>
      )}
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { userDetailsTeach })(
  UserDetailTeacherInfo
);
