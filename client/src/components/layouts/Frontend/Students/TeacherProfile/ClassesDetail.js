import React, { useState ,useEffect }  from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { AiOutlineCalendar } from 'react-icons/ai';
import { useDispatch } from 'react-redux';
import { getClassesListForStudent } from '../../../../../actions/frontent';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';

const ClassesDetail = ({Id}) => {
   const [classlist , setclasslist] = useState([])
   const dispatch = useDispatch()
   const history = useHistory()

useEffect(()=>{
    dispatch(getClassesListForStudent(Id)).then((res)=>{
    setclasslist(res.data)
   }).catch((err)=>{
    console.log(err)
   })
    },[])

    const classDetails = (id)=>{
        history.push({
            pathname:"/class-details",
            search:`teacher_Id=${Id}&Class_Id=${id}`,  
        })
    };
    const bookClass = (id,max_students_allowed,price)=>{
        if(max_students_allowed == 1){
            history.push({
                pathname:"/students/book-class",
                search:`teacher_Id=${Id}&Class_Id=${id}`,
                state:{
                teacher_Id:Id,  
                Class_Id:id,
                }
            })
        }else{
            history.push({
                pathname:"/students/class-payments",
                search:`teacher_Id=${Id}&Class_Id=${id}&amount=${price}`,
                state:{
                    teacher_Id:Id,  
                    Class_Id:id,
                    amount:price
                    }
            })
        }
    }
    return (
        <Box className="classesDetails">
            <Container>
                <Grid container>
                   <Grid item lg={12} md={12} xs={12}>
                   {classlist?.map((arr)=>{
                        return <Grid container className="align-items-center classesList">
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle" onClick={()=>classDetails(arr?._id)}>{arr?.discipline}</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">{arr?.class_title} </Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> ${arr?.price}/hour <span className="IndividualClass">{arr?.max_students_allowed == 1? "Individual class" : "Group"}</span> </Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={4}  xs={4} align="right">
                                <Button className="BookLink" onClick={()=>bookClass(arr?._id,arr?.max_students_allowed,arr?.price)}><AiOutlineCalendar />Book</Button>
                            </Grid>
                        </Grid>
                          })}
                        
                   </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default ClassesDetail
