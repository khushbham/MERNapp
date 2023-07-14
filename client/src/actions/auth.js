import axios from "axios";
import { setAlert } from "./alert";
import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  PASSWORD_SUCCESS,
  PASSWORD_SUCCESS_ERROR,
  DROPDOWN_LIST,
  LOGIN_SUCCESS_SUBADMIN,
  SUB_USER_LOADED,
  SUBADMIN_AUTH_ERROR,
  SUBADMIN_LOGIN_FAIL,
  SUBADMIN_LOGOUT,
  CLIENT,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_CHANGE_EMAIL,
  OTP_VERIFIED_SUCCESS,
  SITE_URL,
  DASHBOARD_USERS,
  DASHBOARD_SESSIONS,
  MANAGEMENT_USERSLIST,
  SINGLE_USER,
  SINGLE_USER_ERROR,
  DASHBOARD_TRANSACTIONS,
  DASHBOARD_TRANSACTIONS_ERROR,
} from "./types";
import setAuthToken from "../utils/setAuthToken";

// Load User
export const loadToken = (clientData) => async (dispatch) => {
  dispatch({
    type: CLIENT,
    payload: clientData,
  });
};
export const loadUser = (clientData) => async (dispatch) => {
  setAuthToken(localStorage.token);
  try {
    const res = await axios.get("/v1/adminLogin");
    // dispatch({
    //   type: CLIENT,
    //   payload:clientData
    // });
    return (
      res.data,
      dispatch({
        type: USER_LOADED,
        payload: res.data,
      })
    );
  } catch (err) {
    dispatch({
      type: AUTH_ERROR,
    });
  }
};

export const checkLinkExpiry = (user_id) => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/adminLogin/link-expiry-check/${user_id}`);
    // dispatch({
    //   type: CLIENT,
    //   payload:clientData
    // });
    // return (
    //   res.data,
    //    dispatch({
    //   type: USER_LOADED,
    //   payload: res.data
    // })
    // )
    return res.data;
  } catch (err) {
    // dispatch({
    //   type: AUTH_ERROR
    // });
    return 0;
  }
};

export const getUserStudentDetailById = (studentId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/v1/adminLogin/getUserStudentDetailById?userId=${studentId}`
    );

    //return res.data;
    //   dispatch({
    //   type: DASHBOARD_USERS,
    //   payload: res.data.data
    // });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const userDetailsTeach = (teacherId) => async (dispatch) => {
  try {
    const res = await axios.get(
      `/v1/adminLogin/userDetailsTeach?userId=${teacherId}`
    );

    //return res.data;
    //   dispatch({
    //   type: DASHBOARD_USERS,
    //   payload: res.data.data
    // });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const changeAccountStatus = (user_id, status) => async (dispatch) => {
  try {
    // const config = {
    //   headers: {
    //     'Content-Type': 'application/json',
    //   }
    // };
    const res = await axios.put(
      `/v1/adminLogin/changeAccountStatus/${user_id}/${status}`
    );

    //return res.data;
    //   dispatch({
    //   type: DASHBOARD_USERS,
    //   payload: res.data.data
    // });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const userCalender = (studentId) => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/adminLogin/userCalender/${studentId}`);

    //return res.data;
    //   dispatch({
    //   type: DASHBOARD_USERS,
    //   payload: res.data.data
    // });
    return res.data;
  } catch (err) {
    return err;
  }
};

// Load User
export const loadAllUsers = (page, sort) => async (dispatch) => {
  try {
    console.log(sort);
    const res = await axios.get(
      `/v1/adminLogin/usersRecord/${page}?sort=${sort}`
    );
    //console.log(res);
    return res.data;
    //   dispatch({
    //   type: USER_LOADED,
    //   payload: res.data
    // });
  } catch (err) {
    return 0;
  }
};

//users for dashboard

export const dashboardusers = () => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
      },
    };
    const res = await axios.get("/v1/adminLogin/dashboard/users");

    //return res.data;
    dispatch({
      type: DASHBOARD_USERS,
      payload: res.data.data,
    });
  } catch (err) {
    return err;
  }
};

export const getChatTokenForAdmin = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/users/getChatTokenForAdmin/${id}`);

    return res.data;
    //   dispatch({
    //   type: DASHBOARD_USERS,
    //   payload: res.data.data
    // });
  } catch (err) {
    return err;
  }
};

export const managementusers = (search) => async (dispatch) => {
  // setAuthToken(localStorage.token);
  try {
    const res = await axios.get(`/v1/adminLogin/usersList?${search}`);

    dispatch({
      type: MANAGEMENT_USERSLIST,
      payload: res.data.data,
    });
    return res.data;
  } catch (err) {
    return err;
  }
};

export const getLocationsList = () => async (dispatch) => {
  // setAuthToken(localStorage.token);
  try {
    const res = await axios.get("/v1/adminLogin/getLocationsList");

    return res.data;
    //   dispatch({
    //   type: MANAGEMENT_USERSLIST,
    //   payload: res.data.data
    // });
  } catch (err) {
    return err;
  }
};

export const getDropdownValues = () => async (dispatch) => {
  // setAuthToken(localStorage.token);
  try {
    const res = await axios.get("/v1/users/getDropdown");

    dispatch({
      type: DROPDOWN_LIST,
      payload: res.data.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: DROPDOWN_LIST,
      payload: [],
    });
  }
};

// Load Single user details
export const loadSingleUser = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/adminLogin/singleUserInfo/${id}`);

    dispatch({
      type: SINGLE_USER,
      payload: res.data.data,
    });

    return res.data.data;
  } catch (err) {
    dispatch({
      type: SINGLE_USER_ERROR,
    });
  }
};

export const sessionsOfDashboard = () => async (dispatch) => {
  try {
    const res = await axios.get(
      `/v1/adminLogin/dashboard/getSessionsOfSelectedMonth`
    );

    //return res.data;
    dispatch({
      type: DASHBOARD_SESSIONS,
      payload: res.data.data,
    });
  } catch (err) {
    return err;
  }
};

//Transactions for dashboard
export const dashboardTransactions = () => async (dispatch) => {
  try {
    const res = await axios.get("/v1/adminLogin/dashboard/transactions");
    dispatch({
      type: DASHBOARD_TRANSACTIONS,
      payload: res.data.data,
    });
    return res.data;
  } catch (err) {
    dispatch({
      type: DASHBOARD_TRANSACTIONS_ERROR,
    });
    return err;
  }
};

// Load User
export const userDetail = (id) => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/adminLogin/getUserData/${id}`);
    //console.log(res);
    return res.data;
    //   dispatch({
    //   type: USER_LOADED,
    //   payload: res.data
    // });
  } catch (err) {
    return 0;
  }
};

// Load User
export const updateUserStatus = (id, userStatus) => async (dispatch) => {
  try {
    const res = await axios.put(
      `/v1/adminLogin/updateStatus/${id}/${userStatus}`
    );
    //console.log(res);
    return res.data;
    //   dispatch({
    //   type: USER_LOADED,
    //   payload: res.data
    // });
  } catch (err) {
    return err;
  }
};

// Load User
export const search = (s, page) => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/adminLogin/search/${s}/${page}`);
    //console.log(res);
    return res.data;
    //   dispatch({
    //   type: USER_LOADED,
    //   payload: res.data
    // });
  } catch (err) {
    return 0;
  }
};

// Load User
export const addCredits = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put(
      "/v1/front/manual_coins_addition",
      data,
      config
    );
    //console.log(res);
    return res.data;
    //   dispatch({
    //   type: USER_LOADED,
    //   payload: res.data
    // });
  } catch (err) {
    return 0;
  }
};

// Load User
export const loadAllUsersForSearch = () => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/users/search_usersRecord`);
    //console.log(res);
    return res.data;
    //   dispatch({
    //   type: USER_LOADED,
    //   payload: res.data
    // });
  } catch (err) {
    return 0;
  }
};

// Load User
export const loadSubUser = () => async (dispatch) => {
  setAuthToken(localStorage.token);
  try {
    const res = await axios.get("/v1/subadmin/login");
    dispatch({
      type: SUB_USER_LOADED,
      payload: res.data,
    });
  } catch (err) {
    dispatch({
      type: SUBADMIN_AUTH_ERROR,
    });
  }
};

// Login User
export const adminLogin = (email, password) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, password });

  try {
    const res = await axios.post("/v1/adminLogin", body, config);

    dispatch({
      type: LOGIN_SUCCESS,
      payload: res.data,
    });

    dispatch(loadUser());
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'danger')));
    // }
    dispatch({
      type: LOGIN_FAIL,
    });
    return errors;
  }
};

// Login User
// Login User
export const forgotPassword = (email) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email });

  try {
    const res = await axios.post("/v1/adminLogin/forgotPassword", body, config);
    dispatch(setAlert(res.data.message, "success"));
    dispatch({
      type: FORGOT_PASSWORD_SUCCESS,
      payload: {
        email: email,
        _id: res.data,
        step: 2,
      },
    });

    //dispatch(loadUser());
    //return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //   type: LOGIN_FAIL
    // });
    //return errors;
  }
};

export const verifyOtp = (email, otp) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  const body = JSON.stringify({ email, otp });

  try {
    const res = await axios.post("/v1/adminLogin/verifyOtp", body, config);
    dispatch(setAlert(res.data.message, "success"));
    var link_expiry_time = new Date();
    link_expiry_time.setMinutes(link_expiry_time.getMinutes() + 15);
    dispatch({
      type: OTP_VERIFIED_SUCCESS,
      payload: {
        step: 3,
        link_expiry_time: link_expiry_time,
        change_password_link: SITE_URL + "/change-password/" + res.data.id,
      },
    });

    //dispatch(loadUser());
    //return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //   type: LOGIN_FAIL
    // });
    //return errors;
  }
};

export const changeEmail = () => async (dispatch) => {
  try {
    dispatch({
      type: FORGOT_PASSWORD_CHANGE_EMAIL,
      payload: {
        step: 1,
      },
    });

    //dispatch(loadUser());
    //return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //   type: LOGIN_FAIL
    // });
    //return errors;
  }
};

// Login User
export const changePassword = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put("/v1/adminLogin", formData, config);

    dispatch({
      type: PASSWORD_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    // if (errors) {
    //   errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    // }
    dispatch({
      type: PASSWORD_SUCCESS_ERROR,
    });
    return errors;
  }
};
export const resetPassword = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.put(
      `/v1/adminLogin/change_password`,
      formData,
      config
    );
    dispatch(setAlert(res.data.message, "success"));

    dispatch({
      type: PASSWORD_SUCCESS,
      payload: res.data,
    });

    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      dispatch(setAlert(errors[0].msg, "error"));
    }
    dispatch({
      type: PASSWORD_SUCCESS_ERROR,
    });
    return errors;
  }
};
// Logout / Clear Profile
export const logout = () => (dispatch) => {
  dispatch({ type: LOGOUT });
};
// Logout / Clear Profile
export const subadminlogout = () => (dispatch) => {
  dispatch({ type: SUBADMIN_LOGOUT });
};

export const createUser = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };

  try {
    const res = await axios.post("/v1/adminLogin/createUser", formData, config);
    dispatch(setAlert(res.data.message, "success"));
    // dispatch({
    //   type: FORGOT_PASSWORD_SUCCESS,
    //   payload: {
    //     email:email,
    //     _id:res.data,
    //     step:2
    //   }
    // });

    //dispatch(loadUser());
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //   type: LOGIN_FAIL
    // });
    //return errors;
  }
};

export const reportlisting = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/reportlisting/${1}`,
      formData,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
  }
};

export const getPayoutsRecordsCombined = (passData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    const res = await axios.get(
      `/v1/adminLogin/getPayoutsRecordsCombined/?page=${passData.page}&payout_status=${passData.payout_status}&start_date=${passData.start_date}&end_date=${passData.end_date}&class_title_or_teacher_name=${passData.class_title_or_teacher_name}&user_id=${passData.user_id}&session_id=${passData.session_id}`,
      config
    );
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    return errors;
  }
};

export const getPayoutDetail = (payoutId) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    const res = await axios.get(
      `/v1/adminLogin/getPayoutDetail/${payoutId}`,
      config
    );
    // console.log("api hit success >> " , res)
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    return errors;
  }
};

//
export const updatePayoutStatus = (formData) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
    },
  };
  try {
    const res = await axios.put(
      "/v1/adminLogin/updatePayoutStatus",
      formData,
      config
    );
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
  }
};

// Refund Listing

// export const getRefundListing = (page,queryString) => async dispatch => {
//   try {
//     const config = {
//       headers: {
//         'Content-Type': 'application/json'
//       }
//     };
//     const res = await axios.post(`/v1/adminLogin/getRefundRequestList/${page}`,queryString,config);
//     //console.log(res);
//     dispatch({
//       type: GET_REFUND_LIST,
//       payload: res.data
//     });
//     return res.data;
//   } catch (err) {
//     const errors = err.response.data.errors;
//     dispatch({
//       type: GET_REFUND_ERROR,
//       payload: { msg: errors[0].msg}
//     });
//     return errors;
//   }
// };

export const getRefundListing = (passData) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    const res = await axios.get(
      //`/v1/adminLogin/getRefundRequestList/?page=${page}`,
      `/v1/adminLogin/getRefundRequestList/?page=${passData.page}&refund_status=${passData.refund_status}&start_date=${passData.start_date}&end_date=${passData.end_date}&class_title_or_teacher_name=${passData.class_title_or_teacher_name}&user_id=${passData.user_id}`,
      config
    );
    // console.log("api hit success >> " , res)
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    return errors;
  }
};


export const updateRefundStatus = (formData) => async dispatch => {
  
  const config = {
    headers: {
      'Content-Type': 'application/json'
    }
  };
  try {
    const res = await axios.put('/v1/adminLogin/updateRefundStatus', formData, config);
    console.log("update api is working" , res)
    dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    }
  }
};

export const refundDetailStatus = (id) => async (dispatch) => {
  try {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    const res = await axios.get(
      `/v1/adminLogin/refundDetail/${id}`,
      config
    );
    // console.log("api hit success >> " , res)
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    return errors;
  }
};
// 