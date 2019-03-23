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

class StaffAttendance extends Component {

  constructor(props) {

    super(props);

    this.state = {

      classesView: true,
      sectionView: false,
      empView: false,
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

  
   
    this.nameBtnClicked = this.nameBtnClicked.bind(this);
    this.updateStudentsAttendance = this.updateStudentsAttendance.bind(this);
    this.submitAttendance = this.submitAttendance.bind(this);
    this.dayChangeHandler = this.dayChangeHandler.bind(this);
    this.toggleCalendar = this.toggleCalendar.bind(this);
    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);
    this.viewAttendanceHandler = this.viewAttendanceHandler.bind(this);
    this.markAttendanceHandler = this.markAttendanceHandler.bind(this);
    this.fetchAttendanceOnDate = this.fetchAttendanceOnDate.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);

    
  

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

    console.log("this.state.studentsDataArray - " + JSON.stringify(this.state.empDetails));
  
      var attendance = {};
      var empInfoArray = [];
  
      attendance.date = this.state.attendanceDate;
  
      this.state.empDetails.forEach(student => {
  
        var empInfo = {};
  
        empInfo.username = student.username;
        empInfo.firstname = student.firstname;
        empInfo.lastname = student.lastname;

        var nameBtn = document.getElementById(student.username);
        var btnColor = nameBtn.style.backgroundColor;

        if(btnColor === 'grey') {
          empInfo.attendanceStatus = "absent";
          empInfo.attendanceColor = "grey";

        } else if(btnColor === 'green') {
          empInfo.attendanceStatus = "present";
          empInfo.attendanceColor = "green";
        }
  
        empInfoArray.push(empInfo);
      })
  
      attendance.empInfo = empInfoArray;
  
      this.setState({
        attendance: attendance
      }, () => {
        console.log(" attendance array - " + JSON.stringify(this.state.attendance));
  
          this.updateStudentsAttendance(this.state.empType);
      });

    console.log("Attendance - submitAttendance - updateStudentsAttendance called");
  }

  fetchEmployees(e) {
    console.log("EmpType - " + e.target.value);

    this.setState({ empType: e.target.value, selectedEmp: [] });
    axios.post("http://localhost:8001/api/fetchEmployees", { "empType": e.target.value }).then(cRes => {
      console.log("Result Emp - " + JSON.stringify(cRes));

      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ empDetails: cRes.data,empView:true,  markAttendanceView: true }, () => {

          var empArray = [];
          this.state.empDetails.forEach(element => {

            console.log("element.class - " + element.username);
            empArray.push({
              "label": element.firstname + " " + element.lastname + "(" + element.username + ")",
              "value": element.firstname + " " + element.lastname + "(" + element.username + ")"
            });
          });
          // console.log("classArray - " + classArray);
          var uniqueItems = Array.from(new Set(empArray));



          this.setState({ empArray: uniqueItems });
        });



      }
    });
  }

  nameBtnClicked( username, firstname, lastname) {

    var nameBtn = document.getElementById(username);
   

    nameBtn.blur();

    if(nameBtn.style.backgroundColor === 'grey' ) {

      nameBtn.style.backgroundColor='green';
     

      console.log("Attendance - present marked for username - " + username);

    } else {

      nameBtn.style.backgroundColor='grey';
     

      console.log("Attendance - absent marked for username - " + username);
    }

  }

 

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

        // Setting studentsDataArray from Class.attendance.empInfo which was earlier set from Class.studentsData table
        if(attendanceRes.data.response && attendanceRes.data.response.attendance 
          && attendanceRes.data.response.attendance[0] && attendanceRes.data.response.attendance[0].empInfo) {

            // Setting students data for the selected date
          this.setState({
            studentsDataArray: attendanceRes.data.response.attendance[0].empInfo
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

  async updateStudentsAttendance(empType) {

    var updateStudentsAttendanceRequest = {
      "empType": empType,
  
      "attendance": this.state.attendance
    }

    console.log("Attendance - updateStudentsAttendance - updateStudentsAttendanceRequest - "
      + JSON.stringify(updateStudentsAttendanceRequest));

    await axios.post("http://localhost:8001/api/addStaffAttendance", updateStudentsAttendanceRequest).then(res => {

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

 

 

  render() {

   
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
            <h3 align="center">Employee Attendance</h3>
            </CardHeader>
            <CardBody>

              <br />
            
              <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                  <b>    Employee Type</b>
                                </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="empType"
                    id="empType"
                    type="select"
                    value={this.state.empType}
                    onChange={this.fetchEmployees}
                  >
                    <option value="">Select</option>
                    <option value="Staff">Staff</option>
                    <option value="Admin">Admin</option>

                  </Input>
                </InputGroup>
               
            

            

            </CardBody>
          </Card>

          {this.state.empView && (

            <div>

            <div align="center">
            
            { !this.state.isOpen && (
         
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
                    <h4 align="center">  Employees List </h4>
                    </CardHeader>
                    <CardBody>

                      <Row align="center">
                       

                        <Col align="center" className="col-md-10">
                        <Button block
                                     color="warning"
                                      size="lg"
                                      disabled
                                    >
                                     Employee Name
                                    </Button>
                        </Col>
                      </Row>

                      {this.state.empDetails.map((studentsData) => (

<Row key={studentsData.username}>
                  <Col className="col-md-10">
             
                                    <Input
                                    type="button"
                                    id={studentsData.username}
                                      onClick={ () => this.nameBtnClicked( studentsData.username, studentsData.firstname, studentsData.lastname) }
                                      size="lg"
                                      disabled={this.state.viewAttendanceView}
                                      style={{ backgroundColor: (studentsData.attendanceColor ? studentsData.attendanceColor : 'grey'), 
                                      color: 'white',
                                      outline:0,
                                      cursor: 'pointer'
                                    }}
                                      value={studentsData.firstname.toUpperCase() + " " + studentsData.lastname.toUpperCase() + " ( " + studentsData.username + " )"} >
                                      </Input>
                        </Col>
  </Row>
))}

                     
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

export default StaffAttendance;
