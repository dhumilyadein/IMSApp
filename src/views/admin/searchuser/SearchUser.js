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
import { Redirect } from 'react-router-dom';
import Suggestions from './Suggestions';
import MaterialUIAutocomplete from './MaterialUIAutocomplete/MaterialUIAutocomplete';

class SearchUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      find: null,
      using: "username",
      role: "student",
      searchCriteria: "equalsSearchCriteria",
      status: null,
      erorrs: null,
      success: null,
      userdata: null,
      redirectSearchUserToUsers: false,

      query: '',
      results: []
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

    // axios.post("http://localhost:8001/api/searchUsers", this.state).then(res => {
    //   console.log("response - " + JSON.stringify(res.data));
    //   console.log("res.data.errors - " + res.data.errors);
    //   console.log("res.data.message - " + res.data.message);
    //   console.log("res.data.error - " + res.data.errors);

    //   if(res.data.errors) {
    //   return this.setState({ errors: res.data.errors });
    //   } else {

    //     this.props.history.push("/users");

    //   }
    // });
  }


  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {

    // this.setState(
    //   {
    //     [e.target.name]: e.target.value
    //   },

    // );

    this.setState({
      query: this.search.value
    }, () => {
      if (this.state.query && this.state.query.length > 1) {
        if (this.state.query.length % 2 === 0) {
          //this.getInfo()
          this.state.results.push({ "id": "1", "name": "kapil" });
        }
      } else if (!this.state.query) {
      }
    });
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

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText  >
                          <b>Find</b>
                        </InputGroupText>
                      </InputGroupAddon>
                      <MaterialUIAutocomplete />

                      {/*}        <input
          placeholder="Search for..."
          ref={input => this.search = input}
          onChange={this.changeHandler}
        />*?}

                          {/*<Input
                            type="text"
                            name="find"
                            id="find"
                            autoComplete="find"
                            placeholder="Enter Search text"
                            onChange={this.changeHandler}
                          />
                          */}
                    </InputGroup>
                    {this.state.errors &&
                      this.state.errors.find && (
                        <div className="mb-4"><font color="red"><p>{this.state.errors.find.msg}</p></font></div>
                      )}

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <b>Using</b>
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="using"
                        id="using"
                        type="select"
                        onChange={this.changeHandler}
                      >


                        <option value="username">User Name</option>
                        <option value="firstname">First Name</option>
                        <option value="lastname">Last Name</option>
                        <option value="email">Email</option>
                      </Input>
                    </InputGroup>

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <b>in Role</b>
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

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <b>Search Criteria</b>
                        </InputGroupText>
                      </InputGroupAddon>

                      <Col md="9">
                        <FormGroup check inline>
                          <Input className="form-check-input"
                            type="radio"
                            id="searchCriteria"
                            name="searchCriteria"
                            value="equalsSearchCriteria"
                            onChange={this.changeHandler}
                            defaultChecked />
                          <Label className="form-check-label"
                            check htmlFor="equalsSearchCriteria">Equals</Label>
                        </FormGroup>
                        <FormGroup check inline>
                          <Input className="form-check-input"
                            type="radio"
                            id="searchCriteria"
                            name="searchCriteria"
                            value="containsSearchCriteria"
                            onChange={this.changeHandler} />
                          <Label className="form-check-label"
                            check htmlFor="containsSearchCriteria">Contains</Label>
                        </FormGroup>
                      </Col>

                    </InputGroup>

                    {/*{this.renderRedirect()} */}
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
