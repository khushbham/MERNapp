import React from 'react';
import { Route, Switch } from 'react-router-dom';
import NotFound from '../layouts/NotFound';
import AdminDashboard from '../layouts/admin/dashboard/Index';
import UserDashboard from '../layouts/admin/user-management/Index';
import BlockDashboard from '../layouts/admin/block-user-management/Index';
import SessionsDashboard from '../layouts/admin/sessions/Index';
import ContentDashboard from '../layouts/admin/content-management/Index';
import NotificationDashboard from '../layouts/admin/notification-management/Index';
import UserDetails from '../layouts/admin/user-management/UserDetails';
import AdminLogin from '../auth/AdminLogin';
import ForgotPassword from '../auth/ForgotPassword';
import ChangePassword from '../auth/ChangePassword';
import UserList from '../layouts/admin/user-management/UserList';
// import SessionMain from '../layouts/admin/SessionManagement/SessionIndex';
import UserProfile from '../layouts/admin/user-management/UserProfile';
import Payments from '../layouts/admin/Financials/Payments';
import InvoiceDetails from '../layouts/admin/Financials/InvoiceDetails';
import ChangePassDashboard from '../layouts/admin/change-password/Index';
import AdminAccountDashboard from '../layouts/admin/user-management/AdminMyAccount';
import SessionsDetailsDashboard from '../layouts/admin/sessions/SessionDetails';
import PagesContentDashboard from '../layouts/admin/content-management/PagesContentDashboard';
import SessionIndex from '../layouts/admin/SessionManagement/SessionIndex';
import NewUser from '../layouts/admin/user-management/NewUser';
import RefundDetails from '../layouts/admin/Financials/RefundDetails';
import Alert from '../layouts/Alert';
import Home from '../layouts/Frontend/LandingPage/Index';
import Teacher from '../layouts/Frontend/Teachers/Teacher';
import ClassDetails  from '../layouts/Frontend/ClassDetails/ClassDetails';
// import TeacherProfile  from '../layouts/Frontend/Teachers/TeacherProfile/TeacherProfile';
import Login from '../layouts/Frontend/Students/AccountManagement/Login';
import Splash from '../layouts/Frontend/Students/AccountManagement/Splash';
import SignUp from '../layouts/Frontend/Students/AccountManagement/SignUp';
import ResetPassword from '../layouts/Frontend/Students/AccountManagement/ResetPassword';
import ValidationPass from '../layouts/Frontend/Students/AccountManagement/ValidationPass';
import NewPassword from '../layouts/Frontend/Students/AccountManagement/NewPassword';
import MyPayouts from '../layouts/Frontend/Payouts/MyPayouts';
import Payout from '../layouts/Frontend/Payouts/Payout';
import Payouts from '../layouts/Frontend/Teachers/Payouts/Payouts';
import MyAccounts from '../layouts/Frontend/Students/AccountManagement/MyAccounts';
import Dashboard from '../layouts/Frontend/Teachers/Dashboard';
import CreateClassStep1 from '../layouts/Frontend/Teachers/CreateClass/CreateClassStep1';
import TeacherSignUp from '../layouts/Frontend/Teachers/AccountManagement/TeacherSignUp';
import TeacherValidationPass from '../layouts/Frontend/Teachers/AccountManagement/TeacherValidationPass';
import TeacherResetPassword from '../layouts/Frontend/Teachers/AccountManagement/TeacherResetPassword';
import CreateNewPassword from '../layouts/Frontend/Teachers/AccountManagement/CreateNewPassword';
import AccountConfirmation from '../layouts/Frontend/Teachers/AccountManagement/AccountConfirmation';
import ProfileConfirmation from '../layouts/Frontend/Teachers/AccountManagement/ProfileConfirmation';
import AccountSteps from '../layouts/Frontend/Teachers/AccountManagement/AccountSteps';
import NotificationsSettings from '../layouts/Frontend/Teachers/AccountManagement/NotificationsSettings';
import EditTeacherProfile from '../layouts/Frontend/Teachers/AccountManagement/EditTeacherProfile';
import ProfileTeacherView from '../layouts/Frontend/Teachers/AccountManagement/ProfileTeacherView';
import StudentsNotifications from '../layouts/Frontend/Students/AccountManagement/StudentsNotifications';
// import StudProfileEditView from '../layouts/Frontend/Students/AccountManagement/StudProfileEditView';
import ClassConfirmation from '../layouts/Frontend/Teachers/CreateClass/ClassConfirmation';
import MyPayout from '../layouts/Frontend/Teachers/Payouts/MyPayout';
import Payoutpending from '../layouts/Frontend/Teachers/Payouts/PayoutPending';
import PayoutDetailsData from '../layouts/Frontend/Teachers/Payouts/PayoutDetailsData';
import Calendar from '../layouts/Frontend/Teachers/CalendarSessions/Calendar';
import BookClass from '../layouts/Frontend/Students/BookClass/BookClass';
import Sessiondetails from '../layouts/Frontend/Teachers/CalendarSessions/Sessiondetails';
import ClassPayment from '../layouts/Frontend/Students/BookClass/ClassPayment';
import StudAccountConfirmation from '../layouts/Frontend/Students/BookClass/StudAccountConfirmation';
import StudentProfileView from '../layouts/Frontend/Students/AccountManagement/StudProfileEditView';
import BookClassDetail from '../layouts/Frontend/Students/BookClass/BookClassDetail';
import MyClasses from '../layouts/Frontend/Students/SessionsCalendar/MyClasses';
import StudClassDetails from '../layouts/Frontend/Students/SessionsCalendar/StudClassDetails';
import ClassDetailForBookingProcess from '../layouts/Frontend/Students/SessionsCalendar/ClassDetailForBookingProcess';
//import PayoutFilter from '../layouts/Frontend/Teachers/Payouts/PayoutFilter';
import EndSessionRating from '../layouts/Frontend/Teachers/TeacherSessionProgess/EndSessionRating';
import StudentEndSessionRating from '../layouts/Frontend/Students/StudentSessionProgess/EndSessionRating';
import Notifications from '../layouts/Frontend/TeacherStudentsNotifications/Notifications';
import StudentDashboard from '../layouts/Frontend/Students/StudentDashboard';
import AvailabilitySlots from '../layouts/Frontend/Teachers/CalendarAvailability/AvailabilitySlots';
import SetAvailability from '../layouts/Frontend/Teachers/CalendarAvailability/SetAvailability';
import TeacherProfile from '../layouts/Frontend/Students/TeacherProfile/TeacherProfile';
import MyChat from '../layouts/Frontend/Students/Chats/Chat';
import SessionComingUp from '../layouts/Frontend/Teachers/TeacherSessionProgess/SessionComingUp'
import SessionComingUpBanner from '../layouts/Frontend/SessionComingUpBanner';
import SessionDetailsInProgress from '../layouts/Frontend/Teachers/TeacherSessionProgess/SessionDetailsInProgress';
import StudentSessionDetailsInProgress from '../layouts/Frontend/Students/StudentSessionProgess/SessionDetailsInProgress';
import BasicInformation from '../layouts/Frontend/Students/AccountManagement/BasicInformation';
import TeacherDashboard from '../layouts/Frontend/Teachers/TeacherDashboard';
import StudentConfirmation from '../layouts/Frontend/Students/AccountManagement/StudentConfirmation';
import Teacher_Login from '../layouts/Frontend/Teachers/AccountManagement/Login';
import ValidationforResetPassword from '../layouts/Frontend/Students/AccountManagement/ValidationPassforReset';
import TeacherValidationResetPass from '../layouts/Frontend/Teachers/AccountManagement/TeacherValidationResetPass';
import VideoClass from '../layouts/Frontend/Students/SessionsCalendar/VideoClass';
import MyTeacherChat from '../layouts/Frontend/Teachers/Chats/Chat';
import EditBasicInformation from '../layouts/Frontend/Teachers/AccountManagement/EditBasicInfo';
import ExpertiseAccountSetup from '../layouts/Frontend/Teachers/AccountManagement/ExpertiseAccountSetup';
import AccountSteps2 from '../layouts/Frontend/Students/AccountManagement/AccountSteps2';
import MySessions from '../layouts/Frontend/Teachers/CalendarSessions/MySessions';
import StudentSessionComingUp from '../layouts/Frontend/Students/StudentSessionProgess/SessionComingUp';
import PrivateRouteforStudent from './PrivateRouteforStudent';
import PrivateRouteforTeacher from './PrivateRouteforTeacher';
import PublicRoute from './PublicRoute';
import PrivateRoute from '../routing/PrivateRoute';
import TeacherClassDetails from '../layouts/Frontend/Teachers/ClassDetails/TeacherClassDetails';
import EditClassDetails from '../layouts/Frontend/Teachers/AccountManagement/EditClassDetails';
import MyFavourite from '../layouts/Frontend/Students/AccountManagement/MyFavourite';
import MyPayments from '../layouts/Frontend/Students/AccountManagement/MyPayments';
import MyStudents from '../layouts/Frontend/Teachers/AccountManagement/MyStudents';
// import ChangePassword from '../layouts/admin/ChangePassword';
// import UsersManagement from '../layouts/admin/UsersManagement';
// import TransactionHistory from '../layouts/admin/TransactionHistory';
// import UpdateSettings from '../layouts/admin/UpdateSettings';
// import UserDetail from '../layouts/admin/UserDetail';
// import Invoice from '../layouts/admin/Invoice';
// import MatchList from '../layouts/admin/MatchList';
// import SingleUserMatchList from '../layouts/admin/SingleUserMatchList';
// import AddUser from '../layouts/admin/AddUser';
// import ViewUsers from '../layouts/admin/ViewUsers';
const Routes = (props) => {
  return (
    <>
      <Alert />
        <Switch>
        <PrivateRoute exact path='/admin-dashboard' component= {AdminDashboard} />
        <PrivateRoute exact path='/user-management' component= {UserDashboard} />
        <PrivateRoute exact path='/content-management' component= {ContentDashboard} />
        <PrivateRoute exact path='/notification-management' component= {NotificationDashboard} />
        <PrivateRoute exact path='/block-management' component = {BlockDashboard}/>
        <PrivateRoute exact path='/pages-content/:id' component= {PagesContentDashboard} />
        <PrivateRoute exact path='/user-details/:id' component= {UserDetails} />
        <PrivateRoute exact path="/users" component={UserList} />
        <PrivateRoute exact path="/session-details/:id" component={SessionsDetailsDashboard} />
        <PrivateRoute exact path="/sessions" component={SessionsDashboard} />
        {/* <PrivateRoute exact path="/new-user" component={NewUser} /> */}
        <PrivateRoute exact path="/admin-change-password" component={ChangePassDashboard} />
        <PrivateRoute exact path="/admin-profile" component={AdminAccountDashboard} />
        <PrivateRoute exact path="/issue-refund/:id" component={RefundDetails} />
        <Route exact path="/admin-login" component={AdminLogin} />
        <Route exact path="/forgot-password" component={ForgotPassword} />
        <Route exact path="/change-password/:id" component={ChangePassword} />
        <PrivateRoute exact path="/new-user" component={UserProfile} />
        {/* <Route exact path="/change-password/" component={ChangePasswordWithoutAuth} /> */}
        {/* <Route exact path="/session-details/" component={SessionMain} /> */}
        <PrivateRoute exact path="/payments/" component={Payments} />
        <PrivateRoute exact path="/invoice-details/:id" component={InvoiceDetails} />
        <PrivateRoute exact path="/calendar-sessions/" component={SessionIndex} />
        {/*<PrivateRoute exact path="/change-password" component={ChangePassword} />
        <PrivateRoute exact path="/user-management" component={UsersManagement} />
        <PrivateRoute exact path="/transactions" component={TransactionHistory} />
        <PrivateRoute exact path="/invoice/:id" component={Invoice} />
        <PrivateRoute exact path="/update-settings" component={UpdateSettings} />
        <PrivateRoute exact path="/view-user-detail/:id" component={UserDetail} />
        <PrivateRoute exact path="/match-list" component={MatchList} />
        <PrivateRoute exact path="/single-match-list/:id" component={SingleUserMatchList} />
        <PrivateRoute exact path="/add-admin" component={AddUser} />
        <PrivateRoute exact path="/view-admin-list" component={ViewUsers} /> */}
      {/* Fontend */}
      <Route exact path="/" component={Home}/>
     
     
      {/* create class */}
      <PrivateRouteforTeacher exact path="/teacher/class-confirmation" component={ClassConfirmation}/>
      {/* Students: Account Management */}
      <PublicRoute exact path="/login" component={Login} />
      <PublicRoute exact path="/splash" component={Splash} />
      <PublicRoute exact path="/students/sign-up" component={SignUp} />
      <PublicRoute exact path="/validation" component={ValidationPass} />
      <PublicRoute exact path="/validation-for-reset" component={ValidationforResetPassword} />
      <PublicRoute exact path="/reset-password" component={ResetPassword} />
      <PublicRoute exact path="/new-password" component={NewPassword} />
      <PrivateRouteforStudent exact path="/payout" component={Payout} />
      <PrivateRouteforStudent exact path="/class-details" component={ClassDetails}/>
      <PrivateRouteforStudent exact path="/my-payouts" component={MyPayouts} />
      <PrivateRouteforStudent exact path="/search" component={Teacher}/>
      <PrivateRouteforStudent exact path="/student-account-confirmation" component={StudentConfirmation}/>
      <PrivateRouteforStudent exact path="/public-profile-of-teacher" component={TeacherProfile}/>
      <PrivateRouteforStudent exact path="/students/payments" component={MyPayments}/>
      <PrivateRouteforStudent exact path="/dashboard" component={Dashboard}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/accounts" component={MyAccounts}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/notificationlisting" component={Notifications}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/favourite" component={MyFavourite}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/basic-info" component={StudentProfileView}></PrivateRouteforStudent> 
      <PrivateRouteforStudent exact path="/students/session-coming-up" component={StudentSessionComingUp}></PrivateRouteforStudent> 
      <PrivateRouteforStudent exact path="/students/book-class" component={BookClass}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/class-payments" component={ClassPayment}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/account-confirmation" component={StudAccountConfirmation}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/book-class-detail" component={BookClassDetail}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/accountsetup" component={AccountSteps2}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/start-video-class" component={VideoClass}/>
      <PrivateRouteforStudent exact path="/students/session-in-progress-details"  component={StudentSessionDetailsInProgress}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/end-session-rating" component={StudentEndSessionRating}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/my-classes" component={MyClasses}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/class-Details" component={StudClassDetails}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/class-detail-for-booking-process" component={ClassDetailForBookingProcess}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/students/notifications" component={StudentsNotifications}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/student/dashboard" component={StudentDashboard}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/student/chats" component={MyChat}></PrivateRouteforStudent>
      <PrivateRouteforStudent exact path="/basic-information" component={BasicInformation}></PrivateRouteforStudent>
       {/* Teacher: account management */}
      <PublicRoute exact path="/teacher/sign-in" component={Teacher_Login}></PublicRoute>
      <PublicRoute exact path="/teacher/sign-up" component={TeacherSignUp}></PublicRoute>
      <PublicRoute exact path="/validation-pass" component={TeacherValidationPass}></PublicRoute>
      <PublicRoute exact path="/validation-teacher-reset-pass" component={TeacherValidationResetPass}></PublicRoute>
      <PublicRoute exact path="/create-password" component={CreateNewPassword}></PublicRoute>
      <PublicRoute exact path="/teacher-reset-password" component={TeacherResetPassword }></PublicRoute>
      <PrivateRouteforTeacher exact path="/classes-steps" component={CreateClassStep1} />
      <PrivateRouteforTeacher exact path="/teacher/student" component={MyStudents} />
      <PrivateRouteforTeacher exact path="/teacher/class-detials" component={TeacherClassDetails} />
      <PrivateRouteforTeacher exact path="/teacher/editclass-detials" component={EditClassDetails} />
      <PrivateRouteforTeacher exact path="/account-confirmation" component={AccountConfirmation}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/profile-confirmation" component={ProfileConfirmation}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/session-details" component={Sessiondetails}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/account-steps" component={AccountSteps}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/notification-settings" component= {NotificationsSettings}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/edit-profile" component={EditTeacherProfile}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/teacher-profile" component={ProfileTeacherView}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/payouts" component={MyPayout}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/my-payouts" component={Payouts}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/payout-pending" component={Payoutpending}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/payout-details" component={PayoutDetailsData}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/calendar" component={Calendar}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/chat" component={MyTeacherChat}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/expertiseAccountsetup" component={ExpertiseAccountSetup}></PrivateRouteforTeacher>
      {/* <PrivateRouteforTeacher exact path="/teachers/payout-filter" component={PayoutFilter}></PrivateRouteforTeacher> */}
      <PrivateRouteforTeacher exact path="/teacher/end-session-rating" component={EndSessionRating}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/availability-slots" component={AvailabilitySlots}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/set-availability" component={SetAvailability}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/session-coming-up" component={SessionComingUp}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/editbasic-info" component={EditBasicInformation}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/session-coming-banner"  component={SessionComingUpBanner}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/session-in-progress-details"  component={SessionDetailsInProgress}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/dashboard" component={TeacherDashboard}></PrivateRouteforTeacher>
      <PrivateRouteforTeacher exact path="/teacher/notification" component={Notifications}></PrivateRouteforTeacher>
      <Route component={NotFound} />
        </Switch>
    </>
  );
};

export default Routes;