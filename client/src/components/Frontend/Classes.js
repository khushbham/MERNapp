import React from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Avatar from '@mui/material/Avatar';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import List from '@mui/material/List';
import ListItem from '@mui/material/ListItem';
import ListItemButton from '@mui/material/ListItemButton';
import ListItemIcon from '@mui/material/ListItemIcon';
import ListItemText from '@mui/material/ListItemText';
import Divider from '@mui/material/Divider';
import ClassTopics from '../Frontend/ClassTopics';
import FeesDetails from '../Frontend/FeesDetails';
import { MdOutlineDesktopWindows } from "react-icons/md";
import { BiTimeFive } from "react-icons/bi";
import { BiBarChartSquare } from "react-icons/bi";
import { RiGroupLine } from "react-icons/ri";
import { BsGlobe } from "react-icons/bs";
import '../../css/Frontend/style.css'
const Classes = () => {
    return (
        <div className="classes-details">
            <Container>
            <Typography variant="h3" gutterBottom component="div" className="classesHeading mb-4">
              Class details
            </Typography>
              <img src="../images/classes-banner.jpg" alt="banner" className="w-100"/>
                <div className="contentSec">
                    <Typography variant="h3" gutterBottom component="div" className="classes mt-4">
                      ART & ILLUSTRATION
                    </Typography>
                    <Typography variant="h3" gutterBottom component="div" className="classesHeading mb-3">
                       Illustration techniques to unlock your creativity
                    </Typography>
                    <Typography variant="body1" gutterBottom className="descSubHead">
                       Create an artist’s portfolio and develop your own universe of pictorial resources.
                    </Typography>
                    <div className="Teacher-Profile d-flex align-items-center">
                       <Avatar alt="teacher Profile" src="../images/teacher.jpg" className="me-2"/>
                       <Typography variant="body1" gutterBottom className="descSubHead"> By Julia Tatello <Link href="#" className="ContactLink mb-0" >contact </Link> </Typography>
                    </div>
                    <div className="ClassesTimeDetail my-4">
                        <Grid container className="align-items-center">
                            <Grid item lg={10} xs={12}>
                                <Typography variant="subtitle2" gutterBottom component="div">
                                This class is available: <br/>
                                Monday from 10am to 11am - Wednesday from 2pm to 6pm - Friday from 4pm to 8pm
                              </Typography>
                            </Grid>
                            <Grid item lg={2} xs={12} className="text-end">
                               <Link className="PdtLink">PDT</Link>
                            </Grid>
                        </Grid>
                    </div>

                    <div className="ClassesDescription">
                        <Grid container spacing={2}>
                            <Grid item xs={12} md={6} lg={4}>
                            <nav aria-label="main mailbox folders"  className="infolist">
                                <List>
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemIcon className="listIcons" style={{minWidth:'33px'}}>
                                        <MdOutlineDesktopWindows/>
                                    </ListItemIcon>
                                    <ListItemText primary="Online class"/>
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemIcon className="listIcons"  style={{minWidth:'33px'}}>
                                        <BiTimeFive/>
                                    </ListItemIcon>
                                    <ListItemText primary="30 minute lesson" />
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                                <ListItem disablePadding>
                                    <ListItemButton>
                                    <ListItemIcon className="listIcons"  style={{minWidth:'33px'}}>
                                        <BiBarChartSquare/>
                                    </ListItemIcon>
                                    <ListItemText primary="Intermediate level" />
                                    </ListItemButton>
                                </ListItem>
                                <Divider />
                                </List>
                            </nav>
                            </Grid>
                            <Grid item xs={12} md={6} lg={4} className="mob--list">
                                <nav aria-label="main mailbox folders" className="infolist">
                                    <List>
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                        <ListItemIcon className="listIcons"  style={{minWidth:'33px'}}>
                                            <BsGlobe/>
                                        </ListItemIcon>
                                        <ListItemText primary="English" />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    <ListItem disablePadding>
                                        <ListItemButton>
                                        <ListItemIcon className="listIcons"  style={{minWidth:'33px'}}>
                                            <RiGroupLine/>
                                        </ListItemIcon>
                                        <ListItemText primary="This is a group class" />
                                        </ListItemButton>
                                    </ListItem>
                                    <Divider />
                                    </List>
                                </nav>
                            </Grid>
                            <Grid item xs={12} lg={12} md={12} sm={12}>
                            <Typography variant="h4" gutterBottom component="h4" className="desc-heading">Description </Typography>
                            <Typography paragraph={true} style={{fontSize:'14px', color:'rgba(0, 0, 0, 0.54)' }} >
                            I remember the moment that I decided I was going to dance professionally. My mother took my older sister and I to Richmond Ballet’s performance of Swan Lake. Rachel couldn’t sit still and I was mesmerized; from then on I was determined …
                            g in a small studio in Richmond, VA. Since I have always loved the hard work and dedication that ballet requires, most of my motivation to train comes from myself. Growing up I was extremely lucky to have supportive parents and teachers who were able to recognize my drive and passion for the art, and help cultivate and foster it.
                            </Typography>
                            </Grid>
                        </Grid>
                    <ClassTopics />
                    <FeesDetails />
                    </div>
                </div>
            </Container>
        </div>
    )
}
export default Classes
