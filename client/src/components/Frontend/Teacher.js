import React from 'react'
import Navbar from './Navbar';
import FeaturedSlider from './FeaturedSlider';
import TeacherFilterSlider from './TeacherFilterSlider';
import SearchFilter from './SearchFilter';
const Home = () => {
    return (
        <div className="LandingPageWrap">
            <div className="TopBar">
            </div>
            <div>
            <Navbar />
            <SearchFilter />
            <FeaturedSlider />
            <TeacherFilterSlider />
            </div>
        </div>
    )
}
export default Home
