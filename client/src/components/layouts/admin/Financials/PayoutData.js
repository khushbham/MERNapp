import React, { useEffect, useState } from "react";
import faker from "faker";
import SmartDataTable from "react-smart-data-table";
import { Pagination, Stack, Typography } from "@mui/material";
import { FiEye } from "react-icons/fi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link } from "@mui/material";
// Import basic styling
import "react-smart-data-table/dist/react-smart-data-table.css";
import {
  getPayoutDetail,
  getPayoutsRecordsCombined,
  updatePayoutStatus,
} from "../../../../actions/auth";
import { useDispatch, useSelector } from "react-redux";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";
import Modal from "@mui/material/Modal";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
import InputAdornment from "@mui/material/InputAdornment";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import OutlinedInput from "@mui/material/OutlinedInput";
import Chip from "@mui/material/Chip";
import Grid from "@mui/material/Grid";
import { styled, alpha } from "@mui/material/styles";
import InputBase from "@mui/material/InputBase";
import DatePicker from "react-date-picker";
import moment from "moment";
import { setAlert } from "../../../../actions/alert";

const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: 700,
  bgcolor: "background.paper",
  border: "2px solid #000",
  boxShadow: 24,
  p: 4,
};
export default function PayoutData() {
  const [payoutDatalist, setPayoutData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [status, setStatus] = useState(0);
  const [open, setOpen] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [modalData, setModalData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [payoutId, setPayoutId] = useState("");
  const [valueIndex, setValueIndex] = useState(null);
  const [payoutselectstatus, setPayoutSelectStatus] = React.useState("-1");
  const [values, setValues] = useState({
    amount: "",
    reason: "",
  });
  const [searchValue, setSearchValue] = useState("");
  const [payoutStatus, setPayoutStatus] = useState(0);
  const [startDate, setStartDate] = useState("");
  const [endDate, setEndDate] = useState("");
  const handleChange = (e) => {
    setStatus(e.target.value);
    const CheckVal = e.target.value;
    setPayoutStatus(CheckVal);
    switch (CheckVal) {
      case 1:
        setShowAmountInput(true);
        setShowReasonInput(true);
        break;
      case 2:
        setShowAmountInput(false);
        setShowReasonInput(true);
        break;
      default:
        setShowAmountInput(false);
        setShowReasonInput(false);
        break;
    }
  };
  const handleOpen = (index, i) => {
    setPayoutId(index);
    getModalData(index);
    setValueIndex(i);
    setOpen(true);
  };

  const handleClose = () => setOpen(false);
  const headers = {
    image: {
      text: "image",
      invisible: true,
    },
    firstName: {
      text: "User / Image",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, key, row) => {
        return (
          <>
            <List className="recnt-usr-list" sx={{ width: "100%" }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Link href="/user-details">
                    <Avatar alt="" src={row.image} />
                  </Link>
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h5">
                    <a href={`/user-details/${row.user_id}`}>
                      <Link>{value}</Link>
                    </a>
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </>
        );
      },
    },
    class_title: {
      text: "Class Title",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p style={{ marginBottom: "0px" }}>{value}</p>
          </>
        );
      },
    },
    payout_start_date: {
      text: "Payout Eligibility Date",
      invisible: false,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    earning: {
      text: "Amount",
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
      text: "Action",
      invisible: false,
      sortable: false,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <Button
              onClick={() => {
                handleOpen(value, index);
              }}
              className="edit-userbtn"
            >
              <FiEye />
            </Button>
          </>
        );
      },
    },
  };
  const checkDateDiff = (start, end) => {
    if (start && end) {
      if (moment(start).isSameOrAfter(moment(end))) {
        return true;
      }
    }
    return false;
  };
  const dispatch = useDispatch();
  //search function
  const searchFunction = (page) => {
    const passData = {
      page: page,
      payout_status: "",
      start_date: "",
      end_date: "",
      class_title_or_teacher_name: "",
      user_id: "",
      session_id: "",
    };
    if (startDate !== "" && endDate !== "") {
      var checkDateErr = checkDateDiff(startDate, endDate);
      if (checkDateErr == true) {
        alert("Start date should be greater than end date");
        return;
      } else {
        passData.start_date = moment(startDate).format("YYYY-MM-DD");
        passData.end_date = moment(endDate).format("YYYY-MM-DD");
      }
    }

    if (searchValue) {
      passData.class_title_or_teacher_name = searchValue;
    }
    if (payoutselectstatus >= 0) {
      passData.payout_status = payoutselectstatus;
    }
    dispatch(getPayoutsRecordsCombined(passData))
      .then((res) => {
        try {
          if (res.success) {
            setPayoutData(res.data.records);
            setTotalRecords(res.data.totalRecords);
            let totalPagestoSet =
              Math.floor(parseInt(res.data.totalRecords / 10)) === 0
                ? 1
                : Math.floor(parseInt(res.data.totalRecords / 10));
            setTotalPages(totalPagestoSet);
            const listingDetial = res.data.records;
            const payoutListingArr = [];
            for (let i = 0; i < listingDetial.length; i++) {
              payoutListingArr.push({
                image: listingDetial[i].profile_image,
                firstName:
                  listingDetial[i].first_name +
                  " " +
                  listingDetial[i].last_name,
                class_title: listingDetial[i].class_title,
                payout_start_date:
                  listingDetial[i].payout_start_date.split("T")[0],
                earning: listingDetial[i].earning,
                _id: listingDetial[i]._id,
                user_id: listingDetial[i].teacher_id,
              });
            }
            setTableData(payoutListingArr);
          } else {
            console.log("simple err", res);
          }
        } catch (error) {
          console.log("errr", error);
        }
      })
      .catch((err) => console.log("errr", err));
    console.log("check the search valu e", passData);
  };

  const handleChangepage = (e, p) => {
    setPageNumber(p);
  };

  function classStatus(progress_status) {
    if (progress_status == 0) return "Pending";
    if (progress_status == 1) return "Start";
    if (progress_status == 2) return "Completed";
    if (progress_status == 3) return "Cancelled";
  }

  //const get modal data
  const getModalData = (dataId) => {
    dispatch(getPayoutDetail(dataId))
      .then((res) => {
        console.log("simple payout status", res.data);
        if (res.success) {
          setModalData(res.data);
        } else {
          console.log("api err", res);
        }
      })
      .catch((err) => console.log("modal api err ", err));
  };
  //update the payment status
  const updatePayoutStatusAPI = () => {
    let userRole = localStorage.getItem("UserRole");
    let passTheRole = userRole == 3 ? 2 : 1;
    // admin_type, // if user role is 3 send 2 else defult 1
    let classId = payoutDatalist[valueIndex].class_id;
    const form = {
      payout_id: payoutId,
      admin_type: passTheRole,
      payout_status: payoutStatus,
      class_id: classId,
      payout_feedback: values.reason,
      paid_amount: payoutStatus == 1 ? values.amount : 0,
    };
    if (!values.reason) {
      alert("Payout feedback is required");
    }else if(values.amount <= 0){
      alert("Amount is required and must be greater than zero");
    }else if(values.amount > modalData[0].earning){
      alert('Amount should not be more than Total Payout Amount');
    }else{
       dispatch(updatePayoutStatus(form))
      .then((result) => {
        if (result.success) {
          setTimeout(function () {
            setOpen(false);
          }, 1500);
          setValues({
            amount: "",
            reason: "",
          });
        } else {
          console.log("err", result);
        }
        console.log("api done ", result);
      })
      .catch((err) => console.log("err", err));
    }
    // dispatch(updatePayoutStatus(form))
    //   .then((result) => {
    //     if (result.success) {
    //       setTimeout(function () {
    //         setOpen(false);
    //       }, 1500);
    //       setValues({
    //         amount: "",
    //         reason: "",
    //       });
    //     } else {
    //       console.log("err", result);
    //     }
    //     console.log("api done ", result);
    //   })
    //   .catch((err) => console.log("err", err));
  };

  useEffect(() => {
    searchFunction(pageNumber);
  }, [pageNumber]);

  const handleChangeValueInput = (prop) => (event) => {
    setValues({ ...values, [prop]: event.target.value });
  };

  const payoutselecthandleChange = (event) => {
    setPayoutSelectStatus(event.target.value);
  };

  return (
    <>
      <div className="PaymentFilter p-2">
        <Grid
          container
          className="align-items-end main-filter-area"
          spacing={2}
        >
          <Grid
            item
            xs={12}
            md={12}
            lg={12}
            xl={10}
            className="main_one_filter"
          >
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControl
                  variant="standard"
                  className="w-100 pl-2 fieldsWrap"
                >
                  <InputLabel shrink htmlFor="search">
                    Search
                  </InputLabel>
                  <input
                    className="w-100 search--Field payout_search"
                    placeholder="By user or transacion ID"
                    inputprops={{ "aria-label": "search" }}
                    name="keyword"
                    value={searchValue}
                    onChange={(e) => setSearchValue(e.target.value)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={2}>
                <FormControl variant="standard" className="w-100 date-filter">
                  <InputLabel shrink htmlFor="Filter by Start Date">
                    Filter by Start Date
                  </InputLabel>
                  <DatePicker
                    className="form-control date-pickr"
                    format="MM-dd-y"
                    onChange={(e) => {
                      setStartDate(e);
                    }}
                    value={startDate}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={2}>
                <FormControl variant="standard" className="w-100 date-filter">
                  <InputLabel shrink htmlFor="Filter by End Date">
                    Filter by End Date
                  </InputLabel>
                  <DatePicker
                    className="form-control date-pickr"
                    format="MM-dd-y"
                    onChange={(e) => {
                      setEndDate(e);
                    }}
                    value={endDate}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={2}>
                <FormControl className="w-100 refund_status">
                  <InputLabel shrink htmlFor="refund_status_label">
                    Payout Status
                  </InputLabel>
                  <Select
                    value={payoutselectstatus}
                    onChange={payoutselecthandleChange}
                    className="status_refund_listing"
                  >
                    <MenuItem value={0}>Pending</MenuItem>
                    <MenuItem value={1}>Processed</MenuItem>
                    <MenuItem value={2}>Cancel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
            </Grid>
          </Grid>
          <Grid
            item
            xs={12}
            sm={12}
            md={6}
            lg={6}
            xl={2}
            className="text-enddd main_two_filter"
          >
            <Button
              variant="contained"
              className="Search_fltr"
              onClick={(e) => searchFunction(1)}
            >
              Search
            </Button>
          </Grid>
          {/* <Grid item xs={2} md={2} lg={1} className="text-enddd">
            <Button variant="contained" className="ExportBtn">Export as .CSV</Button> 
        </Grid> */}
        </Grid>
      </div>
      <div style={{ backgroundColor: "#fff", padding: "10px 15px" }}>
        <SmartDataTable
          data={tableData}
          responsive={true}
          name="test-table"
          className="ui compact selectable table recent-transactions"
          sortable
          orderedHeaders={[
            "firstName",
            "class_title",
            "payout_start_date",
            "earning",
          ]}
          headers={headers}
          dynamic
          emptyTable={<Typography>No record found!</Typography>}
          style={{ backgroundColor: "#fff" }}
        />

        {tableData.length != 0 && (
          <div className="PaginationWrap pb-5">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                onChange={handleChangepage}
                color="primary"
                style={{ textAlign: "center" }}
              />
            </Stack>
          </div>
        )}

        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="modal-modal-title"
          aria-describedby="modal-modal-description"
        >
          <Box sx={style}>
            <Typography id="modal-modal-title" variant="h6" component="h2">
              Payout Detail
            </Typography>
            <Typography id="modal-modal-description" sx={{ mt: 2 }}>
              <Box>
                {modalData.length > 0 ? (
                  <>
                    <ul>
                      <li>Class title - {modalData[0].class_title}</li>
                      <li>
                        Session type -{" "}
                        {modalData[0].session_type == 2 ? "Online" : "Local"}
                      </li>
                      <li>
                        Per student enrollment fee - ${modalData[0].class_price}{" "}
                      </li>
                      <li>
                        Total enrollments - {modalData[0].booked_by.length}
                      </li>
                      <li>
                        Total amount paid by students - $
                        {modalData[0].total_amount}
                      </li>
                      <li>
                        Platform fee - {modalData[0].platform_fee_percentage}%{" "}
                      </li>
                      <li>Total payout amount - {modalData[0].earning} </li>
                    </ul>
                    <Typography variant="h5" component="h2">
                      All Sessions Details
                    </Typography>
                    <TableContainer component={Paper}>
                      <Table sx={{ minWidth: 440 }} aria-label="simple table">
                        <TableHead>
                          <TableRow>
                            <TableCell>Sno</TableCell>
                            <TableCell align="left">Session Name</TableCell>
                            <TableCell align="left">Session Status</TableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {modalData[0]?.class_details.length > 0 &&
                            modalData[0]?.class_details.map((cd, key) => {
                              return (
                                <>
                                  <TableRow
                                    sx={{
                                      "&:last-child td, &:last-child th": {
                                        border: 0,
                                      },
                                    }}
                                  >
                                    <TableCell component="th" scope="row">
                                      {key + 1}
                                    </TableCell>
                                    <TableCell align="left">
                                      {cd.class_title}
                                    </TableCell>
                                    <TableCell align="left">
                                      <Chip
                                        label={classStatus(
                                          cd.session_progress_status
                                        )}
                                      />
                                    </TableCell>
                                  </TableRow>
                                </>
                              );
                            })}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </>
                ) : (
                  <>loading ...</>
                )}
              </Box>
            </Typography>
            <br />
            {modalData[0]?.payout_status == 0 ? (
              <>
                <FormControl fullWidth id="margin-none">
                  <InputLabel id="demo-simple-select-label">
                    Payout Status
                  </InputLabel>
                  <Select
                    labelId="demo-simple-select-label"
                    id="demo-simple-select"
                    value={status}
                    name="payoutStatus"
                    label="Payout Status"
                    onChange={(e) => {
                      handleChange(e);
                    }}
                  >
                    <MenuItem value={0}>Pending</MenuItem>
                    <MenuItem value={1}>Processed</MenuItem>
                    <MenuItem value={2}>Cancelled</MenuItem>
                  </Select>
                </FormControl>
                {showAmountInput && (
                  <>
                    <FormControl fullWidth style={{ margin: "20px 0px" }}>
                      <InputLabel htmlFor="outlined-adornment-amount">
                        Amount
                      </InputLabel>
                      <OutlinedInput
                        name="amount"
                        id="outlined-number"
                        type="number"
                        value={values.amount}
                        onChange={handleChangeValueInput("amount")}
                        startAdornment={
                          <InputAdornment position="start">$</InputAdornment>
                        }
                        label="Amount"
                      />
                    </FormControl>
                  </>
                )}
                {showReasonInput && (
                  <TextField
                    style={{ margin: "20px 0px", flex: 1 }}
                    fullWidth
                    id="fullWidth"
                    label="Payout feedback"
                    variant="outlined"
                    name="reason"
                    value={values.reason}
                    onChange={handleChangeValueInput("reason")}
                  />
                )}
                <br />
                {modalData[0]?.payout_status == 0 ? (
                  <>
                    <Button
                      style={{ flex: 1, float: "right", margin: "20px 0px" }}
                      onClick={() => updatePayoutStatusAPI()}
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </>
                ) : (
                  <>
                    <Button
                      style={{ flex: 1, float: "right", margin: "20px 0px" }}
                      onClick={() => updatePayoutStatusAPI()}
                      disabled
                      variant="contained"
                    >
                      Submit
                    </Button>
                  </>
                )}
              </>
            ) : (
              <div className="alert alert-success mt-3">
                Payout request already marked as{" "}
                {modalData[0]?.payout_status == 1 ? (
                  <>
                    Processed with amount of <b>{modalData[0]?.paid_amount}</b>
                  </>
                ) : (
                  <>
                    Cancelled with a reason of{" "}
                    <b>{modalData[0]?.payout_feedback}</b>
                  </>
                )}
              </div>
            )}
          </Box>
        </Modal>
      </div>
    </>
  );
}
