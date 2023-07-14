import React from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Input from "@mui/material/Input";
import InputLabel from "@mui/material/InputLabel";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import Radio from "@mui/material/Radio";
import RadioGroup from "@mui/material/RadioGroup";
import FormControlLabel from "@mui/material/FormControlLabel";
import FormLabel from "@mui/material/FormLabel";
import FormControl from "@mui/material/FormControl";
import { FiSearch } from "react-icons/fi";
import moment from "moment";
import { Link } from "react-router-dom";
//import Navbar from "../../Navbar";
import Modal from "@mui/material/Modal";
import Button from "@mui/material/Button";
import PropTypes from "prop-types";
import { IoClose, IoSearch } from "react-icons/io5";
import { styled } from "@mui/material/styles";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";

const PayoutDialog = styled(Dialog)(({ theme }) => ({
  "& .MuiDialogContent-root": {
    padding: theme.spacing(2),
  },
  "& .MuiDialogActions-root": {
    padding: theme.spacing(1),
  },
}));

const PayoutDialogTitle = (props) => {
  const { children, onClose, ...other } = props;

  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
      {children}
      {onClose ? (
        <IconButton
          aria-label="close"
          onClick={onClose}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
            color: (theme) => theme.palette.grey[500],
          }}
        >
          <IoClose />
        </IconButton>
      ) : //   <Button className="close_payout_option" variant="outlined"onClick={onClose}><IoClose /></Button>
      null}
    </DialogTitle>
  );
};

PayoutDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

const PayoutFilter = (props) => {
  const {
    getPayouts,
    settime_selected,
    setpayout_status,
    setstart_date,
    setend_date,
    time_selected,
    start_date,
    end_date,
  } = props;
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [modalopen, setModalOpen] = React.useState(false);

  const handleClickOpen = () => {
    setModalOpen(true);
  };
  const handlemodalClose = () => {
    setModalOpen(false);
  };

  const dates = ["All", "This Year", "This Month", "Set date"];

  const payoutStatus = ["Pending", "Processed", "Cancelled"];

  const onSubmit = () => {
    getPayouts();
    setModalOpen(false);
  };

  const checkDateDiff = (start, end) => {
    if (start && end) {
      if (moment(start).isSameOrAfter(moment(end))) {
        return true;
      }
    }
    return false;
  };

  const handleEndDateInputChange = (e) => {
    if (e.target.name == "end_class_date") {
      var checkDateErr = checkDateDiff(start_date, e.target.value);
      if (checkDateErr == true) {
        alert("Class Date should be greater than Previous class Date");
        return;
      } else {
        console.log("no error" , checkDateErr);
        setend_date(e.target.value);
      }
    } 
    if (e.target.name == "start_class_date" && !end_date == "") {
      var checkDateErr = checkDateDiff(e.target.value, end_date);
      if (checkDateErr == true) {
        alert("Class Date should be greater than Previous class Date");
        return;
      } else {
        console.log("no error" , checkDateErr);
      }
    }
    if (e.target.name == "start_class_date") {
      setstart_date(e.target.value);
    }
  };
  return (
    <Box>
      {/* <Navbar /> */}

      <IconButton
        className="payout_search_button"
        variant="outlined"
        onClick={handleClickOpen}
      >
        <IoSearch />
      </IconButton>
      <PayoutDialog
        onClose={handleClose}
        aria-labelledby="customized-dialog-title"
        open={modalopen}
      >
        <PayoutDialogTitle
          id="customized-dialog-title"
          onClose={handlemodalClose}
        >
          Filter payouts
        </PayoutDialogTitle>
        <DialogContent dividers>
          {/* <Container> */}
          <Grid container>
            <Grid
              item
              lg={12}
              md={12}
              sm={12}
              className="payout_stepsContentWrapper"
            >
              {/* <Box className="payout_searchFilter">
                <Typography className="payout_filerheadingg">Search</Typography>
                <Grid container>
                  <Grid item lg={12} md={12} sm={12} xs={12}>
                    <FormControl
                      variant="standard"
                      className="w-100 payout_searchFields"
                    >
                      <Input
                        id="input-with-icon-adornment"
                        type="search"
                        className="w-100"
                        placeholder="Student name or class name"
                        startAdornment={
                          <InputAdornment position="start">
                            <FiSearch />
                          </InputAdornment>
                        }
                      />
                    </FormControl>
                  </Grid>
                </Grid>
              </Box> */}

              <Box className="payout_searchFilter">
                <Typography className="FilerHeadingg">Date</Typography>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    {dates?.map((res, i) => {
                      return (
                        <label for={res} className="filterLabel">
                          <input
                            type="radio"
                            name="radio-group1"
                            className="filterData"
                            id={res}
                            value={i}
                            onChange={(e) => settime_selected(e.target.value)}
                          />
                          <Box className="payout_filterText">{res}</Box>
                        </label>
                      );
                    })}

                    {/* <label for="featured2" className="filterLabel">
                      <input
                        type="radio"
                        id="featured2"
                        name="radio-group"
                        className="filterData"
                      />
                      <Box className="payout_filterText"> This Year</Box>
                    </label>
                    <label for="featured3" className="filterLabel">
                      <input
                        type="radio"
                        id="featured3"
                        name="radio-group"
                        className="filterData"
                      />
                      <Box className="payout_filterText">This Month</Box>
                    </label>
                    <label for="featured4" className="filterLabel">
                      <input
                        type="radio"
                        id="featured4"
                        name="radio-group"
                        className="filterData"
                      />
                      <Box className="payout_filterText">Set date </Box>
                    </label> */}
                  </RadioGroup>
                </FormControl>
              </Box>
              {time_selected == 3 ? (
                <Box className="payout_searchFilter">
                  <FormControl variant="standard" className="w-100 my-2">
                    <InputLabel
                      shrink
                      htmlFor="student-name"
                      className="studentNameLabel"
                    >
                      Start Class Date
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      name="start_class_date"
                      type="date"
                      placeholder="Please Select"
                      className="StepsFields date_fields_hover"
                      value={start_date}
                      onChange={(e) => handleEndDateInputChange(e)}
                    />
                  </FormControl>
                  <FormControl variant="standard" className="w-100 my-2">
                    <InputLabel
                      shrink
                      htmlFor="student-name"
                      className="studentNameLabel"
                    >
                      End Class Date
                    </InputLabel>
                    <TextField
                      sx={{ mb: 1 }}
                      required
                      fullWidth
                      name="end_class_date"
                      id="name"
                      type="date"
                      variant="standard"
                      placeholder="Please Select"
                      className="StepsFields date_fields_hover"
                      value={end_date}
                      onChange={(e) => handleEndDateInputChange(e)}
                    />
                  </FormControl>
                </Box>
              ) : (
                ""
              )}
              <Box className="payout_searchFilter">
                <Typography className="FilerHeadingg">Payout Status</Typography>
                <FormControl>
                  <RadioGroup
                    row
                    aria-labelledby="demo-row-radio-buttons-group-label"
                    name="row-radio-buttons-group"
                  >
                    {payoutStatus?.map((res, i) => {
                      return (
                        <label for={res} className="filterLabel pt-3 pb-3">
                          <input
                            type="radio"
                            name="radio-group"
                            className="filterData"
                            id={res}
                            value={i}
                            onChange={(e) => setpayout_status(e.target.value)}
                          />
                          <Box className="payout_filterText">{res}</Box>
                        </label>
                      );
                    })}
                    {/* <label for="status2" className="filterLabel pt-3 pb-3">
                      <input
                        type="radio"
                        id="status2"
                        name="radio-group"
                        className="filterData"
                      />
                      <Box className="payout_filterText"> Pending</Box>
                    </label>
                     <label for="status3" className="filterLabel pt-3 pb-3">
                      <input
                        type="radio"
                        id="status3"
                        name="radio-group"
                        className="filterData"
                      />
                      <Box className="payout_filterText">Processed</Box>
                    </label>
                    <label for="status4" className="filterLabel pt-3 pb-3">
                      <input
                        type="radio"
                        id="status4"
                        name="radio-group"
                        className="filterData"
                      />
                      <Box className="payout_filterText">Refunded</Box>
                    </label> */}
                  </RadioGroup>
                </FormControl>
              </Box>
              <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12}>
                  <Button
                    className="sessionBtn_pay "
                    onClick={() => onSubmit()}
                  >
                    Show Results
                  </Button>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </DialogContent>
      </PayoutDialog>
    </Box>
  );
};

export default PayoutFilter;
