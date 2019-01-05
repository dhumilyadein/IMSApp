import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ReactPhoneInput from "react-phone-input-2";
import DatePicker from 'react-date-picker';
import classnames from 'classnames';
import Select from 'react-select';

import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Table
} from "reactstrap";
import axios from "axios";

var imageContext = require.context('../../../photoTemp', true);

const whiteTextFieldStyle = {
  background: "white"
}

class ClassDetails extends Component {

  constructor(props) {

    super(props);

    this.state = {
      

    };

    //this.getExistingTemplates = this.getExistingTemplates.bind(this);

  }

  render() {


    return (
      <div>
        <Container >
        <Row>
            <Col>

          {/* <Card class="col-md-4">
              <CardHeader>
                <strong>Select a Class</strong>
              </CardHeader>
              <CardBody> */}


<Row className="align-items-center" className="mb-3" >
                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                      <Button 
                        //onClick={this.submitHandler}
                          block color="info"
                        > <h4> LKG </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> UKG </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                      <Button 
                        //onClick={this.submitHandler}
                          block color="info"
                        > <h4> I </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> II </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> III </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                      <Button 
                        //onClick={this.submitHandler}
                          block color="info"
                        > <h4> IV </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> V </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> VI </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                      <Button 
                        //onClick={this.submitHandler}
                          block color="info"
                        > <h4> VII </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> VIII </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> IX </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                      <Button 
                        //onClick={this.submitHandler}
                          block color="info"
                        > <h4> X </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> XI </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button 
                        //onClick={this.resetForm} 
                        block color="info">
                        <h4> XII </h4>
                        </Button>
                      </Col>
                    </Row>
              
{/* <Table responsive bordered>
                  <thead>
                  <tr style="width: 100px; height: 200px;">
                    <th>Username</th>
                    <th>Date registered</th>
                    <th>Role</th>
                  </tr>
                  </thead>
                  <tbody>
                  <tr>
                    <td>Pompeius René</td>
                    <td>2012/01/01</td>
                    <td>Member</td>
                  </tr>
                  <tr>
                    <td>Paĉjo Jadon</td>
                    <td>2012/02/01</td>
                    <td>Staff</td>
                  </tr>
                  <tr>
                    <td>Micheal Mercurius</td>
                    <td>2012/02/01</td>
                    <td>Admin</td>
                  </tr>
                  <tr>
                    <td>Ganesha Dubhghall</td>
                    <td>2012/03/01</td>
                    <td>Member</td>
                  </tr>
                  <tr>
                    <td>Hiroto Šimun</td>
                    <td>2012/01/21</td>
                    <td>Staff</td>
                  </tr>
                  </tbody>
                </Table> */}


              {/* <Row className="justify-content-center" lg="2">
                <Col md="10">
                <Button size="lg">I</Button>
                <Button size="lg" >II</Button>
                <Button size="lg">IIsdfdsfdI</Button>
                </Col>
              </Row> */}

              {/* <ButtonGroup vertical size="lg" block>

                <ButtonGroup >
                  <Button onclick={console.log('Printing Printing')}>UKG</Button>
                  <Button >LKG</Button>
                </ButtonGroup>
                <ButtonGroup >
                  <Button onclick={console.log('Printing Printing')}>I</Button>
                  <Button >II</Button>
                </ButtonGroup>
                </ButtonGroup> */}

              {/* </CardBody>
            </Card> */}

            </Col>
        </Row>
          
        </Container>
      </div>
    );
  }
}

export default ClassDetails;
