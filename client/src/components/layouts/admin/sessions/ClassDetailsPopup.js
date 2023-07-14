import * as React from 'react';
import Button from '@mui/material/Button';
import { styled } from '@mui/material/styles';
import { Divider } from '@mui/material';
import Dialog from '@mui/material/Dialog';
import { Link } from 'react-router-dom';
import { BsArchive } from 'react-icons/bs';
import DialogTitle from '@mui/material/DialogTitle';
import DialogContent from '@mui/material/DialogContent';
import DialogActions from '@mui/material/DialogActions';
import IconButton from '@mui/material/IconButton';
import { FiEdit } from "react-icons/fi";
import PropTypes from 'prop-types';
import { useTheme } from '@mui/material/styles';
import OutlinedInput from '@mui/material/OutlinedInput';
import MenuItem from '@mui/material/MenuItem';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import { FormControl } from "@mui/material";
import { Select } from '@mui/material';
import Grid from '@mui/material/Grid';
import { IoMdClose } from 'react-icons/io';
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';

const TagTopicInput = ({ tags }) => {
  const [tagtopicData, settagtopicData] = React.useState(tags);
  const removetagtopicData = indexToRemove => {
    settagtopicData([...tagtopicData.filter((_, index) => index !== indexToRemove)]);
  };
  const addtagtopicData = event => {
    if (event.target.value !== '') {
      settagtopicData([...tagtopicData, event.target.value]);
      event.target.value = '';
    }
  };
  return (
    <div className="tag-topic-input">
      <ul className="tags-topic">
        {tagtopicData.map((tag, index) => (
          <li key={index} className="tag-topic">
            <span className="tag-topic-title">{tag}</span>
            <span
              className="tag-topic-close-icon"
              onClick={() => removetagtopicData(index)}
            >
              x
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        onKeyUp={event => (event.key === 'Enter' ? addtagtopicData(event) : null)}
        placeholder="Press enter to add a topic"
      />
    </div>
  );
};

const TagLanguageInput = ({ tags }) => {
  const [taglanguageData, settaglanguageData] = React.useState(tags);
  const removetaglanguageData = indexToRemove => {
    settaglanguageData([...taglanguageData.filter((_, index) => index !== indexToRemove)]);
  };
  const addtaglanguageData = event => {
    if (event.target.value !== '') {
      settaglanguageData([...taglanguageData, event.target.value]);
      event.target.value = '';
    }
  };
  return (
    <div className="tag-topic-input">
      <ul className="tags-topic">
        {taglanguageData.map((tag, index) => (
          <li key={index} className="tag-topic">
            <span className="tag-topic-title">{tag}</span>
            <span
              className="tag-topic-close-icon"
              onClick={() => removetaglanguageData(index)}
            >
              x
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        onKeyUp={event => (event.key === 'Enter' ? addtaglanguageData(event) : null)}
        placeholder="Press enter to add a topic"
      />
    </div>
  );
};



const ClassDialog = styled(Dialog)(({ theme }) => ({
  '& .MuiDialogContent-root': {
    padding: theme.spacing(2),
  },
  '& .MuiDialogActions-root': {
    padding: theme.spacing(1),
  },
}));

const ClassDialogTitle = (props) => {
  const { children, onClose, ...other } = props;
  return (
    <DialogTitle sx={{ m: 0, p: 2 }} {...other}>
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

ClassDialogTitle.propTypes = {
  children: PropTypes.node,
  onClose: PropTypes.func.isRequired,
};

export default function ClassDetailsPopup() {
  const [open, setOpen] = React.useState(false);
  const [fullWidth, setFullWidth] = React.useState(true);
  const [maxWidth, setMaxWidth] = React.useState('md');
  const [chgclass, setChgType] = React.useState('10');
  const [chgteacher, setChgTeacher] = React.useState('10');
  const [chglevel, setChgLevel] = React.useState('10');
  const [chgteacherprofile, setChgProfileTeacher] = React.useState('10');
  const [chgcategory, setChgCategory] = React.useState('10');
  const [chgclasstype, setChgClassType] = React.useState('10');
  const [sessiontype, setSessionType] = React.useState('10');
  const [schedule, setSchedule] = React.useState('10');
  const [participants, setParticipants] = React.useState('10');
  const scheduleChange = (event) => {
    setSchedule(event.target.value);
  };
  const participantsTypeChange = (event) => {
    setParticipants(event.target.value);
  };
  const sessionTypeChange = (event) => {
    setSessionType(event.target.value);
  };
  const classChange = (event) => {
    setChgType(event.target.value);
  };
  const teacherChange = (event) => {
    setChgTeacher(event.target.value);
  };
  const teacherProfileChange = (event) => {
    setChgProfileTeacher(event.target.value);
  };
  const classCategoryChange = (event) => {
    setChgCategory(event.target.value);
  };
  const classLevelChange = (event) => {
    setChgLevel(event.target.value);
  };
  const classTypeChange = (event) => {
    setChgClassType(event.target.value);
  };
  const handleClickOpen = () => {
    setOpen(true);
  };
  const handleClose = () => {
    setOpen(false);
  };

  const handleMaxWidthChange = (event) => {
    setMaxWidth(
      event.target.value,
    );
  };

  const handleFullWidthChange = (event) => {
    setFullWidth(event.target.checked);
  };
  // const theme = useTheme();
  // const [personName, setPersonName] = React.useState([]);
  // const [classlanguage, setClassLanguage] = React.useState([]);

  // const handleChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setPersonName(
  //     typeof value === 'string' ? value.split(',') : value,
  //   );
  // };

  // const languageChange = (event) => {
  //   const {
  //     target: { value },
  //   } = event;
  //   setClassLanguage(
  //     typeof value === 'string' ? value.split(',') : value,
  //   );
  // };

  return (
    <div>
      <Button variant="text" onClick={handleClickOpen} className="edit-popup-button">
        <FiEdit />
      </Button>
      <ClassDialog
        onClose={handleClose}
        fullWidth={fullWidth}
        maxWidth={maxWidth}
        aria-labelledby="customized-dialog-title"
        open={open}
      >
        <ClassDialogTitle id="customized-dialog-title" onClose={handleClose}>
          Class Details
        </ClassDialogTitle>
        <Divider />
        <DialogContent className="popup-content">
          <div className="details-backgr">
            <Typography variant="h5">Administrative Controls</Typography>
            <Divider className="mt-3 mb-3" />
            <Box component="form">
              <Grid container spacing={2}>
                <Grid item xs={12} md={3} xl={3} lg={3}>
                  <FormControl variant="standard" className="class-status">
                    <InputLabel shrink htmlFor="class-status">
                      Class Status
                    </InputLabel>
                    <Select
                      value={chgclass}
                      defaultValue={10}
                      onChange={classChange}
                      displayEmpty
                      className="status-class-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>Published</MenuItem>
                      <MenuItem value={20}>Draft</MenuItem>
                      <MenuItem value={30}>Archived</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3} xl={3} lg={3}>
                  <FormControl variant="standard" className="teacher-user">
                    <InputLabel shrink htmlFor="teacher-user">
                      Associated Teacher User
                    </InputLabel>
                    <Select
                      value={chgteacher}
                      defaultValue={10}
                      onChange={teacherChange}
                      displayEmpty
                      className="teacher-user-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>Meg Ridgen, Riverside, CA</MenuItem>
                      <MenuItem value={20}>Meg Ridgen, Riverside, CA</MenuItem>
                      <MenuItem value={30}>Meg Ridgen, Riverside, CA</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3} xl={3} lg={3}>
                  <FormControl variant="standard" className="teacher-profile">
                    <InputLabel shrink htmlFor="teacher-profile">
                      Associated Teacher Profile
                    </InputLabel>
                    <Select
                      value={chgteacherprofile}
                      defaultValue={10}
                      onChange={teacherProfileChange}
                      displayEmpty
                      className="teacher-profile-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>Meg Ridgen, Dance Teacher</MenuItem>
                      <MenuItem value={20}>Meg Ridgen, Dance Teacher</MenuItem>
                      <MenuItem value={30}>Meg Ridgen, Dance Teacher</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={3} xl={3} lg={3}>

                </Grid>
              </Grid>
            </Box>
          </div>
          <div className="main-class-area">
            <Box component="form" className="p-3 class-info">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} xl={4} lg={4}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="class-title">
                      Class Title
                    </InputLabel>
                    <TextField
                      required
                      variant="standard"
                      id="outlined-required"
                      placeholder="Urban Dance 101"
                    />
                  </FormControl>

                  <FormControl variant="standard" className="mt-3">
                    <InputLabel shrink htmlFor="class-subtitle">
                      Class Subtitle
                    </InputLabel>
                    <TextField
                      required
                      variant="standard"
                      id="class-subtitle"
                      placeholder="An introduction to urban and streed dance"
                    />
                  </FormControl>

                  <FormControl variant="standard" className="mt-3">
                    <InputLabel shrink htmlFor="class-category">
                      Class level
                    </InputLabel>
                    <Select
                      value={chglevel}
                      defaultValue={10}
                      onChange={classLevelChange}
                      displayEmpty
                      className="class-level-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>Beginner</MenuItem>
                      <MenuItem value={20}>Intermediate</MenuItem>
                      <MenuItem value={30}>Advanced</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl variant="standard" className="mt-3">
                    <InputLabel shrink htmlFor="class-type-popup">
                      Class Type
                    </InputLabel>
                    <Select
                      value={chgclasstype}
                      defaultValue={10}
                      onChange={classTypeChange}
                      displayEmpty
                      className="class-type-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>Private</MenuItem>
                      <MenuItem value={20}>Groups</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} xl={4} lg={4}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="class-category">
                      Class Category
                    </InputLabel>
                    <Select
                      value={chgcategory}
                      defaultValue={10}
                      onChange={classCategoryChange}
                      displayEmpty
                      className="teacher-profile-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>Arts & Performance</MenuItem>
                      <MenuItem value={20}>Meg Ridgen, Riverside, CA</MenuItem>
                      <MenuItem value={30}>Meg Ridgen, Riverside, CA</MenuItem>
                    </Select>
                  </FormControl>

                  <FormControl className="mt-3">
                    <InputLabel variant="standard" shrink htmlFor="class-topics">Class Topics</InputLabel>
                    <TagTopicInput tags={['Urban Dance', 'Street Style', 'Fitness']} />
                  </FormControl>

                  <FormControl className="mt-3">
                    <InputLabel variant="standard" shrink htmlFor="class-topics">Class Language</InputLabel>
                    <TagLanguageInput tags={['English']} />
                  </FormControl>

                  <FormControl variant="standard" className="mt-3">
                    <InputLabel shrink htmlFor="participants">
                      Maximum Participants
                    </InputLabel>
                    <Select
                      value={participants}
                      defaultValue={10}
                      onChange={participantsTypeChange}
                      displayEmpty
                      className="participants-type-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>Private</MenuItem>
                      <MenuItem value={20}>Groups</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} xl={4} lg={4}>
                  <FormControl>
                    <InputLabel shrink htmlFor="teacher-profile">
                      Class Description
                    </InputLabel>
                    <TextareaAutosize className="txtarea-class"
                      aria-label="textarea"
                      placeholder="Arts & Performance"
                    />
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
          </div>
          <div className="popup-session-area px-3">
            <Typography variant="h5">Session Settings</Typography>
            <Divider className="mt-3 mb-3" />
            <Box component="form" className="session-info pt-3 pb-3">
              <Grid container spacing={2}>
                <Grid item xs={12} md={4} xl={4} lg={4}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="session-type">
                      Session Type
                    </InputLabel>
                    <Select
                      value={sessiontype}
                      defaultValue={10}
                      onChange={sessionTypeChange}
                      displayEmpty
                      className="session-type-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>On demand</MenuItem>
                      <MenuItem value={20}>Single Class</MenuItem>
                      <MenuItem value={30}>Course Class</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} xl={4} lg={4}>
                  <FormControl variant="standard">
                    <InputLabel shrink htmlFor="schedule">
                      Schedule
                    </InputLabel>
                    <Select
                      value={schedule}
                      defaultValue={10}
                      onChange={scheduleChange}
                      displayEmpty
                      className="schedule-type-list"
                      inputProps={{ 'aria-label': 'Without label' }}
                    >
                      <MenuItem value={10}>Based on Availability</MenuItem>
                      <MenuItem value={20}>Single Class</MenuItem>
                      <MenuItem value={30}>Course Class</MenuItem>
                    </Select>
                  </FormControl>
                </Grid>
                <Grid item xs={12} md={4} xl={4} lg={4}>
                  <FormControl variant="standard" className="price-sct">
                    <InputLabel shrink htmlFor="price">
                      Price per student
                    </InputLabel>
                    <TextField
                      required
                      variant="standard"
                      id="outlined-required"
                      placeholder="$ 59.00"
                    />
                  </FormControl>
                </Grid>
              </Grid>

            </Box>
          </div>
          <div className="save-buttons-sections">
            <Grid container className="save-sct pb-3">
              <Grid item xs={12} md={12} lg={12}>
                <Divider />
              </Grid>
              <Grid item xs={12} md={12} lg={6}>
                <FormControl variant="standard" className="mb-0">
                  <Button variant="contained" className="mt-3 sve-btn" color="primary">Save Changes</Button>
                </FormControl>
                <FormControl variant="standard" className="mb-0">
                  <Button variant="contained" className="mt-3" color="secondary">Cancel</Button>
                </FormControl>
              </Grid>
              <Grid item xs={12} md={12} lg={6} className="text-rght archve">
                <FormControl variant="standard" className="mb-0">
                  <Typography variant="h6" className="mt-3"><Link to="#" color="secondary"><span><BsArchive /></span>Archive Student</Link></Typography>
                </FormControl>
              </Grid>
            </Grid>
          </div>
        </DialogContent>
        <DialogActions>
        </DialogActions>
      </ClassDialog>
    </div>
  );
}
