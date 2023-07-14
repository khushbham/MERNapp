import React,{useEffect} from 'react'
import Grid from '@mui/material/Grid';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import '../../../../css/admin/student.css';
import { Link } from "react-router-dom";
import SummaryData from './SummaryData';
import { invoiceDetail } from "../../../../actions/transactions";
import { connect } from 'react-redux';
import { useParams } from 'react-router-dom';

const InvoiceData = ({invoiceDetail,transaction:{loading,invoiceRecord}}) => {
  const { id } = useParams();

  useEffect(() => {
    invoiceDetail(id); 
  },[]);
  return !loading && (
    <div className="invoiceData">
      <Grid container className="p-3 pb-0 main-head-dashboard">
        <Grid item xs={6} md={6} className="d-flex align-items-center">
          <Typography variant="h5">Invoice details</Typography>
          <a href={invoiceRecord.invoice_link} style={{textDecoration:'none'}}>
            <Button variant="contained" style={{ backgroundColor: '#6a7187', marginLeft: "10px" }}> Download Invoice</Button>
          </a>
        </Grid>
        <Grid item xs={6} md={6} className="d-flex align-items-center justify-content-end" >
          <Typography align="right" variant="body1">Financial Management</Typography>
        </Grid>
      </Grid> 
      <div className="OrderDetails  p-3">
        <Grid container className="d-flex align-items-center" style={{ backgroundColor: '#fff', padding: '20px 20px 20px', borderBottom: ' solid 1px rgba(0, 0, 0, 0.1)' }}>
          <Grid item xs={6} md={6} >
            <div className="invoice-logo" style={{background:"transparent"}}>
              <Link to="/admin-dashboard">
                <img src="../../../../images/logo-teachifed.png"/>
              </Link>
             </div>
            {/* <Typography variant="h2" component="h2" style={{ backgroundColor: '#82005e', TextTransform: 'uppercase', padding: '10px' }} className="MentorHead">MENTORS</Typography> */}
          </Grid>
          <Grid item xs={6} md={6} >
            <Typography paragraph={true} align="right" className="mb-0">Transaction  # {invoiceRecord.invoice_data.invoice_id}</Typography>
          </Grid>
        </Grid>

        <Grid container className="p-3" style={{ backgroundColor: '#fff' }}>
          <Grid item xs={12} md={12} >
            <div className="BilingAddress">
              <Typography variant="h5" component="h5"> <b>Billed To:</b></Typography>
              <Typography paragraph={true} mb="0">Transaction  # {invoiceRecord.invoice_data.invoice_id}</Typography>
              <Typography paragraph={true} mb="0">{invoiceRecord.invoice_data.street_address}</Typography>
              <Typography paragraph={true} mb="0">{invoiceRecord.invoice_data.city}</Typography>
              <Typography paragraph={true} mb="0">{invoiceRecord.invoice_data.state}, {invoiceRecord.invoice_data.zip_code}</Typography>
            </div>
          </Grid>
        </Grid>
        <Grid container style={{ backgroundColor: '#fff' }} className="p-3">
          <Grid item xs={6} md={6} sm={6}>
            <div className="BilingAddress">
              <Typography variant="h5" component="h5"> <b>Payment Method :</b></Typography>
              <Typography paragraph={true} mb="0">Visa ending **** {invoiceRecord.invoice_data.card_last_digits}</Typography>
              {/* <Typography paragraph={true} mb="0">jsmith@email.com</Typography> */}
            </div>
          </Grid>
          <Grid item xs={6} md={6} sm={6} className="text-end">
            <Typography variant="h5" component="h5"> <b>Transaction Date :</b></Typography>
            <Typography paragraph={true} mb="0">{invoiceRecord.invoice_data.billing_date}</Typography>
          </Grid>

          <Grid item xs={12} md={12} sm={12} className="mt-5">
            <Typography variant="h5" component="h5" className="mb-2"> <b>Order summary:</b></Typography>
            <SummaryData invoiceRecord={invoiceRecord} />
          </Grid>
        </Grid>
      </div>
    </div>
  )
}

const mapStateToProps = state => ({
  auth: state.auth,
  transaction: state.transactions
});

export default connect(
  mapStateToProps,
  {invoiceDetail }
)(InvoiceData);