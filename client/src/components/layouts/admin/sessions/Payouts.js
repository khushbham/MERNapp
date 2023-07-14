import React from 'react'
import faker from 'faker'
import SmartDataTable from 'react-smart-data-table'
import { FiEye } from "react-icons/fi";
// Import basic styling
import 'react-smart-data-table/dist/react-smart-data-table.css'
import { Link } from "react-router-dom";
const testTransactData = []
const numTransactResults = 1

for (let i = 0; i < numTransactResults; i++) {
  testTransactData.push({
    description: faker.lorem.sentence(),
    transactionid: faker.datatype.number(),
    datetime: faker.datatype.number(),
    amount: faker.datatype.number(),
    status: faker.name.findName(),
  })
}
const headers = {
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
    text: 'Payment Status',
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
          <Link to="/invoice-details/1" className="edit-userbtn"><FiEye /></Link>
        </>
      )
    },
  },
}
export default function Payouts() {
  return (
    <SmartDataTable
      data={[]}
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