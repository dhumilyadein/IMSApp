import React, { Component } from "react";
import axios from "axios";
import {
  Button,
  Card,
  CardBody,
  CardGroup,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row
} from "reactstrap";

class Login extends Component {
  constructor(props) {
    super(props);
    this.state = {
      password: "",
      email: "",
      role: "admin",
      error: null,
      valerrors: null
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  /**
   * @description Handles the form submit request
   * @param {*} e
   */
  submitHandler(e) {

    console.log("submitHandler ENTER");

    e.preventDefault();

    axios.post("http://localhost:8001/api/login", this.state).then(res => {

      console.log("response - " + JSON.stringify(res.data));
      console.log("response errors - " + res.data.errors);
      console.log("response message - " + res.data.message);

      if (res.data.error) {
        return this.setState({ error: res.data.message });
      }  if (res.data.errors) {
        return this.setState({ valerrors: res.data.errors });
      }

      console.log("Number of roles - " + res.data.userData.role.length + " Roles - " + res.data.userData.role);

      if (res.data.userData.role.length === 1) {

        if(res.data.userData.role == 'admin') {

          console.log('redirecting to registeruser page');
          return (window.location = "/#/admin/registeruser");
        } else {
          return (window.location = "/#/Dashboard");
        }
      } else if (res.data.userData.role.length > 1) {
        return (window.location = "/#/Dashboard");
      } else {
        return (window.location = "/#/Dashboard");
      }

      res.data.userData.role.forEach(function (role) {
        console.log(role);
      });
      //return (window.location = "/AdminPage");
    });
  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }



  render() {
    return (
      <div className="app flex-row align-items-center">
        <Container>
          <Row className="justify-content-center">
            <Col md="8">
              <CardGroup>
                <Card className="p-4">
                  <CardBody>
                    <Form onSubmit={this.submitHandler}>
                      <h1>IMS Login</h1>
                      <p className="text-muted">Sign In to your account</p>
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-user" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          name="username"
                          id="username"
                          placeholder="Username"
                          autoComplete="username"
                          onChange={this.changeHandler}
                        />
                      </InputGroup>
                      <InputGroup className="mb-4">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <i className="icon-lock" />
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="password"
                          placeholder="Password"
                          name="password"
                          id="password"
                          autoComplete="current-password"
                          onChange={this.changeHandler}
                        />
                      </InputGroup>
                      <Row className="justify-content-center">
                        {!this.state.error && (
                          <p line-height className="text-muted">******</p>
                        )}
                        {this.state.error && (
                          <p>
                            <font color="red">{this.state.error}</font>
                          </p>
                        )}
                      </Row>
                      <Row>
                        <Col xs="6">
                          <Button
                            color="primary"
                            className="px-4"
                            type="submit"
                          >
                            Login
                          </Button>
                        </Col>
                        <Col xs="6" className="text-right">
                          <Button color="link" className="px-0">
                            Forgot password?
                          </Button>
                        </Col>
                      </Row>
                    </Form>
                  </CardBody>
                </Card>
                <Card
                  className="text-white bg-primary py-5 d-md-down-none"
                  style={{ width: 44 + "%" }}
                >
                  <CardBody className="text-center">
                    <div>
                      <h2>Sign up</h2>
                      <p>Please contact your Administrator for Registration</p>
                      <Button color="primary" className="mt-3" active>
                        Register Now!
                      </Button>
                    </div>
                  </CardBody>
                </Card>
              </CardGroup>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default Login;
