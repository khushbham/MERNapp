import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import "../../../../css/admin/student.css";
import { Link } from "react-router-dom";
import SummaryData from "./SummaryData";
import { invoiceDetail } from "../../../../actions/transactions";
import { connect, useDispatch } from "react-redux";
import { useParams } from "react-router-dom";
import InputLabel from "@mui/material/InputLabel";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Box from "@mui/material/Box";
import Select from "@mui/material/Select";
import TextField from "@mui/material/TextField";
import {
  refundDetailStatus,
  updateRefundStatus,
} from "../../../../actions/auth";

const RefundData = ({
  invoiceDetail,
  transaction: { loading, invoiceRecord },
}) => {
  const { id } = useParams();
  const [statusVal, setStatusVal] = useState({});
  const [refundstatus, setRefundStatus] = useState(0);
  const [apiHit, setApiHit] = useState(false);
  const [formData, setFormData] = useState({
    amount: "",
    feedback: "",
  });
  const RefundhandleChange = (event) => {
    if (statusVal.refund_status == 0) {
      setRefundStatus(event.target.value);
    }
  };
  const dispatch = useDispatch();

  const handleForm = (e) => {
    if (statusVal.refund_status == 0) {
      setFormData({ ...formData, [e.target.name]: e.target.value });
    }
  };

  //Update the refund process
  const updateRefundProcess = () => {
    if (refundstatus == 0) return alert("Please select the refund status.");

    let userRole = localStorage.getItem("UserRole");
    let passTheRole = userRole == 3 ? 2 : 1;
    const submitForm = {
      transaction_id: invoiceRecord._id,
      refund_status: refundstatus,
      admin_type: passTheRole,
      refund_amount: refundstatus == 1 ? formData.amount : 0,
      refund_feedback_by_admin: formData.feedback,
    };

    dispatch(updateRefundStatus(submitForm))
      .then((result) => {
        if (result.success) {
          setApiHit(true);
          // setFormData({
          //   amount: "",
          //   feedback: "",
          // });
        } else {
          console.log("err", result);
        }
      })
      .catch((err) => console.log("err", err));
  };

  // refundDetailStatus
  const refundDetail = (lastElement) => {
    dispatch(refundDetailStatus(lastElement))
      .then((result) => {
        if (result.success) {
          setStatusVal(result.data);
          setFormData({
            amount: result.data.refund_amount,
            feedback: result.data.refund_feedback_by_admin,
          });
          setRefundStatus(result.data.refund_status);
        } else {
          console.log("err", result);
        }
      })
      .catch((err) => console.log("err", err));
  };

  var getPathName = window.location.pathname;
  var splitData = getPathName.split("/");
  var lastElement = splitData[splitData.length - 1];
  useEffect(() => {
    invoiceDetail(id);
    refundDetail(lastElement);
  }, [apiHit]);
  return (
    !loading && (
      <div className="invoiceData">
        <Grid container className="p-3 pb-0 main-head-dashboard">
          <Grid item xs={6} md={6} className="d-flex align-items-center">
            <Typography variant="h5">Refund details</Typography>
            <a
              href={invoiceRecord.invoice_link}
              style={{ textDecoration: "none" }}
            >
              <Button
                variant="contained"
                style={{ backgroundColor: "#6a7187", marginLeft: "10px" }}
              >
                {" "}
                Download Invoice
              </Button>
            </a>
          </Grid>
          <Grid
            item
            xs={6}
            md={6}
            className="d-flex align-items-center justify-content-end"
          >
            <Typography align="right" variant="body1">
              Financial Management
            </Typography>
          </Grid>
        </Grid>
        <div className="OrderDetails  p-3">
          <Box component="form" noValidate className="refund_status_form">
            <Grid
              container
              className="d-flex align-items-end"
              style={{
                backgroundColor: "#f2f2f5",
                padding: "20px 20px 20px",
                borderBottom: " solid 1px rgba(0, 0, 0, 0.1)",
              }}
            >
              <Grid item xs={12} md={3} lg={3} className="p-2">
                <FormControl>
                  <InputLabel shrink htmlFor="refund_status">
                    Refund Status
                  </InputLabel>
                  <Select
                    value={refundstatus}
                    onChange={RefundhandleChange}
                    className="status_refund"
                  >
                    <MenuItem value="">
                      <em>Select</em>
                    </MenuItem>
                    <MenuItem value={0}>Pending</MenuItem>
                    <MenuItem value={1}>Processed</MenuItem>
                    <MenuItem value={2}>Cancel</MenuItem>
                  </Select>
                </FormControl>
              </Grid>
              {refundstatus != 2 && (
                <Grid item xs={12} md={3} lg={3} className="p-2">
                  <FormControl>
                    <InputLabel shrink htmlFor="refund_status">
                      Refund Amount
                    </InputLabel>
                    <TextField
                      className="amount_refund"
                      id="outlined-number"
                      type="number"
                      name="amount"
                      value={formData.amount}
                      onChange={(e) => handleForm(e)}
                    />
                  </FormControl>
                </Grid>
              )}
              <Grid item xs={12} md={3} lg={4} className="p-2">
                <FormControl>
                  <InputLabel shrink htmlFor="refund_status">
                    Feedback on refund process
                  </InputLabel>
                  <TextField
                    className="feedbck_prcs_refund"
                    name="feedback"
                    value={formData.feedback}
                    onChange={(e) => handleForm(e)}
                  />
                </FormControl>
              </Grid>
              <Grid item xs={12} md={3} lg={2} className="p-2">
                <FormControl>
                  {statusVal.refund_status == 0 && (
                    <>
                      <Button
                        onClick={(e) => updateRefundProcess()}
                        variant="contained"
                        className="ExportBtn"
                      >
                        Update
                      </Button>
                    </>
                  )}
                </FormControl>
              </Grid>
            </Grid>
          </Box>

          <Grid
            container
            className="d-flex align-items-center"
            style={{
              backgroundColor: "#fff",
              padding: "20px 20px 20px",
              borderBottom: " solid 1px rgba(0, 0, 0, 0.1)",
            }}
          >
            <Grid item xs={6} md={6}>
              <div
                className="invoice-logo"
                style={{ background: "transparent" }}
              >
                <Link to="/admin-dashboard">
                  <img
                    src="../../../../images/logo-teachifed.png"
                  />
                </Link>
              </div>
              {/* <Typography variant="h2" component="h2" style={{ backgroundColor: '#82005e', TextTransform: 'uppercase', padding: '10px' }} className="MentorHead">MENTORS</Typography> */}
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography paragraph={true} align="right" className="mb-0">
                Transaction # {invoiceRecord.invoice_data.invoice_id}
              </Typography>
            </Grid>
          </Grid>

          <Grid container className="p-3" style={{ backgroundColor: "#fff" }}>
            <Grid item xs={12} md={12}>
              <div className="BilingAddress">
                <Typography variant="h5" component="h5">
                  {" "}
                  <b>Billed To:</b>
                </Typography>
                <Typography paragraph={true} mb="0">
                  Transaction # {invoiceRecord.invoice_data.invoice_id}
                </Typography>
                <Typography paragraph={true} mb="0">
                  {invoiceRecord.invoice_data.street_address}
                </Typography>
                <Typography paragraph={true} mb="0">
                  {invoiceRecord.invoice_data.city}
                </Typography>
                <Typography paragraph={true} mb="0">
                  {invoiceRecord.invoice_data.state},{" "}
                  {invoiceRecord.invoice_data.zip_code}
                </Typography>
              </div>
            </Grid>
          </Grid>
          <Grid container style={{ backgroundColor: "#fff" }} className="p-3">
            <Grid item xs={6} md={6} sm={6}>
              <div className="BilingAddress">
                <Typography variant="h5" component="h5">
                  {" "}
                  <b>Payment Method :</b>
                </Typography>
                <Typography paragraph={true} mb="0">
                  Visa ending **** {invoiceRecord.invoice_data.card_last_digits}
                </Typography>
                {/* <Typography paragraph={true} mb="0">jsmith@email.com</Typography> */}
              </div>
            </Grid>
            <Grid item xs={6} md={6} sm={6} className="text-end">
              <Typography variant="h5" component="h5">
                {" "}
                <b>Transaction Date :</b>
              </Typography>
              <Typography paragraph={true} mb="0">
                {invoiceRecord.invoice_data.billing_date}
              </Typography>
            </Grid>

            <Grid item xs={12} md={12} sm={12} className="mt-5">
              <Typography variant="h5" component="h5" className="mb-2">
                {" "}
                <b>Order summary:</b>
              </Typography>
              <SummaryData invoiceRecord={invoiceRecord} />
            </Grid>
          </Grid>
        </div>
      </div>
    )
  );
};

const mapStateToProps = (state) => ({
  auth: state.auth,
  transaction: state.transactions,
});

export default connect(mapStateToProps, { invoiceDetail })(RefundData);
