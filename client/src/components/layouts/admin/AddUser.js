import React, { Fragment, useState } from 'react';
import { Redirect } from 'react-router-dom';
import Sidebar from './Sidebar';
import { connect } from 'react-redux';
import Footer from './Footer';
import Header from './Header';
import { addSubAdmin } from '../../../actions/subadmin';

const HomeBanner = ({ auth: { user }, addSubAdmin }) => {
  const [formDataa, setFormData] = useState({
    email: '',
    password: ''
  });
  const [userNameError, setUserNameError] = useState('');
  const [passwordType, setPasswordType] = useState('password');
  const [passwordError, setPasswordError] = useState('');
  const { email, password } = formDataa;
  const [message, setMessage] = useState(false);
  const [successMessage, setSuccessMessage] = useState('Saved');
  const [buttonClass, setButtonClass] = useState('btn btn-success');
  const onkeyUp = e => {
    setSuccessMessage('Save Changes');
    setButtonClass('btn btn-secondary');
    switch (e.target.id) {
      case 'email':
        if (e.target.value == '') {
          setUserNameError('Required!');
        } else {
          setUserNameError('');
        }
        break;
      case 'password':
        if (e.target.value == '') {
          setPasswordError('Required!');
        } else {
          setPasswordError('');
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
    setUserNameError('');
    setPasswordError('');
    setMessage(false);
    e.preventDefault();

    formDataa.email = e.target.email.value;
    formDataa.password = e.target.password.value;
    if (formDataa.email == "") {
      setUserNameError('Required!');
    }
    if (formDataa.password == "") {
      setPasswordError('Required!');
    }
    if (formDataa.email != "" && formDataa.password != "") {
      addSubAdmin(formDataa).then(PromiseValue => {
        if (PromiseValue.message) {
          setSuccessMessage('Saved');
          setButtonClass('btn btn-success');
          setMessage(true);

        }
        PromiseValue.forEach(element => {
          if (element.param == 'email') {
            setUserNameError(element.msg);
          }
          if (element.param == 'password') {
            setPasswordError(element.msg);
          }
        });


      }).catch(error =>
        console.log(error));
    }
  };
  if (message) {
    return <Redirect to='/view-admin-list' />
  }
  if (user.role && user.role == 2) {
    return <Redirect to='/admin-dashboard' />

  }
  // return loading ? (
  //     <Spinner />
  //     ) : 
  function generatePassword() {
    var length = 10,
      charset = "@#*&!.abcdefghijk@#*&!.lmnopqrstuvwxyz@#*&!.ABCDEFGHIJKLM@#*&!.NOPQRSTUVWXYZ@#*&!.0123@#*&!.456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    if (password == '') {
      setFormData({ password: retVal, email: email });
      return retVal;

    }
  }
  return (
    <>
      <div id="wrapper">
        {/* Sidebar */}
        <Sidebar />
        {/* End of Sidebar */}
        {/* Content Wrapper */}
        <div id="content-wrapper" className="d-flex flex-column">
          {/* Main Content */}
          <div id="content">
            <Header />
            <div className="container-fluid">
              <div className="card shadow mb-4">
                <div className="card-header py-3">
                  <h6 className="m-0 font-weight-bold text-primary">Add Admin</h6>
                </div>
                <div className="card-body">
                  <style dangerouslySetInnerHTML={{ __html: "\n  .invalid-alert{\n  \tlist-style-type: none;\n    color: red;\n    padding-left: 0px;\n  }\n" }} />
                  <form className="form-horizontal" onSubmit={e => onSubmit(e)} encType="multipart/form-data" noValidate>
                    <div className="row">
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="email">
                            User Email:
                          </label>
                          <input
                            type="text"
                            name="email"
                            className="form-control required"
                            id="email"
                            onChange={e => onChange(e)}
                            onKeyUp={e => onkeyUp(e)}
                          />
                        </div>
                        {userNameError != '' ?
                          <div className="help-block font-small-3">
                            <ul role="alert" className="invalid-alert">
                              <li>
                                {userNameError}
                              </li>
                            </ul>
                          </div> : ""}

                      </div>
                      <div className="col-md-6">
                        <div className="form-group">
                          <label htmlFor="password">
                            Password:
                          </label>

                          <div className="input-group mb-3">

                            <input
                              type={passwordType}
                              name="password"
                              className="form-control required"
                              id="password"
                              defaultValue={password == '' ? generatePassword() : password}
                              onChange={e => onChange(e)}
                              onKeyUp={e => onkeyUp(e)}
                            />
                            <div className="input-group-append">
                              <span className="input-group-text" id="basic-addon2">{passwordType == 'password' ? <i className="fa fa-eye" onClick={() => setPasswordType('text')}></i> : <i className="fa fa-eye-slash" onClick={() => setPasswordType('password')}></i>}</span>
                            </div>
                          </div>
                          {/* <input 
                      type={passwordType} 
                      name="password" 
                      className="form-control required"  
                      id="password" 
                      defaultValue = {generatePassword()}
                      onChange={e => onChange(e)}
                      onKeyUp={e => onkeyUp(e)}
                      /> */}
                        </div>
                        {passwordError != '' ?
                          <div className="help-block font-small-3">
                            <ul role="alert" className="invalid-alert">
                              <li>
                                {passwordError}
                              </li>
                            </ul>
                          </div> : ""}

                        <div className="text-right">
                          <button type="submit" className={buttonClass}>{successMessage}</button>
                        </div>
                      </div>
                    </div>
                  </form>
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
      {/* End of Page Wrapper */}
      {/* Scroll to Top Button*/}
    </>
  )
}
const mapStateToProps = state => ({
  auth: state.auth
});
export default connect(
  mapStateToProps, { addSubAdmin }
)(HomeBanner);
