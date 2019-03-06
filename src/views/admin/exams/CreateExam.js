import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
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
import Select from 'react-select';
import { AppSwitch } from "@coreui/react";

import axios from "axios";

class CreateExam extends Component {
  constructor(props) {
    super(props);
    this.getExistingTemplates();
    this.state = {
      showCreateTemplate: false,
      status: "Active",
      erorrs: null,
      success: null,
      userdata: null,
      
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

      examName: "",
      examNameError: "",

      examDescription: "",
      examDescriptionError: "",
      percentageShareInFinalResult:null,
      percentageShareInFinalResultError:"",
      shareInFinalResult: null,
      isMandatoryToAttendChecked: false,
      classesAndSections: [],
      classes: [],

      // Contains both label and value the class value (eg - [{value='I', label='I'}])
      selectClasses: [],

      // Contains only the class value (eg - [I, II, III] etc)
      selectClassesArray: [],

      insertExamErrorMessage: "",

      createExamModal: false

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
    this.getExistingTemplates = this.getExistingTemplates.bind(this);

    this.updateHandler = this.updateHandler.bind(this);
    this.copyHandler = this.copyHandler.bind(this);
    this.handleRemoveExistingSpecificRow = this.handleRemoveExistingSpecificRow.bind(this);

    this.changeHandler = this.changeHandler.bind(this);
    this.fetchAllClassesAndSections = this.fetchAllClassesAndSections.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.createExamBtnHandler = this.createExamBtnHandler.bind(this);
    this.insertExam = this.insertExam.bind(this);

    // Fetching all classes to display in the classes dropdown on page load
    this.fetchAllClassesAndSections();

  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {
    // console.log("Name: "+e.target.name +" Value: "+e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /**
   * Fetches all the classes and section details and nothing else
   */
  fetchAllClassesAndSections() {

    axios.get("http://localhost:8001/api/fetchAllClassesAndSections").then(cRes => {

      console.log("CreateExam - fetchAllClassesAndSections - cRes.data - " + JSON.stringify(cRes.data));

      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ classesAndSections: cRes.data }, () => {

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

      // console.log("element.class - " + element.class);
      classArray.push(element.class);
    });
    // console.log("classArray - " + classArray);
    var uniqueItems = Array.from(new Set(classArray));

    var classesArray = [];
    uniqueItems.forEach(element=> {

      var classJSON = {};
      classJSON.value = element;
      classJSON.label = element;

      classesArray.push(classJSON);
    });

    this.setState({ classes: classesArray }, () => {

      console.log("CreateExam - fetchClasses - Unique classes - " + this.state.classes 
      + " isArray - " + Array.isArray(this.state.classes));
    });
  }

  /**
   * Handles class change in the class dropdown
   */
  // handleClassChange(event) {

  //   let newVal = event.target.value.value;
  //   let stateVal = this.state.selectClasses;

  //   console.log(stateVal)
  //   console.log(newVal)

  //   stateVal.indexOf(newVal) === -1
  //     ? stateVal.push(newVal)
  //     : stateVal.length === 1
  //       ? (stateVal = [])
  //       : stateVal.splice(stateVal.indexOf(newVal), 1)

  //   this.setState({ selectClasses: stateVal }, () => {
  //     console.log("CreateExam - handleClassChange - " + this.state.selectClasses);
  //   });
  // }

  handleClassChange = (newValue, actionMeta) => {

    console.log("CreateExam - handleClassChange - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);

    var classesArrayTemp = [];
    newValue.forEach(element => {
      classesArrayTemp.push(element.value);
    });
    this.setState({
      selectedClasses: newValue,
      selectClassesArray: classesArrayTemp,
    }, () => {
      console.log("CreateExam - handleClassChange - selectedClasses - " + JSON.stringify(this.state.selectedClasses) 
      + " selectClassesArray - " + JSON.stringify(this.state.selectClassesArray));
    });

  };

  createExamBtnHandler() {

    this.insertExam();
  }

  insertExam(){

    var insertExamRequest = {};
    insertExamRequest.examName = this.state.examName;
    insertExamRequest.examDescription = this.state.examDescription;
    insertExamRequest.applicableForClasses = this.state.selectClassesArray;
    insertExamRequest.percentageShareInFinalResult = this.state.percentageShareInFinalResult;
    insertExamRequest.isMandatoryToAttendChecked = this.state.isMandatoryToAttendChecked;

    console.log("CreateExam - insertExam start - insertExamRequest- " + JSON.stringify(insertExamRequest));

    axios.post("http://localhost:8001/api/insertExam", insertExamRequest).then(eRes => {

      console.log("CreateExam - insertExam - response - " + JSON.stringify(eRes.data));

      if (eRes.data.errors) {

        console.log("CreateExam - insertExam - ERRORS - " + eRes.data.errors);
        return this.setState({ insertExamErrorMessage: eRes.data.errors });

      } else {

        this.setState(
          {
            createExamModal: true
          }
        );
      }
    });
  }

  getExistingTemplates() {

    axios
      .get("http://localhost:8001/api/existingTemplates")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
            existingRows: result.data
          });
        }
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

  submitHandler(e) {
    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state));
    console.log("Row Length: " + this.state.rows.length);
    this.setState({
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
        console.log("Submitting Template: ");
        axios
          .post("http://localhost:8001/api/feeTemplate", this.state)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
            if(result.data.errors)
            {if (result.data.errors.templateName)
              this.setState({
                templateNameError: "Template Name already exists! Use another Template Name"
              });}
             else if (result.data.msg === "Success")
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
            this.getExistingTemplates();
          });
      }
    });
  }

  updateHandler(e) {
    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state));
    console.log("Row Length: " + this.state.editRows.length);
    this.setState({
      rowError: "", templateNameError: "", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.templateName) {
        this.setState({ templateNameError: "Please Enter Template Name" });
        submit = false;

      }
      if (!this.state.templateType) {
        this.setState({ templateTypeError: "Please Select Template Type" });
        submit = false;

    }

      if (this.state.editRows.length === 0) {
        this.setState({ rowError: "Please add atleast one Fee Category" });
        submit = false;
      } else
        for (var i = 0; i < this.state.editRows.length; i++) {
          if (
            this.state.editRows[i].feeType === "" ||
            this.state.editRows[i].amount === ""
          ) {
            this.setState({
              rowError: "Please fill all the table fields first"
            });
            submit = false;

            break;
          }
        }

      if (submit === true) {

        this.setState()
        console.log("Updating Template for: ");
        axios
          .post("http://localhost:8001/api/updateFeeTemplate", this.state)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
            if (result.data.msg === "Template Updated")
              this.setState({
                success: true,
                modalSuccess: true,
                templateNameError:"",
                templateTypeError:"",
                rowError:""

              });

            this.getExistingTemplates();
          });
      }
    });
  }


  copyHandler(e) {
    var submit = true;
    console.log("in Copy State: " + JSON.stringify(this.state));
    console.log("Row Length: " + this.state.editRows.length);
    this.setState({
      rowError: "", templateNameError: "", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.templateName) {
        this.setState({ templateNameError: "Please Enter Template Name" });
        submit = false;
      }

      if (!this.state.templateType) {
        this.setState({ templateTypeError: "Please Select Template Type" });
        submit = false;

    }

    if (this.state.editRows.length === 0) {
        this.setState({ rowError: "Please add atleast one Fee Category" });
        submit = false;
      } else
        for (var i = 0; i < this.state.editRows.length; i++) {
          if (
            this.state.editRows[i].feeType === "" ||
            this.state.editRows[i].amount === ""
          ) {
            this.setState({
              rowError: "Please fill all the table fields first"
            });
            submit = false;

            break;
          }
        }

      if (submit === true) {

        this.setState()
        console.log("Copying Template for: ");
        axios
          .post("http://localhost:8001/api/copyFeeTemplate", this.state)
          .then(result => {
            console.log("COPY RESULT.data " + JSON.stringify(result.data));
                if (result.data.msg === "already exist")

            this.setState({
              templateNameError: "Template Name already exists! Use another Template Name"
            });

           else if (result.data.msg === "Template Copied")
              this.setState({
                success: true,
                modalSuccess: true,
                templateNameError:"",
                templateTypeError:"",
                rowError:""

              });
            this.getExistingTemplates();
          });
      }
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


  handleRemoveExistingSpecificRow= idx => () => {

    confirmAlert({
      title: 'Confirm to Remove',
      message: 'Are you sure to Remove this Template?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const temp = [...this.state.existingRows];
            temp.splice(idx, 1);
            this.setState({ existingRows: temp,
            templateName: this.state.existingRows[idx].templateName},()=>{
        
        
              axios
              .post("http://localhost:8001/api/deleteTemplate", this.state)
              .then(result => {
                console.log("RESULT.data " + JSON.stringify(result.data));
                if (result.data.error)
                 console.log(result.data.error);
                this.getExistingTemplates();
              });
        
            });

          }
          
         
        },
        {
          label: 'No',
          onClick: () =>  {  this.getExistingTemplates();}
        }
      ]
    })
  };

  render() {
    return (
      <div>
        <Container>
              <Card className="mx-1">
                <CardBody className="p-2">
                  <h1>Manage Exams</h1>
                  {this.state.success && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={"modal-success " + this.props.className}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                        Template saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}
                  <br />
                    {this.state.showCreateButton && (
                      <div className="justify-content-center">
                        {" "}
                        <Button
                          color="success"
                          size="lg"
                          onClick={() => {
                            this.setState({
                              showCreateTemplate: true,
                              showCreateButton: false,
                              showExistingTemplate:false,
                              templateName:"",
                              templateType:"",
                              templateNameError:"",
                              templateTypeError:"",
                              rowError:"",
                              rows: [{ feeType: "", amount: "" }],

                            });
                          }}
                        >
                          Create Exam
                        </Button>
                      </div>
                    )}

                    {this.state.showCreateTemplate && (
                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h2 align="center"> Create Exam</h2>
                          <br />
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Exam Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                              label="Exam Name"
                              name="examName"
                              id="examName"
                              value={this.state.examName.charAt(0).toUpperCase() + this.state.examName.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { examName: e.target.value },
                                  () => {
                                    console.log(
                                      "Exam name: " +
                                      this.state.examName
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.examNameError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.examNameError} </p>
                              </h6>{" "}
                            </font>
                          )}

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Exam Description</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                              label="Exam Description"
                              name="examDescription"
                              id="examDescription"
                              value={this.state.examDescription.charAt(0).toUpperCase() + this.state.examDescription.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { examDescription: e.target.value }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.examDescriptionError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.examDescriptionError} </p>
                              </h6>{" "}
                            </font>
                          )}

                          <InputGroupAddon addonType="prepend">
                <InputGroupText >
                  <b>Applicable for Classes</b>
                </InputGroupText>
              </InputGroupAddon>
              {/* <Creatable
                simpleValue
                size="lg"
                value={this.state.selectedClasses}
                onChange={this.handleClassChange}
                isMulti={true}
                closeMenuOnSelect={false}
                autosize
                onCreateOption={this.handleClassCreate}
                options={this.state.classes}
                openMenuOnFocus={true}
              /> */}
              <Select
              placeholder="Select applicable for classes"
              isMulti={true}
              closeMenuOnSelect={false}
              value={this.state.selectedClasses}
              onChange={this.handleClassChange}
              options={this.state.classes}
              isClearable={true}
              isSearchable={true}
              openMenuOnFocus={true}
              />

              {this.state.dbErrors && this.state.dbErrors.classes && (
                <font color="red">
                  <h6>
                    {" "}
                    <p>{this.state.dbErrors.classes.msg} </p>
                  </h6>{" "}
                </font>
              )}

<br />

<InputGroup className="mb-3">
<InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                <b>Percentage Share in Final result</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                      type="number"
                              size="lg"
                                      name="percentageShareInFinalResult"
                                      id="percentageShareInFinalResult"
                                      autoComplete="shareInFinalResult"
                                      onChange={this.changeHandler}
                                      value={this.state.percentageShareInFinalResult}
                                    />
                            </InputGroup>
                            {this.state.percentageShareInFinalResultError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.percentageShareInFinalResultError}</p>
                              </font>
                            )}

 <InputGroup className="mb-3">
<InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                <b>Mandatory to Attend for Final results</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp;
                              <AppSwitch
                                      name="isMandatoryToAttendChecked"
                                      id="isMandatoryToAttendChecked"
                              size="lg"
                                      className={"mx-1"}
                                      variant={"3d"}
                                      color={"primary"}
                                      size={"sm"}
                                      onChange={this.changeHandler}
                                      disabled={this.state.disabled}
                                      checked={this.state.isMandatoryToAttendChecked}
                                    /> 
                            </InputGroup> 

                            {/* <Table responsive size="sm" hover>
                              <tbody>
                                <tr>
                                  <td>
                                  <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                <b>Mandatory For Final Result</b>
                                </InputGroupText>
                              </InputGroupAddon>
                                  </td>
                                  <td>
                                    <AppSwitch
                                      name="admin"
                                      id="admin"
                                      className={"mx-1"}
                                      variant={"3d"}
                                      color={"primary"}
                                      size={"sm"}
                                      onChange={this.roleHandler}
                                      disabled={this.state.disabled}
                                      checked={this.state.isMandatoryToAttendChecked}
                                    />
                                  </td>
                                </tr>
                                </tbody>
                                </Table> */}
                            {this.state.templateTypeError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.templateTypeError}</p>
                              </font>
                            )}                            

                          <br />
                          <Row>
                            <Col>
                              <Button
                                id="createExamBtn"
                                name="createExamBtn"
                                onClick={this.createExamBtnHandler}
                                size="lg"
                                color="success"
                                block
                              >
                                Create
                              </Button>
                              {this.state.insertExamErrorMessage &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.insertExamErrorMessage}</p>
                              </font>
                            )}  
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
                                Cancel to go Back
                              </Button>
                            </Col>
                          </Row>
                        </CardBody>

                      </Card>

                    )}




                    {this.state.showEditTemplate &&
                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Edit Template:  <font color="blue">
                           {this.state.templateName.charAt(0).toUpperCase() + this.state.templateName.slice(1)}</font> </h3>
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText style={{ width: "120px" }}>
                                <b>Template Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              label="Template Name"
                              size="lg"
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
                                <InputGroupText style={{ width: "120px" }}>
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
                                    onClick={this.handleEditAddRow}
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
                              {this.state.editRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        type="text"
                                        name="feeType"
                                        value={this.state.editRows[idx].feeType.charAt(0).toUpperCase()
                                           + this.state.editRows[idx].feeType.slice(1)}
                                        onChange={this.handleEditChange(idx)}
                                        style={{textAlign:'center'}}
                                        className="form-control"
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
                                        value={this.state.editRows[idx].amount}
                                        onChange={this.handleEditChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleEditRemoveSpecificRow(
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


                          <br /> <br />
                          <Row>
                            <Col>
                              <Button
                                onClick={this.updateHandler}
                                size="lg"
                                color="success"
                                block
                              >
                                Update
                          </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={() => {
                                  this.setState({
                                    showEditTemplate: false,
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
                                Cancel
                          </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    }

{this.state.showCopyTemplate &&
                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Copy Template:  <font color="blue"> {this.state.templateName.charAt(0).toUpperCase()
                             + this.state.templateName.slice(1)}</font> </h3>
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Template Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              label="Template Name"
                              size="lg"
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
                                <InputGroupText style={{ width: "120px" }}>
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
                                    onClick={this.handleEditAddRow}
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
                              {this.state.editRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        type="text"
                                        name="feeType"
                                        value={this.state.editRows[idx].feeType.charAt(0).toUpperCase() +
                                          this.state.editRows[idx].feeType.slice(1)}
                                        onChange={this.handleEditChange(idx)}
                                        className="form-control"
                                        size="lg"
                                        id="feeType"
                                        style={{textAlign:'center'}}
                                      />
                                    </InputGroup>
                                  </td>
                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="amount"
                                        type="number"
                                        className="form-control"
                                        value={this.state.editRows[idx].amount}
                                        onChange={this.handleEditChange(idx)}
                                        id="amount"
                                        size="lg"
                                        style={{textAlign:'center'}}
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleEditRemoveSpecificRow(
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


                          <br /> <br />
                          <Row>
                            <Col>
                              <Button
                                onClick={this.copyHandler}
                                size="lg"
                                color="success"
                                block
                              >
                               Create Copy
                          </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={() => {
                                  this.setState({
                                    showEditTemplate: false,
                                    showCreateTemplate: false,
                                    showCreateButton: true,
                                    showExistingTemplate:true,
                                    showCopyTemplate:false,
                                    rows: [{}]
                                  });
                                }}
                                size="lg"
                                color="secondary"
                                block
                              >
                                Cancel
                          </Button>
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    }



                </CardBody>
              </Card>





              {this.state.showExistingTemplate && this.state.existingRows.length>0 &&
                <Card className="mx-1">
                  <CardBody className="p-2">

                        <CardHeader style={{backgroundColor: 'Aqua', borderColor: 'black',  display: 'flex',
  alignItems: 'center'}}>
                          <h2> Existing Exams</h2>
                           &nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
                           <Button
                                      color="primary"
                                        onClick={this.getExistingTemplates}
                                      size="lg"
                                    >
                                      Refresh
                                    </Button> </CardHeader>



                          <br />
                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Template Name </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Template Type </h4>
                                </th>

                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingRows[idx].templateName.charAt(0).toUpperCase() +
                                      this.state.existingRows[idx].templateName.slice(1)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingRows[idx].templateType}</h5>
                                  </td>

                                  <td align="center">
                                    <Button
                                     color="primary"
                                      onClick={()=>{this.setState({
                                        editRows:this.state.existingRows[idx].templateRows,
                                        showEditTemplate: true,
                                        templateNo: idx,
                                        templateName: this.state.existingRows[idx].templateName,
                                        templateType: this.state.existingRows[idx].templateType,
                                        showCreateTemplate:false,
                                        showCreateButton:false,
                                        showExistingTemplate:false,
                                        templateNameError:"",
                                        templateTypeError:"",
                                        rowError:""


                                      },()=>{console.log("Updated State: "+JSON.stringify(this.state));})
                                      }}


                                      size="lg"
                                    >
                                      Edit
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                      color="warning"
                                      onClick={()=>{this.setState({
                                        editRows:this.state.existingRows[idx].templateRows,
                                        showEditTemplate: false,
                                        showCopyTemplate: true,
                                        templateNo: idx,
                                        templateName: this.state.existingRows[idx].templateName,
                                        templateType: this.state.existingRows[idx].templateType,
                                        showCreateTemplate:false,
                                        showCreateButton:false,
                                        showExistingTemplate:false,
                                        templateNameError:"",
                                        templateTypeError:"",
                                        rowError:""


                                      },()=>{console.log("Updated State: "+JSON.stringify(this.state));})
                                      }}

                                      size="lg"
                                    >
                                      Copy
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                      color="danger"
                                        onClick={this.handleRemoveExistingSpecificRow(idx)}
                                      size="lg"
                                    >
                                      Remove
                                    </Button>


                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>

                  </CardBody>
                </Card>}
        </Container>
      </div>
    );
  }
}

export default CreateExam;
