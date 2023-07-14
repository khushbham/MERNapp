import React, { useEffect } from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import NativeSelect from '@mui/material/NativeSelect';
import TextField from '@mui/material/TextField';
import MenuItem from '@mui/material/MenuItem';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { useDispatch } from 'react-redux';
import Select from '@mui/material/Select';
import { getDropdownValues } from '../../../../../actions/frontent';

const StepThreeContent = (props) => {
  const { formik, setAddress, setcordinates,addressmessage , setAddressmessage , sessionerror,priceerror,sessiontypeerror} = props
  const dispatch = useDispatch()
  const [SessionDuration, setSessinDuration] = React.useState();
  const [Sessiontype, setSessiontype] = React.useState();
  const [Session, setVal] = React.useState('');
  const handleChange = (event) => {
    setVal(event.target.value);
  };
  const [SessionType, setType] = React.useState('');
  const ChangeVal = (event) => {
    setType(event.target.value);
  };

  useEffect(() => {
    dispatch(getDropdownValues()).then((res) => {
      //  console.log(res,"response")
      setSessinDuration(res.data.filter((a) => {
        if (a.name == "duration") {
          return a;
        }
      })[0].options)

      setSessiontype(res.data.filter((a) => {
        if (a.name == "session_type") {
          return a;
        }
      })[0].options)
    })

  }, [])
  const handleAddress = (e) => {

    setAddress(e);
    geocodeByAddress(e)
      .then(results => getLatLng(results[0]))
      .then(({ lat, lng }) =>
        setcordinates({ lat, lng })
      );

  };

  return (
    <Box>
      <Box className="my-4">
        <Typography variant="h3" gutterBottom component="div" className="mb-0"> How would you like the session to be?</Typography>
        <Typography variant="subtitle1" gutterBottom component="div" className="mb-0">Online or local. Private or group… it’s your call. Please complete the form below</Typography>
      </Box>
      <Box ClassName="StepsForm">
        <FormControl className="selectDropdown w-100 mb-2">
          <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
            Session Duration
          </InputLabel> 
          <Select sx={{ mb: 1 }}
            //value={Session}
            //onChange={handleChange}
            name='session_duration'
            className="StepsFields"
            inputProps={{ 'aria-label': 'Without label' }}
            value={formik.values.session_duration}
            onChange={formik.handleChange}
          // error={formik.touched.session_duration && Boolean(formik.errors.session_duration)}
          // helperText={formik.touched.session_duration && formik.errors.session_duration}
          >
            {SessionDuration?.map((arr, i) => {
              return <MenuItem value={i} className="d-block p-2">{arr}</MenuItem>
            })}
          </Select>
          {sessionerror ? (
            <div className="error_message">Session Duration is Required</div>
          ) : null}
        </FormControl>
        <FormControl className="selectDropdown w-100 mb-2">
          <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
            Session Type
          </InputLabel>
          <Select sx={{ mb: 1 }}
            className="StepsFields"
            inputProps={{'aria-label': 'Without label' }}
            name='session_type'
            value={formik.values.session_type}
            onChange={formik.handleChange}
          >
            {Sessiontype?.map((arr, i) => {
              return <MenuItem value={i} className="d-block p-2">{arr}</MenuItem>
            })}
          </Select>
          {sessiontypeerror? (
            <div className="error_message">{formik.errors.session_type}</div>
          ) : null}
        </FormControl>
        {formik.values.session_type == 1 ? (
          <FormControl variant="standard" className="w-100 my-2 auto_inpt_box">
            <InputLabel
              shrink
              htmlFor="student-name"
              className="studentNameLabel"
            >
              Address
            </InputLabel>
            <Box className="map_cmplt">
              <GooglePlacesAutocomplete
                apiKey={"AIzaSyDHG3-7xfdn3RyvqGlj9DfsPfJ9aAFCD54"}
                selectProps={{
                  placeholder: "Address *",
                  name: "address",
                  onChange: (place) => {
                    handleAddress(place.label);
                    console.log(place);
                  },
                }}
              />
            </Box>
            {/* <TextField
              sx={{ mb: 1 }}
              required
              fullWidth
              name="address_or_class_link"
              id="name"
              variant="standard"
              placeholder=""
              className="StepsFields"
              value={formik.values.address_or_class_link}
              onChange={formik.handleChange}
            /> */}
            {addressmessage ? (<div className="error_message">Address is required </div>):("")}

          </FormControl>
        ) : (
          ""
        )}
        <FormControl variant="standard" className="w-100 my-2">
          <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
            Price per Student
          </InputLabel>
          <TextField sx={{ mb: 1 }}
            required
            fullWidth
            name="price"
            id="name"
            variant="standard"
            placeholder="$ 30.00"
            className="StepsFields"
            value={formik.values.price}
            onChange={formik.handleChange}
            error={formik.touched.price && Boolean(formik.errors.price)}
          />
          {priceerror ? (<div className='error_message'>{formik.errors.price}</div>) : null}
        </FormControl>
        <Box>
          <Typography variant="caption" display="block" gutterBottom align='right' className="SubText policyInstructions"> *Subject to the sites cancellation policy.</Typography>
        </Box>
      </Box>
    </Box>
  )
}

export default StepThreeContent
