import React from "react";
import Container from "@mui/material/Container";
import "../../../../css/Frontend/style.css";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import MenuItem from "@mui/material/MenuItem";
import FormControl from "@mui/material/FormControl";
import Select from "@mui/material/Select";
import Pagination from "@mui/material/Pagination";
import Grid from "@mui/material/Grid";
import { useHistory } from "react-router-dom";
import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { useDispatch } from "react-redux";
import { addwishlist } from "../../../../actions/frontent";
import { Avatar } from "@material-ui/core";
import Card from "@mui/material/Card";
import CardContent from "@mui/material/CardContent";
import CardMedia from "@mui/material/CardMedia";
import Button from "@mui/material/Button";
import Box from "@mui/material/Box";

const TeacherFilterSlider = (props) => {
  const { teacherData, setpage, totalPages } = props;
  const history = useHistory();
  const dispatch = useDispatch();
  const [currentPage, setCurrentPage] = React.useState(1);
  // const handleChange = (event) => {
  //     distance(event.target.value);
  // };
  var NumberofPages = Math.ceil(totalPages / 10);
  const handlePageChange = (e, p) => {
    setpage(p);
    setCurrentPage(p);
  };
  const goToClassDetailPage = (e, class_id) => {
    history.push({
      pathname: "/students/class-detail-for-booking-process",
      search: `class_id=${class_id}&teacher_id=${e}`,
      state: { class_id: class_id, teacher_id: e },
    });
  };
  const goToTeacherProfile = (e) => {
    history.push({
      pathname: "/public-profile-of-teacher",
      search: `Id=${e}`,
      state: { Id: e },
    });
  };
  // const wishlist = (id) => {
  //     dispatch(addwishlist(id)).then((res) => {
  //         console.log(res, "res")
  //         if (res.status == true) {
  //             setwishlist(true)
  //         }
  //     }).catch((err) => {
  //         console.log(err)
  //     })
  // }
  return (
    <div className="TeacherFilterSlider pb-4">
      <Container>
        <div className="Filter mb-4"></div>
        <div>
          {teacherData?.length && teacherData ? (
            <div>
              <Grid container>
                {teacherData?.map((arr) => {
                  return (
                    <Grid
                      item
                      xs={12}
                      sm={6}
                      md={6}
                      lg={3}
                      className="main_cntner_area"
                    >
                      <Box sx={{ ml: 1, mr: 1 }} className="main_cntner_boxx">
                        <Card className="teacher_search_results">
                          <Box className="results_filter_image">
                            <CardMedia
                              component="img"
                              height="140"
                              image={arr.cover_image}
                              alt="green iguana"
                              onClick={() =>
                                goToClassDetailPage(
                                  arr?.teacherDetail[0]?._id,
                                  arr?._id
                                )
                              }
                            />
                          </Box>
                          <CardContent className="results_card_content">
                            <div className="d-flex align-items-center justify-content-between">
                              <div className="d-flex align-items-center">
                                <Typography
                                  variant="h5"
                                  component="div"
                                  className="mt-1 search_results_title"
                                  align="left"
                                  onClick={() =>
                                    goToClassDetailPage(
                                      arr?.teacherDetail[0]?._id,
                                      arr?._id
                                    )
                                  }
                                >
                                  {arr.class_title}
                                </Typography>
                              </div>
                              <div className="d-flex align-items-center justify-content-center display_price">
                                ${arr.price}
                              </div>
                            </div>
                            <Typography
                              paragraph={true}
                              component="div"
                              className="mb-0 TeacherInfo"
                              align="left"
                            >
                              {arr.session_type == 1 ? "Local" : "Online"}
                            </Typography>
                            <div className="d-flex align-items-center justify-content-between">
                              <div
                                className="d-flex align-items-center"
                                style={{ cursor: "pointer" }}
                                onClick={() =>
                                  goToTeacherProfile(arr?.teacherDetail[0]?._id)
                                }
                              >
                                <Avatar
                                  alt="teacher Profile"
                                  src={arr?.teacherDetail[0]?.profile_image}
                                  className="me-2"
                                />
                                <Typography
                                  variant="body1"
                                  gutterBottom
                                  className="search_teacher_info"
                                >
                                  {" "}
                                  By {arr?.teacherDetail[0]?.first_name}{" "}
                                  {arr?.teacherDetail[1]?.last_name}{" "}
                                </Typography>
                              </div>
                              <div className="d-flex align-items-center justify-content-center">
                                <Stack spacing={5}>
                                  <Rating
                                    name="read-only"
                                    className="RatingVal"
                                    value={arr.avgRating}
                                    readOnly
                                  />
                                </Stack>
                                <span className="totalReviews">
                                  <Typography
                                    paragraph={true}
                                    component="div"
                                    className="mb-0 TeacherInfo"
                                    align="left"
                                  >
                                    ({arr?.totalRating})
                                  </Typography>
                                </span>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </Box>
                    </Grid>
                  );
                })}
              </Grid>
              <div className="pagination-section">
                <Pagination
                  onChange={handlePageChange}
                  defaultPage={currentPage}
                  count={NumberofPages}
                  color="primary"
                />
              </div>
            </div>
          ) : (
            <h3> No Record Found</h3>
          )}
        </div>
      </Container>
    </div>
  );
};

export default TeacherFilterSlider;
