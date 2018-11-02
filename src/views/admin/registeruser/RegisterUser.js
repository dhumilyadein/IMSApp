import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Table } from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import axios from "axios";

class RegisterUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      fistName: null,
      lastName: null,
      password: null,
      repeatPassword: null,
      role: null,
      errors: null
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

    axios.post("http://localhost:8001/api/register", this.state).then(res => {

      console.log("response - " + JSON.stringify(res.data));
      console.log("response errors - " + res.data.errors);
      console.log("response message - " + res.data.message);

      if (res.data.error) {
        return this.setState({ error: res.data.message });
      } if (res.data.errors) {
        return this.setState({ valerrors: res.data.errors });
      }

      console.log("Number of roles - " + res.data.userData.role.length + " Roles - " + res.data.userData.role);

      if (res.data.userData.role.length === 1) {

        if (res.data.userData.role == 'admin') {

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
      <div >
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="7">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Register</h1>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                        name="username"
                        id="username"
                        placeholder="Username"
                        autoComplete="username"
                        onChange={this.changeHandler} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>F</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                        name="firstName"
                        id="firstName"
                        placeholder="First Name"
                        autoComplete="firstName"
                        onChange={this.changeHandler} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>L</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                        name="lastName"
                        id="lastName"
                        placeholder="Last Name"
                        autoComplete="lastName"
                        onChange={this.changeHandler} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                        name="email"
                        id="email"
                        placeholder="Email"
                        autoComplete="email"
                        onChange={this.changeHandler} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        autoComplete="new-password"
                        onChange={this.changeHandler} />
                    </InputGroup>
                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="password"
                        name="repeatPassword"
                        id="repeatPassword"
                        placeholder="Repeat password"
                        autoComplete="new-password"
                        onChange={this.changeHandler} />
                    </InputGroup>

                    <Card className="mx-1">
                      <CardBody className="p-2">
                        <InputGroup className="mb-2">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-badge"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input name="roles"
                            id="roles"
                            type="text"
                            defaultValue="Select User Roles"
                            autoComplete="role"
                            readOnly="true" />
                        </InputGroup>

                        <Table responsive size="sm" hover>
                          <tbody>
                            <tr>
                              <td>
                                Admin
                    </td>
                              <td>
                                <AppSwitch
                                  name="adminSwitch"
                                  id="adminSwitch"
                                  className={'mx-1'} variant={'3d'} color={'primary'} size={'sm'}
                                  onChange={this.changeHandler} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Teacher
                    </td>
                              <td>
                                <AppSwitch
                                  name="teacherSwitch"
                                  id="teacherSwitch"
                                  className={'mx-1'} variant={'3d'} color={'primary'} size={'sm'}
                                  onChange={this.changeHandler} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Student
                    </td>
                              <td>
                                <AppSwitch
                                  name="studentSwitch"
                                  id="studentSwitch"
                                  className={'mx-1'} variant={'3d'} color={'primary'} checked size={'sm'}
                                  onChange={this.changeHandler} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Parent
                    </td>
                              <td>
                                <AppSwitch
                                  name="parentSwitch"
                                  id="parentSwitch"
                                  className={'mx-1'} variant={'3d'} color={'primary'} size={'sm'}
                                  onChange={this.changeHandler} />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                    <Button color="success" block>Create Account</Button>
                  </Form>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default RegisterUser;
