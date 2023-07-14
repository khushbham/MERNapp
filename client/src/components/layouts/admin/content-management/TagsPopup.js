import * as React from 'react';
import PropTypes from 'prop-types';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import Dialog from '@mui/material/Dialog';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import Typography from '@mui/material/Typography';
import { FiEye } from "react-icons/fi";
import { IoMdClose } from 'react-icons/io';
import Divider from '@mui/material/Divider';
import Table from '@mui/material/Table';
import TableBody from '@mui/material/TableBody';
import TableCell from '@mui/material/TableCell';
import TableContainer from '@mui/material/TableContainer';
import TableRow from '@mui/material/TableRow';
import { Link } from 'react-router-dom';
import Paper from '@mui/material/Paper';
import Box from '@mui/material/Box';
import TextField from '@mui/material/TextField';
import Select from '@mui/material/Select';
import MenuItem from '@mui/material/MenuItem';

const BootstrapDialog = styled(Dialog)(({ theme }) => ({
    '& .MuiDialogContent-root': {
        padding: theme.spacing(2),
    },
    '& .MuiDialogActions-root': {
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
                        position: 'absolute',
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

export default function TagsPopup() {
    const [open, setOpen] = React.useState(false);

    const [tagsoption, setTagsoption] = React.useState('10');
    const handletagsChange = (e) => {
        setTagsoption(e.target.value);
    };

    const handleClickOpen = () => {
        setOpen(true);
    };
    const handleClose = () => {
        setOpen(false);
    };

    return (
        <div>
            <IconButton aria-label="delete" onClick={handleClickOpen}>
                Merge Tag
            </IconButton>
            <BootstrapDialog
                onClose={handleClose}
                aria-labelledby="customized-dialog-title"
                open={open}
                className="tags-popup-up"
            >
                <BootstrapDialogTitle id="customized-dialog-title" onClose={handleClose}>
                    Merge Tag
                </BootstrapDialogTitle>
                <Divider />
                <DialogContent dividers className="dialg-cntnt">
                    <Typography gutterBottom>
                        You are merging 2 tags
                    </Typography>
                    <TableContainer>
                        <Table aria-label="simple-table" className="tags-table">
                            <TableBody>
                                <TableRow
                                    sx={{ '&:last-child td': { border: 0 } }}
                                >
                                    <TableCell align="left">Shark Team</TableCell>
                                    <TableCell align="left">Entered by <Link to="/">user</Link></TableCell>
                                </TableRow>
                                <TableRow
                                    sx={{ '&:last-child td': { border: 0 } }}
                                >
                                    <TableCell align="left">Shark Team</TableCell>
                                    <TableCell align="left">Entered by <Link to="/">Admin</Link></TableCell>
                                </TableRow>

                            </TableBody>
                        </Table>
                    </TableContainer>

                    <Paper className="p-4 tags-paper mt-4 mb-4">
                        <Box component="form" className="frm-cmpnnt">
                            <TextField id="standard-basic"
                                variant="standard"
                                className="tags-txtfld"
                                placeholder="Please enter the name you want for this tag"

                            />
                            <Select className="tags-slct-fld"
                                labelId="tags-select-label"
                                id="tags-select-label"
                                value={tagsoption}
                                onChange={handletagsChange}
                            >
                                <MenuItem value={10}>Categories</MenuItem>
                                <MenuItem value={20}>Topic</MenuItem>
                            </Select>
                            <Button variant="contained" className="tags-submit-btn mt-4">Submit</Button>
                        </Box>
                    </Paper>
                </DialogContent>
            </BootstrapDialog>
        </div>
    );
}
