import React,{useEffect,useState} from 'react'
import SmartDataTable from 'react-smart-data-table'
import { Typography } from "@mui/material";
import { FiEye } from "react-icons/fi";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import { Link } from 'react-router-dom';
import {getTransactions} from '../../../../actions/transactions';
import { connect } from 'react-redux';
import Pagination from '@mui/material/Pagination';
import Stack from '@mui/material/Stack';
// Import basic styling
import 'react-smart-data-table/dist/react-smart-data-table.css'

function PaymentData({getTransactions,user_id,transaction:{loadingForAllTransactions,transactionsPerPage,totalPagesForPayment}}) {
  var transactionData = []
  const [pageNumber,setPageNumber] = useState(1);
//console.log(transactionsPerPage)
  for (let i = 0; i < transactionsPerPage.length; i++) {
    if(i==0){
      transactionData = [];
    }
    let detail = transactionsPerPage[i].invoice_data;
    transactionData.push({
      _id: transactionsPerPage[i]._id,
      fullName: detail.user_name,
      description: detail.class_title,
      transactionid: transactionsPerPage[i].transaction_id,
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
    invisible: true,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <List className="recnt-usr-list" sx={{ width: '100%', bgcolor: 'background.paper' }}>
            <ListItem alignItems="center">
              <ListItemAvatar>
                <Link to="/user-details"><Avatar alt="" src="../../../../../../../images/profile-pic.png" /></Link>
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="h5"><Link to="/user-details">{value}</Link></Typography>
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
    var queryString = {
      "user_id" : user_id
    };
    getTransactions(pageNumber,queryString); 
  },[pageNumber]);
  return(
      <SmartDataTable
        data={transactionData}
        responsive={true}
        name="test-table"
        className="ui compact selectable table recent-transactions"
        sortable
        headers={headers}
        style={{ backgroundColor: '#fff' }}
        emptyTable={
          <div style={{ alignItems: "center",textAlign:"center", padding:"10px", background:"#e1e3e7" }}>
            No Record Found
          </div>
        }
      />
  );
}
const mapStateToProps = state => ({
  auth: state.auth,
  transaction : state.transactions
});

export default connect(
  mapStateToProps,
  {getTransactions }
)(PaymentData);