import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import 'react-modern-calendar-datepicker/lib/DatePicker.css';
import '../../../../css/admin/student.css';
import '../../../../css/admin/financials.css';
import PaymentData from './PaymentData';
import Payout from './Payout';
import RefundListing from './RefundListing';

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
        <Box>
          <Typography
            component="div"
          >{children}</Typography>
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
    'aria-controls': `simple-tabpanel-${index}`,
  };
}
function FinancialTabs() {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  return (
    <>
      <Grid container className="p-3 pb-0 main-head-dashboard">
        <Grid item xs={6} md={6}>
          <Typography variant="h5">Payments & Payouts</Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography align="right" variant="body1">Financial Management</Typography>
        </Grid>
      </Grid>
      <Grid container className="p-3" columnSpacing={{ xs: 1, sm: 2, md: 3 }}>
        <Grid item xs={12} md={12} lg={12} className="mr-3 ">
          <Paper className="p-0">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                <Tabs value={value} onChange={handleChange} aria-label="tabs-basic-info" className="tabs-payments-info">
                  <Tab label="PAYMENTS" {...a11yProps(0)} />
                  <Tab label="PAYOUTS" {...a11yProps(1)} />
                  <Tab label="REFUNDS" {...a11yProps(2)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                <div className="payoutHead">
                  <PaymentData />
                </div>
              </TabPanel>
              <TabPanel value={value} index={1}>
                <Payout />
              </TabPanel>
              <TabPanel value={value} index={2}>
                <RefundListing />
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </>
  );
}
export default FinancialTabs;
