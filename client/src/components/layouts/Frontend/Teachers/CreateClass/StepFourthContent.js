import React from 'react'
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';

const StepFourthContent = () => {
    return (
        <Box>
        <Typography variant="h5" gutterBottom component="div" className="mt-4 stepsHeading">On Demand Classes are based on your availability</Typography>
        <Typography variant="subtitle1" gutterBottom component="div" className="subtitleee">Please make sure you always keep your <Link to="/" className="availabilityLink">availability settings</Link> up to date. You will be</Typography>
        </Box>
    )
}

export default StepFourthContent
