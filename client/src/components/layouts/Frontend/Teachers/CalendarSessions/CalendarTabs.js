import React from "react";
import PropTypes from "prop-types";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Container from "@mui/material/Container";
import MySessions from "./MySessions";
import SetAvailability from "../CalendarAvailability/SetAvailability";
function TabPanel(props) {
  const { children, value, index, ...other } = props;
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`simple-tabpanel-${index}`}
      aria-labelledby={`simple-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          <Typography>{children}</Typography>
        </Box>
      )}
    </div>
  );
}
TabPanel.propTypes = {
  children: PropTypes.node,
  index: PropTypes.number.isRequired,
  value: PropTypes.number.isRequired,
};
function a11yProps(index) {
  return {
    id: `simple-tab-${index}`,
    "aria-controls": `simple-tabpanel-${index}`,
  };
}
const CalendarTabs = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const show = queryParams.get("show");
  const [value, setValue] = React.useState(show && show == "availability" ? 1 : 0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <Container>
      <Box sx={{ width: "100%" }} className="my-2 SessionsOuter">
        <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
          <Tabs
            value={value}
            onChange={handleChange}
            aria-label="basic tabs example"
          >
            <Tab
              label="My Sessions"
              className="tabssHeading"
              {...a11yProps(0)}
            />
            <Tab
              label="Availability"
              className="tabssHeading"
              {...a11yProps(1)}
            />
          </Tabs>
        </Box>
        <TabPanel value={value} index={0}>
          <MySessions />
        </TabPanel>
        <TabPanel value={value} index={1}>
          <SetAvailability />
        </TabPanel>
      </Box>
    </Container>
  );
};

export default CalendarTabs;
