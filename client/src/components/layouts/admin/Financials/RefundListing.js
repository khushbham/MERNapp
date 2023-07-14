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
import { Link } from "react-router-dom";
import Grid from "@mui/material/Grid";
// import { Link } from '@mui/material';
// Import basic styling
import "react-smart-data-table/dist/react-smart-data-table.css";
import { getRefundListing } from "../../../../actions/auth";
import { useDispatch } from "react-redux";
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
import Loader from "../../loader";
import DatePicker from "react-date-picker";
import moment from "moment";

const limit = 10;
export default function RefundListing() {
  const [payoutDatalist, setPayoutData] = useState([]);
  const [tableData, setTableData] = useState([]);
  const [selectedData, setSelectedData] = useState(null);
  const [status, setStatus] = useState(1);
  const [open, setOpen] = useState(false);
  const [showAmountInput, setShowAmountInput] = useState(false);
  const [showReasonInput, setShowReasonInput] = useState(false);
  const [totalRecords, setTotalRecords] = useState(0);
  const [modalData, setModalData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [pageNumber, setPageNumber] = useState(1);
  const [payoutId, setPayoutId] = useState("");
  const [refundStatus, setRefundStatus] = useState(-1);
  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();

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
            <List className="recnt-usr-list rfnd-avtr" sx={{ width: "100%" }}>
              <ListItem alignItems="flex-start">
                <ListItemAvatar>
                  <Link to={`/user-details/${row._id}`}>
                    <Avatar alt="" src={row.image} />
                  </Link>
                </ListItemAvatar>
                <ListItemText>
                  <Typography variant="h5">
                    <Link to={`/user-details/${row._id}`}>{value}</Link>
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
    reason: {
      text: "Reason",
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
    transactionid: {
      text: "Transaction Id",
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
    refundrequest: {
      text: "Refund Request Date",
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
            <Link
              to={`/issue-refund/${row.transactionid}`}
              className="edit-userbtn"
            >
              <FiEye />
            </Link>
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
  //Search Function
  const searchFunction = (page) => {
    const passData = {
      page: page,
      refund_status: refundStatus,
      start_date: "",
      end_date: "",
      class_title_or_teacher_name: "",
      user_id: "",
    };
    var checkDateErr = checkDateDiff(startDate, endDate);
    console.log(
      new Date(startDate),
      new Date(endDate),
      "dsfsd>>>>>>>>>>",
      checkDateErr
    );
    if (checkDateErr == true) {
      alert("Start date should be greater than end date");
      return;
    } else {
      if(startDate && endDate){
        passData.start_date = moment(startDate).format("YYYY-MM-DD");
        passData.end_date = moment(endDate).format("YYYY-MM-DD");
      }
     
    }

    if (searchValue) {
      passData.class_title_or_teacher_name = searchValue;
    }
    dispatch(getRefundListing(passData))
      .then((res) => {
        try {
          if (res.success) {
            setPayoutData(res.data.records);
            setTotalRecords(res.data.totalRecords);
            let totalPagestoSet =
              Math.ceil(parseInt(res.data.totalRecords / limit)) === 0
                ? 1
                : Math.ceil(parseInt(res.data.totalRecords / limit));
            setTotalPages(totalPagestoSet);
            const listingDetial = res.data.records;
            const payoutListingArr = [];
            for (let i = 0; i < listingDetial.length; i++) {
              payoutListingArr.push({
                // image: listingDetial[i].profile_image,
                // firstName:
                //   listingDetial[i].first_name + " " + listingDetial[i].last_name,
                // class_title: listingDetial[i].class_title,
                // earning: listingDetial[i].earning,
                // _id: listingDetial[i]._id,
                image: listingDetial[i].users.profile_image,
                firstName:
                  listingDetial[i].users.first_name +
                  " " +
                  listingDetial[i].users.last_name,
                class_title: listingDetial[i].classes.class_title,
                earning: listingDetial[i].refund_amount,
                reason: listingDetial[i].reason_to_apply_refund,
                transactionid: listingDetial[i].transaction_id,
                refundrequest: listingDetial[i].created_at,
                _id: listingDetial[i].users._id,
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
    console.log("check the search value", passData);
  };


  const handleChangepage = (e, p) => {
    setPageNumber(p);
  };

  useEffect(() => {
    searchFunction(pageNumber);
  }, [pageNumber]);


  return (
    <>
    {console.log(totalPages)}
      <div className="PaymentFilter p-2">
        <Grid container className="align-items-end main-filter-area" spacing={2}>
          <Grid item xs={12} md={12} lg={12} xl={10} className="main_one_filter">
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
                    className="form-control refund_date-pickr"
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
                    className="form-control refund_date-pickr"
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
                    Refund Status
                  </InputLabel>
                  <Select
                    //value={refundstatus}
                    onChange={e => setRefundStatus(e.target.value)}
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
          <Grid item xs={12} md={3} lg={2} xl={2} className="text-enddd main_two_filter">
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
          headers={headers}
          emptyTable={<Typography>No record found!</Typography>}
          dynamic
          // emptyTable={(
          //   <Loader />
          // )}
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
      </div>
    </>
  );
}
