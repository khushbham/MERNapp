import React, { useEffect } from "react";
import Grid from "@mui/material/Grid";
import Typography from "@mui/material/Typography";
import Container from "@mui/material/Container";
import Box from "@mui/material/Box";
import Switch from "@mui/material/Switch";
import { useHistory } from "react-router-dom";
import Rating from "@mui/material/Rating";
import Stack from "@mui/material/Stack";
import { ImCross } from "react-icons/im";
import Modal from "@mui/material/Modal";
import Paper from "@mui/material/Paper";
import Table from "@mui/material/Table";
import TableBody from "@mui/material/TableBody";
import TableCell from "@mui/material/TableCell";
import TableContainer from "@mui/material/TableContainer";
import TableHead from "@mui/material/TableHead";
import TablePagination from "@mui/material/TablePagination";
import TableRow from "@mui/material/TableRow";
// import { FiHeart } from 'react-icons/fi';
// import { FaHeart } from 'react-icons/fa';
import StudentAccSidebar from "./StudentAccSidebar";
import StudentNavbar from "../StudentNavbar";
import { useDispatch } from "react-redux";
import {
    applyForRefund,
    checkRefundRequestAppliedOrNot,
  getWishlistOfStudent,
  removefromWishlist,
  transactionHistory,
} from "../../../../../actions/frontent";
import { Button, Link } from "@mui/material";
import moment from "moment";

const MyPayments = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const style = {
    position: 'absolute',
    top: '50%',
    left: '50%',
    transform: 'translate(-50%, -50%)',
    width: 400,
    bgcolor: 'background.paper',
    borderRadius: '15px',
    boxShadow: 24,
    pt: 2,
    px: 4,
    pb: 3,
  };
  const [teacherData, setteacherData] = React.useState([]);
  const [page, setPage] = React.useState(0);
  const [open, setOpen] = React.useState(false);
  const [reason, setreason] = React.useState('');
  const [Message, setMessage] = React.useState(false);
  const [ transaction_id , settransaction_id] = React.useState('')
  const [rowsPerPage, setRowsPerPage] = React.useState(10);
  const columns = [
    { id: "date", label: "Biiling Date", minWidth: 170 },
    { id: "id", label: "Transaction Id", minWidth: 100 },
    { id: "value", label: "Value", minWidth: 100 },
    {
      id: "link",
      label: "Invoice",
      minWidth: 100,
      align: "right",
      format: (value) => (
        <>
          <Button target="_blank">
            {" "}
            <a href={value}> Download</a>
          </Button>
        </>
      ),
    },
    {
      id: "refund",
      minWidth: 50,
      align: "right",
      format: (id) => (
        <>
          <Button target="_blank" onClick={() => applyRefund(id)}>
            {" "}
            Refund
          </Button>
        </>
      ),
    },
    // {
    //     id: 'size',
    //     label: 'Size\u00a0(km\u00b2)',
    //     minWidth: 170,
    //     align: 'right',
    //     format: (value) => value.toLocaleString('en-US'),
    // },
    // {
    //     id: 'density',
    //     label: 'Density',
    //     minWidth: 170,
    //     align: 'right',
    //     format: (value) => value.toFixed(2),
    // },
  ];
  function createData(date, id, value, link, refund) {
    return { date, id, value, link, refund };
  }
  const rows = teacherData?.map((arr) =>
    createData(
      moment(arr?.billing_date).format("YYYY-MM-DD"),
      arr?.transaction_id,
      `$${arr?.amount}`,
      arr?.invoice_link,
      arr?._id
    )
  );

  const handleChangePage = (event, newPage) => {
    setPage(newPage);
  };

  const applyRefund = (id) => {
    setOpen(true);
    settransaction_id(id)
    dispatch(checkRefundRequestAppliedOrNot(id)).then((res)=>{
        if(res && res.success == false){
            setMessage(true)
        }else{
            setMessage(false)
        }
    }).catch((err)=>{
        console.log(err , 'eroor')
    })
    console.log(id, "id");
  };

//   const handleOpen = () => {
//     setOpen(true);
//   };
  const handleClose = () => {
    setOpen(false);
  };

  const ApplyRefund = () => {
    const data = {
    transaction_id: transaction_id,
    reason_to_apply_refund: reason
    }
    dispatch(applyForRefund(data)).then((res) => {
      if(res && res.success){
         setOpen(false);
      }
    }).catch((err) => {
      console.log(err)
    })
  };

  const handleChangeRowsPerPage = (event) => {
    setRowsPerPage(+event.target.value);
    setPage(0);
  };
  // const wishlist = (id) => {
  //     dispatch(removefromWishlist(id)).then((res) => {
  //         if (res.success == true) {

  //         }
  //     }).catch((err) => {
  //         console.log(err)
  //     })
  // }
  const onClick = (e) => {
    history.push({
      pathname: "/public-profile-of-teacher",
      search: `Id=${e}`,
      state: { Id: e },
    });
  };

  const gettransactionHistory = () => {
    dispatch(transactionHistory())
      .then((res) => {
        setteacherData(res.data);
      })
      .catch((err) => {
        console.log(err);
      });
  };
  useEffect(() => {
    gettransactionHistory();
  }, []);

  return (
    <>
      <StudentNavbar />
      <Grid container>
        <Grid
          item
          lg={10}
          sm={12}
          md={12}
          xs={12}
          className="m-auto informationSidebar my-4"
        >
          <Box sx={{ flexGrow: 1, display: "flex" }}>
            <Grid container>
              <Grid item lg={4} sm={4} md={12} xs={12}>
                <StudentAccSidebar />
              </Grid>
              <Grid item lg={8} sm={4} md={12} xs={12}>
                <Typography
                  variant="h4"
                  component="h2"
                  className="loginHead m-2"
                >
                  My Payments
                </Typography>
                <div>
                  <Paper sx={{ width: "100%", overflow: "hidden" }} className="payments_paper">
                    <TableContainer sx={{ maxHeight: 525 }}>
                      <Table stickyHeader aria-label="sticky table">
                        <TableHead>
                          <TableRow>
                            {columns.map((column) => (
                              <TableCell
                                key={column.id}
                                align={column.align}
                                style={{ minWidth: column.minWidth }}
                                className="tableHeading"
                              >
                                {column.label}
                              </TableCell>
                            ))}
                          </TableRow>
                        </TableHead>
                        {rows?.length === 0 ? (
                          <TableBody>
                            <TableRow>
                              <TableCell>No data to display</TableCell>
                            </TableRow>
                          </TableBody>
                        ) : (
                          <TableBody>
                            {rows
                              ?.slice(
                                page * rowsPerPage,
                                page * rowsPerPage + rowsPerPage
                              )
                              ?.map((row) => {
                                return (
                                  <TableRow
                                    hover
                                    role="checkbox"
                                    tabIndex={-1}
                                    key={row.code}
                                  >
                                    {columns?.map((column) => {
                                      const value = row[column.id];
                                      return (
                                        <TableCell
                                          key={column.id}
                                          align={column.align}
                                        >
                                          {column.format &&
                                          typeof value === "string"
                                            ? column.format(value)
                                            : value}
                                        </TableCell>
                                      );
                                    })}
                                  </TableRow>
                                );
                              })}
                          </TableBody>
                        )}
                      </Table>
                    </TableContainer>
                    <TablePagination
                      rowsPerPageOptions={[10, 25, 100]}
                      component="div"
                      count={rows?.length}
                      rowsPerPage={rowsPerPage}
                      page={page}
                      onPageChange={handleChangePage}
                      onRowsPerPageChange={handleChangeRowsPerPage}
                    />
                  </Paper>
                </div>
              </Grid>
            </Grid>
          </Box>
        </Grid>
        <Modal
          open={open}
          onClose={handleClose}
          aria-labelledby="parent-modal-title"
          aria-describedby="parent-modal-description"
        >
         
          <Box sx={{ ...style, width: 600 }}>
          {Message ? (<h3>Refund request already applied.</h3>) :(
            <div className="refund_popup_screen">
            <h2 className="parent-modal-title mb-3 reason_apply_title">Reason to Apply Refund</h2>
            <div className="parent-modal-container">
              <input
                type="textarea"
                className="parent-modal-description nobrdr_inpt"
                name="reason"
                onChange={(e) => setreason(e.target.value)}
                placeholder="Reason"
              />
              <button className="modal-button refund_modal_button" onClick={() => ApplyRefund()}>
                Submit
              </button>
            </div>
            </div>
            )}
          </Box>
        </Modal>
      </Grid>
    </>
  );
};

export default MyPayments;
