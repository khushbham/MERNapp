import React, { useEffect, useState } from "react";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { useDispatch } from "react-redux";
import { teacherListing } from "../../../../actions/frontent";
import Loader from "../../loader";
import { studentAuth, TeacherAuth } from "../../../routing/Authentication";
import { useHistory } from "react-router-dom/cjs/react-router-dom.min";

const TeacherSlider = () => {
  const dispatch = useDispatch();
  const history = useHistory()

  const [teacherListings, setTeacherListing] = useState([]);
  const [loading, setloading] = useState(true);

  useEffect(() => {
    dispatch(teacherListing())
      .then((res) => {
        setTeacherListing(res.data.teacherListing);
        setloading(false);
      })
      .catch((err) => {
        console.log(err);
      });
  }, []);
  const settings1 = {
    dots: true,
    infinite: true,
    slidesToShow: 5,
    slidesToScroll: 1,
    speed: 500,
    // autoplaySpeed: 300,
    swipeToSlide: true,
    // cssEase: "linear",
    pauseOnHover: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 3,
          slidesToScroll: 3,
          infinite: true,
          dots: true,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
          arrows: false,
        },
      },
      {
        breakpoint: 375,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          arrows: false,
        },
      },
    ],
  };
  const goToTeacherProfile = (e) => {
    if (studentAuth()) {
       history.push({
        pathname: "/public-profile-of-teacher",
        search: `Id=${e}`,
        state: { Id: e },
      });
    }
  };
  return (
    <div className="TeacherInfo">
      {!loading ? (
        <Container>
          <Typography variant="h3" component="div" className="mb-3">
            Popular teachers near you
          </Typography>
          <Slider {...settings1}>
            {teacherListings &&
              teacherListings.length > 0 &&
              teacherListings.map((arr, index) => (
                <div key={index}>
                  <div className="SlideWrap">
                    <div
                      className="TeacherProfile"
                      style={{ cursor: "pointer" }}
                      onClick={() => goToTeacherProfile(arr?._id)}
                    >
                      <div className="profileImg" style={{ width: "210px" }}>
                        <img src={arr.profile_image} alt="teacherProfile" />
                      </div>
                      <Typography
                        variant="h5"
                        component="div"
                        className="mb-0"
                        align="left"
                      >
                        {arr.first_name} {arr.last_name}
                      </Typography>
                      <Typography
                        paragraph={true}
                        component="div"
                        className="mb-0 TeacherInfo"
                        align="left"
                      >
                        {arr.about_expertise}
                      </Typography>
                      <Typography
                        paragraph={true}
                        component="div"
                        className="mb-0 TeacherInfo"
                        align="left"
                      >
                        {arr.street_address} & {arr.city}
                      </Typography>
                      <div className="d-flex align-items-center">
                        <Stack spacing={1}>
                          <Rating
                            name="read-only"
                            className="RatingVal"
                            defaultValue={2.5}
                            precision={0.5}
                            readOnly
                          />
                        </Stack>
                        {/* <span className="totalReviews">
                            <Typography
                              paragraph={true}
                              component="div"
                              className="mb-0 TeacherInfo"
                              align="left"
                            >
                              (88)
                            </Typography>
                          </span> */}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
          </Slider>
        </Container>
      ) : (
        <div style={{ alignSelf: "center" }}>
          <Loader />
        </div>
      )}
    </div>
  );
};
export default TeacherSlider;
