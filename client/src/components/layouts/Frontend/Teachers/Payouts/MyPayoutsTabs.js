import React, { useEffect } from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import DebitCardInfo from './DebitCardInfo';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';

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
      'aria-controls': `simple-tabpanel-${index}`,
    };
  }
const MyPayoutTabs = () => {
const [value, setValue] = React.useState(0);
const handleChange = (event, newValue) => {
  setValue(newValue);
};
    return (
      <Grid container> 
          <Grid item lg={6} sm={10} md={8} xs={12} className="m-auto PayoutTabsOuter mb-4">
            <Box sx={{ width: '100%' }}>
                <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab className="payoutTabsLabel" label="Account Info" {...a11yProps(0)} />
                    </Tabs>
                </Box>
                <TabPanel value={value} index={0}>
                < DebitCardInfo />
                </TabPanel>
            </Box>
          </Grid>
        </Grid>
    )
}

export default MyPayoutTabs
