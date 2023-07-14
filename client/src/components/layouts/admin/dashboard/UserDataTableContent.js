import React, { useEffect } from "react";
import SmartDataTable from "react-smart-data-table";
import { Typography } from "@mui/material";
import { FiEdit, FiXCircle } from "react-icons/fi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { connect } from "react-redux";
import { dashboardusers,changeAccountStatus } from "../../../../actions/auth";

import "react-smart-data-table/dist/react-smart-data-table.css";
import { Box } from "@mui/system";
var testData = [];
const numResults = 6;

function BasicInformation({
  dashboardusers,
  changeAccountStatus,
  auth: { dashboardUsers, loading },
}) {
  const [message, setMessage] = React.useState("");
  const [apiHit, setApiHit] = React.useState(false);

  var accountStatus = ["Need Verification", "Active", "Suspended", "Archived"];
  for (let i = 0; i < dashboardUsers.length; i++) {
    if (i == 0) {
      testData = [];
    }
    testData.push({
      _id: dashboardUsers[i]._id,
      fullName: (dashboardUsers[i].first_name && dashboardUsers[i].last_name ? 
        (dashboardUsers[i].first_name + " " + dashboardUsers[i].last_name) : "-"),
      location: (dashboardUsers[i].street_address && dashboardUsers[i].city && dashboardUsers[i].state ? 
        (dashboardUsers[i].street_address +
        " " +
        dashboardUsers[i].city +
        ", " +
        dashboardUsers[i].state) : "-"),
      type:
        dashboardUsers[i].user_role == 1
          ? "Student"
          : dashboardUsers[i].user_role == 2
          ? "Teacher"
          : "Platform Admin",
      status: accountStatus[dashboardUsers[i].account_status]
    });
  }
  const headers = {
    _id: {
      text: "Identifier",
      invisible: true,
      filterable: false,
    },
    fullName: {
      text: "Name / Email",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <List
              className="recnt-usr-list"
              sx={{ width: "100%", bgcolor: "background.paper" }}
            >
              <ListItem alignItems="center">
                <ListItemAvatar>
                  <a href={`/user-details/${row._id}`}>
                    <Avatar
                      alt=""
                      src="../../../../../../../images/profile-pic.png"
                    />
                  </a>
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h5">
                    {" "}
                    <a href={`/user-details/${row._id}`}>{value}</a>
                  </Typography>
                  {/* <Typography variant="fntEleven">test@gmail.com </Typography> */}
                </ListItemText>
              </ListItem>
            </List>
          </>
        );
      },
    },
    location: {
      text: "Location",
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
    type: {
      text: "Type",
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
    status: {
      text: "Status",
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
    action: {
      text: "Action",
      invisible: false,
      sortable: false,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <a className="edit-userbtn" href={`/user-details/${row._id}`}>
                <FiEdit />
              </a>
              {row.status != "Archived" && 
                <Link className="edit-userbtn" onClick={() => changeStatus(row._id,3)}>
                  <FiXCircle />
                </Link>
              }
            </Box>
          </>
        );
      },
    },
  };
  useEffect(() => {
    dashboardusers();
  }, [apiHit]);
  const changeStatus = (user, status) => {
    if (window.confirm("Do you really want to archive this?")) {
      changeAccountStatus(user, status).then((res) => {
        if (res && res.success) {
          setMessage(res.message);
          setApiHit(!apiHit);
        }
      });
    }
  };
  return (
    <>
      {message != "" && (
        <Box className="alert alert-success mt-3" style={{margin:"5px"}}>{message}</Box>
      )}
      <SmartDataTable
        data={testData}
        name="test-table"
        className="ui compact selectable table recent-users"
        sortable
        headers={headers}
      />
    </>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, { dashboardusers,changeAccountStatus })(BasicInformation);
