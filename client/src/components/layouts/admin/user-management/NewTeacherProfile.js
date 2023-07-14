import React, { useState } from 'react';
import TextField from '@mui/material/TextField';
import Grid from '@mui/material/Grid';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { styled } from '@mui/material/styles';
import { Button } from '@mui/material';
import { FiEdit } from 'react-icons/fi';
import TextareaAutosize from '@mui/material/TextareaAutosize';


const TagInput = ({ tags }) => {
  const [tagData, setTagData] = React.useState(tags);
  const removeTagData = indexToRemove => {
    setTagData([...tagData.filter((_, index) => index !== indexToRemove)]);
  };
  const addTagData = event => {
    if (event.target.value !== '') {
      setTagData([...tagData, event.target.value]);
      event.target.value = '';
    }
  };
  return (
    <div className="tag-input">
      <ul className="tags">
        {tagData.map((tag, index) => (
          <li key={index} className="tag">
            <span className="tag-title">{tag}</span>
            <span
              className="tag-close-icon"
              onClick={() => removeTagData(index)}
            >
              x
            </span>
          </li>
        ))}
      </ul>
      <input
        type="text"
        onKeyUp={event => (event.key === 'Enter' ? addTagData(event) : null)}
        placeholder="Enter one or more topics"
      />
    </div>
  );
};


const NewTeacherProfile = () => {
  const [teacherpicture, setteacherpicture] = useState(null);
  const [imgteacherData, setimgteacherData] = useState(null);
  const onChangeteacherpicture = e => {
    if (e.target.files[0]) {
      console.log("teacherpicture: ", e.target.files);
      setteacherpicture(e.target.files[0]);
      const reader = new FileReader();
      reader.addEventListener("load", () => {
        setimgteacherData(reader.result);
      });
      reader.readAsDataURL(e.target.files[0]);
    }
  };
  const Input = styled('input')({
    display: 'none',
  });
  const [tell, setTellValue] = React.useState('Controlled');
  const tellhandleChange = (event) => {
    setTellValue(event.target.value);
  };
  return (

    <Grid container spacing={2}>
      <Grid item xs={12} md={4} lg={4} xl={4}>
        <FormControl className="mb-5">
          <InputLabel shrink htmlFor="teacher-profile-pic">
            Upload profile picture
          </InputLabel>
          <div className="teacher-profile-pic-area">
            <div className="profile-pic">
              <img src={imgteacherData} className="ProfilePic_user w-100" />
            </div>
            <div className="upload-icon">
              <label htmlFor="icon-button-file">
                <Input accept="image/*" id="icon-button-file" type="file" onChange={onChangeteacherpicture} />
                <Button variant="contained" component="span" className="side-upload-button">
                  <FiEdit />
                </Button>
              </label>
            </div>
          </div>
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4} lg={4} xl={4} className="innr-flds">
        <FormControl variant="standard">
          <InputLabel shrink htmlFor="expertise-name" className="expertise">
            What is your expertise?
          </InputLabel>
          <TextField sx={{ mb: 1 }}
            required
            fullWidth
            name="expertise"
            id="expertise"
            variant="standard"
            placeholder="e.g. yoga instructor, dance teacher"
            className="expertise-fields"
          />
        </FormControl>
        <FormControl variant="standard" className="topics-teach">
          <InputLabel shrink htmlFor="expertise-name" className="topics-area">
            What topics do you plan to teach?
          </InputLabel>
          <TagInput tags={['Art', 'Illustration']} />
        </FormControl>
      </Grid>
      <Grid item xs={12} md={4} lg={4} xl={4} className="tell-textarea">
        <FormControl variant="standard" className="tell-about">
          <InputLabel shrink htmlFor="tell" className="tell-area">
            Tell us a little about that
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

  );
}

export default NewTeacherProfile;