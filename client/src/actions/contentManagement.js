import axios from "axios";
import { setAlert } from "./alert";
import {
  UPDATE_STATIC_PAGE,
  UPDATE_STATIC_PAGE_ERROR,
  GET_STATIC_PAGE_LIST,
  GET_STATIC_PAGE_LIST_ERROR,
  GET_STATIC_PAGE_DETAIL,
  GET_STATIC_PAGE_DETAIL_ERROR,
  TAG_ARRAY_CHANGED,
  TAG_ARRAY_CHANGED_TO_ZERO
} from "./types";

export const getPagesData = () => async (dispatch) => {
  try {
    const res = await axios.get("/v1/contentManagement");
    dispatch({
      type: GET_STATIC_PAGE_LIST,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: GET_STATIC_PAGE_LIST_ERROR,
    });
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    return errors;
  }
};

export const getSinglePageDetail = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/contentManagement/getSinglePageDetail/${id}`);
    dispatch({
      type: GET_STATIC_PAGE_DETAIL,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: GET_STATIC_PAGE_DETAIL_ERROR,
    });
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    return errors;
  }
};

export const updatePagesData = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/v1/contentManagement", data, config);

    dispatch({
      type: UPDATE_STATIC_PAGE,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: UPDATE_STATIC_PAGE_ERROR,
    });
    return errors;
  }
};

export const tagsArrayChanged = (data,completeData) => async dispatch => {

  try {
    //console.log(completeData);
    dispatch({
      type: TAG_ARRAY_CHANGED_TO_ZERO,
      payload: {
        data : data,
        completeData : completeData
      }
    });
    dispatch({
      type: TAG_ARRAY_CHANGED,
      payload: {
        data : data,
        completeData : completeData
      }
    });

    //dispatch(loadUser());
    //return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }
    // dispatch({
    //   type: LOGIN_FAIL
    // });
    //return errors;
  }
};


export const getTagsData = (data) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.post("/v1/contentManagement/getTags",data,config);
    dispatch({
      type: GET_STATIC_PAGE_LIST,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: GET_STATIC_PAGE_LIST_ERROR,
    });
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    return errors;
  }
};


export const mergeTagsDataIntoOne = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put("/v1/contentManagement/mergeTags", data, config);

    dispatch({
      type: UPDATE_STATIC_PAGE,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "danger")));
    }
    dispatch({
      type: UPDATE_STATIC_PAGE_ERROR,
    });
    return errors;
  }
};