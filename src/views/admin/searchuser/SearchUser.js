import React, { Component } from 'react';
import { Button, Card, CardBody, CardFooter, Col, Container, Form, FormGroup, Input, InputGroup, InputGroupAddon, InputGroupText,Label, Row, Table } from 'reactstrap';
import { AppSwitch } from '@coreui/react';
import axios from "axios";

class SearchUser extends Component {

  constructor(props) {
    super(props);
    this.state = {
      username: null,
      firstname: null,
      lastname: null,
     email:null,
      role: null,
      status: null,
      erorrs:null,
      success:null,
      userdata:null
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  /**
 * @description Handles the form search request
 * @param {*} e
 */
searchHandler(e) {

  console.log("searchHandler ENTER");

  e.preventDefault();

  axios.post("http://localhost:8001/api/search", this.state).then(res => {

    console.log("response - " + JSON.stringify(res.data));
    console.log("response errors - " + res.data.errors);
    console.log("response message - " + res.data.message);

    if (res.data.error) {
      return this.setState({ error: res.data.message });
    }  if (res.data.errors) {
      return this.setState({ errors: res.data.errors });
    }


   
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
                    {this.state.errors &&
                      this.state.errors.username && (
                        <font color="red">  <p>{this.state.errors.username.msg}</p></font>
                      )}
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>F</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                        name="firstname"
                        id="firstname"
                        placeholder="First Name"
                        autoComplete="firstName"
                        onChange={this.changeHandler} />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>L</InputGroupText>
                      </InputGroupAddon>
                      <Input type="text"
                        name="lastname"
                        id="lastname"
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
                          <Input name="role"
                            id="role"
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



                    <Button color="success" block onClick={this.searchHandler}>Search</Button>
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
