import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Grid from "@mui/material/Grid";
import Container from "@mui/material/Container";
import Navbar from "../../Navbar";
import Typography from "@mui/material/Typography";
import { Link } from "react-router-dom";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  getDropdownValues,
  getPayoutsDetail,
} from "../../../../../actions/frontent";

const PayoutDetailsData = () => {
  const dispatch = useDispatch();
  const [payoutDetails, setpayoutDetails] = useState();
  const [sessiontype, setsessiontype] = useState([]);
  const queryParams = new URLSearchParams(window.location.search);
  const payoutId = queryParams.get("payoutId");

  const getPayoutsDetails = () => {
    dispatch(getPayoutsDetail(payoutId))
      .then((res) => {
        console.log(res?.data, "response");
        setpayoutDetails(res?.data);
      })
      .catch((err) => {
        console.log(err);
      });

    dispatch(getDropdownValues()).then((res) => {
      setsessiontype(
        res.data.filter((a) => {
          if (a.name == "session_type") {
            return a;
          }
        })[0].options
      );
    });
  };

  useEffect(() => {
    getPayoutsDetails();
  }, []);
  return (
    <Box>
      <Navbar />
      <Box className="classesWrap">
        <Container>
          <Grid container>
            <Grid item lg={12} md={12} sm={12} xs={12} className="m-auto">
              <Typography
                variant="h3"
                gutterBottom
                component="div"
                className="mb-0 mb-3"
              >
                Payout Details
              </Typography>
              <Grid container spacing={4}>
                <Grid item lg={4} md={4} sm={12} xs={12}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    component="div"
                    className="summaryHead my-2"
                  >
                    Summary
                  </Typography>
                  <Box className="SummaryContent">
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Payout Details
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd statusColor"
                      >
                        {payoutDetails?.payout_status == 2 ? (
                          <span className="error_message">Cancelled</span>
                        ) : payoutDetails?.payout_status == 1 ? (
                          "Processed"
                        ) : (
                          "Pending"
                        )}{" "}
                      </Typography>
                    </Box>
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Payout Date
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                      >
                        {payoutDetails?.payout_date != ""
                          ? moment(payoutDetails?.payout_date).format(
                              "MMM D YYYY"
                            )
                          : "-"}
                      </Typography>
                    </Box>
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Payout Amount
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                        align="left"
                      >
                        ${payoutDetails?.payout_amount}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item lg={8} md={8} sm={12} xs={12}>
                  <Typography
                    variant="h5"
                    gutterBottom
                    component="div"
                    className="summaryHead my-2"
                  >
                    {" "}
                    Class and Financial Details
                  </Typography>
                  <Box className="SummaryContent">
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Class Date
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                      >
                        {moment(payoutDetails?.classes_completion_date).format(
                          "MMM D YYYY"
                        )}
                      </Typography>
                    </Box>
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Class Name
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                      >
                        {payoutDetails?.class_title}
                      </Typography>
                    </Box>
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Student Name
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                      >
                        {payoutDetails?.booked_by.map((data) => {
                          return (
                            <div>
                              {data.first_name} {data.last_name}
                            </div>
                          );
                        })}
                      </Typography>
                    </Box>
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Location
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                      >
                        {
                          sessiontype.filter((a) => {
                            return a;
                          })[payoutDetails?.session_type]
                        }
                      </Typography>
                    </Box>
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Class Charges
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                      >
                        ${payoutDetails?.class_charges}
                      </Typography>
                    </Box>
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Platform Commission
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                      >
                        ${payoutDetails?.platform_commission}
                      </Typography>
                    </Box>
                    <Box className="Summary d-flex">
                      <Typography variant="h5" gutterBottom component="div">
                        Payout Amount
                      </Typography>
                      <Typography
                        variant="subtitle1"
                        gutterBottom
                        component="div"
                        className="SubHeadd"
                      >
                        ${payoutDetails?.payout_amount}
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
              </Grid>
            </Grid>
          </Grid>
        </Container>
      </Box>
    </Box>
  );
};

export default PayoutDetailsData;
