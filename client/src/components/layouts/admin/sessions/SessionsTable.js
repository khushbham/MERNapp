import React from 'react'
import faker from 'faker'
import SmartDataTable from 'react-smart-data-table'
import { Typography } from "@mui/material";
import { FiEdit, FiXCircle } from "react-icons/fi";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemText from '@mui/material/ListItemText';
import ListItemAvatar from '@mui/material/ListItemAvatar';
import Avatar from '@mui/material/Avatar';
import AvatarGroup from '@mui/material/AvatarGroup';
// import { Link } from '@mui/material';
import { Link } from "react-router-dom";
import Box from '@mui/material/Box';
import Pagination from '@mui/material/Pagination';
import 'react-smart-data-table/dist/react-smart-data-table.css';
import ClassDetailsPopup from './ClassDetailsPopup';


const testData = []
const numResults = 5

for (let i = 0; i < numResults; i++) {
  testData.push({
    fullName: faker.name.findName(),
    student: faker.image.avatar(),
    classname: faker.lorem.sentence(),
    classtype: faker.name.jobType(),
    datetime: faker.lorem.word(),
    sessiontype: faker.name.jobType(),
    sessionstatus: faker.lorem.word(),
    payoutstatus: faker.lorem.word(),
  })
}
const headers = {
  fullName: {
    text: 'Teacher / Email',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <List className="session-usr-list" sx={{ width: '100%' }}>
            <ListItem alignItems="flex-start">
              <ListItemAvatar>
                <Link to="/session-details"><Avatar alt="" src="../../../../../../../images/profile-pic.png" /></Link>
              </ListItemAvatar>
              <ListItemText>
                <Typography variant="h5"> <Link to="/session-details">{value}</Link></Typography>
                <Typography variant="fntEleven">test@gmail.com </Typography>
              </ListItemText>
            </ListItem>
          </List>
        </>
      )
    },
  },
  student: {
    text: 'Student ( s )',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
        {row.classtype == "Group Classes" ?
          <AvatarGroup max={4}>
            <Avatar alt="Remy Sharp" src="../../../../../../../images/profile-pic.png" />
            <Avatar alt="Travis Howard" src="../../../../../../../images/profile-pic.png" />
            <Avatar alt="Cindy Baker" src="../../../../../../../images/profile-pic.png" />
            <Avatar alt="Agnes Walker" src="../../../../../../../images/profile-pic.png" />
            <Avatar alt="Trevor Henderson" src="../../../../../../../images/profile-pic.png" />
          </AvatarGroup> : <AvatarGroup max={1}>
            <Avatar alt="Remy Sharp" src="../../../../../../../images/profile-pic.png" />
          </AvatarGroup>
        }
        </>
      )
    },
  },
  classname: {
    text: 'Class Name',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <p >{value}</p>
        </>
      )
    },
  },
  classtype: {
    text: 'Class Type',
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
  sessiontype: {
    text: 'Session Type',
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
  sessionstatus: {
    text: 'Session Status',
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
  payoutstatus: {
    text: 'Payout Status',
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
          <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
            <ClassDetailsPopup />
            {/* <button className="edit-userbtn"><FiEdit /></button> */}
            <button className="delete-userbtn"><FiXCircle /></button>
          </Box>
        </>
      )
    },
  },
}
export default function SessionsTable() {
  return (
    <Box sx={{
      backgroundColor: '#fff',
      padding: 2,
      borderRadius: 1,
    }}>
      <SmartDataTable
        data={testData}
        name="test-table"
        className="ui compact selectable table session-list-users"
        sortable
        headers={headers}
      />

      <div className="pagination-section pb-5 pt-3">
        <Pagination count={10} color="primary" />
      </div>
    </Box>
  );
}