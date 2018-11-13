import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Table
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import axios from "axios";

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      find: null,
      using: "username",
      role: "student",
      status: null,
      erorrs: null,
      success: null,
      userdata: null
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  /**
   * @description Handles the form search request
   * @param {*} e
   */
  searchHandler(e) {
    console.log("searchHandler ENTER:  " + JSON.stringify(this.state));

    e.preventDefault();

    axios.post("http://localhost:8001/api/search", this.state).then(res => {
      console.log("response - " + JSON.stringify(res.data));
      console.log("response errors - " + res.data.errors);
      console.log("response message - " + res.data.message);

      if (res.data.error) {
        return this.setState({ error: res.data.message });
      }
      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      }
    });
  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {

    this.setState(
      {
        [e.target.name]: e.target.value
      },

    );
  }

  render() {
    return (
      <div>
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
                          <b>Find:</b>
                        </InputGroupText>
                      </InputGroupAddon>

                      <Input
                        type="text"
                        name="find"
                        id="find"
                        autoComplete="find"
                        placeholder="Enter Search text"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>

                    {this.state.errors &&
                      this.state.errors.find && (
                        <font color="red">  <p>{this.state.errors.find.msg}</p></font>
                      )}


                    <InputGroup className="mb-2">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <b>Using:</b>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                      name="using"
                      id="using"
                       type="select"
                       onChange={this.changeHandler}
                       value={this.state.using}>


                        <option value="username">User Name</option>
                        <option value="firstname">First Name</option>
                        <option value="lastname">Last Name</option>
                        <option value="email">Email</option>
                      </Input>
                    </InputGroup>

                    <InputGroup className="mb-2">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <b>in Role:</b>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        id="role"
                        type="select"
                        name="role"
                        value={this.state.role}
                        onChange={this.changeHandler}

                      >

                        <option value="admin">Admin</option>
                        <option value="teacher">Teacher</option>
                        <option value="parent">Parent</option>
                        <option value="student">Student</option>

                      </Input>
                    </InputGroup>

                    <Button color="success" block onClick={this.searchHandler}>
                      Search
                    </Button>
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
