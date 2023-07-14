import React from 'react'
import Typography from '@mui/material/Typography';
import '../../../../css/Frontend/style.css';
const TeacherContent = () => {
    return (
        <div className="TeacherContent">
            <Typography variant="h4" gutterBottom component="h4" className="desc-heading">About Me </Typography>
                <Typography paragraph={true} style={{fontSize:'14px', color:'rgba(0, 0, 0, 0.54)' }} >
                I remember the moment that I decided I was going to dance professionally. My mother took my older sister and I to Richmond Ballet’s performance of Swan Lake. Rachel couldn’t sit still and I was mesmerized; from then on I was determined …
                g in a small studio in Richmond, VA. Since I have always loved the hard work and dedication that ballet requires, most of my motivation to train comes from myself. Growing up I was extremely lucky to have supportive parents and teachers who were able to recognize my drive and passion for the art, and help cultivate and foster it.
                </Typography>
        </div>
    )
}

export default TeacherContent
