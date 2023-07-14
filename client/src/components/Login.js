import { 
    Container,
    Row, 
    Col, 
    Button, Form, FormGroup, Label, Input,Nav, NavItem, NavLink, TabContent, TabPane, FormControlLabel } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import { useState } from 'react';
import { Link } from 'react-router-dom';
import classnames from 'classnames';
import { FaMobileAlt } from 'react-icons/fa';
import { IoMdLock } from "react-icons/io";

function Login() {
    return (
        <div>
        <div className="register">
            
            <Container className="reg_section">
                <Row>
                 <Col className="reg-left-bnr" md={6}>
                    <div className="left-reg">
                         <img width="100%" height="100%" src="../images/signup.png"/>
                    </div>
                 </Col>
                 <Col className="reg-right-bnr" md={6}>
                    <div className="reg-section">
                       <h2 className="text-center">Log in to your account</h2>
                       <div className="log-form reg-cnt">
                       <div className="input-group mb-3 mt-3">
        <span className="input-group-text" id="basic-Mobile"><FaMobileAlt/></span>
        <input type="text" className="form-control" placeholder="Phone number" aria-label="Mobile" aria-describedby="basic-Mobile" />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="password"><IoMdLock/></span>
        <input type="text" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password" />
      </div>
                        </div>
                        <div className="mb-3">
                        <Link className="forget-pass" to="/">Forgot Password</Link>
                        </div>
                        <div className="login-sct">
                        <Link className="log-btn" to="/">Log in</Link>
                        </div>
                        <div className="mt-5 dot-account">
                        <p>Don’t have an account yet? <Link className="crt-btn" to="/">Create account</Link></p>
                        </div>
                    </div>
                 </Col>
                </Row>
            </Container>
        </div>
        </div>
      );

}

export default Login;