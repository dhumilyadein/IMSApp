import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
import DatePicker from 'react-date-picker';
import Datetime from 'react-datetime';
import ReactLoading from 'react-loading';
import moment from 'moment';
import "bootstrap/dist/css/bootstrap.css";
import "react-datetime/css/react-datetime.css";
import TimeRange from 'react-time-range';
import { AppSwitch } from "@coreui/react";
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Modal,
  ModalHeader,

  Table,
  TabContent, TabPane, Nav, NavItem, NavLink, CardTitle, CardText
} from 'reactstrap';
import ReactTableContainer from "react-table-container";

import axios, { post } from "axios";
import { stat } from 'fs';



class AddResult extends Component {

  constructor(props) {

    super(props);

    this.state = {

      classesView: true,
      sectionView: false,
      showTabsFlag: false,
      showExamNamesFlag: false,

      classesAndSections: [],
      classDetails: {},
      classes: [],
      class: "",

      sectionArray: [],
      sectionLabelValueArray: [],
      selectedSection: "",
      selectedSectionsLabelValue: [],
      disableSectionsFlag: false,
      allSectionCheck: false,


      // To make tab 1 on focus
      activeTab: 'EXAM_DETAILS',

      subjectArray: [],

      inputExamDataArray: [{ examName: "" }],

      includeInResultFlag: true,

      disabled: false,

      examDate: new Date(),

      defaultExamDuration: 0,

      examName: "",
      examNameError: "",
      examDetailsArray: [],
      selectedExamDetails: {},

      // venueLabelValueArray: [
      //   { label: "Hall 1", value: "Hall 1" },
      //   { label: "Hall 2", value: "Hall 2" },
      //   { label: "Hall 3", value: "Hall 3" },
      //   { label: "Hall 4", value: "Hall 4" }
      // ],

      insertExamDetailsErrorMessage: "",
      copyTotalMarksToAllRowsFlag: false

    };

    this.fetchAllClassesAndSections = this.fetchAllClassesAndSections.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.fetchClassSpecificDetails = this.fetchClassSpecificDetails.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.examNameChangeHandler = this.examNameChangeHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.toggleTabs = this.toggleTabs.bind(this);
    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);
    this.fetchClassWiseExamDetails = this.fetchClassWiseExamDetails.bind(this);
    this.resetStudentsMarksArray = this.resetStudentsMarksArray.bind(this);
    this.AddResultSubmitHandler = this.AddResultSubmitHandler.bind(this);

    // Calling method on page load to load all classes and sections for the drop down
    this.fetchAllClassesAndSections();
  }

  /**
   * Fetching exam details
   */
  fetchClassWiseExamDetails() {

    var fetchExamDetailsOnInputRequest = {
      "examName": this.state.selectedExamDetails.examName,
      "className": this.state.class
    }

    axios
      .post("http://localhost:8001/api/fetchExamDetailsOnInput", fetchExamDetailsOnInputRequest)
      .then(result => {

        // console.log("CreateExam - fetchExamDetails - exam details - " + JSON.stringify(result.data));

        if (result.errors) {
          return this.setState({ errors: result.errors });

        } else if (!(typeof (result.data[0]) === 'undefined' || result.data[0] === null)) {

          var classWiseExamDetailsArray = result.data[0].classWiseExamDetailsArray[0];
          var sectionWiseExamDetailsArray = result.data[0].classWiseExamDetailsArray[0].sectionWiseExamDetailsArray;

          sectionWiseExamDetailsArray.forEach(element => {

            // Comparing with selected section
            if (element.section === this.state.selectedSection) {

              var percentageShareInFinalResult = result.data[0].classWiseExamDetailsArray[0].percentageShareInFinalResult;
              var isMandatryToAttendForFinalResult = result.data[0].classWiseExamDetailsArray[0].isMandatryToAttendForFinalResult;

              var selectedExamDetailsTemp = this.state.selectedExamDetails;

              selectedExamDetailsTemp.percentageShareInFinalResult = percentageShareInFinalResult;
              selectedExamDetailsTemp.isMandatryToAttendForFinalResult = isMandatryToAttendForFinalResult;

              this.setState({
                inputExamDataArray: element.examDetails,
                selectedExamDetails: selectedExamDetailsTemp
              });
            }
          });

          console.log('AddResult - fetchClassWiseExamDetails - classWiseExamDetailsArray - ' + JSON.stringify(classWiseExamDetailsArray) + " sectionWiseExamDetailsArray - " + JSON.stringify(sectionWiseExamDetailsArray));
        }

      });
  }

  /**
   * Fetching exam details
   */
  fetchExamDetailsOnInput() {

    var fetchExamDetailsOnInputRequest = {
      "applicableForClasses": this.state.class
    }

    axios
      .post("http://localhost:8001/api/fetchExamDetailsOnInput", fetchExamDetailsOnInputRequest)
      .then(result => {

        // console.log("CreateExam - fetchExamDetails - exam details - " + JSON.stringify(result.data));

        if (result.errors) {
          return this.setState({ errors: result.errors });
        } else {

          this.setState({ examDetailsArray: result.data }, () => {

            console.log('AddResult - fetchExamDetailsOnInput - exam details for class - ' + this.state.selectedClass + ' are \n' + JSON.stringify(this.state.examDetailsArray));
          });

        }

      });
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

          console.log('AddResult - fetchAllClassesAndSections - All class details - ' + JSON.stringify(this.state.classesAndSections));

          // Fetching unique classes from the classesAndSections 
          this.fetchClasses();
        });

      }
    });
  }

  // async fetchClassSpecificDetails() {

  //   this.setState({
  //     subjectArray: [],
  //     emailArray: []
  //   });

  //   var fetchClassSpecificDetailsRequest = {
  //     "class": this.state.class,
  //     "sectionArray": this.state.selectedSection,
  //     "subjects": 1,
  //   }

  //   console.log("AddResult - fetchClassSpecificDetails - fetchClassSpecificDetailsRequest - "
  //     + JSON.stringify(fetchClassSpecificDetailsRequest));

  //   await axios.post("http://localhost:8001/api/fetchClassSpecificDetails", fetchClassSpecificDetailsRequest).then(res => {

  //     if (res.data.errors) {

  //       console.log('AddResult - fetchClassSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
  //       return this.setState({ errors: res.data.errors });

  //     } else {

  //       this.setState({
  //         classDetails: res.data,
  //       }, () => {

  //         console.log('AddResult - fetchClassSpecificDetails - All class details classDetails - '
  //           + JSON.stringify(this.state.classDetails)
  //           + " subjectArray - " + this.state.subjectArray);

  //         var subjectSameForAllSectionsFlag = true;
  //         var comparingSection1;
  //         var comparingSection2;
  //         for (var i = 0; i < (this.state.classDetails.length - 1) && subjectSameForAllSectionsFlag; i++) {

  //           comparingSection1 = this.state.classDetails[i].section;
  //           comparingSection2 = this.state.classDetails[i + 1].section;

  //           var arr1 = this.state.classDetails[i].subjects.sort();
  //           var arr2 = this.state.classDetails[i + 1].subjects.sort();

  //           console.log('AddResult - fetchClassSpecificDetails - arr1 - '
  //             + arr1
  //             + " \narr2 - " + arr2);

  //           if (arr1.length !== arr2.length) subjectSameForAllSectionsFlag = false;

  //           for (var j = 0; j < arr1.length && subjectSameForAllSectionsFlag; j++) {

  //             if (arr1[j] !== arr2[j]) {
  //               subjectSameForAllSectionsFlag = false;
  //               break;
  //             }
  //           }
  //           //subjectSameForAllSectionsFlag = true;
  //         }

  //         if (!subjectSameForAllSectionsFlag) {

  //           this.setState({
  //             selectedSection: "",
  //             selectedSectionLabelValue: {},
  //             disableSectionsFlag: false,
  //             allSectionCheck: false
  //           });

  //           alert("Subjects are not same for all the sections!"
  //             + "\nFYI, section " + comparingSection1 + " and " + comparingSection2 + " have different subjects."
  //             + "\nPlease schedule exam at once, only for the sections which have same subjects."
  //             + "\nSchedule separately for rest sections.");

  //         } else {

  //           console.log("AddResult - fetchClassSpecificDetails - this.state.classDetails[0].subjects - " + JSON.stringify(this.state.classDetails[0].subjects));

  //           /*
  //             Setting temporary inputExamDataArray for each subject
  //             */
  //           var startMoment = new Date(new Date().setHours(12, 0, 0, 0));
  //           var endMoment = new Date(new Date().setHours(12, 0, 0, 0));
  //           var examDate = new Date(new Date().setHours(5, 30, 0, 0));

  //           var inputExamDataArrayTemp = [];
  //           this.state.classDetails[0].subjects.forEach(element => {

  //             const item = {
  //               subject: element,
  //               totalMarks: "",
  //               passingMarks: "",
  //               includeInResultFlag: true,
  //               examDate: examDate,
  //               startMoment: startMoment,
  //               endMoment: endMoment,
  //               examDuration: 0,
  //               // venueLabelValue: [],
  //               // venue: "",
  //             };

  //             inputExamDataArrayTemp.push(item);

  //           });

  //           console.log("exam details array - " + JSON.stringify(inputExamDataArrayTemp));
  //           this.setState({
  //             inputExamDataArray: inputExamDataArrayTemp,
  //             subjectArray: this.state.classDetails[0].subjects,
  //           });

  //           console.log("1 AddResult - fetchClassSpecificDetails - subjectArray - " + this.state.subjectArray
  //             + " \nthis.state.classDetails[0].subjects - " + JSON.stringify(this.state.classDetails[0].subjects));
  //         }
  //       });
  //     }
  //   });
  // }

  /**
   * @description - fetches unique classes from the class detail from DB
   */
  fetchClasses() {

    var classArray = [];
    this.state.classesAndSections.forEach(element => {

      classArray.push(element.class);
    });
    console.log("classArray - " + classArray);
    var uniqueItems = Array.from(new Set(classArray));

    this.setState({ classes: uniqueItems });

    console.log("Unique classes - " + this.state.classes);
  }

  classChangeHandler(e) {

    var selectedClass = e.currentTarget.value;

    this.setState({
      class: selectedClass,
      showExamNamesFlag: false,
      selectedExamDetails: [],
    });

    var sectionArrayTemp = [];
    var sectionLabelValueArrayTemp = [];
    this.state.classesAndSections.forEach(element => {
      if (element["class"] === selectedClass) {

        var sectionLabelValue = {};

        var section = element["section"];
        sectionArrayTemp.push(section);

        sectionLabelValue.value = section;
        sectionLabelValue.label = section;

        sectionLabelValueArrayTemp.push(sectionLabelValue);

      }
    });

    // Sorting array alphabetically
    sectionArrayTemp.sort();

    this.setState({
      sectionArray: sectionArrayTemp,
      sectionLabelValueArray: sectionLabelValueArrayTemp,
      sectionView: true,
      selectedSection: "",
      selectedSectionLabelValue: {},
      disableSectionsFlag: false,
    }, () => {


      this.fetchExamDetailsOnInput();

      console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp
        + " \nsectionLabelValueArray - " + JSON.stringify(this.state.sectionLabelValueArray));
    })
  }

  sectionChangeHandler = (newValue, actionMeta) => {

    this.setState({
      showExamNamesFlag: true,
      selectedExamDetails: []
    });

    console.log("AddResult - sectionChangeHandler - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);

    this.setState({
      selectedSection: newValue.value,
      selectedSectionLabelValue: newValue,
    }, () => {
      console.log("AddResult - sectionChangeHandler - selectedSectionLabelValue - " + JSON.stringify(this.state.selectedSectionLabelValue));
      console.log("\nAddResult - sectionChangeHandler - selected class - " + JSON.stringify(this.state.class)
        + " selected section - " + this.state.selectedSection);

      this.fetchClassSpecificDetails();
    });

  };

  examNameChangeHandler(e) {

    this.setState({
      selectedExamDetails: [],
    });

    var examName = e.currentTarget.value;

    var isExamNameValid = false;
    this.state.examDetailsArray.forEach(element => {

      var selectedExamDetails = {};

      if (examName === element.examName) {

        isExamNameValid = true;

        selectedExamDetails.examName = element.examName;
        selectedExamDetails.examDescription = element.examDescription;
        selectedExamDetails.percentageShareInFinalResult = element.percentageShareInFinalResult;
        selectedExamDetails.applicableForClasses = element.applicableForClasses;
        selectedExamDetails.isMandatryToAttendForFinalResult = element.isMandatryToAttendForFinalResult;

        this.setState({
          selectedExamDetails: selectedExamDetails
        }, () => {

          //Fetching class wise exam details on examName selection

          this.fetchClassWiseExamDetails();
        });

        console.log("Foreach setting exam details");
        return true;
      }

    });

    if (isExamNameValid) {
      console.log("Foreach setting exam details after loop");
      this.setState({
        showTabsFlag: true
      });
    }

  }

  /**
   * For tab toggle
   */
  toggleTabs(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  // marksChangeHandler = idx => subjectId => subjectName => e => {
    // marksChangeHandler = idx => e => {
      marksChangeHandler = (idx, subjectId, subjectName) => e => {

    // console.log("e.target.value - " + JSON.stringify(e.target.value) + " idx - " + idx);

    console.log("marks for - " + subjectName + " - " + JSON.stringify(e.target.value) + " idx - " + idx + " subjectId - " + subjectId);

    console.log("BEFORE this.state.studentsMarksArray" + JSON.stringify(this.state.studentsMarksArray) + " idx - " + idx + " INDIVIDUAL MARKS - " + this.state.studentsMarksArray[idx].subjectMarksArray[subjectId][subjectName]);

    var temp = this.state.studentsMarksArray;

    // var subjectTemp = temp[idx].subjectMarksArray;
    // subjectTemp[subjectId][subjectName] = e.target.value;
    // temp[idx].subjectMarksArray =  subjectTemp;

    temp[idx].subjectMarksArray[subjectId][subjectName] = e.target.value;
    this.setState({ studentsMarksArray: temp },
      () => {
        console.log("AFTER this.state.studentsMarksArray" + JSON.stringify(this.state.studentsMarksArray) + " idx - " + idx + " INDIVIDUAL MARKS - " + this.state.studentsMarksArray[idx].subjectMarksArray[subjectId][subjectName]);
      });
      
  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {

    // console.log("Name: "+e.target.name +" Value: "+ e.target.value);

    var selectedExamDetails = this.state.selectedExamDetails;

    selectedExamDetails[e.target.name] = e.target.value;

    this.setState({
      selectedExamDetails: selectedExamDetails
    });
  }


  async toggleModalSuccess() {

    await console.log("CreateExam - toggleModalSuccess this.state.showModalFlag - " + this.state.showModalFlag);
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
  }

  async fetchClassSpecificDetails() {

    // this.setState({
    //   subjectArray: [],
    //   pTMeetScheduleArray: [],
    //   pTMeetScheduleView: false,
    //   emailArray: []
    // });

    var fetchClassSpecificDetailsRequest = {
      "class": this.state.class,
      "section": this.state.selectedSection,
      "subjects": 1,
      "studentsData": 1
    }

    console.log("AddResult - fetchClassSpecificDetails - fetchClassSpecificDetailsRequest - "
      + JSON.stringify(fetchClassSpecificDetailsRequest));

    await axios.post("http://localhost:8001/api/fetchClassSpecificDetails", fetchClassSpecificDetailsRequest).then(res => {

      if (res.data.errors) {

        console.log('AddResult - fetchClassSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
        return this.setState({ errors: res.data.errors });
      } else {

        var response = res.data[0];
        console.log('AddResult - fetchClassSpecificDetails - res.data - ' + JSON.stringify(res.data));

        this.setState({
          subjectArrayFromClass: response.subjects,
          studentsData: response.studentsData
        }, () => {

          console.log('AddResult - fetchClassSpecificDetails - SubectsArrayFromClass - ' + JSON.stringify(this.state.subjectArrayFromClass) + ' studentsData - ' + JSON.stringify(this.state.studentsData));

          this.resetStudentsMarksArray();
        });
      }
    });
  }

  resetStudentsMarksArray() {

    var subjectMarksArrayTemp = [];
    var studentsMarksArrayTemp = [];

    // Setting dummy marks in subjectMarks array for all students
    var i=100;
    this.state.subjectArrayFromClass.forEach(element => {

      var item = {};
      item[element] = i++;

      subjectMarksArrayTemp.push(item);

    });

    // Setting dummy daata in studentsMarksArray for all students
    this.state.studentsData.forEach(element => {

      const item = {
        username: element.username,
        firstname: element.firstname,
        lastname: element.lastname,
        subjectMarksArray: subjectMarksArrayTemp
      };

      studentsMarksArrayTemp.push(item);

    });

    // studentsMarksArrayTemp[1].subjectMarksArray[2]["Maths"]=200;
    // studentsMarksArrayTemp[0].subjectMarksArray[1]["Science"]=100;

    this.setState({
      studentsMarksArray: studentsMarksArrayTemp
    }, () =>{
      console.log('AddResult - resetStudentsMarksArray - studentsMarksArray - ' + JSON.stringify(this.state.studentsMarksArray));
    });
  }

  AddResultSubmitHandler() {

    console.log("AddResult AddResultSubmitHandler this.state.studentsMarksArray - " + JSON.stringify(this.state.studentsMarksArray));
  }

  render() {

    return (
      <div>
        <Container >

          <Row>
            <Col sm="12">
              {this.state.modalSuccess && (
                <Modal
                  isOpen={this.state.modalSuccess}
                  className={this.state.modalColor}
                  toggle={this.toggleModalSuccess}
                >
                  <ModalHeader toggle={this.toggleModalSuccess}>
                    {this.state.modalMessage}
                  </ModalHeader>
                </Modal>
              )}

              <h3 align="center">Add Result For Class</h3>
              <br />

              <InputGroup className="mb-3">
                <InputGroupAddon addonType="prepend">
                  <InputGroupText >
                    <b>Class</b>
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

              {this.state.sectionView &&
                <div>

                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                      <b>Section</b>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Select
                    id="section"
                    name="section"
                    // isMulti={true}
                    placeholder="Select Single or Multiple Section(s)"
                    options={this.state.sectionLabelValueArray}
                    closeMenuOnSelect={true}
                    value={this.state.selectedSectionsLabelValueArray}
                    isDisabled={this.state.disableSectionsFlag}
                    isSearchable={true}
                    onChange={this.sectionChangeHandler}
                    onMenuClose={this.sectionMenuCloseHandler} />

                  {this.state.sectionError && (
                    <font color="red">
                      {" "}
                      <p>{this.state.sectionError}</p>
                    </font>
                  )}
                  <br />
                </div>
              }

              {this.state.showExamNamesFlag &&
                <div>
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <b>Exam Name</b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="examName"
                      id="examName"
                      type="select"
                      value={this.state.selectedExamDetails.examName}
                      onChange={this.examNameChangeHandler}
                    >
                      <option value="">Select</option>
                      {this.state.examDetailsArray.map(element => {
                        return (<option key={element.examName} value={element.examName}>{element.examName}</option>);
                      }
                      )}
                    </Input>
                  </InputGroup>
                  {this.state.examNameError && (
                    <font color="red">
                      {" "}
                      <p>{this.state.examNameError}</p>
                    </font>
                  )}
                </div>
              }

              {this.state.showTabsFlag && (
                <div>
                  <br />
                  <h3 align="center">{this.state.selectedExamDetails.examName.charAt(0).toUpperCase() + this.state.selectedExamDetails.examName.slice(1)}</h3>
                  <br />

                  <div class="table-responsive" >
                    <Table bordered hover size="sm">
                      <thead>
                        <tr>
                          <th><h5>Students/Subjects</h5></th>
                          {this.state.subjectArrayFromClass.map((item, idx) => (
                            <th className="text-center"> <h5>{item.charAt(0).toUpperCase() + item.slice(1)}</h5></th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                        {this.state.studentsData.map((item, idx) => (
                          <tr id="addr0" key={idx}>
                            <th>{item.firstname.charAt(0).toUpperCase() + item.firstname.slice(1) + " " + item.lastname.charAt(0).toUpperCase() + item.lastname.slice(1)}</th>


                            {this.state.subjectArrayFromClass.map((subjectName, subjectId) => (
                              <td id="col0" key={subjectId} align="center" style={{ "vertical-align": "middle" }}>
                                <InputGroup >
                                  <Input
                                    name="examDuration"
                                    type="text"
                                    className="form-control"
                                    // value={item.username}
                                    value={this.state.studentsMarksArray[idx].subjectMarksArray[subjectId][subjectName]}
                                    onChange={this.marksChangeHandler(idx, subjectId, subjectName)}
                                    // onChange={this.marksChangeHandler(idx)}
                                    style={{ textAlign: 'center' }}
                                    id="examDuration"
                                  // size="lg"
                                  />
                                </InputGroup>
                              </td>
                            ))}
                            {/* <td>
            <InputGroup >
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value="kapil"
                                      // disabled={false}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
            </td>
            <td>
            <InputGroup >
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value="kapil"
                                      // disabled={false}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
            </td><td>
            <InputGroup >
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value="kapil"
                                      // disabled={false}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
            </td><td>
            <InputGroup >
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value="kapil"
                                      // disabled={false}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
            </td><td>
            <InputGroup >
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value="kapil"
                                      // disabled={false}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
            </td><td>
            <InputGroup >
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value="kapil"
                                      // disabled={false}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
            </td><td>
            <InputGroup >
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value="kapil"
                                      // disabled={false}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
            </td> */}
                          </tr>
                        ))}
                      </tbody>
                    </Table>
                  </div>
                  {this.state.rowError && (
                    <font color="red">
                      <h6>
                        {" "}
                        <p>{this.state.rowError} </p>
                      </h6>{" "}
                    </font>
                  )}


                  <br />

                  {this.state.insertExamDetailsErrorMessage && (
                    <font color="red">
                      {" "}
                      <p>{this.state.insertExamDetailsErrorMessage}</p>
                    </font>
                  )}
                  <Row>
                    <Col>
                      {!this.state.loader && <Button
                        onClick={this.AddResultSubmitHandler}
                        size="lg"
                        color="success"
                        block
                      >
                        Submit
                </Button>}

                      {this.state.loader &&
                        <div align="center"><ReactLoading type="spin"
                          color="	#006400"
                          height='2%' width='10%' />
                          <br />

                          <font color="DarkGreen">  <h4>Submitting...</h4></font></div>}

                    </Col>

                    <Col>
                      <Button
                        onClick={this.resetExamDetails}
                        size="lg"
                        color="secondary"
                        block
                      >
                        Reset
                </Button>
                    </Col>
                  </Row>

                </div>


              )}

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default AddResult;

