import axios from 'axios';

import {
    GET_TRANSACTIONS_ERROR,
    GET_TRANSACTIONS_LIST,
    GET_INVOICE,
    GET_INVOICE_ERROR
} from './types';


//list 
export const getTransactions = (page,queryString) => async dispatch => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json'
        }
      };
      const res = await axios.post(`/v1/transactions/${page}`,queryString,config);
      //console.log(res);
      dispatch({
        type: GET_TRANSACTIONS_LIST, 
        payload: res.data
      });
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      dispatch({
        type: GET_TRANSACTIONS_ERROR,
        payload: { msg: errors[0].msg}
      });
      return errors;
    }
  };

  //invoice

  export const invoiceDetail = (id) => async dispatch => {
    try {
      const res = await axios.get(`/v1/transactions/invoice/${id}`);
      dispatch({
        type: GET_INVOICE, 
        payload: res.data.data
      });
      return res.data;
    
    } catch (err) {
      dispatch({
        type: GET_INVOICE_ERROR
      });
      return 0;
    }
  };

  export const getTransactionsBySearch = (formData,page) => async dispatch => {
    try {
        console.log(formData);
        var queryString = '';
        if(formData.username !== '' && formData.start_date !== '' && formData.endDate !== ''){
          queryString = `?username=${formData.username}&startDate=${formData.start_date}&endDate=${formData.end_date}`;
        }
        else if(formData.username == '' && formData.start_date !== '' && formData.endDate !== ''){
          queryString = `?startDate=${formData.start_date}&endDate=${formData.end_date}`;
        }
        else if(formData.transaction_id != ''){
          queryString = `?transaction_id=${formData.transaction_id}`;

        }
      const res = await axios.get(`/v1/transactions/search/${page}${queryString}`);
  
      dispatch({
        type: GET_TRANSACTIONS_LIST, 
        payload: res.data
      });
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      dispatch({
        type: GET_TRANSACTIONS_ERROR,
        payload: { msg: errors[0].msg}
      });
      return errors;
    }
  };
