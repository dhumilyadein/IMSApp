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
import MapsTransferWithinAStation from "material-ui/SvgIcon";

var imageContext = require.context('../../../photoTemp', true);

const whiteTextFieldStyle = {
  background: "white"
}

class ClassDetails extends Component {

  constructor(props) {

    super(props);

    this.state = {

      classDetails: {},
      classes: []

    };

    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.buttonClickHandler = this.buttonClickHandler.bind(this);

    // Fetching class details on page load
    this.fetchClassDetails();

  }

  fetchClassDetails() {

    axios.get("http://localhost:8001/api/searchAllClassDetails").then(cRes => {

      if (cRes.data.errors) {
        
        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ classDetails: cRes.data });

        console.log('ClassDetails - fetchClassDetails - All class details - ' + JSON.stringify(this.state.classDetails));

        this.fetchClasses();
      }
    });
  }

  /**
   * @description - fetches unique classes from the class detail from DB
   */
  fetchClasses() {

    var classArray = [];
    this.state.classDetails.forEach(element => {

      console.log("element.class - " + element.class);
      classArray.push(element.class);
    });
    console.log("classArray - " + classArray);
    var uniqueItems = Array.from(new Set(classArray));
    
    this.setState({ classes: uniqueItems });

    console.log("Unique classes - " + this.state.classes);
  }

  buttonClickHandler(e) {

    // this.setState(
    //   {
    //     [e.target.name]: e.target.value
    //   }
    // );
    console.log("e.target.name - " + [e.target.name] + " e.target.value - " + e.target.value);
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
                { this.state.classes && this.state.classes.includes("LKG") && ( 
                  <Button
                    value="LKG"
                    onClick={this.buttonClickHandler}
                    block color="info"
                  > <h4> LKG </h4> </Button>
                  )}
                </Col>
                
                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                  <Button
                  name = "UKGBtn"
                    onClick={this.buttonClickHandler}
                    block color="info"
                    hidden={!this.state.classes.includes("LKG")}>
                    <h4> UKG </h4>
                  </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                  <Button
                  name = "UKG2Btn"
                    value="UKG2"
                    onClick={this.buttonClickHandler}
                    block color="info"
                    hidden="true">
                    <h4> UKG2 </h4>
                  </Button>
                </Col>
              </Row>

              <Row className="align-items-center" className="mb-3">
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "IBtn"
                    value="I"
                    onClick={this.buttonClickHandler}
                    block color="warning"
                    hidden={!this.state.classes.includes("I")}
                  > <h4> I </h4> </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "IIBtn"
                    value="II"
                    onClick={this.buttonClickHandler}
                    block color="warning"
                    hidden={!this.state.classes.includes("II")}>
                    <h4> II </h4>
                  </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "IIIBtn"
                    value="III"
                    onClick={this.buttonClickHandler}
                    block color="warning"
                    hidden={!this.state.classes.includes("III")}>
                    <h4> III </h4>
                  </Button>
                </Col>
              </Row>

              <Row className="align-items-center" className="mb-3">
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "IVBtn"
                    value="IV"
                    onClick={this.buttonClickHandler}
                    block color="info"
                    hidden={!this.state.classes.includes("IV")}
                  > <h4> IV </h4> </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "VBtn"
                    value="V"
                    onClick={this.buttonClickHandler}
                    block color="info"
                    hidden={!this.state.classes.includes("V")}>
                    <h4> V </h4>
                  </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "VIBtn"
                    value="VI"
                    onClick={this.buttonClickHandler}
                    block color="info"
                    hidden={!this.state.classes.includes("VI")}>
                    <h4> VI </h4>
                  </Button>
                </Col>
              </Row>

              <Row className="align-items-center" className="mb-3">
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "VIIBtn"
                    value="VII"
                    onClick={this.buttonClickHandler}
                    block color="warning"
                    hidden={!this.state.classes.includes("VII")}
                  > <h4> VII </h4> </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "VIIIBtn"
                    value="VIII"
                    onClick={this.buttonClickHandler}
                    block color="warning"
                    hidden={!this.state.classes.includes("VIII")}>
                    <h4> VIII </h4>
                  </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "IXBtn"
                    value="IX"
                    onClick={this.buttonClickHandler}
                    block color="warning"
                    hidden={!this.state.classes.includes("IX")}>
                    <h4> IX </h4>
                  </Button>
                </Col>
              </Row>

              <Row className="align-items-center" className="mb-3">
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "XBtn"
                    value="X"
                    onClick={this.buttonClickHandler}
                    block color="info"
                    hidden={!this.state.classes.includes("X")}
                  > <h4> X </h4> </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "XIBtn"
                    value="XI"
                    onClick={this.buttonClickHandler}
                    block color="info"
                    hidden={!this.state.classes.includes("XI")}>
                    <h4> XI </h4>
                  </Button>
                </Col>
                <Col col="6" sm="4" md="2" xl >
                  <Button
                  name = "XIIBtn"
                    value="XII"
                    onClick={this.buttonClickHandler}
                    block color="info"
                    hidden={!this.state.classes.includes("XII")}>
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
