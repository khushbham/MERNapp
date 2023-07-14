import React, { Fragment, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { connect } from 'react-redux';
import Spinner from '../Spinner';
import Footer from './Footer';
import { changePassword } from '../../../actions/auth';

const ChangePassword = ({ auth: { loading }, changePassword }) => {
  const [formDataa, setFormData] = useState({
    previous_password: '',
    new_password: '',
    confirm_password: ''
  });
  const [previousPasswordValidationError, setPreviousPasswordValidationError] = useState('');
  const [newPasswordValidationError, setNewPasswordValidationError] = useState('');
  const [confirmPasswordValidationError, setConfirmPasswordValidationError] = useState('');
  const { previous_password, new_password, confirm_password } = formDataa;
  const [message, setMessage] = useState('');
  const [alertType, setAlertType] = useState('');
  const [successMessage, setSuccessMessage] = useState('Saved');
  const [buttonClass, setButtonClass] = useState('btn btn-primary');
  const onkeyUp = e => {
    setSuccessMessage('Save Changes');
    setButtonClass('btn btn-secondary');
    switch (e.target.id) {
      case 'previous_password':
        if (e.target.value == '') {
          setPreviousPasswordValidationError('Required!');
        } else {
          setPreviousPasswordValidationError('');
        }
        break;
      case 'new_password':
        if (e.target.value == '') {
          setNewPasswordValidationError('Required!');
        } else {
          setNewPasswordValidationError('');
        }
        break;
      case 'confirm_password':
        if (e.target.value == '') {
          setConfirmPasswordValidationError('Required!');
        } else {
          setConfirmPasswordValidationError('');
        }
        break;
      default:
        return '';
    }
  };
  const onChange = e => {
    setFormData({ ...formDataa, [e.target.name]: e.target.value });

  }

  const onSubmit = async e => {
    setPreviousPasswordValidationError('');
    setConfirmPasswordValidationError('');
    setNewPasswordValidationError('');
    e.preventDefault();

    formDataa.previous_password = e.target.previous_password.value;
    formDataa.new_password = e.target.new_password.value;

    formDataa.confirm_password = e.target.confirm_password.value;
    if (formDataa.previous_password == "") {
      setPreviousPasswordValidationError('Required!');
    }
    if (formDataa.new_password == "") {
      setNewPasswordValidationError('Required!');
    }
    if (formDataa.confirm_password == "") {
      setConfirmPasswordValidationError('Required!');
    }
    if (formDataa.previous_password != "" && formDataa.new_password != "" && formDataa.confirm_password != "") {
      console.log(formDataa);
      changePassword(formDataa).then(PromiseValue => {
        if (PromiseValue.message) {
          setSuccessMessage('Saved');
          setButtonClass('btn btn-success');

        }
        PromiseValue.forEach(element => {
          if (element.param == 'previous_password') {
            setPreviousPasswordValidationError(element.msg);
          }
          if (element.param == 'new_password') {
            setNewPasswordValidationError(element.msg);
          }
          if (element.param == 'confirm_password') {
            setConfirmPasswordValidationError(element.msg);
          }
        });


      }).catch(error =>
        console.log(error));
    }
  };
  return loading ? (
    <Spinner />
  ) : (
    <div id="wrapper">
      <Sidebar />
      {/* Content Wrapper */}
      <div id="content-wrapper" className="d-flex flex-column">
        {/* Main Content */}
        <div id="content">
          <Header />
          {/* Begin Page Content */}
          <div className="container-fluid">
            {/* Page Heading */}
            <div className="col-lg-12 mb-4">
              {/* Illustrations */}
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Change Password</h6>
                </div>
                <div className="card-body">
                  <div className="col mr-2">
                    <form className="form-horizontal" onSubmit={e =>
                      onSubmit(e)} encType="multipart/form-data" noValidate>
                      <div className="row">
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="previous_password">
                              Current Password :
                            </label>
                            <input
                              type="password"
                              name="previous_password"
                              className="form-control required"
                              id="previous_password"
                              onChange={e => onChange(e)}
                              value={previous_password}
                              onKeyUp={e => onkeyUp(e)}
                            />
                            {previousPasswordValidationError != '' ?
                              <div className="help-block font-small-3">
                                <p className="text-danger">
                                  {previousPasswordValidationError}
                                </p>
                              </div>
                              : ""}
                          </div>
                        </div>
                        <div className="col-lg-12 col-md-12">
                          <div className="form-group">
                            <label htmlFor="new_password">
                              New Password :
                            </label>
                            <input
                              type="password"
                              name="new_password"
                              className="form-control required"
                              id="new_password"
                              onChange={e => onChange(e)}
                              onKeyUp={e => onkeyUp(e)}
                            />
                            {newPasswordValidationError != '' ?
                              <div className="help-block font-small-3">
                                <p className="text-danger">
                                  {newPasswordValidationError}
                                </p>
                              </div>
                              : ""}
                          </div>
                        </div>
                        <div className="col-md-12">
                          <div className="form-group">
                            <label htmlFor="confirm_password">
                              Confirm New Password :
                            </label>
                            <input
                              type="password"
                              name="confirm_password"
                              id="confirm_password"
                              className="form-control"
                              onChange={e => onChange(e)}
                              onKeyUp={e => onkeyUp(e)}
                              value={confirm_password} />
                            {confirmPasswordValidationError != '' ?
                              <div className="help-block font-small-3">
                                <p className="text-danger">
                                  {confirmPasswordValidationError}
                                </p>
                              </div>
                              : ""}
                          </div>
                          <div className="text-right">
                            <button type="submit" className={buttonClass}>{successMessage}</button>
                          </div>
                        </div>
                      </div>
                    </form>

                  </div>
                </div>
              </div>
            </div>


          </div>
          {/* /.container-fluid */}
        </div>
        {/* End of Main Content */}
        {/* Footer */}
        <Footer />
        {/* End of Footer */}
      </div>
      {/* End of Content Wrapper */}
    </div>

  )
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps, { changePassword }
)(ChangePassword);
