import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ReactPhoneInput from "react-phone-input-2";
import DatePicker from 'react-date-picker';
import classnames from 'classnames';
import Select from 'react-select';
import moment from 'moment';

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

class Attendance extends Component {

  constructor(props) {

    super(props);

    this.state = {

      classesView: true,
      sectionView: false,
      studentsView: false,

      classDetails: {},
      classes: [],
      class: "",
      section: "",
      sectionArray: [],
      studentsDataArray: [],

      tempArray: ["kapil", "mayank"],

      timeTableView: false,
      subjectArray: [],
      timeTableArray: [],
      nameBtnColorFlag: false, // false means grey color, change color to green when button is clicked (true - green)
      nameBtnColor: 'grey',

      attendance: []



    };

    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.showTimeTable = this.showTimeTable.bind(this);
    this.nameBtnClicked = this.nameBtnClicked.bind(this);
    this.rollnoBtnClicked = this.rollnoBtnClicked.bind(this);
    this.updateStudentsAttendance = this.updateStudentsAttendance.bind(this);
    this.submitAttendance = this.submitAttendance.bind(this);

    // Fetching class details on page load
    this.fetchClassDetails();

  }

  submitAttendance() {

    var submitBtn = document.getElementById("submitAttendanceBtn");
    submitBtn.blur();

    console.log("Attendance - submitAttendance - updateStudentsAttendance called");

    // console.log(new Date() + "\n" + new Date(moment().startOf('day')));
    this.updateStudentsAttendance(this.state.class, this.state.section);
  }

  nameBtnClicked(rollno, username, firstname, lastname) {

    var nameBtn = document.getElementById(username);
    var rollnoBtn = document.getElementById(rollno);

    var studentsInfoArray = [];

    if(this.state.attendance && this.state.attendance.studentsInfo) {
      studentsInfoArray = this.state.attendance.studentsInfo;
    }

    var attendance = {};
    // attendance.date = new Date();
    attendance.date = new Date(moment().startOf('day'));

    nameBtn.blur();

    if(nameBtn.style.backgroundColor === 'grey' && rollnoBtn.style.backgroundColor === 'grey') {
      nameBtn.style.backgroundColor='green';
      rollnoBtn.style.backgroundColor='green';

      var studentsInfo = {};
      studentsInfo.username = username;
      studentsInfo.rollno = rollno;
      studentsInfo.firstname = firstname;
      studentsInfo.lastname = lastname;

      studentsInfoArray.push(studentsInfo);

      console.log("Attendance - present marked for username - " + username);

    } else {
      nameBtn.style.backgroundColor='grey';
      rollnoBtn.style.backgroundColor='grey';

      // console.log("Attendance - username - " + username + " studentsInfoArray 1 - " + JSON.stringify(studentsInfoArray));
      if(studentsInfoArray.length > 0) {
      for(var i=0; i<studentsInfoArray.length; i++) {
        if(studentsInfoArray[i].username === username) {
          var deletedItem = studentsInfoArray.splice(i, 1); 
          console.log("Deleted " + deletedItem);
          // delete studentsInfoArray[i];
        }
      }
      // console.log("Attendance - After REMOVING username - " + username + " studentsInfoArray 2 - " + JSON.stringify(studentsInfoArray));
    }

    console.log("Attendance - absent marked for username - " + username);
    }

    attendance.studentsInfo = studentsInfoArray;

    this.setState({
      attendance : attendance
    }, () => {
      console.log("attendance - Selected class - " + this.state.class 
      + " selected Section - " + this.state.section 
      + " attendance array - " + JSON.stringify(this.state.attendance));
    
    });

  }

  rollnoBtnClicked(e) {

    var rollnoBtn = document.getElementById(e.currentTarget.id);
    rollnoBtn.blur();
  }

  async updateStudentsAttendance(classStr, sectionStr) {

    var updateStudentsAttendanceRequest = {
      "class": classStr,
      "section": sectionStr,
      "attendance": this.state.attendance
    }

    console.log("Attendance - updateStudentsAttendance - updateStudentsAttendanceRequest - "
      + JSON.stringify(updateStudentsAttendanceRequest));

    await axios.post("http://localhost:8001/api/updateStudentsAttendance", updateStudentsAttendanceRequest).then(res => {

      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      } else {

        this.setState({
          classDetailsUpdatedFlag: true
        });
      }
    });
  }

  nameBtnClicked1(e) {

    console.log("Button clicked for username - " + e.currentTarget.id);

    // For hiding blue highlight border on click
    e.currentTarget.blur();

    // var btn = document.getElementById(e.currentTarget.id);
    var btn = document.getElementById('muksha');
    if(btn.style.backgroundColor === 'grey') {
      btn.style.backgroundColor='green';
    } else {
      btn.style.backgroundColor='grey';
    }

    var btn1 = document.getElementById('87878');
    if(btn1.style.backgroundColor === 'grey') {
      btn1.style.backgroundColor='green';
    } else {
      btn1.style.backgroundColor='grey';
    }
    

    // this.setState({
    //   nameBtnColorFlag: !this.state.nameBtnColorFlag
    // }, () => {

    //   if (this.state.nameBtnColorFlag) {
    //     this.setState({
    //       nameBtnColor: 'green'
    //     });
    //   }
    //   else {
    //     this.setState({
    //       nameBtnColor: 'grey'
    //     });
    //   }
    // });
    
    

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
    this.setState({ class: selectedClass });

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
    this.setState({
      sectionView: true,
      studentsView: false,
      timeTableView: false,
      section: ""
     });
  }

  sectionChangeHandler(e) {

    var section = e.currentTarget.value;
    console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + section);
    this.setState({ section: section });

    var studentsDataArrayTemp = null;
    this.state.classDetails.forEach(element => {
      if (element["class"] === this.state.class && element["section"] === section) {
        studentsDataArrayTemp = element["studentsData"];
      }
    });

    // Sorting array alphabetically
    //studentsDataArrayTemp.sort();

    this.setState({ studentsDataArray: studentsDataArrayTemp })

    console.log("Attendance - sectionChangeHandler - Selected class - " + this.state.class +
      " selected Section - " + this.state.section
      + " selected usernames - " + studentsDataArrayTemp);

    // Switching view to students view
    this.setState({
      studentsView: true
    });
  }

  showTimeTable() {

    var subjectArray = null;
    var timeTableArrayTemp = null;
    this.state.classDetails.forEach(element => {
      if (element["class"] === this.state.class && element["section"] === this.state.section) {
        subjectArray = element["subjects"];
        timeTableArrayTemp = element["timeTable"];
      }
    });

    this.setState({
      studentsView: false,
      timeTableView: true,
      subjectArray: subjectArray,
      timeTableArray: timeTableArrayTemp
    });

    console.log("ClassDetails - subjectArray - " + subjectArray + " timeTableArray - " + JSON.stringify(timeTableArrayTemp));
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
              <i className="fa fa-align-justify"></i> Select a Class
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

        </Col>
        </Row>
<br/>
              <Row>
                <Col>
                  <Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i> Students <small className="text-muted">Listing Class Students</small>
                    </CardHeader>
                    <CardBody>

                      <Row>
                        <Col className="col-md-2">
                        <Button block
                                     color="warning"
                                      // onClick={}
                                      size="lg"
                                      disabled="disabled"
                                    >
                                      Roll No.
                                    </Button>
                        </Col>

                        <Col className="col-md-10">
                        <Button block
                                     color="warning"
                                      // onClick={}
                                      size="lg"
                                      disabled="disabled"
                                    >
                                      Name
                                    </Button>
                        </Col>
                      </Row>

                      {this.state.studentsDataArray.map((studentsData) => (

<Row key={studentsData.username}>
<Col className="col-md-2">
                        {/* <Button block
                                     id={studentsData.rollno}
                                     key={studentsData.rollno}
                                     color="secondary"
                                      // onClick={}
                                      size="lg"
                                    >
                                      {studentsData.rollno}
                                    </Button> */}
                                    <Input
                                    type="button"
                                    id={studentsData.rollno}
                                    value={studentsData.rollno}
                                    style={{ backgroundColor: this.state.nameBtnColor, 
                                      // borderColor: 'black', 
                                      color: 'white',
                                      cursor: 'pointer'
                                    }}
                                      // onClick={this.rollnoBtnClicked}
                                      disabled="disabled"
                                      size="lg"></Input>
                        </Col>

                        <Col className="col-md-10">
                        {/* <Button block
                                     id={studentsData.username}
                                     key={studentsData.username}
                                     color="secondary"
                                      onClick={this.nameBtnClicked(studentsData.rollno, studentsData.username)}
                                      size="lg"
                                    >
                                      {studentsData.firstname.toUpperCase()} {studentsData.lastname.toUpperCase()} ({studentsData.username})
                                    </Button> */}
                                    <Input
                                    type="button"
                                    id={studentsData.username}
                                      // onClick={this.nameBtnClicked}
                                      onClick={ () => this.nameBtnClicked(studentsData.rollno, studentsData.username, studentsData.firstname, studentsData.lastname) }
                                      size="lg"
                                      style={{ backgroundColor: this.state.nameBtnColor, 
                                      // borderColor: 'black', 
                                      color: 'white',
                                      outline:0,
                                      cursor: 'pointer'
                                    }}
                                      value={studentsData.firstname.toUpperCase() + " " + studentsData.lastname.toUpperCase() + " ( " + studentsData.username + " )"} >
                                      </Input>
                        </Col>
  </Row>
))}

<br/><br/>
                                        <Card>
                                          <CardBody>

<Input
                                    type="button"
                                    id="submitAttendanceBtn"
                                      onClick={this.submitAttendance}
                                      size="lg"
                                      style={{ backgroundColor: "blue", 
                                      // borderColor: 'black', 
                                      color: 'white',
                                      outline:0,
                                      cursor: 'pointer'
                                     }}
                                      value="SUBMIT ATTENDANCE" >
                                      </Input>

                                          </CardBody>
                                        </Card>

                      {/* <Table responsive hover >
                        
                        <tbody>

                          <tr>
                          
                          <td >
                          <div className="col-md-2">
                                    <Button block
                                     color="primary"
                                      // onClick={}
                                      size="lg"
                                    >
                                      Edit
                                    </Button>
                                    </div>

<div className="col-md-8">
                                    <Button block
                                      color="warning"
                                      // onClick={}
                                      size="lg"
                                    >
                                      Copy
                                    </Button>
                                    </div>
                                    </td>

                                   
                                </tr>

                        </tbody>
                      </Table> */}

                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </div>
          )}



        </Container>
      </div>
    );
  }
}

export default Attendance;
