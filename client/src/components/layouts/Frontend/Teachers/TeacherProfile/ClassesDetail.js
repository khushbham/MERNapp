import React from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { AiOutlineCalendar } from 'react-icons/ai';
const ClassesDetail = () => {
    return (
        <Box className="classesDetails">
            <Container>
                <Grid container>
                   <Grid item lg={12} md={12} xs={12}>
                        <Grid container className="align-items-center classesList">
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle">Marketing online</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">Transforming your creative ideas into personal projects </Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> $30/hour <span className="IndividualClass">Individual class</span> </Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={4}  xs={4} align="right">
                                <Link to="/" className="BookLink"><AiOutlineCalendar />Book</Link>
                            </Grid>
                        </Grid>

                        <Grid container className="align-items-center classesList">
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle">Art & Illustration</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">Illustration techniques to unlock your creativity</Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> $20/hour <span className="IndividualClass">Group class</span> </Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={4}  xs={4} align="right">
                                <Link to="/" className="BookLink"><AiOutlineCalendar />Book</Link>
                            </Grid>
                        </Grid>

                        <Grid container className="align-items-center classesList">
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle">Dance</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">Urban dance </Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> $15/hour <span className="IndividualClass">Group class</span> </Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={4}  xs={4} align="right">
                                <Link to="/" className="BookLink"><AiOutlineCalendar />Book</Link>
                            </Grid>
                        </Grid>
                        <Grid container className="align-items-center classesList">
                            <Grid item lg={8} md={8} sm={8} xs={8}>
                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle">Dance</Typography>
                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">Urban dance </Typography>
                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> $15/hour <span className="IndividualClass">Group class</span> </Typography>
                            </Grid>
                            <Grid item lg={4} md={4} sm={4}  xs={4} align="right">
                                <Link to="/" className="BookLink"><AiOutlineCalendar />Book</Link>
                            </Grid>
                        </Grid>
                   </Grid>
                </Grid>
            </Container>
        </Box>
    )
}

export default ClassesDetail
