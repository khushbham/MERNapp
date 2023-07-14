import React, { useEffect, useState } from "react";
import SmartDataTable from "react-smart-data-table";
import { Typography } from "@mui/material";
import { FiEye } from "react-icons/fi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import { Link } from "react-router-dom";
import { getTransactions } from "../../../../actions/transactions";
import { connect } from "react-redux";
import Pagination from "@mui/material/Pagination";
import Stack from "@mui/material/Stack";
import Select from "@mui/material/Select";
import MenuItem from "@mui/material/MenuItem";
import "../../../../css/admin/student.css";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import FormControl from "@mui/material/FormControl";
import InputLabel from "@mui/material/InputLabel";
import DatePicker from "react-date-picker";
// Import basic styling
import "react-smart-data-table/dist/react-smart-data-table.css";

function PaymentData({ getTransactions }) {
  const [pageNumber, setPageNumber] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [transactionData, setTransactionData] = useState([]);
  //console.log(transactionsPerPage)
  //const [searchButtonClicked, setSearchButtonClicked] = useState(false);
  const headers = {
    _id: {
      text: "Transaction Number",
      invisible: true,
    },
    profile_image: {
      text: "Profile Link",
      invisible: true,
    },
    user_id:{
      text: "User ID",
      invisible: true,
    },
    fullName: {
      text: "User / Email",
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
                  <a href={`/user-details/${row.user_id}`}>
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
                    <a href={`/user-details/${row.user_id}`}>{value}</a>
                  </Typography>
                </ListItemText>
              </ListItem>
            </List>
          </>
        );
      },
    },
    description: {
      text: "Description",
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
      text: "Transaction ID",
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
    amount: {
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
            <Link to={`/invoice-details/${row._id}`} className="edit-userbtn">
              <FiEye />
            </Link>
          </>
        );
      },
    },
  };
  const [username, setUsername] = React.useState("");
  const [sheetData, setSheetData] = React.useState([]);

  const [searchValue, setSearchValue] = useState("");
  const [startDate, setStartDate] = useState();
  const [endDate, setEndDate] = useState();


  const handleChange = (e, p) => {
    setPageNumber(p);
  };
  useEffect(() => {
    var end_date = null;
    if (endDate && !startDate) {
      alert("Please select start date.");
      setEndDate();
    } else {
      if (startDate && !endDate) {
        end_date = new Date();
      } else if (startDate && endDate) {
        end_date = endDate;
      }
      var queryString = {
        username: username,
        start_date: startDate,
        end_date: end_date,
      };
      getTransactions(pageNumber, queryString).then((res) => {
        if (res.success) {
          setTotalPages(res.totalTransactions);
          var newDataArray = [];
          for (let i = 0; i < res.data.length; i++) {
            let detail = res.data[i].invoice_data;
            newDataArray.push({
              _id: res.data[i]._id,
              fullName:
                res.data[i].user_id.first_name +
                " " +
                res.data[i].user_id.last_name,
              profile_image: res.data[i].user_id.profile_image,
              user_id: res.data[i].user_id._id,
              description: detail.class_title,
              transactionid: res.data[i].transaction_id,
              datetime: detail.billing_date,
              amount: detail.class_price,
              status: "Processed",
              // 'email': faker.internet.email(),
              // phone_number: faker.phone.phoneNumber()
            });
          }
          setTransactionData(newDataArray);
        }
      });
    }
  }, [pageNumber, username, startDate, endDate]);

const [allstatus, setAllStatus] = React.useState("0");

const statusAllhandleChange = (event) => {
  setAllStatus(event.target.value);
  };
  return (
    <>
      <div className="PaymentFilter p-2">
        <Grid container className="align-items-end main-filter-area" spacing={2}>
          <Grid item xs={12} md={12} lg={12} xl={10} className="main_one_filter">
            <Grid container>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={6}>
                <FormControl
                  variant="standard"
                  className="w-100 pl-2 fieldsWrap tag-frm-cntrl"
                >
                  <InputLabel shrink htmlFor="search">
                    Search
                  </InputLabel>
                  <input
                    className="w-100 search--Field payout_search"
                    placeholder="By user or transacion ID"
                    inputprops={{ "aria-label": "search" }}
                    onChange={(e) => {
                      setUsername(e.target.value);
                      setPageNumber(1);
                    }}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
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
              <Grid item xs={12} sm={12} md={6} lg={6} xl={3}>
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
            </Grid>
          </Grid>
          {/* {transactionData.length > 0 && (
            <Grid item xs={2} md={2} lg={2} className="text-end">
              <CSVLink data={transactionData} filename={"Payment Records"} className='PaymentRecords'>
                <Button variant="contained" className="ExportBtn me-3">
                  Export as .CSV
                </Button>
              </CSVLink>
            </Grid>
          )} */}
        </Grid>
      </div>
      <div style={{ backgroundColor: "#fff", padding: "10px 15px" }}>
        <SmartDataTable
          data={transactionData}
          responsive={true}
          name="test-table"
          className="ui compact selectable table recent-transactions"
          sortable
          headers={headers}
          style={{ backgroundColor: "#fff" }}
          emptyTable={
            <div style={{ alignItems: "center", textAlign: "center" }}>
              No Record Found
            </div>
          }
        />
        {totalPages != 0 && (
          <div className="PaginationWrap pb-5">
            <Stack spacing={2}>
              <Pagination
                count={totalPages}
                onChange={handleChange}
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
const mapStateToProps = (state) => ({
  auth: state.auth,
  transaction: state.transactions,
});

export default connect(mapStateToProps, { getTransactions })(PaymentData);
