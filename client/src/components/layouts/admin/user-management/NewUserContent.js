import React, { useState } from 'react';
import Typography from '@mui/material/Typography';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import { Select } from '@mui/material';
import NewAdmin from './NewAdmin';
import NewTeacher from './NewTeacher';
import NewStudent from './NewStudent';
import Footer from '../Footer';
import '../../../../css/admin/user.css';


function NewUserContent() {
    const [selectedUser, setSelectedUser] = useState(0);
    const [chgrole, setChgRole] = React.useState('0');
    function handleSelectChange(e) {
        setSelectedUser(e.target.value);
    }
    const roleChange = (event) => {
        setChgRole(event.target.value);
    };

    return (
        <>
            <Grid container className="p-3 main-head-dashboard">
                <Grid item xs={6} md={6} lg={6} xl={6}>
                    <Typography variant="h5">New User</Typography>
                </Grid>
                <Grid item xs={6} md={6} lg={6} xl={6}>
                    <Typography align="right" variant="body1">User Management / <span>New User</span></Typography>
                </Grid>
            </Grid>

            <Grid container className="px-3 mb-3" style={{ minHeight: '100vh' }}>
                <Grid item xs={12} md={12} lg={12} xl={12} >
                    <Paper className="p-3" style={{ height: '100%' }}>
                        <Box>
                            <Grid container>
                                <Grid item xs={12} md={6} lg={6} xl={6} className="filter-role-area">
                                    <FormControl variant="standard">
                                        <InputLabel shrink htmlFor="filter-by-role-type">
                                            Add New Role
                                        </InputLabel>
                                        <Select
                                            value={chgrole}
                                            defaultValue={10}
                                            onChange={roleChange}
                                            displayEmpty
                                            className="filter-role-list"
                                            inputProps={{ 'aria-label': 'Without label' }}
                                        >
                                            <MenuItem value={0}>Administrator</MenuItem>
                                            <MenuItem value={1}>Teacher</MenuItem>
                                            <MenuItem value={2}>Student</MenuItem>
                                        </Select>
                                    </FormControl>
                                    {/* <div className="new-user-content-area">
                                                    {chgrole == "0" &&  <NewAdmin/>}
                                                    {chgrole == "1" &&  <h1>Teacher</h1>}
                                                    {chgrole == "2" &&  <h1>Student</h1>}
                                                </div> */}
                                </Grid>
                            </Grid>

                            <Grid container>
                                <Grid item xs={12} md={12} lg={12} xl={12} className="filter-role-content-area">
                                    <div className="new-user-content-area">
                                        {chgrole == "0" && <NewAdmin />}
                                        {chgrole == "1" && <NewTeacher />}
                                        {chgrole == "2" && <NewStudent />}
                                    </div>
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

export default NewUserContent;
