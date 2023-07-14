import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import { Link } from "react-router-dom";
import { FiSearch } from "react-icons/fi";
import { Select } from "@mui/material";
import Grid from "@mui/material/Grid";
import MenuItem from "@mui/material/MenuItem";
import Typography from "@mui/material/Typography";
import { FiCalendar } from "react-icons/fi";
import { styled, alpha } from "@mui/material/styles";
import { FormControl } from "@mui/material";
import "../../../../css/admin/sessions.css";
import faker from "faker";
import SmartDataTable from "react-smart-data-table";
import { FiEdit, FiXCircle } from "react-icons/fi";
import { FaFlag }  from 'react-icons/fa';
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import AvatarGroup from "@mui/material/AvatarGroup";
import Pagination from "@mui/material/Pagination";
import "react-smart-data-table/dist/react-smart-data-table.css";
import Footer from "../Footer";
import { getSessionsListing } from "../../../../actions/sessions";
import { useDispatch, useSelector } from "react-redux";

const Search = styled("div")(({ theme }) => ({
  position: "relative",
  borderRadius: theme.shape.borderRadius,
  backgroundColor: alpha(theme.palette.common.white, 1),
  "&:hover": {
    backgroundColor: alpha(theme.palette.common.white, 0.8),
  },
  marginTop: 20,
  height: 36,
  marginLeft: 0,
  width: "100%",
  height: "100%",
  border: 1,
  borderStyle: "solid",
  borderColor: "#ced4da",
  [theme.breakpoints.up("sm")]: {
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
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));

function Item(props) {
  const { sx, ...other } = props;
  return (
    <Box
      sx={{
        p: 1,
        borderRadius: 1,
        textAlign: "center",
        fontSize: "1rem",
        fontWeight: "700",
        ...sx,
      }}
      {...other}
    />
  );
}

const SessionsContent = () => {
  const dispatch = useDispatch();
  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [apiHit, setApiHit] = useState(false);
  const classTypeArray = ["", "On Demand", "1:1", "Group Classes"];
  const sessionTypeArray = ["", "Local", "Online"];
  const payoutArray = ["Pending", "Processed"];
  const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const [formData, setFormData] = useState({
    page: 1,
    class_title: "",
    type_of_class: 0,
    session_progress_status: -1,
    payout_status: -1,
  });
  useEffect(() => {
    setApiHit(false);
    var newForm = {};
    newForm = formData;
    newForm.page = currentPage;
    setFormData(newForm);
    dispatch(getSessionsListing(newForm)).then((res) => {
      console.log(res);

      if (res && res.success) {
        console.log("api hit");
        var testData = [];
        var numResults = res.data.sessions.length;

        for (let i = 0; i < numResults; i++) {
          console.log(res.data.sessions[i]);
          testData.push({
            fullName: res.data.sessions[i].users.first_name + ' ' + res.data.sessions[i].users.last_name,
            profile_image: res.data.sessions[i].users.profile_image,
            user_id: res.data.sessions[i].users._id,
            _id: res.data.sessions[i]._id,
            student: faker.image.avatar(),
            classname: res.data.sessions[i].classes.class_title,
            classtype:
              classTypeArray[res.data.sessions[i].classes.type_of_class], // 1 => on demand, 2 => single class, 3 => course
            datetime:
              res.data.sessions[i].class_date +
              "\n(" +
              res.data.sessions[i].start_time_of_class +
              "-" +
              res.data.sessions[i].end_time_of_class +
              ")",
            sessiontype:
            sessionTypeArray[res.data.sessions[i].classes.session_type],
            payoutstatus: payoutArray[res.data.sessions[i].payout_status],
            classReportStatus : res.data.sessions[i].classReportStatus
          });
        }
        setTableData(testData);
        setTotalPages(res.data.totalPages);
        setApiHit(true);
      }
    });
  }, [currentPage, searchButtonClicked]);
  
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  const headers = {
    fullName: {
      text: "Teacher / Email",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <List className="session-usr-list" sx={{ width: "100%" }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <a href={`/user-details/${row.user_id}`}>
                    {row.profile_image ? (
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
                    <a href={`/user-details/${row.user_id}`}>{value}</a>
                  </Typography>
                  {/* <Typography variant="fntEleven">test@gmail.com </Typography> */}
                </ListItemText>
              </ListItem>
            </List>
          </>
        );
      },
    },
    student: {
      text: "Student ( s )",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <p className="flexx flex-roww">
          {row.classtype == "Group Classes" ?
          <AvatarGroup className="setup_group" max={4}>
            <Avatar alt="Remy Sharp" src="../../../../../../../images/profile-pic.png" />
            <Avatar alt="Travis Howard" src="../../../../../../../images/profile-pic.png" />
            <Avatar alt="Cindy Baker" src="../../../../../../../images/profile-pic.png" />
            <Avatar alt="Agnes Walker" src="../../../../../../../images/profile-pic.png" />
            <Avatar alt="Trevor Henderson" src="../../../../../../../images/profile-pic.png" />
          </AvatarGroup> : <AvatarGroup className="setup_group" max={1}>
            <Avatar alt="Remy Sharp" src="../../../../../../../images/profile-pic.png" />
          </AvatarGroup>
        }
          </p>
        );
      },
    },
    profile_image: {
      text: "Profile",
      invisible: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    _id: {
      text: "Session ID",
      invisible: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    user_id: {
      text: "User ID",
      invisible: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    classname: {
      text: "Class Name",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <div>
            <p> {value} {row.classReportStatus ?<FaFlag/>:''}  </p>

          </div>
        );
      },
    },
    classtype: {
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
    datetime: {
      text: "Date and Time",
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
    sessiontype: {
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
    payoutstatus: {
      text: "Payout Status",
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
              {/* <ClassDetailsPopup /> */}
              <a href={`/session-details/${row._id}`}>
                <button className="edit-userbtn">
                  <FiEdit />
                </button>
              </a>
              {/* <button className="delete-userbtn">
                <FiXCircle />
              </button> */}
            </Box>
          </>
        );
      },
    },
  };
  const handleChange = (e, p) => {
    setCurrentPage(p);
  };
  return (
    <>
      <Grid container className="p-3 main-head-dashboard">
        <Grid item xs={12} md={8} xl={8} lg={8}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Item>
              <Typography variant="h5">Sessions List</Typography>
            </Item>
            <Item>
              <Link to="/calendar-sessions/" className="switch-btn">
                <span>
                  <FiCalendar />
                </span>{" "}
                Switch to calendar view
              </Link>
            </Item>
          </Box>
        </Grid>
        <Grid item xs={12} md={4} xl={4} lg={4}>
          <Typography align="right" variant="body1">
            Session Management
          </Typography>
        </Grid>
      </Grid>

      <Grid container className="p-3 session-list" spacing={2}>
        <Grid item xs={12} md={4} xl={4} lg={4} sm={12}>
          <FormControl variant="standard" className="search-field">
            <InputLabel shrink htmlFor="search">
              Search
            </InputLabel>
            <Search>
              <StyledInputBase
                placeholder="By class name"
                onChange={onChange}
                name="class_title"
                inputProps={{ "aria-label": "search" }}
              />
              <SearchIconWrapper>
                <FiSearch />
              </SearchIconWrapper>
            </Search>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2} xl={2} lg={2} sm={12}>
          <FormControl variant="standard" className="class-type">
            <InputLabel shrink htmlFor="filter-by-class-type">
              Filter by Class Type
            </InputLabel>
            <Select
              value={formData.type_of_class}
              //defaultValue={10}
              onChange={onChange}
              name="type_of_class"
              displayEmpty
              className="filter-class-list"
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={0}>All Types</MenuItem>
              <MenuItem value={1}>On Demand</MenuItem>
              <MenuItem value={2}>1:1 Class</MenuItem>
              <MenuItem value={3}>Group Classes</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2} xl={2} lg={2} sm={12}>
          <FormControl variant="standard" className="class-type">
            <InputLabel shrink htmlFor="filter-by-session-status">
              Filter by Session Status
            </InputLabel>
            <Select
              value={formData.session_progress_status}
              onChange={onChange}
              name="session_progress_status"
              displayEmpty
              className="filter-class-list"
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={-1}>All Statuses</MenuItem>
              <MenuItem value={0}>Pending/Expired</MenuItem>
              <MenuItem value={1}>In Progress/ Rating Pending</MenuItem>
              <MenuItem value={2}>Completed</MenuItem>
              <MenuItem value={3}>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        {/* <Grid item xs={12} md={2} xl={2} lg={2} sm={12}>
          <FormControl variant="standard" className="class-type">
            <InputLabel shrink htmlFor="filter-by-session-status">
              Filter by Session Payment Status
            </InputLabel>
            <Select
              value={payment}
              defaultValue={10}
              onChange={paymentChange}
              displayEmpty
              className="filter-class-list"
              inputProps={{ 'aria-label': 'Without label' }}
            >
              <MenuItem value={10}>All Payments</MenuItem>
              <MenuItem value={20}>Pending</MenuItem>
              <MenuItem value={30}>Processed</MenuItem>
              <MenuItem value={40}>Refunded</MenuItem>
            </Select>
          </FormControl>
        </Grid> */}
        <Grid item xs={12} md={2} xl={2} lg={2} sm={12}>
          <FormControl variant="standard" className="class-type">
            <InputLabel shrink htmlFor="filter-by-session-status">
              Filter by Session Payout Status
            </InputLabel>
            <Select
              value={formData.payout_status}
              onChange={onChange}
              name="payout_status"
              className="filter-class-list"
              inputProps={{ "aria-label": "Without label" }}
            >
              <MenuItem value={-1}>All Payouts</MenuItem>
              <MenuItem value={0}>Pending</MenuItem>
              <MenuItem value={1}>Processed</MenuItem>
              <MenuItem value={2}>Cancelled</MenuItem>
            </Select>
          </FormControl>
        </Grid>
        <Grid item xs={12} md={2} xl={2} lg={2} sm={12}>
          <FormControl variant="standard" className="class-type">
            <Button
            variant="contained"
              onClick={() => {
                setSearchButtonClicked(!searchButtonClicked);
                setCurrentPage(1);
              }}
            >
              {" "}
              Search{" "}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      <Grid container className="p-3">
        <Grid item xs={12} md={12} xl={12} lg={12} sm={12}>
          <Box
            sx={{
              backgroundColor: "#fff",
              padding: 2,
              borderRadius: 1,
            }}
          >
            {console.log(tableData)}
            {apiHit && (
              <SmartDataTable
                data={tableData}
                name="test-table"
                className="ui compact selectable table session-list-users"
                sortable
                headers={headers}
              />
            )}

            <div className="pagination-section pb-5 pt-3">
              <Pagination
                count={totalPages}
                onChange={handleChange}
                color="primary"
              />
            </div>
          </Box>
        </Grid>
      </Grid>
      <Footer />
    </>
  );
};

export default SessionsContent;
