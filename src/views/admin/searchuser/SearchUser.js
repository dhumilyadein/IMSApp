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
import { AutoComplete } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import JSONP from 'jsonp';

var Promise = require('promise');

class SearchUser extends Component {
  constructor(props) {
    super(props);

    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);

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

      dataSource: []
    };

  }

  /**
   * @description Handles the form search request
   * @param {*} e
   */
  searchHandler(e) {
    console.log("searchHandler ENTER:  " + JSON.stringify(this.state));

    e.preventDefault();

    axios.post("http://localhost:8001/api/searchUsers", this.state).then(res => {
      console.log("response - " + JSON.stringify(res.data));
      console.log("res.data.errors - " + res.data.errors);
      console.log("res.data.message - " + res.data.message);
      console.log("res.data.error - " + res.data.errors);

      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      } else {

        this.props.history.push("/users");

      }
    });
  }

  onUpdateInput(inputValue) {
    const self = this;
    this.setState({
      find: inputValue
    }, function () {
      self.performSearch();
    });
  }

  performSearch() {

    var fetchedUsernames = [];

    const googleAutoSuggestURL = `
  //suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=`;

    const
      self = this,
      url = googleAutoSuggestURL + this.state.find;


    if (this.state.find !== '') {

      console.log("response - " + JSON.stringify(this.state));

      axios.post("http://localhost:8001/api/searchUsers", this.state).then(res => {

        console.log("res.data.errors - " + res.data.errors);
        console.log("res.data.message - " + res.data.message);
        console.log("res.data.error - " + res.data.errors);

        if (res.data.errors) {
          return this.setState({ errors: res.data.errors });
        } else {

          //this.props.history.push("/users");
          console.log("final response - " + JSON.stringify(res.data));

          var i = 1;
          res.data.forEach(function (item) {

            console.log("Fetched username - " + item.username);

            fetchedUsernames.push(item.username);

          });

          console.log("Fetched usernames on search - " + fetchedUsernames);

          this.setState({
            dataSource: fetchedUsernames
          });

          console.log("this.state.dataSource - " + this.state.dataSource);
        }
      });

      // JSONP(url, function (error, data) {
      //   let searchResults, retrievedSearchTerms;

      //   if (error) return error;

      //   searchResults = data[1];

      //   retrievedSearchTerms = searchResults.map(function (result) {
      //     return result[0];
      //   });

      //   console.log("autosearch result - " + retrievedSearchTerms);

      //   self.setState({
      //     dataSource: retrievedSearchTerms
      //   });
      // });

    }
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

    console.log("state in react - " + JSON.stringify(this.state));
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
                      <MuiThemeProvider muiTheme={getMuiTheme()}>
                        <AutoComplete
                          hintText="Enter Search text"
                          dataSource={this.state.dataSource}
                          onUpdateInput={this.onUpdateInput}
                          floatingLabelText="Find"
                          fullWidth={true}
                        />
                      </MuiThemeProvider>

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
