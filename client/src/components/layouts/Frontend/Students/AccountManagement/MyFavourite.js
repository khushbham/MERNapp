import React,{useEffect} from 'react'
import Grid from '@mui/material/Grid';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Pagination from "@mui/material/Pagination";
import { Link, useHistory } from "react-router-dom";
import Rating from '@mui/material/Rating';
import Stack from '@mui/material/Stack';
import { ImCross } from "react-icons/im";
// import { FiHeart } from 'react-icons/fi';
// import { FaHeart } from 'react-icons/fa';
import StudentAccSidebar from './StudentAccSidebar';
import StudentNavbar from '../StudentNavbar';
import { useDispatch } from 'react-redux';
import { getWishlistOfStudent, removefromWishlist } from '../../../../../actions/frontent';
const label = { inputProps: { 'aria-label': 'Switch demo' } };
const MyFavourite = () => {

    const history = useHistory()
    const dispatch = useDispatch()
    const [teacherData , setteacherData] = React.useState([])
    const [currentPage, setCurrentPage] = React.useState(1);
    const [page , setpage] = React.useState(1);
    const [totalPages , settotalPages] = React.useState(4);
    const wishlist=(id)=>{
        dispatch(removefromWishlist(id)).then((res)=>{
            if(res.success == true){
                getWishlist()
            }
        }).catch((err)=>{
            console.log(err)
        })
      }
      const onClick=(e)=>{
        history.push({
             pathname:"/public-profile-of-teacher",
             search:`Id=${e}`,
             state: {Id:e}
        })
      }

      const getWishlist = ()=>{
        dispatch(getWishlistOfStudent()).then((res)=>{
            console.log(res.data , "shdakdad")
            setteacherData(res.data)
           }).catch((err)=>{
            console.log(err)
           })
      }
      useEffect(()=>{
        getWishlist()
           },[])

         const handlePageChange = (e, p) => {
            setpage(p);
            setCurrentPage(p);
          };    
    return (
      <>
      <StudentNavbar/>
      <Grid container>
          <Grid item lg={10} sm={12} md={12} xs={12} className="m-auto informationSidebar my-4">
               <Box
                sx={{ flexGrow: 1, display: 'flex'}}>
                    <Grid container>
                        <Grid item lg={4} sm={4} md={4} xs={12}>
                            <StudentAccSidebar/>
                        </Grid>
                        <Grid item lg={8} sm={8} md={8} xs={12}>
                        <Typography variant="h4" component="h2" className="loginHead m-3 my_favorites">My Favorites</Typography>
                        {teacherData?.length ? (
                        <Grid container className="myfav-teacher-student">
                        <div className="student_myfavteacher">
                        {teacherData?.map((arr)=>{
                            console.log(arr , 'arr')
                          return <Grid item xxl={3} lg={3} sm={6} md={4} xs={12} className="mb-3">
                          <div className="SlideWrap">
                          <div className="TeacherFavouriteProfile">
                            <div className="profileImg">
                            <img src={arr.users.profile_image} alt="teacherProfile" onClick={()=>onClick(arr.users._id)}/>
                                <div className='crossIcon' onClick={()=>wishlist(arr.users._id)}>
                                  <ImCross/> 
                                </div>
                                    </div>
                                    <Typography variant="h5" component="div" className="mb-0" align="left">{arr.users.first_name} {arr.users.last_name}</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">{arr.users.expertise}</Typography>
                                    <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">{arr.users.city}&{arr.users.street_address}</Typography>
                                        <div className="d-flex align-items-center">
                                           <Stack spacing={1}>
                                                <Rating name="read-only" className="RatingVal" defaultValue={2.5} precision={0.5} readOnly/>
                                            </Stack>
                                            <span className="totalReviews"> 
                                            <Typography paragraph={true} component="div" className="mb-0 TeacherInfo" align="left">(88)</Typography>
                                            </span>
                                        </div>
                                </div> 
                        </div>
                        </Grid>
                    })}
                    </div></Grid>):(
                        <div style={{ alignItems: "center",textAlign:"center", padding:"10px", background:"#e1e3e7" }}>
                        No Record Found
                      </div>
                    )}
                        </Grid>
                    </Grid>
                   
                </Box>
                {/* 
                <div className="pagination-section">
               <Pagination
            onChange={handlePageChange}
            defaultPage={currentPage}
            count={totalPages}
            color="primary"
          />
        </div>
         */}
             </Grid>
            
        </Grid>
      </>
       
    )
}

export default MyFavourite;
