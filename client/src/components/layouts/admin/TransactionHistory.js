import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import SmartDataTable from "react-smart-data-table";
import { loadAllUsers } from "../../../actions/auth";
import { getTransactions, getTransactionsBySearch } from "../../../actions/transactions";
import { connect } from "react-redux";
import Footer from "./Footer";
import classes from './table.module.css';
import Loader from "../loader";
import { Link } from "react-router-dom";
import DatePicker from 'react-date-picker';

const sematicUI = {
  segment: "ui segment",
  message: "ui message",
  labeledInput: "ui right labeled input",
  iconInput: "ui icon input",
  searchIcon: "search icon",
  rowsIcon: "numbered list icon",
  table: "ui compact selectable table",
  select: "ui dropdown",
  refresh: "ui labeled primary icon button",
  refreshIcon: "sync alternate icon",
  change: "ui labeled secondary icon button",
  changeIcon: "exchange icon",
  checkbox: "ui toggle checkbox",
  loader: "ui active text loader",
  deleteIcon: "la la-trash",
  editIcon: "la la-edit",
  viewIcon: "la la-eye",
};

// const apiDataUrls = [
//   '/v1/questions',
// ]

const generateData = (transactionsList = 0, transactionsNumResults = 0) => {
  let total = transactionsNumResults || 0;
  if (typeof transactionsNumResults === "string") {
    total = parseInt(transactionsNumResults, 10);
  }
  const transactionsData = [];
  for (let i = 0; i < total; i += 1) {
    var a = i;

    transactionsData.push({
      srNo: transactionsList[i].srNo,
      transaction_id: transactionsList[i].transaction_id,
      billing_date: transactionsList[i].billing_date,
      card_method: transactionsList[i].card_method,
      userDetails: transactionsList[i].userDetails,
      value: transactionsList[i].value,
      _id: transactionsList[i]._id,
    });
  }
  return transactionsData;
};
class TransactionHistory extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      useApi: true,
      apiData: "/v1/questions",
      apiIdx: -1,
      numResults: 100,
      data: [],
      filterValue: "",
      totalEntries: 0,
      // perPage: 0,
      pageNo: 1,
      searchPage: 1,
      searchBy: 0,
      creditsData: {},
      showOnRowClick: true,
      changeOrder: false,
      list: [],
      message: "",
      check: [],
      checkLength: 0,
      previousRow: "",
      deleteAbleArray: [],
      partialStatus: "",
      categoriesArray: [],
      subcategory: [],
      subcategoryErr: "",
      category_name: "",
      passwordType: "password",
      password: "",
      showPopup: false,
      account_id: "",
      passwordError: "",
      alertClass: "",
      account_id_error: "",
      deleteUserId: "",
      password_updated: "",
      migrate_id: "",
      filterData: [],
      selectedAccounts: [],
      selectedAccountsName: [],
      creditsAmount: "",
      searchValue: "",
      searchResults: false,
      NoRecordFoundMessage: false,
      hideUnordered: false,
      searchObject: {},
      dates_error_message: false,
      transactionsOrderedHeaders: [
        "srNo",
        "transaction_id",
        "billing_date",
        "card_method",
        "userDetails",
        "value",
        "_id",
      ],
      transactionsData: [],
      transactionsList: [],
      transactionsNumResults: 10,
      startDate: '',
      endDate: '',
      startDateRequired: false,
      endDateRequired: false,
    };

    this.setNewData = this.setNewData.bind(this);
    // this.setApiData = this.setApiData.bind(this)
    // this.changeData = this.changeData.bind(this)
    // this.handleOnChange = this.handleOnChange.bind(this)
    // this.handleOnPerPage = this.handleOnPerPage.bind(this)
    // this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    // this.onRowClick = this.onRowClick.bind(this)
    // this.handleOnChangeOrder = this.handleOnChangeOrder.bind(this)
  }
  componentDidMount() {
    //this.setState({message:'',creditsAmount:'',selectedAccounts:[]});
    const { transactionsList, transactionsNumResults, pageNo } = this.state;
    // this.setApiData()
    this.props
      .getTransactions(pageNo)
      .then((res) => {
        if (res) {
          this.setState({
            transactionsList: res.data,
            searchResults: false,
            transactionsNumResults: res.data.length,
            totalEntries: res.totalTransactions
          });
          this.setNewData(transactionsList, transactionsNumResults);
        }
      })
      .catch((err) => {
        console.error(err);
      });
  }
  // onChangePage(e) {
  //   const { transactionsList, transactionsNumResults } = this.state;

  //   this.props
  //     .getTransactions()
  //     .then((res) => {
  //       if (res) {
  //         this.setState({
  //           transactionsList: res.data,
  //           transactionsNumResults: res.data.length,
  //         });
  //         this.setNewData(transactionsList, transactionsNumResults);
  //       }
  //     })
  //     .catch((err) => {
  //       console.error(err);
  //     });
  // }

  setNewData() {
    const { transactionsList, transactionsNumResults } = this.state;
    this.setState({
      transactionsData: generateData(transactionsList, transactionsNumResults),
    });
  }


  getHeaders() {
    return {
      srNo: {
        text: "No.",
        invisible: false,
        filterable: false,
        transform: (event, idx, row) => {
          return <div className="srno" style={{ textAlign: 'center', fontSize: 14, color: 'black' }}>{row.srNo}</div>;
        },
      },
      transaction_id: {
        text: "Transaction ID",
        invisible: false,
        filterable: false,
        transform: (event, idx, row) => {
          return <div style={{ textAlign: 'left', fontSize: 14, color: 'black' }}>  <a href={`/invoice/${row._id}`}>{row.transaction_id}</a></div>;
        },
      },
      billing_date: {
        text: "Billing Date",
        invisible: false,
        filterable: false,
        transform: (event, idx, row) => {
          return <div style={{ textAlign: 'center', fontSize: 14, color: 'black' }}>{new Date(row.billing_date).toDateString()}</div>;
        },
      },
      card_method: {
        text: "Card Method",
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return <div style={{ textAlign: 'center', fontSize: 14, color: 'black' }}>{row.card_method}</div>;
        },
      },
      userDetails: {
        text: "User Details",
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div style={{ textAlign: 'left', fontSize: 14, color: 'black', paddingLeft: '10px' }}>
              <div>
                {(row['userDetails.name'])}
              </div>
              <div>
                {(row['userDetails.email'])}
              </div>
              <div>
                {(row['userDetails.phone'])}
              </div>
            </div>

          );
        },
      },
      'userDetails.email': {
        invisible: true,
      },
      'userDetails.name': {
        invisible: true,
      },
      'userDetails.phone': {
        invisible: true,
      },
      value: {
        text: "Value",
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return <div style={{ textAlign: 'center', fontSize: 14, color: 'black' }}>${row.value}</div>;
        },
      },
      _id: {
        text: "View Invoice",
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ textAlign: 'center', fontSize: 14, color: 'black' }}>
              <Link to={`/invoice/${row._id}`}>
                <button type="button" className="btn btn-primary" style={{ borderRadius: 20, fontSize: 14 }}>
                  View Invoice
                </button>
              </Link>
            </div>
          );
        },
      },
    };
  }

  pageChangedHandler = value => {
    const { transactionsList, transactionsNumResults, searchResults, searchObject } = this.state;
    this.setState({ pageNo: value });

    if (!searchResults) {
      this.props.getTransactions(value).then((res) => {
        if (res) {
          this.setState({
            transactionsList: res.data,
            searchResults: false,
            transactionsNumResults: res.data.length,
          });
          this.setNewData(transactionsList, transactionsNumResults);
        }
      });
    } else if (searchResults) {
      this.props.getTransactionsBySearch(searchObject, value).then((res) => {
        if (res) {
          this.setState({
            transactionsList: res.data,
            transactionsNumResults: res.data.length,
          });
          this.setNewData(transactionsList, transactionsNumResults);
        }
      });
    }



  };

  // handleOnChange({ target: { name, value } }) {
  //   this.setState({ [name]: value }, () => {
  //     if (name === 'numResults') this.setNewData()
  //   })
  // }

  // handleOnChangeOrder(now, next) {
  //   const { orderedHeaders } = this.state
  //   const N = orderedHeaders.length
  //   let nextPos = next
  //   if (next < 0) {
  //     nextPos = N
  //   }
  //   if (next >= N) {
  //     nextPos = 0
  //   }
  //   const newOrderedHeaders = [...orderedHeaders]
  //   const mvElement = newOrderedHeaders.splice(now, 1)[0]
  //   newOrderedHeaders.splice(nextPos, 0, mvElement)
  //   this.setState({ orderedHeaders: newOrderedHeaders })
  // }

  // handleOnPerPage({ target: { name, value } }) {
  //   this.setState({ [name]: parseInt(value, 10) })
  // }

  // changeData() {
  //   const { useApi } = this.state
  //   this.setState({
  //     useApi: !useApi,
  //     filterValue: '',
  //     perPage: 0,
  //   })
  // }
  getUsers = [];
  getUsersName = [];
  // onClickSelectButton(row){
  //     //console.log(row);
  //   var id=row._id;
  //   var name=row.name;

  //   var index = this.getUsers.indexOf(id);
  //   var nameIndex = this.getUsersName.indexOf(name);
  //         if(index==-1){
  //           this.getUsers.push(id);
  //           //setNewCompare(false);
  //         }
  //         else if (index > -1) {
  //           this.getUsers.splice(index, 1);
  //         }
  //         if(nameIndex==-1){
  //           this.getUsersName.push(name);
  //           //setNewCompare(false);
  //         }
  //         else if (nameIndex > -1) {
  //           this.getUsersName.splice(nameIndex, 1);
  //         }
  //         this.setState({selectedAccounts:this.getUsers,selectedAccountsName:this.getUsersName});
  //         //console.log(this.getUsers);

  // }
  // handleCheckboxChange({ target: { name, checked } }) {
  //   this.setState({ [name]: checked })
  // }
  deleteAbleArrayHere = [];

  // onRowClick(event, { rowData, rowIndex, tableData }) {
  //   const { showOnRowClick,previousRow } = this.state
  //   this.setState({message:''});

  //   if(previousRow==''){
  //     this.setState({previousRow:rowIndex});
  //   }
  //   if(previousRow!='' && !event.shiftKey){
  //     this.setState({previousRow:''});
  //     this.setState({deleteAbleArray : []});
  //     this.deleteAbleArrayHere = [];
  //   }

  //   if(event.shiftKey){

  //     for(var i=0;i<tableData.length;i++){
  //       if(i>=previousRow && i<=rowIndex){
  //         var index = this.deleteAbleArrayHere.indexOf(tableData[i]._id);
  //         if(index==-1){
  //           this.deleteAbleArrayHere.push(tableData[i]._id);
  //           //setNewCompare(false);
  //         }
  //       }
  //     }
  //     this.setState({deleteAbleArray:this.deleteAbleArrayHere});
  //   }

  // }
  searchResult(e) {
    e.preventDefault();
    console.log('submit')
    this.setState({ dates_error_message: false, startDateRequired: false, endDateRequired: false })
    let datesError = false;
    var formData = {};
    let searchBy = e.target.searchBy.value;
    if (searchBy == 1) {
      if (this.state.startDate == '') {
        this.setState({ startDateRequired: true });
      }
      if (this.state.endDate == '') {
        this.setState({ endDateRequired: true });

      }
      formData.start_date = this.state.startDate ? this.convert(this.state.startDate) : "";
      formData.end_date = this.state.endDate ? this.convert(this.state.endDate) : "";
      formData.username = e.target.username ? e.target.username.value : "";
      formData.transaction_id = "";
      const date1 = new Date(formData.start_date);
      const date2 = new Date(formData.end_date);
      const diffTime = (date2 - date1);
      const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24));
      if (diffDays <= 0) {
        this.setState({ dates_error_message: true });
        datesError = true;
      }
    } else if (searchBy == 2) {
      formData.start_date = "";
      formData.end_date = "";
      formData.username = "";
      formData.transaction_id = e.target.transaction_id ? e.target.transaction_id.value : "";

    }


    this.setState({ searchObject: formData });
    const { transactionsList, transactionsNumResults, searchPage, dates_error_message } = this.state;

    //this.setApiData();
    if (!datesError && formData.start_date != '' && formData.end_date != "") {
      this.props.getTransactionsBySearch(formData, searchPage)
        .then(res => {
          if (res.success) {
            this.setState({
              transactionsList: res.data,
              searchResults: true,
              transactionsNumResults: res.data.length,
              totalEntries: res.totalTransactions,
              NoRecordFoundMessage: false
            });
            this.setNewData(transactionsList, transactionsNumResults);
          } else {
            this.setState({
              transactionsList: [],
              searchResults: true,
              transactionsNumResults: 0,
              totalEntries: 0,
              NoRecordFoundMessage: true
            });
            this.setNewData(transactionsList, transactionsNumResults);
          }

        });
    }

  }
  convert = (str) => {
    var date = new Date(str),
      mnth = ("0" + (date.getMonth() + 1)).slice(-2),
      day = ("0" + date.getDate()).slice(-2);
    return [date.getFullYear(), mnth, day].join("-");
  }
  render() {
    // function convert(str) {
    //   var date = new Date(str),
    //     mnth = ("0" + (date.getMonth() + 1)).slice(-2),
    //     day = ("0" + date.getDate()).slice(-2);
    //   return [date.getFullYear(), mnth, day].join("-");
    // }
    const {
      useApi,
      apiData,
      data,
      filterValue,
      perPage,
      numResults,
      showOnRowClick,
      changeOrder,
      orderedHeaders,
      hideUnordered,
      transactionsOrderedHeaders,
      transactionsData,
      transactionsList,
      transactionsNumResults,
      totalEntries,
      pageNo
    } = this.state;
    const divider = (
      <span style={{ display: "inline-block", margin: "10px" }} />
    );
    const headers = this.getHeaders();
    const rowClick = this.state.deleteAbleArray;
    const pageArray = transactionsList.map((comment, index) => {
      return (

        index == 0 ? comment.showPagination

          : []
      )

    })

    return (
      <>
        <style
          dangerouslySetInnerHTML={{
            __html:
              "\n.rsdt input[type=checkbox], input[type=radio] {\n    box-sizing: border-box;\n    padding: 0px;\n    margin: 10px;\n}\n.rsdt label {\n    display: inline-block;\n    margin-bottom: .5rem;\n  color: black;\n  padding: 7px;\n}\n",
          }}
        />
        <style dangerouslySetInnerHTML={{ __html: "\n\n.react-date-picker__wrapper{\nborder:0px !important;\n}\n" }} />
        {/* Page Wrapper */}
        <div id="wrapper">
          {/* Sidebar */}
          <Sidebar />
          {/* End of Sidebar */}
          {/* Content Wrapper */}
          <div id="content-wrapper" className="d-flex flex-column">
            {/* Main Content */}
            <div id="content">
              <Header />
              <style
                dangerouslySetInnerHTML={{
                  __html:
                    "\n.table thead th {\n    vertical-align: bottom;\n    padding: 20px;\n    border-bottom: 2px solid #e3e6f0;\n}\n",
                }}
              />
              {/* Begin Page Content */}
              {/* 
      <AdminDashboardContent />
      */}
              <div className="container-fluid">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">
                      Transactions
                    </h6>
                  </div>
                  <div className="card-body">
                    <form onSubmit={(e) => this.searchResult(e)}>
                      <div className="row mb-2">
                        <div className="col-md-2">
                          <select className="form-control" name="searchBy" onChange={e => this.setState({ searchBy: e.target.value })}>
                            <option value="0">Search By</option>
                            <option value="1">Date Range</option>
                            <option value="2">Transaction ID</option>
                          </select>
                        </div>
                        {this.state.searchBy == 1 &&
                          <>
                            <div className="col-md-3">
                              <DatePicker
                                className="form-control"
                                onChange={e => {
                                  this.setState({ startDate: e });
                                  //console.log(convert(e))
                                }}
                                value={this.state.startDate}
                              />
                              {this.state.startDateRequired && <span className="text-danger">Required !</span>}


                              {/* <input type="date" onChange={(e) => console.log(e.target.value) } name="start_date" placeholder="Start Date" className="form-control" required/> */}
                            </div>
                            <div className="col-md-3">
                              <DatePicker
                                className="form-control"
                                onChange={e => {
                                  this.setState({ endDate: e });
                                  // console.log(convert(e))
                                }}
                                value={this.state.endDate}
                              />
                              {/* <input type="date" name="end_date" placeholder="End Date" className="form-control" required/> */}
                              {this.state.endDateRequired ? <span className="text-danger">Required !</span> :

                                this.state.dates_error_message && <span className="text-danger">End date must be greater than start date </span>}
                            </div>
                            <div className="col-md-2">
                              <input type="text" placeholder="Name" name="username" className="form-control" />
                            </div>
                            <div className="col-md-2">
                              <button className="btn btn-primary form-control">Search</button>
                            </div>
                          </>}
                        {this.state.searchBy == 2 &&
                          <>
                            <div className="col-md-8">
                              <input type="text" placeholder="Transaction ID" name="transaction_id" className="form-control" />
                            </div>
                            <div className="col-md-2">
                              <button className="btn btn-primary form-control">Search</button>
                            </div>
                          </>}
                        {/* <div className="col-md-4">
                        <input type="text" placeholder="Enter name or email to search a user" id="search" onChange={e => this.setState({searchValue :e.target.value})} className="form-control" />
                      </div>
                      <div className="col-md-2">
                        <button className="btn btn-primary form-control" onClick={() => this.searchResult()}>Search</button>
                      </div> */}
                        {/* <div className="offset-2 col-md-4">
                        <select className="form-control" onChange={(e) => this.sortData(e.target.value)}>
                          <option value="1">Sort by Most Recent</option>
                          <option value="2">Sort by Most Previous</option>
                          <option value="3">Sort by Status</option>
                          <option value="4">Sort by Name</option>
                          <option value="5">Sort by Email</option>
                          <option value="6">Sort by Flag</option>
                        </select>
                      </div> */}
                      </div>
                    </form>
                    {this.state.NoRecordFoundMessage ? <div className="alert alert-danger mt-5">No Record Found!</div> :

                      <div className="row">
                        <div
                          className={classes.table_style}
                          style={{ paddingLeft: 10, paddingRight: 10 }}
                        >
                          <SmartDataTable
                            //data='/v1/questions'
                            data={
                              filterValue !== ""
                                ? this.state.filterData
                                : transactionsData
                            }
                            dataKey=""
                            headers={headers}
                            orderedHeaders={transactionsOrderedHeaders}
                            hideUnordered={hideUnordered}
                            name="test-table"
                            className={sematicUI.table}
                            filterValue={filterValue}
                            // perPage={3}
                            //sortable
                            withToggles
                            withLinks
                            withHeader
                            loader={
                              <Loader />
                            }
                            // onRowClick={this.onRowClick}
                            parseImg={{
                              style: {
                                border: "1px solid #ddd",
                                borderRadius: "2px",
                                padding: "3px",
                                width: "60px",
                              },
                              /*
                className: 'ui avatar image',
                */
                            }}
                            dynamic
                            emptyTable={
                              <div style={{ alignSelf: 'center', marginLeft: '100%' }}>
                                <Loader />
                              </div>
                            }

                          />
                          <div className="d-flex justify-content-between">
                            <div className="my-records-number px-4">
                              {transactionsData.length > 0 ? transactionsData.map((c, i) => (
                                i == 0 ?
                                  <p>Showing {c.srNo} to {Number(c.srNo) + (Number(transactionsData.length) - 1)} of {totalEntries} entries</p>


                                  : ''
                              )) : ''}

                            </div>

                            <div className="my-records-number px-4">
                              <div className="dataTables_paginate_custom">
                                {totalEntries != 0 &&
                                  <ul data-test="pagination" className="pagination">
                                    {transactionsList.length > 0 ? transactionsList.map((c, i) => (
                                      i == 0 ?
                                        <>
                                          <li data-test="page-item" onClick={event => this.pageChangedHandler(1)} className={'page-item'}><a data-test="page-link" className="page-link page-link">{`<<`}</a></li>

                                          <li data-test="page-item" onClick={event => this.pageChangedHandler(pageNo < c.totalPages && pageNo > 2 ? Number(pageNo) - Number(1) : pageNo)} className={'page-item'}><a data-test="page-link" className="page-link page-link">{`<`}</a></li>
                                        </>
                                        : ''
                                    )) : ''}

                                    {pageArray.length > 0 ? pageArray[0].map((page, i) => (

                                      <li data-test="page-item" onClick={() => this.pageChangedHandler(page)} key={i} className={pageNo == page ? "active page-item" : 'page-item'}><a data-test="page-link" className="page-link page-link">{page}<span className="sr-only">(current)</span></a></li>

                                    )) :
                                      <li data-test="page-item" onClick={event => this.pageChangedHandler(1)} className={pageNo == 1 ? "active page-item" : 'page-item'}><a data-test="page-link" className="page-link page-link">1<span className="sr-only">(current)</span></a></li>

                                    }
                                    {transactionsList.length > 0 ? transactionsList.map((c, i) => (
                                      i == 0 ?
                                        <>
                                          <li data-test="page-item" onClick={event => this.pageChangedHandler(pageNo < c.totalPages ? Number(pageNo) + Number(1) : pageNo)} className={'page-item'}><a data-test="page-link" className="page-link page-link">{`>`}</a></li>
                                          <li data-test="page-item" onClick={event => this.pageChangedHandler(c.totalPages)} className={'page-item'}><a data-test="page-link" className="page-link page-link">{`>>`}</a></li>
                                        </>
                                        : ''
                                    )) : ''}

                                  </ul>}
                              </div>
                            </div>
                          </div>
                          {/* onChange={e => this.onChangePage(e) }  */}
                        </div>
                      </div>}
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
    );
  }
}

const mapStateToProps = (state) => ({
  auth: state.auth,
  question: state.question,
  alert: state.alert,
  transactons: state.transactions,
});

export default connect(mapStateToProps, {
  loadAllUsers,
  getTransactions,
  getTransactionsBySearch
})(TransactionHistory);
