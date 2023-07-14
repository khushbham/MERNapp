import React from 'react';
import Link from '@mui/material/Link';
import Typography from '@mui/material/Typography';
import { AiFillHeart } from "react-icons/ai";

function Copyright(props) {
  return (
    <Typography variant="body2" align="center" {...props}>
      {' © '}
      {new Date().getFullYear()}{' '}
      mern. Crafted with {' '}
       <AiFillHeart />{' '}
      <Link color="inherit" href="/">
       by app
      </Link>{' '}
      {'.'}
    </Typography>
  );
}

export default Copyright;

