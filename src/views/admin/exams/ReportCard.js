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

import axios, { post } from "axios";
import { stat } from 'fs';

const whiteTextFieldStyle = {
  background: "white"
}

class ReportCard extends Component {

  constructor(props) {

    super(props);

    this.state = {

      classesView: true,
      sectionView: false,
      showReportCardFlag: false,
      showStudentNamesFlag: false,

      classesAndSections: [],
      classDetails: {},
      classes: [],
      class: "",

      sectionArray: [],
      sectionLabelValueArray: [],
      studentLabelValueArray: [],
      selectedSection: "",
      selectedSectionLabelValue: [],
      selectedStudentUsername: "",
      allSectionCheck: false,
      editMode: "disabled",

      results: [],


      // To make tab 1 on focus
      activeTab: 'EXAM_DETAILS',

      subjectArray: [],

      inputExamDataArray: [{ examName: "" }],

      includeInResultFlag: true,

      disabled: false,

      examDate: new Date(),

      defaultExamDuration: 0,

      examName: "",
      studentNameError: "",
      examDetailsArray: [],
      selectedExamDetails: {},

      results: {},

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
    this.toggleTabs = this.toggleTabs.bind(this);
    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);
    this.fetchClassWiseExamDetails = this.fetchClassWiseExamDetails.bind(this);
    this.resetStudentsMarksArray = this.resetStudentsMarksArray.bind(this);
    this.reportCardSubmitHandler = this.reportCardSubmitHandler.bind(this);
    this.fetchResultOnExamName = this.fetchResultOnExamName.bind(this);
    this.setStudentsDropDownLabelValue = this.setStudentsDropDownLabelValue.bind(this);
    this.studentChangeHandler = this.studentChangeHandler.bind(this);

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
                selectedExamDetails: selectedExamDetailsTemp,
              });
            }
          });

          console.log('ReportCard - fetchClassWiseExamDetails - classWiseExamDetailsArray - ' + JSON.stringify(classWiseExamDetailsArray) + " sectionWiseExamDetailsArray - " + JSON.stringify(sectionWiseExamDetailsArray));
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

            console.log('ReportCard - fetchExamDetailsOnInput - exam details for class - ' + this.state.selectedClass + ' are \n' + JSON.stringify(this.state.examDetailsArray));
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

          console.log('ReportCard - fetchAllClassesAndSections - All class details - ' + JSON.stringify(this.state.classesAndSections));

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

  //   console.log("ReportCard - fetchClassSpecificDetails - fetchClassSpecificDetailsRequest - "
  //     + JSON.stringify(fetchClassSpecificDetailsRequest));

  //   await axios.post("http://localhost:8001/api/fetchClassSpecificDetails", fetchClassSpecificDetailsRequest).then(res => {

  //     if (res.data.errors) {

  //       console.log('ReportCard - fetchClassSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
  //       return this.setState({ errors: res.data.errors });

  //     } else {

  //       this.setState({
  //         classDetails: res.data,
  //       }, () => {

  //         console.log('ReportCard - fetchClassSpecificDetails - All class details classDetails - '
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

  //           console.log('ReportCard - fetchClassSpecificDetails - arr1 - '
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
  //             allSectionCheck: false
  //           });

  //           alert("Subjects are not same for all the sections!"
  //             + "\nFYI, section " + comparingSection1 + " and " + comparingSection2 + " have different subjects."
  //             + "\nPlease schedule exam at once, only for the sections which have same subjects."
  //             + "\nSchedule separately for rest sections.");

  //         } else {

  //           console.log("ReportCard - fetchClassSpecificDetails - this.state.classDetails[0].subjects - " + JSON.stringify(this.state.classDetails[0].subjects));

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

  //           console.log("1 ReportCard - fetchClassSpecificDetails - subjectArray - " + this.state.subjectArray
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
      showStudentNamesFlag: false,
      selectedExamDetails: {},
      showReportCardFlag: false,
      selectedSection: "",
      selectedSectionLabelValue: []
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
      selectedSectionLabelValue: [],
    }, () => {


      this.fetchExamDetailsOnInput();

      console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp
        + " \nsectionLabelValueArray - " + JSON.stringify(this.state.sectionLabelValueArray));
    })
  }

  sectionChangeHandler = (newValue, actionMeta) => {

    this.setState({
      showStudentNamesFlag: true,
      selectedExamDetails: { examName: "" },
      showReportCardFlag: false,
      selectedStudentLabelValue: {}
    });

    console.log("ReportCard - sectionChangeHandler - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);

    this.setState({
      selectedSection: newValue.value,
      selectedSectionLabelValue: newValue,
    }, () => {
      console.log("ReportCard - sectionChangeHandler - selectedSectionLabelValue - " + JSON.stringify(this.state.selectedSectionLabelValue));
      console.log("\nReportCard - sectionChangeHandler - selected class - " + JSON.stringify(this.state.class)
        + " selected section - " + this.state.selectedSection);

      this.fetchClassSpecificDetails();
    });

  };

  studentChangeHandler = (newValue, actionMeta) => {

    this.setState({
      selectedExamDetails: { examName: "" },
      showReportCardFlag: true
    });

    console.log("ReportCard - studentChangeHandler - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);

    var username = newValue.value.split("(")[1].split(")")[0];

    // Fetching students marks for all the exams from the complete results object as we need to display selected students data only
    var completeResults = this.state.results;
    var studentsExamDataArray = [];
    
    for(var i=0;i<completeResults.length;i++) {

      var studentsExamData = {};

      studentsExamData.examName = completeResults[i].examName;
      studentsExamData.examFinishDate = completeResults[i].examFinishDate;

      var studentsResult = completeResults[i].studentsResult;
      for(var j=0; j<studentsResult.length; j++) {

        if(username === studentsResult[j].username) {
          studentsExamData.username = studentsResult[j].username;
          studentsExamData.firstname = studentsResult[j].firstname;
          studentsExamData.lastname = studentsResult[j].lastname;
          studentsExamData.fullName = studentsResult[j].fullName;
          studentsExamData.subjectMarksArray = studentsResult[j].subjectMarksArray;
        }
      }
      
      studentsExamDataArray.push(studentsExamData);
    }

    this.setState({
      selectedStudent: newValue.value,
      selectedStudentLabelValue: newValue,
      selectedStudentUsername : username
    }, () => {
      console.log("ReportCard - studentChangeHandler - selectedStudentUsername - " + this.state.selectedStudentUsername + " selectedStudentLabelValue - " + JSON.stringify(this.state.selectedStudentLabelValue));
      console.log("\nReportCard - studentChangeHandler - selected class - " + JSON.stringify(this.state.class)
        + " selected section - " + this.state.selectedSection);

    });

  };

  examNameChangeHandler(e) {

    this.setState({
      selectedExamDetails: {},
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

          this.fetchResultOnExamName();
        });

        console.log("Foreach setting exam details");
        return true;
      }

    });

    if (isExamNameValid) {
      console.log("Foreach setting exam details after loop");
      this.setState({
        showReportCardFlag: true
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

  async fetchResultOnExamName() {

    // Resetting studentsDataArray to clear the previous date so that only the selected records are present on the page
    this.setState({
      studentsDataArray: []
    });

    var fetchResultOnExamNameRequest = {
      "class": this.state.class,
      "section": this.state.selectedSection,
      "examName": this.state.selectedExamDetails.examName
    }

    console.log("ReportCard - fetchResultOnExamName - fetchResultOnExamNameRequest - "
      + JSON.stringify(fetchResultOnExamNameRequest));

    await axios.post("http://localhost:8001/api/fetchResultOnExamName", fetchResultOnExamNameRequest).then(resultsRes => {

      if (resultsRes.data.errors) {
        return this.setState({ errors: resultsRes.data.errors });
      } else {

        // Setting studentsDataArray from Class.attendance.studentsInfo which was earlier set from Class.studentsData table
        if (resultsRes.data.response && resultsRes.data.response.results
          && resultsRes.data.response.results[0] && resultsRes.data.response.results[0].studentsResult) {

          // Setting students data for the selected date
          this.setState({
            studentsMarksArray: resultsRes.data.response.results[0].studentsResult
          });
        }

      }
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
      "studentsData": 1,
      "results": 1
    }

    console.log("ReportCard - fetchClassSpecificDetails - fetchClassSpecificDetailsRequest - "
      + JSON.stringify(fetchClassSpecificDetailsRequest));

    await axios.post("http://localhost:8001/api/fetchClassSpecificDetails", fetchClassSpecificDetailsRequest).then(res => {

      if (res.data.errors) {

        console.log('ReportCard - fetchClassSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
        return this.setState({ errors: res.data.errors });
      } else {

        var response = res.data[0];
        console.log('ReportCard - fetchClassSpecificDetails - res.data - ' + JSON.stringify(res.data));

        this.setState({
          subjectArrayFromClass: response.subjects,
          studentsData: response.studentsData,
          results: response.results
        }, () => {

          console.log('ReportCard - fetchClassSpecificDetails - SubectsArrayFromClass - ' + JSON.stringify(this.state.subjectArrayFromClass) + ' studentsData - ' + JSON.stringify(this.state.studentsData) + ' results - ' + this.state.results);

          this.setStudentsDropDownLabelValue();
        });
      }
    });
  }

  setStudentsDropDownLabelValue() {

    var studentLabelValueArrayTemp = [];
    this.state.studentsData.forEach(element => {

      var studentLabelValueTemp = {};
      studentLabelValueTemp.label = element.firstname.charAt(0).toUpperCase() + element.firstname.slice(1) + " " + element.lastname.charAt(0).toUpperCase() + element.lastname.slice(1) + " (" + element.username + ")";
      studentLabelValueTemp.value = element.firstname.charAt(0).toUpperCase() + element.firstname.slice(1) + " " + element.lastname.charAt(0).toUpperCase() + element.lastname.slice(1) + " (" + element.username + ")";

      studentLabelValueArrayTemp.push(studentLabelValueTemp);
    });

    this.setState({
      studentLabelValueArray : studentLabelValueArrayTemp
    });

    console.log('ReportCard - setStudentsDropDownLabelValue - studentLabelValueArray - ' + JSON.stringify(this.state.studentLabelValueArray));
  }

  resetStudentsMarksArray() {

    var studentsMarksArrayTemp = [];

    // Setting dummy daata in studentsMarksArray for all students
    this.state.studentsData.forEach(element => {

      // Setting dummy marks in subjectMarks array for all students
      var subjectMarksArrayTemp = [];
      this.state.subjectArrayFromClass.forEach(element => {

        // var item = {};
        // item[element] = i++;

        var item = {};
        item[element] = null;

        subjectMarksArrayTemp.push(item);

      });
      //Setting dummy marks over

      var item = {
        username: element.username,
        firstname: element.firstname,
        lastname: element.lastname,
        fullName: element.firstname + " " + element.lastname,
        subjectMarksArray: subjectMarksArrayTemp
      };

      studentsMarksArrayTemp.push(item);

    });

    // studentsMarksArrayTemp[1].subjectMarksArray[2]["Maths"]=200;
    // studentsMarksArrayTemp[0].subjectMarksArray[1]["Science"]=100;

    this.setState({
      studentsMarksArray: studentsMarksArrayTemp
    }, () => {
      console.log('ReportCard - resetStudentsMarksArray - studentsMarksArray - ' + JSON.stringify(this.state.studentsMarksArray));
    });
  }

  reportCardSubmitHandler() {

    console.log("ReportCard reportCardSubmitHandler this.state.studentsMarksArray - " + JSON.stringify(this.state.studentsMarksArray));

    var results = {};

    results.examName = this.state.selectedExamDetails.examName;
    results.studentsResult = this.state.studentsMarksArray;

    this.setState({
      results: results
    }, () => {

      this.updateStudentsResults();
    });
  }

  async updateStudentsResults(classStr, sectionStr) {

    var updateStudentsResultsRequest = {
      "class": this.state.class,
      "section": this.state.selectedSection,
      "results": this.state.results
    }

    console.log("Attendance - updateStudentsResults - updateStudentsResultsRequest - "
      + JSON.stringify(updateStudentsResultsRequest));

    await axios.post("http://localhost:8001/api/updateStudentsResults", updateStudentsResultsRequest).then(res => {

      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      } else {

        this.setState({
          modalSuccess: true,
          modalColor: "modal-success",
          modalMessage: "Marks Added Successully!"
        });
      }
    });
  }

  studentNameChangeHandler() {


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

              <h3 align="center">Report Card</h3>
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
                    placeholder="Select Section"
                    options={this.state.sectionLabelValueArray}
                    closeMenuOnSelect={true}
                    value={this.state.selectedSectionLabelValue}
                    isSearchable={true}
                    onChange={this.sectionChangeHandler} />

                  {this.state.sectionError && (
                    <font color="red">
                      {" "}
                      <p>{this.state.sectionError}</p>
                    </font>
                  )}
                  <br />
                </div>
              }

              {this.state.showStudentNamesFlag &&
                <div>
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <b>Student</b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Select
                    id="section"
                    name="section"
                    // isMulti={true}
                    placeholder="Select Student"
                    options={this.state.studentLabelValueArray}
                    closeMenuOnSelect={true}
                    value={this.state.selectedStudentLabelValue}
                    isSearchable={true}
                    onChange={this.studentChangeHandler} />
                  {this.state.studentNameError && (
                    <font color="red">
                      {" "}
                      <p>{this.state.studentNameError}</p>
                    </font>
                  )}
                </div>
              }

              {this.state.showReportCardFlag &&
              // this.state.selectedExamDetails && this.state.selectedExamDetails.examName && 
              (
                <div>

<br/><br/>

<h3 align="center">{"Class - " + this.state.class + " " + this.state.selectedSection}</h3>

<br/>

<Row lg="2">
                              <Col>
                                {/* <Card className="mx-1">
                                  <CardBody className="p-2"> */}
                                    <InputGroup className="mb-3">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "120px" }}>
                                          Full Name
                                </InputGroupText>
                                      </InputGroupAddon>
                                      <Input
                                        type="text"
                                        name="fullName"
                                        id="fullName"
                                        value={this.state.fullName}
                                        autoComplete="fullName"
                                        onChange={this.changeHandler}
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
                                      />
                                    </InputGroup>
                                    {this.state.errors && this.state.errors.fullName && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.fullName.msg}</p>
                                      </font>
                                    )}

                                    <InputGroup className="mb-3">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "120px" }}>
                                          Parent's Name
                                </InputGroupText>
                                      </InputGroupAddon>
                                      <Input
                                        type="text"
                                        name="parentFullName"
                                        id="parentFullName"
                                        value={this.state.parentFullName}
                                        autoComplete="parentFullName"
                                        onChange={this.changeHandler}
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
                                      />
                                    </InputGroup>
                                    {this.state.errors && this.state.errors.parentFullName && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.parentFullName.msg}</p>
                                      </font>
                                    )}

                                    <InputGroup className="mb-3">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "120px" }}>
                                          Date of Birth
                                </InputGroupText>
                                      </InputGroupAddon>

                                      <DatePicker

                                        name="dob"
                                        id="dob"
                                        value={this.state.dob}
                                        onChange={date=>{this.setState({dob:date})}}
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
                                      />
                                    </InputGroup>

                                    {this.state.errors && this.state.errors.dob && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.dob.msg}</p>
                                      </font>
                                    )}

                                    <InputGroup className="mb-3">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "120px" }}>
                                          Address
                                </InputGroupText>
                                      </InputGroupAddon>
                                          <Input
                                            type="text"
                                            id="street"
                                            name="address"
                                            value={this.state.address}
                                            onChange={this.changeHandler}
                                            disabled={this.state.editMode}
                                            style={whiteTextFieldStyle}
                                          />
                                        </InputGroup>
                                        {this.state.errors &&
                                          this.state.errors.address && (
                                            <font color="red">
                                              {" "}
                                              <p>{this.state.errors.address.msg}</p>
                                            </font>
                                          )}

                                    {/* </CardBody>
                                    </Card> */}
                                    </Col>

                                    <Col></Col>
                                    </Row>

                  <div class="table-responsive" >
                    <Table bordered hover size="sm">
                      <thead>
                        <tr>
                          <th><h5>Subjects/Exams</h5></th>
                          {this.state.results.map((item, idx) => (
                            <th className="text-center"> <h5>{item.examName.charAt(0).toUpperCase() + item.examName.slice(1)}</h5></th>
                          ))}
                        </tr>
                      </thead>
                      <tbody>
                          {this.state.subjectArrayFromClass.map((subjectName, subjectId) => (

                          <tr id="addr0" key={subjectId}>

                              <th className="text-center"> <h5>{subjectName.charAt(0).toUpperCase() + subjectName.slice(1)}</h5></th>

                            {this.state.subjectArrayFromClass.map((subjectName, idx) => (
                              <td id="col0" key={subjectId} align="center" style={{ "vertical-align": "middle" }}>
                                <InputGroup >
                                  <Input
                                    name="examDuration"
                                    type="text"
                                    className="form-control"
                                    value={subjectName}
                                    onChange={this.marksChangeHandler(idx, subjectId, subjectName)}
                                    style={{ textAlign: 'center' }}
                                    id="examDuration"
                                  // size="lg"
                                  />
                                </InputGroup>
                              </td>
                            ))}
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

                  {/* {this.state.insertExamDetailsErrorMessage && (
                    <font color="red">
                      {" "}
                      <p>{this.state.insertExamDetailsErrorMessage}</p>
                    </font>
                  )} */}
                  <Row>
                    <Col>
                      {!this.state.loader && <Button
                        onClick={this.reportCardSubmitHandler}
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

export default ReportCard;

