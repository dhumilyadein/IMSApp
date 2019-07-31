import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import Creatable from 'react-select/creatable';

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Modal,
  ModalHeader,
} from "reactstrap";
import axios from "axios";

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
      sectionArray: [],
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

      showModalFlag: false,
      modalMessage: "",
      modalColor: "",

      // classCreatedFlag Modal will be displayed if this flag is true
      classCreatedFlag: false,

      dbErrors: "",
    };

    //this.update = this.update.bind(this);
    this.handleSectionChange = this.handleSectionChange.bind(this);
    this.handleCreate = this.handleCreate.bind(this);

    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleSubjectCreate = this.handleSubjectCreate.bind(this);

    this.createClassBtnHandler = this.createClassBtnHandler.bind(this);
    this.resetCreateClassForm = this.resetCreateClassForm.bind(this);

    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);
  }

  handleSectionChange = (newValue, actionMeta) => {

    console.log("CreateClass - handleSectionChange - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);

    var sectionsTemp = [];
    newValue.forEach(element => {
      sectionsTemp.push(element.value);
    });
    this.setState({
      selectedOptions: newValue,
      sectionArray: sectionsTemp,
    }, () => {
      console.log("Available Sections - " + JSON.stringify(this.state.sectionArray)
      + " selectedOptions - " + JSON.stringify(this.state.selectedOptions));
    });

  };

  handleCreate = (createdSection) => {

    var sectionsTemp = [];
    var selectedOptionsTemp = [];

    // We do not assume how users would like to add newly created options to the existing options list.
    // Instead we pass users through the new value in the onCreate prop
    this.setState({ isLoading: true });

    console.log('Wait a moment... input value -  ' + createdSection);

    var createdOption = { "label": createdSection, "value": createdSection };

    sectionsTemp = this.state.sectionArray;
    sectionsTemp.push(createdOption.value);
    this.setState({
      sectionArray: sectionsTemp,
    }, () => {
      console.log("Available Sections - " + JSON.stringify(this.state.sectionArray));
    });

    selectedOptionsTemp = this.state.selectedOptions;
    selectedOptionsTemp.push(createdOption);
    this.setState({
      selectedOptions: selectedOptionsTemp
    }, () => {
      console.log("Selected subjects - " + JSON.stringify(this.state.selectedOptions));
    });

  };

  handleSubjectChange = (newSubjectValue, actionMeta) => {
    console.log("selected value - " + JSON.stringify(newSubjectValue) + " action - " + actionMeta.action);
    this.setState({ selectedSubjects: newSubjectValue }, () => {
      console.log(`CreateClass - handleSubjectChange - state selectedSubjects : ${JSON.stringify(this.state.selectedSubjects)}`);

      console.log("CreateClass - createClassBtnHandler - Class - " + this.state.className + " section - "
      + JSON.stringify(this.state.selectedOptions) + " subjects - "
      + JSON.stringify(this.state.selectedSubjects));
    });
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

    var createdSubject = { "label": inputSubject, "value": inputSubject };

    subjectsTemp = this.state.defaultSubjects;
    subjectsTemp.push(createdSubject);
    this.setState({
      subjects: subjectsTemp,
    }, () => {
      console.log("Options - " + JSON.stringify(this.state.subjects));
    });

    selectedSubjectsTemp = this.state.selectedSubjects;
    selectedSubjectsTemp.push(createdSubject);
    this.setState({
      selectedSubjects: selectedSubjectsTemp
    }, () => {
      console.log("Selected subjects - " + JSON.stringify(this.state.selectedSubjects));
    });

  };

  async createClassBtnHandler() {

    await console.log("CreateClass - createClassBtnHandler - Class - " + this.state.className + " section - "
      + JSON.stringify(this.state.selectedOptions) + " subjects - "
      + JSON.stringify(this.state.selectedSubjects));

    var subjectsStrArray = [];
    this.state.selectedSubjects.forEach(function (element) {
      subjectsStrArray.push(element.value);
    });

    this.setState({
      selectedSubjectsStrArray: subjectsStrArray
    }, () => {
      console.log("selectedSubjectsStrArray - " + this.state.selectedSubjectsStrArray);
    });

    var insertClassDetailsArrayRequest = [];

    this.state.selectedOptions.forEach(section => {

      var insertClassDetailsRequest = {};

      insertClassDetailsRequest.class = this.state.className;
      insertClassDetailsRequest.section = section.value;
      insertClassDetailsRequest.subjects = this.state.selectedSubjectsStrArray;

      insertClassDetailsArrayRequest.push(insertClassDetailsRequest);
    });

    // insertClassDetailsRequest = {
    //   "class": this.state.className,
    //   "section": this.state.selectedOptions.value,
    //   "subjects": this.state.selectedSubjectsStrArray
    // }

    console.log("insertClassDetailsRequest - " + JSON.stringify(insertClassDetailsArrayRequest));

    axios.post("http://localhost:8001/api/insertClassDetails", insertClassDetailsArrayRequest).then(res => {

      console.log("\nres.data - " + JSON.stringify(res.data));

      //Mongo DB error
      if (res.data.errmsg) {

        var errMsg = res.data.errmsg;

        console.log("ERROR in insert class details - " + JSON.stringify(errMsg));

          console.log("Mongo DB error- " + JSON.stringify(errMsg));

          //for displaying error message on modal
          if (errMsg.indexOf('E11000 duplicate key error collection: IMS.Class index: class_1_section_1 dup key:') !== -1) {

            var splitArr = errMsg.split("\"");

            this.setState({
              showModalFlag: true,
              modalColor: "modal-warning",
              modalMessage: "Class '" + splitArr[1] + " " + splitArr[3] + "' already exists."
            });
          } else {
            this.setState({
              showModalFlag: true,
              modalColor: "modal-warning",
              modalMessage: errMsg
            });
          }

        return this.setState({ dbErrors: res.data.errors });
      } else {

        console.log('Inserted class details in the Database - ' + JSON.stringify(insertClassDetailsArrayRequest));
        this.setState({
          insertClassDetailsResponseMessage: res.data.message,
          classCreatedFlag: true,
          showModalFlag: true,
          modalColor: "modal-success",
          modalMessage: "Class '" + this.state.className + "' with Sections '" + this.state.sectionArray + "' successfully created!"
        });

        //Resetting form after updating the details
        //this.resetCreateClassForm();
      }
    });
  };

  resetCreateClassForm() {

    console.log("resetCreateClassForm resetCreateClassForm");

    this.setState(
      {
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
      sectionArray: [],
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

      showModalFlag: false,
      modalMessage: "",
      modalColor: "",

      // classCreatedFlag Modal will be displayed if this flag is true
      classCreatedFlag: false,

      dbErrors: "",
      }
    );
  }

  async toggleModalSuccess() {

    await console.log("CreateClass - toggleModalSuccess this.state.showModalFlag - " + this.state.showModalFlag);
    this.setState({
      showModalFlag: !this.state.showModalFlag
    });

    if (this.state.classCreatedFlag) {
      console.log("CreateClass - Calling resetCreateClassForm");
      this.resetCreateClassForm();
      console.log("CreateClass - resetCreateClassForm call complete");
    }
  }

  render() {

    return (
      <div>
        <Container >

          {this.state.showModalFlag && (
            <Modal
              isOpen={this.state.showModalFlag}
              className={this.state.modalColor}
              toggle={this.toggleModalSuccess}
            >
              <ModalHeader
                toggle={this.toggleModalSuccess}
              >
                {this.state.modalMessage}
              </ModalHeader>
            </Modal>
          )}

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
              {this.state.dbErrors && this.state.dbErrors.class && (
                <font color="red">
                  <h6>
                    {" "}
                    <p>{this.state.dbErrors.class.msg} </p>
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
                isMulti={true}
                isOpen={true}
                closeMenuOnSelect={false}
                autosize
                onCreateOption={this.handleCreate}
                options={this.state.defaultSections}
                openMenuOnFocus={true}
              />

              {this.state.dbErrors && this.state.dbErrors.section && (
                <font color="red">
                  <h6>
                    {" "}
                    <p>{this.state.dbErrors.section.msg} </p>
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
                isOpen={true}
                closeMenuOnSelect={false}
                autosize
                onCreateOption={this.handleSubjectCreate}
                options={this.state.defaultSubjects}
                openMenuOnFocus={true}
              />

              {this.state.dbErrors && this.state.dbErrors.subjects && (
                <font color="red">
                  <h6>
                    {" "}
                    <p>{this.state.dbErrors.subjects.msg}</p>
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
                        showExistingTemplate: true,
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

            </CardBody>

          </Card>

          {/* )} */}

        </Container>
      </div>
    );
  }
}

export default ClassDetails;
