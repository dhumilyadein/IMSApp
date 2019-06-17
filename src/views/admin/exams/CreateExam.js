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

    this.state = {
      showCreateExam: false,
      status: "Active",
      erorrs: null,
      success: null,
      userdata: null,
      
      // existingRows: [{ examName: "" }],
      existingRows: [],
      
      showCreateButton: true,
      rowError: false,
      examNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      showEditExam: false,
      examNo: "",
      examDescriptionError:"",
      examDescription:"",

      examName: "",

      percentageShareInFinalResult:null,
      percentageShareInFinalResultError:"",
      shareInFinalResult: null,
      isMandatryToAttendForFinalResult: false,
      classesAndSections: [],
      classes: [],

      // Contains both label and value the class value (eg - [{value='I', label='I'}])
      selectClasses: [],

      // Contains only the class value (eg - [I, II, III] etc)
      applicableForClasses: [],

      insertExamErrorMessage: "",

      modalSuccess: false,
      showExistingExams:true,

      examCreatedFlag: false

    };

    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.fetchExamDetails = this.fetchExamDetails.bind(this);

    this.updateHandler = this.updateHandler.bind(this);
    this.handleRemoveExistingSpecificRow = this.handleRemoveExistingSpecificRow.bind(this);

    this.changeHandler = this.changeHandler.bind(this);
    this.fetchAllClassesAndSections = this.fetchAllClassesAndSections.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.handleClassChange = this.handleClassChange.bind(this);
    this.createExamBtnHandler = this.createExamBtnHandler.bind(this);
    this.insertExam = this.insertExam.bind(this);
    this.isMandatryToAttendForFinalResultChangeHandler = this.isMandatryToAttendForFinalResultChangeHandler.bind(this);
    this.resetCreateExamForm = this.resetCreateExamForm.bind(this);

    // Fetching all classes to display in the classes dropdown on page load
    this.fetchAllClassesAndSections();

    // Fetching exam details on page load
    this.fetchExamDetails();

  }

/**
   * @description Called when the change event is triggered for isMandatryToAttendForFinalResultChangeHandler appswith.
   * @param {*} e
   */
  isMandatryToAttendForFinalResultChangeHandler(e) {
    // console.log("Name: "+e.target.name +" Value: "+ e.target.checked);
    this.setState({
      [e.target.name]: e.target.checked
    });
  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {
    // console.log("Name: "+e.target.name +" Value: "+ e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  resetCreateExamForm() {

    console.log("resetCreateExamForm resetCreateExamForm");

    this.state = {
      showCreateExam: false,
      status: "Active",
      erorrs: null,
      success: null,
      userdata: null,
      
      // existingRows: [{ examName: "" }],
      existingRows: [],
      
      showCreateButton: true,
      rowError: false,
      examNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      showEditExam: false,
      examNo: "",
      examDescriptionError:"",
      examDescription:"",

      examName: "",

      percentageShareInFinalResult:null,
      percentageShareInFinalResultError:"",
      shareInFinalResult: null,
      isMandatryToAttendForFinalResult: false,
      classesAndSections: [],
      classes: [],

      // Contains both label and value the class value (eg - [{value='I', label='I'}])
      selectClasses: [],

      // Contains only the class value (eg - [I, II, III] etc)
      applicableForClasses: [],

      insertExamErrorMessage: "",

      modalSuccess: false,
      showExistingExams:true,

      examCreatedFlag: false

    };
  }

  /**
   * Fetches all the classes and section details and nothing else
   */
  fetchAllClassesAndSections() {

    axios.get("http://localhost:8001/api/fetchAllClassesAndSections").then(cRes => {

      // console.log("CreateExam - fetchAllClassesAndSections - cRes.data - " + JSON.stringify(cRes.data));

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
      applicableForClasses: classesArrayTemp,
    }, () => {
      console.log("CreateExam - handleClassChange - selectedClasses - " + JSON.stringify(this.state.selectedClasses) 
      + " applicableForClasses - " + JSON.stringify(this.state.applicableForClasses));
    });

  };

  createExamBtnHandler() {

    this.insertExam();
  }

  insertExam(){

    console.log("CreateExam - insertExam start - this.state.examName- " + this.state.examName);

    var insertExamRequest = {};
    insertExamRequest.examName = this.state.examName;
    insertExamRequest.examDescription = this.state.examDescription;
    insertExamRequest.applicableForClasses = this.state.applicableForClasses;
    insertExamRequest.percentageShareInFinalResult = this.state.percentageShareInFinalResult;
    insertExamRequest.isMandatryToAttendForFinalResult = this.state.isMandatryToAttendForFinalResult;

    console.log("CreateExam - insertExam start - insertExamRequest- " + JSON.stringify(insertExamRequest));

    axios.post("http://localhost:8001/api/insertExam", insertExamRequest).then(eRes => {

      console.log("CreateExam - insertExam - response - " + JSON.stringify(eRes.data));

      if (eRes.data.errors) {

        console.log("CreateExam - insertExam - ERRORS - " + eRes.data.errors);
        this.setState(
          {
            modalSuccess: true,
            modalColor: "modal-danger",
            modalMessage: "Error - " + JSON.stringify(eRes.data.errors)
          }, () => {

            // Fetching the exam details so that add the recently added exam to the existing exams table
            this.fetchExamDetails();
          }
        );
        //return this.setState({ insertExamErrorMessage: eRes.data.errors });

      } else {

        this.setState(
          {
            modalSuccess: true,
            modalColor: "modal-success",
            modalMessage: "Exam created successfully!",
            examCreatedFlag: true
          }, () => {

            // Fetching the exam details so that add the recently added exam to the existing exams table
            this.fetchExamDetails();
          }
        );
        console.log("CreateExam - insertExam - msg - " + eRes.data.msg);
      }
    });
  }

  fetchExamDetails() {

    axios
      .get("http://localhost:8001/api/fetchExamDetails")
      .then(result => {
        
        // console.log("CreateExam - fetchExamDetails - exam details - " + JSON.stringify(result.data));
        
        if (result.errors) {
          return this.setState({ errors: result.errors });
        } else {
  
          this.setState({ existingRows: result.data });
          // console.log('ClassDetails - fetchExamDetails - All exam details - ' + JSON.stringify(this.state.existingRows));
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

    console.log("CreateExam - toggleSuccess - Entry");

    this.setState({
      modalSuccess: !this.state.modalSuccess
    });

    if (this.state.examCreatedFlag) {
      console.log("CreateExam - toggleSuccess - Calling resetCreateExamForm");
      this.resetCreateExamForm();
    }
  }

  /**
   * @description Dismisses the alert
   * @param {*} e
   */
  onDismiss() {
    this.setState({ visible: !this.state.visible });
  }

  updateHandler(e) {
    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state));
    this.setState({
      rowError: "", examNameError: "", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.examName) {
        this.setState({ examNameError: "Please Enter Exam Name" });
        submit = false;
      }

      if (submit === true) {

        var udpateExamRequest = {
          "examName": this.state.examName,
          "examDescription":this.state.examDescription,
      "applicableForClasses": this.state.applicableForClasses,
      "percentageShareInFinalResult": this.state.percentageShareInFinalResult,
      "isMandatryToAttendForFinalResult": this.state.isMandatryToAttendForFinalResult,
        }
        this.setState()
        console.log("Updating Exam - udpateExamRequest - " + udpateExamRequest);
        axios
          .post("http://localhost:8001/api/updateExam", udpateExamRequest)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

            if (result.data.message === "Exam details updated successfully")
              this.setState({
                success: true,
                modalSuccess: true,
                modalMessage: "Exam details updated successfully.",
                modalColor: "modal-success",
                examNameError:"",
                examDescriptionError:"",
                rowError:"",
                examCreatedFlag: true

              });

            this.fetchExamDetails();
          });
      }
    });
  }

  handleRemoveExistingSpecificRow= idx => () => {

    console.log("CreateExam - handleRemoveExistingSpecificRow - examName - " + this.state.examName);

    confirmAlert({
      title: 'Confirm to Remove',
      message: 'Are you sure to Remove this Exam?',
      buttons: [
        {
          label: 'Yes',
          onClick: () => {
            const temp = [...this.state.existingRows];
            temp.splice(idx, 1);
            this.setState({ existingRows: temp,
            examName: this.state.existingRows[idx].examName},()=>{
        
              axios
              .post("http://localhost:8001/api/removeExam", this.state)
              .then(result => {
                
                if (result.data.errors) {
                  console.log("CreateExam - handleRemoveExistingSpecificRow - ERROR in removing exm - " + result.data.errors);
                } else {
                 this.fetchExamDetails();
                }
              });
        
            });

          }
          
         
        },
        {
          label: 'No',
          onClick: () =>  {  this.fetchExamDetails();}
        }
      ]
    })
  };

  async toggleModalSuccess() {

    await console.log("CreateExam - toggleModalSuccess this.state.showModalFlag - " + this.state.showModalFlag);
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
  }

  render() {
    return (
      <div>
        <Container>

              <Card className="mx-1">
                <CardBody className="p-2">
                  <h1>Manage Exams</h1>
                  {this.state.modalSuccess && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={this.state.modalColor}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                      {this.state.modalMessage}
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
                              showCreateExam: true,
                              showCreateButton: false,
                              showExistingExams:false,
                              examName:"",
                              examDescription:"",
                              examNameError:"",
                              examDescriptionError:"",
                              rowError:"",

                            });
                          }}
                        >
                          Create Exam
                        </Button>
                      </div>
                    )}

                    {this.state.showCreateExam && (
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
                              value={this.state.examName}
                              onChange={e => {
                                this.setState(
                                  { examName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) },
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
                                      name="isMandatryToAttendForFinalResult"
                                      id="isMandatryToAttendForFinalResult"
                              size="lg"
                                      className={"mx-1"}
                                      variant={"3d"}
                                      color={"primary"}
                                      size={"sm"}
                                      onChange={this.isMandatryToAttendForFinalResultChangeHandler}
                                      disabled={this.state.disabled}
                                      checked={this.state.isMandatryToAttendForFinalResult}
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
                                      onChange={this.isMandatryToAttendForFinalResultChangeHandler}
                                      disabled={this.state.disabled}
                                      checked={this.state.isMandatryToAttendForFinalResult}
                                    />
                                  </td>
                                </tr>
                                </tbody>
                                </Table> */}

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
                                  this.resetCreateExamForm();
                                  this.setState({
                                    showCreateExam: false,
                                    showCreateButton: true,
                                    showExistingExams:true,
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




                    {this.state.showEditExam &&
                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h2 align="center"> Edit Exam :  <font color="blue">
                           {this.state.examName}</font> </h2>
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText style={{ width: "120px" }}>
                                <b>Exam Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              label="Exam Name"
                              size="lg"
                              name="examName"
                              disabled={true}
                              id="examName"
                              value={this.state.examName}
                              onChange={e => {
                                this.setState(
                                  { examName: e.target.value.charAt(0).toUpperCase() + e.target.value.slice(1) },
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
                                      name="isMandatryToAttendForFinalResult"
                                      id="isMandatryToAttendForFinalResult"
                              size="lg"
                                      className={"mx-1"}
                                      variant={"3d"}
                                      color={"primary"}
                                      size={"sm"}
                                      onChange={this.isMandatryToAttendForFinalResultChangeHandler}
                                      disabled={this.state.disabled}
                                      checked={this.state.isMandatryToAttendForFinalResult}
                                    /> 
                            </InputGroup> 
                            <br />  
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
                                    showEditExam: false,
                                    showCreateExam: false,
                                    showCreateButton: true,
                                    showExistingExams:true,
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

              {this.state.showExistingExams && this.state.existingRows.length>0 &&
                <Card className="mx-1">
                  <CardBody className="p-2">

                        <CardHeader style={{backgroundColor: 'Aqua', borderColor: 'black',  display: 'flex',
  alignItems: 'center'}}>
                          <h2> Existing Exams</h2>
                           </CardHeader>



                          <br />
                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Exam Name </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Exam Description </h4>
                                </th>

                                 <th className="text-center">
                                  {" "}
                                  <h4>Applicable For Classes</h4>
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
                                    <h5> {this.state.existingRows[idx].examName}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingRows[idx].examDescription}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingRows[idx].applicableForClasses.toString()}</h5>
                                  </td>

                                  <td align="center">
                                    <Button
                                     color="primary"
                                      onClick={()=>{
                                        
                                        var selectedClassesArray = [];
                                        this.state.existingRows[idx].applicableForClasses.forEach(element => {

                                          var selectedClass = {};
                                          selectedClass.value = element;
                                          selectedClass.label = element;

                                          selectedClassesArray.push(selectedClass);
                                        })

                                        
                                        this.setState({
                                        showEditExam: true,
                                        examNo: idx,
                                        examName: this.state.existingRows[idx].examName,
                                        examDescription: this.state.existingRows[idx].examDescription,
                                        selectedClasses: selectedClassesArray,
                                        percentageShareInFinalResult: this.state.existingRows[idx].percentageShareInFinalResult,
                                        isMandatryToAttendForFinalResult: this.state.existingRows[idx].isMandatryToAttendForFinalResult,
                                        showCreateExam:false,
                                        showCreateButton:false,
                                        showExistingExams:false,
                                        examNameError:"",
                                        examDescriptionError:"",
                                        rowError:""
                                      },()=>{console.log("isMandatryToAttendForFinalResult - " + JSON.stringify(this.state.existingRows[idx])
                                      + " Updated State: "+JSON.stringify(this.state));})
                                      }}


                                      size="lg"
                                    >
                                      Edit
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
