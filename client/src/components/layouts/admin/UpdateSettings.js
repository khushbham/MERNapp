import React, { Fragment, useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import Header from './Header';
import { connect } from 'react-redux';
import Spinner from '../Spinner';
import Footer from './Footer';
import {getSettingsData,updateSettingsData} from '../../../actions/updateSettings';
// import EditorJs from 'react-editor-js';
import SunEditor from 'suneditor-react';
import 'suneditor/dist/css/suneditor.min.css'; 

// console.log(EditorJs);
const UpdateSettings = ({auth:{loading},getSettingsData,updateSettingsData }) => {
  const [content, setContent] = useState({});
  const [communityGuidelines, setCommunityGuidelines] = useState({});
  const [communityGuidelinesEditor, setCommunityGuidelinesEditor] = useState();
  const [privacyPolicy, setPrivacyPolicy] = useState({});
  const [privacyPolicyEditor, setPrivacyPolicyEditor] = useState(); 
  const [termsOfService, setTermsOfService] = useState({});
  const [termsOfServiceEditor, setTermsOfServiceEditor] = useState(); 
  const [cookiePolicy, setCookiePolicy] = useState({});
  const [cookiePolicyEditor, setCookiePolicyEditor] = useState(); 
  const [memberPrinciples, setMemberPrinciples] = useState({});
  const [memberPrinciplesEditor, setMemberPrinciplesEditor] = useState(); 
  const [apiHit, setApiHit] = useState(false);
  const [editor1Data, setEditor1Data] = useState(''); 
  const [editor2Data, setEditor2Data] = useState(''); 
  const [editor3Data, setEditor3Data] = useState(''); 
  const [editor4Data, setEditor4Data] = useState(''); 
  const [editor5Data, setEditor5Data] = useState(''); 

  // const [content, setContent] = useState({});
  // const [content, setContent] = useState({});
  const handleChange1 = (content) => {
    setEditor1Data(content); //Get Content Inside Editor
  }
  const handleChange2 = (content) => {
    setEditor2Data(content); //Get Content Inside Editor
  }
  const handleChange3 = (content) => {
    setEditor3Data(content); //Get Content Inside Editor
  }
  const handleChange4 = (content) => {
    setEditor4Data(content); //Get Content Inside Editor
  }
  const handleChange5 = (content) => {
    setEditor5Data(content); //Get Content Inside Editor
  }
  useEffect(() => {
        
    getSettingsData().then(promiseValue => {
      if(promiseValue.success == true){
        console.log(promiseValue.data);
        setContent(promiseValue.data);
        setApiHit(true);
        for(var i=0;i<promiseValue.data.length;i++){
          if(i == 0){
            setCommunityGuidelines(promiseValue.data[i]);
            if(promiseValue.data[i].setting_description && promiseValue.data[i].setting_description !=''){
              setCommunityGuidelinesEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue={promiseValue.data[i].setting_description}
                  onChange={e => handleChange1(e)}
                />
              );
              setEditor1Data(promiseValue.data[i].setting_description); //Get Content Inside Editor

            }else{
              setCommunityGuidelinesEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue=""
                  onChange={e => handleChange1(e)}
                />
              );
            }
            
          }
          if(i == 1){
            setPrivacyPolicy(promiseValue.data[i]);
            if(promiseValue.data[i].setting_description && promiseValue.data[i].setting_description !=''){
              setPrivacyPolicyEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue={promiseValue.data[i].setting_description}
                  onChange={handleChange2}

                />
              );
              setEditor2Data(promiseValue.data[i].setting_description); //Get Content Inside Editor

            }else{
              setPrivacyPolicyEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue=""
                  onChange={handleChange2}

                />
              );

            }
            
          }
          if(i == 2){
            setTermsOfService(promiseValue.data[i]);
            if(promiseValue.data[i].setting_description && promiseValue.data[i].setting_description !=''){
              setTermsOfServiceEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue={promiseValue.data[i].setting_description}
                  onChange={handleChange3}

                />
              );
              setEditor3Data(promiseValue.data[i].setting_description); //Get Content Inside Editor

            }else{
              setTermsOfServiceEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue=""
                  onChange={handleChange3}

                />
              );
            }
            
          }
          if(i == 3){
            setCookiePolicy(promiseValue.data[i]);
            if(promiseValue.data[i].setting_description && promiseValue.data[i].setting_description !=''){
              setCookiePolicyEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue={promiseValue.data[i].setting_description}
                  onChange={handleChange4}

                />
              );
              setEditor4Data(promiseValue.data[i].setting_description); //Get Content Inside Editor

            }else{
              setCookiePolicyEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue=""
                  onChange={handleChange4}

                />
              );
            }
            
          }
          if(i == 4){
            setMemberPrinciples(promiseValue.data[i]);
            if(promiseValue.data[i].setting_description && promiseValue.data[i].setting_description !=''){
              setMemberPrinciplesEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue={promiseValue.data[i].setting_description}
                  onChange={handleChange5}

                />
              );
              setEditor5Data(promiseValue.data[i].setting_description); //Get Content Inside Editor

            }else{
              setMemberPrinciplesEditor(
                <SunEditor 
                  height="400px"
                  setDefaultStyle="font-family: sans-serif;font-size: 14px;"
                  defaultValue=""
                  onChange={handleChange5}

                />
              );
            }
            
          }
        }
      }
      
    }).catch(error => console.log(error));
   }, []);
    const [successMessage,setSuccessMessage] = useState('Saved');
    const [message,setMessage] = useState('');
    const [messageClass,setMessageClass] = useState('');
    const [buttonClass,setButtonClass] = useState('btn btn-primary');
    
  //   const onkeyUp = e => {
  //     setSuccessMessage('Save Changes');
  //     setButtonClass('btn btn-secondary');
  //       switch (e.target.id) {
  //           case 'previous_password':
  //               if (e.target.value == '') {
  //                 setPreviousPasswordValidationError('Required!');
  //               } else {
  //                 setPreviousPasswordValidationError('');
  //               }
  //               break;
  //           case 'new_password':
  //             if (e.target.value == '') {
  //               setNewPasswordValidationError('Required!');
  //             } else {
  //               setNewPasswordValidationError('');
  //             }
  //             break;
  //           case 'confirm_password':
  //               if (e.target.value == '') {
  //                   setConfirmPasswordValidationError('Required!');
  //               } else {
  //                   setConfirmPasswordValidationError('');
  //               }
  //               break;
  //            default:
  //                 return '';
  //       }
  //     };
  // const onChange = e =>{
  //   setFormData({ ...formDataa, [e.target.name]: e.target.value });
    
  // }

  const onSubmit = async (e,setting_name) => {
    // setPreviousPasswordValidationError('');
    // setConfirmPasswordValidationError('');
    // setNewPasswordValidationError('');
    e.preventDefault();
    console.log(setting_name);
    setMessage('');
    setMessageClass('');
    var formDataa = {}
    formDataa.setting_name = setting_name;


    if(setting_name == 'agreement'){
      let title = e.target.title1.value;
      if(editor1Data == '' || e.target.title1.value == ''){
        setMessage('All fields are required');
        setMessageClass('alert alert-danger');
      }else{
        formDataa.setting_title = title;
        formDataa.setting_description = editor1Data;
      }
    }
    else if(setting_name == 'privacy_policy'){
      let title = e.target.title2.value;

      if(editor2Data == '' || e.target.title2.value == ''){
        setMessage('All fields are required');
        setMessageClass('alert alert-danger');
      }else{
        formDataa.setting_title = title;
        formDataa.setting_description = editor2Data;

      }
    }
    else if(setting_name == 'terms_of_service'){
      let title = e.target.title3.value;

      if(editor3Data == '' || e.target.title3.value == ''){
        setMessage('All fields are required');
        setMessageClass('alert alert-danger');
      }else{
        formDataa.setting_title = title;
        formDataa.setting_description = editor3Data;

      }
    }
    else if(setting_name == 'cookie_policy'){
      let title = e.target.title4.value;

      if(editor4Data == '' || e.target.title4.value == ''){
        setMessage('All fields are required');
        setMessageClass('alert alert-danger');
      }else{
        formDataa.setting_title = title;
        formDataa.setting_description = editor4Data;

      }
    }
    else if(setting_name == 'member_principles'){
      let title = e.target.title5.value;

      if(editor5Data == '' || e.target.title5.value == ''){
        setMessage('All fields are required');
        setMessageClass('alert alert-danger');
      }else{
        formDataa.setting_title = title;
        formDataa.setting_description = editor5Data;

      }
    }
    if(formDataa && formDataa.setting_title !='' && formDataa.setting_description != '' && formDataa.setting_name != ''){
      updateSettingsData(formDataa).then(PromiseValue => {
        if(PromiseValue.message)
          {
          setSuccessMessage('Saved');
          setButtonClass('btn btn-success');
          setMessage('Settings updated successfully');
          setMessageClass('alert alert-success');
          
          }
        
        
        }).catch(error => 
        console.log(error)); 
    }
  // formDataa.previous_password = e.target.previous_password.value;
  // formDataa.new_password = e.target.new_password.value;
  
  // formDataa.confirm_password = e.target.confirm_password.value;
  //   if(formDataa.previous_password==""){
  //       setPreviousPasswordValidationError('Required!');
  //   }
  //   if(formDataa.new_password==""){
  //       setNewPasswordValidationError('Required!');
  //   }
  //   if(formDataa.confirm_password==""){
  //       setConfirmPasswordValidationError('Required!');
  //   }
  // var formDataa = {}
  //   if(formDataa.setting_title !="" && formDataa.setting_description !=""){
  //       console.log(formDataa);
  //       updateSettingsData(formDataa).then(PromiseValue => {
  //           if(PromiseValue.message)
  //             {
  //             setSuccessMessage('Saved');
  //             setButtonClass('btn btn-success');
              
  //             }
            
            
  //           }).catch(error => 
  //           console.log(error)); 
  //  }
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
                      <h6 className="m-0 font-weight-bold text-primary">Update Settings</h6>
                    </div>
                    <div className="card-body">
                      <div className="col mr-2">
                      {/* <EditorJs data={'data'} />; */}
                      {/* <CKEditor initData={<p>This is an example CKEditor 4 WYSIWYG editor instance.</p>} /> */}
                        <div>
                          <ul className="nav nav-tabs mb-5" id="myTab" role="tablist">
                            <li className="nav-item" role="presentation">
                              <a className="nav-link active" id="home-tab" data-toggle="tab" href="#home" role="tab" aria-controls="home" aria-selected="true">Community Guidelines</a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profile" role="tab" aria-controls="profile" aria-selected="false">Privacy Policy</a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contact" role="tab" aria-controls="contact" aria-selected="false">Terms of Service</a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a className="nav-link" id="profile-tab" data-toggle="tab" href="#profilee" role="tab" aria-controls="profilee" aria-selected="false">Cookie Policy</a>
                            </li>
                            <li className="nav-item" role="presentation">
                              <a className="nav-link" id="contact-tab" data-toggle="tab" href="#contactt" role="tab" aria-controls="contactt" aria-selected="false">Member Principles</a>
                            </li>
                          </ul>
                          {message != '' ? <div className={messageClass} >{message}</div> : ''}

                          <div className="tab-content" id="myTabContent">
                            <div className="tab-pane fade show active" id="home" role="tabpanel" aria-labelledby="home-tab">
                            <form className="form-horizontal"
                            onSubmit={e => onSubmit(e,"agreement")}
                             >
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="title">
                                    Title :
                                    </label>
                                    <input 
                                      type="text" 
                                      name="title1" 
                                      className="form-control required"  
                                      id="title1" 
                                      defaultValue={communityGuidelines.setting_title}
                                      required
                                    //   onChange={e => onChange(e)}
                                    // // value={previous_password} 
                                    //   onKeyUp={e => onkeyUp(e)}
                                    />
                                    {/* {previousPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {previousPasswordValidationError}
                                      </p>
                                    </div>
                                    :""} */}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                <label htmlFor="title">
                                    Description :
                                    </label>
                                {communityGuidelinesEditor}
                                  {/* <div className="form-group">
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
                                    value={confirm_password}/>
                                    {confirmPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {confirmPasswordValidationError}
                                      </p>
                                    </div>
                                    :""}
                                  </div> */}
                                  <div className="text-right mt-3">
                                    <button type="submit" className={buttonClass}>{successMessage}</button>
                                  </div>
                                </div>
                              </div>
                            </form>
          
                            </div>
                            <div className="tab-pane fade" id="profile" role="tabpanel" aria-labelledby="profile-tab">
                            <form className="form-horizontal"
                             onSubmit={e => onSubmit(e,"privacy_policy")}

                             >
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="title">
                                    Title :
                                    </label>
                                    <input 
                                      type="text" 
                                      name="title2" 
                                      className="form-control required"  
                                      id="title2" 
                                      defaultValue={privacyPolicy.setting_title}
                                      required
                                    //   onChange={e => onChange(e)}
                                    // // value={previous_password} 
                                    //   onKeyUp={e => onkeyUp(e)}
                                    />
                                    {/* {previousPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {previousPasswordValidationError}
                                      </p>
                                    </div>
                                    :""} */}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                  <label htmlFor="title">
                                    Description :
                                  </label>
                                {privacyPolicyEditor}
                                  {/* <div className="form-group">
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
                                    value={confirm_password}/>
                                    {confirmPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {confirmPasswordValidationError}
                                      </p>
                                    </div>
                                    :""}
                                  </div> */}
                                  <div className="text-right mt-3">
                                    <button type="submit" className={buttonClass}>{successMessage}</button>
                                  </div>
                                </div>
                              </div>
                            </form>
          
                            </div>
                            <div className="tab-pane fade" id="contact" role="tabpanel" aria-labelledby="contact-tab">
                            <form className="form-horizontal"
                            onSubmit={e => onSubmit(e,"terms_of_service")}

                             >
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="title">
                                    Title :
                                    </label>
                                    <input 
                                      type="text" 
                                      name="title3" 
                                      className="form-control required"  
                                      id="title3" 
                                      defaultValue={termsOfService.setting_title}
                                      required
                                    //   onChange={e => onChange(e)}
                                    // // value={previous_password} 
                                    //   onKeyUp={e => onkeyUp(e)}
                                    />
                                    {/* {previousPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {previousPasswordValidationError}
                                      </p>
                                    </div>
                                    :""} */}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                <label htmlFor="title">
                                    Description :
                                  </label>
                                {termsOfServiceEditor}
                                  {/* <div className="form-group">
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
                                    value={confirm_password}/>
                                    {confirmPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {confirmPasswordValidationError}
                                      </p>
                                    </div>
                                    :""}
                                  </div> */}
                                  <div className="text-right mt-3">
                                    <button type="submit" className={buttonClass}>{successMessage}</button>
                                  </div>
                                </div>
                              </div>
                            </form>
          
                            </div>
                            <div className="tab-pane fade" id="profilee" role="tabpanel" aria-labelledby="profilee-tab">
                            <form className="form-horizontal"
                            onSubmit={e => onSubmit(e,"cookie_policy")}

                             >
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="title">
                                    Title :
                                    </label>
                                    <input 
                                      type="text" 
                                      name="title4" 
                                      className="form-control required"  
                                      id="title4" 
                                      defaultValue={cookiePolicy.setting_title}
                                      required
                                    //   onChange={e => onChange(e)}
                                    // // value={previous_password} 
                                    //   onKeyUp={e => onkeyUp(e)}
                                    />
                                    {/* {previousPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {previousPasswordValidationError}
                                      </p>
                                    </div>
                                    :""} */}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                <label htmlFor="title">
                                    Description :
                                  </label>
                                {cookiePolicyEditor}
                                  {/* <div className="form-group">
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
                                    value={confirm_password}/>
                                    {confirmPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {confirmPasswordValidationError}
                                      </p>
                                    </div>
                                    :""}
                                  </div> */}
                                  <div className="text-right mt-3">
                                    <button type="submit" className={buttonClass}>{successMessage}</button>
                                  </div>
                                </div>
                              </div>
                            </form>
          
                            </div>
                            <div className="tab-pane fade" id="contactt" role="tabpanel" aria-labelledby="contactt-tab">
                            <form className="form-horizontal"
                             onSubmit={e => onSubmit(e,"member_principles")}
                             >
                              <div className="row">
                                <div className="col-md-12">
                                  <div className="form-group">
                                    <label htmlFor="title">
                                    Title :
                                    </label>
                                    <input 
                                      type="text" 
                                      name="title5" 
                                      className="form-control required"  
                                      id="title5" 
                                      defaultValue={memberPrinciples.setting_title}
                                      required
                                    //   onChange={e => onChange(e)}
                                    // // value={previous_password} 
                                    //   onKeyUp={e => onkeyUp(e)}
                                    />
                                    {/* {previousPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {previousPasswordValidationError}
                                      </p>
                                    </div>
                                    :""} */}
                                  </div>
                                </div>
                                <div className="col-md-12">
                                <label htmlFor="title">
                                    Description :
                                  </label>
                                {memberPrinciplesEditor}
                                  {/* <div className="form-group">
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
                                    value={confirm_password}/>
                                    {confirmPasswordValidationError!=''? 
                                    <div className="help-block font-small-3">
                                      <p className="text-danger">
                                        {confirmPasswordValidationError}
                                      </p>
                                    </div>
                                    :""}
                                  </div> */}
                                  <div className="text-right mt-3">
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
  mapStateToProps, {getSettingsData,updateSettingsData}
)(UpdateSettings);
