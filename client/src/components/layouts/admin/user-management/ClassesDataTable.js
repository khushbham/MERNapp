import React from "react";
import faker from "faker";
import SmartDataTable from "react-smart-data-table";
import { Typography } from "@mui/material";
import { FiEdit, FiXCircle } from "react-icons/fi";

// Import basic styling
import "react-smart-data-table/dist/react-smart-data-table.css";
import { Box } from "@mui/system";
const testData = [];
const numResults = 5;

for (let i = 0; i < numResults; i++) {
  testData.push({
    fullName: faker.name.findName(),
    datetime: faker.datatype.number(),
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
  action: {
    text: "Action",
    invisible: false,
    sortable: false,
    filterable: true,
    transform: (value, index, row) => {
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
export default function ClassesDataTable() {
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
