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



class ScheduleExam extends Component {

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
      selectedSectionsArray: [],
      selectedSectionsLabelValueArray: [],
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

      // selectedVenueLabelValue: [],
      // selectedVenue: "",

      venueLabelValueArray: [
        { label: "Hall 1", value: "Hall 1" },
        { label: "Hall 2", value: "Hall 2" },
        { label: "Hall 3", value: "Hall 3" },
        { label: "Hall 4", value: "Hall 4" }
      ]

    };

    this.fetchAllClassesAndSections = this.fetchAllClassesAndSections.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.fetchClassSpecificDetails = this.fetchClassSpecificDetails.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.examNameChangeHandler = this.examNameChangeHandler.bind(this);
    this.changeHandler = this.changeHandler.bind(this);
    this.allSectionCheckHandler = this.allSectionCheckHandler.bind(this);
    this.sectionMenuCloseHandler = this.sectionMenuCloseHandler.bind(this);
    this.toggleTabs = this.toggleTabs.bind(this);
    this.isIncludeInResultHandler = this.isIncludeInResultHandler.bind(this);
    this.onChange = this.onChange.bind(this);
    this.isMandatryToAttendForFinalResultChangeHandler = this.isMandatryToAttendForFinalResultChangeHandler.bind(this);

    // this.setStartMoment = this.setStartMoment.bind(this);
    // this.setEndMoment = this.setEndMoment.bind(this);
    // this.setExamDuration = this.setExamDuration.bind(this);

    this.totalMarksChangeHandler = this.totalMarksChangeHandler.bind(this);

    this.fetchAllClassesAndSections();
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

            console.log('ScheduleExam - fetchExamDetailsOnInput - exam details for class - ' + this.state.selectedClass + ' are \n' + JSON.stringify(this.state.examDetailsArray));
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

          console.log('ScheduleExam - fetchAllClassesAndSections - All class details - ' + JSON.stringify(this.state.classesAndSections));

          // Fetching unique classes from the classesAndSections 
          this.fetchClasses();
        });

      }
    });
  }

  async fetchClassSpecificDetails() {

    this.setState({
      subjectArray: [],
      emailArray: []
    });

    var fetchClassSpecificDetailsRequest = {
      "class": this.state.class,
      "sectionArray": this.state.selectedSectionsArray,
      "subjects": 1,
    }

    console.log("ScheduleExam - fetchClassSpecificDetails - fetchClassSpecificDetailsRequest - "
      + JSON.stringify(fetchClassSpecificDetailsRequest));

    await axios.post("http://localhost:8001/api/fetchClassSpecificDetails", fetchClassSpecificDetailsRequest).then(res => {

      if (res.data.errors) {

        console.log('ScheduleExam - fetchClassSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
        return this.setState({ errors: res.data.errors });

      } else {

        this.setState({
          classDetails: res.data,
        }, () => {

          console.log('ScheduleExam - fetchClassSpecificDetails - All class details classDetails - '
            + JSON.stringify(this.state.classDetails)
            + " subjectArray - " + this.state.subjectArray);

          var subjectSameForAllSectionsFlag = true;
          var comparingSection1;
          var comparingSection2;
          for (var i = 0; i < (this.state.classDetails.length - 1) && subjectSameForAllSectionsFlag; i++) {

            comparingSection1 = this.state.classDetails[i].section;
            comparingSection2 = this.state.classDetails[i + 1].section;

            var arr1 = this.state.classDetails[i].subjects.sort();
            var arr2 = this.state.classDetails[i + 1].subjects.sort();

            console.log('ScheduleExam - fetchClassSpecificDetails - arr1 - '
              + arr1
              + " \narr2 - " + arr2);

            if (arr1.length !== arr2.length) subjectSameForAllSectionsFlag = false;

            for (var j = 0; j < arr1.length && subjectSameForAllSectionsFlag; j++) {

              if (arr1[j] !== arr2[j]) {
                subjectSameForAllSectionsFlag = false;
                break;
              }
            }
            //subjectSameForAllSectionsFlag = true;
          }

          if (!subjectSameForAllSectionsFlag) {

            this.setState({
              selectedSectionsArray: [],
              selectedSectionsLabelValueArray: [],
              disableSectionsFlag: false,
              allSectionCheck: false
            });

            alert("Subjects are not same for all the sections!"
              + "\nFYI, section " + comparingSection1 + " and " + comparingSection2 + " have different subjects."
              + "\nPlease schedule exam at once, only for the sections which have same subjects."
              + "\nSchedule separately for rest sections.");

          } else {

            console.log("ScheduleExam - fetchClassSpecificDetails - this.state.classDetails[0].subjects - " + JSON.stringify(this.state.classDetails[0].subjects));

            /*
              Setting temporary inputExamDataArray for each subject
              */
            var startMoment = new Date(new Date().setHours(12, 0, 0, 0));
            var endMoment = new Date(new Date().setHours(12, 0, 0, 0));
            var examDate = new Date(new Date().setHours(5, 30, 0, 0));

            var inputExamDataArrayTemp = [];
            this.state.classDetails[0].subjects.forEach(element => {

              const item = {
                subject: element,
                totalMarks: "",
                passingMarks: "",
                includeInResultFlag: true,
                examDate: examDate,
                startMoment: startMoment,
                endMoment: endMoment,
                examDuration: 0,
                selectedVenueLabelValue: [],
                selectedVenue: "",
              };

              inputExamDataArrayTemp.push(item);

            });

            console.log("exam details array - " + JSON.stringify(inputExamDataArrayTemp));
            this.setState({
              inputExamDataArray: inputExamDataArrayTemp,
              subjectArray: this.state.classDetails[0].subjects,
            });

            console.log("1 ScheduleExam - fetchClassSpecificDetails - subjectArray - " + this.state.subjectArray
              + " \nthis.state.classDetails[0].subjects - " + JSON.stringify(this.state.classDetails[0].subjects));
          }
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
    var selectedClass = e.currentTarget.value;

    this.setState({
      class: selectedClass,
      showTabsFlag: false,
      showExamNamesFlag: false,
      selectedExamDetails: []
    });

    var sectionArrayTemp = [];
    var sectionLabelValueArray = [];
    this.state.classesAndSections.forEach(element => {
      if (element["class"] === selectedClass) {

        var sectionLabelValue = {};

        var section = element["section"];
        sectionArrayTemp.push(section);

        sectionLabelValue.value = section;
        sectionLabelValue.label = section;

        sectionLabelValueArray.push(sectionLabelValue);

      }
    });

    // Sorting array alphabetically
    sectionArrayTemp.sort();

    this.setState({
      sectionArray: sectionArrayTemp,
      sectionLabelValueArray: sectionLabelValueArray,
      sectionView: true,
      selectedSectionsArray: [],
      selectedSectionsLabelValueArray: [],
      disableSectionsFlag: false,
      allSectionCheck: false,
      showTabsFlag: false
    }, () => {


      this.fetchExamDetailsOnInput();

      console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp
        + " \nsectionLabelValueArray - " + JSON.stringify(this.state.sectionLabelValueArray));
    })
  }

  sectionChangeHandler = (newValue, actionMeta) => {

    console.log("ScheduleExam - sectionChangeHandler - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);

    var sectionArrayTemp = [];
    newValue.forEach(element => {

      sectionArrayTemp.push(element.value);
    });

    this.setState({
      selectedSectionsArray: sectionArrayTemp.sort(),
      selectedSectionsLabelValueArray: newValue,
    }, () => {
      console.log("ScheduleExam - sectionChangeHandler - selectedSectionsLabelValueArray - " + JSON.stringify(this.state.selectedSectionsLabelValueArray));
      console.log("\nScheduleExam - sectionChangeHandler - selected class - " + JSON.stringify(this.state.class)
        + " selected sections - " + this.state.selectedSectionsArray);
    });

  };

  allSectionCheckHandler(e) {

    if (e.target.checked) {
      this.setState({
        allSectionCheck: true,
        selectedSectionsArray: this.state.sectionArray,
        selectedSectionsLabelValueArray: this.state.sectionLabelValueArray,
        disableSectionsFlag: true,
        showExamNamesFlag: true
      }, () => {

        // Fetching subject details for selected sections
        this.fetchClassSpecificDetails();

        console.log("\nScheduleExam - sectionChangeHandler - selected class - " + JSON.stringify(this.state.class)
          + " selected sections - " + this.state.selectedSectionsArray);
      });
    } else {
      this.setState({
        allSectionCheck: false,
        disableSectionsFlag: false
      }, () => {
        console.log("\nScheduleExam - sectionChangeHandler - selected class - " + JSON.stringify(this.state.class)
          + " selected sections - " + this.state.selectedSectionsArray);
      })
    }
  }

  // venueChangeHandler = (newValue, actionMeta) => {

  //   console.log("ScheduleExam - venueChangeHandler - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);



  //   if (typeof (this.state.inputExamDataArray[idx]).selectedVenueLabelValue === 'undefined' || this.state.inputExamDataArray[idx].selectedVenueLabelValue === null) {
  //     temp[idx]["selectedVenueLabelValue"] = new Date().setHours(5, 30, 0, 0);
  //   }


  //   var temp = this.state.inputExamDataArray;
  //   if (typeof (newValue) === 'undefined' || newValue === null) {

  //     this.setState({
  //       temp[idx]["selectedVenueLabelValue"] = newValue,
  //       temp[idx]["selectedVenue"] = newValue.value,
  //     }, () => {
  //       console.log("ScheduleExam - selectedVenueLabelValue - " + JSON.stringify(this.state.selectedVenueLabelValue) + " selectedVenue - " + this.state.selectedVenue);
  //     });
  //   }

  // };

  examNameChangeHandler(e) {

    var examName = e.currentTarget.value;

    this.state.examDetailsArray.forEach(element => {

      var selectedExamDetails = {};

      if (examName === element.examName) {

        selectedExamDetails.examName = element.examName;
        selectedExamDetails.examDescription = element.examDescription;
        selectedExamDetails.percentageShareInFinalResult = element.percentageShareInFinalResult;
        selectedExamDetails.applicableForClasses = element.applicableForClasses;
        selectedExamDetails.isMandatryToAttendForFinalResult = element.isMandatryToAttendForFinalResult;

        this.setState({
          selectedExamDetails: selectedExamDetails
        });

        console.log("Foreach setting exam details");
        return true;
      }

    });

    console.log("Foreach setting exam details after loop");
    this.setState({
      showTabsFlag: true
    });

  }

  async sectionMenuCloseHandler() {

    if (this.state.selectedSectionsArray.length > 0) {
      this.fetchClassSpecificDetails();
      this.setState({
        showExamNamesFlag: true
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

  /**
   * @description Called when the change event is triggered for isMandatryToAttendForFinalResultChangeHandler appswith.
   * @param {*} e
   */
  isIncludeInResultHandler(e) {
    // console.log("Name: "+e.target.name +" Value: "+ e.target.checked);
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

  /**
   * For TimePicker
   */
  onChange(time, timeString) {
    console.log(time, timeString);
  }

  // setStartMoment(idx) {

  //   var temp = this.state.inputExamDataArray;

  //   console.log('ScheduleExam - setStartMoment - this.state.inputExamDataArray[idx]) - '  + this.state.inputExamDataArray[idx]);
  //   if (this.state.inputExamDataArray) {

  //     // temp[idx]["startMoment"] = new Date().setHours(12, 0, 0, 0);
  //     // this.setState({ inputExamDataArray: temp });
  //     return new Date().setHours(12, 0, 0, 0);

  //   } else {

  //     if (typeof (this.state.inputExamDataArray[idx].startMoment) === 'undefined' || this.state.inputExamDataArray[idx].startMoment === null) {
  //       temp[idx]["startMoment"] = new Date().setHours(12, 0, 0, 0);
  //       this.setState({ inputExamDataArray: temp });
  //       return new Date().setHours(12, 0, 0, 0);
  //     } else {
  //       temp[idx]["startMoment"] = this.state.inputExamDataArray[idx].startMoment;
  //       this.setState({ inputExamDataArray: temp });
  //       return this.state.inputExamDataArray[idx].startMoment;
  //     }
  //   }
  // }

  // setEndMoment(idx) {

  //   var temp = this.state.inputExamDataArray;

  //   if (this.state.inputExamDataArray) {

  //     // temp[idx]["endMoment"] = new Date().setHours(12, 0, 0, 0);
  //     // this.setState({ inputExamDataArray: temp });
  //     return new Date().setHours(12, 0, 0, 0);

  //   } else {

  //     if (typeof (this.state.inputExamDataArray[idx].endMoment) === 'undefined' || this.state.inputExamDataArray[idx].endMoment === null) {
  //       temp[idx]["endMoment"] = new Date().setHours(12, 0, 0, 0);
  //       this.setState({ inputExamDataArray: temp });
  //       return new Date().setHours(12, 0, 0, 0);
  //     } else {
  //       temp[idx]["endMoment"] = this.state.inputExamDataArray[idx].endMoment;
  //       this.setState({ inputExamDataArray: temp });
  //       return this.state.inputExamDataArray[idx].endMoment;
  //     }
  //   }
  // }

  // setExamDuration(idx) {

  //   var temp = this.state.inputExamDataArray;


  //   if (this.state.inputExamDataArray) {

  //     // temp[idx]["examDuration"] = new Date().setHours(12, 0, 0, 0);
  //     // this.setState({ inputExamDataArray: temp });
  //     return new Date().setHours(12, 0, 0, 0);

  //   } else {

  //     if (typeof (this.state.inputExamDataArray[idx].examDuration) === 'undefined' || this.state.inputExamDataArray[idx].examDuration === null) {
  //       temp[idx]["examDuration"] = this.state.defaultExamDuration;
  //       this.setState({ inputExamDataArray: temp });
  //       return this.state.defaultExamDuration;
  //     } else {
  //       temp[idx]["examDuration"] = this.state.inputExamDataArray[idx].examDuration;
  //       this.setState({ inputExamDataArray: temp });
  //       return this.state.inputExamDataArray[idx].examDuration;
  //     }
  //   }
  // }

  totalMarksChangeHandler(idx) {


    if (typeof (this.state.inputExamDataArray[idx]) === 'undefined' || this.state.inputExamDataArray[idx] === null) {

      var examDate = new Date().setHours(5, 30, 0, 0);
      var startMoment = new Date().setHours(12, 0, 0, 0);
      var endMoment = new Date().setHours(12, 0, 0, 0);

    } else {

      var temp = this.state.inputExamDataArray;

      if (typeof (this.state.inputExamDataArray[idx]).examDate === 'undefined' || this.state.inputExamDataArray[idx].examDate === null) {
        temp[idx]["examDate"] = new Date().setHours(5, 30, 0, 0);
      }
      if (typeof (this.state.inputExamDataArray[idx]).startMoment === 'undefined' || this.state.inputExamDataArray[idx].startMoment === null) {
        temp[idx]["startMoment"] = new Date().setHours(12, 0, 0, 0);
      }
      if (typeof (this.state.inputExamDataArray[idx]).endMoment === 'undefined' || this.state.inputExamDataArray[idx].endMoment === null) {
        temp[idx]["endMoment"] = new Date().setHours(12, 0, 0, 0);
      }

    }
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

  /**
   * @description Called when the change event is triggered for isMandatryToAttendForFinalResultChangeHandler appswith.
   * @param {*} e
   */
  isMandatryToAttendForFinalResultChangeHandler(e) {
    // console.log("Name: "+e.target.name +" Value: "+ e.target.checked);

    var selectedExamDetails = this.state.selectedExamDetails;

    selectedExamDetails[e.target.name] = e.target.checked;

    this.setState({
      selectedExamDetails: selectedExamDetails
    });
  }

  scheduleExamSubmitHandler() {

    console.log("BEFORE - " + JSON.stringify(this.state.inputExamDataArray))

    var temp = this.state.inputExamDataArray;

    temp.class = this.state.class;
    temp.section = this.state.section;

    this.setState({
      inputExamDataArray : temp
    }, console.log("AFTER - " + JSON.stringify(this.state.inputExamDataArray)));

    
  }

  render() {

    return (
      <div>
        <Container >

          <Row>
            <Col sm="12">
              {this.state.success && (
                <Modal
                  isOpen={this.state.modalSuccess}
                  className={"modal-success " + this.props.className}
                  toggle={this.toggleSuccess}
                >
                  <ModalHeader toggle={this.toggleSuccess}>
                    {this.state.modalMessage}
                  </ModalHeader>
                </Modal>
              )}

              <h3 align="center"> Schedule Exam</h3>
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
                      <b>Section(s)</b>
                    </InputGroupText>
                  </InputGroupAddon>
                  <Select
                    id="section"
                    name="section"
                    isMulti={true}
                    placeholder="Select Single or Multiple Section(s)"
                    options={this.state.sectionLabelValueArray}
                    closeMenuOnSelect={false}
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

                  <FormGroup check inline>
                    <Input
                      className="form-check-input"
                      type="checkbox"
                      id="allSectionCheck"
                      style={{ height: "35px", width: "25px" }}
                      name="allSectionCheck"
                      checked={this.state.allSectionCheck}
                      onChange={this.allSectionCheckHandler}
                    />
                    <Label
                      className="form-check-label"
                      check
                      htmlFor="inline-checkbox1"
                    >
                      For All Sections
                                    </Label>
                  </FormGroup>
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

                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <b>Percentage Share in Final result</b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="number"
                      // size="lg"
                      name="percentageShareInFinalResult"
                      id="percentageShareInFinalResult"
                      autoComplete="shareInFinalResult"
                      onChange={this.changeHandler}
                      value={this.state.selectedExamDetails.percentageShareInFinalResult}
                    />
                  </InputGroup>
                  {/* {this.state.examDetailsArray.percentageShareInFinalResultError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.examDetailsArray.percentageShareInFinalResultError}</p>
                              </font>
                            )} */}

                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText>
                        <b>Mandatory to Attend for Final results</b>
                      </InputGroupText>
                    </InputGroupAddon>

                    &nbsp; &nbsp;
                              <AppSwitch
                      name="isMandatryToAttendForFinalResult"
                      id="isMandatryToAttendForFinalResult"
                      size="lg"
                      className={"mx-1"}
                      variant={"3d"}
                      color={"primary"}
                      size={"sm"}
                      onChange={this.isMandatryToAttendForFinalResultChangeHandler}
                      disabled={this.state.disabled}
                      checked={this.state.selectedExamDetails.isMandatryToAttendForFinalResult}
                    />
                  </InputGroup>

                  <Nav tabs>
                    {this.state.showTabsFlag && (
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.activeTab === 'EXAM_DETAILS' })}
                          onClick={() => { this.toggleTabs('EXAM_DETAILS'); }}
                        >
                          Exam Details
                </NavLink>
                      </NavItem>
                    )}
                    {this.state.showTabsFlag && (
                      <NavItem>
                        <NavLink
                          className={classnames({ active: this.state.activeTab === 'SCHEDULER' })}
                          onClick={() => { this.toggleTabs('SCHEDULER'); }}
                        >
                          Scheduler
                </NavLink>
                      </NavItem>
                    )}
                    {/* {this.state.showTabsFlag && (
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === 'EXAM_DETAILS' })}
                        onClick={() => { this.toggleTabs('Teacher'); }}
                      >
                        Teacher
                </NavLink>
                    </NavItem>
                  )} */}
                  </Nav>

                  <TabContent activeTab={this.state.activeTab}>

                    {this.state.showTabsFlag && (
                      <TabPane tabId="EXAM_DETAILS">

                        <Table bordered hover style={{ width: "100%" }}>
                          <thead>
                            <tr style={{ 'backgroundColor': "palevioletred" }}>
                              <th className="text-center">
                                {" "}
                                <h5>Subject</h5>
                              </th>
                              <th className="text-center">
                                <h5>Total Marks</h5>{" "}
                              </th>
                              <th className="text-center">
                                <h5>Passing Marks</h5>{" "}
                              </th>
                              <th className="text-center"
                                width="3%">
                                <h5>Include in result</h5>{" "}
                              </th>
                              <th className="text-center">
                                <h5>Exam Date</h5>{" "}
                              </th>
                              <th
                                className="text-center"
                                width="24%">
                                <h5>Exam Time</h5>{" "}
                              </th>
                              {/* <th className="text-center">
                                <h5>Exam Duration (Minutes)</h5>{" "}
                              </th> */}
                              <th className="text-center"
                                width="18%" >
                                <h5>Venue</h5>{" "}
                              </th >
                              <th className="text-center"
                                width="2%">
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="checkbox"
                                    id="parentaddresscheck"
                                    // style={{ height: "35px", width: "25px", background: "white" }}
                                    name="parentaddresscheck"
                                  // checked={this.state.parentaddresscheck}
                                  // onChange={this.copyAddress}
                                  // disabled={this.state.editMode}
                                  />
                                </FormGroup>
                              </th>
                            </tr>
                          </thead>
                          <tbody>
                            {this.state.subjectArray.map((item, idx) => (
                              <tr id="addr0" key={idx}>

                                <td align="center" style={{ "vertical-align": "middle" }}>
                                  <h5> {item.charAt(0).toUpperCase() + item.slice(1)}</h5>
                                </td>

                                <td width="10%" style={{ "vertical-align": "middle" }}>
                                  <InputGroup className="mb-3">
                                    <Input
                                      name="totalMarks"
                                      type="text"
                                      className="form-control"
                                      value={this.state.inputExamDataArray[idx].totalMarks}
                                      // value={this.state.inputExamDataArray[idx].totalMarks}
                                      onChange={e => {

                                        console.log("totalMarks - " + JSON.stringify(e.target.value));

                                        var temp = this.state.inputExamDataArray;
                                        temp[idx]["totalMarks"] = e.target.value;
                                        this.setState({ inputExamDataArray: temp },
                                          () => console.log("After - " + JSON.stringify(this.state.inputExamDataArray)));
                                      }
                                      }
                                      // style={{ textAlign: 'center' }}
                                      id="totalMarks"
                                      // size="lg"
                                      disabled={this.state.disabled}
                                    />
                                  </InputGroup>
                                </td>

                                <td style={{ "vertical-align": "middle" }}>
                                  <InputGroup className="mb-3">
                                    <Input
                                      name="passingMarks"
                                      type="text"
                                      className="form-control"
                                      value={this.state.inputExamDataArray[idx].passingMarks}
                                      disabled={this.state.disabled}
                                      style={{ textAlign: 'center' }}
                                      id="passingMarks"
                                      onChange={e => {

                                        var temp = this.state.inputExamDataArray;
                                        temp[idx]["passingMarks"] = e.target.value;

                                        this.setState({ inputExamDataArray: temp },
                                          () => console.log("After - " + JSON.stringify(this.state.inputExamDataArray)));
                                      }
                                      }
                                    // size="lg"
                                    />
                                  </InputGroup>
                                </td>
                                <td width="3%" style={{ "vertical-align": "middle" }}>
                                  <InputGroup className="mb-3">
                                    <AppSwitch
                                      name="includeInResultFlag"
                                      id="includeInResultFlag"
                                      className={"mx-1"}
                                      variant={"3d"}
                                      style={{ textAlign: 'center' }}
                                      color={"primary"}
                                      // size={"sm"}
                                      disabled={this.state.disabled}
                                      onChange={e => {

                                        var temp = this.state.inputExamDataArray;
                                        temp[idx]["includeInResultFlag"] = e.target.checked;

                                        this.setState({ inputExamDataArray: temp },
                                          () => console.log("After - " + JSON.stringify(this.state.inputExamDataArray)));
                                      }
                                      }
                                      checked={this.state.inputExamDataArray[idx].includeInResultFlag}
                                    />
                                  </InputGroup>
                                </td>


                                <td align="center" width="10%" style={{ "vertical-align": "middle" }}>

                                  {/* <Datetime
                                      name="examStartDate"
                                      id="examStartDate"
                                      value={this.state.inputExamDataArray[idx] 
                                        ? (this.state.inputExamDataArray[idx].examStartDate ? this.state.inputExamDataArray[idx].examStartDate : new Date()) 
                                        : new Date()}
                                      // input={ false }
                                      // value={this.state.inputExamDataArray[idx].examStartDate}
                                      onChange={date => {
                                        var temp = this.state.inputExamDataArray;
                                        temp[idx]["examStartDate"] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                                        this.setState({ inputExamDataArray: temp }, () => console.log(JSON.stringify(this.state.inputExamDataArray)))
                                      }}
                                    /> */}

                                  <DatePicker

                                    name="examDate"
                                    id="examDate"
                                    value={this.state.inputExamDataArray[idx].examDate}
                                    onChange={
                                      date => {

                                        console.log("Before - " + JSON.stringify(this.state.inputExamDataArray));

                                        var temp = this.state.inputExamDataArray;

                                        // if (typeof (this.state.inputExamDataArray[idx].startMoment) === 'undefined' || this.state.inputExamDataArray[idx].startMoment === null) {
                                        //   temp[idx].startMoment = new Date().setHours(12, 0, 0, 0)
                                        // }
                                        // if (typeof (this.state.inputExamDataArray[idx].endMoment) === 'undefined' || this.state.inputExamDataArray[idx].endMoment === null) {
                                        //   temp[idx].endMoment = new Date().setHours(12, 0, 0, 0)
                                        // }

                                        temp[idx]["examDate"] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

                                        var std = new Date(temp[idx]["startMoment"]);
                                        std.setDate(date.getDate());
                                        std.setMonth(date.getMonth());
                                        std.setFullYear(date.getFullYear());

                                        temp[idx]["startMoment"] = new Date(std);

                                        var etd = new Date(temp[idx]["endMoment"]);
                                        etd.setDate(date.getDate());
                                        etd.setMonth(date.getMonth());
                                        etd.setFullYear(date.getFullYear());

                                        temp[idx]["endMoment"] = new Date(etd);

                                        var diffMs = new Date(etd) - new Date(std);
                                        var diffMins = Math.round(diffMs / 60000); // minutes
                                        temp[idx]["examDuration"] = diffMins;

                                        this.setState({ inputExamDataArray: temp },
                                          () => console.log("After - " + JSON.stringify(this.state.inputExamDataArray)));
                                      }
                                    }
                                  />
                                </td>

                                <td style={{ "vertical-align": "middle" }} >

                                  {/* <Datetime
                                      name="examEndDate"
                                      id="examEndDate"
                                      value={this.state.inputExamDataArray[idx]
                                        ? (this.state.inputExamDataArray[idx].examEndDate ? this.state.inputExamDataArray[idx].examEndDate : new Date())
                                        : new Date()}
                                      input={true}
                                      // viewMode="day"
                                      // value={this.state.inputExamDataArray[idx].examEndDate}
                                      onChange={date => {
                                        var temp = this.state.inputExamDataArray;
                                        temp[idx]["examEndDate"] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                                        this.setState({ inputExamDataArray: temp }, () => console.log(JSON.stringify(this.state.inputExamDataArray)))
                                      }}
                                    /> */}

                                  <TimeRange
                                    startMoment={this.state.inputExamDataArray[idx].startMoment}
                                    endMoment={this.state.inputExamDataArray[idx].endMoment}

                                    // startMoment={this.setStartMoment(idx)}
                                    // endMoment={this.setEndMoment(idx)}
                                    minuteIncrement="15"
                                    startLabel=""
                                    endLabel=""
                                    showErrors={true}
                                    sameIsValid={false}
                                    equalTimeError="Start and End times cannot be equal"
                                    onStartTimeChange={date => {

                                      console.log("onStartTimeChange - " + date);

                                      console.log(JSON.stringify(this.state.inputExamDataArray))

                                      var startTimeWithOffset = new Date(date.startTime);

                                      var examDate = this.state.inputExamDataArray[idx]["examDate"];

                                      if (typeof (examDate) === 'undefined' || examDate === null) {
                                        examDate = new Date();
                                        examDate.setHours(5, 30, 0, 0);
                                      }

                                      startTimeWithOffset.setDate(examDate.getDate());
                                      startTimeWithOffset.setMonth(examDate.getMonth());
                                      startTimeWithOffset.setFullYear(examDate.getFullYear());

                                      var startTimeForDB = new Date(startTimeWithOffset.getTime() - (startTimeWithOffset.getTimezoneOffset() * 60000));

                                      // this.setState({
                                      //   startTime: startTimeWithOffset,
                                      // });
                                      console.log("ScheduleExam - startTimeHandler - startTimeWithOffset - " + JSON.stringify(startTimeWithOffset)
                                        + "startTimeForDB - " + JSON.stringify(startTimeForDB));

                                      var temp = this.state.inputExamDataArray;
                                      temp[idx]["examDate"] = examDate;
                                      temp[idx]["startMoment"] = startTimeWithOffset;

                                      var diffMs = this.state.inputExamDataArray[idx].endMoment - startTimeWithOffset;
                                      var diffMins = Math.round(diffMs / 60000); // minutes

                                      temp[idx]["examDuration"] = diffMins;

                                      console.log("ScheduleExam - startTimeHandler - startTimeWithOffset - diffMins - " + JSON.stringify(diffMins));

                                      this.setState({ inputExamDataArray: temp }, () => console.log(JSON.stringify(this.state.inputExamDataArray)))
                                    }}
                                    onEndTimeChange={date => {

                                      var endTimeWithOffset = new Date(date.endTime);

                                      var examDate = this.state.inputExamDataArray[idx]["examDate"];

                                      if (typeof (examDate) === 'undefined' || examDate === null) {
                                        examDate = new Date();
                                      }

                                      endTimeWithOffset.setDate(examDate.getDate());
                                      endTimeWithOffset.setMonth(examDate.getMonth());
                                      endTimeWithOffset.setFullYear(examDate.getFullYear());

                                      var endTimeForDB = new Date(endTimeWithOffset.getTime() - (endTimeWithOffset.getTimezoneOffset() * 60000));

                                      // this.setState({
                                      //   endTime: endTimeWithOffset,
                                      // });

                                      var temp = this.state.inputExamDataArray;
                                      temp[idx]["examDate"] = examDate;
                                      temp[idx]["endMoment"] = endTimeWithOffset;

                                      var diffMs = new Date(endTimeWithOffset) - new Date(this.state.inputExamDataArray[idx].startMoment);
                                      var diffMins = Math.round(diffMs / 60000); // minutes

                                      console.log("ScheduleExam - endTimeHandler - endTimeWithOffset - " + JSON.stringify(endTimeWithOffset)
                                        + " diffMs - " + diffMs + " diffMins - " + diffMins);

                                      temp[idx]["examDuration"] = diffMins;

                                      console.log("ScheduleExam - endTimeHandler - endTimeWithOffset - diffMins - " + JSON.stringify(diffMins));

                                      this.setState({ inputExamDataArray: temp }, () => console.log(JSON.stringify(this.state.inputExamDataArray)));

                                      console.log("ScheduleExam - endTimeHandler - endTimeWithOffset - " + JSON.stringify(endTimeWithOffset)
                                        + "endTimeForDB - " + JSON.stringify(endTimeForDB));
                                    }}
                                  // onChange={this.returnFunction}
                                  />

                                  {/* <TimePicker
    onChange={this.onChange} defaultOpenValue={moment('09:00:00', 'HH:mm:ss')}
/>
<TimePicker
    onChange={this.onChange} defaultOpenValue={moment('18:00:00', 'HH:mm:ss')}
/> */}

                                </td>

                                {/* <td style={{ "vertical-align": "middle" }}>
                                  <InputGroup className="mb-3">
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value={this.state.inputExamDataArray[idx].examDuration}
                                      disabled={true}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
                                </td> */}



                                <td
                                // style={{width: '20%'}}
                                // width="80%"
                                // style={{ "vertical-align": "middle" }}
                                >

                                  <InputGroup className="mb-3 ">
                                    <div className="col-md-12">
                                      <Select
                                        placeholder="Select"
                                        isMulti={false}
                                        closeMenuOnSelect={true}
                                        // value={this.state.selectedVenueLabelValue}
                                        value={this.state.inputExamDataArray[idx]["selectedVenueLabelValue"]}
                                        // style={{ width: '200px' }}
                                        // width="100%"
                                        // onChange={this.venueChangeHandler}
                                        onChange={
                                          (newValue, actionMeta) => {

                                            console.log("newValue - " + JSON.stringify(newValue) + " idx - " + idx);
                                            var temp = this.state.inputExamDataArray;
                                            if (!(typeof (newValue) === 'undefined' || newValue === null)) {

                                              temp[idx]["selectedVenueLabelValue"] = newValue;
                                              temp[idx]["selectedVenue"] = newValue.value;

                                              this.setState({ inputExamDataArray: temp }, () => {
                                                console.log(JSON.stringify(this.state.inputExamDataArray));
                                              });
                                            }
                                          }
                                        }
                                        // options={this.state.classes}
                                        options={this.state.venueLabelValueArray}
                                        isClearable={true}
                                        isSearchable={true}
                                        openMenuOnFocus={false}
                                      />
                                    </div>
                                  </InputGroup>

                                </td>

                                <td align="center" style={{ "vertical-align": "middle" }}>

                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </Table>
                        {this.state.rowError && (
                          <font color="red">
                            <h6>
                              {" "}
                              <p>{this.state.rowError} </p>
                            </h6>{" "}
                          </font>
                        )}
                      </TabPane>
                    )}

                    {this.state.showTabsFlag && (
                      <TabPane tabId="SCHEDULER">
                        3. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                        et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                        aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                        dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                        officia deserunt mollit anim id est laborum.
              </TabPane>
                    )}
                  </TabContent>

                  <br />


                  <Row>
                    <Col>
                      {!this.state.loader && <Button
                        onClick={this.scheduleExamSubmitHandler}
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
                        onClick={this.reset}
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

export default ScheduleExam;

