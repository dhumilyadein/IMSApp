import React, { Component } from "react";
import moment from 'moment';

import DatePicker from 'react-date-picker';
import Select from 'react-select';
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

class ApproveLeave extends Component {
  constructor(props) {
    super(props);
this.getPendingLeaves();
    this.state = {

      erorrs: null,
     
      success: false,
      modalSuccess: false,
      visible: false,
      pendingLeaves:[],
      showDetails:false,
    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


    this.getPendingLeaves = this.getPendingLeaves.bind(this);
    this.approveHandler = this.approveHandler.bind(this);
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
                this.getPendingLeaves()
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
          "pendingLeaves":this.state.pendingLeaves,"leaveNo":this.state.leaveNo})
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
                showDetails:false,
                modalMessage:"Leave "+ this.state.leaveName+ " Updated Successfully!"
              },()=>{this.getPendingLeaves()});

          });
      }
    });
  }

  getPendingLeaves() {

    axios
      .get("http://localhost:8001/api/getPendingLeaves")
      .then(result => {
        console.log("getPendingLeaves RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
            pendingLeaves: result.data.data
          });
        }
      });
  }



approveHandler= idx => () => {

  confirmAlert({
    title: 'Confirm to Remove',
    message: 'Are you sure to Approve this Leave Request?',
    buttons: [
      {
        label: 'Yes',
        onClick: () =>

        axios
        .post("http://localhost:8001/api/approveLeave",{"_id":this.state.pendingLeaves[idx]._id,
        "dateOfApproveOrReject": new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000))})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Leave Approved")
          {
            
            this.setState({showDetails:false,
                success: true,
                modalSuccess: true,
                modelMessage:"Leaves Request Approved"
  
            },()=>{this.getPendingLeaves();});
            
          }
        })
      },
      {
        label: 'No',
        onClick: () =>  {this.getPendingLeaves();}
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



                  {!this.state.showDetails &&  (

                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Leave Applications Pending Approval</h3>
                          <br />
           


<Table bordered hover>
  <thead>
    <tr style={{ 'backgroundColor': "lightgreen" }}>
      <th className="text-center">
        <h4> S.No.</h4>{" "}
      </th>
      <th className="text-center">
        {" "}
        <h4>Emp Name </h4>
      </th>

      <th className="text-center">
        {" "}
        <h4>Leave Type </h4>
      </th>
      <th className="text-center">
        {" "}
        <h4>Count</h4>
      </th>

      <th className="text-center">
        {" "}
        <h4>Applied On</h4>
      </th>

      <th className="text-center">
       <h4> Actions</h4>


      </th>

    </tr>
  </thead>
  <tbody>
    {this.state.pendingLeaves.map((item, idx) => (
      <tr id="addr0" key={idx}>
        <td align="center">
          <h5>{idx + 1}</h5>
        </td>
        <td align="center">
          <h5> {this.state.pendingLeaves[idx].empName.charAt(0).toUpperCase() +
            this.state.pendingLeaves[idx].empName.slice(1)}</h5>
        </td>

        <td align="center">
          <h5> {this.state.pendingLeaves[idx].leaveType}</h5>
        </td>

        <td align="center">
          <h5> {this.state.pendingLeaves[idx].selectedLeaveCount}</h5>
        </td>

        <td align="center">
          <h5> {this.state.pendingLeaves[idx].doa.substring(0,10)}</h5>
        </td>

        <td align="center">
        <Button
            color="primary"
              onClick={ ()=>{ this.setState({showDetails:true,
             empName: this.state.pendingLeaves[idx].empName,
            leaveType:this.state.pendingLeaves[idx].leaveType,
            dof:this.state.pendingLeaves[idx].dof,
            dot:this.state.pendingLeaves[idx].dot,
            totalLeaveCount:this.state.pendingLeaves[idx].selectedLeaveCount,
          leaveNo:idx,
          remarks:this.state.pendingLeaves[idx].remarks,
          doa:this.state.pendingLeaves[idx].doa,
          year:this.state.pendingLeaves[idx].year

       
     },()=>{console.log("showDetails "+this.state.showDetails)});}}


            size="lg"
          >
            Details
          </Button>
          &nbsp; &nbsp;

          <Button
            color="success"
              onClick={ this.approveHandler(idx)}


            size="lg"
          >
           Approve
          </Button>




        </td>
      </tr>
    ))}
  </tbody>
</Table>









                          <br /> <br />

                        </CardBody>

                      </Card>

                   ) }

{this.state.showDetails && (
    <Card className="mx-1">
    <CardBody className="p-1">
    <h3 align="center"> Applied Leave Details</h3>
    <br/>
    <InputGroup className="mb-3">
    <InputGroupAddon addonType="prepend">
          <InputGroupText >
          <b>  Employee Name</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
name="empName"
id="empName"
type="text"
value={this.state.empName}
disabled
/>

</InputGroup>

<br/>

<InputGroup className="mb-3">
<InputGroupAddon addonType="prepend">
<InputGroupText style={{ width: "120px" }}>
<b> Leave Type</b> 
          </InputGroupText>
</InputGroupAddon>
<Input
name="leaveType"
id="leaveType"
type="text"
value={this.state.leaveType}
disabled/>

</InputGroup>



    <InputGroup className="mb-2">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
          <b> From Date</b>
          </InputGroupText>
        </InputGroupAddon>

        &nbsp; &nbsp; &nbsp;
        <DatePicker

          name="dof"
          id="dof"
          value={this.state.dof}
        disabled
        />
&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
<InputGroupAddon addonType="prepend">
          <InputGroupText >
          <b> To Date</b>
          </InputGroupText>
        </InputGroupAddon>

        &nbsp; &nbsp; &nbsp; &nbsp;
        <DatePicker
          name="dot"
          id="dot"
          value={this.state.dot}
         disabled
        />
      </InputGroup>






<InputGroup className="mb-3">
<InputGroupAddon addonType="prepend">
<InputGroupText >
  <b>Total Leaves Applied</b>
</InputGroupText>
</InputGroupAddon>
<Input
type="number"
size="lg"
name="totalLeaveCount"
id="totalLeaveCount"
value={this.state.totalLeaveCount}
disabled



/>
</InputGroup>

<InputGroup className="mb-3">
<InputGroupAddon addonType="prepend">
<InputGroupText >
  <b>Year</b>
</InputGroupText>
</InputGroupAddon>
<Input
type="text"
size="lg"
name="year"
id="year"
value={this.state.year}
disabled



/>
</InputGroup>


<InputGroup className="mb-2">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
          <b>  Date of Apply</b>
          </InputGroupText>
        </InputGroupAddon>

        &nbsp; &nbsp; &nbsp;
        <DatePicker

          name="doa"
          id="doa"
          value={this.state.doa}
         disabled
        />


      </InputGroup>
    

<InputGroup className="mb-3">
      <InputGroupAddon addonType="prepend">
        <InputGroupText >
          <b>Remarks</b>
        </InputGroupText>
      </InputGroupAddon>
      <Input
        type="text"
        size="lg"
       name="remarks"
        id="remarks"
       value={this.state.remarks}
      disabled

      />
    </InputGroup>

    



<Row>
      <Col>
        <Button
          onClick={this.approveHandler(this.state.leaveNo)}
          size="lg"
          color="success"
          block
        
        >
          Approve
        </Button>
      </Col>

      <Col>
        <Button
          onClick={this.rejectHandler}
          size="lg"
          color="danger"
          block
        
        >
          Reject
        </Button>
      </Col>

      <Col>
        <Button
          onClick={e=>{this.setState({showDetails:false})}}
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

export default ApproveLeave;
