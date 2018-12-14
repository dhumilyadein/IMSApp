import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';
import axios from "axios";

import usersData from './UsersData'

var studentDetails = {};

function fetchStudentDetails(username) {

  //If page needs to be redirected to AddFee, fetching studentDetails
  var searchStudentsRequest = {
    "find": username,
    "using": "username",
    "searchCriteria": "equalsSearchCriteria"
  }

  console.log("searchStudentsRequest - " + JSON.stringify(searchStudentsRequest));

  axios.post("http://localhost:8001/api/searchStudents", searchStudentsRequest).then(stRes => {

    if (stRes.data.errors) {
      return this.setState({ errors: stRes.data.errors });
    } else {

      console.log("Users.js " + " username - " + username + " student details -  " + JSON.stringify(stRes.data));

      studentDetails = stRes.data;
    }
  });
}

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function UserRow(props) {

  const user = props.user
  const actionTypeForSearchUser = props.actionTypeForSearchUser

  const userLink = `#/admin/userDetails/${user.username}`
  //const addFeeLink = `#/admin/finance/AddFees/${studentDetails}`
  const addFeeLink = `#/admin/finance/AddFees/kapil`

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
            <a href={addFeeLink} onClick={fetchStudentDetails(user.username)}>{user.username}</a>
          )}
          {actionTypeForSearchUser != 'RedirectToAddFee' && (
            <a href={userLink}>{user.username}</a>
          )}
          
        </th>
        <td>{user.firstname + " " + user.lastname}</td>
        <td>{user.createdAt}</td>
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

class Users extends Component {

  constructor(props) {
    super(props);
  }

  render() {

    if(this.props.location.state && this.props.location.state.userDetails) {
      console.log("props.userDetails - " + JSON.stringify(this.props.location.state.userDetails));
    }
    if(this.props.location.state && this.props.location.state.studentDetails) {
      console.log("props.studentDetails - " + JSON.stringify(this.props.location.state.studentDetails));
      }
    if(this.props.location.state && this.props.location.state.actionTypeForSearchUser) {
      console.log("props.actionTypeForSearchUser - " + JSON.stringify(this.props.location.state.actionTypeForSearchUser));
    }

    const userList = usersData.filter((user) => user.id < 10)

    return (
      <div className="animated fadeIn">
        <Row>
          <Col xl={6}>
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Users <small className="text-muted">example</small>
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
                    {/* {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )} */}

                    { this.props.location.state.userDetails.map((user, index) =>
                      <UserRow key={index} user={user} actionTypeForSearchUser={this.props.location.state.actionTypeForSearchUser}/>
                    )}
                    
                  </tbody>
                </Table>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    )
  }
}

export default Users;
