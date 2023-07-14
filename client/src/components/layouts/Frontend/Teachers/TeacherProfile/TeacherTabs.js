import React from 'react'
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import TeacherDetails from './TeacherDetails';
import TeacherClassDetail from './TeacherClassDetail';
import Reviews from './Reviews';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { useDispatch } from 'react-redux';
import { addwishlist } from '../../../../../actions/frontent';

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

const TeacherTabs = () => {
  const queryParams = new URLSearchParams(window.location.search);
  const show = queryParams.get("show");
  const [value, setValue] = React.useState(show && show == "classes" ? 1 : 0);
  const [wishlists, setwishlist] = React.useState(false)
  const dispatch = useDispatch()
  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const wishlist = (id) => {
    dispatch(addwishlist(id)).then((res) => {
      if (res.success == true) {
        setwishlist(true)
      } else {
        setwishlist(false)
      }
    }).catch((err) => {
      console.log(err)
    })
  }
  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Box className="tabsOuterContent">
          <Container>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="About" className="tabsHeading" {...a11yProps(0)} />
              <Tab label="Classes" className="tabsHeading" {...a11yProps(1)} />
              <Tab label="Reviews" className="tabsHeading" {...a11yProps(2)} />
            </Tabs>
          </Container>
        </Box>
        <TabPanel value={value} index={0}>
          <TeacherDetails />
        </TabPanel>
        <TabPanel value={value} index={1} className="classWrapper">
          <TeacherClassDetail />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Reviews />
        </TabPanel>
      </Box>
    </div>
  )
}

export default TeacherTabs
