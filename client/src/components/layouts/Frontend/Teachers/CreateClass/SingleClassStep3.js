import React, { useEffect } from "react";
import Box from "@mui/material/Box";
import Typography from "@mui/material/Typography";
import InputLabel from "@mui/material/InputLabel";
import FormControl from "@mui/material/FormControl";
import NativeSelect from "@mui/material/NativeSelect";
import TextField from "@mui/material/TextField";
import MenuItem from "@mui/material/MenuItem";
import GooglePlacesAutocomplete, {
  geocodeByAddress,
  getLatLng,
} from "react-google-places-autocomplete";
import Select from "@mui/material/Select";
import { getDropdownValues } from "../../../../../actions/frontent";
import { useDispatch } from "react-redux";
const SingleClassStep3 = (props) => {
  const { formik , setAddress ,setcordinates, addressmessage, maxerror} = props;
  const dispatch = useDispatch();
  //const [SessionDuration, setSessinDuration] = React.useState();
  const [Sessiontype, setSessiontype] = React.useState();
  // const [Session, setVal] = React.useState('');
  // const handleChange = (event) => {
  //     setVal(event.target.value);
  // };
  // const [SessionType, setType] = React.useState('');
  // const ChangeVal = (event) => {
  //     setType(event.target.value);
  // };
  // console.log(formik.values.session_type , "lsdkfhksjd")
  useEffect(() => {
    dispatch(getDropdownValues()).then((res) => {
      setSessiontype(
        res.data.filter((a) => {
          if (a.name == "session_type") {
            return a;
          }
        })[0].options
      );
    });
  }, []);
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
        <Typography variant="h3" gutterBottom component="div" className="mb-0">
          {" "}
          How would you How would you like the session to be?
        </Typography>
        <Typography
          variant="subtitle1"
          gutterBottom
          component="div"
          className="mb-0"
        >
          Online or local. Private or group… it’s your call. Please complete the
          form below
        </Typography>
      </Box>
      <Box ClassName="StepsForm">
        <FormControl className="selectDropdown w-100 mb-2">
          <InputLabel
            shrink
            htmlFor="student-name"
            className="studentNameLabel"
          >
            Session Type
          </InputLabel>
          <Select
            sx={{ mb: 1 }}
            className="StepsFields"
            inputProps={{ "aria-label": "Without label" }}
            name="session_type"
            value={formik.values.session_type}
            onChange={formik.handleChange}
            error={
              formik.touched.session_type && Boolean(formik.errors.session_type)
            }
          >
            {Sessiontype?.map((arr, i) => {
              return (
                <MenuItem value={i} className="d-block p-2">
                  {arr}
                </MenuItem>
              );
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
              {addressmessage ? (<div className="error_message">Address is Required</div>):("")}
          </FormControl>
        ) : (
          ""
        )}
        <FormControl className="selectDropdown w-100 mb-2 students_many">
          <InputLabel
            shrink
            htmlFor="student-name"
            className="studentNameLabel"
          >
            How many students will be allowed to attend?
          </InputLabel>
          <Select
            sx={{ mb: 1 }}
            className="StepsFields"
            inputProps={{ "aria-label": "Without label" }}
            name="max_students_allowed"
            value={formik.values.max_students_allowed}
            onChange={formik.handleChange}
          >
            <MenuItem value={1} className="d-block p-2">
              1
            </MenuItem>
            <MenuItem value={2} className="d-block p-2">
              2
            </MenuItem>
            <MenuItem value={3} className="d-block p-2">
              3
            </MenuItem>
            <MenuItem value={4} className="d-block p-2">
              4
            </MenuItem>
            <MenuItem value={5} className="d-block p-2">
              5
            </MenuItem>
            <MenuItem value={6} className="d-block p-2">
              6
            </MenuItem>
            <MenuItem value={7} className="d-block p-2">
              7
            </MenuItem>
            <MenuItem value={8} className="d-block p-2">
              8
            </MenuItem>
          </Select>
          {maxerror ? (
            <div className="error_message">this field is mandatory</div>
          ) : ''}
        </FormControl>
        <Box>
          <Typography
            variant="caption"
            display="block"
            gutterBottom
            SubText
            align="right"
            className="SubText policyInstructions"
          >
            {" "}
            *Subject to the sites cancellation policy.
          </Typography>
        </Box>
      </Box>
    </Box>
  );
};

export default SingleClassStep3;
