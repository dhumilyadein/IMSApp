import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ReactPhoneInput from "react-phone-input-2";
import DatePicker from 'react-date-picker';
import classnames from 'classnames';
import Select from 'react-select';
import moment from 'moment';
import DayPickerInput from 'react-day-picker/DayPickerInput';
// import 'react-day-picker/lib/style.css';
// import MomentLocaleUtils, {
//   formatDate,
//   parseDate,
// } from 'react-day-picker/moment';

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
  Table,
  Modal,
  ModalHeader,
  NavLink
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
      markAttendanceView: false,
      viewAttendanceView: false,

      classDetails: {},
      classes: [],
      class: "",
      section: "",
      sectionArray: [],
      studentsDataArray: [],
      studentsDataArrayPageLoad: [],

      tempArray: ["kapil", "mayank"],

      timeTableView: false,
      subjectArray: [],
      timeTableArray: [],
      nameBtnColorFlag: false, // false means grey color, change color to green when button is clicked (true - green)
      nameBtnColor: 'grey',

      attendance: [],

      isOpen: false,
      
      attendanceDate: new Date(new Date(moment().startOf('day')).getTime()-(new Date(moment().startOf('day')).getTimezoneOffset() * 60000)),
      // attendanceDate: new Date(moment().startOf('day')),

      displayDate: moment().format('LL'),

      modalSuccess: false

      // new Date().getDate() + '-' + (new Date().getMonth()+1) + '-' + new Date().getFullYear()



    };

    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.nameBtnClicked = this.nameBtnClicked.bind(this);
    this.rollnoBtnClicked = this.rollnoBtnClicked.bind(this);
    this.updateStudentsAttendance = this.updateStudentsAttendance.bind(this);
    this.submitAttendance = this.submitAttendance.bind(this);
    this.dayChangeHandler = this.dayChangeHandler.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);
    this.viewAttendanceHandler = this.viewAttendanceHandler.bind(this);
    this.markAttendanceHandler = this.markAttendanceHandler.bind(this);
    this.fetchAttendanceOnDate = this.fetchAttendanceOnDate.bind(this);

    // Fetching class details on page load
    this.fetchClassDetails();

  }

  toggleCalendar (e) {

    e && e.preventDefault()
    this.setState({isOpen: !this.state.isOpen})

  }

  toggleModalSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
  }

  dayChangeHandler(date) {

    if(date) {

      console.log("GMT - " + new Date()
      + "\nnew Date(date.getTime()-(date.getTimezoneOffset() * 60000)) - " + new Date(date.getTime()-(date.getTimezoneOffset() * 60000))
      );
      
      this.setState({ attendanceDate: new Date(date.getTime()-(date.getTimezoneOffset() * 60000)) }, () => {
        this.setState( {displayDate : moment(this.state.attendanceDate).format('LL') } );

        this.fetchAttendanceOnDate();
        
      });

      // this.setState({ attendanceDate: new Date(moment(date.getTime()).startOf('day')) }, () => {
      //   this.setState( {displayDate : moment(this.state.attendanceDate).format('LL') } );
      // });
    }
    
    this.toggleCalendar();
  }


  viewAttendanceHandler() {

    console.log("viewAttendanceHandler");

    this.fetchAttendanceOnDate();

    this.setState({
      viewAttendanceView: true,
      markAttendanceView: false
    });


  }

  markAttendanceHandler() {

    console.log("markAttendanceHandler");

    this.fetchAttendanceOnDate();

    this.setState({
      markAttendanceView: true,
      viewAttendanceView: false
    });
  }

  submitAttendance() {

    var submitBtn = document.getElementById("submitAttendanceBtn");
    submitBtn.blur();

    console.log("this.state.studentsDataArray - " + JSON.stringify(this.state.studentsDataArray));
  
      var attendance = {};
      var studentsInfoArray = [];
  
      attendance.date = this.state.attendanceDate;
  
      this.state.studentsDataArray.forEach(student => {
  
        var studentsInfo = {};
  
        studentsInfo.username = student.username;
        studentsInfo.rollno = student.rollno;
        studentsInfo.firstname = student.firstname;
        studentsInfo.lastname = student.lastname;

        var nameBtn = document.getElementById(student.username);
        var btnColor = nameBtn.style.backgroundColor;

        if(btnColor === 'grey') {
          studentsInfo.attendanceStatus = "absent";
          studentsInfo.attendanceColor = "grey";

        } else if(btnColor === 'green') {
          studentsInfo.attendanceStatus = "present";
          studentsInfo.attendanceColor = "green";
        }
  
        studentsInfoArray.push(studentsInfo);
      })
  
      attendance.studentsInfo = studentsInfoArray;
  
      this.setState({
        attendance: attendance
      }, () => {
        console.log("attendance - Selected class - " + this.state.class
          + " selected Section - " + this.state.section
          + " attendance array - " + JSON.stringify(this.state.attendance));
  
          this.updateStudentsAttendance(this.state.class, this.state.section);
      });

    console.log("Attendance - submitAttendance - updateStudentsAttendance called");
  }

  nameBtnClicked(rollno, username, firstname, lastname) {

    var nameBtn = document.getElementById(username);
    var rollnoBtn = document.getElementById(rollno);

    nameBtn.blur();

    if(nameBtn.style.backgroundColor === 'grey' && rollnoBtn.style.backgroundColor === 'grey') {

      nameBtn.style.backgroundColor='green';
      rollnoBtn.style.backgroundColor='green';

      console.log("Attendance - present marked for username - " + username);

    } else {

      nameBtn.style.backgroundColor='grey';
      rollnoBtn.style.backgroundColor='grey';

      console.log("Attendance - absent marked for username - " + username);
    }

  }

  rollnoBtnClicked(e) {

    var rollnoBtn = document.getElementById(e.currentTarget.id);
    rollnoBtn.blur();
  }

  /*
   * Setting studentsDataArray from Class.attendance.studentsInfo which was earlier set from Class.studentsData table
   */
  async fetchAttendanceOnDate() {

    // Resetting studentsDataArray to clear the previous date so that only the selected records are present on the page
    this.setState({
      studentsDataArray: []
    });

    var fetchAttendanceOnDateRequest = {
      "class": this.state.class,
      "section": this.state.section,
      "date": this.state.attendanceDate
    }

    console.log("Attendance - fetchAttendanceOnDate - fetchAttendanceOnDateRequest - "
      + JSON.stringify(fetchAttendanceOnDateRequest));

    await axios.post("http://localhost:8001/api/fetchAttendanceOnDate", fetchAttendanceOnDateRequest).then(attendanceRes => {

      if (attendanceRes.data.errors) {
        return this.setState({ errors: attendanceRes.data.errors });
      } else {

        // Setting studentsDataArray from Class.attendance.studentsInfo which was earlier set from Class.studentsData table
        if(attendanceRes.data.response && attendanceRes.data.response.attendance 
          && attendanceRes.data.response.attendance[0] && attendanceRes.data.response.attendance[0].studentsInfo) {

            // Setting students data for the selected date
          this.setState({
            studentsDataArray: attendanceRes.data.response.attendance[0].studentsInfo
          });
        } else {

          // If there is no data for the selected date and view is markAttendance - show all the students of the class from studentsDataArrayPageLoad
          if(this.state.markAttendanceView) {
            this.setState({
              studentsDataArray: this.state.studentsDataArrayPageLoad
            });
          }
        }
        
      }
    });
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
          modalSuccess: true
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
      markAttendanceView: false,
      viewAttendanceView: false,
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

    this.setState({ studentsDataArrayPageLoad: studentsDataArrayTemp } );
    this.setState({ studentsDataArray: studentsDataArrayTemp } );

    console.log("Attendance - sectionChangeHandler - Selected class - " + this.state.class +
      " selected Section - " + this.state.section
      + " selected usernames - " + studentsDataArrayTemp);

    // Switching view to students view
    this.setState({
      studentsView: true,
      markAttendanceView: true
    });
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

          {this.state.modalSuccess && (
            <Modal
              isOpen={this.state.modalSuccess}
              className={"modal-success"}
              toggle={this.toggleModalSuccess}
            >
              <ModalHeader toggle={this.toggleModalSuccess}>
                Attendance Submitted Successfully!
              </ModalHeader>
            </Modal>
          )}

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

            <div>

            <div align="center">
            
            { !this.state.isOpen && (
            // <button
            //   className="example-custom-input"
            //   onClick={this.toggleCalendar}
            //   value="kapil"
            //   >
              
            //   {/* TODAY */}
            // </button>
<div align="center">
<Row>
<Col className="col-md-4"/>
{ this.state.markAttendanceView && (
<Col className="col-md-4 " align="center"><h3><b>MARK Attendance for</b></h3></Col>
)}
{ this.state.viewAttendanceView && (
  <Col className="col-md-4 " align="center"><h3><b>VIEW Attendance for</b></h3></Col>
  )}
</Row>
<Row>
<Col className="col-md-4"/>
<Col className="col-md-4" align="center">
<Input
                                    type="button"
                                    id="attendanceDate"
                                    value={this.state.displayDate}
                                    style={{ backgroundColor: this.state.nameBtnColor, 
                                      // borderColor: 'black', 
                                      color: 'white',
                                      cursor: 'pointer'
                                    }}
                                    onClick={this.toggleCalendar}
                                      size="lg"></Input>
</Col>
<Col className="col-md-4">
{ this.state.markAttendanceView && (
  <NavLink href="#"
  style={{ color: 'red'}}
onClick={this.viewAttendanceHandler} ><h3><b><u>Go to View Attendance</u></b></h3></NavLink> )}
{ this.state.viewAttendanceView && (
  <NavLink href="#"
onClick={this.markAttendanceHandler} ><h3><b><u>Go to Mark Attendance</u></b></h3></NavLink> )}
</Col>
</Row>
</div>
            )}
{ this.state.isOpen && (
            <DatePicker

                                name="attendanceDate"
                                id="attendanceDate"
                                value={this.state.attendanceDate}
                                onChange={this.dayChangeHandler}
                                isOpen={this.state.isOpen}
                              />
)}
              {/* <DayPickerInput 
              value="TODAY"
              formatDate={formatDate}
        parseDate={parseDate}
              format="DD-MM-YYYY"
              placeholder="TODAY"
              onDayChange={this.dayChangeHandler}
              selectedDay={this.state.selectedDay} /> */}
            </div>

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
                                    // style={{ backgroundColor: this.state.nameBtnColor, 
                                    style={{ backgroundColor: (studentsData.attendanceColor ? studentsData.attendanceColor : 'grey'), 
                                      color: 'white',
                                      cursor: 'pointer'
                                    }}
                                      // onClick={this.rollnoBtnClicked}
                                      disabled={true}
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
                                      disabled={this.state.viewAttendanceView}
                                      // style={{ backgroundColor: this.state.nameBtnColor, 
                                      style={{ backgroundColor: (studentsData.attendanceColor ? studentsData.attendanceColor : 'grey'), 
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

          { this.state.markAttendanceView && (
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
                  )}


        </Container>
      </div>
    );
  }
}

export default Attendance;
