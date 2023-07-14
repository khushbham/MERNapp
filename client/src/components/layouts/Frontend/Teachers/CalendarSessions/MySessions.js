import React, {useState} from 'react'
import Box from '@mui/material/Box';
import "react-modern-calendar-datepicker/lib/DatePicker.css";
import { Calendar } from "react-modern-calendar-datepicker";
import Grid from "@mui/material/Grid";
import Typography from '@mui/material/Typography';
import { Link, useHistory } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getSessionsOfSelectedMonth } from '../../../../../actions/frontent';
import { useEffect } from 'react';
import moment from 'moment';
import { Button } from '@mui/material';
const MySessions = () => {
    const defaultValue = {
        year: new Date().getFullYear(),
        month: new Date().getMonth() + 1,
        day: new Date().getDate(),
      };
// const date = new Date()
const [selectedDay , setSelectedDay] = useState(defaultValue)
const [sessiondata , setsessiondata] = useState([])
const [changeDay , setchangeDay] = useState(false)

const dispatch = useDispatch()
const history = useHistory()

const getSessionsOfmonth = () =>{
    dispatch(getSessionsOfSelectedMonth(selectedDay)).then((res)=>{
        if(changeDay)
        {  
        setsessiondata(res.data.filter((arr)=>{
            if(arr.day_of_class == selectedDay?.day)
            return arr
          }))
        } else{
            setsessiondata(res.data)
        }  
    }).catch((err)=>{
        console.log(err)
    })
  }
   const datechange=(e)=>{
    setchangeDay(true)
    setSelectedDay(e)   
      }

 useEffect(()=>{
    getSessionsOfmonth()
    },[selectedDay])

const onClick=(value,class_id)=>{
    // window.location = `/video-session?id=${value}&class_id=${class_id}`
    history.push({
        pathname:`/teacher/session-details`,
            search:`id=${value}&class_id=${class_id}`,
            state: { 
            id: value,
            class_id:class_id
               } 
            })
   }

const tConvert = (time24) => {
    const [sHours, minutes] = time24.match(/([0-9]{1,2}):([0-9]{1,2})/).slice(1);
    const period = +sHours < 12 ? 'AM' : 'PM';
    const hours = +sHours % 12 || 12;
    var updatedMinutes = minutes.toLocaleString("en-US", {
        minimumIntegerDigits: 2,
        useGrouping: false,
      });
      if (updatedMinutes.length == 1) {
        updatedMinutes = updatedMinutes + "0";
      }
      return `${hours}:${updatedMinutes} ${period}`;
}

    return (
        <Box className="calendarSec">
          <Grid container spacing={6}>
               <Grid item lg={5} md={6} sm={12} xs={12} className="SessionsCalendar">
                    <Calendar 
                        className="SessionsCalendar"
                        value={selectedDay}
                        onChange={(e)=>datechange(e)}
                        shouldHighlightWeekends
                    />
               </Grid>
             
               <Grid item lg={6} md={6} sm={12} xs={12} className="sessionlist ml-auto">
               <Typography variant="h3" gutterBottom component="div" className="classesHeading mb-4">
                 Session List
                 </Typography>
               {sessiondata?.length ? (
                <div>
               {sessiondata?.map((value)=>(
                   <Button onClick={(e)=>onClick(value?._id,value?.class_id)}>
                        <Box className="availabilityDetails">
                            <Typography variant="h5" gutterBottom component="div">{value?.class_title}</Typography>
                             <Typography variant="subtitle1" gutterBottom component="div" className="timingDetails" >{moment().month(value?.month_of_class).subtract(1, "month").format('MMM')} {value?.day_of_class} |  {value?.start_time_of_class ?  tConvert(value?.start_time_of_class) : "" }
                             {" "}to{" "}
                            {value?.end_time_of_class ?  tConvert(value?.end_time_of_class) : "" }</Typography> 
                        </Box>
                   </Button>
                 ))}
                 </div>
                  ):(
                    <div style={{ alignItems: "center",textAlign:"center", padding:"10px", background:"#e1e3e7" }}>
                    No Record Found
                  </div>
                   )}
                   {/* <Link to="/teacher/session-details">
                        <Box className="availabilityDetails">
                            <Typography variant="h5" gutterBottom component="div"> Transforming your creative ideas into personal projects</Typography>
                            <Typography variant="subtitle1" gutterBottom component="div" className="timingDetails" >Oct 4 | 8 AM to 9:30 AM</Typography>
                        </Box>
                   </Link>
                   <Link to="/teacher/session-details">
                        <Box className="availabilityDetails">
                            <Typography variant="h5" gutterBottom component="div"> Yoga Masterclass for beginners</Typography>
                            <Typography variant="subtitle1" gutterBottom component="div" className="timingDetails" >Oct 4 | 8 AM to 9:30 AM</Typography>
                        </Box>
                   </Link>
                   <Link to="/teacher/session-details">
                    <Box className="availabilityDetails">
                        <Typography variant="h5" gutterBottom component="div"> Transforming your creative ideas into personal projects</Typography>
                        <Typography variant="subtitle1" gutterBottom component="div" className="timingDetails" >Oct 4 | 8 AM to 9:30 AM</Typography>
                    </Box>
                   </Link> */}

               </Grid>
              
          </Grid>
         
        </Box>
    )
}

export default MySessions
