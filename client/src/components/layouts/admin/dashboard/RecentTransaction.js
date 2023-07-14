import React,{useEffect} from 'react'
import faker from 'faker'
import SmartDataTable from 'react-smart-data-table'
import { Typography } from "@mui/material";
import { FiEye } from "react-icons/fi";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import {dashboardTransactions} from '../../../../actions/auth';
import { connect } from 'react-redux';

// Import basic styling
import 'react-smart-data-table/dist/react-smart-data-table.css'
import { Box } from '@mui/system';

function RecentTransaction({dashboardTransactions,auth:{loadTransactionsForDashboard,dashboardTransaction}}) {
  var transactionData = []

for (let i = 0; i < dashboardTransaction.length; i++) {
  if(i==0){
    transactionData = [];
  }
  let detail = dashboardTransaction[i].invoice_data;
  transactionData.push({
     _id: dashboardTransaction[i]._id,
    fullName: detail.user_name,
    description: detail.class_title,
    transactionid: dashboardTransaction[i].transaction_id,
    datetime: detail.billing_date,
    amount: detail.class_price,
    status: "Processed",
    // 'email': faker.internet.email(),
    // phone_number: faker.phone.phoneNumber()
  })
}
const headers = {
  _id: {
    text: 'Transaction Number',
    invisible: true
  },
  fullName: {
    text: 'User / Email',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <List className="recnt-usr-list" sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ListItem alignItems="center">
              <ListItemAvatar>
                <Avatar alt="" src="../../../../../../../images/profile-pic.png" />
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="h5">{value}</Typography>
              </ListItemText>
            </ListItem>
          </List>
        </>
      )
    },
  },
  description: {
    text: 'Description',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <p>{value}</p>
        </>
      )
    },
  },
  transactionid: {
    text: 'Transaction ID',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <p>{value}</p>
        </>
      )
    },
  },
  datetime: {
    text: 'Date and Time',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <p>{value}</p>
        </>
      )
    },
  },
  amount: {
    text: 'Amount',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <p>{value}</p>
        </>
      )
    },
  },
  status: {
    text: 'Status',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <p>{value}</p>
        </>
      )
    },
  },
  action: {
    text: 'Action',
    invisible: false,
    sortable: false,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <Link to={`/invoice-details/${row._id}`} className="edit-userbtn"><FiEye /></Link>
        </>
      )
    },
  },
}
  useEffect(() => {
    dashboardTransactions(); 
  },[]);
  return(
    <>
    {console.log(dashboardTransaction)}
    <SmartDataTable
      data={transactionData}
      responsive={true}
      name="test-table"
      className="ui compact selectable table recent-transactions"
      sortable
      headers={headers}
    />
    </>
  );
}
const mapStateToProps = state => ({
  auth: state.auth
});

export default connect(
  mapStateToProps,
  {dashboardTransactions }
)(RecentTransaction);