import React from 'react'
import Navbar from '../Frontend/Navbar'
import TeacherTabs from '../Frontend/TeacherTabs'
import '../../css/Frontend/style.css'
const TeacherProfile = () => {
    return (
        <div className="teacherProfileWrap"> 
            <Navbar />
            <TeacherTabs />
        </div>
    )
}

export default TeacherProfile
