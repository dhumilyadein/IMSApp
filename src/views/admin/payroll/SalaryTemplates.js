import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  CardHeader,
  Label,
  Row,
  Table,
  Modal,
  ModalHeader
} from "reactstrap";

import axios from "axios";

class SalaryTemplates extends Component {
  constructor(props) {
    super(props);
    this.getExistingSalaryTemplates();
    this.state = {
      showCreateTemplate: false,
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
      templateType:""

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
    this.getExistingSalaryTemplates = this.getExistingSalaryTemplates.bind(this);

    this.updateHandler = this.updateHandler.bind(this);
    this.copyHandler = this.copyHandler.bind(this);
    this.handleRemoveExistingSpecificRow = this.handleRemoveExistingSpecificRow.bind(this);



  }

  getExistingSalaryTemplates() {

    axios
      .get("http://localhost:8001/api/existingSalaryTemplates")
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
          <Row className="justify-content-center" lg="2">
            <Col md="10">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Salary Templates</h1>
                  <br /> <br />
                  {this.state.success && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={"modal-success " + this.props.className}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                        Salary Template saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}
                  <Form>
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
                          Create Template
                        </Button>
                      </div>
                    )}

                    <br />
                    {this.state.showCreateTemplate && (
                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Create Salary Template</h3>
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











                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "palevioletred" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  <h4> % of Basic </h4>{" "}
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Earning Type</h4>
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
                                        name="percentOfBasic"
                                        value={this.state.rows[idx].percentOfBasic}
                                        onChange={this.handleChange(idx)}
                                        className="form-control"
                                        style={{textAlign:'center'}}
                                        size="lg"
                                        id="percentOfBasic"
                                        disabled={idx===0}
                                      />
                                    </InputGroup>
                                  </td>

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="earningType"
                                        type="text"
                                      //  placeholder={e=>{if(idx===0) return("Basic Salary")}}
                                     defaultValue={()=>{return "ddf";}}

                                        className="form-control"
                                        value={this.state.rows[idx].earningType}
                                        onChange={this.handleChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="earningType"
                                        size="lg"
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


                          <br /> <br />
                          <Row>
                            <Col>
                              <Button
                                onClick={this.submitHandler}
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



                  </Form>
                </CardBody>
              </Card>





              {this.state.showExistingTemplate && this.state.existingRows.length>0 &&
                <Card className="mx-4">
                  <CardBody className="p-4">

                    <Form>
                      <br />

                      <Card className="mx-1">
                        <CardBody className="p-2">
                        <CardHeader style={{backgroundColor: 'Aqua', borderColor: 'black',  display: 'flex',
  alignItems: 'center'}}>
                          <h2> Existing Fee Templates</h2>
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
                      </Card>

                    </Form>
                  </CardBody>
                </Card>}
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default SalaryTemplates;
