import {
  USER_LOADED,
  AUTH_ERROR,
  LOGIN_SUCCESS,
  LOGIN_FAIL,
  LOGOUT,
  LOGIN_SUCCESS_SUBADMIN,
  SUB_USER_LOADED,
  SUBADMIN_AUTH_ERROR,
  SUBADMIN_LOGIN_FAIL,
  SUBADMIN_LOGOUT,
  CLIENT,
  FORGOT_PASSWORD_SUCCESS,
  FORGOT_PASSWORD_CHANGE_EMAIL,
  OTP_VERIFIED_SUCCESS,
  PASSWORD_SUCCESS,
  DASHBOARD_USERS,
  DASHBOARD_SESSIONS,
  MANAGEMENT_USERSLIST,
  SINGLE_USER,
  DASHBOARD_TRANSACTIONS,
  DROPDOWN_LIST,
  DASHBOARD_TRANSACTIONS_ERROR
} from '../actions/types';

const initialState = {
  token: localStorage.getItem('token'),
  UserRole: localStorage.getItem('UserRole'),
  isAuthenticated: false,
  isSubAdminAuthenticated: false,
  loading: true,
  loadUsersForDashboard:true,
  loadTransactionsForDashboard:true,
  loadUsersForManagement:true,
  user: null,
  client:null,
  singleUserInfo: null,
  dashboardUsers:[],
  managementUsers:[],
  dropdownData:[],
  //forgotPasswordSteps:localStorage.getItem('step') ? localStorage.getItem('step') : 1
  forgotPasswordSteps: 1,
  changePasswordLinkExpireOn : null,
  changePasswordLink : null,
  goBackToLogin:false,
  dashboardSessions : [],
  dashboardTransaction : [],
};

export default function auth(state = initialState, action) {
  const { type, payload } = action;

  switch (type) {
    case USER_LOADED:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        user: payload
      };
    case DROPDOWN_LIST:
      return {
        ...state,
        dropdownData: payload
      };
    case DASHBOARD_USERS:
      return {
      ...state,
      loadUsersForDashboard: false,
      dashboardUsers: payload
    };
    case DASHBOARD_TRANSACTIONS:
      return {
      ...state,
      loadTransactionsForDashboard: false,
      dashboardTransaction: payload
    };
    case DASHBOARD_SESSIONS:
      return {
      ...state,
      loading: false,
      dashboardSessions: payload
    };
    case MANAGEMENT_USERSLIST:
      return {
        ...state,
        loadUsersForManagement:false,
        managementUsers: payload
      };
    case SINGLE_USER:
      return {
        ...state,
        isAuthenticated: true,
        loading: false,
        singleUserInfo: payload
      };
    case CLIENT:
      console.log('payload',payload);
      return {
        ...state,
        client: payload
      };
    case SUB_USER_LOADED:
      return {
        ...state,
        isSubAdminAuthenticated: true,
        loading: false,
        user: payload
      };
    case LOGIN_SUCCESS:
      localStorage.setItem('token', payload.data.token);
      localStorage.setItem('UserRole',payload.data.role);
      return {
        ...state,
        ...payload,
        isAuthenticated: true,
        UserRole:'ADMIN',
        loading: false
      };
    case FORGOT_PASSWORD_SUCCESS:
      localStorage.setItem('step', payload.step);
      localStorage.setItem('email', payload.email);
      localStorage.removeItem('expiry_time');

      return {
        ...state,
        ...payload,
        forgotPasswordSteps: payload.step
      };
    case FORGOT_PASSWORD_CHANGE_EMAIL:
      console.log('Here');
      localStorage.setItem('step', payload.step);
      localStorage.removeItem('email');
      localStorage.removeItem('expiry_time');

      return {
        ...state,
        ...payload,
        forgotPasswordSteps: payload.step
      };
    case OTP_VERIFIED_SUCCESS:
      localStorage.setItem('step', payload.step);
      localStorage.setItem('expiry_time', payload.link_expiry_time);
      return {
        ...state,
        ...payload,
        forgotPasswordSteps: payload.step,
        changePasswordLinkExpireOn:payload.link_expiry_time,
        changePasswordLink:payload.change_password_link
      };
    case PASSWORD_SUCCESS:
      localStorage.removeItem('step');
      localStorage.removeItem('expiry_time');
      localStorage.removeItem('email');
      return {
        ...state,
        ...payload,
        goBackToLogin: true
      };
    case LOGIN_SUCCESS_SUBADMIN:
      localStorage.setItem('token', payload.data);
      localStorage.setItem('UserRole','SUBADMIN');
      return {
        ...state,
        ...payload,
        isSubAdminAuthenticated: true,
        UserRole:'SUBADMIN',
        loading: false
      };
      
    
    case AUTH_ERROR:
    
      localStorage.removeItem('token');
      localStorage.removeItem('UserRole');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case LOGIN_FAIL:
      localStorage.removeItem('token');
      localStorage.removeItem('UserRole');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
    case LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('UserRole');
      return {
        ...state,
        token: null,
        isAuthenticated: false,
        loading: false
      };
      case SUBADMIN_AUTH_ERROR:
    
      localStorage.removeItem('token');
      localStorage.removeItem('UserRole');
      return {
        ...state,
        token: null,
        isSubAdminAuthenticated: false,
        loading: false
      };
    case SUBADMIN_LOGIN_FAIL:
      localStorage.removeItem('token');
      localStorage.removeItem('UserRole');
      return {
        ...state,
        token: null,
        isSubAdminAuthenticated: false,
        loading: false
      };
    case SUBADMIN_LOGOUT:
      localStorage.removeItem('token');
      localStorage.removeItem('UserRole');
      return {
        ...state,
        token: null,
        isSubAdminAuthenticated: false,
        loading: false
      };
    default:
      return state;
  }
}
