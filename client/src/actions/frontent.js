import axios from "axios";
import { setAlert } from "./alert";
import {
  STUDENT_SIGNUP_ERROR,
  STUDENT_SIGNUP_SUCCESS,
  VERIFY_OTP_SUCCESS,
  VERIFY_OTP_ERROR,
  DROPDOWN_LIST,
  RESET_PASSOWRD_SUCCESS,
  RESET_PASSOWRD_ERROR,
  CREATE_CLASS_SUCCESS,
  CREATE_CLASS_ERROR,
  FAKER,
  ON_OFF,
  TEACHER_NOTIFICATION,
  TEACH_ON_OFF,
} from "./types";

export const signup = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/v1/users/signup", data);
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: STUDENT_SIGNUP_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //     type:STUDENT_SIGNUP_ERROR
    //   });
    return err;
  }
};

export const verify_otp = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/v1/users/verifyOtp", data);
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: VERIFY_OTP_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //     type:VERIFY_OTP_ERROR
    //   });
    return err;
  }
};

export const resend_otp = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/v1/users/resendOtp", data);
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: VERIFY_OTP_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //     type:VERIFY_OTP_ERROR
    //   });
    return err;
  }
};

export const login = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/v1/users/signin", data);
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: VERIFY_OTP_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //     type:VERIFY_OTP_ERROR
    //   });
    return err;
  }
};

export const updateBasicProfileInfo = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.put(
      "/v1/users/updateBasicProfileInfo",
      data,
      config
    );
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: UPDATE_STUDENT_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //     type:UPDATE_STUDENT_ERROR
    //   });
    return err;
  }
};

export const updateBasicProfileInfo2 = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.put(
      "/v1/users/updateBasicProfileInfoStep2",
      data,
      config
    );
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: UPDATE_STUDENT_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //     type:UPDATE_STUDENT_ERROR
    //   });
    return err;
  }
};

export const updateBasicProfileInfoOfStudent = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.put(
      "/v1/users/updateBasicProfileInfoOfStudent",
      data,
      config
    );
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: UPDATE_STUDENT_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //     type:UPDATE_STUDENT_ERROR
    //   });
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

export const featuredTeachers = () => async (dispatch) => {
  // setAuthToken(localStorage.token);
  try {
    const res = await axios.get("/v1/users/featuredTeachers");
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

export const reset_password = (data) => async (dispatch) => {
  try {
    const res = await axios.post("/v1/users/forgotPassword", data);
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
    // dispatch({
    //   type: RESET_PASSOWRD_SUCCESS,
    //   payload: res.data.data
    // });
  } catch (err) {
    const errors = err.response.data.errors;

    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //   type: RESET_PASSOWRD_ERROR,
    //   payload: err
    // });
  }
};

export const verifyOtpAfterForgotPassword = (data) => async (dispatch) => {
  try {
    const res = await axios.post(
      "/v1/users/verifyOtpAfterForgotPassword",
      data
    );
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: VERIFY_OTP_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    console.log(err, "error");
    const errors = err.response.data.errors;
    //  console.log(err, errors, " errors")
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const newPassword = (data, id) => async (dispatch) => {
  try {
    const res = await axios.put(`/v1/users/createPassword/${id}`, data);
    dispatch(setAlert(res.data.message, "success"));
    //  dispatch({
    //   type: VERIFY_OTP_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    // dispatch({
    //     type:VERIFY_OTP_ERROR
    //   });
    return err;
  }
};

export const viewPublicProfile = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  try {
    const res = await axios.get("/v1/users/getTeacherProfile", config);
    //dispatch(setAlert(res.data.message, 'success'));
    //  dispatch({
    //   type: CREATE_CLASS_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    // dispatch({
    //     type:CREATE_CLASS_ERROR
    //   });
    return err;
  }
};

export const getClassesList = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  try {
    const res = await axios.get("/v1/users/getClassesList", config);
    // dispatch(setAlert(res.data.message, 'success'));
    //  dispatch({
    //   type: CREATE_CLASS_SUCCESS,
    //   payload:res.data
    //  })
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    // dispatch({
    //     type:CREATE_CLASS_ERROR
    //   });
    return err;
  }
};

export const CreateClass = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post("/v1/users/createClass", data, config);
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const getSessionsOfSelectedMonth = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getSessionsOfSelectedMonth?month=${data.month}&year=${data.year}`,
      config
    );
    //dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getSingleSessionDetail = (id, class_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  //console.log(id , class_id , "response")
  try {
    const res = await axios.get(
      `/v1/users/getSessionDetail/${class_id}/${id}`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const addAvailablility = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post("/v1/users/addAvailablility", data, config);
    if(res && res.data && res.data.success){
      dispatch(setAlert(res.data.message, "success"));
    }
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    //  console.log(err, errors, " errors")
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};
export const getAvailablilitiesList = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getAvailablilitiesList?month=${data.month}&year=${data.year}&source=web`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getTeacherPublicProfile = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get("/v1/users/getTeacherProfile", config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getStudentPublicProfile = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get("/v1/users/getStudentProfile", config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getTopicsAndDiscipline = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const data = "";
  try {
    const res = await axios.get(
      `/v1/users/getTopicsAndDiscipline?discipline_or_topic=${data}`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getAddresses = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const data = "";
  try {
    const res = await axios.get(
      `/v1/users/getAddresses?address=${data}`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getPopularTags = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/getPopularTags`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const searchfilter =
  (
    discipline,
    address,
    time,
    session_type,
    private_or_group,
    class_level,
    minimum_price,
    maximum_price,
    page
  ) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      // if(discipline){
      //   queryString = `?discipline_or_topic=${discipline}&time_of_class=${address}&address_or_class_link=${time}`;
      // }
      // else if(discipline == '' && address == '' && session_type !=='' && private_or_group !== "" && class_level !=="" && minimum_price !=="" && maximum_price !==''){
      //   queryString = `?session_type=${session_type}&private_or_group=${private_or_group}&class_level=${class_level}&minimum_price=${minimum_price}&maximum_price=${maximum_price}`;
      // }

      const res = await axios.get(
        `v1/users/searchTeacherWithClassFilters?discipline_or_topic=${
          discipline ? discipline : ""
        }&time_of_class=${time ? time : ""}&address_or_class_link=${
          address ? address : ""
        }&session_type=${session_type ? session_type : ""}&private_or_group=${
          private_or_group ? private_or_group : ""
        }&class_level=${class_level ? class_level : ""}&minimum_price=${
          minimum_price ? minimum_price : ""
        }&maximum_price=${maximum_price ? maximum_price : ""}&page=${page}`,
        config
      );
      // dispatch(setAlert(res.data.message, 'success'));
      return res.data;
    } catch (err) {
      // const errors = err.response.data.errors;
      //   //  console.log(err, errors, " errors")
      // if (errors) {
      //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      // }
      return err;
    }
  };

export const getTeacherPublicProfileForStudent = (Id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getTeacherPublicProfileForStudent/${Id}`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getClassesListForStudent = (Id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getClassesListForStudent/${Id}`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getClassDetailForStudent =
  (teacherId, classId) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      const res = await axios.get(
        `/v1/users/getClassDetailForStudent/${teacherId}/${classId}`,
        config
      );
      // dispatch(setAlert(res.data.message, 'success'));
      return res.data;
    } catch (err) {
      // const errors = err.response.data.errors;
      //   //  console.log(err, errors, " errors")
      // if (errors) {
      //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      // }
      return err;
    }
  };

export const getAvailabilityForStudent =
  (teacherId, date) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      const res = await axios.get(
        `/v1/users/getAvailablilityForStudent/${teacherId}/${date}`,
        config
      );
      // dispatch(setAlert(res.data.message, 'success'));
      return res.data;
    } catch (err) {
      // const errors = err.response.data.errors;
      //   //  console.log(err, errors, " errors")
      // if (errors) {
      //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      // }
      return err;
    }
  };
  export const checkClassIsAlreadyBookedOrNot =
  (date, class_id) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      const res = await axios.get(
        `/v1/users/checkClassIsAlreadyBookedOrNot/${date}/${class_id}`,
        config
      );
      return res.data;
    } catch (err) {
      return err;
    }
  };
export const getAvailablilityDetail =
  (date, month, year) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      //http://localhost:5000/v1/users/getAvailablility/2022-06-01?month=6&year=2022
      const res = await axios.get(
        `/v1/users/getAvailablility/${date}?month=${month}&year=${year}`,
        config
      );
      // dispatch(setAlert(res.data.message, 'success'));
      return res.data;
    } catch (err) {
      // const errors = err.response.data.errors;
      //   //  console.log(err, errors, " errors")
      // if (errors) {
      //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      // }
      return err;
    }
  };

export const bookclass = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post(`/v1/users/bookAClass`, data, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    //  console.log(err, errors, " errors")
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const getChatToken = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/getChatToken`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getSessionsOfSelectedMonthForStudent =
  (data) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      const res = await axios.get(
        `/v1/users/getSessionsOfSelectedMonthForStudent?month=${data.month}&year=${data.year}`,
        config
      );
      // dispatch(setAlert(res.data.message, 'success'));
      return res.data;
    } catch (err) {
      // const errors = err.response.data.errors;
      //   //  console.log(err, errors, " errors")
      // if (errors) {
      //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      // }
      return err;
    }
  };

export const getSessionDetail = (class_id, session_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getSessionDetail/${class_id}/${session_id}`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getSessionDetailForStudent = (_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getSessionDetailForStudent/${_id}`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const updateClassSessionStatus =
  (data, session_id) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };

    try {
      const res = await axios.put(
        `/v1/users/updateClassSessionStatus/${session_id}`,
        data,
        config
      );
      dispatch(setAlert(res.data.message, "success"));
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      //  console.log(err, errors, " errors")
      if (errors) {
        errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
      }
      return err;
    }
  };

export const getTags = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  try {
    const res = await axios.put(`/v1/users/getTagsId`, data, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const startSessionByStudent = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  try {
    const res = await axios.post(
      `/v1/users/startSessionByStudent`,
      data,
      config
    );
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    //  console.log(err, errors, " errors")
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const endSessionByStudent = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  try {
    const res = await axios.post(`/v1/users/endSessionByStudent`, data, config);
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    //  console.log(err, errors, " errors")
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const addRating = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };

  try {
    const res = await axios.post(`/v1/users/addRating`, data, config);
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const startSessionByTeacher = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post(
      `/v1/users/startSessionByTeacher`,
      data,
      config
    );
    if (res.data && res.data.success) {
      dispatch(setAlert(res.data.message, "success"));
    }
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    //  console.log(err, errors, " errors")
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const endSessionByTeacher = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post(`/v1/users/endSessionByTeacher`, data, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    //  console.log(err, errors, " errors")
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const studentDashboard = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/studentDashboard`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getUpcomingSessionForStudentDashboard = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getUpcomingSessionForStudentDashboard`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const showRating = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/showRating`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const teacherDashboard = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/teacherDashboard`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getUpcomingSessionForTeacherDashboard = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getUpcomingSessionForTeacherDashboard`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    //}
    return err;
  }
};

export const teacherListing = () => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/users/teacherListing`);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    //}
    return err;
  }
};

export const getPopularTagsforLandingPage = () => async (dispatch) => {
  try {
    const res = await axios.get(`/v1/users/getPopularTagsforLandingPage`);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    //}
    return err;
  }
};

export const addwishlist = (teacher_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const data = {
    teacher_id: teacher_id,
  };
  try {
    const res = await axios.post(`/v1/users/addToWishlist`, data, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const removefromWishlist = (teacher_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const data = {
    teacher_id: teacher_id,
  };
  try {
    const res = await axios.post(`/v1/users/removefromWishlist`, data, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const cancelSession = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post(`/v1/users/cancelSession`, data, config);
    if (res.data && res.data.success) {
      dispatch(setAlert(res.data.message, "success"));
    }
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const cancelSessionByTeaher = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.put(
      `/v1/users/cancelSessionByTeaher`,
      data,
      config
    );
    if (res.data && res.data.success) {
      dispatch(setAlert(res.data.message, "success"));
    }
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const checkUserSwitchAccountStatus = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/switchUser/checkUserSwitchAccountStatus`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const saveAccoutInfo = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.put(`/v1/users/saveAccoutInfo`, data, config);
    dispatch(setAlert(res.data.msg, "success"));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getsaveAccoutInfo = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/saveAccoutInfo`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getClassDetail = (class_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/getClassDetail/${class_id}`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getClassDetailForEdit = (class_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getClassDetailForEdit/${class_id}`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const updateClass = (class_id, data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.put(
      `/v1/users/updateClass/${class_id}`,
      data,
      config
    );
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    //  console.log(err, errors, " errors")
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};
export const ReportUser = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post(`/v1/users/reportUser`, data, config);
    dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const ReportClass = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post(`/v1/users/reportClass`, data, config);
    dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getWishlistOfStudent = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/getWishlistOfStudent`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const transactionHistory = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/transactionHistory`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const studentlisting = (page) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/studentList/${page}`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const teacherRatingList = (id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/teacherRatingList/${id}/1`, config);
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const teacherRatingListWithAuth = (id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/teacherRatingListWithAuth/1`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};
export const studentRatingListWithAuth = (id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/studentRatingListWithAuth/1`,
      config
    );
    // dispatch(setAlert(res.data.message, 'success'));
    return res.data;
  } catch (err) {
    // const errors = err.response.data.errors;
    //   //  console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};
export const getNotificationlist = (user_role) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/notificationSettings/${user_role}`,
      config
    );
    //dispatch(setAlert(res.data.message, 'success'));
    dispatch({
      type: FAKER,
      payload: res.data,
    });
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const notificationSettings = (activ, index) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  const data = {
    notification_id: index,
    activation_status: activ,
  };
  const res = await axios.post(
    `/v1/users/notificationSettingsRecord`,
    data,
    config
  );
  dispatch({
    type: TEACH_ON_OFF,
    payload: res.data,
  });
  return res.data;
};

export const showNotifications = (page) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/showNotifications?page=${page}`,
      config
    );
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const unreadNotificationsCount = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/unreadNotificationsCount`, config);
    console.log(
      "unread messages notification api is working  >>>>>>>>>>>>",
      res
    );
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

//Clear the notification
export const deleteNotifications = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/deleteNotifications`, config);
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

// /read the notification
export const notificationMarkAsRead = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/notificationMarkAsRead`, config);
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const getPayoutsList =
  (page, StartDate, EndDate, time_selected, payout_status) =>
  async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      const res = await axios.get(
        `/v1/users/getPayoutsList?page=${page}&start_date=${
          StartDate ? StartDate : ""
        }&end_date=${EndDate ? EndDate : ""}&time_selected=${
          time_selected ? time_selected : ""
        }&payout_status=${payout_status ? payout_status : ""}`,
        config
      );
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      // console.log(err, errors, " errors")
      // if (errors) {
      //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      // }
      return err;
    }
  };

export const getPayoutsDetail = (payout_id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getPayoutsDetail/${payout_id}`,
      config
    );
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const checkRefundRequestAppliedOrNot =
  (transaction_id) => async (dispatch) => {
    const config = {
      headers: {
        "Content-Type": "application/json",
        "x-auth-token": localStorage.getItem("token"),
      },
    };
    try {
      const res = await axios.get(
        `/v1/users/checkRefundRequestAppliedOrNot/${transaction_id}`,
        config
      );
      return res.data;
    } catch (err) {
      const errors = err.response.data.errors;
      // console.log(err, errors, " errors")
      // if (errors) {
      //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
      // }
      return err;
    }
  };

export const applyForRefund = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post(`/v1/users/applyForRefund`, data, config);
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(err, errors, " errors");
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const getRefundRequestList = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/getRefundRequestList`, config);
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const totalEarningFromRefund = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/totalEarningFromRefund`, config);
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const totalEarning = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/totalEarning`, config);
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    // console.log(err, errors, " errors")
    // if (errors) {
    //   errors.forEach(error => dispatch(setAlert(error.msg, 'error')));
    // }
    return err;
  }
};

export const getFrontUserDetail = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(`/v1/users/getFrontUserDetail`, config);
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    return err;
  }
};
export const blockUnblockChannelStatus = (channelId) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/blockUnblockChannelStatus/${channelId}`,
      config
    );
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    return err;
  }
};

export const checkContactExistsWithTeacher = (teacherId) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/checkContactExistsWithTeacher/${teacherId}`,
      config
    );
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    return err;
  }
};

export const getFrontUserDetailForTeacher = () => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.get(
      `/v1/users/getFrontUserDetailForTeacher`,
      config
    );
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    console.log(errors);
    return err;
  }
};

export const contactATeacher = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post("/v1/users/contactATeacher", data, config);
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const blockUnblockChannel = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post("/v1/users/blockUnblockChannel", data, config);
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const blockUnblockChannelForTeacher = (data) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.post("/v1/users/blockUnblockChannelForTeacher", data, config);
    dispatch(setAlert(res.data.message, "success"));
    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

export const deleteClass = (id) => async (dispatch) => {
  const config = {
    headers: {
      "Content-Type": "application/json",
      "x-auth-token": localStorage.getItem("token"),
    },
  };
  try {
    const res = await axios.put(`/v1/users/deleteClass/`,{class_id : id}, config);
    dispatch(setAlert(res.data.message, "success"));

    return res.data;
  } catch (err) {
    const errors = err.response.data.errors;
    if (errors) {
      errors.forEach((error) => dispatch(setAlert(error.msg, "error")));
    }
    return err;
  }
};

