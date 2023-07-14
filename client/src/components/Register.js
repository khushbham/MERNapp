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

function Register() {
    const [activeTab, setActiveTab] = useState('1');
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
                       <h2 className="text-center">Create account</h2>

                       <Nav tabs className="reg-tab">
        <NavItem>
          <NavLink className={activeTab == '1' ? 'active' : ''} onClick={() => setActiveTab('1')}>
            Student
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink className={activeTab == '2' ? 'active' : ''} onClick={() => setActiveTab('2')}>
            Teacher
          </NavLink>
        </NavItem>
      </Nav>
      <TabContent activeTab={activeTab} className="reg-cnt">
        <TabPane tabId="1">
        <div className="input-group mb-3 mt-3">
        <span className="input-group-text" id="basic-Mobile"><FaMobileAlt/></span>
        <input type="text" className="form-control" placeholder="Phone number" aria-label="Mobile" aria-describedby="basic-Mobile" />
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text" id="password"><IoMdLock/></span>
        <input type="text" className="form-control" placeholder="Password" aria-label="Password" aria-describedby="password" />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="confirmpassword"><IoMdLock/></span>
        <input type="text" className="form-control" placeholder="Confirm Password" aria-label="confirmpassword" aria-describedby="confirmpassword" />
      </div>
      <div className="form-check chk-sct">
  <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" defaultChecked />
  <label className="form-check-label" htmlFor="flexCheckChecked">
  <p className="accpt-txt">Accept <Link to="/">terms & conditions</Link></p>
  </label>
</div>
<div className="mt-3">
<Link className="create-btn" to="/">Sign up</Link>
</div>
        </TabPane>
        <TabPane tabId="2">
        <div className="input-group mb-3 mt-3">
        <span className="input-group-text" id="basic-Mobile"><FaMobileAlt/></span>
        <input type="text" className="form-control" placeholder="Teacher Phone number" aria-label="Mobile" aria-describedby="basic-Mobile" />
      </div>

      <div className="input-group mb-3">
        <span className="input-group-text" id="password"><IoMdLock/></span>
        <input type="text" className="form-control" placeholder="Teacher Password" aria-label="Password" aria-describedby="password" />
      </div>
      <div className="input-group mb-3">
        <span className="input-group-text" id="confirmpassword"><IoMdLock/></span>
        <input type="text" className="form-control" placeholder="Teacher  Confirm Password" aria-label="confirmpassword" aria-describedby="confirmpassword" />
      </div>
      <div className="form-check chk-sct">
  <input className="form-check-input" type="checkbox" value="" id="flexCheckChecked" defaultChecked />
  <label className="form-check-label" htmlFor="flexCheckChecked">
  <p className="accpt-txt">Accept <Link to="/">terms & conditions</Link></p>
  </label>
</div>
<div className="mt-3">
<Link className="create-btn" to="/">Sign up</Link>
</div>
        </TabPane>
      </TabContent>
                      
                       <div className="cont-txt">
                       <p className="alrdy"> Already have an account? <Link  to="/">  Log in</Link> </p>
                       </div>
                    </div>
                 </Col>
                </Row>
            </Container>
        </div>
        </div>
      );

}

export default Register;