import React, { Component } from 'react';
import { Badge, Card, CardBody, CardHeader, Col, Row, Table } from 'reactstrap';

import usersData from './UsersData'

function capitalizeFirstLetter(string) {
  return string.charAt(0).toUpperCase() + string.slice(1);
}

function UserRow(props) {
  const user = props.user
  const userLink = `#/users/${user.id}`

  const getBadge = (status) => {
    return status === 'Active' ? 'success' :
      status === 'Inactive' ? 'secondary' :
        status === 'Pending' ? 'warning' :
          status === 'Banned' ? 'danger' :
            'primary'
  }

  return (
    <tr key={user.username}>
        <th scope="row"><a href={userLink}>{user.username}</a></th>
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

                    {this.props.location.state.map((user, index) =>
                      <UserRow key={index} user={user}/>
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
