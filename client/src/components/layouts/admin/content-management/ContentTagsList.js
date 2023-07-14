import React, { useState, useEffect } from "react";
import faker from "faker";
import SmartDataTable from "react-smart-data-table";
import { FiEye } from "react-icons/fi";
// Import basic styling
import "react-smart-data-table/dist/react-smart-data-table.css";
import Checkbox from "@mui/material/Checkbox";
import Link from "@mui/material/Link";
import "../../../../css/admin/student.css";
import Loader from "../../../Loader";

import {
  getTagsData,
  tagsArrayChanged,
  mergeTagsDataIntoOne,
} from "../../../../actions/contentManagement";
import Pagination from "@mui/material/Pagination";

import { useDispatch, useSelector } from "react-redux";
import MenuItem from "@mui/material/MenuItem";
import InputBase from "@mui/material/InputBase";
import InputLabel from "@mui/material/InputLabel";
import { FiSearch } from "react-icons/fi";
import { FormControl } from "@mui/material";
import Grid from "@mui/material/Grid";
import Box from "@mui/material/Box";
import { Select } from "@mui/material";
import { styled, alpha } from "@mui/material/styles";
import PropTypes from "prop-types";
import Button from "@mui/material/Button";
import Dialog from "@mui/material/Dialog";
import DialogTitle from "@mui/material/DialogTitle";
import DialogContent from "@mui/material/DialogContent";
import DialogActions from "@mui/material/DialogActions";
import IconButton from "@mui/material/IconButton";
import Typography from "@mui/material/Typography";
import { IoMdClose } from "react-icons/io";
import Divider from "@mui/material/Divider";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableRow from "@mui/material/TableRow";
import Paper from "@mui/material/Paper";
import TextField from "@mui/material/TextField";
const label = { inputProps: { "aria-label": "Checkbox demo" } };

export default function ContentTagsList() {
  const dispatch = useDispatch();
  const tagsArrayForMergeData = useSelector(
    (state) => state.sessions.tagsArrayForMergeData
  );
  const tagsArrayForMergeDataComplete = useSelector(
    (state) => state.sessions.tagsArrayForMergeDataComplete
  );
  const [apiHit, setApiHit] = useState(false);

  const [tableData, setTableData] = useState([]);
  const [totalPages, setTotalPages] = useState(0);
  const [currentPage, setCurrentPage] = useState(1);
  const [tagsArray, setTagsArray] = useState([]);
  const [tagsCompleteArray, setTagsCompleteArray] = useState([]);
  const [open, setOpen] = useState(false);
  const [message, setMessage] = useState(null);
  const handleChange = (e, p) => {
    setCurrentPage(p);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };
  const updateTagsAfterMerge = (e) => {
    e.preventDefault();
    var formBody = {};
    formBody.tag_name = e.target.tag_name.value;
    formBody.tag_type = e.target.tag_type.value;
    formBody.ids = tagsArrayForMergeData;
    dispatch(mergeTagsDataIntoOne(formBody)).then((res) => {
      if (res && res.success) {
        dispatch(tagsArrayChanged([], []));

        setMessage(res.message);
      } else {
        setMessage("Please enter valid data");
      }
    });
  };
  const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    "& .MuiDialogContent-root": {
      padding: theme.spacing(2),
    },
    "& .MuiDialogActions-root": {
      padding: theme.spacing(1),
    },
  }));

  const BootstrapDialogTitle = (props) => {
    const { children, onClose, ...other } = props;

    return (
      <DialogTitle sx={{ m: 0, p: 2 }} {...other} className="tag-dialg">
        {children}
        {onClose ? (
          <IconButton
            aria-label="close"
            onClick={onClose}
            sx={{
              position: "absolute",
              right: 8,
              top: 8,
              color: (theme) => theme.palette.grey[500],
            }}
          >
            <IoMdClose />
          </IconButton>
        ) : null}
      </DialogTitle>
    );
  };

  BootstrapDialogTitle.propTypes = {
    children: PropTypes.node,
    onClose: PropTypes.func.isRequired,
  };
  const [tagName, setTagName] = useState("");
  const [tagType, setTagType] = useState(0);
  const [tagStatus, setTagStatus] = useState(-1);

  //var tagsMergeAbleArray = [];
  const tagsIntoMergeArray = (id, row) => {
    // if(buttonClicked == true){
    //   setButtonClicked(false);
    // }
    //setButtonClicked(!buttonClicked);
    // console.log(buttonClicked);
    var newArray = [];
    var newArrayComplete = [];
    newArray = tagsArray;
    newArrayComplete = tagsCompleteArray;

    if (newArray.indexOf(id) === -1) {
      newArray.push(id);
      newArrayComplete.push(row);
    } else {
      newArray.splice(newArray.indexOf(id), 1);
      newArrayComplete.splice(newArrayComplete.indexOf(row), 1);
    }
    setTagsArray(newArray);
    setTagsCompleteArray(newArrayComplete);
    //tagsMergeAbleArray = newArray;
    dispatch(tagsArrayChanged(newArray, newArrayComplete));
  };
  const headers = {
    _id: {
      text: "ID",
      invisible: true,
      sortable: false,
      transform: (value, index, row) => {
        return value;
      },
    },
    Tag: {
      text: "Tags",
      invisible: false,
      sortable: false,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <div className="TagsSlection">
            <Checkbox
              {...label}
              name={`merge_tags`}
              value={row._id}
              onClick={() => tagsIntoMergeArray(row._id, row)}
            />
            <Link href="#" className="Tags-link">
              {value}
            </Link>
          </div>
        );
      },
    },
    AppliesTo: {
      text: "Applies To",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <Link className="Tags-link">{value}</Link>
          </>
        );
      },
    },
    // instances: {
    //   text: "instances",
    //   invisible: false,
    //   sortable: true,
    //   filterable: true,
    //   transform: (value, index, row) => {
    //     return (
    //       <>
    //         <p>{value}</p>
    //       </>
    //     );
    //   },
    // },

    ContentStatus: {
      text: "Content Status",
      invisible: false,
      sortable: true,
      filterable: true,
      transform: (value, index, row) => {
        return (
          <>
            <p>{value}</p>
          </>
        );
      },
    },
    // action: {
    //   text: "Action",
    //   invisible: false,
    //   sortable: false,
    //   filterable: true,
    //   transform: (value, index, row) => {
    //     return (
    //       <>
    //         <TagsPopup />
    //       </>
    //     );
    //   },
    // },
  };

  useEffect(() => {
    setApiHit(false);
    // var tagNamee = document.getElementById('tagName').value;
    // setTagName(tagNamee);
    dispatch(
      getTagsData({
        page: currentPage,
        tag_name: tagName,
        tag_type: tagType,
        tag_status: tagStatus,
      })
    ).then((res) => {
      if (res && res.success) {
        var testTransactData = [];
        const numTransactResults = res.data.length;

        for (let i = 0; i < numTransactResults; i++) {
          testTransactData.push({
            _id: res.data[i]._id,
            Tag: res.data[i].tag_name,
            AppliesTo: res.data[i].tag_type == 2 ? "Topics" : "Category",
            //instances: res.data[i].tag_name,
            ContentStatus: !res.data[i].tag_status ? "Draft" : "Published",
          });
        }
        setTableData(testTransactData);
        setTotalPages(res.totalPages);

        setApiHit(true);
      }
    });
  }, [currentPage, tagName, tagType, tagStatus]);
const StyledInputBase = styled(InputBase)(({ theme }) => ({
  color: "inherit",
  "& .MuiInputBase-input": {
    padding: theme.spacing(1, 5, 1, 1),
    // vertical padding + font size from searchIcon
    // paddingRight: `calc(1em + ${theme.spacing(1)})`,
    transition: theme.transitions.create("width"),
    width: "100%",
    [theme.breakpoints.up("md")]: {
      width: "100%",
    },
  },
}));
  return (
    <>
      <Box
        sx={{
          display: "flex",
          backgroundColor: "rgb(106 113 135 / 10%)",
        }}
      >
        <Grid container className="p-3 top-btm" spacing={2}>
          <Grid item xs={12} md={3} lg={3} xl={3} className="filter-page-slct">
          <InputLabel variant="standard" htmlFor="filter-by-page" className="tag-names_tag-page">
                Tag Name :
              </InputLabel>
            <FormControl className="tag-frm-cntrl">
              
              <input
                placeholder="By tag"
                inputProps={{ "aria-label": "search" }}
                id="tagName"
                onChange={(e) => {
                  setTagName(e.target.value);
                  setCurrentPage(1);
                }}
                defaultValue={tagName}
                className="form-control page-search-field"
              />
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} lg={3} xl={3} className="filter-page-slct">
            <FormControl>
              <InputLabel variant="standard" htmlFor="filter-by-page">
                Label :
              </InputLabel>
              <Select
                value={tagType}
                onChange={(e) => {
                  setTagType(e.target.value);
                  setCurrentPage(1);
                }}
                displayEmpty
                className="filtertype-pagestatus"
              >
                <MenuItem value={0}>All</MenuItem>
                <MenuItem value={1}>Categories</MenuItem>
                <MenuItem value={2}>Topics</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} lg={3} xl={3} className="filter-page-slct">
            <FormControl>
              <InputLabel variant="standard" htmlFor="filter-by-page">
                Filter by Content Status
              </InputLabel>
              <Select
                value={tagStatus}
                displayEmpty
                onChange={(e) => {
                  setTagStatus(e.target.value);
                  setCurrentPage(1);
                }}
                className="filtertype-pagestatus"
              >
                <MenuItem value={-1}>All Statuses</MenuItem>
                <MenuItem value={1}>Published</MenuItem>
                <MenuItem value={0}>Draft</MenuItem>
              </Select>
            </FormControl>
          </Grid>
          <Grid item xs={12} md={3} lg={3} xl={3} className="merge-tag">
            <Grid container className="row-algn-items">
              <Grid item xs={12} md={6} lg={6} xl={6}>
                {/* {console.log(tagsMergeAbleArray)} */}
                {tagsArrayForMergeData && tagsArrayForMergeData.length > 0 && (
                  <Button variant="contained" onClick={handleClickOpen}>
                    Merge Tag
                  </Button>
                )}
                {/* <Link onClick={handleClickOpen} className="mrg-bttn">Merge Tag</Link> */}
                {/* <IconButton aria-label="delete" onClick={handleClickOpen} className="mrg-bttn">
                Merge Tag
            </IconButton> */}
                <BootstrapDialog
                  onClose={handleClose}
                  aria-labelledby="customized-dialog-title"
                  open={open}
                  className="tags-popup-up"
                >
                  <BootstrapDialogTitle
                    id="customized-dialog-title"
                    onClose={handleClose}
                  >
                    Merge Tag
                  </BootstrapDialogTitle>
                  <Divider />
                  <DialogContent dividers className="dialg-cntnt">
                    <Typography gutterBottom>
                      You are merging {tagsArrayForMergeDataComplete.length}{" "}
                      tags
                    </Typography>
                    <TableContainer>
                      <Table aria-label="simple-table" className="tags-table">
                        <TableBody>
                          {console.log(tagsArrayForMergeDataComplete)}
                          {tagsArrayForMergeDataComplete &&
                            tagsArrayForMergeDataComplete.length > 0 &&
                            tagsArrayForMergeDataComplete.map((tag, i) => (
                              <TableRow
                                sx={{ "&:last-child td": { border: 0 } }}
                                key={i}
                              >
                                <TableCell align="left">{tag.Tag}</TableCell>
                                <TableCell align="left">
                                  <Link className="Tags-link">
                                    {tag.AppliesTo}
                                  </Link>
                                </TableCell>
                              </TableRow>
                            ))}
                        </TableBody>
                      </Table>
                    </TableContainer>

                    <Paper className="p-4 tags-paper mt-4 mb-4">
                      {message && message != "" && (
                        <Box className="alert alert-success">{message}</Box>
                      )}
                      <form onSubmit={(e) => updateTagsAfterMerge(e)}>
                        <Box className="frm-cmpnnt">
                          <TextField
                            id="standard-basic tag_name"
                            variant="standard"
                            className="tags-txtfld"
                            placeholder="Please enter the name you want for this tag"
                            name="tag_name"
                            required
                            // onChange={onChange}
                            // defaultValue={formData.tag_name}
                          />
                          <Select
                            className="tags-slct-fld"
                            labelId="tags-select-label"
                            name="tag_type"
                            id="tag_type"
                            required
                            //value={formData.tag_type}
                            // onChange={onChange}
                          >
                            <MenuItem value={1}>Categories</MenuItem>
                            <MenuItem value={2}>Topic</MenuItem>
                          </Select>
                          <Button
                            variant="contained"
                            className="tags-submit-btn mt-4"
                            type="submit"
                            //onClick={() => updateTagsAfterMerge()}
                          >
                            Submit
                          </Button>
                        </Box>
                      </form>
                    </Paper>
                  </DialogContent>
                </BootstrapDialog>
              </Grid>
            </Grid>
          </Grid>
        </Grid>
      </Box>
      {apiHit ? (
        <>
          <SmartDataTable
            data={tableData}
            responsive={true}
            name="test-table"
            className="ui compact selectable table content-tags mt-3"
            sortable
            headers={headers}
            emptyTable={
              <div style={{ alignItems: "center", textAlign: "center" }}>
                No Record Found
              </div>
            }
          />
          {totalPages != 0 && tableData.length > 0 && (
            <div className="pagination-section">
              <Pagination
                onChange={handleChange}
                defaultPage={currentPage}
                count={totalPages}
                color="primary"
              />
            </div>
          )}
        </>
      ) : (
        <div className="mt-5 mb-5">
          <Loader />
        </div>
      )}
    </>
  );
}
