import React from 'react';
import SmartDataTable from "react-smart-data-table";
import { connect } from 'react-redux';
import Switch from '@mui/material/Switch';
import "react-smart-data-table/dist/react-smart-data-table.css";

function AdminNotificationTable({sessions: {emailTemplatesArray},updateEmailTemplatesList}) {
  
const adminNotificationsData = [];
const admin_notification_titles = emailTemplatesArray
for (let i = 0; i < admin_notification_titles.length; i++) {
  if(admin_notification_titles[i].notification_type == 2){
    adminNotificationsData.push({
      _id: admin_notification_titles[i]._id,
      notification_title: admin_notification_titles[i].notification_title,
      notification_status: admin_notification_titles[i].notification_status
      //sendgrid: faker.datatype.number(),
    });
  }
  
}
  const [notify, setNotify] = React.useState('10');

  const notifyChange = (event) => {
    setNotify(event.target.value);
  };
  const headers = {
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
    //               placeholder='Select Template'
    //               value={notify}
    //               onChange={notifyChange}>
    //               <MenuItem value={20}>Second Option</MenuItem>
    //             </Select>
    //           </FormControl>
    //         </div>
    //       </>
    //     );
    //   },
    // },
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
    notification_status: {
      text: "Manage",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <Switch defaultChecked={value} onClick={() => updateEmailTemplatesList(row)}/>
          </>
        );
      },
    },
  };
  return (
    <SmartDataTable
      data={adminNotificationsData}
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
)(AdminNotificationTable);