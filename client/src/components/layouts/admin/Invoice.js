import React from "react";
import Sidebar from "./Sidebar";
import Header from "./Header";
import Footer from "./Footer";
import { connect } from 'react-redux';
import { MY_PROFILE, SITE_URL } from '../../../actions/types';
import { invoiceDetail } from "../../../actions/transactions";
import Loader from "../loader";
class InvoiceDetails extends React.Component {
    constructor(props) {
        super(props)
        this.state = {
            transactionDetails: null,
        }
    }

    componentDidMount() {
        this.props.invoiceDetail(this.props.match.params.id).then((res) => {
            if (res.success) {
                console.log(res.data);
                this.setState({
                    transactionDetails: res.data
                });
            }
        }).catch((err) => {
            console.error(err);
        });
    }

    render() {
        const { transactionDetails } = this.state;
        if (transactionDetails) {
            return <>
                <div id="wrapper" style={{color:'black'}}>
                    <Sidebar />
                    <div id="content-wrapper" className="d-flex flex-column">
                        <div id="content">
                            <Header />
                            <div className="container-fluid">
                                <div className="card shadow mb-4">
                                    <div className="card-header py-3">
                                        <h6 className="m-0 font-weight-bold text-primary">Invoice Detail</h6>
                                    </div>
                                    <div className="card-body">
                                        <div className="row">
                                            <div className="content-body" style={{ width: '100%', backgroundColor: '#fff' }}>
                                                <div id="invoice-template" className="invoice-template file-export" style={{ padding: '0px 30px', backgroundColor: '#fff' }}>
                                                    <div style={{ minHeight: '620px' }}>
                                                        <div style={{ minWidth: '600px' }}>
                                                            <header style={{ borderBottom: '1px solid #4e73df', paddingBottom: '10px', overflow: 'hidden' }}>
                                                                <div>
                                                                    <div style={{ width: '50%', float: 'left' }}>
                                                                        <img className="student_logo" src={`${SITE_URL}/img/group-6.png`} alt="logo" />
                                                                    </div>
                                                                </div>
                                                            </header>
                                                            <main style={{ paddingBottom: '50px' }}>
                                                                <div style={{ margin: '20px 0', minHeight: '100px' }}>
                                                                    <div style={{ width: '50%', float: 'left', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                                                                        <div>INVOICE TO:</div>
                                                                        <h2 style={{ margin: 0 }}>{transactionDetails[0].name}
                                                                        </h2>
                                                                        <div><a href={`mailto:${transactionDetails[0].email}`}>{transactionDetails[0].email}</a></div>
                                                                        <div>Phone: {transactionDetails[0].phone}</div>
                                                                    </div>
                                                                    <div style={{ textAlign: 'right', width: '50%', float: 'right', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                                                                        <h1 style={{ marginTop: 0, color: '#4e73df' }}>INVOICE #{transactionDetails[0].invoice_id} </h1>
                                                                        <div> Date of Invoice: {transactionDetails[0].billing_date.split('T')[0]}</div>
                                                                    </div>
                                                                </div>
                                                                <table border={0} cellSpacing={0} cellPadding={0} style={{ width: '100%', borderCollapse: 'collapse', borderSpacing: 0, marginBottom: '20px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                                                                    <thead>
                                                                        <tr>
                                                                            <th colSpan={1} style={{ whiteSpace: 'nowrap', fontWeight: 400, fontSize: '16px', padding: '15px', background: '#4e73df', borderBottom: '1px solid #fff', color: '#fff', textAlign: 'center' }}>#</th>
                                                                            <th colSpan={2} style={{ whiteSpace: 'nowrap', fontWeight: 400, fontSize: '16px', padding: '15px', background: '#4e73df', borderBottom: '1px solid #fff', color: '#fff', textAlign: 'center' }}>Item</th>
                                                                            <th colSpan={2} style={{ whiteSpace: 'nowrap', fontWeight: 400, fontSize: '16px', padding: '15px', background: '#4e73df', borderBottom: '1px solid #fff', color: '#fff', textAlign: 'center' }}>Price</th>
                                                                            <th colSpan={2} style={{ whiteSpace: 'nowrap', fontWeight: 400, fontSize: '16px', padding: '15px', background: '#4e73df', borderBottom: '1px solid #fff', color: '#fff', textAlign: 'center' }}>Total</th>
                                                                        </tr>
                                                                    </thead>
                                                                    <tbody>
                                                                        <tr>
                                                                            <td colSpan={1} style={{ textAlign: 'center', whiteSpace: 'nowrap', fontSize: '1.6em', background: '#ddd', padding: '15px', borderBottom: '1px solid #fff' }}>1</td>
                                                                            <td colSpan={2} style={{ textAlign: 'center', whiteSpace: 'nowrap', background: '#ddd', borderBottom: '1px solid #fff', fontSize: '1em', padding: '15px' }}>
                                                                                <h3 style={{ margin: 0, fontWeight: 400, fontSize: '1.2em' }}>{transactionDetails[0].subscription_title}</h3>
                                                                            </td>
                                                                            <td colSpan={2} style={{ textAlign: 'center', background: '#ddd', borderBottom: '1px solid #fff', fontSize: '1em', padding: '15px' }}>${transactionDetails[0].value}</td>
                                                                            <td colSpan={2} style={{ textAlign: 'center', background: '#ddd', borderBottom: '1px solid #fff', fontSize: '1em', padding: '15px' }}>${transactionDetails[0].value}</td>
                                                                        </tr>
                                                                    </tbody>
                                                                    <tfoot>
                                                                        <tr>
                                                                            <td colSpan={3} style={{ textAlign: 'right', background: '0 0', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', border: 'none' }} />
                                                                            <td colSpan={2} style={{ textAlign: 'center', background: '0 0', borderBottom: 'none', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', borderTop: '1px solid #aaa' }}>SUBTOTAL</td>
                                                                            <td style={{ textAlign: 'center', background: '0 0', borderBottom: 'none', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', borderTop: '1px solid #aaa' }}>${transactionDetails[0].value}</td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={3} style={{ textAlign: 'right', background: '0 0', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', border: 'none' }} />
                                                                            <td colSpan={2} style={{ textAlign: 'center', background: '0 0', borderBottom: 'none', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', borderTop: '1px solid #aaa' }}>
                                                                                DISCOUNT
                                                                            </td>
                                                                            <td style={{ textAlign: 'center', background: '0 0', borderBottom: 'none', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', borderTop: '1px solid #aaa' }}>
                                                                                0%
                                                                            </td>
                                                                        </tr>
                                                                        <tr>
                                                                            <td colSpan={3} style={{ textAlign: 'right', background: '0 0', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', border: 'none' }} />
                                                                            <td colSpan={2} style={{ textAlign: 'center', background: '0 0', borderBottom: 'none', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', borderTop: '1px solid #aaa' }}>GRAND TOTAL</td>
                                                                            <td style={{ textAlign: 'center', background: '0 0', borderBottom: 'none', whiteSpace: 'nowrap', padding: '10px 20px', fontSize: '1em', borderTop: '1px solid #aaa' }}>${transactionDetails[0].value}</td>
                                                                        </tr>
                                                                    </tfoot>
                                                                </table>
                                                            </main>
                                                            <footer style={{ width: '100%', textAlign: 'center', color: '#777', borderTop: '1px solid #4e73df', paddingTop: '8px', fontFamily: 'Arial, Helvetica, sans-serif' }}>
                                                                Invoice was created on a computer and is valid without the signature and seal.
                                                            </footer>
                                                        </div>
                                                    </div>
                                                </div>
                                                <div style={{ width: '10%', float: 'right' }}>
                                                    <a href={`${MY_PROFILE}${transactionDetails[0].invoice_link}`} download target='blank'><button class='btn btn-primary'>Download</button></a>
                                                </div>

                                            </div>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>
            </>

        }
        else {
            return <>
                <div style={{ alignSelf: 'center' }}>
                    <Loader />
                </div>
            </>
        }
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
        invoiceDetail
    }
)(InvoiceDetails);