import React from 'react';
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import SearchByPage from './SearchByPage';
import FilterByPageStatus from './FilterByPageStatus';
import PageListTable from './PageListTable';
import FilterByTag from './FilterByTag';
import '../../../../css/admin/content-management.css';
import ContentTagsList from './ContentTagsList';
import Footer from '../Footer';

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
          <div>{children}</div>
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

const ManagementContent = () => {
  const [value, setValue] = React.useState(0);
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };

  return (
    <>
      <Grid container className="p-3 main-cnt-head">
        <Grid item xs={6} md={6}>
          <Typography variant="h5">Content Management</Typography>
        </Grid>
        <Grid item xs={6} md={6}>
          <Typography align="right" variant="body1">Content Management</Typography>
        </Grid>
      </Grid>
      <Grid container className="p-3">
        <Grid item xs={12} md={12} lg={12} xl={12}>
          <Paper className="page-tab-section">
            <Box sx={{ width: '100%' }}>
              <Box sx={{ borderBottom: 1, borderColor: 'divider' }} className="content-dash-tabs">
                <Tabs value={value} onChange={handleChange} aria-label="pages tabs">
                  <Tab label="Static Pages" {...a11yProps(0)} />
                  <Tab label="Tags" {...a11yProps(1)} />
                </Tabs>
              </Box>
              <TabPanel value={value} index={0}>
                {/* <Box sx={{
                  display: 'flex',
                  backgroundColor: 'rgb(106 113 135 / 10%)'
                }}>
                  <Grid container className="p-3 top-btm" spacing={2}>
                    <Grid item xs={12} md={5} lg={5} xl={5} className="srch-page-fld">
                      <SearchByPage />
                    </Grid>
                    <Grid item xs={12} md={3} lg={3} xl={3} className="filter-page-slct">
                      <FilterByPageStatus />
                    </Grid>
                  </Grid>

                </Box> */}
                <Box className="table-pagelist">
                  <PageListTable />
                </Box>
              </TabPanel>
              <TabPanel value={value} index={1} className="tags-details">
                {/* <FilterByTag /> */}
                <ContentTagsList />
              </TabPanel>
            </Box>
          </Paper>
        </Grid>
      </Grid>

      <Footer />
    </>


  );
}

export default ManagementContent;
