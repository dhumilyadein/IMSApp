import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
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
  Table,
  Modal,
  ModalHeader,FormGroup,
  Label
} from "reactstrap";

import axios from "axios";

class AddLeaveTypes extends Component {
  constructor(props) {
    super(props);
this.getExistingLeaveTypes();
    this.state = {

      erorrs: null,
      leaveName: "",
      leaveType:"Paid",
      leaveCycle:"",
      leaveCount:"",
      carryForward:false,
      maxLeaveCount:"",
      leaveNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      existingLeaveTypes:[],
      showEditLeave:false,
    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


    this.getExistingLeaveTypes = this.getExistingLeaveTypes.bind(this);
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);




  }



  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
      leaveName:"",
      leaveCount:"",
      maxLeaveCount:"",
      carryForward:false,
      leaveType:"Paid",
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

    this.setState({
      leaveNameError: "", leaveCountError: "", maxLeaveCountError:"", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.leaveName) {
        this.setState({ leaveNameError: "Please Enter Leave Name" });
        submit = false;}

        if (!this.state.leaveCount) {
            this.setState({ leaveCountError: "Please Enter Leave Count" });
            submit = false;}



        if (this.state.carryForward&&!this.state.maxLeaveCount) {
          this.setState({ maxLeaveCountError: "Please Enter Max Leave Count" });
          submit = false;}






      if (submit === true) {
        console.log("Creating Item: ");
        axios
          .post("http://localhost:8001/api/createLeave", {"leaveName":this.state.leaveName,"leaveType":this.state.leaveType, "leaveCount":this.state.leaveCount, "carryForward":this.state.carryForward, "maxLeaveCount":this.state.maxLeaveCount})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

            if(result.data.errors)
            {
            if(result.data.errors.leaveName)
              this.setState({
                leaveNameError:result.data.errors.leaveName.message
              });}
             else if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,
                modalMessage:"Leave "+ this.state.leaveName+ " Created Successfully!"

              },()=>{
                this.getExistingLeaveTypes()
              });

          });
      }
    });
  }

  editHandler(e) {
    var submit = true;
    console.log("in Edit State: " + JSON.stringify(this.state));

    this.setState({
        leaveNameError: "", leaveCountError: "", maxLeaveCountError:"", success: false,
        modalSuccess: false
      }, () => {
        if (!this.state.leaveName) {
          this.setState({ leaveNameError: "Please Enter Leave Name" });
          submit = false;}
  
          if (!this.state.leaveCount) {
              this.setState({ leaveCountError: "Please Enter Leave Count" });
              submit = false;}
  
  
  
          if (this.state.carryForward&&!this.state.maxLeaveCount) {
            this.setState({ maxLeaveCountError: "Please Enter Max Leave Count" });
            submit = false;}
  
  
        if (submit === true) {
        console.log("Updating Leave: "+ JSON.stringify(this.state));
        axios
          .post("http://localhost:8001/api/editLeave", {"leaveName":this.state.leaveName,"leaveType":this.state.leaveType, "leaveCount":this.state.leaveCount, "carryForward":this.state.carryForward, "maxLeaveCount":this.state.maxLeaveCount,
          "existingLeaveTypes":this.state.existingLeaveTypes,"leaveNo":this.state.leaveNo})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
           if(result.data.error)
          {  if(result.data.error.code===11000)
            this.setState({
              leaveNameError:"Leave name already in use"
            });}
           else  if (result.data.msg === "Leave Updated")
              this.setState({

                success: true,
                modalSuccess: true,
                showEditLeave:false,
                modalMessage:"Leave "+ this.state.leaveName+ " Updated Successfully!"
              },()=>{this.getExistingLeaveTypes()});

          });
      }
    });
  }

  getExistingLeaveTypes() {

    axios
      .get("http://localhost:8001/api/getExistingLeaveTypes")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
            existingLeaveTypes: result.data
          });
        }
      });
  }



deleteSpecificItem= idx => () => {

  confirmAlert({
    title: 'Confirm to Remove',
    message: 'Are you sure to Remove this Item?',
    buttons: [
      {
        label: 'Yes',
        onClick: () =>

        axios
        .post("http://localhost:8001/api/deleteLeave",{"leaveName":this.state.existingLeaveTypes[idx].leaveName})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Leave Deleted")
            this.getExistingLeaveTypes();

        })
      },
      {
        label: 'No',
        onClick: () =>  {this.getExistingLeaveTypes();}
      }
    ]
  })


}







  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="12">

             <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Leave Management</h1>
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



                  {!this.state.showEditLeave &&  (

                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Create Leave</h3>
                          <br />
                          <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Leave Name</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="leaveName"

                                id="leaveName"
                                value={this.state.leaveName.charAt(0).toUpperCase() + this.state.leaveName.slice(1)}
                                onChange={e => {
                                  this.setState(
                                    { leaveName: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.leaveNameError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.leaveNameError} </p>
                                </h6>{" "}
                              </font>
                            )}

  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Leave Type</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                      name="leaveType"
                                      name="leaveType"
                                      id="maritalstatus"
                                      type="select"
                                      onChange={e=>{this.setState({leaveType:e.target.value})}}
                                      value={this.state.leaveType}

                                    >

                                      <option value="Paid">Paid</option>
                                      <option value="Unpaid">Unpaid</option>

                                    </Input>
                            </InputGroup>

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Leave Count/Year</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="number"
                                size="lg"

                                name="leaveCount"

                                id="leaveCount"
                                value={this.state.leaveCount}
                                onChange={e => {
                                  this.setState(
                                    { leaveCount: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.leaveCountError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.leaveCountError} </p>
                                </h6>{" "}
                              </font>
                            )}


                        <FormGroup check inline>
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="carryForward"
                                      style={{ height: "35px", width: "25px" }}
                                      name="carryForward"
                                      checked={this.state.carryForward}
                                      onChange={e=>{
                                        if (e.target.checked === true) {
                                            console.log("carryForward true: " + e.target.checked);
                                            this.setState({
                                           
                                             carryForward:true
                                            });
                                          } else if (e.target.checked === false) {
                                            console.log("carryForward false: " + e.target.checked);
                                            this.setState({
                                               
                                                carryForward:false,
                                                maxLeaveCount:""
                                            });
                                          }

                                      }}
                                    />
                                    <Label
                                      className="form-check-label"
                                      check
                                      htmlFor="inline-checkbox1"
                                    >
                                     <b> Carry Forward</b>
                                    </Label>
                                  </FormGroup>
<br/>
{this.state.carryForward && <p> <InputGroup className="mb-3">
<InputGroupAddon addonType="prepend">
  <InputGroupText >
    <b>Max Leave Count</b>
  </InputGroupText>
</InputGroupAddon>
<Input
  type="number"
  size="lg"

  name="maxLeaveCount"

  id="maxLeaveCount"
  value={this.state.maxLeaveCount}
  onChange={e => {
    this.setState(
      { maxLeaveCount: e.target.value }
    );
  }}
/>
</InputGroup>
{this.state.maxLeaveCountError && (
<font color="red">
  <h6>
    {" "}
    <p>{this.state.maxLeaveCountError} </p>
  </h6>{" "}
</font>
)} </p> }



<br/>
<Row align="center" >
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"

                              >
                                Create Leave
                              </Button>
                            </Col>


                          </Row>
                          <br /> <br />


 {this.state.existingLeaveTypes.length>0  &&<p>

<h3 align="center"> Existing Leave Types</h3>
<br />


<Table bordered hover>
  <thead>
    <tr style={{ 'backgroundColor': "lightgreen" }}>
      <th className="text-center">
        <h4> S.No.</h4>{" "}
      </th>
      <th className="text-center">
        {" "}
        <h4>Leave Name </h4>
      </th>

      <th className="text-center">
        {" "}
        <h4>Leave Type </h4>
      </th>
      <th className="text-center">
        {" "}
        <h4>Count/Year</h4>
      </th>

      <th className="text-center">
        {" "}
        <h4>Carry Forward</h4>
      </th>

      <th className="text-center">
       <h4> Actions</h4>


      </th>

    </tr>
  </thead>
  <tbody>
    {this.state.existingLeaveTypes.map((item, idx) => (
      <tr id="addr0" key={idx}>
        <td align="center">
          <h5>{idx + 1}</h5>
        </td>
        <td align="center">
          <h5> {this.state.existingLeaveTypes[idx].leaveName.charAt(0).toUpperCase() +
            this.state.existingLeaveTypes[idx].leaveName.slice(1)}</h5>
        </td>

        <td align="center">
          <h5> {this.state.existingLeaveTypes[idx].leaveType}</h5>
        </td>

        <td align="center">
          <h5> {this.state.existingLeaveTypes[idx].leaveCount}</h5>
        </td>

        <td align="center">
          <h5> {this.state.existingLeaveTypes[idx].carryForward+""}</h5>
        </td>

        <td align="center">
        <Button
            color="primary"
              onClick={ ()=>{ this.setState({showEditLeave:true,
             leaveName: this.state.existingLeaveTypes[idx].leaveName,
            leaveType:this.state.existingLeaveTypes[idx].leaveType,
            leaveCount:this.state.existingLeaveTypes[idx].leaveCount,
            carryForward:this.state.existingLeaveTypes[idx].carryForward,
            maxLeaveCount:this.state.existingLeaveTypes[idx].maxLeaveCount,
leaveCountError:"",
maxLeaveCountError:"",

          leaveNo:idx,
        leaveNameError:"",
     },()=>{console.log("showEditLeave "+this.state.showEditLeave)});}}


            size="lg"
          >
            Edit
          </Button>
          &nbsp; &nbsp;

          <Button
            color="danger"
              onClick={ this.deleteSpecificItem(idx)}


            size="lg"
          >
            Remove
          </Button>




        </td>
      </tr>
    ))}
  </tbody>
</Table>




</p>
}



                          <br /> <br />

                        </CardBody>

                      </Card>

                   ) }

{this.state.showEditLeave && (
  <Card className="mx-1">
  <CardBody className="p-2">

    <h3 align="center"> Edit Leave</h3>
                            <br />
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Leave Name</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="leaveName"

                                id="leaveName"
                                value={this.state.leaveName.charAt(0).toUpperCase() + this.state.leaveName.slice(1)}
                                onChange={e => {
                                  this.setState(
                                    { leaveName: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.leaveNameError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.leaveNameError} </p>
                                </h6>{" "}
                              </font>
                            )}

  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Leave Type</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                      name="leaveType"
                                      name="leaveType"
                                      id="maritalstatus"
                                      type="select"
                                      onChange={e=>{this.setState({leaveType:e.target.value})}}
                                      value={this.state.leaveType}

                                    >

                                      <option value="Paid">Paid</option>
                                      <option value="Unpaid">Unpaid</option>

                                    </Input>
                            </InputGroup>

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Leave Count/Year</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="number"
                                size="lg"

                                name="leaveCount"

                                id="leaveCount"
                                value={this.state.leaveCount}
                                onChange={e => {
                                  this.setState(
                                    { leaveCount: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.leaveCountError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.leaveCountError} </p>
                                </h6>{" "}
                              </font>
                            )}


                        <FormGroup check inline>
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="carryForward"
                                      style={{ height: "35px", width: "25px" }}
                                      name="carryForward"
                                      checked={this.state.carryForward}
                                      onChange={e=>{
                                        if (e.target.checked === true) {
                                            console.log("carryForward true: " + e.target.checked);
                                            this.setState({
                                             carryForward:true
                                            });
                                          } else if (e.target.checked === false) {
                                            console.log("carryForward false: " + e.target.checked);
                                            this.setState({
                                                carryForward:false,
                                                maxLeaveCount:""

                                            });
                                          }

                                      }}
                                    />
                                    <Label
                                      className="form-check-label"
                                      check
                                      htmlFor="inline-checkbox1"
                                    >
                                     <b> Carry Forward</b>
                                    </Label>
                                  </FormGroup>
<br/>
{this.state.carryForward && <p> <InputGroup className="mb-3">
<InputGroupAddon addonType="prepend">
  <InputGroupText >
    <b>Max Leave Count</b>
  </InputGroupText>
</InputGroupAddon>
<Input
  type="number"
  size="lg"

  name="maxLeaveCount"

  id="maxLeaveCount"
  value={this.state.maxLeaveCount}
  onChange={e => {
    this.setState(
      { maxLeaveCount: e.target.value }
    );
  }}
/>
</InputGroup>
{this.state.maxLeaveCountError && (
<font color="red">
  <h6>
    {" "}
    <p>{this.state.maxLeaveCountError} </p>
  </h6>{" "}
</font>
)} </p> }


  <br/>
  <Row >
                              <Col>
                                <Button
                                  onClick={this.editHandler}
                                  size="lg"
                                  color="success"
                                  block
                                >
                                  Update
                                </Button>
                              </Col>

                              <Col>
                                <Button
                                  onClick={()=>{this.setState({
                                      showEditLeave:false,leaveName:"",leaveCount:"",leaveType:"Paid",
                                   carryForward:false,maxLeaveCount:"",leaveCountError:"",leaveNameError:"",
                                maxLeaveCountError:"" })}}
                                  size="lg"
                                  color="secondary"
  block
                                >
                                  Cancel
                                </Button>
                              </Col>


                            </Row>




    </CardBody></Card>

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

export default AddLeaveTypes;
