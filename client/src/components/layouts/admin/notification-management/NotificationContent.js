import React from "react";
import Grid from "@mui/material/Grid";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import Footer from "../Footer";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Accordion from "@mui/material/Accordion";
import AccordionSummary from "@mui/material/AccordionSummary";
import AccordionDetails from "@mui/material/AccordionDetails";
import NotificationTable from "./NotificationTable";
import AdminNotificationTable from "./AdminNotificationTable";
import { FiChevronUp } from "react-icons/fi";
import {
  getEmailTemplateNotificationsList,
  updateEmailTemplateNotificationsList,
} from "../../../../actions/sessions";
import { connect } from "react-redux";
import Loader from "../../../Loader";

const NotificationContent = ({
  getEmailTemplateNotificationsList,
  updateEmailTemplateNotificationsList,
}) => {
  const [expanded, setExpanded] = React.useState("panel1");
  const [apiHit, setApiHit] = React.useState(false);
  const [notificationMessage, setNotificationMessage] = React.useState(false);
  const handleChange = (panel) => (event, newExpanded) => {
    setExpanded(newExpanded ? panel : false);
  };
  React.useEffect(() => {
    getEmailTemplateNotificationsList().then((res) => {
      if (res && res.success) {
        setApiHit(true);
      }
    });
  }, []);
  const updateEmailTemplatesList = (data) => {
    setNotificationMessage(false);

    var dataObject = {};
    dataObject._id = data._id;
    dataObject.notification_status = !data.notification_status;
    dataObject.updated_at = new Date();
    console.log(dataObject);

    updateEmailTemplateNotificationsList(dataObject).then((res) => {
      if (res && res.success) {
        setNotificationMessage(true);
      }
    });
  };
  return (
    <>
      <section className="notification-page">
        <Grid container className="p-3 main-head-dashboard">
          <Grid item xs={6} md={6} lg={6} xl={6}>
            <Typography variant="h5">Notification Management</Typography>
          </Grid>
          <Grid item xs={6} md={6} lg={6} xl={6}>
            <Typography variant="body1" align="right">
              Notification Management
            </Typography>
          </Grid>
        </Grid>

        <Grid container className="p-3 accrd-notify-section">
          <Grid item xs={12} md={12} lg={12} xl={12}>
            {console.log(notificationMessage)}
            {!apiHit ? (
              <div className="mt-5 mb-5">
                <Loader />
              </div>
            ) : (
              <>
                {notificationMessage ? (
                  <Box className="alert alert-success">
                    Email notification status changed successfully
                  </Box>
                ) : (
                  <Box></Box>
                )}
                <Accordion
                  expanded={expanded === "panel1"}
                  onChange={handleChange("panel1")}
                >
                  <AccordionSummary
                    expandIcon={<FiChevronUp />}
                    aria-controls="panel1a-content"
                    id="panel1a-header"
                  >
                    <Typography variant="body2">
                      User Management Module Notifications
                    </Typography>
                  </AccordionSummary>

                  <AccordionDetails>
                    <div className="accordion-content">
                      <Typography variant="h6" className="mt-2 mb-3">
                        These email notifications are sent to All User Types{" "}
                      </Typography>
                      <NotificationTable
                        updateEmailTemplatesList={updateEmailTemplatesList}
                      />
                      <Typography variant="h6" className="mt-3 mb-3">
                        These email notifications are sent to Administrators
                        Only
                      </Typography>
                      <AdminNotificationTable
                        updateEmailTemplatesList={updateEmailTemplatesList}
                      />
                    </div>
                  </AccordionDetails>
                </Accordion>
              </>
            )}

            {/* <Accordion expanded={expanded === 'panel2'} onChange={handleChange('panel2')}>
                            <AccordionSummary
                                expandIcon={<FiChevronUp />}
                                aria-controls="panel2a-content"
                                id="panel2a-header"
                            >
                                <Typography variant="body2">Class & Session Module Notifications</Typography>
                            </AccordionSummary>
                            <AccordionDetails>
                                <Typography>
                                    Lorem ipsum dolor sit amet, consectetur adipiscing elit. Suspendisse
                                    malesuada lacus ex, sit amet blandit leo lobortis eget.
                                </Typography>
                            </AccordionDetails>
                        </Accordion> */}
          </Grid>
        </Grid>
      </section>
      <Footer />
    </>
  );
};
const mapStateToProps = (state) => ({
  auth: state.auth,
});

export default connect(mapStateToProps, {
  getEmailTemplateNotificationsList,
  updateEmailTemplateNotificationsList,
})(NotificationContent);
