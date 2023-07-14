import React from 'react'
import faker from 'faker'
import SmartDataTable from 'react-smart-data-table'
import { FiEye } from "react-icons/fi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
import Typography from "@mui/material/Typography";
import moment from 'moment';
// Import basic styling
import 'react-smart-data-table/dist/react-smart-data-table.css'
import { Link } from "react-router-dom";

export default function Reports(props) {
  const {reports} = props
  const testTransactData = []
  const numTransactResults = 1
for (let i = 0; i < numTransactResults; i++) {
  reports?.reportDeatils?.map((value)=>{
   return testTransactData.push({
      fullName: value.first_name+ ' ' + value.last_name,
      profile_image: value.profile_image,
      user_id:value._id,
      report_title: reports?.report_title,
      report_description: reports?.report_description,
      datetime: reports?.createdAt,
    })
  })
  
}
const headers = {
  profile_image: {
    text: "Profile Image",
    invisible: true,
  },
  user_id: {
    text: "User ID",
    invisible: true,
  },
  fullName: {
    text: 'Student',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
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
              <Link to={`/user-details/${row.user_id}`} style={{textDecoration:'none' , color:'black'}}>{value}</Link>
            </Typography>
            {/* <Typography variant="fntEleven">test@gmail.com </Typography> */}
          </ListItemText>
        </ListItem>
      </List>
      )
    },
  },
  report_title: {
    text: 'Title',
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
          <p>{moment.utc(value).format('DD-MM-yyyy HH:mm:ss')}</p>
        </>
      )
    },
  },
  report_description: {
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
  // status: {
  //   text: 'Payment Status',
  //   invisible: false,
  //   sortable: true,
  //   filterable: true,
  //   transform: (value, index, row) => {
  //     return (
  //       <>
  //         <p>{value}</p>
  //       </>
  //     )
  //   },
  // },
  // action: {
  //   text: 'Action',
  //   invisible: false,
  //   sortable: false,
  //   filterable: true,
  //   transform: (value, index, row) => {
  //     return (
  //       <>
  //         <Link to="/invoice-details/1" className="edit-userbtn"><FiEye /></Link>
  //       </>
  //     )
  //   },
  // },
}
  return (
    <SmartDataTable
      data={testTransactData}
      responsive={true}
      name="test-table"
      className="ui compact selectable table sess-payments mt-3"
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