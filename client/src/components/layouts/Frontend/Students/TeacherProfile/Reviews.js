import React,{useState , useEffect} from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import Avatar from '@mui/material/Avatar';
import Rating from '@mui/material/Rating';
import { teacherRatingList } from '../../../../../actions/frontent';
import { useDispatch } from 'react-redux';
const Reviews = ({Id}) => {
    const [value, setValue] = React.useState(2);
    const [showRatings , setShowRating] = React.useState([])
    const dispatch = useDispatch()
     
    useEffect(()=>{
    dispatch(teacherRatingList(Id)).then((res)=>{
       setShowRating(res.data)
    }).catch((err)=>[
       console.log(err)
    ])
    },[])
    
    return (
       <Box className="classesDetails">
        {showRatings.length ? (
           <Container>   
           {showRatings?.map((data)=>{
                return ( 
                     <Box className="d-flex my-4">
                      <Avatar alt="profilee" src={data?.userDetail?.profile_image} sx={{ width: 60, height: 60}}/>
                   <Box className="ms-3">
                       <Typography variant="h5" gutterBottom component="div" className="ReviewHead">{data?.userDetail?.first_name}</Typography>
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
           ):(
            <h3> No Records Found</h3>
           )}
       </Box>
   )
   }
   
   export default Reviews
