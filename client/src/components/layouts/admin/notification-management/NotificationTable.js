import React, { useState,useEffect } from 'react';
import faker from "faker";
import SmartDataTable from "react-smart-data-table";
import { Typography } from "@mui/material";
import { FiEdit, FiXCircle } from "react-icons/fi";
import InputLabel from '@mui/material/InputLabel';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Switch from '@mui/material/Switch';
import "react-smart-data-table/dist/react-smart-data-table.css";
import { Box } from "@mui/system";
import { connect } from 'react-redux';


function NotificationTable({sessions: {emailTemplatesArray},updateEmailTemplatesList }) {
  const userNotificationsData = [];
  const notification_titles = emailTemplatesArray;

  for (let i = 0; i < notification_titles.length; i++) {
    if(notification_titles[i].notification_type == 1){
      userNotificationsData.push({
        _id: notification_titles[i]._id,
        notification_title: notification_titles[i].notification_title,
        notification_status: notification_titles[i].notification_status
        //sendgrid: faker.datatype.number(),
      });
    }
    
  }

  const [notify, setNotify] = React.useState('');

  const notifyChange = (event) => {
    setNotify(event.target.value);
  };
  
  const headers = {
    _id: {
      text: "ID",
      invisible: true,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <div>
              <p>{value}</p>
            </div>
          </>
        );
      },
    },
    notification_title: {
      text: "When",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <div>
              <p>{value}</p>
            </div>
          </>
        );
      },
    },
    // sendgrid: {
    //   text: "Send this SendGrid template",
    //   invisible: false,
    //   sortable: true,
    //   filterable: true,
    //   transform: (value, index, row) => {
    //     return (
    //       <>
    //         <div className="slct-sndgrd">
    //           <FormControl fullWidth>
    //             <Select
    //               labelId="notify-select-label"
    //               id="notify-select"
    //               value={notify}
    //               onChange={notifyChange}>
    //               <MenuItem value={10}>Password Reset</MenuItem>
    //               <MenuItem value={20}>Welcome Template</MenuItem>
    //               <MenuItem value={30}>User status chage</MenuItem>
    //               <MenuItem value={40}>User archived</MenuItem>
    //             </Select>
    //           </FormControl>
    //         </div>
    //       </>
    //     );
    //   },
    // },
    notification_status: {
      text: "Manage",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>

            <Switch defaultChecked={value} onClick={() => updateEmailTemplatesList(row)} />
          </>
        );
      },
    },
  };
  return (
    <SmartDataTable
      data={userNotificationsData}
      name="test-table"
      className="ui compact selectable table notification-table"
      sortable
      headers={headers}
    />
  );
}
const mapStateToProps = state => ({
  auth: state.auth,
  sessions : state.sessions
});

export default connect(
  mapStateToProps,
  { }
)(NotificationTable);