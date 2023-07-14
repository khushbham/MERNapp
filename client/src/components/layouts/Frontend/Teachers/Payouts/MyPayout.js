import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Navbar from "../../Navbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BsCheck2Circle, BsExclamationOctagon } from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BsClock } from "react-icons/bs";
import moment from "moment";
import { useHistory } from "react-router-dom";
import Pagination from "@mui/material/Pagination";
import PayoutFilter from "../../Teachers/Payouts/PayoutFilter";
import { useDispatch } from "react-redux";
import { getPayoutsList, totalEarning } from "../../../../../actions/frontent";

const MyPayout = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [Payoutlisting, setpayoutlisting] = useState([]);
  const [page, setpage] = useState(1);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [Earning, setEarning] = useState([]);
  const [cardDetailsExists, setCardDetailsExists] = useState(false);
  const [time_selected, settime_selected] = React.useState();
  const [payout_status, setpayout_status] = React.useState();
  const [start_date, setstart_date] = React.useState("");
  const [end_date, setend_date] = React.useState("");
  const StartDate = moment(start_date).format("MM-DD-YYYY");
  const EndDate = moment(end_date).format("MM-DD-YYYY");

  const getPayouts = () => {
    dispatch(
      getPayoutsList(page, StartDate, EndDate, time_selected, payout_status)
    )
      .then((res) => {
        setpayoutlisting(res?.data.records);
        settotalPages(res?.data.totalRecords);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };
  var NoPages = Math.ceil(totalPages / 10);
  useEffect(() => {
    getPayouts();
    dispatch(totalEarning())
      .then((res) => {
        if (res.success) {
          setEarning(res.data.payoutsDetail);
          setCardDetailsExists(res.data.cardDetailsExists);
        }
      })
      .catch((err) => {
        console.log(err, "error");
      });
  }, [page]);

  const handlePageChange = (e, p) => {
    setpage(p);
    setCurrentPage(p);
  };
  const redirect = (id) => {
    history.push({
      pathname: "/teacher/payout-details",
      search: `payoutId=${id}`,
    });
  };

  const checkIcon = (
    <span className="checkIcon">
      <AiOutlineCheck />
    </span>
  );
  const clockIcon = (
    <span className="checkIcon pending">
      <BsClock />{" "}
    </span>
  );
  const cancelIcon = (
    <span className="checkIcon error">
      {" "}
      <ImCross />{" "}
    </span>
  );

  return (
    <Box className="payoutWrapper">
      <Navbar />
      <Box>
        <Grid container>
          <Grid
            item
            lg={6}
            sm={10}
            md={6}
            xs={12}
            xxl={6}
            className="m-auto mt-4"
          >
            <Box className="payOutsettings">
              <Box className="my_payout_header">
                <Typography
                  variant="caption"
                  display="block"
                  gutterBottom
                  className="headinggg"
                >
                  My Payouts
                </Typography>
                <PayoutFilter
                  getPayouts={getPayouts}
                  time_selected={time_selected}
                  settime_selected={settime_selected}
                  setpayout_status={setpayout_status}
                  setstart_date={setstart_date}
                  setend_date={setend_date}
                  start_date={start_date}
                  end_date={end_date}
                />
              </Box>

              <Grid container>
                <Grid item lg={12} sm={12} xs={12}>
                  <Grid container spacing={2}>
                    <Grid item lg={6} sm={6} xs={12}>
                      <Box className="payBox">
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                          className="PayoutText"
                        >
                          <AiOutlineRise />
                          My Earnings{" "}
                        </Typography>
                        <Typography
                          variant="h4"
                          gutterBottom
                          component="div"
                          className="PayoutHead mb-0"
                        >
                          ${Earning?.length ? Earning?.[0]?.paid_amount : "0"}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                          className="subbTexttt"
                        >
                          {" "}
                          All time
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item lg={6} sm={6} xs={12}>
                      <Box
                        className={
                          cardDetailsExists ? "payBox" : "payBox payBox2"
                        }
                        onClick={() => history.push("/teacher/my-payouts")}
                      >
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                          className="PayoutText"
                        >
                          {cardDetailsExists ? (
                            <BsCheck2Circle />
                          ) : (
                            <BsExclamationOctagon />
                          )}
                          Payout Settings
                        </Typography>
                        <Typography
                          variant="h4"
                          gutterBottom
                          component="div"
                          className="PayoutHead mb-0"
                        >
                          {cardDetailsExists ? "All set!" : "Pending"}
                        </Typography>
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                          className="subbTexttt"
                        >
                          {" "}
                          Tap to update
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
            {Payoutlisting?.map((payouts) => (
              <Box className="NotificationsSettingss">
                <Typography
                  variant="h3"
                  gutterBottom
                  component="div"
                  className="NotificationHead"
                >
                  {" "}
                  {moment(payouts._id).format("MMMM D YYYY")}
                </Typography>
                {payouts?.items?.map((data) => (
                  <Box className="d-flex align-items-center my-3 py-2" 
                  onClick={() => redirect(data?._id)}>
                    <span className="checkIcon">
                      {!data?.is_payout_detail_exists && clockIcon}
                      {data?.payout_details?.length > 0 &&
                        data?.payout_details[0].payout_status == 0 &&
                        clockIcon}
                      {data?.payout_details?.length > 0 &&
                        data?.payout_details[0].payout_status == 1 &&
                        checkIcon}
                      {data?.payout_details?.length > 0 &&
                        data?.payout_details[0].payout_status == 2 &&
                        cancelIcon}
                    </span>
                    <Box className="ms-3">
                      <Typography
                        variant="subtitle2"
                        gutterBottom
                        component="div"
                        className="payHead"
                      >
                        {!data?.is_payout_detail_exists && "Pending Payouts"}
                        {data?.payout_details?.length > 0 &&
                          data?.payout_details[0].payout_status == 0 &&
                          "Pending Payouts"}
                        {data?.payout_details?.length > 0 &&
                          data?.payout_details[0].payout_status == 1 &&
                          "Payout Processed"}
                        {data?.payout_details?.length > 0 &&
                          data?.payout_details[0].payout_status == 2 &&
                          "Payout Cancelled"}
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="paymentSubtitle mb-0"
                      >
                        {" "}
                        {!data?.is_payout_detail_exists &&
                          `We will transfer $${data?.total_amount} to your account re: ${data?.classes?.class_title}`}
                        {data?.payout_details?.length > 0 &&
                          data?.payout_details[0].payout_status == 0 &&
                          `We will transfer $${data?.total_amount} to your account re: ${data?.classes?.class_title}`}
                        {data?.payout_details?.length > 0 &&
                          data?.payout_details[0].payout_status == 1 &&
                          `We transfered $${data?.total_amount} to your account re: ${data?.classes?.class_title}`}
                        {data?.payout_details?.length > 0 &&
                          data?.payout_details[0].payout_status == 2 &&
                          `We cancelled your refund  amount $${data?.total_amount} for 
                                    ${data?.classes?.class_title}`}
                      </Typography>
                    </Box>
                  </Box>
                ))}
              </Box>
            ))}
            {Payoutlisting.length > 0 && (
              <div className="pagination-section">
                <Pagination
                  onChange={handlePageChange}
                  defaultPage={currentPage}
                  count={NoPages}
                  color="primary"
                />
              </div>
            )}
            {Payoutlisting.length == 0 && (
              <div
                style={{
                  alignItems: "center",
                  textAlign: "center",
                  padding: "10px",
                  background: "#e1e3e7",
                }}
                className="no_records_found"
              >
                No Record Found
              </div>
            )}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default MyPayout;
