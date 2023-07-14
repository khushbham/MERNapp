import axios from 'axios';
import {
  SESSIONS_FOR_CALENDER,
  SESSIONS_FOR_CALENDER_ERROR,
  GET_EMAIL_TEMPLATES,
  GET_EMAIL_TEMPLATES_ERROR,
  SESSIONS_LIST,
  SESSIONS_LIST_ERROR
} from './types';

export const getSessionsBetweenSelectedDates = (formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await axios.post(`/v1/adminLogin/sessionCalender/getSessionsBetweenSelectedDates`,formData,config);  
    dispatch({
      type: SESSIONS_FOR_CALENDER,
      payload: res.data.data
    });
  } catch (err) {
    dispatch({
        type: SESSIONS_FOR_CALENDER_ERROR
      });
    return err;
  }
};

export const getSessionsListing = (formData) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
    const res = await axios.post(`/v1/adminLogin/session/getAllSessions`,formData,config);  
    dispatch({
      type: SESSIONS_LIST,
      payload: res.data
    });
    return res.data;
  } catch (err) {
    dispatch({
        type: SESSIONS_LIST_ERROR
      });
    return err;
  }
};

export const getSingleSessionDetail = (id) => async dispatch => {
  try {
    const res = await axios.get(`/v1/adminLogin/session/singleSessionDetail/${id}`);  
    dispatch({
      type: SESSIONS_LIST,
      payload: res.data
    });
    return res.data;
  } catch (err) {
    dispatch({
        type: SESSIONS_LIST_ERROR
      });
    return err;
  }
};


export const getEmailTemplateNotificationsList = () => async dispatch => {
  try {
    const res = await axios.get(`/v1/adminLogin/notifications/getEmailTemplates`);  
    dispatch({
      type: GET_EMAIL_TEMPLATES,
      payload: res.data.data
    });
    return res.data;
  } catch (err) {
    dispatch({
        type: GET_EMAIL_TEMPLATES_ERROR
      });
    return err;
  }
};

export const updateEmailTemplateNotificationsList = (data) => async dispatch => {
  try {
    const config = {
      headers: {
        'Content-Type': 'application/json'
      }
    };
  
    const res = await axios.put(`/v1/adminLogin/add_update_email_template_notifications`,data,config);  
    // dispatch({
    //   type: GET_EMAIL_TEMPLATES,
    //   payload: res.data.data
    // });
    return res.data;
  } catch (err) {
    // dispatch({
    //     type: GET_EMAIL_TEMPLATES_ERROR
    //   });
    return err;
  }
};