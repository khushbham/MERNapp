import React from 'react'
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import Slider from "react-slick";
import Typography from '@mui/material/Typography';
import spinner from '../../../spinner.gif';
const Gallery = (props) => {
  const { gallery } = props
  var settings = {
    dots: true,
    infinite: true,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    speed: 2000,
    autoplaySpeed: 2000,
    cssEase: "linear",
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          infinite: true,
          dots: true
        }
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2
        }
      },
      {
        breakpoint: 320,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1
        }
      }
    ]
  };
  //console.log(gallery , "gallery")
  return (
    <div className="Gallery my-5">
      <Typography variant="h4" gutterBottom component="h4" className="desc-heading my-3">Gallery</Typography>
      {gallery ? (
        <video width="320" height="240" controls >
          <source src={gallery} type="video/mp4" />
          <source src={gallery} type="video/ogg" />
        </video>
      ) : (<img src={spinner} width="320" height="240" />)}
      {/* <Slider {...settings}>
                <div className="ImagesList">
                  <img src="../images/gallery-img.png" alt="gallery"/>
                </div>
                <div className="ImagesList">
                  <img src="../images/gallery-img.png" alt="gallery"/>
                </div>
                <div className="ImagesList">
                <img src="../images/gallery-img.png" alt="gallery"/>
                </div>
                <div className="ImagesList">
                  <img src="../images/gallery-img.png" alt="gallery"/>
                </div>
                <div className="ImagesList">
                   <img src="../images/gallery-img.png" alt="gallery"/>
                </div>
                <div className="ImagesList">
                 <img src="../images/gallery-img.png" alt="gallery"/>
                </div>
          </Slider> */}
    </div>
  )
}

export default Gallery
