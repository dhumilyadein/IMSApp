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

      classesView: true,
      sectionView: false,
      studentsView: false,

      classDetails: {},
      classes: [],
      selectedClass: "",
      sectionArray: [],
      studentsDataArray: [],

      tempArray : ["kapil", "mayank"]

    };

    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.classButtonClickHandler = this.classButtonClickHandler.bind(this);
    this.sectionButtonClickHandler = this.sectionButtonClickHandler.bind(this);

    // Fetching class details on page load
    this.fetchClassDetails();

  }

  fetchClassDetails() {

    axios.get("http://localhost:8001/api/fetchAllClassDetails").then(cRes => {

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

  classButtonClickHandler(e) {

    var selectedClass = e.currentTarget.value;
    console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + selectedClass);
    this.setState({ selectedClass: selectedClass });

    var sectionArrayTemp = [];
    this.state.classDetails.forEach(element => {
      if (element["class"] === selectedClass) {
        sectionArrayTemp.push(element["section"]);
      }
    });

    // Sorting array alphabetically
    sectionArrayTemp.sort();

    this.setState({ sectionArray: sectionArrayTemp })

    console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp);

    // Switching view to section view
    this.setState({ classesView: false });
    this.setState({ sectionView: true });
  }

  sectionButtonClickHandler(e) {

    var selectedSection = e.currentTarget.value;
    console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + selectedSection);
    this.setState({ selectedSection: selectedSection });

    var studentsDataArrayTemp = null;
    this.state.classDetails.forEach(element => {
      if (element["class"] === this.state.selectedClass && element["section"] === selectedSection) {
        studentsDataArrayTemp = element["studentsData"];
      }
    });

    // Sorting array alphabetically
    //studentsDataArrayTemp.sort();

    this.setState({ studentsDataArray: studentsDataArrayTemp })

    console.log("sectionButtonClickHandler - Selected class - " + this.state.selectedClass +
      " selected Section - " + selectedSection
      + " selected usernames - " + studentsDataArrayTemp);

    // Switching view to students view
    this.setState({ sectionView: false });
    this.setState({ studentsView: true });
  }


  render() {

    // const students = this.state.studentsDataArray.map(student => {

    //   console.log("this.state.studentsDataArray - " + this.state.studentsDataArray 
    //   + "tempArray - " + this.state.tempArray
    //   + " student - " + student);
    //   return (

    //       <tr key={student}>
            
    //         <td>{student.rollno}</td>
    //         <td>{student.firstname = student.lastname}</td>
    //         <th scope="row">

    //             <a href="#">{student}</a>

    //         </th>
    //         {/* <td>{user.role}</td> */}
    //         <td>
    //           Active
    //         </td>
    //       </tr>
    //   )
    // })

    return (
      <div>
        <Container >


          {this.state.classesView && (
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Classes <small className="text-muted">Select a Class</small>
              </CardHeader>
              <CardBody>
                <Row>
                  <Col>


                    <Row className="align-items-center" className="mb-3" >

                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        {this.state.classes && this.state.classes.includes("LKG") && (
                          <Button
                            value="LKG"
                            onClick={this.classButtonClickHandler}
                            block color="info"
                          > <h4> LKG </h4> </Button>
                        )}
                      </Col>

                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <Button
                          name="UKGBtn"
                          onClick={this.classButtonClickHandler}
                          block color="info"
                          hidden={!this.state.classes.includes("LKG")}>
                          <h4> UKG </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <Button
                          name="UKG2Btn"
                          value="UKG2"
                          onClick={this.classButtonClickHandler}
                          block color="info"
                          hidden="true">
                          <h4> UKG2 </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="IBtn"
                          value="I"
                          onClick={this.classButtonClickHandler}
                          block color="warning"
                          hidden={!this.state.classes.includes("I")}
                        > <h4> I </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="IIBtn"
                          value="II"
                          onClick={this.classButtonClickHandler}
                          block color="warning"
                          hidden={!this.state.classes.includes("II")}>
                          <h4> II </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="IIIBtn"
                          value="III"
                          onClick={this.classButtonClickHandler}
                          block color="warning"
                          hidden={!this.state.classes.includes("III")}>
                          <h4> III </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="IVBtn"
                          value="IV"
                          onClick={this.classButtonClickHandler}
                          block color="info"
                          hidden={!this.state.classes.includes("IV")}
                        > <h4> IV </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="VBtn"
                          value="V"
                          onClick={this.classButtonClickHandler}
                          block color="info"
                          hidden={!this.state.classes.includes("V")}>
                          <h4> V </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="VIBtn"
                          value="VI"
                          onClick={this.classButtonClickHandler}
                          block color="info"
                          hidden={!this.state.classes.includes("VI")}>
                          <h4> VI </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="VIIBtn"
                          value="VII"
                          onClick={this.classButtonClickHandler}
                          block color="warning"
                          hidden={!this.state.classes.includes("VII")}
                        > <h4> VII </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="VIIIBtn"
                          value="VIII"
                          onClick={this.classButtonClickHandler}
                          block color="warning"
                          hidden={!this.state.classes.includes("VIII")}>
                          <h4> VIII </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="IXBtn"
                          value="IX"
                          onClick={this.classButtonClickHandler}
                          block color="warning"
                          hidden={!this.state.classes.includes("IX")}>
                          <h4> IX </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="XBtn"
                          value="X"
                          onClick={this.classButtonClickHandler}
                          block color="info"
                          hidden={!this.state.classes.includes("X")}
                        > <h4> X </h4> </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="XIBtn"
                          value="XI"
                          onClick={this.classButtonClickHandler}
                          block color="info"
                          hidden={!this.state.classes.includes("XI")}>
                          <h4> XI </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="XIIBtn"
                          value="XII"
                          onClick={this.classButtonClickHandler}
                          block color="info"
                          hidden={!this.state.classes.includes("XII")}>
                          <h4> XII </h4>
                        </Button>
                      </Col>
                    </Row>

                  </Col>
                </Row>
              </CardBody>
            </Card>
          )}


          {this.state.sectionView && this.state.selectedClass && this.state.sectionArray && (
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Class Sections <small className="text-muted">Select a Class</small>
              </CardHeader>
              <CardBody>

                <Row>
                  <Col>

                    <Row className="align-items-center" className="mb-3" >

                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        {this.state.sectionArray && this.state.sectionArray.includes("A") && (
                          <Button
                            name="A"
                            value="A"
                            onClick={this.sectionButtonClickHandler}
                            block color="info"
                          > <h4> {this.state.selectedClass + " A"} </h4> </Button>
                        )}
                      </Col>

                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <Button
                          name="B"
                          value="B"
                          onClick={this.sectionButtonClickHandler}
                          block color="info"
                          hidden={!this.state.sectionArray.includes("B")}>
                          <h4> {this.state.selectedClass + " B"} </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <Button
                          name="C"
                          value="C"
                          onClick={this.sectionButtonClickHandler}
                          block color="info"
                          hidden={!this.state.sectionArray.includes("C")}>
                          <h4> {this.state.selectedClass + " C"} </h4>
                        </Button>
                      </Col>
                    </Row>

                    <Row className="align-items-center" className="mb-3">
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="D"
                          value="D"
                          onClick={this.sectionButtonClickHandler}
                          block color="info"
                          hidden={!this.state.sectionArray.includes("D")}>
                          <h4> {this.state.selectedClass + " D"} </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="E"
                          value="E"
                          onClick={this.sectionButtonClickHandler}
                          block color="info"
                          hidden={!this.state.sectionArray.includes("E")}>
                          <h4> {this.state.selectedClass + " E"} </h4>
                        </Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl >
                        <Button
                          name="F"
                          value="F"
                          onClick={this.sectionButtonClickHandler}
                          block color="info"
                          hidden={!this.state.sectionArray.includes("F")}>
                          <h4> {this.state.selectedClass + " F"} </h4>
                        </Button>
                      </Col>
                    </Row>

                  </Col>
                </Row>

              </CardBody>
            </Card>
          )}

          {this.state.studentsView && this.state.selectedClass && this.state.sectionArray && this.state.studentsDataArray && (
            <Card>
              <CardHeader>
                <i className="fa fa-align-justify"></i> Students <small className="text-muted">Listing Class Students</small>
              </CardHeader>
              <CardBody>

                <Table responsive hover>
                  <thead>
                    <tr>
                      <th scope="col">Roll Number</th>
                      <th scope="col">Full name</th>
                      <th scope="col">Username</th>
                      <th scope="col">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {/* {userList.map((user, index) =>
                      <UserRow key={index} user={user}/>
                    )} */}

                    {/* {students} */}

                    {
                      this.state.studentsDataArray.map(studentData => 
                        //this.state.tempArray.map(item => 
<tr key={studentData.username}>
  
  <td>{studentData.rollno}</td>
  <td>{studentData.firstname + " " + studentData.lastname}</td>
  <th scope="row">

      <a href="#">{studentData.username}</a>

  </th>
  {/* <td>{user.role}</td> */}
  <td>
  {studentData.status}
  </td>
</tr>
)
                    }

                  </tbody>
                </Table>

              </CardBody>
            </Card>
          )}

        </Container>
      </div>
    );
  }
}

export default ClassDetails;
