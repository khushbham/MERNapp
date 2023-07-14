import React from 'react'
import Typography from '@mui/material/Typography';
import Container from '@mui/material/Container';
import Link from '@mui/material/Link';
import Box from '@mui/material/Box';
import Grid from '@mui/material/Grid';
import '../../css/Frontend/style.css'
const Topics = () => {
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
                <Link href="#" className="TopicLinks mb-2">
                 Art
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Illustration
                </Link>
                <Link href="#" className="TopicLinks mb-2 ">
                Design
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Editorial
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Characters
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Urban Graffiti
                </Link>
                <Link href="#" className="TopicLinks mb-2">
                Portfolio
                </Link>
                </Box>
                <div className="inspiredBanner">
                    <Grid container>
                        <Grid item lg={9} md={12} sm={12} xs={12}>
                        <Typography variant="h2" component="h2" className="mb-3 InspiredHead"> Inspire or be inspired</Typography>
                        </Grid>
                        <Grid item lg={3} md={12} sm={12} xs={12} className="text-end mob--btn">
                            <div>
                                <Link href="#" className="SignUpBtn">
                                Signup as a Student
                                </Link>
                            </div>
                            <div>
                                <Link href="#" className="SignBtn">
                                Signup as a teacher
                                </Link>
                            </div>
                        </Grid>
                    </Grid>
                </div>
            </Container>
        </div>
    )
}

export default Topics
