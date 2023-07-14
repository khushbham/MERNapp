import React,{useEffect, useState} from 'react'
import Box from '@mui/material/Box';
import Container from '@mui/material/Container';
import Grid from '@mui/material/Grid';
import Navbar from '../Navbar';
import TextField from '@mui/material/TextField';
import InputLabel from '@mui/material/InputLabel';
import FormControl from '@mui/material/FormControl';
import { useDispatch } from 'react-redux';
import * as yup from "yup";
import { useFormik } from "formik";
import Link from '@mui/material/Link';
import { saveAccoutInfo,getsaveAccoutInfo } from '../../../../actions/frontent';
import { Button } from '@mui/material';
const validationSchema = yup.object({
    account_holder_name: yup.string().required(" Account holder Name is required"),
    account_num: yup.string().required(" Account Number is required"),
    routing_num: yup.string().required("Routing number is required"),
  });
const DebitCardInfo = () => {
   
    const dispatch = useDispatch()
    const [Accountdetails , setAccountdetails] = useState()
      const formik = useFormik({
        initialValues: {
          account_holder_name: Accountdetails?.card_name,
          account_num: Accountdetails?.account_number,
          routing_num: Accountdetails?.routing_number,
        },
        validationSchema: validationSchema,
        enableReinitialize: true,
        onSubmit: (values) => {
          dispatch(saveAccoutInfo(values)).then((res)=>{
            console.log(res)
          }).catch((err)=>{
            console.log(err)
          })
        },
      });

      useEffect(()=>{
       dispatch(getsaveAccoutInfo()).then((res)=>{
        setAccountdetails(res.data)
        console.log(res)
       }).catch((err)=>{
        console.log(err)
       })
      },[])

    return (
        <Box className="DebitCardInfo">
            <Grid Container>
                    <Grid item lg={12} xs={12} md={12}>
                        <FormControl variant="standard" className="w-100 mb-2">
                            <TextField sx={{ mb: 1 }} 
                                required
                                fullWidth
                                name="account_num"
                                id="name"
                                variant="standard"
                                placeholder=" Account number"
                                className="StepsFields"
                                type="number"
                                value={formik.values.account_num}
                                onChange={formik.handleChange}
                              />
                              {formik.errors.account_num &&
                              formik.touched.account_num ? (
                                <div className="error_message">
                                  {formik.errors.account_num}
                                </div>
                              ) : null}
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} xs={12} md={12}>
                        <FormControl variant="standard" className="w-100 mb-2">
                                <TextField sx={{ mb: 1 }} 
                                    required
                                    fullWidth
                                    name="account_holder_name"
                                    id="name"
                                    variant="standard"
                                    placeholder="Name on card"
                                    className="StepsFields"
                                    type="text"
                                    value={formik.values.account_holder_name}
                                    onChange={formik.handleChange}
                                  />
                                  {formik.errors.account_holder_name &&
                                  formik.touched.account_holder_name ? (
                                    <div className="error_message">
                                      {formik.errors.account_holder_name}
                                    </div>
                                  ) : null}
                        </FormControl>
                    </Grid>
                    {/* <Grid item lg={12} xs={12} md={12}>
                        <FormControl variant="standard" className="w-100 mb-2">
                                <TextField sx={{ mb: 1 }} 
                                    required
                                    fullWidth
                                    name="name"
                                    id="name"
                                    variant="standard"
                                    placeholder="Expiry date"
                                    className="StepsFields"
                                    type="date"
                                />
                        </FormControl>
                    </Grid> */}
                    <Grid item lg={12} xs={12} md={12}>
                        <FormControl variant="standard" className="w-100 mb-2">
                                <TextField sx={{ mb: 1 }} 
                                    required
                                    fullWidth
                                    name="routing_num"
                                    id="name"
                                    variant="standard"
                                    placeholder="Routing Number"
                                    className="StepsFields"
                                    type="text"
                                    value={formik.values.routing_num}
                                    onChange={formik.handleChange}
                                  />
                                  {formik.errors.routing_num &&
                                  formik.touched.routing_num ? (
                                    <div className="error_message">
                                      {formik.errors.routing_num}
                                    </div>
                                  ) : null}
                        </FormControl>
                    </Grid>
                    <Grid item lg={12} xs={12} md={12}>
                    <Button className="LoginbtnLink" onClick={formik.handleSubmit}>Submit </Button>
                    </Grid>
            </Grid>
        </Box>
    )
}

export default DebitCardInfo
