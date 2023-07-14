import React from 'react'
import Container from '@mui/material/Container';
import Tabs from '@mui/material/Tabs';
import Tab from '@mui/material/Tab';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import PropTypes from 'prop-types';
import Modal from '@mui/material/Modal';
import TeacherDetails from './TeacherDetails';
import Reviews from './Reviews';
import ClassesDetail from './ClassesDetail';
import Input from '@mui/material/Input';
import * as yup from "yup";
import { useFormik } from "formik";
import Checkbox from '@mui/material/Checkbox';
import { FiHeart } from 'react-icons/fi';
import { FaHeart } from 'react-icons/fa';
import { BiBlock } from "react-icons/bi";
import { useDispatch } from 'react-redux';
import { addwishlist,removefromWishlist,ReportUser } from '../../../../../actions/frontent';
import IconButton from '@mui/material/IconButton';
import Menu from '@mui/material/Menu';
import MenuItem from '@mui/material/MenuItem';
import { BsThreeDotsVertical , BsFlag} from "react-icons/bs";

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


const validationSchema = yup.object({
  report_title: yup.string().required(" First Name is required"),
  report_description: yup.string().required(" Last Name is required"),
})
const TeacherTabs = ({ Id }) => {
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    border: '2px solid #000',
    borderRadius: '30px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const label = { inputProps: { 'aria-label': 'Checkbox demo' } };
  const [value, setValue] = React.useState(0);
  const [wishlists, setwishlist] = React.useState()
  const [openModal, setOpenModal] = React.useState(false);
  const dispatch = useDispatch()

  const [anchorEl, setAnchorEl] = React.useState(null);
  const open = Boolean(anchorEl);
  const handleClick = (event) => {
    setAnchorEl(event.currentTarget);
  };
  const handleClose = () => {
    setAnchorEl(null);
  };

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  const wishlist = (id) => {
    if(wishlists == 0){
      dispatch(addwishlist(id)).then((res) => {
        if (res.success == true) {
          setwishlist(1)
        } else {
          setwishlist(0)
        }
      }).catch((err) => {
        console.log(err)
      })
    }else{
      dispatch(removefromWishlist(id)).then((res)=>{
        if(res.success == true){
            setwishlist(0)
        }else{
            setwishlist(1)
        }
    }).catch((err)=>{
        console.log(err)
    })
    }
  };

  const handleOpenModal = () => {
    setOpenModal(true);
  };
  const handleCloseModal = () => {
    setOpenModal(false);
    setAnchorEl(null);
  };
  const formik = useFormik({
    initialValues: {
      report_title: '',
      report_description: '',
    },
    validationSchema: validationSchema,
    enableReinitialize: true,
    onSubmit: (values, {resetForm}) => {
      const formdata = {
        ...values,
         reported_to:Id
      };
      dispatch(ReportUser(formdata));
      handleCloseModal();
      resetForm({values : ''})

    },
  });
  const onReportUser = () => {
    // const data = {
    //   booking_id:booking_id,
    //   reason:reason
    // }
    // dispatch(ReportUser(data)).then((res)=>{
    //   console.log(res,'response')
    // }).catch((err)=>{
    //   console.log(err , 'error')
    // })
  }
  return (
    <div>
      <Box sx={{ width: '100%' }}>
        <Box className="tabsOuterContent">
          <Container className='tabContainer'>
            <Tabs value={value} onChange={handleChange} aria-label="basic tabs example">
              <Tab label="About" className="tabsHeading" {...a11yProps(0)} />
              <Tab label="Classes" className="tabsHeading" {...a11yProps(1)} />
              <Tab label="Reviews" className="tabsHeading" {...a11yProps(2)} />
            </Tabs>
            <div className='subcontainer'>
              <div onClick={() => wishlist(Id)} className='iconOuter'>
                {wishlists == 1 ? <FaHeart /> : <FiHeart />}
              </div>
              <div>
                <IconButton
                  aria-label="more"
                  id="long-button"
                  aria-controls={open ? 'long-menu' : undefined}
                  aria-expanded={open ? 'true' : undefined}
                  aria-haspopup="true"
                  onClick={handleClick}
                  className='iconOuter'
                >
                  <BsThreeDotsVertical />
                </IconButton>
                <Menu
                  anchorEl={anchorEl}
                  id="account-menu"
                  open={open}
                  onClose={handleClose}
                  onClick={handleClose}
                  PaperProps={{
                    elevation: 0,
                    sx: {
                      overflow: 'visible',
                      filter: 'drop-shadow(0px 2px 8px rgba(0,0,0,0.32))',
                      mt: 1.5,
                      '& .MuiAvatar-root': {
                        width: 32,
                        height: 32,
                        ml: -0.5,
                        mr: 1,
                      },
                      '&:before': {
                        content: '""',
                        display: 'block',
                        position: 'absolute',
                        top: 0,
                        right: 14,
                        width: 10,
                        height: 10,
                        bgcolor: 'background.paper',
                        transform: 'translateY(-50%) rotate(45deg)',
                        zIndex: 0,
                      },
                    },
                  }}
                  transformOrigin={{ horizontal: 'right', vertical: 'top' }}
                  anchorOrigin={{ horizontal: 'right', vertical: 'bottom' }}
                >
                  {/* <MenuItem onClick={handleClose} className='menuItem'> <BiBlock/> <span className='report-title'>Block user</span></MenuItem> */}
                  <MenuItem onClick={handleOpenModal} className='menuItem'> <BsFlag/> <span className='report-title'>Report user</span> </MenuItem>
                </Menu> 
              </div>
            </div>
            <Modal
              open={openModal}
              onClose={handleCloseModal}
              aria-labelledby="parent-modal-title"
              aria-describedby="parent-modal-description"
            >
              <Box sx={{ ...style, width: 457 }}>
                <h2 className="parent-modal-title">Report this user</h2>
                <div className="parent-modal-container">
                  <label> Title </label>
                  <Input
                    type="text"
                    className="FieldsText"
                    id="input-with-icon-adornment"
                    name='report_title'
                    // startAdornment={
                    //   <InputAdornment position="start">
                    //     <IoIosPhonePortrait />
                    //   </InputAdornment>
                    // }
                    placeholder='Reason for reporting'
                    value={formik.values.report_title}
                    onChange={formik.handleChange}
                    />
                    {formik.errors.report_title &&
                    formik.touched.report_title ? (
                      <div className="error_message">
                        {formik.errors.report_title}
                      </div>
                    ) : null}

                  <label> Description </label>
                  <Input
                    type="textarea"
                    className="FieldsText"
                    id="input-with-icon-adornment"
                    name='report_description'
                    // startAdornment={
                    //   <InputAdornment position="start">
                    //     <IoIosPhonePortrait />
                    //   </InputAdornment>
                    // }

        
                    placeholder='Brief description of the issue'

                   value={formik.values.report_description}
                    onChange={formik.handleChange}
                    />
                    {formik.errors.report_description &&
                    formik.touched.report_description ? (
                      <div className="error_message">
                        {formik.errors.report_description}
                      </div>
                    ) : null}
                  <div className='checked'>
                  <Checkbox {...label} defaultChecked />
                  <Typography variant="subtitle1" gutterBottom component="div" className="mb-0 conditions">
                    Do you also want to block this user?
                  </Typography>
                  </div>
                  <button className="modal-button" onClick={()=>formik.handleSubmit()}>CONFIRM REPORT</button>
                </div>
              </Box>
            </Modal>
          </Container>
        </Box>
        <TabPanel value={value} index={0}>
          <TeacherDetails Id={Id} setwishlist={setwishlist} />
        </TabPanel>
        <TabPanel value={value} index={1} className="classWrapper">
          <ClassesDetail Id={Id} />
        </TabPanel>
        <TabPanel value={value} index={2}>
          <Reviews Id={Id} />
        </TabPanel>
      </Box>
    </div>
  )
}

export default TeacherTabs;
