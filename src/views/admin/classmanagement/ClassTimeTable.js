import React, { Component } from 'react';
import './classmanagementcss/index.css';
import Agenda from './agenda/agenda.js'

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

class ClassTimeTable extends Component {
  constructor(props) {

    super(props);

    this.state = {
    
      classesView: true,
      sectionView: false,
      timeTableView: false,

      classDetails: {},
      classes: [],
      class: "",
      section: "",
      sectionArray: [],

      subjectArray: [],
      timeTableArray: []
    }

    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.showTimeTable = this.showTimeTable.bind(this);

    // Fetching class details on page load
    this.fetchClassDetails();
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
      timeTableView: false,
      section: ""
     });
  }

  sectionChangeHandler(e) {

    var section = e.currentTarget.value;
    console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + section);
    this.setState({ section: section }, () => {

      this.showTimeTable();
    });

    // Switching view to students view
    // this.setState({ 
    //   timeTableView: true,
    // });
  }

  showTimeTable() {

    console.log("ClassTimeTable - showTimeTable");

    var subjectArray = null;
    var timeTableArrayTemp = null;
    this.state.classDetails.forEach(element => {
      if (element["class"] === this.state.class && element["section"] === this.state.section) {
        subjectArray = element["subjects"];
        timeTableArrayTemp = element["timeTable"];
      }
    });

    this.setState({ 
      subjectArray: subjectArray,
      timeTableArray: timeTableArrayTemp,
      timeTableView: true,
    });

    console.log("ClassTimeTable - subjectArray - " + subjectArray + " timeTableArray - " + JSON.stringify(timeTableArrayTemp));
  }

  render() {

    return (

      <div>
      <Container >



        <Card>
          <CardHeader>
            <i className="fa fa-align-justify"></i> Classes <small className="text-muted">Select a Class</small>
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

        { this.state.timeTableView && (

<div>
          <Agenda subjects={this.state.subjectArray} selectedClass={this.state.class} 
          selectedSection={this.state.section} timeTable={this.state.timeTableArray}
          sectionArray={this.state.sectionArray}/>

                  </div>
        )}

      </Container>
    </div>

    );
  }
}

export default ClassTimeTable;