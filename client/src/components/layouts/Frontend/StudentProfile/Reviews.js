import React, { useEffect } from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { useDispatch } from 'react-redux';
import { studentRatingListWithAuth } from '../../../../actions/frontent';

const Reviews = () => {
 const [value, setValue] = React.useState(2);
 const [showRatings , setShowRating] = React.useState([])
 const dispatch = useDispatch()
  
 useEffect(()=>{
 dispatch(studentRatingListWithAuth()).then((res)=>{
    setShowRating(res.data)
 }).catch((err)=>[
    console.log(err)
 ])
 },[])
    return (
        <Box className="classesDetails">
            {showRatings.length ?(
            <Container>   
            {showRatings?.map((data)=>{
                if(data){
                 return ( 
                      <Box className="d-flex my-4">
                       <Avatar alt="profilee" src={data?.userDetail?.profile_image} sx={{ width: 60, height: 60}}/>
                   <Box className="ms-3">
                       <Typography variant="h5" gutterBottom component="div" className="ReviewHead">{data?.userDetail?.first_name} {data?.userDetail?.last_name}</Typography>
                       <Rating
                           name="read-only"
                           value={data?.rating}
                           readOnly
                        //    onChange={(event, newValue) => {
                        //    setValue(newValue);
                        //    }}
                       />
                          <Typography variant="h6" gutterBottom component="div" className="stud-review mt-3">{data?.feedback}</Typography>
                   </Box>
                </Box> )
                }
                    return (
                    <Box className="d-flex my-4">
                        <Avatar alt="profilee" src="../images/profile-pic.png" sx={{ width: 60, height: 60}}/>
                           <Box className="ms-3">
                         <Typography variant="h5" gutterBottom component="div" className="ReviewHead">Tokunaga Yae</Typography>
                           <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                            setValue(newValue);
                            }}
                            />
                        <Typography variant="h6" gutterBottom component="div" className="stud-review mt-3">Loved it! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat, ligula in viverra pharetra, tortor sapien.</Typography>
                    </Box>
                </Box>
                    )
            })}
                {/* <Box className="d-flex my-4">
                <Avatar alt="profilee" src="../images/profile-pic.png" sx={{ width: 60, height: 60}}/>
                    <Box className="ms-3">
                        <Typography variant="h5" gutterBottom component="div" className="ReviewHead">Tokunaga Yae</Typography>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                            setValue(newValue);
                            }}
                        />
                           <Typography variant="h6" gutterBottom component="div" className="stud-review mt-3">Loved it! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat, ligula in viverra pharetra, tortor sapien.</Typography>
                    </Box>
                </Box>

                <Box className="d-flex my-4">
                <Avatar alt="profilee" src="../images/profile-pic.png" sx={{ width: 60, height: 60}}/>
                    <Box className="ms-3">
                        <Typography variant="h5" gutterBottom component="div" className="ReviewHead">Tokunaga Yae</Typography>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                            setValue(newValue);
                            }}
                        />
                           <Typography variant="h6" gutterBottom component="div" className="stud-review mt-3">Loved it! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat, ligula in viverra pharetra, tortor sapien.</Typography>
                    </Box>
                </Box>

                <Box className="d-flex my-4">
                <Avatar alt="profilee" src="../images/profile-pic.png" sx={{ width: 60, height: 60}}/>
                    <Box className="ms-3">
                        <Typography variant="h5" gutterBottom component="div" className="ReviewHead">Tokunaga Yae</Typography>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                            setValue(newValue);
                            }}
                        />
                           <Typography variant="h6" gutterBottom component="div" className="stud-review mt-3">Loved it! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat, ligula in viverra pharetra, tortor sapien.</Typography>
                    </Box>
                </Box>

                <Box className="d-flex my-4">
                <Avatar alt="profilee" src="../images/profile-pic.png" sx={{ width: 60, height: 60}}/>
                    <Box className="ms-3">
                        <Typography variant="h5" gutterBottom component="div" className="ReviewHead">Tokunaga Yae</Typography>
                        <Rating
                            name="simple-controlled"
                            value={value}
                            onChange={(event, newValue) => {
                            setValue(newValue);
                            }}
                        />
                           <Typography variant="h6" gutterBottom component="div" className="stud-review">Loved it! Lorem ipsum dolor sit amet, consectetur adipiscing elit. Duis volutpat, ligula in viverra pharetra, tortor sapien.</Typography>
                    </Box> 
                </Box>*/}
            </Container>
            ) :(
                <Container>
                    <h3>No Reviews Found</h3>
                </Container>
            )}
        </Box>
    )
}

export default Reviews
