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
     
      erorrs: null,
      success: null,
      userdata: null,
      templateName: "",
      salaryRows: [{ earnType: "", amount: "" }],
      deductRows: [{ deductType: "", amount: "" }],
      editSalaryRows: [{ earnType: "", amount: "" }],
      editDeductRows: [{ deductType: "", amount: "" }],
totalEarning:0,
totalDeduction:0,
paidAmount:0,
      existingSalaryRows: [{ templateName: "" }],
      showCreateButton: true,
      salaryRowError: "",
      deductRowError:"",
      templateNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      showEditTemplate: false,
      templateNo: "",
      showExistingTemplate:true,
      showCopyTemplate:false,
   modalMessage:"",
      templateType:""

    };



    this.handleSalaryChange = this.handleSalaryChange.bind(this);
    this.handleDeductChange = this.handleDeductChange.bind(this);
    this.handleAddSalaryRow = this.handleAddSalaryRow.bind(this);
    this.handleAddDeductRow = this.handleAddDeductRow.bind(this);
    this.handleRemoveSpecificSalaryRow = this.handleRemoveSpecificSalaryRow.bind(this);
    this.handleRemoveSpecificDeductRow = this.handleRemoveSpecificDeductRow.bind(this);

    
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
            existingSalaryRows: result.data
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
      modalSuccess: !this.state.modalSuccess,
     
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
    console.log("Row Length: " + this.state.salaryRows.length);
    this.setState({
      salaryRowError: "", templateNameError: "", success: false, 
      modalSuccess: false, deductRowError:""
    }, () => {
      if (!this.state.templateName) {
        this.setState({ templateNameError: "Please Enter Template Name" });
        submit = false;}

        if (this.state.salaryRows.length === 0) {
        this.setState({ salaryRowError: "Please add atleast one Earn Type" });
        submit = false;
      } else
        for (var i = 0; i < this.state.salaryRows.length; i++) {
          if (
            this.state.salaryRows[i].feeType === "" ||
            this.state.salaryRows[i].amount === ""
          ) {
            this.setState({
              salaryRowError: "Please fill all the table fields first"
            });
            submit = false;

            break;
          }
        }

       
            for (var i = 0; i < this.state.deductRows.length; i++) {
              if (
                this.state.deductRows[i].deductType === "" ||
                this.state.deductRows[i].amount === ""
              ) {
                this.setState({
                  deductRowError: "Please fill all the table fields first"
                });
                submit = false;
    
                break;
              }
            }

      if (submit === true) {
        console.log("Submitting Template: ");
        axios
          .post("http://localhost:8001/api/addSalaryTemplate", this.state)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
            if(result.data.errors)
            {if (result.data.errors.templateName)
              this.setState({
                templateNameError: "Template Name already exists! Use another Template Name"
              });}
             else if (result.data.msg === "Success")
              this.setState({
              
                success: true,
                modalSuccess: true,
                modalMessage:"Salary Template Created Successfully!",
                templateName: "",
                salaryRows: [{ earnType: "", amount: "" }],
                deductRows: [{ deductType: "", amount: "" }],
                
                templateNameError:"",
               deductRowError:"",
                salaryRowError:"",
                paidAmount:0,
                totalDeduction:0,
                totalEarning:0,

              });
            this.getExistingSalaryTemplates();
          });
      }
    });
  }

  updateHandler(e) {
    var submit = true;
    console.log("in Update State: " + JSON.stringify(this.state));
    console.log("Row Length: " + this.state.salaryRows.length);
    this.setState({
      salaryRowError: "", templateNameError: "", success: false,
      modalSuccess: false
    }, () => {
        if (!this.state.templateName) {
            this.setState({ templateNameError: "Please Enter Template Name" });
            submit = false;}
    
            if (this.state.salaryRows.length === 0) {
            this.setState({ salaryRowError: "Please add atleast one Earn Type" });
            submit = false;
          } else
            for (var i = 0; i < this.state.salaryRows.length; i++) {
              if (
                this.state.salaryRows[i].feeType === "" ||
                this.state.salaryRows[i].amount === ""
              ) {
                this.setState({
                  salaryRowError: "Please fill all the table fields first"
                });
                submit = false;
    
                break;
              }
            }
    
           
                for (var i = 0; i < this.state.deductRows.length; i++) {
                  if (
                    this.state.deductRows[i].deductType === "" ||
                    this.state.deductRows[i].amount === ""
                  ) {
                    this.setState({
                      deductRowError: "Please fill all the table fields first"
                    });
                    submit = false;
        
                    break;
                  }
                }
    

      if (submit === true) {

        this.setState()
        console.log("Updating Template for: ");
        axios
          .post("http://localhost:8001/api/updateSalaryTemplate", this.state)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
            if (result.data.msg === "Template Updated")
              this.setState({
                success: true,
                modalSuccess: true,
                modalMessage:"Salary Template Updated Successfully!"


              });

            this.getExistingSalaryTemplates();
          });
      }
    });
  }


  copyHandler(e) {
    var submit = true;
    console.log("in Copy State: " + JSON.stringify(this.state));
    console.log("Row Length: " + this.state.salaryRows.length);
    this.setState({
      salaryRowError: "", templateNameError: "", success: false,
      modalSuccess: false, deductRowError:""
    }, () => {
        if (!this.state.templateName) {
            this.setState({ templateNameError: "Please Enter Template Name" });
            submit = false;}
    
            if (this.state.salaryRows.length === 0) {
            this.setState({ salaryRowError: "Please add atleast one Earn Type" });
            submit = false;
          } else
            for (var i = 0; i < this.state.salaryRows.length; i++) {
              if (
                this.state.salaryRows[i].feeType === "" ||
                this.state.salaryRows[i].amount === ""
              ) {
                this.setState({
                  salaryRowError: "Please fill all the table fields first"
                });
                submit = false;
    
                break;
              }
            }
    
           
                for (var i = 0; i < this.state.deductRows.length; i++) {
                  if (
                    this.state.deductRows[i].deductType === "" ||
                    this.state.deductRows[i].amount === ""
                  ) {
                    this.setState({
                      deductRowError: "Please fill all the table fields first"
                    });
                    submit = false;
        
                    break;
                  }
                }
    

      if (submit === true) {

        this.setState()
        console.log("Copying Template for: ");
        axios
          .post("http://localhost:8001/api/copySalaryTemplate", this.state)
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
                modalMessage:"Salary Template Copied Successfully!"

              });
            this.getExistingSalaryTemplates();
          });
      }
    });
  }

  handleSalaryChange = idx => e => {
    console.log("Salary: ");
   
    const { name, value } = e.target;
    const temp = this.state.salaryRows;
    temp[idx][name] = value;

      this.setState(
      {
        salaryRows: temp
      },
      () => {
        console.log("Change Salary: " + JSON.stringify(this.state.salaryRows));
       // if(e.target.name==="amount"){
            var temp=0;
 for(var i=0;i<this.state.salaryRows.length;i++)
temp=temp+parseInt(this.state.salaryRows[i].amount);
      
this.setState(
            {
              totalEarning: temp
    
            },
            ()=>{this.setState({paidAmount:this.state.totalEarning-this.state.totalDeduction});

           
        }

      
    );});
  
  };
  handleDeductChange = idx => e => {
    
    const { name, value } = e.target;
    const temp = this.state.deductRows;
    temp[idx][name] = value;

    this.setState(
      {
        deductRows: temp
      },
      () => {
        console.log("Change Deduct: " + JSON.stringify(this.state.deductRows));
    
             var temp=0;
            for(var i=0;i<this.state.deductRows.length;i++)
           temp=temp+parseInt(this.state.deductRows[i].amount)
                   this.setState(
                       {
                         totalDeduction: temp
               
                       },()=>{this.setState({paidAmount:this.state.totalEarning-this.state.totalDeduction})});
                   }
      
    );
  };

  handleAddSalaryRow = e => {
    e.preventDefault();
    this.setState({ salaryRowError: "" });
    const item = {
      earnType: "",
      amount: ""
    };
    this.setState({
      salaryRows: [...this.state.salaryRows, item]
    });
  };
  handleAddDeductRow = e => {
    e.preventDefault();
    this.setState({ deductRowError: "" });
    const item = {
      deductType: "",
      amount: ""
    };
    this.setState({
      deductRows: [...this.state.deductRows, item]
    });
  };


  handleRemoveSpecificSalaryRow = idx => () => {
    const temp = [...this.state.salaryRows];
    this.setState({totalEarning:this.state.totalEarning-parseInt(temp[idx].amount)}) 
    temp.splice(idx, 1);
    this.setState({ salaryRows: temp }


        
);
  };

  handleRemoveSpecificDeductRow = idx => () => {
    const temp = [...this.state.deductRows];
    this.setState({totalDeduction:this.state.totalDeduction-parseInt(temp[idx].amount)}) 
    temp.splice(idx, 1);
    this.setState({ deductRows: temp });
  };




  
  

  handleRemoveExistingSpecificRow= idx => () => {

    confirmAlert({
      title: 'Confirm to Remove',
      message: 'Are you sure to Remove this Template?',
      buttons: [

        
        {
          label: 'Yes',
          onClick: () => {
              
              axios
              .post("http://localhost:8001/api/deleteSalaryTemplate", {"templateName": this.state.existingSalaryRows[idx].templateName})
              .then(result => {
                console.log("RESULT.data " + JSON.stringify(result.data));
                if (result.data.error)
                 console.log(result.data.error);

else if(result.data.msg==="Template Deleted")
                {
console.log("in Delete")
  
this.getExistingSalaryTemplates();
}

              
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
                       {this.state.modalMessage}
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
                              templateNameError:"",
                              salaryRowError:"",
                              deductRowError:"",
                              salaryRows: [{ earnType: "", amount: "" }],
                              deductRows:[{ deductType: "", amount: "" }],
totalEarning:0,
totalDeduction:0,
paidAmount:0
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




<h4 align="center"> Earnings</h4>






                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
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
                                    onClick={this.handleAddSalaryRow}
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
                              {this.state.salaryRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                 

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="earnType"
                                        type="text"
                                      //  placeholder={e=>{if(idx===0) return("Basic Salary")}}
                                     defaultValue={()=>{return "ddf";}}

                                        className="form-control"
                                        value={this.state.salaryRows[idx].earnType}
                                        onChange={this.handleSalaryChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="earnType"
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
                                        value={this.state.salaryRows[idx].amount}
                                        onChange={this.handleSalaryChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificSalaryRow(
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
                          {this.state.salaryRowError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.salaryRowError} </p>
                              </h6>{" "}
                            </font>
                          )}

<br/>

<h4 align="center"> Deductions</h4>






                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "red" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                               
                                <th className="text-center">
                                  {" "}
                                  <h4>Deduction Type</h4>
                                </th>
                                <th className="text-center">
                                  <h4> Amount(Rs)</h4>{" "}
                                </th>
                                <th className="text-center">
                                  <Button
                                    onClick={this.handleAddDeductRow}
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
                              {this.state.deductRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                 

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="deductType"
                                        type="text"
                                      //  placeholder={e=>{if(idx===0) return("Basic Salary")}}
                                     defaultValue={()=>{return "ddf";}}

                                        className="form-control"
                                        value={this.state.deductRows[idx].deductType}
                                        onChange={this.handleDeductChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="deductType"
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
                                        value={this.state.deductRows[idx].amount}
                                        onChange={this.handleDeductChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificDeductRow(
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
                          {this.state.deductRowError  && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.deductRowError} </p>
                              </h6>{" "}
                            </font>
                          )}


<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Earnings(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="totalEarning"
                              id="totalEarning"
                              value={this.state.totalEarning}
                             disabled
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Deductions(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="totalDeduction"
                              id="totalDeduction"
                              value={this.state.totalDeduction}
                             disabled
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Paid Amount(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="paidAmount"
                              id="paidAmount"
                              value={this.state.paidAmount}
                             disabled
                            />
                          </InputGroup>
                         
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
                                    salaryRows: [{}]
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




<h4 align="center"> Earnings</h4>






                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
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
                                    onClick={this.handleAddSalaryRow}
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
                              {this.state.salaryRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                 

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="earnType"
                                        type="text"
                                      //  placeholder={e=>{if(idx===0) return("Basic Salary")}}
                                     defaultValue={()=>{return "ddf";}}

                                        className="form-control"
                                        value={this.state.salaryRows[idx].earnType}
                                        onChange={this.handleSalaryChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="earnType"
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
                                        value={this.state.salaryRows[idx].amount}
                                        onChange={this.handleSalaryChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificSalaryRow(
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
                          {this.state.salaryRowError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.salaryRowError} </p>
                              </h6>{" "}
                            </font>
                          )}

<br/>

<h4 align="center"> Deductions</h4>






                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "red" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                               
                                <th className="text-center">
                                  {" "}
                                  <h4>Deduction Type</h4>
                                </th>
                                <th className="text-center">
                                  <h4> Amount(Rs)</h4>{" "}
                                </th>
                                <th className="text-center">
                                  <Button
                                    onClick={this.handleAddDeductRow}
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
                              {this.state.deductRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                 

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="deductType"
                                        type="text"
                                      //  placeholder={e=>{if(idx===0) return("Basic Salary")}}
                                     defaultValue={()=>{return "ddf";}}

                                        className="form-control"
                                        value={this.state.deductRows[idx].deductType}
                                        onChange={this.handleDeductChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="deductType"
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
                                        value={this.state.deductRows[idx].amount}
                                        onChange={this.handleDeductChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificDeductRow(
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
                          {this.state.deductRowError  && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.deductRowError} </p>
                              </h6>{" "}
                            </font>
                          )}


<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Earnings(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="totalEarning"
                              id="totalEarning"
                              value={this.state.totalEarning}
                             disabled
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Deductions(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="totalDeduction"
                              id="totalDeduction"
                              value={this.state.totalDeduction}
                             disabled
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Paid Amount(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="paidAmount"
                              id="paidAmount"
                              value={this.state.paidAmount}
                             disabled
                            />
                          </InputGroup>
                         
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
                    }
  {this.state.showCopyTemplate &&
                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Copy Template <font color="blue">
                          </font> </h3>
              
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




<h4 align="center"> Earnings</h4>






                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
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
                                    onClick={this.handleAddSalaryRow}
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
                              {this.state.salaryRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                 

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="earnType"
                                        type="text"
                                      //  placeholder={e=>{if(idx===0) return("Basic Salary")}}
                                     defaultValue={()=>{return "ddf";}}

                                        className="form-control"
                                        value={this.state.salaryRows[idx].earnType}
                                        onChange={this.handleSalaryChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="earnType"
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
                                        value={this.state.salaryRows[idx].amount}
                                        onChange={this.handleSalaryChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificSalaryRow(
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
                          {this.state.salaryRowError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.salaryRowError} </p>
                              </h6>{" "}
                            </font>
                          )}

<br/>

<h4 align="center"> Deductions</h4>






                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "red" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                               
                                <th className="text-center">
                                  {" "}
                                  <h4>Deduction Type</h4>
                                </th>
                                <th className="text-center">
                                  <h4> Amount(Rs)</h4>{" "}
                                </th>
                                <th className="text-center">
                                  <Button
                                    onClick={this.handleAddDeductRow}
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
                              {this.state.deductRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                 

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="deductType"
                                        type="text"
                                     

                                        className="form-control"
                                        value={this.state.deductRows[idx].deductType}
                                        onChange={this.handleDeductChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="deductType"
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
                                        value={this.state.deductRows[idx].amount}
                                        onChange={this.handleDeductChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificDeductRow(
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
                          {this.state.deductRowError  && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.deductRowError} </p>
                              </h6>{" "}
                            </font>
                          )}


<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Earnings(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="totalEarning"
                              id="totalEarning"
                              value={this.state.totalEarning}
                             disabled
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Deductions(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="totalDeduction"
                              id="totalDeduction"
                              value={this.state.totalDeduction}
                             disabled
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Paid Amount(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="paidAmount"
                              id="paidAmount"
                              value={this.state.paidAmount}
                             disabled
                            />
                          </InputGroup>
                         
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
                                    showCopyTemplate: false,
                                    showCreateTemplate: false,
                                    showCreateButton: true,
                                    showExistingTemplate:true,
                                  
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
                  
                  }



                  </Form>
                </CardBody>
              </Card>





              {this.state.showExistingTemplate && this.state.existingSalaryRows.length>0 &&
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
                                        onClick={this.getExistingSalaryTemplates}
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
                                  <h4>Total Amount paid(Rs) </h4>
                                </th>

                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingSalaryRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingSalaryRows[idx].templateName.charAt(0).toUpperCase() +
                                      this.state.existingSalaryRows[idx].templateName.slice(1)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingSalaryRows[idx].paidAmount}</h5>
                                  </td>

                                  <td align="center">
                                    <Button
                                     color="primary"
                                      onClick={()=>{this.setState({
                                        salaryRows:this.state.existingSalaryRows[idx].salaryRows,
                                        paidAmount:this.state.existingSalaryRows[idx].paidAmount,
                                        totalDeduction:this.state.existingSalaryRows[idx].totalDeduction,
                                        totalEarning:this.state.existingSalaryRows[idx].totalEarning,


                                        showEditTemplate: true,
                                        templateNo: idx,
                                        templateName: this.state.existingSalaryRows[idx].templateName,
                                        deductRows:this.state.existingSalaryRows[idx].deductRows,
                                        showCreateTemplate:false,
                                        showCreateButton:false,
                                        showExistingTemplate:false,
                                        templateNameError:"",
                                        templateTypeError:"",
                                        salaryRowError:"",
                                        deductRowError:"",



                                      })
                                      }}


                                      size="lg"
                                    >
                                      Edit
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                      color="warning"
                                      onClick={()=>{this.setState({
                                        salaryRows:this.state.existingSalaryRows[idx].salaryRows,
                                        paidAmount:this.state.existingSalaryRows[idx].paidAmount,
                                        totalDeduction:this.state.existingSalaryRows[idx].totalDeduction,
                                        totalEarning:this.state.existingSalaryRows[idx].totalEarning,


                                        showCopyTemplate:true,
                                        templateNo: idx,
                                        templateName: this.state.existingSalaryRows[idx].templateName,
                                        deductRows:this.state.existingSalaryRows[idx].deductRows,
                                        showCreateTemplate:false,
                                        showCreateButton:false,
                                        showExistingTemplate:false,
                                        templateNameError:"",
                                        templateTypeError:"",
                                        salaryRowError:"",
                                        deductRowError:"",


                                      })
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
