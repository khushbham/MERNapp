import React, { useState, useEffect } from "react";
import Button from "@mui/material/Button";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import { Divider } from "@mui/material";
import Paper from "@mui/material/Paper";
import Grid from "@mui/material/Grid";
import SunEditor from "suneditor-react";
import "suneditor/dist/css/suneditor.min.css";
import "../../../../css/admin/content-management.css";
import Footer from "../Footer";
import { useParams } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import {
  getSinglePageDetail,
  updatePagesData,
} from "../../../../actions/contentManagement";

const PagesContent = () => {
  const dispatch = useDispatch();
  const [apiHit, setApiHit] = useState(false);
  const [pageKey, setPageKey] = useState("");
  const [pageContent, setPageContent] = useState("");
  const [pageTitle, setPageTitle] = useState("");
  const [message, setMessage] = useState("");
  const { id } = useParams();
  useEffect(() => {
    dispatch(getSinglePageDetail(id)).then((res) => {
      if (res && res.success) {
        //console.log(res.data);
        setPageKey(res.data && res.data.setting_name);
        setPageTitle(res.data && res.data.setting_title);
        setPageContent(res.data && res.data.setting_description);
        setApiHit(true);
      }
    });
  }, []);

  const onSubmit = (e) => {
    e.preventDefault();
    var dataObject = {};
    dataObject.setting_name = pageKey;
    dataObject.setting_title = pageTitle;
    dataObject.setting_description = pageContent;
    dispatch(updatePagesData(dataObject)).then((res) => {
      //console.log(res);
      if (res && res.success) {
        setMessage("Page detail updated successfully.");
      }
    });
  };
  return (
    <>
      {apiHit && (
        <section className="pages-content-section">
          <Grid container className="p-3 main-cnt-head">
            <Grid item xs={6} md={6}>
              <Typography variant="h5">Content Management</Typography>
            </Grid>
            <Grid item xs={6} md={6}>
              <Typography align="right" variant="body1">
                Content Management / <span>{pageTitle}</span>
              </Typography>
            </Grid>
          </Grid>

          <Grid container className="p-3">
            <Grid item xs={12} md={1} lg={1} xl={1}></Grid>
            <Grid item xs={12} md={10} lg={10} xl={10}>
              <Paper className="p-3">
                <Grid item xs={6} md={6}>
                  <Typography variant="h5">Edit Page Content</Typography>
                </Grid>
                <Divider className="mt-3 mb-3" />
                {message != "" && (
                  <Box className="alert alert-success">{message}</Box>
                )}
                <div className="editor-box">
                  <SunEditor
                    defaultValue={pageContent}
                    onChange={setPageContent}
                    setOptions={{
                      height: "600",
                      plugins: ["font", "list"],
                      font: [
                        "Rubik Regular",
                        "Rubik Medium",
                        "Rubik Bold",
                        "Arial",
                        "Comic Sans MS",
                        "Courier New",
                        "Impact",
                        "Georgia",
                        "tahoma",
                        "Trebuchet MS",
                        "Verdana",
                        "Montserrat, sans-serif",
                        "Lato, sans-serif",
                        "Hammersmith One, sans-serif",
                        "Roboto, sans-serif",
                        "Open Sans, sans-serif",
                        "Oswald, sans-serif",
                        "Courgette, cursive",
                      ],
                      buttonList: [
                        [
                          "font",
                          "align",
                          "fontSize",
                          "fontColor",
                          "hiliteColor",
                          "bold",
                          "underline",
                          "italic",
                          "strike",
                          "subscript",
                          "superscript",
                          "link",
                        ],
                        ["image"],
                        ["undo", "redo", "removeFormat"],
                        ["showBlocks", "codeView", "preview", "print", "save"],
                        ["horizontalRule", "template", "list"],
                      ],
                    }}
                  />
                </div>
                <Box className="my-3" sx={{ display: "flex" }}>
                  <Button
                    className="spacing-right"
                    variant="contained"
                    mr={2}
                    onClick={(e) => onSubmit(e)}
                  >
                    Save Changes
                  </Button>
                  {/* <Button variant="contained" color="secondary">
                    Cancel
                  </Button> */}
                </Box>
              </Paper>
            </Grid>
            <Grid item xs={12} md={1} lg={1} xl={1}></Grid>
          </Grid>
        </section>
      )}
      <Footer />
    </>
  );
};

export default PagesContent;
