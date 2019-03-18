import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
import DatePicker from 'react-date-picker';
import Datetime from 'react-datetime';
import ReactLoading from 'react-loading';
import moment from 'moment';
import "bootstrap/dist/css/bootstrap.css";
import "react-datetime/css/react-datetime.css";
import { AppSwitch } from "@coreui/react";
import TimeRange from 'react-time-range';
import { TimePicker } from 'antd';
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
      showTabsFlag: false,

      // To make tab 1 on focus
      activeTab: 'EXAM_DETAILS',

      subjectArray: [],

      examDetailsArray: [{ examName: "" }],

      includeInResultFlag: true,

      disabled: false,

      examDate: new Date(),

      defaultExamDuration: 0

    };

    this.fetchAllClassesAndSections = this.fetchAllClassesAndSections.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.fetchClassSpecificDetails = this.fetchClassSpecificDetails.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.allSectionCheckHandler = this.allSectionCheckHandler.bind(this);
    this.sectionMenuCloseHandler = this.sectionMenuCloseHandler.bind(this);
    this.toggleTabs = this.toggleTabs.bind(this);
    this.isIncludeInResultHandler = this.isIncludeInResultHandler.bind(this);
    this.onChange = this.onChange.bind(this);
    // this.setStartMoment = this.setStartMoment.bind(this);
    // this.setEndMoment = this.setEndMoment.bind(this);
    // this.setExamDuration = this.setExamDuration.bind(this);

    this.totalMarksChangeHandler = this.totalMarksChangeHandler.bind(this);

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

            this.setState({
              subjectArray: this.state.classDetails[0].subjects,
            }, () => {

              /*
              Setting temporary examDetailsArray for each subject
              */
              var startMoment = new Date().setHours(12, 0, 0, 0);
              var endMoment = new Date().setHours(12, 0, 0, 0);
              var examDate = new Date(new Date().setHours(5, 30, 0, 0));

              var examDetailsArrayTemp = [];
              this.state.subjectArray.forEach(element => {

                const item = {
                  subject: element,
                  totalMarks: "",
                  passingMarks: "",
                  includeInResultFlag: false,
                  examDate: examDate,
                  startMoment: startMoment,
                  endMoment: endMoment,
                  examDuration: 0,
                  venue: ""
                };

                examDetailsArrayTemp.push(item);

              });

              console.log("exam details array - " + JSON.stringify(examDetailsArrayTemp));
              this.setState({
                examDetailsArray: examDetailsArrayTemp
              });

              console.log("ScheduleExam - fetchClassSpecificDetails - subjectArray - " + this.state.subjectArray);
              return;
            });
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

    this.setState({ class: selectedClass });

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


      //this.fetchClassSpecificDetails();

      console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp
        + " \nsectionLabelValueArray - " + JSON.stringify(this.state.sectionLabelValueArray));
    })
  }

  sectionChangeHandler = (newValue, actionMeta) => {

    console.log("ScheduleExam - sectionChangeHandler - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);

    var startMoment = new Date().setHours(12, 0, 0, 0);
    var endMoment = new Date().setHours(12, 0, 0, 0);
    var examDate = new Date(new Date().setHours(5, 30, 0, 0));

    var sectionArrayTemp = [];
    var examDetailsArrayTemp = [];
    newValue.forEach(element => {

      const item = {
        totalMarks: "100",
        passingMarks: "40",
        includeInResultFlag: false,
        examDate: examDate,
        startMoment: startMoment,
        endMoment: endMoment,
        examDuration: 120,
        venue: "Hall1"
      };

      sectionArrayTemp.push(element.value);
      examDetailsArrayTemp.push(item);

    });

    console.log("exam details array - " + JSON.stringify(examDetailsArrayTemp));
    this.setState({
      selectedSectionsArray: sectionArrayTemp.sort(),
      selectedSectionsLabelValueArray: newValue,
      examDetailsArray: examDetailsArrayTemp
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
        showTabsFlag: true
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

  sectionMenuCloseHandler() {

    if (this.state.selectedSectionsArray.length > 0) {
      this.fetchClassSpecificDetails();
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

  //   var temp = this.state.examDetailsArray;

  //   console.log('ScheduleExam - setStartMoment - this.state.examDetailsArray[idx]) - '  + this.state.examDetailsArray[idx]);
  //   if (this.state.examDetailsArray) {

  //     // temp[idx]["startMoment"] = new Date().setHours(12, 0, 0, 0);
  //     // this.setState({ examDetailsArray: temp });
  //     return new Date().setHours(12, 0, 0, 0);

  //   } else {

  //     if (typeof (this.state.examDetailsArray[idx].startMoment) === 'undefined' || this.state.examDetailsArray[idx].startMoment === null) {
  //       temp[idx]["startMoment"] = new Date().setHours(12, 0, 0, 0);
  //       this.setState({ examDetailsArray: temp });
  //       return new Date().setHours(12, 0, 0, 0);
  //     } else {
  //       temp[idx]["startMoment"] = this.state.examDetailsArray[idx].startMoment;
  //       this.setState({ examDetailsArray: temp });
  //       return this.state.examDetailsArray[idx].startMoment;
  //     }
  //   }
  // }

  // setEndMoment(idx) {

  //   var temp = this.state.examDetailsArray;

  //   if (this.state.examDetailsArray) {

  //     // temp[idx]["endMoment"] = new Date().setHours(12, 0, 0, 0);
  //     // this.setState({ examDetailsArray: temp });
  //     return new Date().setHours(12, 0, 0, 0);

  //   } else {

  //     if (typeof (this.state.examDetailsArray[idx].endMoment) === 'undefined' || this.state.examDetailsArray[idx].endMoment === null) {
  //       temp[idx]["endMoment"] = new Date().setHours(12, 0, 0, 0);
  //       this.setState({ examDetailsArray: temp });
  //       return new Date().setHours(12, 0, 0, 0);
  //     } else {
  //       temp[idx]["endMoment"] = this.state.examDetailsArray[idx].endMoment;
  //       this.setState({ examDetailsArray: temp });
  //       return this.state.examDetailsArray[idx].endMoment;
  //     }
  //   }
  // }

  // setExamDuration(idx) {

  //   var temp = this.state.examDetailsArray;


  //   if (this.state.examDetailsArray) {

  //     // temp[idx]["examDuration"] = new Date().setHours(12, 0, 0, 0);
  //     // this.setState({ examDetailsArray: temp });
  //     return new Date().setHours(12, 0, 0, 0);

  //   } else {

  //     if (typeof (this.state.examDetailsArray[idx].examDuration) === 'undefined' || this.state.examDetailsArray[idx].examDuration === null) {
  //       temp[idx]["examDuration"] = this.state.defaultExamDuration;
  //       this.setState({ examDetailsArray: temp });
  //       return this.state.defaultExamDuration;
  //     } else {
  //       temp[idx]["examDuration"] = this.state.examDetailsArray[idx].examDuration;
  //       this.setState({ examDetailsArray: temp });
  //       return this.state.examDetailsArray[idx].examDuration;
  //     }
  //   }
  // }

  totalMarksChangeHandler(idx) {


    if (typeof (this.state.examDetailsArray[idx]) === 'undefined' || this.state.examDetailsArray[idx] === null) {

      var examDate = new Date().setHours(5, 30, 0, 0);
      var startMoment = new Date().setHours(12, 0, 0, 0);
      var endMoment = new Date().setHours(12, 0, 0, 0);

    } else {

      var temp = this.state.examDetailsArray;

      if (typeof (this.state.examDetailsArray[idx]).examDate === 'undefined' || this.state.examDetailsArray[idx].examDate === null) {
        temp[idx]["examDate"] = new Date().setHours(5, 30, 0, 0);
      }
      if (typeof (this.state.examDetailsArray[idx]).startMoment === 'undefined' || this.state.examDetailsArray[idx].startMoment === null) {
        temp[idx]["startMoment"] = new Date().setHours(12, 0, 0, 0);
      }
      if (typeof (this.state.examDetailsArray[idx]).endMoment === 'undefined' || this.state.examDetailsArray[idx].endMoment === null) {
        temp[idx]["endMoment"] = new Date().setHours(12, 0, 0, 0);
      }

    }
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

              {this.state.showTabsFlag && (
                <div>
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
                              <th className="text-center">
                                <h5>Include in result</h5>{" "}
                              </th>
                              <th className="text-center">
                                <h5>Start Time</h5>{" "}
                              </th>
                              <th
                                // className="text-center" 
                                width="40%">
                                <h5>End Time</h5>{" "}
                              </th>
                              <th className="text-center">
                                <h5>Exam Duration (Minutes)</h5>{" "}
                              </th>
                              <th className="text-center">
                                <h5>Venue</h5>{" "}
                              </th>
                              <th className="text-center">
                                <Button
                                  onClick={this.handleAddRow}
                                  className="btn btn-primary"
                                  color="primary"
                                >
                                  Add Row
                          </Button>
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
                                      value={this.state.examDetailsArray[idx]
                                        ? (this.state.examDetailsArray[idx].totalMarks ? this.state.examDetailsArray[idx].totalMarks : "")
                                        : ""}
                                      // value={this.state.examDetailsArray[idx].totalMarks}
                                      onChange={e => {

                                        console.log("totalMarks - " + JSON.stringify(e.target.value));

                                        var temp = this.state.examDetailsArray;

                                        if (typeof (this.state.examDetailsArray[idx]) === 'undefined' || this.state.examDetailsArray[idx] === null) {

                                          temp[idx]["examDate"] = new Date(new Date().setHours(5, 30, 0, 0));
                                          temp[idx]["startMoment"] = new Date(new Date().setHours(12, 0, 0, 0));
                                          temp[idx]["endMoment"] = new Date(new Date().setHours(12, 0, 0, 0));

                                        } else {

                                          if (typeof (this.state.examDetailsArray[idx].examDate) === 'undefined' || this.state.examDetailsArray[idx].examDate === null) {
                                            temp[idx]["examDate"] = new Date(new Date().setHours(5, 30, 0, 0));
                                          }
                                          if (typeof (this.state.examDetailsArray[idx].startMoment) === 'undefined' || this.state.examDetailsArray[idx].startMoment === null) {
                                            temp[idx]["startMoment"] = new Date(new Date().setHours(12, 0, 0, 0));
                                          }
                                          if (typeof (this.state.examDetailsArray[idx].endMoment) === 'undefined' || this.state.examDetailsArray[idx].endMoment === null) {
                                            temp[idx]["endMoment"] = new Date(new Date().setHours(12, 0, 0, 0));
                                          }
                                          temp[idx]["totalMarks"] = e.target.value;

                                        }
                                        this.setState({ examDetailsArray: temp },
                                          () => console.log("After - " + JSON.stringify(this.state.examDetailsArray)));
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
                                      value={this.state.examDetailsArray[idx]
                                        ? (this.state.examDetailsArray[idx].passingMarks ? this.state.examDetailsArray[idx].passingMarks : "")
                                        : ""}
                                      disabled={this.state.disabled}
                                      style={{ textAlign: 'center' }}
                                      id="passingMarks"
                                      onChange={e => {

                                        var temp = this.state.examDetailsArray;
                                        temp[idx]["passingMarks"] = e.target.value;

                                        this.setState({ examDetailsArray: temp },
                                          () => console.log("After - " + JSON.stringify(this.state.examDetailsArray)));
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

                                        var temp = this.state.examDetailsArray;
                                        temp[idx]["includeInResultFlag"] = e.target.checked;

                                        this.setState({ examDetailsArray: temp },
                                          () => console.log("After - " + JSON.stringify(this.state.examDetailsArray)));
                                      }
                                      }
                                      checked={this.state.examDetailsArray[idx]
                                        ? (this.state.examDetailsArray[idx].includeInResultFlag ? this.state.examDetailsArray[idx].includeInResultFlag : false)
                                        : false}
                                    />
                                  </InputGroup>
                                </td>


                                <td align="center" width="10%" style={{ "vertical-align": "middle" }}>

                                  {/* <Datetime
                                      name="examStartDate"
                                      id="examStartDate"
                                      value={this.state.examDetailsArray[idx] 
                                        ? (this.state.examDetailsArray[idx].examStartDate ? this.state.examDetailsArray[idx].examStartDate : new Date()) 
                                        : new Date()}
                                      // input={ false }
                                      // value={this.state.examDetailsArray[idx].examStartDate}
                                      onChange={date => {
                                        var temp = this.state.examDetailsArray;
                                        temp[idx]["examStartDate"] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                                        this.setState({ examDetailsArray: temp }, () => console.log(JSON.stringify(this.state.examDetailsArray)))
                                      }}
                                    /> */}

                                  <DatePicker

                                    name="examDate"
                                    id="examDate"
                                    value={this.state.examDetailsArray[idx]
                                      ? (this.state.examDetailsArray[idx].examDate ? this.state.examDetailsArray[idx].examDate : new Date())
                                      : new Date()}
                                    onChange={
                                      date => {

                                        console.log("Before - " + JSON.stringify(this.state.examDetailsArray));

                                        var temp = this.state.examDetailsArray;

                                        // if (typeof (this.state.examDetailsArray[idx].startMoment) === 'undefined' || this.state.examDetailsArray[idx].startMoment === null) {
                                        //   temp[idx].startMoment = new Date().setHours(12, 0, 0, 0)
                                        // }
                                        // if (typeof (this.state.examDetailsArray[idx].endMoment) === 'undefined' || this.state.examDetailsArray[idx].endMoment === null) {
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

                                        this.setState({ examDetailsArray: temp },
                                          () => console.log("After - " + JSON.stringify(this.state.examDetailsArray)));
                                      }
                                    }
                                  />
                                </td>

                                <td style={{ "vertical-align": "middle" }} >

                                  {/* <Datetime
                                      name="examEndDate"
                                      id="examEndDate"
                                      value={this.state.examDetailsArray[idx]
                                        ? (this.state.examDetailsArray[idx].examEndDate ? this.state.examDetailsArray[idx].examEndDate : new Date())
                                        : new Date()}
                                      input={true}
                                      // viewMode="day"
                                      // value={this.state.examDetailsArray[idx].examEndDate}
                                      onChange={date => {
                                        var temp = this.state.examDetailsArray;
                                        temp[idx]["examEndDate"] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));
                                        this.setState({ examDetailsArray: temp }, () => console.log(JSON.stringify(this.state.examDetailsArray)))
                                      }}
                                    /> */}

                                  <TimeRange
                                    startMoment={this.state.examDetailsArray[idx]
                                      ? (this.state.examDetailsArray[idx].startMoment
                                        ? this.state.examDetailsArray[idx].startMoment : new Date().setHours(12, 0, 0, 0))
                                      : new Date().setHours(12, 0, 0, 0)}
                                    endMoment={this.state.examDetailsArray[idx]
                                      ? (this.state.examDetailsArray[idx].endMoment
                                        ? this.state.examDetailsArray[idx].endMoment : new Date().setHours(12, 0, 0, 0))
                                      : new Date().setHours(12, 0, 0, 0)}

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

                                      console.log(JSON.stringify(this.state.examDetailsArray))

                                      var startTimeWithOffset = new Date(date.startTime);

                                      var examDate = this.state.examDetailsArray[idx]["examDate"];

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

                                      var temp = this.state.examDetailsArray;
                                      temp[idx]["examDate"] = examDate;
                                      temp[idx]["startMoment"] = startTimeWithOffset;

                                      var diffMs = this.state.examDetailsArray[idx].endMoment - startTimeWithOffset;
                                      var diffMins = Math.round(diffMs / 60000); // minutes

                                      temp[idx]["examDuration"] = diffMins;

                                      console.log("ScheduleExam - startTimeHandler - startTimeWithOffset - diffMins - " + JSON.stringify(diffMins));
                                      // var examDuration = moment.duration(new Date(this.state.examDetailsArray[idx].endMoment).diff(new Date(startTimeWithOffset))).asMinutes;
                                      // temp[idx]["examDuration"] = examDuration;

                                      this.setState({ examDetailsArray: temp }, () => console.log(JSON.stringify(this.state.examDetailsArray)))
                                    }}
                                    onEndTimeChange={date => {

                                      var endTimeWithOffset = new Date(date.endTime);

                                      var examDate = this.state.examDetailsArray[idx]["examDate"];

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

                                      var temp = this.state.examDetailsArray;
                                      temp[idx]["endMoment"] = endTimeWithOffset;

                                      var diffMs = new Date(endTimeWithOffset) - new Date(this.state.examDetailsArray[idx].startMoment);
                                      var diffMins = Math.round(diffMs / 60000); // minutes

                                      console.log("ScheduleExam - endTimeHandler - endTimeWithOffset - " + JSON.stringify(endTimeWithOffset)
                                        + " diffMs - " + diffMs + " diffMins - " + diffMins);

                                      temp[idx]["examDuration"] = diffMins;

                                      console.log("ScheduleExam - endTimeHandler - endTimeWithOffset - diffMins - " + JSON.stringify(diffMins));

                                      this.setState({ examDetailsArray: temp }, () => console.log(JSON.stringify(this.state.examDetailsArray)));

                                      console.log("ScheduleExam - endTimeHandler - endTimeWithOffset - " + JSON.stringify(endTimeWithOffset)
                                        + "endTimeForDB - " + JSON.stringify(endTimeForDB));
                                      // console.log("Start time - " + JSON.stringify(date));
                                    }}
                                    onChange={this.returnFunction}
                                  />

                                  {/* <TimePicker
    onChange={this.onChange} defaultOpenValue={moment('09:00:00', 'HH:mm:ss')}
/>
<TimePicker
    onChange={this.onChange} defaultOpenValue={moment('18:00:00', 'HH:mm:ss')}
/> */}

                                </td>

                                <td style={{ "vertical-align": "middle" }}>
                                  <InputGroup className="mb-3">
                                    <Input
                                      name="examDuration"
                                      type="text"
                                      className="form-control"
                                      // value={this.setExamDuration(idx)}
                                      value={
                                        this.state.examDetailsArray[idx]
                                          ? (this.state.examDetailsArray[idx].examDuration
                                            ? this.state.examDetailsArray[idx].examDuration : this.state.defaultExamDuration)
                                          : this.state.defaultExamDuration
                                      }
                                      disabled={true}
                                      style={{ textAlign: 'center' }}
                                      id="examDuration"
                                    // size="lg"
                                    />
                                  </InputGroup>
                                </td>

                                <td style={{ "vertical-align": "middle" }}>
                                  <InputGroup className="mb-3">
                                    <Select
                                      placeholder="Select applicable for classes"
                                      isMulti={true}
                                      closeMenuOnSelect={false}
                                      // value={this.state.selectedClasses}
                                      onChange={this.handleClassChange}
                                      options={this.state.classes}
                                      isClearable={true}
                                      isSearchable={true}
                                      openMenuOnFocus={true}
                                    />
                                  </InputGroup>
                                </td>

                                <td align="center" style={{ "vertical-align": "middle" }}>
                                  {idx > 0 &&
                                    <Button
                                      className="btn btn-danger btn-sg"
                                    // onClick={this.handleRemoveSpecificRow(idx)}
                                    // size="lg"
                                    >
                                      Remove
                                    </Button>}
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
                        onClick={this.studentSubmitHandler}
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

