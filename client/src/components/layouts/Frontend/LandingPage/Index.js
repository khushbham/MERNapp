import React from 'react'
import Navbar from '../Navbar';
import Banner from './Banner';
import Topics from './Topics';
import TeacherSlider from './TeacherSlider';
const Home = () => {
    return (
        <div className="LandingPageWrap">
            <div>
            <Banner />
            <TeacherSlider />
            <Topics />
            </div>
        </div>
    )
}
export default Home
