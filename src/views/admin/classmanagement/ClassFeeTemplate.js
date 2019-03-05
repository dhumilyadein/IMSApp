import React, { Component } from "react";
import 'react-confirm-alert/src/react-confirm-alert.css'
import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CardHeader,
  Row,
  Table,
  Modal,
  ModalHeader
} from "reactstrap";

import axios from "axios";

class ClassFeeTemplate extends Component {

  constructor(props) {
  
    super(props);
  
    this.state = {
      
      status: "Active",
      erorrs: null,
      success: null,
      userdata: null,
      templateName: "",
      rows: [{ feeType: "", amount: "" }],
      editRows: [{ feeType: "", amount: "" }],
      existingRows: [{ templateName: "" }],
      showCreateButton: true,
      rowError: false,
      templateNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      showEditTemplate: false,
      templateNo: "",
      showExistingTemplate:true,
      showCopyTemplate:false,
      templateTypeError:"",
      templateType:"",

      classesView: true,
      sectionView: false,
      createFeeTemplateView: false,

      classDetails: {},
      classes: [],
      class: "",
      sectionArray: [],
      section: "",
      studentsDataArray: [],
      modalMessage: "Template saved Successfully!"

    };



    this.handleChange = this.handleChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
    this.handleEditChange = this.handleEditChange.bind(this);
    this.handleEditAddRow = this.handleEditAddRow.bind(this);
    this.handleEditRemoveSpecificRow = this.handleEditRemoveSpecificRow.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.fetchAllClassesAndSections = this.fetchAllClassesAndSections.bind(this);
    this.fetchSelectedClassStudentsData = this.fetchSelectedClassStudentsData.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.addNewFeeTemplateToSelectedClassStudents = this.addNewFeeTemplateToSelectedClassStudents.bind(this);

    // Fetching class details on page load
    this.fetchAllClassesAndSections();

  }

  fetchAllClassesAndSections() {

    axios.get("http://localhost:8001/api/fetchAllClassesAndSections").then(cRes => {

  console.log("ClassFeeTemplate - fetchAllClassesAndSections - cRes.data - " + JSON.stringify(cRes.data));

      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ classDetails: cRes.data }, () => {

          console.log('ClassDetails - fetchAllClassesAndSections - All class details - ' + JSON.stringify(this.state.classDetails));
        this.fetchClasses();        
        });
        
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

  console.log("ClassFeeTemplate - fetchSelectedClassStudentsData - sdRes.data - " + JSON.stringify(sdRes.data));

      if (sdRes.data.errors) {

        return this.setState({ errors: sdRes.data.errors });

      } else {

        console.log('ClassDetails - fetchSelectedClassStudentsData - \nClass details - ' + JSON.stringify(this.state.classDetails));

        this.setState({ studentsDataArray: sdRes.data.response.studentsData }, () => {

          console.log('ClassDetails - fetchSelectedClassStudentsData - studentsDataArray - ' + JSON.stringify(this.state.studentsDataArray));
        });
        
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
      createFeeTemplateView: false,
      section: ""
     });
  }

  async sectionChangeHandler(e) {

    var section = e.currentTarget.value;
    console.log("SendMail - sectionChangeHandler - e.target.name - " + [e.currentTarget.name] + " e.target.value - " + section);

    await this.setState({ section: section }, () => {
      
      console.log("SendMail - sectionChangeHandler - class - " + this.state.class + " section - " + this.state.section);

      // Fetching students data on the basis of selected class and section
      this.fetchSelectedClassStudentsData();

    });

    // Switching view to students view
    this.setState({ 
      createFeeTemplateView: true,
    });
    
  }

  /**
   * @description Handles the form search request
   * @param {*} e
   */

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */

  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
  }

  /**
   * @description Dismisses the alert
   * @param {*} e
   */
  onDismiss() {
    this.setState({ visible: !this.state.visible });
  }

  async submitHandler(e) {

    var submit = true;
    
    console.log("ClassFeeTemplate - submitHandler - Entry");
    
    await this.setState({
      rowError: "", templateNameError: "", success: false, templateTypeError:"",
      modalSuccess: false
    }, () => {
      if (!this.state.templateName) {
        this.setState({ templateNameError: "Please Enter Template Name" });
        submit = false;}

        if (!this.state.templateType) {
          this.setState({ templateTypeError: "Please Select Template Type" });
          submit = false;

      }  if (this.state.rows.length === 0) {
        this.setState({ rowError: "Please add atleast one Fee Category" });
        submit = false;
      } else
        for (var i = 0; i < this.state.rows.length; i++) {
          if (
            this.state.rows[i].feeType === "" ||
            this.state.rows[i].amount === ""
          ) {
            this.setState({
              rowError: "Please fill all the table fields first"
            });
            submit = false;

            break;
          }
        }

      if (submit === true) {
        
        console.log("ClassFeeTemplate - addNewFeeTemplateToSelectedClassStudents - Submitting Template");
        
        // Creating a new template.
        axios
          .post("http://localhost:8001/api/feeTemplate", this.state)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

            if(result.data.errors) {
              
              if (result.data.errors.templateName) {
                this.setState({
                  templateNameError: "Template Name already exists! Use another Template Name"
                });
              }

            } else if (result.data.msg === "Success") {

              // Creating studentUsernameArray from studentsData Array.
              var studentUsernameArray = [];

              if(this.state.studentsDataArray) {
                this.state.studentsDataArray.forEach(studentData => {

                  studentUsernameArray.push(studentData.username);
                });
              }

              this.setState({
                studentUsernameArray : studentUsernameArray
              }, async () => {

                await console.log("Run in async mode");

                // Adding the newly create template to all the students of the selected class in students collection.
                this.addNewFeeTemplateToSelectedClassStudents();

              });

            }

          });
      }
    });
  }

  /**
   * Add newly create Fee Template to all the students of the selected class
   * Adding it in 'feeTemplates' item of 'Students' collection
   */
  async addNewFeeTemplateToSelectedClassStudents() {

    var updateStudentDetailsByUsernameArrayRequest = {
      "username": this.state.studentUsernameArray,
      "feeTemplate": this.state.templateName.toLowerCase()
    }

    console.log("ClassFeeTemplate - addNewFeeTemplateToSelectedClassStudents - updateStudentDetailsByUsernameArrayRequest - "
      + JSON.stringify(updateStudentDetailsByUsernameArrayRequest));

    await axios.post("http://localhost:8001/api/updateStudentDetailsByUsernameArray", updateStudentDetailsByUsernameArrayRequest)
    .then(updateStudentRes => {

      if (updateStudentRes.data.errors) {

        var errors = updateStudentRes.data.errors
        console.log("ClassFeeTemplate - addNewFeeTemplateToSelectedClassStudents - ERROR in updateStudentDetailsByUsernameArray - " 
        + JSON.stringify(errors));

        if(errors.username && errors.username.msg && errors.username.msg === "Please Enter Username") {
          this.setState({
            modalMessage: "No Students found in the selected class. Template '" + this.state.templateName + "' Created but is not added to any student."
          });
        } else {
          this.setState({
            modalMessage: "Some error in adding template to Class, check server logs. Template '" + this.state.templateName + "' Created but is not added to any student."
          });
        }

        this.setState({ errors: errors });

      } else {
        
        this.setState({
          modalMessage: "Template '" + this.state.templateName + "' Created and Added to the class Successfully!"
        });
        console.log("ClassFeeTemplate - addNewFeeTemplateToSelectedClassStudents - updateStudentDetailsByUsernameArray response - " + updateStudentRes.data.response);
      }

      this.setState({
        templateName: "",
        rows: [{ feeType: "", amount: "" }],
        success: true,
        modalSuccess: true,
        templateNameError:"",
        templateTypeError:"",
        rowError:"",
        templateType:""
      });
    });
  }

  handleChange = idx => e => {
    e.preventDefault();
    const { name, value } = e.target;
    const temp = this.state.rows;
    temp[idx][name] = value;

    this.setState(
      {
        rows: temp
      },
      () => {
        console.log("Change State: " + JSON.stringify(this.state));
      }
    );
  };
  handleAddRow = e => {
    e.preventDefault();
    this.setState({ rowError: "" });
    const item = {
      feeType: "",
      amount: ""
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

  handleRemoveSpecificRow = idx => () => {
    const temp = [...this.state.rows];
    temp.splice(idx, 1);
    this.setState({ rows: temp });
  };


  handleEditChange = idx => e => {
    e.preventDefault();
    const { name, value } = e.target;
    const temp = this.state.editRows;
    temp[idx][name] = value;

    this.setState(
      {
        editRows: temp
      },
      () => {
        console.log("Change State: " + JSON.stringify(this.state));
      }
    );
  };
  handleEditAddRow = e => {
    e.preventDefault();
    this.setState({ rowError: "" });
    const item = {
      feeType: "",
      amount: ""
    };
    this.setState({
      editRows: [...this.state.editRows, item]
    });
  };

  handleEditRemoveSpecificRow = idx => () => {
    const temp = [...this.state.editRows];
    temp.splice(idx, 1);
    this.setState({ editRows: temp });
  };



  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="10">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Add Fee Template to Entire Class</h1>
                  <br /> <br />
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

                  {this.state.classesView && (


                    <div>
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

                    {this.state.createFeeTemplateView && (

<Form>

                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Create & Add Fee Template</h3>
                          <br />
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Template Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                              label="Template Name"
                              name="templateName"
                              id="templateName"
                              value={this.state.templateName.charAt(0).toUpperCase() + this.state.templateName.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { templateName: e.target.value },
                                  () => {
                                    console.log(
                                      "Template name: " +
                                      this.state.templateName
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.templateNameError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.templateNameError} </p>
                              </h6>{" "}
                            </font>
                          )}

<InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                <b>Template Type</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                name="templateType"
                                id="templateType"
                                size="lg"
                                type="select"
                                onChange={e => {
                                  this.setState(
                                    { templateType: e.target.value },
                                    () => {
                                      console.log(
                                        "Template Type: " +
                                        this.state.templateType
                                      );
                                    }
                                  );
                                }}
                                value={this.state.templateType}
                              >

                               <option value="">Select</option>
                                <option value="Monthly">Monthly</option>
                                <option value="Quarterly">Quarterly</option>
                                <option value="Half Yearly">Half Yearly</option>
                                <option value="Yearly">Yearly</option>

                              </Input>
                            </InputGroup>
                            {this.state.templateTypeError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.templateTypeError}</p>
                              </font>
                            )}






                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "palevioletred" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Fee Category </h4>
                                </th>
                                <th className="text-center">
                                  <h4> Amount(Rs)</h4>{" "}
                                </th>
                                <th className="text-center">
                                  <Button
                                    onClick={this.handleAddRow}
                                    className="btn btn-primary"
                                    color="primary"
                                    size="lg"
                                  >
                                    {" "}
                                    Add Row
                          </Button>

                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        type="text"
                                        name="feeType"
                                        value={this.state.rows[idx].feeType}
                                        onChange={this.handleChange(idx)}
                                        className="form-control"
                                        style={{textAlign:'center'}}
                                        size="lg"
                                        id="feeType"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="amount"
                                        type="number"
                                        className="form-control"
                                        value={this.state.rows[idx].amount}
                                        onChange={this.handleChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificRow(
                                        idx
                                      )}
                                      size="lg"
                                    >
                                      Remove
                                    </Button>
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


                          <br />
                          <Row>
                            <Col className="col-md-3"></Col>
                            <Col className="col-md-6">
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"
                                block
                              >
                                Create & Add
                              </Button>
                            </Col>
                            <Col className="col-md-3"></Col>
                          </Row>
                        </CardBody>

                      </Card>
</Form>
                    )}

                  
                </CardBody>
              </Card>

            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ClassFeeTemplate;
