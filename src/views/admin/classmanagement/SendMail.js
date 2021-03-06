import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ReactPhoneInput from "react-phone-input-2";
import DatePicker from 'react-date-picker';
import classnames from 'classnames';
import Select from 'react-select';
import ReactLoading from 'react-loading';

import { css } from '@emotion/core';
import { ClipLoader } from 'react-spinners';

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
  NavLink,
  Modal,
  ModalHeader
} from "reactstrap";
import axios from "axios";
import MapsTransferWithinAStation from "material-ui/SvgIcon";

import './classmanagementcss/index.css';
import Agenda from './agenda/agenda'

var imageContext = require.context('../../../photoTemp', true);

const whiteTextFieldStyle = {
  background: "white"
}

const override = css`
    display: block;
    margin: 0 auto;
    border-color: red;
`;

const popupStyle = css`
    display: block;
    position: fixed;
    left: 0;
    top: 0;
    z-index: 9999;
    width: 100%;
    height: 100%;
    padding-top: 100px;
    background-color: black;
    background-color: rgba(0, 0, 0, 0.4);
    -webkit-transition: 0.5s;
    overflow: auto;
    transition: all 0.3s linear;
`;

class ClassDetails extends Component {

  constructor(props) {

    super(props);

    this.state = {

      emailLinkView: true,
      classesView: false,
      sectionView: false,
      classEmailView: false,

      classDetails: {},
      classes: [],
      class: "",
      section: "",
      sectionArray: [],
      studentsDataArray: [],
      selectClassStudentsData: [],
      studentsCollectionData: [],
      selectedClassStudentsEmailArray : [],

      tempArray: ["kapil", "mayank"],

      timeTableView: false,
      subjectArray: [],
      timeTableArray: [],

      mailSubject: '',
      mailBody: '',
      loader: false,
      modalSuccess: false

    };

    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.showTimeTable = this.showTimeTable.bind(this);
    this.emailLinkHandler = this.emailLinkHandler.bind(this);
    this.sendMailBtnHandler = this.sendMailBtnHandler.bind(this);
    this.fetchSelectedClassStudentsData = this.fetchSelectedClassStudentsData.bind(this);
    this.sendMailToClass = this.sendMailToClass.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);

    // Fetching class details on page load
    this.fetchClassDetails();

  }

  toggleModalSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {

    this.setState(
      {
        [e.target.name]: e.target.value
      }
    );
    console.log("state in react - " + JSON.stringify(this.state));
  }

  sendMailBtnHandler() {

    console.log("SendMail - sendMailBtnHandler");

    document.getElementById('sendMailRoot').style.filter = 'blur(5px)';
    // document.getElementById('sendMailRoot').style.display = 'none';

    this.setState({
      modalSuccess: true,
      loader: true
    });
    
    this.sendMailToClass();
  }

  emailLinkHandler(e) {

    console.log("SendMail - emailLinkHandler - e.currentTarget.value - " + e.currentTarget.id);

    var selectedEmailLinkId = e.currentTarget.id;
    if('classEmailLink' === e.currentTarget.id) {

      this.setState({
        classesView: true,
        emailLinkView: false
      });
    }
  }

  sendMailToClass() {

    var sendMailRequest = {
      "to": this.state.selectedClassStudentsEmailArray,
      "subject": this.state.mailSubject,
      "text": this.state.mailBody
      // ,"html": this.state.mailHtml
    }

    console.log("SendMail - sendMailToClass - sendMailRequest " 
    + JSON.stringify(sendMailRequest));
    
    axios.post("http://localhost:8001/api/sendmail", sendMailRequest).then(seRes => {

      if (seRes.data.errors) {

        this.setState({
          loader: false,
          modalSuccess: false
        });

        console.log("SendMail - sendMailToClass - ERROR in send mail - " + seRes.data.Errors);
        return this.setState({ errors: seRes.data.Errors });

      } else {

        this.setState({
          loader: false,
          modalSuccess: false
        });
        document.getElementById('sendMailRoot').style.filter = 'blur(0px)';
        // document.getElementById('sendMailRoot').style.display = 'block';
        console.log("SendMail - sendMailToClass - send email response - " + seRes.data.response.response);
      }
    });
  }

  fetchSelectedClassStudentsData() {

    var fetchSelectedClassStudentsDataRequest = {
      "class": this.state.class,
      "section": this.state.section
    }

    console.log("SendMail - fetchSelectedClassStudentsData - fetchSelectedClassStudentsDataRequest " 
    + JSON.stringify(fetchSelectedClassStudentsDataRequest));
    
    axios.post("http://localhost:8001/api/fetchSelectedClassStudentsData", fetchSelectedClassStudentsDataRequest).then(sdRes => {

      if (sdRes.data.errors) {

        return this.setState({ errors: sdRes.data.errors });

      } else {

        var studentsData = sdRes.data.response.studentsData;
        
        console.log("studentsData - " + studentsData);

        this.setState({ selectClassStudentsData: studentsData }, () => {

          var studentsEmailArray = [];
          var studentsUsername = [];
          this.state.selectClassStudentsData.forEach(element => {

            studentsEmailArray.push(element.email);

            // storing student's username for fetching parents email address
            studentsUsername.push(element.username);
          });

          this.setState({
            selectedClassStudentsEmailArray : studentsEmailArray
          
          }, () => {
            console.log("SendMail - selectedClassStudentsEmailArray - " + this.state.selectedClassStudentsEmailArray);

            /*
            Now we have student's email addresses, we have to their parents email address as well for sending email to everyone.
            Fetching parents email address from students collection
            */

            var searchStudentsByUsernameRequest = {
              "username" : studentsUsername
            }
           axios.post("http://localhost:8001/api/searchStudentsByUsername", searchStudentsByUsernameRequest).then(sRes => {

            if (sRes.data.errors) {
      
              return this.setState({ errors: sRes.data.errors });
      
            } else {

              console.log("SendMail - studentsCollectionData - sRes.data - " + JSON.stringify(sRes.data));

              var studentsCollectionData = sRes.data.response;
      
              this.setState({ studentsCollectionData: studentsCollectionData }, () => {
      
                var parentsEmailArray = [];
                this.state.studentsCollectionData.forEach(element => {
      
                  parentsEmailArray.push(element.parentemail);
                });

                console.log('\nstudentsEmailArray - ' + studentsEmailArray + ' \nparentsEmailArray - ' + parentsEmailArray)
                
                this.setState({
                  selectedClassStudentsEmailArray : studentsEmailArray.concat(parentsEmailArray)
                }, () => {
                  console.log("SendMail - selectedClassStudentsEmailArray - " + this.state.selectedClassStudentsEmailArray);
                });
              });
      
              console.log('SendMail - fetchClassDetails - selectedClassStudentsEmailArray - ' + JSON.stringify(this.state.selectedClassStudentsEmailArray));
            }
          });

          });
        });

        console.log('SendMail - fetchClassDetails - selectClassStudentsData - ' + JSON.stringify(this.state.selectClassStudentsData));
      }
    });
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
    console.log("SendMail - classChangeHandler - e.target.name - " + [e.currentTarget.name] + " e.target.value - " + selectedClass);
    this.setState({ class: selectedClass });

    var sectionArrayTemp = [];
    this.state.classDetails.forEach(element => {
      if (element["class"] === selectedClass) {
        sectionArrayTemp.push(element["section"]);
      }
    });

    // Sorting array alphabetically
    sectionArrayTemp.sort();

    this.setState({ sectionArray: sectionArrayTemp });

    console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp);

    // Switching view to section view
    this.setState({ 
      sectionView: true,
      classEmailView: false,
      timeTableView: false,
      section: ""
     });
  }

  sectionChangeHandler(e) {

    var section = e.currentTarget.value;
    console.log("SendMail - sectionChangeHandler - e.target.name - " + [e.currentTarget.name] + " e.target.value - " + section);

    this.setState({ section: section }, () => {
      
      console.log("SendMail - sectionChangeHandler - section - " + this.state.section);

    var studentsDataArrayTemp = null;
    this.state.classDetails.forEach(element => {
      if (element["class"] === this.state.class && element["section"] === section) {
        studentsDataArrayTemp = element["studentsData"];
      }
    });

    // Sorting array alphabetically
    //studentsDataArrayTemp.sort();

    this.setState({ studentsDataArray: studentsDataArrayTemp })

    console.log("sectionButtonClickHandler - Selected class - " + this.state.class +
      " selected Section - " + this.state.section
      + " selected usernames - " + studentsDataArrayTemp);

    // Switching view to students view
    this.setState({ 
      classEmailView: true,
      timeTableView: false,
    });

    console.log("SendMail - class " + this.state.class + " section - " + this.state.section);
    this.fetchSelectedClassStudentsData();
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
      classEmailView: false,
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

<div id="sendMailRoot">
{ this.state.emailLinkView && ( 

  
<div className="animated fadeIn">
<br/><br/><br/><br/>
<Row>
<Col className="col-md-4">
  <NavLink href="#"
  id="classEmailLink"
  style={{ color: 'red'}}
onClick={this.emailLinkHandler} ><h3><b><u>Send Email to Entire Class</u></b></h3></NavLink>

  <NavLink href="#"
  id="teacherEmailLink"
onClick={this.emailLinkHandler} ><h3><b><u>Send Email to Teachers</u></b></h3></NavLink>

<NavLink href="#"
id="parentsEmailLink"
onClick={this.emailLinkHandler} ><h3><b><u>Send Email to Parents</u></b></h3></NavLink>

<NavLink href="#"
id="groupsEmailLink"
onClick={this.emailLinkHandler} ><h3><b><u>Send Email to Email Groups</u></b></h3></NavLink>
</Col>
</Row>
</div>
)}

              {this.state.classesView && (


<div>
<h1 style={{color:"red"}}>Send Email to Entire Class</h1>
<Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Classes <small className="text-muted">Select a Class</small>
            </CardHeader>
            <CardBody>

              <br />

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
          </div>
)}


          {this.state.classEmailView && this.state.class && this.state.sectionArray && this.state.studentsDataArray && (

<Card>
                    <CardHeader>
                      <i className="fa fa-align-justify"></i> Students <small className="text-muted">Listing Class Students</small>
                    </CardHeader>
                    <CardBody>

{/* <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  To :
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                name="mailTo"
                                id="mailTo"
                                value={this.state.mailTo}
                                autoComplete="email address"
                                onChange={this.changeHandler}
                              />
                            </InputGroup> */}

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  Subject
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="textarea"
                                rows="1"
                                name="mailSubject"
                                id="mailSubject"
                                value={this.state.mailSubject}
                                onChange={this.changeHandler}
                              />
                            </InputGroup>

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  Body
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="textarea"
                                rows="15"
                                name="mailBody"
                                id="mailBody"
                                value={this.state.mailBody}
                                autoComplete="Mail Body"
                                onChange={this.changeHandler}
                              />
                            </InputGroup>

<Row>
<Col className="col-md-4"></Col>
<Col className="col-md-4"> 

{this.state.loader && (
  // <ReactLoading type="bars"
  //   color="	#006400"
  //   height='2%' width='20%'
  //   style = {{
  //     position: 'relative',
  //     margin: '0',
  //     top: '25%'
  //   }} />

  <div style = {popupStyle} >

    <ClipLoader
// css={override}
sizeUnit={"px"}
size={150}
color={'#123abc'}
loading={this.state.loader}
/>

</div> 
)}

{ !this.state.loader && (
<Input
                                    type="button"
                                    id="sendMailBtn"
                                      onClick={this.sendMailBtnHandler}
                                      size="lg"
                                      style={{ backgroundColor: "green", 
                                      // borderColor: 'black', 
                                      color: 'white',
                                      outline:0,
                                      cursor: 'pointer'
                                     }}
                                      value="SEND EMAIL" >
                                      </Input>
                                      )}
                                      </Col>
                                      </Row>
{/* // { this.state.studentsDataArray.map(studentData =>)} */}

                            </CardBody>
                            </Card>

            
          )}

</div>

        </Container>
      </div>
    );
  }
}

export default ClassDetails;
