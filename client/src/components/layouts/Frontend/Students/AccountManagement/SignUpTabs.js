import React, { useEffect ,useState} from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import PropTypes from 'prop-types';
import StudentForm from './StudentForm';
import TeacherForm from '../../Teachers/AccountManagement/TeacherForm';
import { useLocation } from 'react-router-dom';
import { getMessaging , getToken } from "firebase/messaging";
import {app} from '../../../../../firebase';
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
          <Box className="mob--form" sx={{ p: 3 }}>
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
const SignUpTabs = () => {
  const location = useLocation()
  const messaging = getMessaging(app);
    const [value, setValue] = React.useState(0);
    const [fcm_token , setfcm_token] = useState();
    const [Ip , setIp] = useState();
    const handleChange = (event, newValue) => {
    setValue(newValue);
    };

    useEffect(()=>{
      if(location.pathname == "/students/sign-up"){
        setValue(0)
      }else{
        setValue(1)
      }
      fetch("https://api.ipify.org?format=json")
      .then((response) => response.json())
      .then((data)=> setIp(data.ip))
      getToken(messaging, { vapidKey: 'BG_ff9xfhUXwax2eWj-6ikGC2Mm_Mgcygj56YwkgcLZZBC4X_oX25bmroUZLxXsirFjmB5ZUlPYHF1oBYarse_I' }).then((currentToken) => {
          if (currentToken) {
            console.log(currentToken , "current Token")
            setfcm_token(currentToken)
          } else {
            // Show permission request UI
            console.log('No registration token available. Request permission to generate one.');
            // ...
          }
        }).catch((err) => {
          console.log('An error occurred while retrieving token. ', err);
          // ...
        });
         
    },[])
    return (
        <Box className="SignUptabs">
            <Box sx={{ width: '100%' }}>
                <Box>
                    <Container>
                    <Tabs value={value} onChange={handleChange} aria-label="basic tabs example" className="loginTabsOuter"> 
                    <Tab label="Student" className="loginTabs" {...a11yProps(0)} />
                    <Tab label="Teacher" className="loginTabs" {...a11yProps(1)} />
                    </Tabs>
                    </Container>
                </Box>
                <TabPanel value={value} index={0}>
                    <StudentForm
                    fcm_token={fcm_token}
                    Ip={Ip}
                    />
                 </TabPanel>
                <TabPanel value={value} index={1}>
                   <TeacherForm 
                     fcm_token={fcm_token}
                     Ip={Ip}
                   />
                </TabPanel>
                </Box>
        </Box>
    )
}

export default SignUpTabs
