import React from 'react'
import Typography from '@mui/material/Typography';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import TextareaAutosize from '@mui/material/TextareaAutosize';
import { BsFillCameraVideoFill } from 'react-icons/bs';
import Input from '@mui/material/Input';
import Avatar from '@mui/material/Avatar';
import Box from "@mui/material/Box";
import { useEffect } from 'react';
import { Checkbox, List, ListItem } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { getDropdownValues } from '../../../../../actions/frontent';

const StudentAccount2 = (props) => {
   const {settopics , topics} = props
    const dispatch = useDispatch()
    const [selectfeilds ,setselectfeilds] = React.useState([])

    const handleChange = (event) => {
        var updatedList = [...topics];
        if (event.target.checked) {
          updatedList = [...topics, event.target.value];
        } else {
          updatedList.splice(topics.indexOf(event.target.value), 1);
        }
        settopics(updatedList);
    };

    useEffect(()=>{
       dispatch(getDropdownValues()).then((res)=>{
        setselectfeilds(res.data.filter((a) => {
            if (a.name == "topics") {
              return a;
            }
          })[0].options )
       })
    },[])
    return (
        <Box>
        <Typography variant="subtitle1" gutterBottom component="div" className="AccountSubtitle">Tell us about your interests so we can make better recomendations! </Typography>

        {/* <Box>
              <Typography variant="subtitle1" gutterBottom component="div" className="AccountSubtitle">Tell us about your interests so we can make better recomendations! </Typography> */}
             <Link to="/StudentProfileConfirmation" className="Skip-profile">Skip</Link>
                 <ul className="multiSlectors">
                                
                      {
                                    <List
                                        row
                                        sx={{
                                          "--List-gap": "0px",
                                          "--List-item-radius": "20px",
                                          flexWrap: "wrap",
                                          gap: 1,
                                        }}
                                      >
                                        {selectfeilds?.map((item, index) => (
                                          <ListItem key={index} className="account">
                                            <Checkbox
                                            overlay
                                            value={index}
                                            disableIcon
                                            variant="soft"
                                            InputLabel={item}
                                            onChange={e => handleChange(e)}
                                          />
                                          {item}
                                          </ListItem>
                                        ))}
                                      </List>
                                }
                            </ul>
                        {/* </Box> */}
        {/* <FormControl variant="standard" className="w-100 mb-2">
            <TextField sx={{ mb: 1 }} 
                required
                fullWidth
                name="name"
                id="name"
                variant="standard"
                placeholder="Programing"
                className="studentAccountss"
            />
        </FormControl>
        <FormControl variant="standard" className="w-100 mb-2">
            <TextField sx={{ mb: 1 }} 
                required
                fullWidth
                name="name"
                id="name"
                variant="standard"
                placeholder="Business"
                className="studentAccountss"
            />
        </FormControl>
        <FormControl variant="standard" className="w-100 mb-2">
            <TextField sx={{ mb: 1 }} 
                required
                fullWidth
                name="name"
                id="name"
                variant="standard"
                placeholder="Design"
                className="studentAccountss"
            />
        </FormControl>
        <FormControl variant="standard" className="w-100 mb-2">
            <TextField sx={{ mb: 1 }} 
                required
                fullWidth
                name="name"
                id="name"
                variant="standard"
                placeholder="Science"
                className="studentAccountss"
            />
        </FormControl>
        <FormControl variant="standard" className="w-100 mb-2">
            <TextField sx={{ mb: 1 }} 
                required
                fullWidth
                name="name"
                id="name"
                variant="standard"
                placeholder="Languages"
                className="studentAccountss"
            />
        </FormControl>
        <FormControl variant="standard" className="w-100 mb-2">
            <TextField sx={{ mb: 1 }} 
                required
                fullWidth
                name="name"
                id="name"
                variant="standard"
                placeholder="Mindfulness"
                className="studentAccountss"
            />
        </FormControl>
        */}
</Box>
    )
}

export default StudentAccount2
