import React from 'react'
import Box from "@mui/material/Box";
import Navbar from '../../Navbar';
import CalendarTabs from './CalendarTabs';
const Calendar = () => {
    return (
        <Box>
            <Navbar />
            <CalendarTabs />
        </Box>
    )
}

export default Calendar
