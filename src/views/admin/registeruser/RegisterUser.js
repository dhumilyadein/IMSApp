import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, Input, InputGroup, InputGroupAddon, InputGroupText, Row, Table } from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import axios from "axios";

class RegisterUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      fistname: null,
      lastname: null,
      password: null,
      password_con: null,
      role: ["student"],

      errors: null
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.roleHandler = this.roleHandler.bind(this);
  }



  /**
 * @description Handles the form submit request
 * @param {*} e
 */
submitHandler(e) {
  e.preventDefault();
  console.log(this.state);
  axios
    .post("http://localhost:8080/api/register", this.state)
    .then(result => {
      if (result.data.errors) {
        return this.setState(result.data);
      }
      return this.setState({
        userdata: result.data,
        errors: null,
        success: true
      });
    });
}

  /**
     * @description Called when the change event is triggered.
     * @param {*} e
     */
  changeHandler(e) {
    console.log(e.target.name + " - " + e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    });
  }

 /**
     * @description Called when the role(s) are selected.
     * @param {*} e
     */
  roleHandler(e) {

    if(e.target.checked && this.state.role.indexOf(e.target.name)===-1)
    {console.log("in iF");
      this.setState({role:this.state.role.concat(e.target.name)})
  }

  else if(e.target.checked!=true)
  this.setState({role:this.state.role.splice(this.state.role.indexOf(e.target.name),1)})

    console.log(this.state.role);

  }


  render() {
    return (
      <div >
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="10">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form >
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
                        <InputGroupText>
                         <i className="icon-menu"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="First Name"
                        autoComplete="firstname"
                        onChange={this.changeHandler} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                        <i className="icon-menu"></i>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                        name="lastname"
                        id="lastname"
                        placeholder="Last Name"
                        autoComplete="lastname"
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
                        name="password_con"
                        id="password_con"
                        placeholder="Confirm Password"
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
                          <Input
                            type="label"
                            defaultValue="Select User Roles"
                            autoComplete="role"
                            disabled="disabled"
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
                                  name="admin"
                                  id="admin"
                                  className={'mx-1'} variant={'3d'} color={'primary'} size={'sm'}
                                  onChange={this.roleHandler}
                                   />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Teacher
                    </td>
                              <td>
                                <AppSwitch
                                  name="teacher"
                                  id="teacher"
                                  className={'mx-1'} variant={'3d'} color={'primary'} size={'sm'}
                                  onChange={this.roleHandler} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Student
                    </td>
                              <td>
                                <AppSwitch
                                  name="student"
                                  id="student"

                                  className={'mx-1'} variant={'3d'} color={'primary'} checked size={'sm'}
                                  onChange={this.roleHandler} />
                              </td>
                            </tr>
                            <tr>
                              <td>
                                Parent
                    </td>
                              <td>
                                <AppSwitch
                                  name="parent"
                                  id="parent"


                                  className={'mx-1'} variant={'3d'} color={'primary'} size={'sm'}
                                  onChange={this.roleHandler} />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                    <h1>hi</h1>
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
