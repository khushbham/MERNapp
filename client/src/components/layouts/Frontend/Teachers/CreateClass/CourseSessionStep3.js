import React,{useEffect} from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import { getDropdownValues } from '../../../../../actions/frontent';
import { useDispatch } from 'react-redux';
const CourseSessionStep3 = (props) => {
    const { formik, setAddress ,setcordinates } = props
    const dispatch = useDispatch() 
    const [sessiontype , setSessiontype] = React.useState();

    useEffect(()=>{
        dispatch(getDropdownValues()).then((res)=>{
            setSessiontype(res.data.filter((a) => {
                if (a.name == "session_type") {
                  return a;
                }
              })[0].options)
        })
      },[])
      
      const handleAddress = (e) => {
          setAddress(e);
          geocodeByAddress(e)
         .then(results => getLatLng(results[0]))
         .then(({ lat, lng }) =>
         setcordinates({lat,lng })
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
                  Session Type
                  </InputLabel>
                    <Select sx={{ mb: 1 }} 
                    name="session_type"
                    className="StepsFields"
                    inputProps={{ 'aria-label': 'Without label' }}
                    value={formik.values.session_type}
                    onChange={formik.handleChange}
                    error={
                      formik.touched.session_type &&
                      Boolean(formik.errors.session_type)
                    }
                    >
          {sessiontype?.map((arr,i)=>{
                        return <MenuItem value={i} className="d-block p-2">{arr}</MenuItem>
                   })}
                    </Select>
                    {formik.errors.session_type && formik.touched.session_type ? (
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
          </FormControl>
        ) : (
          ""
        )}
                <FormControl className="selectDropdown w-100 mb-2 students_many">
                  <InputLabel shrink htmlFor="student-name" className="studentNameLabel">
                  How many students will be allowed to attend?
                  </InputLabel>
                    <Select sx={{ mb: 1 }} 
                    className="StepsFields"
                    name='max_students_allowed'
                    inputProps={{ 'aria-label': 'Without label' }}
                    value={formik.values.max_students_allowed}
                    onChange={formik.handleChange}
                    >
                    <MenuItem value={1} className="d-block p-2">1</MenuItem>
                    <MenuItem value={2} className="d-block p-2">2</MenuItem>
                    <MenuItem value={3}className="d-block p-2">3</MenuItem>
                    <MenuItem value={4} className="d-block p-2">4</MenuItem>
                    <MenuItem value={5} className="d-block p-2">5</MenuItem>
                    <MenuItem value={6} className="d-block p-2">6</MenuItem>
                    <MenuItem value={7} className="d-block p-2">7</MenuItem> 
                    <MenuItem value={8} className="d-block p-2">8</MenuItem> 
                    {/* <MenuItem value={9} className="d-block p-2">9</MenuItem> */}
                    </Select>
                  </FormControl>
            <Box>
            <Typography variant="caption" display="block" gutterBottom align='right' className="policyInstructions SubText">*Max: 8</Typography>
            </Box>
            </Box>
        </Box>
    )
}

export default CourseSessionStep3
