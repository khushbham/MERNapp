import React from 'react'
import SmartDataTable from 'react-smart-data-table'
// Import basic styling
import 'react-smart-data-table/dist/react-smart-data-table.css'
import ReactHtmlParser from 'react-html-parser';

export default function SummaryData(props) {
  
  var classTimeDetail = '';
  function tConvert(time)
  {
         // Check correct time format and split into components
         time = time.toString().match(/^([01]\d|2[0-3])(:)([0-5]\d)?$/) || [time];
 
         if (time.length > 1) { // If time format correct
             time = time.slice(1);  // Remove full string match value
             time[5] = +time[0] < 12 ? ' am' : ' pm'; // Set AM/PM
             time[0] = +time[0] % 12 || 12; // Adjust hours
         }
         return time.join(''); // return adjusted time or original string
     }
  for(let i = 0; i < props.invoiceRecord.invoice_data.classDetailData.length; i++) { 
    classTimeDetail += '<p>'+props.invoiceRecord.invoice_data.classDetailData[i].class_date + '<br>'+ tConvert(props.invoiceRecord.invoice_data.classDetailData[i].start_time_of_class)+'</p>';
     }
    const testTransactData = [{
      description: props.invoiceRecord.invoice_data.class_title,
      datetime: classTimeDetail,
      amount: props.invoiceRecord.invoice_data.class_price,
      status: "Processed",
    }]
const headers = {
  description: {
    text: 'Description',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return ReactHtmlParser(value)
      
    },
  },

  datetime: {
    text: 'Date and Time',
    invisible: false,
    sortable: true,
    filterable: true,
    transform: (value, index, row) => {
      return ReactHtmlParser(value)
      
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
}
  return (
    <div>
      <SmartDataTable
        data={testTransactData}
        responsive={true}
        name="test-table"
        className="ui compact selectable table refund-invoice-transactions"
        sortable
        headers={headers}
        style={{ backgroundColor: '#fff' }}
      />
    </div>
  );
}