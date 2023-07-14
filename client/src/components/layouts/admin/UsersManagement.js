import React from 'react'
import Sidebar from './Sidebar';
import Header from './Header';
import SmartDataTable from 'react-smart-data-table';
import { loadAllUsers, loadAllUsersForSearch, search } from '../../../actions/auth';
import { migrateQuestions } from '../../../actions/questions';
import { Link } from 'react-router-dom';

import { connect } from 'react-redux';
import classes from './table.module.css';
import Footer from './Footer';
import { MY_PROFILE, SITE_URL } from '../../../actions/types';
import Loader from '../loader';

const sematicUI = {
  segment: 'ui segment',
  message: 'ui message',
  labeledInput: 'ui right labeled input',
  iconInput: 'ui icon input',
  searchIcon: 'search icon',
  rowsIcon: 'numbered list icon',
  table: 'ui compact selectable table',
  select: 'ui dropdown',
  refresh: 'ui labeled primary icon button',
  refreshIcon: 'sync alternate icon',
  change: 'ui labeled secondary icon button',
  changeIcon: 'exchange icon',
  checkbox: 'ui toggle checkbox',
  loader: 'ui active text loader',
  deleteIcon: 'la la-trash',
  editIcon: 'la la-edit',
  viewIcon: 'la la-eye'
}

const apiDataUrls = [
  '/v1/questions',
]

const generateData = (list = 0, numResults = 0) => {
  let total = numResults || 0
  if (typeof numResults === 'string') {
    total = parseInt(numResults, 10)
  }
  const data = [];
  for (let i = 0; i < total; i += 1) {
    var a = i;

    data.push({
      srNo: (list[i].srNo ? list[i].srNo : ++a),
      _id: list[i]._id,
      firstname: list[i].firstname,
      email: list[i].email,
      phone: list[i].phone,
      age: list[i].age,
      profile_image: list[i].profile_image,
      identity: list[i].identity,
      interest_in: list[i].interest_in,
      account_status: list[i].account_status,
      flag_raised: list[i].flag_raised,
      created_at: list[i].created_at
    })
  }
  return data
}
class AppDemo extends React.Component {
  constructor(props) {
    super(props)
    this.state = {
      useApi: true,
      apiData: '/v1/questions',
      apiIdx: -1,
      numResults: 100,
      data: [],
      filterValue: '',
      perPage: 0,
      page: 0,
      pageNo: 1,
      totalEntries: 0,
      creditsData: {},
      showOnRowClick: true,
      changeOrder: false,
      list: [],
      message: '',
      check: [],
      checkLength: 0,
      previousRow: '',
      deleteAbleArray: [],
      partialStatus: '',
      categoriesArray: [],
      subcategory: [],
      subcategoryErr: '',
      category_name: '',
      passwordType: 'password',
      password: '',
      showPopup: false,
      account_id: '',
      passwordError: '',
      alertClass: '',
      account_id_error: '',
      deleteUserId: '',
      password_updated: '',
      migrate_id: '',
      filterData: [],
      selectedAccounts: [],
      selectedAccountsName: [],
      creditsAmount: '',
      searchValue: '',
      searchResults: false,
      searchPage: 1,
      sortBy: 1,
      noRecordFound: false,
      orderedHeaders: [
        '_id',
        'srNo',
        'profile_image',
        'firstname',
        'email',
        'phone',
        'age',
        'identity',
        'interest_in',
        'account_status',
        'created_at',
        'flag_raised',



      ],
      hideUnordered: false,
    }

    this.setNewData = this.setNewData.bind(this)
    this.setApiData = this.setApiData.bind(this)
    this.changeData = this.changeData.bind(this)
    this.handleOnChange = this.handleOnChange.bind(this)
    this.handleOnPerPage = this.handleOnPerPage.bind(this)
    this.handleCheckboxChange = this.handleCheckboxChange.bind(this)
    this.onRowClick = this.onRowClick.bind(this)
    this.handleOnChangeOrder = this.handleOnChangeOrder.bind(this)
  }


  componentDidMount() {
    //this.setState({message:'',creditsAmount:'',selectedAccounts:[]});
    const { list, numResults, sortBy } = this.state
    this.setApiData()

    this.props.loadAllUsers(1, sortBy).then((res) => {
      if (res) {
        this.setState({
          list: res.data,
          page: res.total,
          numResults: res.data.length,
          filterData: generateData(res, res.length, 1),
          totalEntries: res.total,
          searchResults: false,
          noRecordFound: false
        });
        this.setNewData(list, numResults)
      } else {
        this.setState({ noRecordFound: true });
      }


    }).catch((err) => {
      console.error(err);
      this.setState({ noRecordFound: true });


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

  sortData(sort) {

    const { list, numResults } = this.state
    this.setApiData()

    this.props.loadAllUsers(1, sort).then((res) => {
      if (res) {
        this.setState({
          list: res.data,
          page: res.total,
          numResults: res.data.length,
          filterData: generateData(res, res.length, 1),
          totalEntries: res.total,
          searchResults: false,
          sortBy: sort,
          noRecordFound: false
        });
        this.setNewData(list, numResults)
      } else {
        this.setState({ noRecordFound: true });

      }


    }).catch((err) => {
      console.error(err);
    });
  }
  onChangePage(e) {
    var page = e;
    const { list, numResults, sortBy } = this.state;
    this.setState({ pageNo: page });
    this.state.searchResults == false ?
      this.props.loadAllUsers(page, sortBy).then((res) => {
        if (res) {

          this.setState({ list: res.data, numResults: res.data.length, page: res.total });
          this.setNewData(list, numResults)
        }


      }).catch((err) => {
        console.error(err);
      }) :
      this.props.search(this.state.searchValue, page).then(res => {
        this.setState({ list: res.data, numResults: res.data.length, page: res.total, page: res.total, searchResults: true });
        this.setNewData(list, numResults)
        //this.componentDidMount();


        // this.setState({
        //   list: res,
        //   filterData: generateData(res, res.length),
        // });
        // console.log(res);

      });
  }
  onChangeMode = e => {
    this.props.sleepQuestion(e.target.value).then(res => {
      //window.location = window.location;
      this.componentDidMount();
      this.componentDidMount();
    });
  }
  setNewData() {
    const { list, numResults } = this.state
    this.setState({
      data: generateData(list, numResults),
    })
  }
  searchResult() {
    if (this.state.searchValue == "") {
      this.componentDidMount();
    } else {
      const { list, numResults, searchPage } = this.state;
      console.log(searchPage);
      this.setApiData();
      this.props.search(this.state.searchValue, searchPage).then(res => {
        if (res) {
          this.setState({
            list: res.data,
            numResults: res.data.length,
            page: res.total,
            searchResults: true,
            totalEntries: res.total,
            noRecordFound: false
          });
          this.setNewData(list, numResults)
        } else {
          this.setState({ noRecordFound: true });
        }

        //this.componentDidMount();


        // this.setState({
        //   list: res,
        //   filterData: generateData(res, res.length),
        // });
        // console.log(res);

      });
    }

  }
  accountStatus = ['Active', 'Deleted', 'Suspended', 'Paused']
  setApiData() {
    let { apiIdx } = this.state
    const N = apiDataUrls.length
    apiIdx += 1
    if (apiIdx === N) apiIdx -= N
    const apiData = apiDataUrls[apiIdx]
    this.setState({ apiData, apiIdx })
  }



  getHeaders() {
    return {
      srNo: {
        text: 'No.',
        invisible: false,
        filterable: false,
        transform: (event, idx, row) => {
          return <div className="srno" style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>

            {row.srNo}
          </div>
        }
      },
      _id: {
        text: 'Identifier',
        invisible: true,
        filterable: false,
        transform: (value) => {
          return (
            <div style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 8 }}>
              {value}
            </div>
          )
        },
      },
      profile_image: {
        text: 'Profile',
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ alignItems: 'flex-start' }}>
              <img src={MY_PROFILE + '/' + row.profile_image} style={{ height: '100px', borderRadius: '50px', width: '100px' }} />

            </div>
          )
        }
      },
      firstname: {
        text: 'Name',
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>

              <Link to={`view-user-detail/${row._id}`}>{row.firstname}</Link>

            </div>
          )
        }
      },
      email: {
        text: 'Email',
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>
              {row.email}

            </div>
          )
        }
      },
      phone: {
        text: 'Phone',
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>
              {row.phone}

            </div>
          )
        }
      },
      age: {
        text: 'Age',
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>
              {row.age}

            </div>
          )
        }
      },
      identity: {
        text: 'Gender',
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>
              {row.identity}

            </div>
          )
        }
      },
      interest_in: {
        text: 'Interested In',
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>
              {row.interest_in}

            </div>
          )
        }
      },
      account_status: {
        text: 'Status',
        sortable: false,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>

              {this.accountStatus[row.account_status]}
            </div>

          )
        }
      },
      created_at: {
        text: 'Registration Date',
        sortable: false,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ width: 'max-content', textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>
              {(row.created_at).split('T')[0]}

            </div>

          )
        }
      },
      flag_raised: {
        text: 'Flag',
        sortable: false,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ width: 'max-content', textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>
              {row.flag_raised == 1 ?
                <i className="fas fa-flag" style={{ color: 'red' }} />

                : '-'}

            </div>

          )
        }
      },
      match: {
        text: 'Match & Chat Details',
        sortable: false,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent" style={{ width: 'max-content', textAlign: 'left', fontSize: 14, color: '#000000', marginLeft: 10 }}>
              <a href={`single-match-list/${row._id}`}>
                <button className="btn btn-primary">Open Details</button>
              </a>
            </div>

          )
        }
      },
    }
  }

  handleOnChange({ target: { name, value } }) {
    this.setState({ [name]: value }, () => {
      if (name === 'numResults') this.setNewData()
    })
  }

  handleOnChangeOrder(now, next) {
    const { orderedHeaders } = this.state
    const N = orderedHeaders.length
    let nextPos = next
    if (next < 0) {
      nextPos = N
    }
    if (next >= N) {
      nextPos = 0
    }
    const newOrderedHeaders = [...orderedHeaders]
    const mvElement = newOrderedHeaders.splice(now, 1)[0]
    newOrderedHeaders.splice(nextPos, 0, mvElement)
    this.setState({ orderedHeaders: newOrderedHeaders })
  }

  handleOnPerPage({ target: { name, value } }) {
    this.setState({ [name]: parseInt(value, 10) })
  }

  changeData() {
    const { useApi } = this.state
    this.setState({
      useApi: !useApi,
      filterValue: '',
      perPage: 0,
    })
  }
  getUsers = [];
  getUsersName = [];
  onClickSelectButton(row) {
    //console.log(row);
    var id = row._id;
    var name = row.name;

    var index = this.getUsers.indexOf(id);
    var nameIndex = this.getUsersName.indexOf(name);
    if (index == -1) {
      this.getUsers.push(id);
      //setNewCompare(false);
    }
    else if (index > -1) {
      this.getUsers.splice(index, 1);
    }
    if (nameIndex == -1) {
      this.getUsersName.push(name);
      //setNewCompare(false);
    }
    else if (nameIndex > -1) {
      this.getUsersName.splice(nameIndex, 1);
    }
    this.setState({ selectedAccounts: this.getUsers, selectedAccountsName: this.getUsersName });
    //console.log(this.getUsers);


  }
  handleCheckboxChange({ target: { name, checked } }) {
    this.setState({ [name]: checked })
  }
  deleteAbleArrayHere = [];

  onRowClick(event, { rowData, rowIndex, tableData }) {
    const { showOnRowClick, previousRow } = this.state
    this.setState({ message: '' });

    if (previousRow == '') {
      this.setState({ previousRow: rowIndex });
    }
    if (previousRow != '' && !event.shiftKey) {
      this.setState({ previousRow: '' });
      this.setState({ deleteAbleArray: [] });
      this.deleteAbleArrayHere = [];
    }

    if (event.shiftKey) {

      for (var i = 0; i < tableData.length; i++) {
        if (i >= previousRow && i <= rowIndex) {
          var index = this.deleteAbleArrayHere.indexOf(tableData[i]._id);
          if (index == -1) {
            this.deleteAbleArrayHere.push(tableData[i]._id);
            //setNewCompare(false);
          }
        }
      }
      this.setState({ deleteAbleArray: this.deleteAbleArrayHere });
    }

  }

  render() {

    const {
      useApi, apiData, data, filterValue, perPage, numResults, showOnRowClick,
      changeOrder, orderedHeaders, hideUnordered, totalEntries, list, pageNo
    } = this.state
    const divider = <span style={{ display: 'inline-block', margin: '10px' }} />
    const headers = this.getHeaders()
    const rowClick = this.state.deleteAbleArray;
    console.log(this.state.searchResults);
    const pageArray = list.map((comment, index) => {
      return (

        index == 0 ? comment.showPagination

          : []
      )

    })
    return (
      <>
        <style dangerouslySetInnerHTML={{ __html: "\n.rsdt input[type=checkbox], input[type=radio] {\n    box-sizing: border-box;\n    padding: 0px;\n    margin: 10px;\n}\n.rsdt label {\n    display: inline-block;\n    margin-bottom: .5rem;\n  color:black;\n   padding: 7px;\n}\n" }} />
        <style dangerouslySetInnerHTML={{ __html: "\ntable.table.table-responsive {\n    text-align: center;\n    display: inline-table !important;\n}\n" }} />

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
              {/* Begin Page Content */}
              {/* 
      <AdminDashboardContent />
      */}
              <div className="container-fluid">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">Users</h6>
                  </div>
                  <div className="card-body">
                    <div >
                      <div className={classes.table_style} style={{ paddingLeft: 10, paddingRight: 10 }}>
                        <style dangerouslySetInnerHTML={{ __html: "\ntable.table.table-responsive {\n    text-align: center;\n    display: list-item !important;\n}\n" }} />
                        <div className="row mb-2">
                          <div className="col-md-4">
                            <input type="text" placeholder="Enter name or email to search a user" id="search" onChange={e => this.setState({ searchValue: e.target.value })} className="form-control" />
                          </div>
                          <div className="col-md-2">
                            <button className="btn btn-primary form-control" onClick={() => this.searchResult()}>Search</button>
                          </div>
                          <div className="offset-2 col-md-4">
                            <select className="form-control" onChange={(e) => this.sortData(e.target.value)}>
                              <option value="1">Sort by Most Recent</option>
                              <option value="2">Sort by Most Previous</option>
                              <option value="3">Sort by Status</option>
                              <option value="4">Sort by Name</option>
                              <option value="5">Sort by Email</option>
                              <option value="6">Sort by Flag</option>
                            </select>
                          </div>
                        </div>
                        <SmartDataTable
                          //data='/v1/questions'
                          data={
                            filterValue !== ''
                              ? this.state.filterData
                              : data
                          }
                          dataKey=''
                          headers={headers}
                          orderedHeaders={orderedHeaders}
                          hideUnordered={hideUnordered}
                          name='users'
                          className={`${sematicUI.table} table table-responsive`}
                          filterValue={filterValue}
                          // perPage={perPage}
                          // sortable
                          withToggles
                          withLinks
                          withHeader
                          loader={(
                            <Loader />
                          )}

                          parseImg={{
                            style: {
                              border: '1px solid #ddd',
                              borderRadius: '2px',
                              padding: '3px',
                              width: '60px',
                            },
                            /*
                            className: 'ui avatar image',
                            */
                          }}
                          dynamic
                          emptyTable={(
                            <Loader />
                          )}
                        />
                        <div className="d-flex justify-content-between">
                          <div className="my-records-number px-4">
                            {data.length > 0 ? data.map((c, i) => (
                              i == 0 ?
                                <p>Showing {c.srNo} to {Number(c.srNo) + (Number(data.length) - 1)} of {totalEntries} entries</p>


                                : ''
                            )) : ''}

                          </div>

                          <div className="my-records-number px-4">
                            <div className="dataTables_paginate_custom">
                              {totalEntries != 0 &&
                                <ul data-test="pagination" className="pagination">
                                  {list.length > 0 ? list.map((c, i) => (
                                    i == 0 ?
                                      <>
                                        <li data-test="page-item" onClick={event => this.onChangePage(1)} className={'page-item'}><a data-test="page-link" className="page-link page-link">{`<<`}</a></li>

                                        <li data-test="page-item" onClick={event => this.onChangePage(pageNo < c.totalPages && pageNo > 1 ? Number(pageNo) - Number(1) : pageNo)} className={'page-item'}><a data-test="page-link" className="page-link page-link">{`<`}</a></li>
                                      </>
                                      : ''
                                  )) : ''}

                                  {pageArray.length > 0 ? pageArray[0].map((page, i) => (

                                    <li data-test="page-item" onClick={() => this.onChangePage(page)} key={i} className={pageNo == page ? "active page-item" : 'page-item'}><a data-test="page-link" className="page-link page-link">{page}<span className="sr-only">(current)</span></a></li>

                                  )) :
                                    ''

                                  }
                                  {list.length > 0 ? list.map((c, i) => (
                                    //console.log(c),
                                    i == 0 ?
                                      <>
                                        <li data-test="page-item" onClick={event => this.onChangePage(pageNo < c.totalPages ? Number(pageNo) + Number(1) : pageNo)} className={'page-item'}><a data-test="page-link" className="page-link page-link">{`>`}</a></li>
                                        <li data-test="page-item" onClick={event => this.onChangePage(c.totalPages)} className={'page-item'}><a data-test="page-link" className="page-link page-link">{`>>`}</a></li>
                                      </>
                                      : ''
                                  )) : ''}

                                </ul>}
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
    loadAllUsers,
    loadAllUsersForSearch,
    migrateQuestions,
    search
  }
)(AppDemo);