import React from 'react'
import Sidebar from './Sidebar';
import Header from './Header';
import SmartDataTable from 'react-smart-data-table';
import { getUsers, deleteUser, updateSubAdminPassword } from '../../../actions/subadmin';
import { migrateQuestions } from '../../../actions/questions';

import { connect } from 'react-redux';
// import Popup from 'reactjs-popup';

import Footer from './Footer';
import 'react-smart-data-table/dist/react-smart-data-table.css'

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
  deleteIcon: 'fas fa-trash',
  editIcon: 'fas fa-edit',
  viewIcon: 'fas fa-eye'
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
      srNo: ++a,
      _id: list[i]._id,
      email: list[i].email
    })
  }
  return data
}
class ViewAdminUsers extends React.Component {
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
      showOnRowClick: true,
      changeOrder: false,
      list: [''],
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
      orderedHeaders: [
        '_id',
        'srNo',
        'email',
        'actions',


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
    if (this.props.auth.user.role && this.props.auth.user.role == 2) {
      window.location = 'admin-dashboard';
    }
    const { list, numResults } = this.state
    this.setApiData()

    this.props.getUsers().then((res) => {
      if (res) {
        this.setState({ list: res, numResults: res.length });
        this.setNewData(list, numResults)
      }


    }).catch((err) => {
      console.error(err);
    })
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

  setApiData() {
    let { apiIdx } = this.state
    const N = apiDataUrls.length
    apiIdx += 1
    if (apiIdx === N) apiIdx -= N
    const apiData = apiDataUrls[apiIdx]
    this.setState({ apiData, apiIdx })
  }

  handleDelete(event, _id) {
    event.preventDefault()
    event.stopPropagation()
    const { data } = this.state
    this.props.deleteUser(_id);
    let orgInd
    if (_id) orgInd = data.findIndex(({ _id: thisId }) => thisId === _id)
    data.splice(orgInd, 1)
    this.setState({ data })
    this.setState({ message: "1 Record(s) Deleted Successfully" });
    // setTimeout(() => window.location = window.location, 1500)


  }
  handleDeleteWithDataMigration(event, _id) {
    event.preventDefault()
    event.stopPropagation()
    const { data } = this.state
    if (window.confirm("Are you sure ?")) {
      this.props.migrateQuestions(_id, { 'to_id': this.state.migrate_id }).then(res => {
        if (res && res.status == 1) {
          this.props.deleteUser(_id)
          let orgInd
          if (_id) orgInd = data.findIndex(({ _id: thisId }) => thisId === _id)
          data.splice(orgInd, 1)
          this.setState({ data })
          this.setState({ message: "1 Record(s) Deleted Successfully" });
          setTimeout(() => window.location = window.location, 1500)

        }
      });

    }

  }

  getHeaders() {
    return {
      srNo: {
        text: 'No.',
        invisible: false,
        filterable: false,
        transform: (event, idx, row) => {
          return <div className="srno">{row.srNo}</div>
        }
      },
      _id: {
        text: 'Identifier',
        invisible: true,
        filterable: false,
        transform: (value) => {
          return (
            <div>
              {value}
            </div>
          )
        },
      },
      email: {
        text: 'Email',
        sortable: true,
        filterable: true,
        transform: (event, idx, row) => {
          return (
            <div className="tooltxt password-parent">
              {row.email}

            </div>
          )
        }
      },
      actions: {
        text: 'Actions',
        invisible: false,
        sortable: false,
        filterable: false,
        transform: (event, idx, row) => {
          return (
            <div className="table-actions" style={{ width: '100%' }}>

              <i
                className={sematicUI.deleteIcon}
                style={{ cursor: 'pointer' }}
                onClick={(e) => this.setState({ deleteUserId: row._id })}
                //onKeyDown={(e) => this.handleDelete(e, row)}
                role='button'
                tabIndex='0'
                aria-label='delete row'
                data-toggle="modal"
                data-target="#exampleModal"
              />
            </div>

          )
        },
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
  updatePassword = e => {
    e.preventDefault();
    this.setState({ passwordError: '' });

    if (this.state.account_id != "" && this.state.password != "") {
      var formDataa = {};
      formDataa.account_id = this.state.account_id;
      formDataa.password = this.state.password;

      this.props.updateSubAdminPassword(formDataa).then(PromiseValue => {
        if (PromiseValue && PromiseValue.message) {

          this.setState({ account_id: '', password: '', password_updated: PromiseValue.message });
          setTimeout(function () { window.location = window.location }, 1000);
        } else {
          this.setState({ passwordError: 'Please enter a password with 8 or more characters and special characters with number also.' });

        }


      }).catch(error =>
        console.log(error));
    }
  }
  generatePassword() {
    var length = 10,
      charset = "@#*&!.abcdefghijk@#*&!.lmnopqrstuvwxyz@#*&!.ABCDEFGHIJKLM@#*&!.NOPQRSTUVWXYZ@#*&!.0123@#*&!.456789",
      retVal = "";
    for (var i = 0, n = charset.length; i < length; ++i) {
      retVal += charset.charAt(Math.floor(Math.random() * n));
    }
    if (this.state.password == '') {
      this.setState({ password: retVal });
      return retVal;
    }
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
      changeOrder, orderedHeaders, hideUnordered
    } = this.state
    const divider = <span style={{ display: 'inline-block', margin: '10px' }} />
    const headers = this.getHeaders()
    const rowClick = this.state.deleteAbleArray;
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
              <style dangerouslySetInnerHTML={{ __html: "\n  .invalid-alert{\n  \tlist-style-type: none;\n    color: red;\n    padding-left: 0px;\n  }\n  thead, tbody {\n    text-align: center;\n}\n.table-actions {\n    color: red;\n}\n" }} />
              <div className="container-fluid">
                <div className="card shadow mb-4">
                  <div className="card-header py-3">
                    <h6 className="m-0 font-weight-bold text-primary">View Admins List</h6>
                  </div>
                  <div className="card-body">
                    <section id="file-export">
                      <div className="row">
                        <div className="col-12">
                          <div className="card">
                            <div className="card-content">
                              <div className="card-body">
                                <div className="content-header row">

                                  <div className="modal fade" id="exampleModal" tabIndex={-1} role="dialog" aria-labelledby="exampleModalLabel" aria-hidden="true">
                                    <div className="modal-dialog" role="document">
                                      <div className="modal-content">
                                        <div className="modal-header">

                                          <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                            <span aria-hidden="true">×</span>
                                          </button>
                                        </div>
                                        <div className="modal-body">
                                          <h5 className="modal-title" id="exampleModalLabel">Do you really want to delete this account ?</h5>
                                        </div>
                                        <div className="modal-footer">
                                          <button type="button" className="btn btn-primary" className="close" data-dismiss="modal" aria-label="Close" onClick={(e) => this.handleDelete(e, this.state.deleteUserId)} className="btn btn-primary">Confirm</button>
                                        </div>
                                      </div>
                                    </div>
                                  </div>

                                  <div className="content-header-right col-md-9 col-12 mb-2 " style={{ textAlign: 'right' }}>
                                    <div className="popup-parent-div">
                                      <div className="modal fade" id="exampleModal2" tabIndex={-1} role="dialog" aria-labelledby="exampleModal2Label" aria-hidden="true">
                                        <div className="modal-dialog" role="document">
                                          <div className="modal-content">
                                            <div className="modal-header">
                                              <h5 className="modal-title" id="exampleModalLabel">Regenarate Password</h5>
                                              <button type="button" className="close" data-dismiss="modal" aria-label="Close">
                                                <span aria-hidden="true">×</span>
                                              </button>
                                            </div>
                                            <div className="modal-body" style={{ textAlign: 'center' }}>

                                              {this.state.password_updated != '' ?
                                                <div className="alert alert-success">
                                                  {this.state.password_updated}
                                                </div> : ''}
                                              <form onSubmit={(e) => this.updatePassword(e)} >
                                                <div className="row">
                                                  <div className="col-md-12 mt-2">
                                                    <select className="form-control" name="account_id" onChange={data => this.setState({ account_id: data.target.value })} required>
                                                      <option value="">Select Account</option>
                                                      {this.state.list.length > 0 ? this.state.list.map((account, index) => (
                                                        <option value={account._id} key={index}>{account.email}</option>
                                                      )) : ''}
                                                    </select>
                                                  </div>
                                                  <div className="col-md-12 mt-2">
                                                    <div className="form-group">

                                                      <div className="input-group mb-3">

                                                        <input
                                                          type={this.state.passwordType}
                                                          name="password"
                                                          className="form-control required"
                                                          id="password"
                                                          onChange={data => this.setState({ password: data.target.value })}
                                                          defaultValue={this.state.password == '' ? this.generatePassword() : this.state.password}
                                                          required
                                                        />
                                                        <div className="input-group-append">
                                                          <span className="input-group-text" id="basic-addon2">{this.state.passwordType == 'password' ? <i className="fa fa-eye" onClick={() => this.setState({ passwordType: 'text' })}></i> : <i className="fa fa-eye-slash" onClick={() => this.setState({ passwordType: 'password' })}></i>}</span>
                                                        </div>
                                                        {this.state.passwordError != '' ?
                                                          <div className="help-block font-small-3">
                                                            <ul role="alert" className="invalid-alert">
                                                              <li style={{ textAlign: 'left' }}>
                                                                {this.state.passwordError}
                                                              </li>
                                                            </ul>
                                                          </div> : ""}

                                                      </div>
                                                    </div>
                                                  </div>
                                                  <div className="col-md-12">
                                                    <button className="btn btn-success" type="submit">Update</button>

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
                                <div id="SwitchBtn_msg" style={{ textAlign: 'center', color: 'white', marginTop: '10px' }} />


                                <div className={sematicUI.segment}>
                                  <div className="row">
                                    <div className="col-md-4">
                                      <div className={sematicUI.iconInput}>
                                        <input
                                          type="text"
                                          name="filterValue"
                                          value={filterValue}
                                          placeholder="Filter results..."
                                          onChange={this.handleOnChange}
                                          className="form-control"
                                        />
                                        <i className={sematicUI.searchIcon} />
                                      </div>
                                    </div>
                                    <div className="col-md-4"></div>
                                    <div className="col-md-4" style={{ textAlign: 'right' }}>
                                      <button className="btn btn-primary"
                                        style={{ cursor: 'pointer' }}
                                        //onKeyDown={(e) => this.handleDelete(e, row)}
                                        role='button'
                                        tabIndex='0'
                                        data-toggle="modal"
                                        data-target="#exampleModal2"> Regenarate Password</button>
                                    </div>

                                  </div>

                                  {divider}

                                  {divider}


                                </div>
                                {changeOrder && (
                                  <div className={sematicUI.segment}>
                                    {orderedHeaders.map((header, idx) => (
                                      <div key={header} style={{ marginBottom: '4px' }}>
                                        <div className={sematicUI.labeledInput} style={{ marginRight: '8px' }}>
                                          <input
                                            type='text'
                                            name={header}
                                            value={idx}
                                            placeholder='Index'
                                            style={{ width: '80px' }}
                                            disabled
                                          />
                                          <div className='ui label'>
                                            {header}
                                          </div>
                                        </div>
                                        <button
                                          type='button'
                                          onClick={() => this.handleOnChangeOrder(idx, idx - 1)}
                                        >
                                          before
                                        </button>
                                        <button
                                          type='button'
                                          onClick={() => this.handleOnChangeOrder(idx, idx + 1)}
                                        >
                                          after
                                        </button>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                <div className="div-that-contain-topics-table">
                                  {this.state.message != '' &&
                                    <div className="alert alert-success">
                                      {this.state.message}
                                    </div>
                                  }
                                  <SmartDataTable
                                    //data='/v1/questions'
                                    data={data}
                                    dataKey=''
                                    headers={headers}
                                    orderedHeaders={orderedHeaders}
                                    hideUnordered={hideUnordered}
                                    name='test-table'
                                    className={sematicUI.table}
                                    filterValue={filterValue}
                                    perPage={perPage}
                                    sortable
                                    withToggles
                                    withLinks
                                    withHeader
                                    loader={(
                                      <div className={sematicUI.loader}>
                                        Loading...
                                      </div>
                                    )}
                                    onRowClick={this.onRowClick}

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
                                      <div className={sematicUI.message}>
                                        There is no data available to display.
                                      </div>
                                    )}
                                  />
                                </div>

                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </section>

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
    getUsers,
    deleteUser,
    updateSubAdminPassword,
    migrateQuestions
  }
)(ViewAdminUsers);