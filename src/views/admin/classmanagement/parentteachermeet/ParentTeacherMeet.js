import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";

import {
  Button,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Table
} from "reactstrap";
import axios from "axios";

import './ptmclassmanagementcss/index.css';
import Agenda from './ptmagenda/agenda.js'


class ParentTeacherMeet extends Component {

  constructor(props) {

    super(props);

    this.state = {

      classesView: true,
      sectionView: false,

      classesAndSections: [],
      classDetails: {},
      classes: [],
      class: "",
      section: "",
      sectionArray: [],
      studentsDataArray: [],

      tempArray: ["kapil", "mayank"],

      pTMeetScheduleView: false,
      subjectArray: [],
      pTMeetScheduleArray: [],
      emailArray: [],
      teachersDetailsArray: []

    };

    this.fetchAllClassesAndSections = this.fetchAllClassesAndSections.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.fetchClassSpecificDetails = this.fetchClassSpecificDetails.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.fetchAllTeachersSpecificDetails = this.fetchAllTeachersSpecificDetails.bind(this);

    // Fetching class details on page load
    this.fetchAllClassesAndSections();

  }

  /**
   * Fetches all the classes and section details and nothing else
   */
  fetchAllClassesAndSections() {

    axios.get("http://localhost:8001/api/fetchAllClassesAndSections").then(cRes => {

      console.log("ClassFeeTemplate - fetchAllClassesAndSections - cRes.data - " + JSON.stringify(cRes.data));

      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ classesAndSections: cRes.data }, () => {

          console.log('ParentTeacherMeet - fetchAllClassesAndSections - All class details - ' + JSON.stringify(this.state.classesAndSections));

          // Fetching unique classes from the classesAndSections 
          this.fetchClasses();
        });

      }
    });
  }

  async fetchClassSpecificDetails(classStr, sectionStr) {

    this.setState({
      subjectArray: [],
      pTMeetScheduleArray: [],
      pTMeetScheduleView: false,
      emailArray: []
    });

    var fetchClassSpecificDetailsRequest = {
      "class": this.state.class,
      "section": this.state.section,
      "subjects": 1,
      "pTMeetSchedule": 1,
      "studentsData": 1
    }

    console.log("ParentTeacherMeet - fetchClassSpecificDetails - fetchClassSpecificDetailsRequest - "
      + JSON.stringify(fetchClassSpecificDetailsRequest));

    await axios.post("http://localhost:8001/api/fetchClassSpecificDetails", fetchClassSpecificDetailsRequest).then(res => {

      if (res.data.errors) {

        console.log('ParentTeacherMeet - fetchClassSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
        return this.setState({ errors: res.data.errors });
      } else {

        this.setState({ classDetails: res.data }, () => {

          console.log('ParentTeacherMeet - fetchClassSpecificDetails - All class details classDetails - ' + JSON.stringify(this.state.classDetails));

          var studentsemailArray = [];
          var parentsemailArray = [];
          this.state.classDetails.studentsData.forEach(element => {
            studentsemailArray.push(element["email"]);
            parentsemailArray.push(element["parentemail"]);
          });

          console.log();

          var emailArray = studentsemailArray.concat(parentsemailArray);

          // Fetching Teachers details
          var fetchAllTeachersSpecificDetailsRequest = {
            "username":"1",
            "firstname":"1",
            "lastname":"1",
            "email":"1",
            "userid":"1"
          }
      
          axios.post("http://localhost:8001/api/fetchAllTeachersSpecificDetails", fetchAllTeachersSpecificDetailsRequest).then(res => {
      
            if (res.data.errors) {
      
              console.log('ParentTeacherMeet - fetchAllTeachersSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
              return this.setState({ errors: res.data.errors });
            } else {
      
              this.setState({ 
                teachersDetailsArray: res.data,
                pTMeetScheduleView: true,
                subjectArray: this.state.classDetails.subjects,
                pTMeetScheduleArray: this.state.classDetails.pTMeetSchedule,
                emailArray: emailArray 
              }, () => {

                console.log("ParentTeacherMeet - fetchClassSpecificDetails - subjectArray - " + this.state.subjectArray
                + " pTMeetScheduleArray - " + JSON.stringify(this.state.pTMeetScheduleArray)
                + " teachersDetailsArray - " + JSON.stringify(this.state.teachersDetailsArray));
              });
            }
          });

        });
      }
    });
  }

  /**
   * Fetch all teachers details
   */
  fetchAllTeachersSpecificDetails() {

    var fetchAllTeachersSpecificDetailsRequest = {
      "username":"1",
      "firstname":"1",
      "lastname":"1",
      "email":"1",
      "userid":"1"
    }

    axios.post("http://localhost:8001/api/fetchAllTeachersSpecificDetails", fetchAllTeachersSpecificDetailsRequest).then(res => {

      if (res.data.errors) {

        console.log('ParentTeacherMeet - fetchAllTeachersSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
        return this.setState({ errors: res.data.errors });
      } else {

        this.setState({ teachersDetailsArray: res.data }, () => {
          console.log('ParentTeacherMeet - fetchAllTeachersSpecificDetails - All Teachers details teachersDetailsArray - ' + JSON.stringify(this.state.teachersDetailsArray));
        });
      }
    });
  }

  /**
   * @description - fetches unique classes from the class detail from DB
   */
  fetchClasses() {

    var classArray = [];
    this.state.classesAndSections.forEach(element => {

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

    this.setState({ class: selectedClass });

    var sectionArrayTemp = [];
    this.state.classesAndSections.forEach(element => {
      if (element["class"] === selectedClass) {
        sectionArrayTemp.push(element["section"]);
      }
    });

    // Sorting array alphabetically
    sectionArrayTemp.sort();

    this.setState({ sectionArray: sectionArrayTemp })

    console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp);

    // Switching view to section view
    this.setState({
      sectionView: true,
      pTMeetScheduleView: false,
      section: ""
    });
  }

  async sectionChangeHandler(e) {

    var section = e.currentTarget.value;

    await console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + section);

    this.setState({ section: section }, () => {

      this.fetchClassSpecificDetails();

    });

    // var studentsDataArrayTemp = null;
    // this.state.classDetails.forEach(element => {
    //   if (element["class"] === this.state.class && element["section"] === section) {
    //     studentsDataArrayTemp = element["studentsData"];
    //   }
    // });

    // studentsDataArrayTemp.sort();

    // this.setState({ studentsDataArray: studentsDataArrayTemp })

    // console.log("sectionButtonClickHandler - Selected class - " + this.state.class +
    //   " selected Section - " + this.state.section
    //   + " selected usernames - " + studentsDataArrayTemp);

    // Switching view to pTMeetScheduleView Parent Teacher Meet View
  }

  render() {

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

          {this.state.studentsView && this.state.class && this.state.sectionArray && this.state.studentsDataArray && (

            <div className="animated fadeIn">

              <Row>
                <Col>
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i> Students <small className="text-muted">Listing Class Students</small>
                    </CardHeader>
                    <CardBody>

                      <Table responsive hover>
                        <thead>
                          <tr>
                            <th scope="col" width="20%">Roll Number</th>
                            <th scope="col">Full name</th>
                            <th scope="col">Username</th>
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
                              </tr>
                            )
                          }

                        </tbody>
                      </Table>

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          )}

          {this.state.pTMeetScheduleView && (

            <div>
              <Agenda subjects={this.state.subjectArray} selectedClass={this.state.class}
                selectedSection={this.state.section} pTMeetSchedule={this.state.pTMeetScheduleArray}
                sectionArray={this.state.sectionArray} emailArray={this.state.emailArray}
                teachersDetailsArray={this.state.teachersDetailsArray} />

            </div>
          )}

        </Container>
      </div>
    );
  }
}

export default ParentTeacherMeet;
