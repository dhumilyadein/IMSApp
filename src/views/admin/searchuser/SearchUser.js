import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText,Label, Row, Table } from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import axios from "axios";

class SearchUser extends Component {

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
  e.preventDefault();
  console.log(this.state);
  axios
    .post("http://localhost:8001/api/register", this.state)
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
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  render() {
    return (
      <div >
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="10">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form>
                    <h1>Search Users</h1>
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

                    {this.state.errors &&
                      this.state.errors.email && (
                        <font color="red">  <p>{this.state.errors.email.msg}</p></font>
                      )}

                     <InputGroup className="mb-2">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-badge"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input name="roles"
                            id="roles"
                            type="select"


                             >
                            <option value="0">Select Role</option>
                        <option value="1">Admin</option>
                        <option value="2">Teacher</option>
                        <option value="3">Student</option>
                        <option value="3">Parent</option>
                        <option value="3">All</option>
                      </Input>
                  </InputGroup>


                  <InputGroup className="mb-2">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-flag"></i>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input name="status"
                            id="status"
                            type="select"


                             >
                            <option value="0">Select status</option>
                        <option value="1">Active</option>
                        <option value="2">Obsolete</option>
                        <option value="3">All</option>
                      </Input>
                  </InputGroup>



                    <Button color="success" block>Search</Button>
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

export default SearchUser;
