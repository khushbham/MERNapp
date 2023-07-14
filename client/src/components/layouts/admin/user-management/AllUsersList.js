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
import {
  managementusers,
  getLocationsList,
  getDropdownValues,
  changeAccountStatus,
} from "../../../../actions/auth";
import MenuItem from "@mui/material/MenuItem";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import Pagination from "@mui/material/Pagination";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import { Select } from "@mui/material";
import { FiSearch } from "react-icons/fi";

import "react-smart-data-table/dist/react-smart-data-table.css";
import { Box } from "@mui/system";
import Grid from "@mui/material/Grid";
import Loader from "../../../Loader";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.8),
  },
  marginRight: theme.spacing(2),
  marginTop: 20,
  height: 36,
  marginLeft: 0,
  width: "100%",
  height: "100%",
  border: 1,
  borderStyle: "solid",
  borderColor: "#ced4da",
  [theme.breakpoints.up("sm")]: {
    // marginLeft: theme.spacing(3),
    width: "100%",
  },
}));

const SearchIconWrapper = styled("div")(({ theme }) => ({
  padding: theme.spacing(0, 2),
  height: "100%",
  position: "absolute",
  top: "0",
  right: "0",
  pointerEvents: "none",
  display: "flex",
  alignItems: "center",
  justifyContent: "center",
}));

const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 5, 1, 1),
    // vertical padding + font size from searchIcon
    // paddingRight: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));
function AllUsersList({
  managementusers,
  getLocationsList,
  getDropdownValues,
  changeAccountStatus,
  auth: { managementUsers, loadUsersForManagement, dropdownData },
}) {
  const [message, setMessage] = React.useState("");
  const [userTypes, setUserTypes] = React.useState([]);
  const [activePageNumber, setActivePageNumber] = React.useState(1);
  const [page, setPage] = React.useState(0);
  const [apiHit, setApiHit] = React.useState(false);
  const [userNameForSearch, setUserNameForSearch] = React.useState("");
  const [userTypeForSearch, setUserTypeForSearch] = React.useState("");
  const [locationForSearch, setLocationForSearch] = React.useState(
    JSON.stringify({})
  );
  const [search, clickOnSearch] = React.useState(false);
  const [accountStatusForSearch, setAccountStatusForSearch] =
    React.useState("");
  const [accountStatusArray, setAccountStatusArray] = React.useState([]);
  const [locationsArray, setLocationsArray] = React.useState(null);
  const [tableData, setTableData] = React.useState([]);

  var accountStatus = ["Need Verification", "Active", "Suspended", "Archived"];

  const headers = {
    _id: {
      text: "ID",
      invisible: true,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        // The following results should be identical
        //console.log(value, row.tableActions)
        // Example of table actions: Delete row from data by row index
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    profile_image: {
      text: "Profile Image",
      invisible: true,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        // The following results should be identical
        //console.log(value, row.tableActions)
        // Example of table actions: Delete row from data by row index
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    fullName: {
      text: "Name / Email",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        // The following results should be identical
        //console.log(value, row.tableActions)
        // Example of table actions: Delete row from data by row index
        return (
          <>
            {/* <div className="">
          <img src="../../../../../../../images/profile-pic.png" />
          <Typography variant="h5">{value}</Typography>
          <p className="recent-user-email">test@gmail.com</p>
          </div> */}

            <List
              className="recnt-usr-list"
              sx={{ width: "100%", bgcolor: "background.paper" }}
            >
              <ListItem alignItems="center">
                <ListItemAvatar>
                  <a href={`/user-details/${row._id}`}>
                    {row.profile_image && row.profile_image != "" ? (
                      <Avatar alt="" src={row.profile_image} />
                    ) : (
                      <Avatar
                        alt=""
                        src="../../../../../../../images/profile-pic.png"
                      />
                    )}
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
        // The following results should be identical
        //console.log(value, row.tableActions)
        // Example of table actions: Delete row from data by row index
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
        // The following results should be identical
        // console.log(value, row.tableActions)
        // Example of table actions: Delete row from data by row index
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
        // The following results should be identical
        //console.log(value, row.tableActions)
        // Example of table actions: Delete row from data by row index
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
        // The following results should be identical
        // console.log(value, row.tableActions)
        // Example of table actions: Delete row from data by row index
        return (
          <>
            <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
              <a className="edit-userbtn" href={`/user-details/${row._id}`}>
                <FiEdit />
              </a>
              {row.status != "Archived" && 
              <Link
                className="edit-userbtn"
                onClick={() => changeStatus(row._id, 3)}
              >
                <FiXCircle />
              </Link>}
            </Box>
          </>
        );
      },
    },
  };
  const changeStatus = (user, status) => {
    if (window.confirm("Do you really want to archive this?")) {
      changeAccountStatus(user, status).then((res) => {
        if (res && res.success) {
          setMessage(res.message);
          clickOnSearch(!search);
        }
      });
    }
  };
  const handleChange = (e, p) => {
    setActivePageNumber(p);
  };
  useEffect(() => {
    var locationType = 0;
    var locationData = "";
    if (JSON.parse(locationForSearch).state) {
      locationType = 1;
      locationData = JSON.parse(locationForSearch).state;
    }
    if (JSON.parse(locationForSearch).city) {
      locationType = 2;
      locationData = JSON.parse(locationForSearch).city;
    }
    var searchString = `name=${userNameForSearch}&&user_role=${userTypeForSearch}&&account_status=${accountStatusForSearch}&&page=${activePageNumber}&&location=${locationData}&&location_type=${locationType}`;
    managementusers(searchString).then((res) => {
      console.log(res);
      if (res && res.success) {
        let latestData = [];
        for (let i = 0; i < res.data.length; i++) {
          latestData.push({
            _id: res.data[i]._id,
            fullName:
              res.data[i].first_name && res.data[i].last_name
                ? res.data[i].first_name + " " + res.data[i].last_name
                : "-",
            profile_image: res.data[i].profile_image,
            location:
              res.data[i].street_address &&
              res.data[i].street_address &&
              res.data[i].street_address
                ? res.data[i].street_address +
                  " " +
                  res.data[i].city +
                  ", " +
                  res.data[i].state
                : "-",
            type:
              res.data[i].user_role == 1
                ? "Student"
                : res.data[i].user_role == 2
                ? "Teacher"
                : "Platform Admin",
            status: accountStatus[res.data[i].account_status],
            // account 0 => Need verification, status is 1 => Active, 2 => Suspended , 3 => Deleted.
            // 'email': faker.internet.email(),
            // phone_number: faker.phone.phoneNumber()
          });
        }
        setTableData(latestData);
        setPage(res.totalPages);
        setApiHit(true);
      }
    });
  }, [search, activePageNumber]);
  useEffect(() => {
    getLocationsList().then((res) => {
      if (res && res.success) {
        setLocationsArray(res.data);
      }
    });
    getDropdownValues().then((res) => {
      if (res && res.success) {
        let user_type_array = res.data.filter(
          (dropdown) => dropdown.name == "users_type"
        );
        let user_account_status_array = res.data.filter(
          (dropdown) => dropdown.name == "users_account_status"
        );
        setUserTypes(
          user_type_array.length > 0 ? user_type_array[0].options : []
        );
        setAccountStatusArray(
          user_account_status_array.length > 0
            ? user_account_status_array[0].options
            : []
        );
      }
    });
  }, []);
  return (
    <>
      <Grid container className="p-3 filter-area">
        <Grid item lg={10}>
          <Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={6} lg={6} className="search-field">
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="search">
                    Search
                  </InputLabel>
                  <Search>
                    <StyledInputBase
                      placeholder="By user name or email address"
                      inputProps={{ "aria-label": "search" }}
                      onChange={(e) => setUserNameForSearch(e.target.value)}
                    />
                    <SearchIconWrapper>
                      <FiSearch />
                    </SearchIconWrapper>
                  </Search>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="filter-by-user-type">
                    Filter by User Type
                  </InputLabel>
                  <Select
                    value={userTypeForSearch}
                    onChange={(e) => setUserTypeForSearch(e.target.value)}
                    displayEmpty
                    className="filter-list"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value={""}>All Types</MenuItem>
                    {userTypes.length > 0 &&
                      userTypes.map(
                        (option, index) =>
                          index != 0 && (
                            <MenuItem key={`user_type_${index}`} value={index}>
                              {option}
                            </MenuItem>
                          )
                      )}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="filter-by-location-type">
                    Filter by Location
                  </InputLabel>
                  <Select
                    value={locationForSearch}
                    onChange={(e) => setLocationForSearch(e.target.value)}
                    displayEmpty
                    className="filter-list"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value={JSON.stringify({})}>
                      All Locations
                    </MenuItem>
                    {locationsArray &&
                      locationsArray.states.length > 0 &&
                      locationsArray.states.map((state, index) => (
                        <MenuItem
                          key={`state_${index}`}
                          value={JSON.stringify({ state: state._id })}
                        >
                          {state._id}
                        </MenuItem>
                      ))}
                    {locationsArray &&
                      locationsArray.cities.length > 0 &&
                      locationsArray.cities.map((city, index) => (
                        <MenuItem
                          key={`city_${index}`}
                          value={JSON.stringify({ city: city._id })}
                        >
                          {city._id}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={6} lg={2}>
                <FormControl variant="standard">
                  <InputLabel shrink htmlFor="filter-by-location-type">
                    Filter by Status
                  </InputLabel>
                  <Select
                    value={accountStatusForSearch}
                    onChange={(e) => setAccountStatusForSearch(e.target.value)}
                    displayEmpty
                    className="filter-list"
                    inputProps={{ "aria-label": "Without label" }}
                  >
                    <MenuItem value={""}>All Statuses</MenuItem>

                    {accountStatusArray.length > 0 &&
                      accountStatusArray.map((option, index) => (
                        <MenuItem key={`user_status_${index}`} value={index}>
                          {option}
                        </MenuItem>
                      ))}
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Grid item lg={2} style={{ paddingLeft: "16px" }}>
          <span
            style={{ marginTop: "20px" }}
            className="add-new-user-btn"
            onClick={() => clickOnSearch(!search)}
          >
            Search
          </span>
        </Grid>
      </Grid>
      <Grid container className="p-3">
        <Grid item lg={12} md={12} sm={12} xl={12}>
          <div className="users-list-table">
            {message != "" && (
              <Box className="alert alert-success mt-3">{message}</Box>
            )}
            {!apiHit ? (
              <Loader />
            ) : (
              <SmartDataTable
                data={tableData}
                name="test-table"
                className="ui compact selectable table recent-users"
                sortable
                headers={headers}
                emptyTable={
                  <div style={{ alignItems: "center", textAlign: "center" }}>
                    No Record Found
                  </div>
                }
              />
            )}
            {apiHit && page != 0 && (
              <div className="pagination-section">
                <Pagination
                  onChange={handleChange}
                  count={page}
                  color="primary"
                />
              </div>
            )}
          </div>
        </Grid>
      </Grid>
    </>
  );
}
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  managementusers,
  getLocationsList,
  getDropdownValues,
  changeAccountStatus,
})(AllUsersList);
