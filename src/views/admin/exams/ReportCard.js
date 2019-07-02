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

      results: [],
      examDetails: [],
      reportCardData: {},

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
    this.toggleTabs = this.toggleTabs.bind(this);
    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);
    this.fetchAllExamDetailsForSelectedSection = this.fetchAllExamDetailsForSelectedSection.bind(this);
    this.resetStudentsMarksArray = this.resetStudentsMarksArray.bind(this);
    this.reportCardSubmitHandler = this.reportCardSubmitHandler.bind(this);
    this.fetchResultOnExamName = this.fetchResultOnExamName.bind(this);
    this.setStudentsDropDownLabelValue = this.setStudentsDropDownLabelValue.bind(this);
    this.studentChangeHandler = this.studentChangeHandler.bind(this);
    this.organizeFinalDataFromExamDetailsAndResults = this.organizeFinalDataFromExamDetailsAndResults.bind(this);

    // Calling method on page load to load all classes and sections for the drop down
    this.fetchAllClassesAndSections();
  }

  /**
   * Fetching exam details
   */
  fetchAllExamDetailsForSelectedSection() {

    var fetchExamDetailsOnInputRequest = {
      "examNameArray": this.state.examsAssignedToThisClass,
      "className": this.state.class
    }

    axios
      .post("http://localhost:8001/api/fetchExamDetailsOnInput", fetchExamDetailsOnInputRequest)
      .then(result => {

        console.log("ReportCard - fetchAllExamDetailsForSelectedSection - fetchExamDetailsOnInput exam details - " + JSON.stringify(result.data));

        if (result.errors) {
          return this.setState({ errors: result.errors });

        } else if (!(typeof (result.data) === 'undefined' || result.data === null)) {

          var examDetailsArr = [];

          result.data.forEach(ed => {

            //classWiseExamDetailsArray[0] is used as we are passing class in input so the result will only be returned for this particular class, which means the length will always be 1.

            var classWiseExamDetailsArray = ed.classWiseExamDetailsArray[0];
            var sectionWiseExamDetailsArray = classWiseExamDetailsArray.sectionWiseExamDetailsArray;

            if (!(typeof (sectionWiseExamDetailsArray) === 'undefined' || sectionWiseExamDetailsArray === null)) {

              sectionWiseExamDetailsArray.forEach(element => {

                // Comparing with selected section
                if (element.section === this.state.selectedSection) {

                  var examDetails = {};

                  examDetails.examName = ed.examName;
                  examDetails.examDescription = ed.examDescription;
                  examDetails.percentageShareInFinalResult = classWiseExamDetailsArray.percentageShareInFinalResult;
                  examDetails.isMandatryToAttendForFinalResult = classWiseExamDetailsArray.isMandatryToAttendForFinalResult;
                  examDetails.examDetails = element.examDetails;

                  examDetailsArr.push(examDetails);

                }
              });
            }

          });

          this.setState({
            examDetails: examDetailsArr
          }, () => {
            console.log('ReportCard - fetchAllExamDetailsForSelectedSection - examDetails - ' + JSON.stringify(this.state.examDetails));
          });

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

          var examsAssignedToThisClass = [];
          result.data.forEach(examDetail => {

            examsAssignedToThisClass.push(examDetail.examName);
          });

          this.setState({
            examDetailsArray: result.data,
            examsAssignedToThisClass: examsAssignedToThisClass
          }, () => {

            console.log('ReportCard - fetchExamDetailsOnInput - examDetailsArray for class - ' + this.state.class + ' are \n' + JSON.stringify(this.state.examDetailsArray) + "\nexamsAssignedToThisClass - " + this.state.examsAssignedToThisClass);
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

    sectionLabelValueArrayTemp.sort((a, b) => {
      if (a.value < b.value)
        return -1;
      if (a.value > b.value)
        return 1;
      return 0;
    });

    sectionLabelValueArrayTemp.sort((a, b) => {
      if (a.label < b.label)
        return -1;
      if (a.label > b.label)
        return 1;
      return 0;
    });

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

      this.fetchAllExamDetailsForSelectedSection();
    });

  };

  studentChangeHandler = (newValue, actionMeta) => {

    this.setState({
      selectedExamDetails: { examName: "" },
      showReportCardFlag: true
    });

    console.log("ReportCard - studentChangeHandler - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);
    console.log("ReportCard - studentChangeHandler - results before modification - " + JSON.stringify(this.state.results));

    var username = newValue.value.split("(")[1].split(")")[0];

    var resultsTemp = this.state.results;

    // var sdTemp = this.state.results[0].studentsResult[0];
    // resultsTemp.username = sdTemp.username;
    // resultsTemp.firstname = sdTemp.firstname;
    // resultsTemp.lastname = sdTemp.lastname;
    // resultsTemp.fullName = sdTemp.fullName;

    console.log("ReportCard - studentChangeHandler - resultTemp - " + JSON.stringify(resultsTemp));

    resultsTemp.forEach(res => {

      res.studentsResult.forEach(sr => {

        if (sr.username === username) {
          res.studentsResult.length = 0;

          // delete sr["username"];
          // delete sr["firstname"];
          // delete sr["lastname"];
          // delete sr["fullName"];

          res.studentsResult.push(sr);

          console.log("ReportCard - studentChangeHandler - Removed all elements from studentsResult and pushed details only for the selected student - " + JSON.stringify(sr));
        }
      });
    });

    this.setState({
      results: resultsTemp,
      selectedStudent: newValue.value,
      selectedStudentLabelValue: newValue,
      selectedStudentUsername: username,
    }, () => {
      console.log("ReportCard - studentChangeHandler - selectedStudentUsername - " + this.state.selectedStudentUsername + "\nselectedStudentLabelValue - " + JSON.stringify(this.state.selectedStudentLabelValue));
      console.log("\nReportCard - studentChangeHandler - selected class - " + JSON.stringify(this.state.class)
        + " selected section - " + this.state.selectedSection);
      console.log("ReportCard - studentChangeHandler - results AFTER modification - " + JSON.stringify(this.state.results));

      // Merging examDetails and results data to have all the results data in one variable
      this.organizeFinalDataFromExamDetailsAndResults();

    });

  };

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
          subjectArrayFromClass: response.subjects.sort(),
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
      studentLabelValueArray: studentLabelValueArrayTemp
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

  organizeFinalDataFromExamDetailsAndResults() {

    var reportCardData = {};

    console.log("ReportCard - organizeFinalDataFromExamDetailsAndResults - examDetails - " + JSON.stringify(this.state.examDetails) + "\nresults - " + JSON.stringify(this.state.results));

    var sdTemp = this.state.results[0].studentsResult[0];

    reportCardData.username = sdTemp.username;
    reportCardData.firstname = sdTemp.firstname;
    reportCardData.lastname = sdTemp.lastname;
    reportCardData.fullName = sdTemp.fullName;
    reportCardData.className = this.state.class;
    reportCardData.section = this.state.selectedSection;

    var r = this.state.results;
    var ed = this.state.examDetails;

    var examDetailsArr = [];
    for (var i = 0; i < r.length; i++) {

      for (var j = 0; j < ed.length; j++) {

        if (r[i].examName === ed[j].examName) {

          console.log("ReportCard - organizeFinalDataFromExamDetailsAndResults - r[i] - " + JSON.stringify(r[i]) + "ed[j] - " + JSON.stringify(ed[j]));

          var examDetailsTemp = {};
          var subjectDetailsArr = [];

          examDetailsTemp.examName = ed[j].examName;
          examDetailsTemp.examDescription = ed[j].examDescription;
          examDetailsTemp.examDescription = ed[j].examDescription;
          examDetailsTemp.isMandatryToAttendForFinalResult = ed[j].isMandatryToAttendForFinalResult;
          examDetailsTemp.examFinishDate = r[i].examFinishDate;

          var totalObtainedMarks = 0;
          var totalMarks = 0;
          var examResultFlag = true;

          // ed[j].examDetails.forEach(details => {
          for (var k = 0; k < ed[j].examDetails.length; k++) {

            var subejctDetailsTemp = {};

            subejctDetailsTemp.subjectName = ed[j].examDetails[k].subject;
            subejctDetailsTemp.totalMarks = ed[j].examDetails[k].totalMarks;
            subejctDetailsTemp.passingMarks = ed[j].examDetails[k].passingMarks;
            subejctDetailsTemp.includeInResultFlag = ed[j].examDetails[k].includeInResultFlag;
            subejctDetailsTemp.examDate = ed[j].examDetails[k].examDate;
            subejctDetailsTemp.startMoment = ed[j].examDetails[k].startMoment;
            subejctDetailsTemp.endMoment = ed[j].examDetails[k].endMoment;
            subejctDetailsTemp.examDuration = ed[j].examDetails[k].examDuration;

            var count = 1;

            // r[i].studentsResult[0].subjectMarksArray.forEach(e => {
            // Loop for fetching obtained marks from results array.. loop will end as soon as the data is fetched.. it will not continue after that.
            for (var l = 0; l < r[i].studentsResult[0].subjectMarksArray.length; l++) {

              console.log("ReportCard - organizeFinalDataFromExamDetailsAndResults - all keys - " + JSON.stringify(r[i].studentsResult[0].subjectMarksArray[l]) + " count - " + count++);

              var keys = Object.keys(r[i].studentsResult[0].subjectMarksArray[l]);

              console.log("ReportCard - organizeFinalDataFromExamDetailsAndResults - 1 subject from key - " + keys + " value - " + r[i].studentsResult[0].subjectMarksArray[l][keys] + " details.subject - " + ed[j].examDetails[k].subject);

              if (keys[0] === ed[j].examDetails[k].subject) {

                subejctDetailsTemp.obtainedMarks = r[i].studentsResult[0].subjectMarksArray[l][keys];

                // Setting subject result based on obtained marks and passing marks
                if ((parseInt(subejctDetailsTemp.obtainedMarks) - parseInt(subejctDetailsTemp.passingMarks)) >= 0) {
                  subejctDetailsTemp.subjectResult = "PASS";
                } else {
                  subejctDetailsTemp.subjectResult = "FAIL";
                  examResultFlag = false;
                }

                // Setting total marks obtained and total passing marks
                if (subejctDetailsTemp.includeInResultFlag) {
                  totalObtainedMarks = totalObtainedMarks + parseInt(subejctDetailsTemp.obtainedMarks);
                  totalMarks = totalMarks + parseInt(subejctDetailsTemp.totalMarks);
                }

                console.log("ReportCard - organizeFinalDataFromExamDetailsAndResults - subject from key - " + keys + " value - " + r[i].studentsResult[0].subjectMarksArray[l][keys] + " details.subject - " + ed[j].examDetails[k].subject + "\ntotalObtainedMarks - " + totalObtainedMarks + "\ntotalMarks - " + totalMarks + "\nsubejctDetailsTemp.includeInResultFlag - " + subejctDetailsTemp.includeInResultFlag);

                break;
              }
              console.log("ReportCard - organizeFinalDataFromExamDetailsAndResults - key - " + keys + " value - " + r[i].studentsResult[0].subjectMarksArray[l][keys]);

            }

            console.log("ReportCard - organizeFinalDataFromExamDetailsAndResults - subjectMarksArray obtainedMarks - " + JSON.stringify(r[i].studentsResult[0].subjectMarksArray) + "\nsubejctDetailsTemp.subjectName - " + subejctDetailsTemp.subjectName + "\ned[j].examName - " + ed[j].examName);

            subjectDetailsArr.push(subejctDetailsTemp);
          }

          examDetailsTemp.subjectDetailsArr = subjectDetailsArr;
          examDetailsTemp.totalObtainedMarks = totalObtainedMarks;
          examDetailsTemp.totalMarks = totalMarks;
          examDetailsTemp.examResultFlag = examResultFlag;

          examDetailsArr.push(examDetailsTemp);

          break;

        }
      }
    }

    reportCardData.examDetailArr = examDetailsArr;

    this.setState({
      reportCardData: reportCardData
    }, () => {

      console.log("ReportCard - organizeFinalDataFromExamDetailsAndResults - reportCardData - " + JSON.stringify(this.state.reportCardData));

      /*
       * Checking if the subjects are same for all the exams so that the result can be guaranteed to be proper, without discrepencies. 
       */
      var edArr = this.state.reportCardData.examDetailArr;

      // First loop for comparing consecutive exams for no of subject and order of subjects
      for (var i = 0; i < edArr.length - 1; i++) {

        var sdArr1 = edArr[i].subjectDetailsArr;
        var sdArr2 = edArr[i + 1].subjectDetailsArr;

        // Loop for comparing subjects.
        if (sdArr1.length === sdArr2.length) {
          for (var j = 0; j < sdArr1.length; j++) {

            if (sdArr1[j].subjectName !== sdArr2[j].subjectName) {

              alert("Order of subject is not same in the reportCardData array, result can not be correct, please check DB for details.");
            }
          }
        } else {
          alert("Number of subject are not same for all the exams! Result is not correct, please check DB for details.");
        }
      }
    });

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

                    <br /><br />

                    <h3 align="center">{"Class - " + this.state.class + " " + this.state.selectedSection}</h3>

                    <br />

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
                            onChange={date => { this.setState({ dob: date }) }}
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

                    {this.state.reportCardData && this.state.reportCardData.examDetailArr && (
                      <div class="table-responsive" >
                        <Table bordered hover size="sm">
                          <thead>
                            <tr>
                              <th><h5>Subjects/Exams</h5></th>
                              {this.state.reportCardData.examDetailArr.map((examdetail, examdetailId) => (
                                <th className="text-center"> <h5>{examdetail.examName.charAt(0).toUpperCase() + examdetail.examName.slice(1)}</h5></th>
                              ))}
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.reportCardData.examDetailArr[0].subjectDetailsArr.map((subject, subjectId) => (

                              <tr id="addr0" key={subjectId}>

                                <th className="text-center"> <h5>{subject.subjectName.charAt(0).toUpperCase() + subject.subjectName.slice(1)}</h5></th>

                                {this.state.reportCardData.examDetailArr.map((examColumn, examColumnId) => (
                                  // {/* {this.state.results.map((subjectName, idx) => ( */ }
                                  // examColumn.subjectDetailsArr[subjectId].subjectName!==subject.subjectName?alert("Data mismatch - in examDetails and results are not same or are not in the same order.Please check the logs."):null

                                  < td id="col0" key={examColumnId} align="center" style={{ "vertical-align": "middle" }}>
                                    <InputGroup >
                                      <Input
                                        name="examDuration"
                                        type="text"
                                        className="form-control"
                                        // value={parseInt(subject.obtainedMarks)-parseInt(subject.totalMarks)<0?(subject.obtainedMarks + " / " + subject.totalMarks + " " + subject.subjectName) : (subject.obtainedMarks + " / " + subject.totalMarks) + " (FAIL)"}

                                        value={examColumn.subjectDetailsArr[subjectId].subjectResult === "PASS" ? (examColumn.subjectDetailsArr[subjectId].obtainedMarks + " / " + examColumn.subjectDetailsArr[subjectId].totalMarks + " " + examColumn.subjectDetailsArr[subjectId].subjectName) : (examColumn.subjectDetailsArr[subjectId].obtainedMarks + " / " + examColumn.subjectDetailsArr[subjectId].totalMarks + " " + examColumn.subjectDetailsArr[subjectId].subjectName + " (FAIL - " + examColumn.subjectDetailsArr[subjectId].passingMarks + ")")}

                                        // value={(examColumn.subjectDetailsArr[subjectId].obtainedMarks + " / " + examColumn.subjectDetailsArr[subjectId].totalMarks + " " + examColumn.subjectDetailsArr[subjectId].subjectName + " " + examColumn.subjectDetailsArr[subjectId].subjectResult) }

                                        // onChange={this.marksChangeHandler(examColumnId, subjectId, subject.subjectName)}
                                        style={{ textAlign: 'center' }}
                                        id="examDuration"
                                        disabled="disabled"
                                      // size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                ))}
                              </tr>
                            ))}

                            <tr>

                              <th className="text-center"> <h5>Total</h5></th>

                              {this.state.reportCardData.examDetailArr.map((examColumn, examColumnId) => (
                                // {/* {this.state.results.map((subjectName, idx) => ( */ }
                                // examColumn.subjectDetailsArr[subjectId].subjectName!==subject.subjectName?alert("Data mismatch - in examDetails and results are not same or are not in the same order.Please check the logs."):null

                                < td id="col0" key={examColumnId} align="center" style={{ "vertical-align": "middle" }}>
                                {/* {examColumn.examResultFlag ? (examColumn.totalObtainedMarks + " / " + examColumn.totalMarks) : ((examColumn.totalObtainedMarks + " / " + examColumn.totalMarks) + " (FAIL)")} */}
                                  <InputGroup >
                                    <Input
                                      name="totalObtainedMarks"
                                      type="text"
                                      className="form-control"
                                      // value={parseInt(subject.obtainedMarks)-parseInt(subject.totalMarks)<0?(subject.obtainedMarks + " / " + subject.totalMarks + " " + subject.subjectName) : (subject.obtainedMarks + " / " + subject.totalMarks) + " (FAIL)"}

                                      value={examColumn.examResultFlag ? (examColumn.totalObtainedMarks + " / " + examColumn.totalMarks) : ((examColumn.totalObtainedMarks + " / " + examColumn.totalMarks) + " (FAIL)")}

                                      // value={(examColumn.subjectDetailsArr[subjectId].obtainedMarks + " / " + examColumn.subjectDetailsArr[subjectId].totalMarks + " " + examColumn.subjectDetailsArr[subjectId].subjectName + " " + examColumn.subjectDetailsArr[subjectId].subjectResult) }

                                      // onChange={this.marksChangeHandler(examColumnId, subjectId, subject.subjectName)}
                                      style={{ textAlign: 'center' }}
                                      disabled="disabled"
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
                                </td>
                              ))}
                            </tr>
                          </tbody>
                        </Table>
                      </div>
                    )}
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
      </div >
    );
  }
}

export default ReportCard;

