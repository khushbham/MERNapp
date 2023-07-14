import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { getClassesList } from '../../../../../actions/frontent';
const TeacherClassDetail = () => {

  const [classlist , setclasslist] = useState([])
   const dispatch = useDispatch()

useEffect(()=>{
    dispatch(getClassesList()).then((res)=>{
    setclasslist(res.data)
   }).catch((err)=>{
    console.log(err)
   })
    },[])

    return (
        <Box className="classesDetails">
            <Container>
                <Grid container>
                   <Grid item lg={12} md={12} xs={12}>
                    {classlist?.map((arr)=>{
                        return <Grid container className="align-items-center classesList">
                               <Grid item lg={8} md={8} sm={8} xs={12}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle">{arr?.discipline}</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">{arr?.class_title} </Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> ${arr?.price}/hour {" "}

                                <span className="IndividualClass">{arr?.max_students_allowed == 1? "Individual class" : "Group"}</span> 
                                </Typography>
                            </Grid>
                        </Grid>
                          })}
                        {/* <Grid container className="align-items-center classesList">
                            <Grid item lg={8} md={8} sm={8} xs={12}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle">Art & Illustration</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">Illustration techniques to unlock your creativity</Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> $20/hour <span className="IndividualClass">Group class</span> </Typography>
                            </Grid>
                        </Grid>

                        <Grid container className="align-items-center classesList">
                            <Grid item lg={8} md={8} sm={8} xs={12}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle">Dance</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">Urban dance </Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> $15/hour <span className="IndividualClass">Group class</span> </Typography>
                            </Grid>
                        </Grid>
                        <Grid container className="align-items-center classesList">
                            <Grid item lg={8} md={8} sm={8} xs={12}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle">Dance</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">Urban dance </Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> $15/hour <span className="IndividualClass">Group class</span> </Typography>
                            </Grid>
                        </Grid> */}
                        <Box className="mt-4">
                          <Link to="/" className="saveBtn">Add new class</Link>
                        </Box>
                   </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default TeacherClassDetail
