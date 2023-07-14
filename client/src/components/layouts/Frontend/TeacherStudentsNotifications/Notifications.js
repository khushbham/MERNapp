import React, { useEffect, useState } from "react";
import Box from "@mui/material/Box";
import Navbar from "../Navbar";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import { AiOutlineCalendar } from "react-icons/ai";
import { AiOutlineCheck } from "react-icons/ai";
import Pagination from "@mui/material/Pagination";
import { ImCross } from "react-icons/im";
import moment from "moment";
import { useDispatch } from "react-redux";
import {
  deleteNotifications,
  notificationMarkAsRead,
  showNotifications,
} from "../../../../actions/frontent";
import Button from "@mui/material/Button";
import StudentNavbar from "../Students/StudentNavbar";
import { useHistory } from "react-router-dom";
const Notifications = () => {
  const [data, setData] = useState([]);
  const [page, setpage] = useState(1);
  const [user_role, setuser_role] = useState();
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, settotalPages] = useState(1);
  const history = useHistory();
  const dispatch = useDispatch();

  const markAsRead = () => {
    dispatch(notificationMarkAsRead())
      .then((res) => {
        if (res.success) {
          console.log("mark as read done ::", res.message);
        } else {
          console.log("some error", res);
        }
      })
      .catch((err) => console.log("mark as read", err));
  };

  function getNotificationList(page) {
    dispatch(showNotifications(page))
      .then((res) => {
        if (res.success) {
          setData(res?.data.result);
          settotalPages(res?.data.totalRecords);
          markAsRead();
          // console.log("data" , data)
        } else {
          console.log("some error", res);
        }
      })
      .catch((err) => console.log("ERRr", err));
  }

  var NumberofPages = Math.ceil(totalPages / 10);
  //Clear all notification
  const clearAllNotifation = () => {
    dispatch(deleteNotifications())
      .then((res) => {
        if (res.success) {
          getNotificationList(page);
        } else {
          console.log("some error", res);
        }
      })
      .catch((err) => console.log("delete", err));
  };

  useEffect(() => {
    getNotificationList(page);
    setuser_role(localStorage.getItem("user_role"));
  }, [page]);

  const handlePageChange = (e, p) => {
    setpage(p);
    setCurrentPage(p);
  };

  const redirectToClass = (class_id) => {
    history.push({
      pathname: `/teacher/class-detials`,
      search: `Class_Id=${class_id}`,
    });
  };

  const redirectToPayouts = (class_id) => {
    history.push({
      pathname: `/teacher/payouts`,
    });
  };

  const checkIcon = (
    <span className="checkIcon">
      <AiOutlineCheck />
    </span>
  );
  const dateIcon = (
    <span className="checkIcon pending">
      <AiOutlineCalendar />{" "}
    </span>
  );
  const cancelIcon = (
    <span className="checkIcon error">
      {" "}
      <ImCross />{" "}
    </span>
  );

  return (
    <Box>
      {user_role == 1 ? <StudentNavbar /> : <Navbar />}
      <Grid container>
        <Grid item lg={6} sm={12} xs={12} className="m-auto mt-4">
          {/* <Box className="notification_settings">
            <Typography
              variant="caption"
              display="block"
              gutterBottom
              className="headinggg"
            >
              My Notifications
            </Typography>
          </Box> */}
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              p: 2,
              bgcolor: "#82005e",
              borderRadius: 1,
            }}
            className="notification-listing-screen"
          >
            <Typography variant="caption" display="block" className="headinggg">
              My Notifications
            </Typography>

            {data?.length ? (
              <Button
                onClick={() => clearAllNotifation()}
                variant="outlined"
                className="clr_all_bttn"
              >
                Clear all
              </Button>
            ) : (
              ""
            )}
          </Box>
          <Box className="NotificationsSettingss mt-0">
            {data?.length ? (
              <div className="">
                {data?.map((notify) => {
                  return (
                    <>
                      <Box className="my-3 py-2">
                        <Typography
                          variant="h3"
                          gutterBottom
                          component="div"
                          className="NotificationHead"
                        >
                          {" "}
                          {moment(notify._id).format("MMMM D YYYY")}
                        </Typography>

                        {notify?.items?.map((title, i) => {
                          return (
                            <Box className="d-flex my-3 py-2">
                              <Box className="icon_notify_area">
                                {/* <span className="checkIcon pending">
                                <AiOutlineCalendar />
                              </span> */}
                                {title.notification_type == 1 || title.notification_type == 2
                                  ? dateIcon
                                  : (title.notification_type == 4 || title.notification_type == 6)
                                  ? checkIcon
                                  : cancelIcon}
                              </Box>
                              <Box>
                                <Typography
                                  variant="subtitle2"
                                  gutterBottom
                                  component="div"
                                  className="payHead"
                                  onClick={()=> title.notification_type == 1 && 2 ? redirectToClass(title?.class_id):title.notification_type == 4 && 5 ? redirectToPayouts() : ''}
                                >
                                  {title.notification_title}
                                </Typography>
                                <Typography
                                  variant="subtitle1"
                                  gutterBottom
                                  component="div"
                                  className="paymentSubtitle mb-0"
                                >
                                  {title.notification_msg}
                                </Typography>
                              </Box>
                            </Box>
                          );
                        })}
                      </Box>
                    </>
                  );
                })}
                <div className="pagination-section">
                  <Pagination
                    onChange={handlePageChange}
                    defaultPage={currentPage}
                    count={NumberofPages}
                    color="primary"
                  />
                </div>
              </div>
            ) : (
              <div
                style={{
                  alignItems: "center",
                  textAlign: "center",
                  padding: "10px",
                  background: "#e1e3e7",
                }}
                className="notification_no_records"
              >
                No Record Found
              </div>
            )}
          </Box>
        </Grid>
      </Grid>
    </Box>
  );
};

export default Notifications;
