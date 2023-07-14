import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import { Typography } from "@mui/material";
import "../../../../css/admin/student.css";
import { BsCalendar4 } from "react-icons/bs";
import { FiDollarSign } from "react-icons/fi";
import Box from "@mui/material/Box";
import Paper from "@mui/material/Paper";
import Button from "@mui/material/Button";
// import StudentInfoDataTable from "./StudentInfoDataTable";
import StudentRecentTransaction from "./StudentRecentTransaction";
import { FiEdit, FiXCircle } from "react-icons/fi";
import { Link } from "react-router-dom";
import Loader from "../../../Loader";

import { getUserStudentDetailById } from "../../../../actions/auth";
import { connect } from "react-redux";
import "react-smart-data-table/dist/react-smart-data-table.css";
import SmartDataTable from "react-smart-data-table";

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
  //   action: {
  //     text: "Action",
  //     invisible: false,
  //     sortable: false,
  //     filterable: true,
  //     transform: (value, index, row) => {
  //       return (
  //         <>
  //           <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
  //             <button className="edit-userbtn">
  //               <FiEdit />
  //             </button>
  //             <button className="delete-userbtn">
  //               <FiXCircle />
  //             </button>
  //           </Box>
  //         </>
  //       );
  //     },
  //   },
};
const StudentInformation = ({ user_id, getUserStudentDetailById }) => {
  const [studentDetail, setStudentDetail] = useState({
    averageRating: 0,
    recentSessions: [],
    recentTransactions: [],
    sessionsAttended: 0,
    totalRatingCount: 0,
    totalSpent: 0,
  });
  const [tableData, setTableData] = useState([]);
  const [apiHit, setApiHit] = useState(false);
  const classType = ["", "On Demand", "Single Class", "Course"];
  useEffect(() => {
    getUserStudentDetailById(user_id).then((res) => {
      if (res && res.success) {
        setStudentDetail(res.data);
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
              session.class_id && session.class_id.session_type == 1
                ? "Local"
                : session.class_id &&
                  session.class_id.session_type == 2 &&
                  "Online",
            session_status: "Scheduled",
          });
        }
        setTableData(dataArray);
        setApiHit(true);
      }
    });
  }, [user_id]);
  return (
    <div className="StudentInfoWrap">
      {!apiHit ? (
        <Loader />
      ) : (
        <>
          <Grid container>
            <Grid item lg={4} md={4} sm={12} xs={12} className="GridVal">
              <Grid container className="studRecord">
                <Grid item lg={9} md={9} sm={12} xs={12}>
                  <Typography variant="h5" component="h2">
                    {" "}
                    Student Rating
                  </Typography>
                  <p className="totalval">
                    {studentDetail.averageRating} (
                    {studentDetail.totalRatingCount})
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
                    Sessions Attended
                  </Typography>
                  <p className="totalval">{studentDetail.sessionsAttended}</p>
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
                    Total Spent
                  </Typography>
                  <p className="totalval">$ {studentDetail.totalSpent}</p>
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
                  <Link to="/sessions" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" style={{ borderRadius: 50 }}>
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
                loader={<Loader />}
                headers={headers}
                emptyTable={
                  <div style={{ alignItems: "center",textAlign:"center", padding:"10px", background:"#e1e3e7" }}>
                    No Record Found
                  </div>
                }
              />
            </Grid>
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
                    Recent Transactions
                  </Typography>
                  <Link to="/payments" style={{ textDecoration: 'none' }}>
                    <Button variant="contained" style={{ borderRadius: 50 }}>
                      View all
                    </Button>
                  </Link>
                </Box>
              </Paper>
              <StudentRecentTransaction user_id={user_id} />
            </Grid>
          </Grid>{" "}
        </>
      )}
    </div>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { getUserStudentDetailById })(
  StudentInformation
);
