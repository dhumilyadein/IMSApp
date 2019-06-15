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
import { resolveMx } from "dns";



var imageContext = require.context('../../../photoTemp', true);

const whiteTextFieldStyle = {
  background: "white"
}

class StaffAttendance extends Component {

  constructor(props) {

    super(props);

    this.state = {
      dateChangeCounter:1,
      classesView: true,
      sectionView: false,
      empView: false,
      markAttendanceView: false,

     empType:"",
     empDetails:[],
      studentsDataArray: [],


      tempArray: ["kapil", "mayank"],



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

    this.fetchAttendanceOnDate = this.fetchAttendanceOnDate.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.fetchEmployeesWithoutEvent = this.fetchEmployeesWithoutEvent.bind(this);
    this.reset = this.reset.bind(this);






  }

  reset(){

    this.setState({    classesView: true,
      sectionView: false,
      empView: false,
      markAttendanceView: false,
      dateChangeCounter:1,
     empType:"",
     empDetails:[],
      studentsDataArray: [],


      tempArray: ["kapil", "mayank"],



      nameBtnColorFlag: false, // false means grey color, change color to green when button is clicked (true - green)
      nameBtnColor: 'grey',

      attendance: [],

      isOpen: false,

      attendanceDate: new Date(new Date(moment().startOf('day')).getTime()-(new Date(moment().startOf('day')).getTimezoneOffset() * 60000)),
      // attendanceDate: new Date(moment().startOf('day')),

      displayDate: moment().format('LL'),

      modalSuccess: false});
  }

  toggleCalendar (e) {

    e && e.preventDefault()
    this.setState({isOpen: !this.state.isOpen})

  }

  toggleModalSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
    this.reset();
  }

  dayChangeHandler(date) {
console.log(" dateChangeCounter: "+this.state.dateChangeCounter)
    this.setState({dateChangeCounter:this.state.dateChangeCounter+1},()=>{

     if(this.state.dateChangeCounter<=5)
     {
      if(date) {

        this.setState({ attendanceDate: new Date(date.getTime()-(date.getTimezoneOffset() * 60000))
       }, () => {
       this.setState( {displayDate : moment(this.state.attendanceDate).format('LL') } );

       this.fetchEmployeesWithoutEvent();

     });


   }

   this.toggleCalendar();

     }

     else{window.location.reload();}

    })
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
        attendance: attendance, error:""
      }, () => {
        console.log(" attendance array - " + JSON.stringify(this.state.attendance));

          this.updateStudentsAttendance(this.state.empType);
      });

    console.log("Attendance - submitAttendance - updateStudentsAttendance called");
  }

 async fetchEmployees(e) {
    console.log("EmpType - " + e );

    this.setState({ empType: e.target.value , error:"", empDetails:[]});
   await  axios.post("http://localhost:8001/api/fetchEmployees", { "empType": e.target.value }).then(cRes => {
      console.log("Result Emp - " + JSON.stringify(cRes.data));

      if (cRes.data.errors) {

        return this.setState({ error: cRes.data.errors });

      }
else{  var empArray = [];
  cRes.data.forEach(element => {

    if(this.state.empType==="Admin" && element.role.indexOf("teacher")===-1)

           empArray.push(element);

          else if(this.state.empType==="Staff")

           empArray.push(element);


         });
         var uniqueItems = Array.from(new Set(empArray)).sort();
         this.setState({ empDetails: uniqueItems ,empView:true,  markAttendanceView: true } );

          this.fetchAttendanceOnDate();

      }
    });
  }

  async fetchEmployeesWithoutEvent() {
   if(!this.state.empType)
   this.setState({error:"Please select Employess Type first!",empDetails:[]});

   else
 await   axios.post("http://localhost:8001/api/fetchEmployees", { "empType": this.state.empType }).then(cRes => {
      console.log("Result Emp - " + JSON.stringify(cRes.data));

      if (cRes.data.errors) {

        return this.setState({ error: cRes.data.errors });

      }
else{  var empArray = [];
  cRes.data.forEach(element => {

    if(this.state.empType==="Admin" && element.role.indexOf("teacher")===-1)

           empArray.push(element);

          else if(this.state.empType==="Staff")

           empArray.push(element);


         });
         var uniqueItems = Array.from(new Set(empArray)).sort();
         this.setState({ empDetails: uniqueItems ,empView:true,  markAttendanceView: true } );

 this.fetchAttendanceOnDate();

      }
    });
  }



  nameBtnClicked( username) {

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
       error:""
    });

    var fetchAttendanceOnDateRequest = {
      "empType": this.state.empType,
      "date": this.state.attendanceDate
    }

    console.log("Attendance - fetchAttendanceOnDate - fetchAttendanceOnDateRequest - "
      + JSON.stringify(fetchAttendanceOnDateRequest));

    await axios.post("http://localhost:8001/api/fetchEmpAttendanceOnDate", fetchAttendanceOnDateRequest).then(attendanceRes => {
      console.log("Attendance Result - "
      + JSON.stringify(attendanceRes.data));
      if (attendanceRes.data.err) {
        return this.setState({ error: attendanceRes.data.err });
      } else {

        // Setting studentsDataArray from Class.attendance.empInfo which was earlier set from Class.studentsData table
        if(attendanceRes.data.response )
          if(attendanceRes.data.response.empInfo)
            // Setting students data for the selected date
          this.setState({
            empDetails: attendanceRes.data.response.empInfo
          });


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
      console.log("Result: "+JSON.stringify(res.data))

if(res.data.msg==="Success")
this.setState({
  modalSuccess: true
});

      else if(res.data.err)
      {
        return this.setState({ error: res.data.err });
      }
    });
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


{this.state.error && (
  <font color="red">
    {" "}
    <p><b>{this.state.error}</b></p>
  </font>
)}


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
<Col className="col-md-4 " align="center"><h5><b>MARK Attendance for</b></h5></Col>
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
                    <CardBody align="center">
<div align="center">
                      <Row align="center">


                        <Col align="center" className="col-md-10">
                        <Button block
                                     color="warning"
                                      size="lg"
                                      disabled
                                    >
                                   <b>  Employee Name </b>
                                    </Button>
                        </Col>
                      </Row>

                      {this.state.empDetails.map((studentsData) => (

<Row key={studentsData.username}>
                  <Col className="col-md-10">

                                    <Input
                                    block
                                    type="button"
                                    id={studentsData.username}
                                      onClick={ () => this.nameBtnClicked( studentsData.username) }
                                      size="lg"
                                      disabled={this.state.viewAttendanceView}
                                      style={{ backgroundColor: (studentsData.attendanceColor ? studentsData.attendanceColor : 'green'),
                                      color: 'white',
                                      outline:0,
                                      cursor: 'pointer'
                                    }}
                                      value={studentsData.firstname.toUpperCase() + " " + studentsData.lastname.toUpperCase() + " ( " + studentsData.username + " )"} >
                                      </Input>
                        </Col>
  </Row>
))} </div>


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
