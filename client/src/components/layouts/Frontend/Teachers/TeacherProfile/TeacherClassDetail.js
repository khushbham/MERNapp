import React, { useEffect, useState } from 'react'
import Container from '@mui/material/Container';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Link from '@mui/material/Link';
import Grid from '@mui/material/Grid';
import { useDispatch } from 'react-redux';
import { getClassesList } from '../../../../../actions/frontent';
import { Button } from '@mui/material';
import { useHistory } from 'react-router-dom';
import CircularProgress from "@mui/material/CircularProgress";

const TeacherClassDetail = () => {

    const [classlist, setclasslist] = useState([])
    const [apiHit, setApiHit] = useState(false);
    const dispatch = useDispatch()
    const history = useHistory()

    useEffect(() => {
        dispatch(getClassesList()).then((res) => {
            if (res && res.success) {
                setclasslist(res.data)
                setApiHit(true)
            }
        }).catch((err) => {
            console.log(err)
        })
    }, [])

    const classDetails = (id) => {
        history.push({
            pathname: "/teacher/class-detials",
            search: `Class_Id=${id}`,
        })
    };
    return (
        <Box className="classesDetails">
            <Container>
                <Grid container>
                    {apiHit ?
                        <Grid item lg={12} md={12} xs={12}>
                            {classlist?.length ? (
                                <div>
                                    {classlist?.map((arr) => {
                                        return <Grid container className="align-items-center classesList">
                                            <Grid item lg={8} md={8} sm={8} xs={12}>
                                                <Typography variant="h5" gutterBottom component="div" className="ClassTitle" onClick={() => classDetails(arr?._id)}>{arr.discipline}</Typography>
                                                <Typography variant="h6" gutterBottom component="div" className="classSubTitle">{arr.class_title} </Typography>
                                                <Typography variant="caption" display="block" gutterBottom className="TimeText"> ${arr.price}/hour {" "}

                                                    <span className="IndividualClass">{arr.max_students_allowed == 1 ? "Individual class" : "Group"}</span>
                                                </Typography>
                                            </Grid>
                                        </Grid>
                                    })}
                                </div>
                            ) : (<div style={{ alignItems: "center", textAlign: "center", padding: "10px", background: "#e1e3e7" }}>
                                No Record Found
                            </div>)}
                            <Box className="mt-4">
                                <Button className="saveBtn" onClick={() => history.push("/classes-steps")}>Add new class</Button>
                            </Box>
                        </Grid> :
                        <Grid
                            item
                            lg={12}
                            md={12}
                            sm={12}
                            className="m-auto mb-4 loader_svg_on_clear_filter"
                        >
                            <CircularProgress color="inherit" />
                        </Grid>
                    }
                </Grid>
            </Container>
        </Box>
    )
}

export default TeacherClassDetail
