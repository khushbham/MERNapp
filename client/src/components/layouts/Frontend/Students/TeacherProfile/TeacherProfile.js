import React from 'react'
import TeacherTabs from './TeacherTabs';
import StudentNavbar from '../StudentNavbar';
const TeacherProfile = () => {
     const queryParams = new URLSearchParams(window.location.search); 
     const Id = queryParams.get("Id") 
    return (
        <div className="teacherProfileWrap"> 
        <StudentNavbar/>
        <TeacherTabs Id={Id} />
        </div>
    )
}

export default TeacherProfile
