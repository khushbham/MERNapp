import React, { useEffect, useState } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { Link, useHistory } from "react-router-dom";
import CircularProgress from "@mui/material/CircularProgress";

import Pagination from "@mui/material/Pagination";
import { useDispatch } from "react-redux";
import Navbar from "../../Navbar";
import TeacherAccSidebar from "./TeacherAccSidebar";
import { studentlisting } from "../../../../../actions/frontent";
//import { getWishlistOfStudent, removefromWishlist } from '../../../../../actions/frontent';
const label = { inputProps: { "aria-label": "Switch demo" } };

const MyStudents = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const [studentData, setstudentdata] = useState([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [page, setpage] = useState(1);
  const [totalPages, settotalPages] = useState(4);
  const [apiHit, setApiHit] = useState(false);
  // const wishlist=(id)=>{
  //     dispatch(removefromWishlist(id)).then((res)=>{
  //         if(res.success == true){
  //             getWishlist()
  //         }
  //     }).catch((err)=>{
  //         console.log(err)
  //     })
  //   }
  const onClick = (e) => {
    history.push({
      pathname: "/public-profile-of-teacher",
      search: `Id=${e}`,
      state: { Id: e },
    });
  };

  const getStudentlisting = () => {
    dispatch(studentlisting(page))
      .then((res) => {
        if (res && res.success) {
          setstudentdata(res.data.data);
          settotalPages(res.data.totalCount);
          setApiHit(true);
        }
      })
      .catch((err) => {
        console.log(err);
      });
  };
  var NumberofPages = Math.ceil(totalPages / 10);
  useEffect(() => {
    getStudentlisting();
  }, [page]);

  const handlePageChange = (e, p) => {
    setpage(p);
    setCurrentPage(p);
  };
  return (
    <>
      <Navbar />
      <Grid container>
        <Grid
          item
          lg={10}
          sm={12}
          md={12}
          xs={12}
          className="m-auto informationSidebar my-4"
        >
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Grid container>
              <Grid item lg={4} sm={4} md={4} xs={12}>
                <TeacherAccSidebar />
              </Grid>
              <Grid item lg={8} sm={8} md={8} xs={12}>
                <Typography
                  variant="h4"
                  component="h2"
                  className="loginHead m-3 my_students"
                >
                  My Students
                </Typography>
                <Box>
                  <Grid container className="fav-stud-teacher">
                    {studentData?.length ? (
                      <div className="techr_full_width">
                        <div className="teacher_favstudent">
                          {studentData?.map((arr) => {
                            return (
                              <Grid
                                item
                                xxl={3}
                                lg={3}
                                sm={6}
                                md={4}
                                xs={12}
                                className="mb-3"
                              >
                                <div className="SlideWrap">
                                  <div className="StudentProfile">
                                    <div className="profileImg">
                                      <img
                                        src={arr.profile_image ? arr.profile_image : 'https://mymentorbucket.s3.us-east-2.amazonaws.com/user.png'}
                                        alt="teacherProfile"
                                        onClick={() => onClick(arr.users._id)}
                                      />
                                      {/* <div className='crossIcon' onClick={()=>wishlist(arr.users._id)}>
                                  <ImCross/> 
                                </div> */}
                                    </div>
                                    <Typography
                                      variant="h5"
                                      component="div"
                                      className="mb-0"
                                      align="left"
                                    >
                                      {arr.first_name} {arr.last_name}
                                    </Typography>
                                    <Typography
                                      paragraph={true}
                                      component="div"
                                      className="mb-0 TeacherInfo"
                                      align="left"
                                    >
                                      {arr.phone}
                                    </Typography>
                                    <Typography
                                      paragraph={true}
                                      component="div"
                                      className="mb-0 TeacherInfo"
                                      align="left"
                                    >
                                      {arr.city}, {arr.state}
                                    </Typography>
                                    
                                  </div>
                                </div>
                              </Grid>
                            );
                          })}
                        </div>
                        <div className="pagination-section">
                          <Pagination
                            onChange={handlePageChange}
                            defaultPage={currentPage}
                            count={NumberofPages}
                            color="primary"
                          />
                        </div>
                      </div>
                    ) : apiHit ? (
                      <div
                        style={{
                          alignItems: "center",
                          textAlign: "center",
                          padding: "10px",
                          background: "#e1e3e7",
                        }}
                      >
                        No Record Found
                      </div>
                    ) : (
                      <Grid
                        item
                        lg={12}
                        md={12}
                        sm={12}
                        className="m-auto mb-4 loader_svg_on_clear_filter"
                      >
                        <CircularProgress color="inherit" />
                      </Grid>
                    )}
                  </Grid>
                </Box>
              </Grid>
            </Grid>
          </Box>
        </Grid>
      </Grid>
    </>
  );
};

export default MyStudents;
