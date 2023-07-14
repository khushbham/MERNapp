import React,{useState , useEffect} from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import { FiCheckCircle } from "react-icons/fi";
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import Divider from '@mui/material/Divider';
import Grid from '@mui/material/Grid';
import Gallery from './Gallery';
import TeacherContent from './TeacherContent';
import ClassTopics from '../ClassDetails/ClassTopics';
import { useDispatch } from 'react-redux';
import { getStudentPublicProfile } from '../../../../actions/frontent';
const StudentDetail = () => {
    const dispatch = useDispatch()
    const [studentDetails , setstudentDetails]= useState({})
    const [ Image , setImage] = useState()
    const getstudentProfile= ()=>{
       dispatch(getStudentPublicProfile()).then((res)=>{
        setstudentDetails(res.data) 
        setImage(res.data.profile_image)      
       }) 
     }

  useEffect(()=>{
    getstudentProfile()  
     },[])
     
    return (
        <div>
            <Container>
            <Typography variant="h3" component="h2" className="mt-2 mb-4">My Student Profile</Typography>
             <div className="TeacherProfileDetails d-flex flex-wrap align-items-center">
                <Avatar alt="Remy Sharp" src={Image} />
               <div className="mx-2">
                <Typography variant="h5" component="h5"> {studentDetails?.first_name} {studentDetails?.last_name}</Typography>
                <Typography variant="h6" component="h6" className="deatilsSubhead">{studentDetails?.city}, {studentDetails?.state}</Typography>
               </div>
             </div>
             <div className="TeacherPersonalDeatils">
             <nav aria-label="main mailbox folders">
                <List>
                <ListItem disablePadding>
                    <Grid container>
                        <Grid item xs={6} lg={2}>
                        <Typography variant="subtitle1" gutterBottom component="div" className="detailhead"> Age </Typography>
                        </Grid>
                        <Grid item xs={6} lg={2}>
                        <Typography variant="subtitle1" gutterBottom component="div"  className="detailList">{studentDetails?.age}</Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                {/* <Divider style={{color:'#fff'}} /> */}
                {/* <ListItem disablePadding>
                    <Grid container>
                        <Grid item xs={6} lg={2}>
                        <Typography variant="subtitle1" gutterBottom component="div"  className="detailhead"> Gender </Typography>
                        </Grid>
                        <Grid item xs={6} lg={2}>
                        <Typography variant="subtitle1" gutterBottom component="div"  className="detailList"> Female </Typography>
                        </Grid>
                    </Grid>
                </ListItem> */}
                {/* <Divider style={{color:'#fff'}} /> */}
                {/* <ListItem disablePadding>
                    <Grid container>
                        <Grid item xs={6} lg={2}>
                        <Typography variant="subtitle1" gutterBottom component="div"  className="detailhead"> Language </Typography>
                        </Grid>
                        <Grid item xs={6} lg={2}>
                        <Typography variant="subtitle1" gutterBottom component="div"  className="detailList"> English, Spanish </Typography>
                        </Grid>
                    </Grid>
                </ListItem> */}
                <Divider style={{color:'#fff'}} />
                <ListItem disablePadding>
                    <Grid container>
                        <Grid item xs={6} lg={2}>
                        <Typography variant="subtitle1" gutterBottom component="div"  className="detailhead"> Timezone </Typography>
                        </Grid>
                        <Grid item xs={6} lg={2}>
                        <Typography variant="subtitle1" gutterBottom component="div"  className="detailList"> GMT </Typography>
                        </Grid>
                    </Grid>
                </ListItem>
                </List>
            </nav>
             </div>
              <div className="AboutContentSec">
                    {/* <TeacherContent /> */}
                    <ClassTopics topics={studentDetails?.topics}/>
                     {/* <Gallery/> */}
                     {/* <Grid className="contact-Btn" xs={12} md={8} lg={4}>
                         <Link href="#" className="contactBtn">Contact Teacher</Link>
                     </Grid> */}
              </div>
            </Container>
        </div>
    )
}
export default StudentDetail
