import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { BsCheck2Circle, BsExclamationOctagon } from "react-icons/bs";
import { AiOutlineRise } from "react-icons/ai";
import Pagination from "@mui/material/Pagination";
import { AiOutlineCheck } from "react-icons/ai";
import { ImCross } from "react-icons/im";
import { BsClock } from "react-icons/bs";
import moment from "moment";
import StudentNavbar from "../Students/StudentNavbar";
import { useHistory } from "react-router-dom";
import { getRefundRequestList, totalEarningFromRefund } from "../../../../actions/frontent";
import { useDispatch } from "react-redux";
const MyPayout = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [Refundlisting, setrefundlisting] = useState([]);
  const [page, setpage] = useState(1);
  const [Earning, setEarning] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const [cardDetailsExists, setCardDetailsExists] = useState(false);

  const getPayouts = () => {
    dispatch(getRefundRequestList(page))
      .then((res) => {
        setrefundlisting(res?.data?.records);
        settotalPages(res?.data?.totalRecords);
      })
      .catch((err) => {
        console.log(err, "err");
      });
  };
  var NoPages = Math.ceil(totalPages / 10);
  const handlePageChange = (e, p) => {
    setpage(p);
    setCurrentPage(p);
  };
  useEffect(() => {
    getPayouts();
    dispatch(totalEarningFromRefund()).then((res)=>{
        setEarning(res.data.refundDetail);
        setCardDetailsExists(res.data.cardDetailsExists);

    }).catch((err)=>{
        console.log(err)
    })
  }, []);

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
      <StudentNavbar />
      <Box>
        <Grid container>
          <Grid item lg={7} sm={10} xs={12} className="m-auto mt-4 mb-4">
            <Box className="payOutsettings">
              <Typography
                variant="caption"
                display="block"
                gutterBottom
                className="headinggg"
              >
                My Refunds
              </Typography>
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
                          My Refund Amount{" "}
                        </Typography>
                        <Typography
                          variant="h4"
                          gutterBottom
                          component="div"
                          className="PayoutHead mb-0"
                        >
                          ${Earning?.[0]?.refund_amount}
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
                        className={cardDetailsExists ? "payBox" : "payBox payBox2"}
                        onClick={() => history.push("/my-payouts")}
                      >
                        <Typography
                          variant="caption"
                          display="block"
                          gutterBottom
                          className="PayoutText"
                        >
                          {cardDetailsExists ? <BsCheck2Circle /> : <BsExclamationOctagon />}
                          Refund Settings
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
            {Refundlisting?.length ? (
              <div>
                {Refundlisting?.map((payouts) => {
                  return (
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
                      {payouts?.items?.map((data) => {
                        return (
                          <Box className="d-flex align-items-center my-3 py-2">
                            {/* <span className="checkIcon">
                   <AiOutlineCheck />
                 </span> */}
                            {data.refund_status == 0 ? clockIcon:data.refund_status == 1 ? checkIcon:cancelIcon }
                            <Box className="ms-3">
                              <Typography
                                variant="subtitle2"
                                gutterBottom
                                component="div"
                                className="payHead"
                                // onClick={() => redirect(data?._id)}
                              >
                                { data.refund_status == 0 ? "Refund Pending":data.refund_status == 1 ? "Refund Processed":"Refund Cancelled"}
                              </Typography>
                              <Typography
                                variant="subtitle1"
                                gutterBottom
                                component="div"
                                className="paymentSubtitle mb-0"
                              >
                                {" "}
                                { data.refund_status == 0 ?
                                `We will transfer $${data?.refund_amount} to your account for class: 
                                ${data?.classes?.class_title}`: data.refund_status == 1 ? `We transfered $${data?.refund_amount} to your account for class
                                ${data?.classes?.class_title}` : `We cancelled your refund  amount $${data?.refund_amount} for Class:
                                ${data?.classes?.class_title}`}
                              </Typography>
                            </Box>
                          </Box>
                        );
                      })}
                    </Box>
                  );
                })}
                <div className="pagination-section">
                  <Pagination
                    onChange={handlePageChange}
                    defaultPage={currentPage}
                    count={NoPages}
                    color="primary"
                  />
                </div>
              </div>
            ) : (
              <div style={{ alignItems: "center",textAlign:"center", padding:"10px", background:"#e1e3e7" }}>
              No Record Found
            </div>
            )}
            {/* <Box className="NotificationsSettingss">
                            <Typography variant="h3" gutterBottom component="div" className="NotificationHead"> November 22, 2021</Typography>
                               <Box className="d-flex align-items-center my-3 py-2">
                                   <span className="checkIcon"><AiOutlineCheck/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Payout Processed</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> We transfered $59.95 to your account re: Salsa / Tango class with Joe Doe </Typography>
                                   </Box>
                               </Box>
                               <Box className="d-flex align-items-center my-3 py-2">
                                   <span className="checkIcon pending"><BsClock/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Payout Pending</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> We transfered $59.95 to your account re: Salsa / Tango class with Joe Doe </Typography>
                                   </Box>
                               </Box>
                               <Box className="d-flex align-items-center my-3 py-2">
                                   <span className="checkIcon"><AiOutlineCheck/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Payout Processed</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> We transfered $59.95 to your account re: Salsa / Tango class with Joe Doe </Typography>
                                   </Box>
                               </Box>
                               <Box className="d-flex align-items-center my-3 py-2">
                                   <span className="checkIcon"><AiOutlineCheck/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Payout Processed</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> We transfered $59.95 to your account re: Salsa / Tango class with Joe Doe </Typography>
                                   </Box>
                               </Box>
                               <Box className="d-flex align-items-center my-3 py-2">
                                   <span className="checkIcon"><AiOutlineCheck/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Payout Processed</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> We transfered $59.95 to your account re: Salsa / Tango class with Joe Doe </Typography>
                                   </Box>
                               </Box>

                               <Typography variant="h3" gutterBottom component="div" className="NotificationHead"> November 21, 2021</Typography>
                               <Box className="d-flex align-items-center my-3 py-2">
                                   <span className="checkIcon"><AiOutlineCheck/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Payout Processed</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> We transfered $59.95 to your account re: Salsa / Tango class with Joe Doe </Typography>
                                   </Box>
                               </Box>
                               <Box className="d-flex align-items-center my-3 py-2">
                                   <span className="checkIcon"><AiOutlineCheck/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Payout Processed</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> We transfered $59.95 to your account re: Salsa / Tango class with Joe Doe </Typography>
                                   </Box>
                               </Box>

                               <Box className="d-flex align-items-center my-3 py-2">
                                   <span className="checkIcon"><AiOutlineCheck/></span>
                                   <Box className="ms-3">
                                   <Typography variant="subtitle2" gutterBottom component="div" className="payHead">Payout Processed</Typography>
                                   <Typography variant="subtitle1" gutterBottom component="div" className="paymentSubtitle mb-0"> We transfered $59.95 to your account re: Salsa / Tango class with Joe Doe </Typography>
                                   </Box>
                               </Box>
                        </Box> */}
          </Grid>
        </Grid>
      </Box>
    </Box>
  );
};
export default MyPayout;
