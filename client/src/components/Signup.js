import { Container, Row, Col } from 'reactstrap';
import { Button, Form, FormGroup, Label, Input } from 'reactstrap';
import 'bootstrap/dist/css/bootstrap.min.css';
import '../css/style.css';
import { Link } from 'react-router-dom';

function Signup() {
    return (
        <div>
        <div className="main_signup">
            <Container className="sign_up_section">
                <Row>
                 <Col className="signup-left-bnr" md={6}>
                    <div className="left-side">
                         <img width="100%" height="100%" src="../images/signup.png"/>
                    </div>
                 </Col>
                 <Col className="signup-right-bnr" md={6}>
                    <div className="wht-section">
                       <h3>mern</h3>
                       <h2>Learn anything, anywhere with a live teacher</h2>
                       <p> Our platform lets you take control of your learning experience.</p>
                       
                       <Link className="log-btn" to="/login">Log in</Link>
                       <Link className="sign-btn" to="/register">Sign up</Link>
                       <div className="cont-txt">
                       <Link className="Or-continue" to="/"> Or continue as a guest</Link>
                       </div>
                    </div>
                 </Col>
                </Row>
            </Container>
        </div>
        </div>
      );

}

export default Signup;