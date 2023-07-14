import { combineReducers } from 'redux';
import alert from './alert';
import auth from './auth';
import transactions from './transactions';
import sessions from './sessions';
import frontend from './frontend';
import userReducer from './noti';
import buttonReducer from './button';
export default combineReducers({
  alert,
  auth,
  transactions,
  sessions,
  frontend,
  userReducer,
  buttonReducer
});
