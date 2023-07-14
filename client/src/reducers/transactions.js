import {
    GET_TRANSACTIONS_ERROR,
    GET_TRANSACTIONS_LIST,
    GET_INVOICE,
    GET_INVOICE_ERROR
  } from '../actions/types';

  const initialState = {
    loading: true,
    invoiceRecord: null,
    loadingForAllTransactions:true,
    transactionsPerPage:[],
    totalPagesForPayment:0
  };

  export default function transactons(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case GET_TRANSACTIONS_LIST:
        console.log(payload)
        return {
          ...state, 
          loadingForAllTransactions: false,
          transactionsPerPage: payload.data,
          totalPagesForPayment:payload.totalTransactions
        };
      case GET_TRANSACTIONS_ERROR:
        return [...state, payload];
      case GET_INVOICE:
        return {
        ...state,
        loading: false,
        invoiceRecord: payload
      };
      default:
        return state;
    }
  }
  