import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { FiEdit } from 'react-icons/fi';
import { FaEye, FaEyeSlash } from 'react-icons/fa';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { Divider } from '@mui/material';
import FormControl from '@mui/material/FormControl';
import InputLabel from '@mui/material/InputLabel';
import TextField from '@mui/material/TextField';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import Footer from '../Footer';

function AdminAccountContent() {
    const [adminaccountpicture, setadminaccountpicture] = useState(null);
    const [imgadminaccountData, setimgadminaccountData] = useState(null);
    const onChangeadminaccountpicture = e => {
        if (e.target.files[0]) {
            console.log("adminpicture: ", e.target.files);
            setadminaccountpicture(e.target.files[0]);
            const reader = new FileReader();
            reader.addEventListener("load", () => {
                setimgadminaccountData(reader.result);
            });
            reader.readAsDataURL(e.target.files[0]);
        }
    };
    const Input = styled('input')({
        display: 'none',
    });


    return (
        <>
            <Grid container className="p-3 main-head-dashboard">
                <Grid item xs={6} md={6}>
                    <Typography variant="h5">My Account</Typography>
                </Grid>
                <Grid item xs={6} md={6}>
                    <Typography align="right" variant="body1">Meg Ridgen</Typography>
                </Grid>
            </Grid>

            <Grid container spacing={2} className="p-3 min-height" >
                <Grid item xs={12} md={12} lg={8} xl={8}>
                    <Paper className="p-3">
                        <Typography variant="h5">Edit Information</Typography>
                        <Divider className="mt-3 mb-3" />
                        <Box sx={{
                            background: '#f4f4f4',
                            borderRadius: '4px',
                            padding: '10px'
                        }}>
                            <Typography variant="h5" style={{ textTransform: "uppercase" }}>User Information</Typography>
                            <Box component="form" className="account-form">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <FormControl variant="standard" className="mt-3">
                                            <InputLabel shrink htmlFor="username">
                                                User Name
                                            </InputLabel>
                                            <TextField sx={{ mb: 1 }}
                                                required
                                                fullWidth
                                                name="username"
                                                id="username"
                                                variant="standard"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <FormControl variant="standard" className="mt-3">
                                            <InputLabel shrink htmlFor="email-address">
                                                Email Address
                                            </InputLabel>
                                            <TextField sx={{ mb: 1 }}
                                                required
                                                fullWidth
                                                placeholder="email"
                                                name="email-address"
                                                id="email-address"
                                                variant="standard"
                                                inputProps={
                                                    { readOnly: true, }
                                                }
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <FormControl variant="standard" className="mt-3">
                                            <InputLabel shrink htmlFor="first-name">
                                                First Name
                                            </InputLabel>
                                            <TextField sx={{ mb: 1 }}
                                                required
                                                fullWidth
                                                name="first-name"
                                                id="first-name"
                                                variant="standard"
                                            />
                                        </FormControl>
                                    </Grid>
                                    <Grid item xs={12} md={6} lg={6} xl={6}>
                                        <FormControl variant="standard" className="mt-3">
                                            <InputLabel shrink htmlFor="last-name">
                                                Last Name
                                            </InputLabel>
                                            <TextField sx={{ mb: 1 }}
                                                required
                                                fullWidth
                                                name="last-name"
                                                id="last-name"
                                                variant="standard"
                                            />
                                        </FormControl>
                                    </Grid>
                                </Grid>

                            </Box>
                            <Divider className="mt-3 mb-3" />
                            <Typography variant="h5" style={{ textTransform: "uppercase" }}>About Yourself</Typography>
                            <Box component="form" className="about-form">
                                <Grid container spacing={2}>
                                    <Grid item xs={12} md={12} lg={12} xl={12}>
                                        <FormControl variant="standard" className="mt-3">
                                            <InputLabel shrink htmlFor="last-name">
                                                Biographical Info
                                            </InputLabel>
                                            <TextareaAutosize className="info-txtarea"
                                                maxRows={4}
                                                aria-label="maximum height"
                                                placeholder="Maximum 4 rows"
                                                defaultValue="Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua."
                                            />
                                        </FormControl>
                                    </Grid>

                                </Grid>
                            </Box>

                        </Box>
                    </Paper>
                </Grid>
                <Grid item xs={12} md={12} lg={4} xl={4}>
                    <Paper className="p-3">
                        <Typography variant="h5">Profile Area</Typography>
                        <Divider className="mt-3 mb-3" />
                        <Box component="form" sx={{
                            background: '#f4f4f4',
                            borderRadius: '4px',
                            padding: '10px'
                        }}>
                            <Grid container>
                                <Grid item xs={12} md={12} lg={12} xl={12} className="dis-flx">
                                    <FormControl className="mt-3 mb-5">
                                        <InputLabel shrink htmlFor="profile-pic">
                                            Upload profile picture
                                        </InputLabel>
                                        <div className="profile-pic-area">
                                            <div className="profile-pic">
                                                <img src={imgadminaccountData} className="ProfilePic_user w-100" />
                                            </div>
                                            <div className="upload-icon">
                                                <label htmlFor="icon-button-file">
                                                    <Input accept="image/*" id="icon-button-file" type="file" onChange={onChangeadminaccountpicture} />
                                                    <Button variant="contained" component="span" className="side-upload-button">
                                                        <FiEdit />
                                                    </Button>
                                                </label>
                                            </div>
                                        </div>
                                    </FormControl>
                                </Grid>
                            </Grid>
                        </Box>
                    </Paper>
                </Grid>
            </Grid>
            <Footer />

        </>


    );
}

export default AdminAccountContent;
