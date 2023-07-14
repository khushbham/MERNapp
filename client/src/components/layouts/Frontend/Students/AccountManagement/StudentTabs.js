import React, { useEffect } from 'react'
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Reviews from '../../StudentProfile/Reviews';
import StudentDetail from '../../StudentProfile/StudentDetail';
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
  
const StudentTabs = () => {
    const [value, setValue] = React.useState(0);
    const handleChange = (event, newValue) => {
      setValue(newValue);
    };

    // useEffect(()=>{
    //  console.log(window.location.href , 'window') 
    // },[])
    return (
        <div>
            <Box sx={{ width: '100%' }}>
                <Box className="tabsOuterContent">
                    <Container>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
                    <Tab label="About" className="tabsHeading" {...a11yProps(0)} />
                    <Tab label="Reviews" className="tabsHeading" {...a11yProps(1)} />
                    </Tabs>
                    </Container>
                </Box>
                <TabPanel value={value} index={0}>
                    <StudentDetail/>
                 </TabPanel>
                <TabPanel value={value} index={1}>
                  <Reviews/>
                </TabPanel>
                </Box>
        </div>
    )
}

export default StudentTabs
