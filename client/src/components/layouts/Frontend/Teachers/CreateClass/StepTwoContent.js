import React from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import Radio from '@mui/material/Radio';
import RadioGroup from '@mui/material/RadioGroup';
import FormControlLabel from '@mui/material/FormControlLabel';
import FormControl from '@mui/material/FormControl';
import FormLabel from '@mui/material/FormLabel'
const StepTwoContent = (props) => {
    
 const [SetVal, setActiveStep] = React.useState();

    return (
        <Box>
            <Box className="my-4">
            <Typography variant="h3" gutterBottom component="div" className="mb-0"> What type of class are you creating? </Typography>
            <Typography variant="subtitle1" gutterBottom component="div" className="mb-0">Please select one of the options below</Typography>
            </Box>
            <FormControl>
            <Box className="customRadioBtn">
                <label for="type1">
                <input type="radio" id="type1" name="radio-group" className="inputsWrap" value={1} onChange={(e) => props.selectedTypeHandler(e.target.value)} />
                    <Box className="classesType">
                    <Typography variant="h6" gutterBottom component="div" className="mb-0 classeHeading">On Demand (Private Only)</Typography>
                    <Typography variant="subtitle1" gutterBottom component="div"> Students will schedule a session based on your availability</Typography>
                    </Box>
                </label>
                <label for="type2">
                <input type="radio" id="type2" name="radio-group" className="inputsWrap" value={2} onChange={(e) => props.selectedTypeHandler(e.target.value)} />
                    <Box className="classesType">
                    <Typography variant="h6" gutterBottom component="div" className="mb-0 classeHeading">  Single Class (Private or Group)</Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">  Students will sign up for one session on a date and time specified by you</Typography>
                    </Box>
                </label>
                <label for="type3">
                <input type="radio" id="type3" name="radio-group" className="inputsWrap" value={3} onChange={(e) => props.selectedTypeHandler(e.target.value)} />
                    <Box className="classesType">
                    <Typography variant="h6" gutterBottom component="div" className="mb-0 classeHeading">  Course (Private or Group)</Typography>
                    <Typography variant="subtitle1" gutterBottom component="div">  Students will sign up for 2 or more sessions on dates and times specified by you</Typography>
                    </Box>
                </label>
            </Box>
            </FormControl>
        </Box>
    )
}

export default StepTwoContent
