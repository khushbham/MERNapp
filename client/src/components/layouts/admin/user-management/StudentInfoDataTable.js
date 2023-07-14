import React from "react";
import faker from "faker";
import SmartDataTable from "react-smart-data-table";
import { Typography } from "@mui/material";
import { FiEdit, FiXCircle } from "react-icons/fi";
import List from "@mui/material/List";
import ListItem from "@mui/material/ListItem";
import ListItemText from "@mui/material/ListItemText";
import ListItemAvatar from "@mui/material/ListItemAvatar";
import Avatar from "@mui/material/Avatar";
// Import basic styling
import "react-smart-data-table/dist/react-smart-data-table.css";
import { Box } from "@mui/system";
const testData = [];
const numResults = 5;

for (let i = 0; i < numResults; i++) {
  testData.push({
    // _id: i,
    fullName: faker.name.findName(),
    datetime: faker.datatype.number(),
    location: faker.address.cityName(),
    type: faker.name.jobType(),
    status: faker.commerce.productName(),
  });
}
const headers = {
  fullName: {
    text: "ClassName",
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return (
        <>
          <div className="StudentData">
            <p>Class Name Will Be Here and can be multiline if need be</p>
          </div>
        </>
      );
    },
  },
  datetime: {
    text: "datetime",
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
  type: {
    text: "Type",
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
  datetime: {
    text: "datetime",
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
      // The following results should be identical
      // console.log(value, row.tableActions)
      // Example of table actions: Delete row from data by row index
      return (
        <>
          <Box sx={{ display: "flex", justifyContent: "flex-end" }}>
            <button className="edit-userbtn">
              <FiEdit />
            </button>
            <button className="delete-userbtn">
              <FiXCircle />
            </button>
          </Box>
        </>
      );
    },
  },
};
export default function BasicInformation() {
  return (
    <SmartDataTable
      data={testData}
      name="test-table"
      className="ui compact selectable table recent-users"
      sortable
      headers={headers}
    />
  );
}
