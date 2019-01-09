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

      tempArray: ["kapil", "mayank"]

    };

    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);

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

  classChangeHandler(e) {

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
    this.setState({ sectionView: true });
  }

  sectionChangeHandler(e) {

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



          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Classes <small className="text-muted">Select a Class</small>
            </CardHeader>
            <CardBody>

              <br />
              {this.state.classesView && (
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: "120px" }}>
                      Class
                                </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="class"
                    id="class"
                    type="select"
                    value={this.state.class}
                    onChange={this.classChangeHandler}
                  >
                    <option value="">Select</option>
                    {this.state.classes.map(element => {
                      return (<option key={element} value={element}>{element}</option>);
                    }
                    )}
                  </Input>
                </InputGroup>
              )}

              {this.state.classError && (
                <font color="red">
                  {" "}
                  <p>{this.state.classError}</p>
                </font>
              )}

              {this.state.sectionView && (
                <InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: "120px" }}>
                      Section
                                </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="section"
                    id="section"
                    type="select"
                    value={this.state.section}
                    onChange={this.sectionChangeHandler}
                  >
                    <option value="">Select</option>
                    {this.state.sectionArray.map(element => {
                      return (<option key={element} value={element}>{element}</option>);
                    }
                    )}

                  </Input>
                </InputGroup>
              )}
              {this.state.sectionError && (
                <font color="red">
                  {" "}
                  <p>{this.state.sectionError}</p>
                </font>
              )}

            </CardBody>
          </Card>

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