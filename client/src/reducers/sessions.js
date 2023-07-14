import {
    SESSIONS_FOR_CALENDER,
    SESSIONS_FOR_CALENDER_ERROR,
    GET_EMAIL_TEMPLATES,
    GET_EMAIL_TEMPLATES_ERROR,
    TAG_ARRAY_CHANGED,
    TAG_ARRAY_CHANGED_TO_ZERO,
    
  } from '../actions/types';

  const initialState = {
    loading: true,
    sessionsOfSelectedDatesOfMonth:[],
    loadNotifications: true,
    emailTemplatesArray: [],
    tagsArrayForMergeData : [],
    tagsArrayForMergeDataComplete : []
  };

  export default function transactons(state = initialState, action) {
    const { type, payload } = action;
  
    switch (type) {
      case SESSIONS_FOR_CALENDER:
        console.log(payload)
        return {
          ...state, 
          loading: false,
          sessionsOfSelectedDatesOfMonth: payload
        };
      case SESSIONS_FOR_CALENDER_ERROR:
        return {
            ...state, 
            loading: false,
            sessionsOfSelectedDatesOfMonth: []
          };
      case TAG_ARRAY_CHANGED:
        console.log(payload)
        return {
          ...state, 
          loading: false,
          tagsArrayForMergeData: payload.data,
          tagsArrayForMergeDataComplete : payload.completeData
        };
      case TAG_ARRAY_CHANGED_TO_ZERO:
        return {
          ...state, 
          loading: false,
          tagsArrayForMergeData: [],
          tagsArrayForMergeDataComplete : []
        };
      case GET_EMAIL_TEMPLATES:
        return {
            ...state, 
            loadNotifications: false,
            emailTemplatesArray: payload
          };
      case GET_EMAIL_TEMPLATES_ERROR:
        return {
            ...state, 
            loadNotifications: false,
            emailTemplatesArray: []
          };

      default:
        return state;
    }
  }
  