import React, { Component } from "react";
import {
  Badge,
  Button,
  Card,
  CardBody,
  CardHeader,
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
import { withRouter } from 'react-router';

var Promise = require('promise');

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function UserRow(props) {

  const user = props.user
  const actionTypeForSearchUser = props.actionTypeForSearchUser

  // console.log("Sending sending studentDetails - " + studentDetails);
  // console.log("Sending sending studentDetails - " + JSON.stringify(studentDetails));

  const userLink = `#/admin/userDetails/${user.username}`;
  const addFeeLink = `#/admin/finance/AddFees/${user.username}`;

  console.log("Users - UserRow - userId - " + userLink); 
  
  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }
  return (
    <tr key={user.username}>
        <th scope="row">

        {actionTypeForSearchUser == 'RedirectToAddFee' && (
            <a href={addFeeLink}>{user.username}</a>
          )}
          {actionTypeForSearchUser != 'RedirectToAddFee' && (
            <a href={userLink}>{user.username}</a>
          )}
          
        </th>
        <td>{capitalizeFirstLetter(user.firstname) + " " + capitalizeFirstLetter(user.lastname)}</td>
        {/* <td>{user.createdAt}</td> */}
        <td>{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
        {/* <td>{user.role}</td> */}
        <td>
        {user.role.map((role, index) =>
                      capitalizeFirstLetter(role) + " "
                    )}
                    </td>
        <td><Badge href={userLink} color={getBadge(user.status)}>{user.status}</Badge></td>
    </tr>
  )
}

class SearchUser extends Component {

  constructor(props) {
    super(props);

    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
    this.selectedItem = this.selectedItem.bind(this);
    this.setActionTypeForSearchUser = this.setActionTypeForSearchUser.bind(this);
    this.backToSearchUser = this.backToSearchUser.bind(this);

    this.state = {
      find: null,
      using: "fullName",
      role: "student",
      searchCriteria: "containsSearchCriteria",
      status: null,
      erorrs: null,
      success: null,
      userdata: null,
      redirectSearchUserToUsers: false,
      searchText: "",

      searchUsersView: true,
      usersView: false,

      chosenSearchValue: null,

      dataSource: [],

      searchBarResponse: null,

      userDetails: null,

      studentDetails: null,

      // Action type for deciding where to redirect
      // Redirect to AddFee page if 'actionTypeForSearchUser' is 'RedirectToAddFee' (which means searchUser request is coming from AddFee page)
      actionTypeForSearchUser: null
    };

  }

  /**
   * @description: Checking action type - which tells from which page request is coming
   */
  setActionTypeForSearchUser() {

    // Checking action type - which tells from which page request is coming
    if (this.props.data) {

      this.setState({
        actionTypeForSearchUser: this.props.data
      });
      console.log("SearchUser AFTER SETTING STATE actionTypeForSearchUser - " + this.state.actionTypeForSearchUser);
    }
  }

  /**
   * Redirect to Search Users page
   */
  backToSearchUser() {

    this.setState({

      find: null,
      using: "fullName",
      role: "student",
      searchCriteria: "containsSearchCriteria",
      status: null,
      erorrs: null,
      success: null,
      userdata: null,
      redirectSearchUserToUsers: false,
      searchText: "",

      searchUsersView: true,
      usersView: false,

      chosenSearchValue: null,

      dataSource: [],

      searchBarResponse: null,

      userDetails: null,

      studentDetails: null,

      // Action type for deciding where to redirect
      // Redirect to AddFee page if 'actionTypeForSearchUser' is 'RedirectToAddFee' (which means searchUser request is coming from AddFee page)
      actionTypeForSearchUser: null
    });
  }

  /**
   * @description Handles the form search request
   * @param {*} e
   */
  async searchHandler(e) {
    console.log("searchHandler ENTER:  " + JSON.stringify(this.state));

    e.preventDefault();

    var searchUserRequest = {
      "find": this.state.find,
      "using": this.state.using,
      "role": this.state.role,
      "searchCriteria": this.state.searchCriteria,
    }
    await axios.post("http://localhost:8001/api/searchUsers", searchUserRequest).then(uRes => {

      if (uRes.data.errors) {

        return this.setState({ errors: uRes.data.errors });

      } else {

        this.setState({ userDetails: uRes.data });

        this.setActionTypeForSearchUser();

        console.log('ADDFEE FLOW RedirectToAddFee userDetails - ' + JSON.stringify(this.state.userDetails)
          + " this.state.actionTypeForSearchUser - " + this.state.actionTypeForSearchUser);

        // Changing the view to users from search Users
        this.setState({
          searchUsersView: false,
          usersView: true
        });

        // this.props.history.push(
        //   {
        //     pathname: '/admin/users',
        //     state: { "actionTypeForSearchUser": this.state.actionTypeForSearchUser, "userDetails": this.state.userDetails }
        //   });
      }
    });
  }

  onUpdateInput(inputValue, datasource, params) {

    if (params.source == 'touchTap' || params.source == 'click') return;

    this.setState({
      find: inputValue,
      searchText: inputValue,
      using: this.state.using
    }, function () {
      this.performSearch();
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

      console.log("search bar request - " + JSON.stringify(this.state));

      axios.post("http://localhost:8001/api/searchUsers", this.state).then(res => {

        if (res.data.errors) {
          return this.setState({ errors: res.data.errors });
        } else {

          var resData = res.data;

          // Setting response data in state so that it can be used in the onclick event of search bar items (selectedItem method)
          this.setState({ searchBarResponse: resData });

          var i = 1;
          res.data.forEach(function (item) {

            let displayText = item.firstname + " " + item.lastname + " (" + item.username + ")";
            fetchedUsernames.push(displayText);

          });

          this.setState({
            dataSource: fetchedUsernames
          });

        }
      });
    }
  }

  /**
   * @description For getting search bar selected value
   */
  async selectedItem(chosenSearchValue, index) {

    var searchBarResponse;
    var selectedUsername;

    this.setState({ chosenSearchValue: chosenSearchValue });

    selectedUsername = chosenSearchValue.split("(")[1].split(")")[0];

    searchBarResponse = this.state.searchBarResponse;

    var tempArrayForUser = [];
    for (var i = 0; i < searchBarResponse.length; i++) {


      if (searchBarResponse[i]["username"].toLowerCase() === String(selectedUsername).toLowerCase()) {

        this.setActionTypeForSearchUser();

        console.log('ADDFEE search bar FLOW RedirectToAddFee userDetails - ' + JSON.stringify(tempArrayForUser)
          + " this.state.actionTypeForSearchUser - " + this.state.actionTypeForSearchUser);

        tempArrayForUser.push(searchBarResponse[i]);

        // Changing the view to users from search Users on autocomplete click
        this.setState({
          searchUsersView: false,
          usersView: true,
          userDetails: tempArrayForUser
        });

        // this.props.history.push(
        //   {
        //     //pathname: '/admin/finance/AddFees',
        //     pathname: '/admin/users',
        //     state: { "actionTypeForSearchUser": this.state.actionTypeForSearchUser, "userDetails": tempArrayForUser }
        //   });

        return searchBarResponse[i];
      }
    }
  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {

    this.setState(
      {
        // find: "",
        // searchText: "",
        [e.target.name]: e.target.value
      }
    );
    console.log("state in react - " + JSON.stringify(this.state));
  }

  render() {

    return (
      <div>
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="10">

              {this.state.searchUsersView && (
                <Card className="mx-4">
                  <CardBody className="p-4">
                    <Form>
                      <h1>Search Users</h1>

                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText  >
                            <b>Find</b>
                          </InputGroupText>
                        </InputGroupAddon>
                        <MuiThemeProvider muiTheme={getMuiTheme()} className="mb-4">
                          <AutoComplete
                            hintText="Enter Search text"
                            dataSource={this.state.dataSource}
                            onUpdateInput={this.onUpdateInput}
                            fullWidth={true}
                            filter={AutoComplete.noFilter}
                            maxSearchResults={5}
                            onNewRequest={this.selectedItem}
                            autoFocus="true"
                            searchText={this.state.searchText}
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

                          <option value="fullName">Full Name</option>
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
                          <option value="anyRole">Any Role</option>
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
                            />
                            <Label className="form-check-label"
                              check htmlFor="equalsSearchCriteria">Equals</Label>
                          </FormGroup>
                          <FormGroup check inline>
                            <Input className="form-check-input"
                              type="radio"
                              id="searchCriteria"
                              name="searchCriteria"
                              value="containsSearchCriteria"
                              onChange={this.changeHandler}
                              defaultChecked />
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
              )}

              {this.state.usersView && (
                <div className="animated fadeIn">
                  <Row>
                    <Col>
                      <Card>
                        <CardHeader>
                          <i className="fa fa-align-justify"></i> Users
                        {/* <small className="text-muted">example</small> */}
                        </CardHeader>
                        <CardBody>
                          <Table responsive hover>
                            <thead>
                              <tr>
                                <th scope="col">Username</th>
                                <th scope="col">Full name</th>
                                <th scope="col">Registeration Date</th>
                                <th scope="col">Role(s)</th>
                                <th scope="col">Status</th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.userDetails.map((user, index) =>
                              <UserRow key={index} user={user}/>
                            )}

                              {/* this.state.userDetails.map((user, index) =>
                                <UserRow key={index} user={user} actionTypeForSearchUser={this.state.actionTypeForSearchUser} />

                                <tr key={user.username}>
                                  <th scope="row">

                                    {actionTypeForSearchUser == 'RedirectToAddFee' && (
                                      <a href={addFeeLink}>{user.username}</a>
                                    )}
                                    {actionTypeForSearchUser != 'RedirectToAddFee' && (
                                      <a href={userLink}>{user.username}</a>
                                    )}
                                  </th>
                                  <td>{capitalizeFirstLetter(user.firstname) + " " + capitalizeFirstLetter(user.lastname)}</td>
                                  <td>{new Date(user.createdAt).toLocaleDateString('en-GB')}</td>
                                  <td>
                                    {user.role.map((role, index) =>
                                      capitalizeFirstLetter(role) + " "
                                    )}
                                  </td>
                                  <td><Badge href={userLink} color={getBadge(user.status)}>{user.status}</Badge></td>
                                </tr>
                              )  */}

                            </tbody>
                          </Table>
                          <br/>
                          <Row>
                            <div className="col-md-9">
                            <Col></Col>
                            </div>
                            <div className="col-md-3">
                            <Col>
                            <Button color="success" block onClick={this.backToSearchUser}>
                        Back To Search
                    </Button>
                            </Col>
                            </div>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  </Row>
                </div>
              )}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default withRouter(SearchUser);
