import React ,{ useRef}from "react";
import StudentNavbar from "../Students/StudentNavbar";
import FeaturedSlider from "./FeaturedSlider";
import TeacherFilterSlider from "./TeacherFilterSlider";
import SearchFilter from "./SearchFilter";
const Home = () => {
  const [teacherData, setteacherData] = React.useState([]);
  const [apiHit, setApiHit] = React.useState(false);
  const [totalPages , settotalPages] = React.useState()
  const [page , setpage] = React.useState(1)
  const queryParams = new URLSearchParams(window.location.search);
  const keyword = queryParams.get("e")
  // console.log("check the keyword ===>>>>>" , keyword)
  return (
    <div className="LandingPageWrap">
      <div className="TopBar"></div>
      <div>
        <StudentNavbar />
        <SearchFilter 
        setteacherData={setteacherData}
        setApiHit={setApiHit}
        page={page}
        settotalPages={settotalPages}   
        keyword={keyword}  
        />
        {/* <FeaturedSlider teacherData={teacherData} /> */}
        {apiHit && 
        <TeacherFilterSlider 
        teacherData={teacherData}
        setpage={setpage}
        totalPages={totalPages}
        />
        }
      </div>
    </div>
  );
};
export default Home;
