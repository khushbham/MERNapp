import React, {useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import Typography from '@mui/material/Typography';
import InputLabel from '@mui/material/InputLabel';
import Grid from '@mui/material/Grid';
import FormControl from '@mui/material/FormControl';
import MenuItem from '@mui/material/MenuItem';
import Select from '@mui/material/Select';
import { Link } from 'react-router-dom';
import Autocomplete from '@mui/material/Autocomplete';
import TextField from '@mui/material/TextField';
import { FiBook } from "react-icons/fi";
import { GrLocation } from "react-icons/gr";
import { useDispatch } from 'react-redux';
import { getAddresses, getDropdownValues, getPopularTags, getTopicsAndDiscipline, searchfilter } from '../../../../actions/frontent';
import { Button } from '@mui/material';

const searchFilterWrap = {
 background:'#fafafa',
 padding:'15px',
 borderRadius:'15px',
 boxShadow: '0 16px 16px 0 rgba(0, 0, 0, 0.24), 0 0 16px 0 rgba(0, 0, 0, 0.12)',
 height:'100%',
}
const SearchData = (props) => {
    const {setInputValue,setstatevalue,inputValue,statevalue,search ,Session,setVal} = props
    const dispatch = useDispatch()
    
    const handleChange = (event) => {
        setVal(event.target.value);
    };
    const [top100 , settop100] = React.useState([])
    const [top101 , settop101] = React.useState([])
    const [popularTags , setpopularTags] = React.useState([])
    const [classTime , setclassTime] = React.useState([])

    
    // const top10 = [
    //     { label: 'Dance'},
    //     { label: 'Classic Dance'},
    //     { label: 'Contemporary Dance'},
    //     { label: 'Fitness & Dance'},
    //     { label: 'Tango Dance'},
    //     { label: 'Urban Dance'}
    // ]
    // const top101 = [
    //     { label: 'Riverside, CA'},
    //     { label: 'Riverside, IL'},
    //     { label: 'Riverside, NJ'},
    //     { label: 'Or Online (anywhere)'}
    // ]

    useEffect(()=>{
        dispatch(getTopicsAndDiscipline()).then((res)=>{
            console.log(res)
            settop100(res.data)
        }).catch((err)=>{
            console.log(err)
        })
        dispatch(getAddresses()).then((res)=>{
            console.log(res)
            settop101(res.data)
        }).catch((err)=>{
            console.log(err)
        })
        dispatch(getPopularTags()).then((res)=>{
            console.log(res)
            setpopularTags(res.data)
        }).catch((err)=>{
            console.log(err)
        })
        dispatch(getDropdownValues()).then((res) => {
                setclassTime(
                res.data.filter((a) => {
                  if (a.name == "class_time_for_search") {
                    return a;
                  }
                })[0].options
            )
        })
    },[])

   
    return (
        <Box>
            <Grid container>
                <Grid item lg={12} md={12} sm={12} xs={12} className="m-auto" sx={searchFilterWrap}>
                    <Box className="my-2">
                        <Typography variant="h3" gutterBottom component="div" className="mb-4 pt-1">What would you like to learn today?</Typography>
                        <Autocomplete
                            disablePortal
                            className="searchOptions w-100 my-3"
                            value={inputValue}
                            hiddenLabel="true"
                            id="combo-box-demo"
                            placeholder="Dance"
                            options={top100}
                            onInputChange={(event, newInputValue) => {
                                setInputValue(newInputValue);
                              }}
                            renderInput={(params) => <TextField placeholder="Dance" {...params} variant="outlined"
                                InputProps={{
                                    ...params.InputProps,
                                    startAdornment: (
                                    <>
                                        <FiBook />
                                        {params.InputProps.startAdornment}
                                    </>
                                    )
                                }}
                            />}
                          />
                            <Autocomplete
                            disablePortal
                            className="searchOptions w-100  my-3"
                            hiddenLabel="true"
                            value={statevalue}
                            onInputChange={(event, newInputValue) => {
                                setstatevalue(newInputValue);
                              }}
                            id="combo-box-demo"
                            placeholder="Street, Neighborhood or City"
                            options={top101}
                                renderInput={(params) => <TextField placeholder="Street, Neighborhood or City" {...params} variant="outlined"
                                    InputProps={{
                                        ...params.InputProps,
                                        startAdornment: (
                                        <>
                                            <GrLocation />
                                            {params.InputProps.startAdornment}
                                        </>
                                        )
                                    }}
                                />}
                            />
                            
                            <FormControl className="selectDropdown w-100 my-3">
                                <InputLabel shrink htmlFor="student-name" className="studentNameLabel" align='left'>
                                  When do you need your class?
                                </InputLabel>
                                    <Select sx={{ mb: 1 }} 
                                    value={Session}
                                    onChange={handleChange}
                                    displayEmpty
                                    className="StepsFields"
                                    inputProps={{ 'aria-label': 'Without label' }}
                                    >
                                    {classTime.map((arr , idx)=>{
                                     return  <MenuItem value={idx} className="d-block p-2 text-left">{arr}</MenuItem>
                                    })}
                                   
                                    {/* <MenuItem value={10} className="d-block p-2 text-left">In the next 24h</MenuItem>
                                    <MenuItem value={20} className="d-block p-2 text-left">In the next 24h</MenuItem> */}
                                    </Select>
                              </FormControl>
                              
                            <Box className="TrendingWrapp">
                                <Typography variant="h4" component="div" className="mb-3 mt-3 studentNameLabel">Trending this month</Typography>
                                 <Box
                                    sx={{
                                        display: 'flex',
                                        flexWrap: 'wrap'
                                        }
                                    }
                                    > {popularTags.map((arr)=>{
                                          return  <Link to="#" className="TopicLinks mb-2">
                                              {arr.tag_name}
                                              </Link>
                                        })}
                                    
                                    {/* <Link to="/" className="TopicLinks mb-2">
                                    Wi-Fi Settings
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2 ">
                                    Guitar
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2">
                                    Yoga
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2">
                                    Wine Appreciation
                                    </Link>
                                    <Link to="/"className="TopicLinks mb-2">
                                    Dancing
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2">
                                    Cooking
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2">
                                    Skating
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2">
                                    Piano
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2">
                                    Violin
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2">
                                    SCRUM
                                    </Link>
                                    <Link to="/" className="TopicLinks mb-2">
                                    UX Design
                                    </Link> */}
                                </Box>
                            </Box>
                        <Button  className="sessionBtn mt-4" onClick={search}>View Results</Button>
                        </Box>
                </Grid>
            </Grid>
        </Box>
    )
}

export default SearchData;
