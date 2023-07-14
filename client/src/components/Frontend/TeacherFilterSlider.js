import React from 'react'
import Container from '@mui/material/Container';
import '../../css/Frontend/style.css'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import Typography from '@mui/material/Typography';
import MenuItem from '@mui/material/MenuItem';
import FormControl from '@mui/material/FormControl';
import Select from '@mui/material/Select';
import Grid from '@mui/material/Grid';

const TeacherFilterSlider = () => {
    const [sort, distance] = React.useState('10');
    const handleChange = (event) => {
        distance(event.target.value);
    };
    const settings = {
        dots: true,
        infinite: true,
        slidesToShow: 6,
        slidesToScroll: 3,
        autoplay: true,
        speed: 5000,
        autoplaySpeed: 300,
        cssEase: "linear",
        pauseOnHover:"true",
        responsive: [
            {
              breakpoint: 1024,
              settings: {
                slidesToShow: 3,
                slidesToScroll: 3,
                infinite: true,
                dots: true
              }
            },
            {
              breakpoint: 600,
              settings: {
                slidesToShow: 2,
                slidesToScroll: 2,
                initialSlide: 2,
                arrows:false
              }
            },
            {
              breakpoint: 320,
              settings: {
                slidesToShow: 1,
                slidesToScroll: 1,
                arrows:false
              }
            }
          ]
      };
    return (
        <div className="TeacherFilterSlider pb-4">
           <Container>
            <div className="Filter mb-4">
            <Grid item lg={2} sm={12}>
             <FormControl fullWidth  variant="standard" className="class-type">
                    <Select
                    value={sort}
                    displayEmpty
                    defaultValue={10}
                    onChange={handleChange}
                    label="Filter by Session Status"
                    className="filterSelectBox"
                    inputProps={{ 'aria-label': 'Without label' }}
                    >
                    <MenuItem value={10}>Sort By Distance</MenuItem>
                    <MenuItem value={20}>Sort By Distance</MenuItem>
                    <MenuItem value={30}>Sort By Distance</MenuItem>
                    </Select>
                </FormControl>
                </Grid>
            </div>    
           <Slider {...settings} className="sliderSettings">
                        <div className="SlideWrap">
                                <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                        <div className="SlideWrap">
                        <div className="TeacherProfile">
                                    <div className="profileImg">
                                    <img src="../images/teacher.png" alt="teacherProfile"/>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">Amanda Smith</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Dance Teacher</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">Riverside, CA & Online</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="half-rating" className="RatingVal" defaultValue={2.5} precision={0.5} />
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div>
                        </div>
                </Slider>
            </Container> 
        </div>
    )
}

export default TeacherFilterSlider
