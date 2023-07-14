import React from 'react'
import Typography from '@mui/material/Typography';
const TeacherContent = (props) => {
    const {Content} = props
    return (
        <div className="TeacherContent">
            <Typography variant="h4" gutterBottom component="h4" className="desc-heading">About Me </Typography>
                <Typography paragraph={true} style={{fontSize:'14px', color:'rgba(0, 0, 0, 0.54)' }} >
               {Content}
                </Typography>
        </div>
    )
}

export default TeacherContent
