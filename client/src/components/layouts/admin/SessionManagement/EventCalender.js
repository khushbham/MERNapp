import React, { useState } from "react";
import FullCalendar from "@fullcalendar/react";
import dayGridPlugin from "@fullcalendar/daygrid";
import { Box } from "@mui/system";
import { getSessionsBetweenSelectedDates } from "../../../../actions/sessions";
import { connect } from "react-redux";
import Typography from "@mui/material/Typography";
import "../../../../css/admin/student.css";
import Button from "@mui/material/Button";
import { Link } from "react-router-dom";
import { AiOutlineUnorderedList } from "react-icons/ai";
import Grid from "@mui/material/Grid";
import { styled, alpha } from "@mui/material/styles";
import { Select } from "@mui/material";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import MenuItem from "@mui/material/MenuItem";
import { FiSearch } from "react-icons/fi";
const EventCalender = ({
  getSessionsBetweenSelectedDates,
  sessions: { sessionsOfSelectedDatesOfMonth },
}) => {
  const [formData, setFormData] = useState({
    page: 1,
    start_date: null,
    end_date: null,
    class_title: "",
    type_of_class: 0,
    session_progress_status: -1,
    payout_status: -1,
  });
  const Search = styled("div")(({ theme }) => ({
    position: "relative",
    borderRadius: theme.shape.borderRadius,
    backgroundColor: alpha(theme.palette.common.white, 1),
    "&:hover": {
      backgroundColor: alpha(theme.palette.common.white, 0.8),
    },
    marginRight: theme.spacing(2),
    marginLeft: 0,
    width: "100%",
    marginTop: "18px",
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
  const changeMonth = (e) => {
    console.log(formData);
    var newFormData = {};
    newFormData = formData;
    newFormData.start_date = e.startStr.split("+")[0];
    newFormData.end_date = e.endStr.split("+")[0];
    setFormData(newFormData);
    getSessionsBetweenSelectedDates(newFormData);
  };
  const onSearch = () => {
    getSessionsBetweenSelectedDates(formData);

  }
  const [SessionStatus, Session] = useState("10");
  const [SessionType, Date] = useState("10");
  const [PaymentStatus, pVal] = useState("10");
  const [PayoutStatus, poutVal] = useState("10");
  const onChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };
  return (
    <>
    <style dangerouslySetInnerHTML={{__html: "\n.Calendarwrap a {\n    color: black;\n    text-decoration: none;\n}\n" }} />
      <Grid container className="main-head-sessions p-3">
        <Grid item xs={12} md={8} xl={8} lg={8}>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <Item>
              <Typography variant="h5">Sessions Calendar</Typography>
            </Item>
            <Item>
              <Link to="/sessions" className="buttontext">
                <span>
                  <AiOutlineUnorderedList />
                </span>{" "}
                Switch to list view
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

      <Grid container className="align-items-center px-3 upper-fltr" spacing={2}>
        <Grid item xs={12} md={4} xl={4} lg={4} sm={12}>
        <FormControl variant="standard" className="search-field fieldd_search">
            <InputLabel shrink htmlFor="search">
              Search
            </InputLabel>
            <input type="text" placeholder="By class name"
                className="cls_title_info"
                onChange={onChange}
                name="class_title" />
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
              <MenuItem value={0}>Scheduled</MenuItem>
              <MenuItem value={1}>In Progress</MenuItem>
              <MenuItem value={2}>Past</MenuItem>
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
              onClick={() => onSearch()}
            >
              {" "}
              Search{" "}
            </Button>
          </FormControl>
        </Grid>
      </Grid>
      <Box sx={{ m: "13px" }}>
        <div
          className="Calendarwrap"
          style={{
            padding: "20px 10px",
            backgroundColor: "#fff",
            borderRadius: "4px",
          }}
        >
          <FullCalendar
            plugins={[dayGridPlugin]}
            initialView="dayGridMonth"
            //eventClick={()=> console.log('hii')}

            events={sessionsOfSelectedDatesOfMonth}
            datesSet={(e) => changeMonth(e)}
          />
        </div>
      </Box>
    </>
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  sessions: state.sessions,
});

export default connect(mapStateToProps, { getSessionsBetweenSelectedDates })(
  EventCalender
);
