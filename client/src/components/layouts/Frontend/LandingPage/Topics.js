import React, { useEffect, useState } from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import { Link } from 'react-router-dom';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import '../../../../css/Frontend/style.css'
import {studentAuth , TeacherAuth} from "../../../routing/Authentication"
import { getPopularTagsforLandingPage } from '../../../../actions/frontent';
import { useDispatch } from 'react-redux';
const Topics = () => {
 const dispatch = useDispatch()
 const [login , setlogin] = useState(false)
 const [tags , settags] = useState([])

    useEffect(()=>{   
    if(studentAuth() || TeacherAuth()){
        console.log("is loged in")
        setlogin(true)
    }else{
        console.log("is notloged in")
        setlogin(false)
    }
   dispatch(getPopularTagsforLandingPage()).then((res)=>{
    settags(res.data)
   }).then((err)=>{
    console.log(err, 'error in  topics')
   })
    },[])
    return (
        <div className="TopicsWrap">
            <Container>
            <Typography variant="h3" component="div" className="mb-3">Topics</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexWrap: 'wrap'
                    }
                }
                >
                    {tags?.map((arr)=>{
                      return <Link  className="TopicLinks mb-2" >
                   {arr.tag_name}
                     </Link>
                    })}
              
                {/* <Link to="#" className="TopicLinks mb-2">
                Illustration
                </Link>
                <Link to="#" className="TopicLinks mb-2 ">
                Design
                </Link>
                <Link to="#" className="TopicLinks mb-2">
                Editorial
                </Link>
                <Link to="#" className="TopicLinks mb-2">
                Characters
                </Link>
                <Link to="#" className="TopicLinks mb-2">
                Urban Graffiti
                </Link>
                <Link to="#" className="TopicLinks mb-2">
                Portfolio
                </Link> */}
                </Box>
                {!login ? (
                <div className="inspiredBanner">
                    <Grid container>
                        <Grid item lg={9} md={12} sm={12} xs={12}>
                        <Typography variant="h2" component="h2" className="mb-3 InspiredHead"> Inspire or be inspired</Typography>
                        </Grid>
                        <Grid item lg={3} md={12} sm={12} xs={12} className="text-end mob--btn">
                            <div>
                                <Link to="/students/sign-up" className="SignUpBtn">
                                Signup as a Student
                                </Link>
                            </div>
                            <div>
                                <Link to="/teacher/sign-up" className="SignBtn">
                                Signup as a teacher
                                </Link>
                            </div>
                        </Grid>
                    </Grid>
                </div>
                ):(
                    <div className="inspiredBanner">
                    <Grid container>
                        <Grid item lg={9} md={12} sm={12} xs={12}>
                        <Typography variant="h2" component="h2" className="mb-3 InspiredHead"> Inspire or be inspired</Typography>
                        </Grid>
                        <Grid item lg={3} md={12} sm={12} xs={12} className="text-end mob--btn">
                            {studentAuth()?(
                            <div>
                                <Link to="/student/dashboard" className="SignUpBtn">
                                Go To dashboard
                                </Link>
                            </div>
                            ):(
                            <div>
                                <Link to="/teacher/dashboard" className="SignBtn">
                                Go To dashboard
                                </Link>
                            </div>
                            )}
                        </Grid>
                    </Grid>
                </div>
                )}
            </Container>
        </div>
    )
}

export default Topics
