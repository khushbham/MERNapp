import React from 'react'
import PropTypes from 'prop-types';
import Tabs from '@mui/material/Tabs';
import Grid from '@mui/material/Grid';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import { FaRegEdit } from 'react-icons/fa';
import {IoMdNotifications} from 'react-icons/io';
import {AiOutlineHeart} from 'react-icons/ai';
import {MdOutlinePayment} from 'react-icons/md';
import {AiOutlineUser} from 'react-icons/ai';
import {CgSupport} from 'react-icons/cg';
import Notifications from './Notifications';
import EditBasicInfo from './EditBasicInfo';
function TabPanel(props) {
    const { children, value, index, ...other } = props;
    return (
      <div
        role="tabpanel"
        hidden={value !== index}
        id={`vertical-tabpanel-${index}`}
        aria-labelledby={`vertical-tab-${index}`}
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
      id: `vertical-tab-${index}`,
      'aria-controls': `vertical-tabpanel-${index}`,
    };
  }
const AccountSidebar = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };
    return (
        <Grid container>
          <Grid item lg={8} sm={8} md={12} className="m-auto informationSidebar my-4">
               <Box
                sx={{ flexGrow: 1, display: 'flex'}}
                >
                    <Grid container>
                        <Grid item lg={4} sm={4} md={12}>
                            <Tabs
                                orientation="vertical"
                                value={value}
                                onChange={handleChange}
                                aria-label="Vertical tabs example"
                                sx={{ borderRight: 1, borderColor: 'divider' }}
                                >
                                <Typography variant="h6" gutterBottom component="div" className="AccountName">Account Settings</Typography>
                                <Tab icon={<FaRegEdit />}  label="Edit Basic Information" className="sideBarTitle" {...a11yProps(1)} />
                                <Tab icon={<IoMdNotifications />} label="Notifications" className="sideBarTitle" {...a11yProps(2)} />
                                <Typography variant="h6" gutterBottom component="div" className="AccountName">My Student Profile</Typography>
                                <Tab icon={<AiOutlineUser/> }label="View Public Profile" className="sideBarTitle" {...a11yProps(3)} />
                                <Tab icon={<AiOutlineHeart />} label="My Favorites" className="sideBarTitle" {...a11yProps(4)} />
                                <Tab icon={<MdOutlinePayment />} label="My Payments" className="sideBarTitle" {...a11yProps(5)} />

                                <Typography variant="h6" gutterBottom component="div" className="AccountName">File a Support Ticket</Typography>
                                <Tab  icon={<CgSupport />} label="File a Support Ticket" className="sideBarTitle" {...a11yProps(6)} />
                            </Tabs>
                        </Grid>
                        <Grid item lg={8} sm={8} md={12}>
                            <TabPanel value={value} index={1}>
                            <EditBasicInfo />
                            </TabPanel>
                            <TabPanel value={value} index={2}>
                            <Notifications/>
                            </TabPanel>
                            <TabPanel value={value} index={3}>
                            Item Four
                            </TabPanel>
                            <TabPanel value={value} index={4}>
                            <MyFavourite/>
                            </TabPanel>
                            <TabPanel value={value} index={5}>
                            Item Six
                            </TabPanel>
                        </Grid>
                    </Grid>
                </Box>
             </Grid>
        </Grid>
    )
}

export default AccountSidebar
