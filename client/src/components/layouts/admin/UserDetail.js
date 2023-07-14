import React from 'react'
import Sidebar from './Sidebar';
import Header from './Header';
import { userDetail,updateUserStatus } from '../../../actions/auth';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import Loader from "../loader";

import Footer from './Footer';
import { MY_PROFILE, SITE_URL } from '../../../actions/types';


class UserDetail extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            userData: {},
            status_value:0

        }


    }
    updateUserStatusOnSelectedUserAccount (userId,statusType) {
        console.log('Am here');
        document.getElementById(
         `${userId}`).selectedIndex = "2";
        //document.getElementById(userId).selectedIndex = statusType;
           //console.log(this.state.creditsAmount);
            this.props.updateUserStatus(userId,statusType).then(res => {
              if(res && res.status == 1){
                  this.setState({status_value:statusType});
              }
            })
           // /console.log(this.state.selectedAccounts);
     
         }
    componentDidMount() {
        //this.setState({message:'',creditsAmount:'',selectedAccounts:[]});
        //const {list,numResults } = this.state
        // this.setApiData()

        this.props.userDetail(this.props.match.params.id).then((res) => {
            if (res.success) {
                console.log(res.data);
                this.setState({
                    userData: res.data,
                    status_value:res.data.account_status
                });
                //   page:res.total , 
                //   numResults : res.data.length,
                //   filterData: generateData(res, res.length, 1),
                // });
                // this.setNewData(list ,numResults)
            }


        }).catch((err) => {
            console.error(err);
        });

        // this.props
        //   .loadAllUsersForSearch()
        //   .then(res => {
        //     this.setState({
        //       filterData: generateData(res, res.length),
        //     });
        //     // console.log(res);
        //   })
        //   .catch(err => console.log(err));
    }

    render() {
        const { userData } = this.state;
        if (Object.keys(userData).length == 0) {
            console.log('object is empty')
        }
        return Object.keys(userData).length != 0 ? (
            <>
                {/* Page Wrapper */}
                <div id="wrapper" style={{color: "black"}}>
                    {/* Sidebar */}
                    <Sidebar />
                    {/* End of Sidebar */}
                    {/* Content Wrapper */}
                    <div id="content-wrapper" className="d-flex flex-column">
                        {/* Main Content */}
                        <div id="content">
                            <Header />
                            <div className="container-fluid">
      <style dangerouslySetInnerHTML={{__html: "\n.h5 {\n    font-size: 1rem !important;\n}\n" }} />
                                
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3">
                                        <div className="row">
                                            <div className="col-md-8">
                                                <h6 className="m-0 font-weight-bold text-primary">User Profile</h6>

                                            </div>
                                            <div className="col-md-4">
                                            <div className="status">
                                                {this.state.status_value == 1 ? <p style={{textAlign:'right',marginRight:'5px'}}>Account Deleted</p> : 
                                                <select className="form-control" value={this.state.status_value} id={userData._id} onChange={(e) => this.updateUserStatusOnSelectedUserAccount(userData._id,e.target.value)}>
                                                    <option value={0}>Active</option>
                                                    <option value={1}>Deleted</option>
                                                    <option value={2}>Suspended</option>
                                                    <option value={3}>Paused</option>
                                                </select>}
                                                </div>
                                            </div>
                                        </div>
                                        
                                        
                                    </div>
                                    <div className="card-body">
                                        <div className="container-fluid">
                                            <div className="row mb-4">
                                                <style dangerouslySetInnerHTML={{ __html: "\n.text-gray-800 {\n    color: #5a5c69!important;\n    text-transform: none;\n}\n" }} />
                                                <style dangerouslySetInnerHTML={{ __html: "\n.h5.mb-1.text-primary {\n    color: #4e73df!important;\n    border-bottom: 1px solid #d0c9c9;\n    text-align: start;\n    padding: 10px;\n}" }} />
                                                <div className="col-lg-12 mb-4">
                                                    <div className="mb-4">
                                                        <div className="card-body">
                                                            <div className="text-center">
                                                                <img className="mb-3" src={MY_PROFILE + this.state.userData.profile_image[0]} style={{ height: '200px', width: '200px', borderRadius: "50%", border: '5px solid #466bd9' }} />
                                                                <p>
                                                                    {' '}{this.state.userData.age != 0 ? this.state.userData.age + ' Years Old' : ""}
                                                                </p>
                                                                {this.state.userData.profile_image_gallery.length > 0 ? this.state.userData.profile_image_gallery.map((image, i) => (
                                                                    <img className="mb-3" src={MY_PROFILE + image.image_name} style={{ height: '100px', width: '100px', borderRadius: "50%" }} />
                                                                )) : ""}
                                                            </div>
                                                            <p>{this.state.userData.detailed_profile.about_me}</p>
                                                        </div>
                                                    </div>
                                                </div>
                                                
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-primary shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                        Religion
                                                                    </div>
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                        {this.state.userData.detailed_profile.religion}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-success shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                        Political views
                                                                    </div>
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                        {this.state.userData.detailed_profile.political_views}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-info shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Looking For
                                                                    </div>
                                                                    <div className="row no-gutters align-items-center">
                                                                        <div className="col-auto">
                                                                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                                                {this.state.userData.detailed_profile.looking_for}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-success shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                        Family Plans
                                                                    </div>
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                        {this.state.userData.detailed_profile.family_plans}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-info shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Pets
                                                                    </div>
                                                                    <div className="row no-gutters align-items-center">
                                                                        <div className="col-auto">
                                                                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                                                {this.state.userData.detailed_profile.pets}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-primary shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                        Diet Preferences
                                                                    </div>
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                        {this.state.userData.detailed_profile.diet_preferences}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-warning shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                                        Fitness
                                                                    </div>
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.userData.detailed_profile.fitness}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-primary shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-primary text-uppercase mb-1">
                                                                        Drinking
                                                                    </div>
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                        {this.state.userData.detailed_profile.drinking}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Earnings (Monthly) Card Example */}
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-success shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-success text-uppercase mb-1">
                                                                        Smoking
                                                                    </div>
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">
                                                                        {this.state.userData.detailed_profile.smoking}
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-info shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-info text-uppercase mb-1">Drugs
                                                                    </div>
                                                                    <div className="row no-gutters align-items-center">
                                                                        <div className="col-auto">
                                                                            <div className="h5 mb-0 mr-3 font-weight-bold text-gray-800">
                                                                                {this.state.userData.detailed_profile.drugs}
                                                                            </div>
                                                                        </div>
                                                                    </div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* Pending Requests Card Example */}
                                                <div className="col-xl-3 col-md-6 mb-4">
                                                    <div className="card border-left-warning shadow h-100 py-2">
                                                        <div className="card-body">
                                                            <div className="row no-gutters align-items-center">
                                                                <div className="col mr-2">
                                                                    <div className="text-xs font-weight-bold text-warning text-uppercase mb-1">
                                                                        Marijuana
                                                                    </div>
                                                                    <div className="h5 mb-0 font-weight-bold text-gray-800">{this.state.userData.detailed_profile.marijuana}</div>
                                                                </div>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-4">
                                                    {/* Illustrations */}
                                                    <div className="card shadow mb-4">
                                                        <div className="card-header py-3">
                                                            <h6 className="m-0 font-weight-bold text-primary">User Info</h6>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="col mr-2">
                                                                <table className="table table-bordered" style={{color:'black'}} id="dataTable" width="100%" cellSpacing={0}>
                                                                    <tbody>
                                                                        <tr>
                                                                            <th>Name</th>
                                                                            <td>{this.state.userData.firstname}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Email</th>
                                                                            <td>{this.state.userData.email}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Phone</th>
                                                                            <td>{this.state.userData.phone}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Registration Date</th>
                                                                            <td>{this.state.userData.registration_date != '-' ? (this.state.userData.registration_date).split('T')[0] : this.state.userData.registration_date}</td>
                                                                        </tr>
                                                                        
                                                                        <tr>
                                                                            <th>Identity</th>
                                                                            <td>{this.state.userData.identity}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Where I live</th>
                                                                            <td>{this.state.userData.detailed_profile.basic_information.live_where}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Where I'm from</th>
                                                                            <td>{this.state.userData.detailed_profile.basic_information.from_where}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>First Date Questions</th>
                                                                            <td>
                                                                                <ul>
                                                                                    {this.state.userData.detailed_profile.date_question.length>0 && 
                                                                                    this.state.userData.detailed_profile.date_question.map((question,index) => (
                                                                                        <li key={index} >{question}</li>
                                                                                    ))}
                                                                                </ul>
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Occupation</th>
                                                                            <td>{this.state.userData.detailed_profile.work_and_education.occupation}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>Education</th>
                                                                            <td>{this.state.userData.detailed_profile.work_and_education.education}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <th>My Values</th>
                                                                            <td>{this.state.userData.detailed_profile.my_values.length>0 && 
                                                                            this.state.userData.detailed_profile.my_values.map((value,index) => (
                                                                                <img src={`${MY_PROFILE}/${value}`} style={{height:'50px'}}/>
                                                                            ))}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                {/* flagsDetail */}
                                                <div className="col-lg-12 mb-4">
                                                    {/* Illustrations */}
                                                    <div className="card shadow mb-4">
                                                        <div className="card-header py-3">
                                                            <h6 className="m-0 font-weight-bold text-primary">Transactions Info</h6>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="col mr-2">
                                                                <style dangerouslySetInnerHTML={{ __html: "\ntable.table.table-responsive {\n    text-align: center;\n    display: inline-table !important;\n}\n" }} />
                                                                <table className="table table-responsive" style={{color:'black'}}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Sr. No.</th>
                                                                            <th>Transaction ID</th>
                                                                            <th>Billing Date</th>
                                                                            <th>Card Method</th>
                                                                            <th>Amount Paid</th>
                                                                            <th> Subscription Plan</th>
                                                                            <th>Invoice PDF File</th>

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {userData.transactionDetails.length > 0 ? userData.transactionDetails.map((transaction, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{transaction.transaction_id}</td>
                                                                                <td>{(transaction.billing_date).split('T')[0]}</td>
                                                                                <td>{transaction.card_method}</td>
                                                                                <td>${transaction.value}</td>
                                                                                <td>{transaction.subscription_title}</td>
                                                                                <td>
                                                                                    <a href={`${MY_PROFILE}${transaction.invoice_link}`} target="_blank"><button type="button" className="btn btn-primary" style={{ borderRadius: '20px', fontSize: '13px' }}>View Invoice</button></a>
                                                                                </td>
                                                                            </tr>
                                                                        )) : <tr>
                                                                            <td colSpan={7}>No Record Found !</td>
                                                                        </tr>}


                                                                    </tbody>
                                                                </table>
                                                            </div>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div className="col-lg-12 mb-4">
                                                    {/* Illustrations */}
                                                    <div className="card shadow mb-4">
                                                        <div className="card-header py-3">
                                                            <h6 className="m-0 font-weight-bold text-primary">Flags Info</h6>
                                                        </div>
                                                        <div className="card-body">
                                                            <div className="col mr-2">
                                                                <style dangerouslySetInnerHTML={{ __html: "\ntable.table.table-responsive {\n    text-align: center;\n    display: inline-table !important;\n}\n" }} />
                                                                <table className="table table-responsive" style={{color:'black'}}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th>Sr. No.</th>
                                                                            <th>Flag Date</th>
                                                                            <th>Flaged By</th>
                                                                            <th>Reason</th>
                                                                            <th>Chat</th>

                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>

                                                                        {userData.flagsDetail.length > 0 ? userData.flagsDetail.map((flag, index) => (
                                                                            <tr key={index}>
                                                                                <td>{index + 1}</td>
                                                                                <td>{(flag.flag_date).split('T')[0]}</td>
                                                                                <td>{flag.firstname}</td>
                                                                                <td>{(flag.reason)}</td>
                                                                                <td>
                                                                                    <a href={`${SITE_URL}/single-user-match-chat/${flag.matchData}`}>
                                                                                        <button className="btn btn-primary">Open</button>
                                                                                    </a>
                                                                                </td>
                                                                            </tr>
                                                                        )) : <tr>
                                                                            <td colSpan={4}>No Record Found !</td>
                                                                        </tr>}


                                                                    </tbody>
                                                                </table>
                                                            </div>
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
                {/* End of Page Wrapper */}
                {/* Scroll to Top Button*/}
            </>
        ) : (
          <div style={{ alignSelf: 'center' }}>
                    <Loader />
                </div>
        )
    }
}

const mapStateToProps = state => ({
    auth: state.auth,
    question: state.question,
    alert: state.alert
});

export default connect(
    mapStateToProps,
    {
        userDetail,updateUserStatus
    }
)(UserDetail);