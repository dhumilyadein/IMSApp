import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import { Creatable } from "react-select";

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
import MapsTransferWithinAStation from "material-ui/SvgIcon";

var imageContext = require.context('../../../photoTemp', true);

const whiteTextFieldStyle = {
  background: "white"
}

class ClassDetails extends Component {

  constructor(props) {

    super(props);

    this.state = {

      classesView: true,
      sectionView: false,
      studentsView: false,

      // Response of insertClassDetails
      insertClassDetailsResponseMessage: "",

      className: "",
      classNameError: "",

      section: "",

      isLoading: false,
      defaultSections: [
        { value: "A", label: "A" },
        { value: "B", label: "B" },
        { value: "C", label: "C" },
      ],
      sections: [],
      selectedOptions: [],

      defaultSubjects: [
        { value: "English", label: "English" },
        { value: "Hindi", label: "Hindi" },
        { value: "Science", label: "Science" },
        { value: "Maths", label: "Maths" },
        { value: "SocialScience", label: "SocialScience" },
        { value: "Sanskrit", label: "Sanskrit" },
        { value: "Physics", label: "Physics" },
        { value: "Biology", label: "Biology" },
        { value: "Chemistry", label: "Chemistry" }
      ],
      subjects: [],
      selectedSubjects: [],
      selectedSubjectsStrArray: [],

      classDetailsUpdatedFlag: false,
    };

     //this.update = this.update.bind(this);
     this.handleSectionChange = this.handleSectionChange.bind(this);
     this.handleCreate = this.handleCreate.bind(this);

     this.handleSubjectChange = this.handleSubjectChange.bind(this);
     this.handleSubjectCreate = this.handleSubjectCreate.bind(this);

     this.createClassBtnHandler = this.createClassBtnHandler.bind(this);
     this.resetCreateClassForm = this.resetCreateClassForm.bind(this);
  }

  handleSectionChange = (newValue, actionMeta) => {
    console.log("selected value - " + JSON.stringify(newValue) + " action - " +  actionMeta.action);
    this.setState({ selectedOptions: newValue }, () => {
      console.log(`state selectedOptions : ${JSON.stringify(this.state.selectedOptions)}`)});
    console.groupEnd();
  };

  handleCreate = (createdSection) => {

    var sectionsTemp = [];
    var selectedOptionsTemp = [];

    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    this.setState({ isLoading: true });
    this.setState({ sections: this.state.defaultSections });

    console.log('Wait a moment... input value -  ' + createdSection);
    console.log("Initial Available Sections - " + JSON.stringify(this.state.sections));
    
    var createdOption = {"label":createdSection, "value":createdSection};

    sectionsTemp = this.state.defaultSections;
    sectionsTemp.push(createdOption);
    this.setState({
      sections : sectionsTemp,
    }, () => {
      console.log("Available Sections - " + JSON.stringify(this.state.sections));
    });

    console.log("check check selectedOptions - " + JSON.stringify(this.state.selectedOptions));
    this.setState({
      selectedOptions : createdOption
    }, () => {
      console.log("Selected Section - " + JSON.stringify(this.state.selectedOptions));
    });

  };

  handleSubjectChange = (newSubjectValue, actionMeta) => {
    console.log("selected value - " + JSON.stringify(newSubjectValue) + " action - " +  actionMeta.action);
    this.setState({ selectedSubjects: newSubjectValue }, () => {
      console.log(`state selectedSubjects : ${JSON.stringify(this.state.selectedSubjects)}`)});
  };

  handleSubjectCreate = (inputSubject) => {

    var subjectsTemp = [];
    var selectedSubjectsTemp = [];

    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    this.setState({ isLoading: true });
    this.setState({ subjects: this.state.defaultSubjects });

    console.log('Wait a moment... input value -  ' + inputSubject);
    console.log("Initial subjects - " + JSON.stringify(this.state.subjects));
    
    var createdSubject = {"label":inputSubject, "value":inputSubject};

    subjectsTemp = this.state.defaultSubjects;
    subjectsTemp.push(createdSubject);
    this.setState({
      subjects : subjectsTemp,
    }, () => {
      console.log("Options - " + JSON.stringify(this.state.subjects));
    });

    selectedSubjectsTemp = this.state.selectedSubjects;
    selectedSubjectsTemp.push(createdSubject);
    this.setState({
      selectedSubjects : selectedSubjectsTemp
    }, () => {
      console.log("Selected subjects - " + JSON.stringify(this.state.selectedSubjects));
    });
    
  };

  async createClassBtnHandler() {

    await console.log("Class - " + this.state.className + " section - " 
    + JSON.stringify(this.state.selectedOptions) + " subjects - " 
    + JSON.stringify(this.state.selectedSubjects));

    var subjectsStrArray = [];
    this.state.selectedSubjects.forEach(function(element) {
      subjectsStrArray.push(element.value);
    });

    this.setState({
      selectedSubjectsStrArray : subjectsStrArray
    }, () => {
      console.log("selectedSubjectsStrArray - " + this.state.selectedSubjectsStrArray);
    });
    

    var insertClassDetailsRequest = {
      "class":this.state.className,
      "section":this.state.selectedOptions.value,
      "subjects":this.state.selectedSubjectsStrArray
    }

    console.log("insertClassDetailsRequest - " + JSON.stringify(insertClassDetailsRequest));

    axios.post("http://localhost:8001/api/insertClassDetails", insertClassDetailsRequest).then(res => {

    console.log("frontend time - " + new Date().getMinutes() + " " + new Date().getMilliseconds());

    console.log("\nres.data - " + JSON.stringify(res.data));
        if (res.data.errors) {
          console.log("ERROR in insert class details - " + JSON.stringify(res.data.errors));

          //Mongo DB error
          if(res.data.errors.errmsg) {
            console.log("Mongo DB error- " + JSON.stringify(res.data.errors.errmsg));
          }
          return this.setState({ errors: res.data.errors });
        } else {
  
          console.log('Inserting class details in the Database - ' + JSON.stringify(insertClassDetailsRequest));
          this.setState({
            insertClassDetailsResponseMessage : res.data.message,
            classDetailsUpdatedFlag: true
          });
  
          //Resetting form after updating the details
          this.resetCreateClassForm();
        }
      });
  };

  resetCreateClassForm() {

    console.log("resetCreateClassForm resetCreateClassForm");

    this.setState(
      {
        className: "",
        classNameError: "",
        section: "",
        isLoading: false,
        defaultSections: [
          { value: "A", label: "A" },
          { value: "B", label: "B" },
          { value: "C", label: "C" },
        ],
        sections: [],
        selectedOptions: [],

        defaultSubjects: [
          { value: "English", label: "English" },
          { value: "Hindi", label: "Hindi" },
          { value: "Science", label: "Science" },
          { value: "Maths", label: "Maths" },
          { value: "SocialScience", label: "SocialScience" },
          { value: "Sanskrit", label: "Sanskrit" },
          { value: "Physics", label: "Physics" },
          { value: "Biology", label: "Biology" },
          { value: "Chemistry", label: "Chemistry" }
        ],
        subjects: [],
        selectedSubjects: [],

        classDetailsUpdatedFlag: false,
      }
    );
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

// allow users to create new values
// const Select = ({ value = "not an option", update }) =>
//   <Creatable
//     simpleValue
//     value={value}
//     onChange={this.update}
//     options={defaultOptions}
//   />;

    return (
      <div>
        <Container >


          {/* {this.state.showCreateTemplate && ( */}
                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Create Class</h3>
                          <br />
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Class Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                              label="className"
                              name="className"
                              id="className"
                              value={this.state.className}
                              onChange={e => {
                                this.setState(
                                  { className: e.target.value });
                              }}
                            />
                          </InputGroup>
                          {this.state.errors && this.state.errors.class && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.errors.class.msg} </p>
                              </h6>{" "}
                            </font>
                          )}

                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Section</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Creatable 
    simpleValue
    value={this.state.selectedOptions}
    onChange={this.handleSectionChange}
    isMulti={false}
    autosize
    onCreateOption={this.handleCreate}
    options={this.state.defaultSections}
  />
                            
                            {this.state.errors && this.state.errors.section && (
                              <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.errors.section.msg} </p>
                              </h6>{" "}
                              </font>
                            )}

<br />

<InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Subjects</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Creatable 
    simpleValue
    value={this.state.selectedSubjects}
    onChange={this.handleSubjectChange}
    isMulti={true}
    autosize
    onCreateOption={this.handleSubjectCreate}
    options={this.state.defaultSubjects}
  />
                            
                            {this.state.errors && this.state.errors.subjects && (
                              <font color="red">
                                <h6>
                                {" "}
                                <p>{this.state.errors.subjects.msg}</p>
                              </h6>{" "}
                              </font>
                            )}



                          <br /> <br />
                          <Row>
                            <Col>
                              <Button
                                onClick={this.createClassBtnHandler}
                                size="lg"
                                color="success"
                                block
                              >
                                Create
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={() => {
                                  this.setState({
                                    showCreateTemplate: false,
                                    showCreateButton: true,
                                    showExistingTemplate:true,
                                    rows: [{}]
                                  });
                                }}
                                size="lg"
                                color="secondary"
                                block
                              >
                                View Classes
                              </Button>
                            </Col>
                          </Row>

                          <br />

                          {this.state.errors && this.state.errors.errmsg && (
                            <font color="red">
                              <h6>
                                {" "}
                                { (this.state.errors.errmsg.indexOf('E11000 duplicate key error collection: IMS.Class index: class_1_section_1 dup key:') != -1) && ( 
                                <p>Class {"'" + this.state.className + " " + this.state.selectedOptions.value + "'"} already exists. <br/> {this.state.errors.errmsg} </p>
                                )}
                              </h6>{" "}
                            </font>
                          )}

                          {this.state.insertClassDetailsResponseMessage && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.insertClassDetailsResponseMessage}</p>
                              </h6>{" "}
                            </font>
                          )}
                        </CardBody>

                      </Card>

                    {/* )} */}

        </Container>
      </div>
    );
  }
}

export default ClassDetails;
