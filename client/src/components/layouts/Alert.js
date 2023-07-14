import React from 'react';
import PropTypes from 'prop-types';
import { connect } from 'react-redux';
import Snackbar from '@mui/material/Snackbar';
import MuiAlert from '@mui/material/Alert';

const AlertToast = React.forwardRef(function Alert(props, ref) {
  return <MuiAlert elevation={6} ref={ref} variant="filled" {...props} />;
});
const Alert = ({ alerts }) => {
  const [state, setState] = React.useState({
    vertical: 'top',
    horizontal: 'right',
  });

  const { vertical, horizontal } = state;
  return (
  alerts !== null &&
  alerts.length > 0 &&
  alerts.map(alert => (
    <Snackbar
        anchorOrigin={{ vertical, horizontal }}
        open={true}
        key={alert.id}
    >
      <AlertToast severity={alert.alertType}>{alert.msg}</AlertToast>
    </Snackbar>
  ))
  );
}

Alert.propTypes = {
  alerts: PropTypes.array.isRequired
};

const mapStateToProps = state => ({
  alerts: state.alert
});

export default connect(mapStateToProps)(Alert);
