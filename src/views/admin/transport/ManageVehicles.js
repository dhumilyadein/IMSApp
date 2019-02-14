import React, { Component } from "react";
import DatePicker from 'react-date-picker';
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

class ManageVehicles extends Component {
  constructor(props) {
    super(props);
this.getExistingVehicles();
    this.state = {

      erorrs: null,
      success: null,
      vehicleNo: "",
      vehicleNoError: "",
      vehicleRegNo:"",
      vehicleRegNoError:"",
  vehicleMake: "",
      success: false,
      modalSuccess: false,
      visible: false,
      capacity:"",
      driverName:"",
      driverNameError:"",
      existingVehicles:[],
      driverPhone:"",
      driverPhoneError:"",
      conductorName:"",
      showEditVehicle:false,
      conductorPhone:"",
      vendorName:"",
      vendorNameError:"",
      vendorPhone:"",
      vendorPhoneError:"",
      vendorAddress:""


    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


    this.getExistingVehicles = this.getExistingVehicles.bind(this);
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);




  }



  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
      examName:"",
      totalMarks:"",
      passingMarks:"",
      description:"",
      timeLimit:""
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
      examNameError: "", totalMarksError: "", passingMarksError:"", success: false,
      modalSuccess: false, timeLimitError:""
    }, () => {
      if (!this.state.examName) {
        this.setState({ examNameError: "Please Enter Item Name" });
        submit = false;}

        if (!this.state.totalMarks) {
          this.setState({ totalMarksError: "Please Enter Total Marks" });
          submit = false;}

          if (!this.state.passingMarks) {
            this.setState({ passingMarksError: "Please Enter Passing Marks" });
            submit = false;}

            if (!this.state.timeLimit) {
              this.setState({ timeLimitError: "Please Enter Time Limit" });
              submit = false;}




      if (submit === true) {
        console.log("Creating Item: ");
        axios
          .post("http://localhost:8001/api/createExam", {"examName":this.state.examName,"totalMarks":this.state.totalMarks,
          "passingMarks":this.state.passingMarks, "description":this.state.description,"timeLimit":this.state.timeLimit})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

            if(result.data.errors)
            {
            if(result.data.errors.examName)
              this.setState({
                examNameError:result.data.errors.examName.message
              });}
             else if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,
                modalMessage:"Exam: "+ this.state.examName+" Saved Successfully!"

              },()=>{this.getExistingExams()});

          });
      }
    });
  }

  editHandler(e) {
    var submit = true;
    console.log("in Edit State: " + JSON.stringify(this.state));

    this.setState({
      examNameError: "", totalMarksError: "", passingMarksError:"", success: false,
      modalSuccess: false, timeLimitError:""
    }, () => {
      if (!this.state.examName) {
        this.setState({ examNameError: "Please Enter Item Name" });
        submit = false;}

        if (!this.state.totalMarks) {
          this.setState({ totalMarksError: "Please Enter Total Marks" });
          submit = false;}

          if (!this.state.passingMarks) {
            this.setState({ passingMarksError: "Please Enter Passing Marks" });
            submit = false;}

            if (!this.state.timeLimit) {
              this.setState({ timeLimitError: "Please Enter Time Limit" });
              submit = false;}




      if (submit === true) {
        console.log("Updating Exam: "+ JSON.stringify(this.state));
        axios
          .post("http://localhost:8001/api/editExam", this.state)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
           if(result.data.error)
          {  if(result.data.error.code===11000)
            this.setState({
              examNameError:"Exam name already in use"
            });}
           else  if (result.data.msg === "Exam Updated")
              this.setState({

                success: true,
                modalSuccess: true,
                showEditItem:false,
                modalMessage:"Exam: "+ this.state.examName+" Saved Successfully!" 

              },()=>{this.getExistingExams()});

          });
      }
    });
  }

  getExistingVehicles() {

    axios
      .get("http://localhost:8001/api/existingVehicles")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
            existingVehicles: result.data
          });
        }
      });
  }



deleteSpecificItem= idx => () => {

  confirmAlert({
    title: 'Confirm to Remove',
    message: 'Are you sure to Remove this Exam?',
    buttons: [
      {
        label: 'Yes',
        onClick: () =>

        axios
        .post("http://localhost:8001/api/deleteExam",{"examName":this.state.existingExams[idx].examName})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Exam Deleted")
            this.getExistingExams();

        })
      },
      {
        label: 'No',
        onClick: () =>  {this.getexistingExams();}
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
                  <h1>Transport Management</h1>
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



                  {!this.state.showEditVehicle &&  (
                     <Row lg="2">
                      <h3 align="center"> Add Vehicle Details</h3>
                     <Col>

                      <Card className="mx-1">
                        <CardBody className="p-2">
                         
                          <br />
                          <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Vehicle Number</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="vehicleNo"

                                id="vehicleNo"
                                value={this.state.vehicleNo}
                                onChange={e => {
                                  this.setState(
                                    { vehicleNo: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.vehicleNoError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.vehicleNoError} </p>
                                </h6>{" "}
                              </font>
                            )}

  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Vehicle Reg. No</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"
                                name="vehicleRegNo"
                                 id="vehicleRegNo"
                                value={this.state.vehicleRegNo}
                                onChange={e => {
                                  this.setState(
                                    { vehicleRegNo: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.vehicleRegNoError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.vehicleRegNoError} </p>
                                </h6>{" "}
                              </font>
                            )}


  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Vehicle Make</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"
                                name="vehicleMake"
                                 id="vehicleMake"
                                value={this.state.vehicleMake}
                                onChange={e => {
                                  this.setState(
                                    { vehicleMake: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                           

<InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Capacity</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="number"
                                size="lg"
                                name="capacity"
                                 id="capacity"
                                value={this.state.capacity}
                                onChange={e => {console.log("limit "+JSON.stringify(e.target.value))
                                  this.setState(
                                    { capacity: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                          


      <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Driver's Name</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="driverName"

                                id="driverName"
                                value={this.state.driverName}
                                onChange={e => {
                                  this.setState(
                                    { driverName: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>

<br/>
<Row >
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"

                              >
                                Create
                              </Button>
                            </Col>


                          </Row>
                          <br /> <br />

<h3 align="center"> Existing Exams</h3>
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
                                  <h4>Total Marks</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Passing Marks</h4>
                                </th>

                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingExams.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingExams[idx].examName.charAt(0).toUpperCase() +
                                      this.state.existingExams[idx].examName.slice(1)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingExams[idx].totalMarks}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingExams[idx].passingMarks}</h5>
                                  </td>

                                  <td align="center">
                                  <Button
                                      color="primary"
                                        onClick={ ()=>{ this.setState({showEditExam:true,
                                       examName: this.state.existingExams[idx].examName,
                                      totalMarks:this.state.existingExams[idx].totalMarks,
                                      passingMarks:this.state.existingExams[idx].passingMarks,
                                      description:this.state.existingExams[idx].description,
                                    examNo:idx,
                                  examNameError:"",
                                totalMarksError:"",passingMarksError:""},()=>{console.log("showEditItem "+this.state.examNo)});}}


                                      size="lg"
                                    >
                                      Edit/View
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





                          <br /> <br />

                        </CardBody>

                      </Card>
                      </Col>
                      
                      <Col>

<Card className="mx-1">
  <CardBody className="p-2">
   
    <br />
    <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Vehicle Number</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"

          name="vehicleNo"

          id="vehicleNo"
          value={this.state.vehicleNo}
          onChange={e => {
            this.setState(
              { vehicleNo: e.target.value }
            );
          }}
        />
      </InputGroup>
      {this.state.vehicleNoError && (
        <font color="red">
          <h6>
            {" "}
            <p>{this.state.vehicleNoError} </p>
          </h6>{" "}
        </font>
      )}

<InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Vehicle Reg. No</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"
          name="vehicleRegNo"
           id="vehicleRegNo"
          value={this.state.vehicleRegNo}
          onChange={e => {
            this.setState(
              { vehicleRegNo: e.target.value }

            );
          }}
        />
      </InputGroup>
      {this.state.vehicleRegNoError && (
        <font color="red">
          <h6>
            {" "}
            <p>{this.state.vehicleRegNoError} </p>
          </h6>{" "}
        </font>
      )}


<InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Vehicle Make</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"
          name="vehicleMake"
           id="vehicleMake"
          value={this.state.vehicleMake}
          onChange={e => {
            this.setState(
              { vehicleMake: e.target.value }

            );
          }}
        />
      </InputGroup>
     

<InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Capacity</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="number"
          size="lg"
          name="capacity"
           id="capacity"
          value={this.state.capacity}
          onChange={e => {console.log("limit "+JSON.stringify(e.target.value))
            this.setState(
              { capacity: e.target.value }

            );
          }}
        />
      </InputGroup>
    


<InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Driver's Name</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"

          name="driverName"

          id="driverName"
          value={this.state.driverName}
          onChange={e => {
            this.setState(
              { driverName: e.target.value }
            );
          }}
        />
      </InputGroup>

<br/>
<Row >
      <Col>
        <Button
          onClick={this.submitHandler}
          size="lg"
          color="success"

        >
          Create
        </Button>
      </Col>


    </Row>
    <br /> <br />

<h3 align="center"> Existing Exams</h3>
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
            <h4>Total Marks</h4>
          </th>

          <th className="text-center">
            {" "}
            <h4>Passing Marks</h4>
          </th>

          <th className="text-center">
           <h4> Actions</h4>


          </th>

        </tr>
      </thead>
      <tbody>
        {this.state.existingExams.map((item, idx) => (
          <tr id="addr0" key={idx}>
            <td align="center">
              <h5>{idx + 1}</h5>
            </td>
            <td align="center">
              <h5> {this.state.existingExams[idx].examName.charAt(0).toUpperCase() +
                this.state.existingExams[idx].examName.slice(1)}</h5>
            </td>

            <td align="center">
              <h5> {this.state.existingExams[idx].totalMarks}</h5>
            </td>

            <td align="center">
              <h5> {this.state.existingExams[idx].passingMarks}</h5>
            </td>

            <td align="center">
            <Button
                color="primary"
                  onClick={ ()=>{ this.setState({showEditExam:true,
                 examName: this.state.existingExams[idx].examName,
                totalMarks:this.state.existingExams[idx].totalMarks,
                passingMarks:this.state.existingExams[idx].passingMarks,
                description:this.state.existingExams[idx].description,
              examNo:idx,
            examNameError:"",
          totalMarksError:"",passingMarksError:""},()=>{console.log("showEditItem "+this.state.examNo)});}}


                size="lg"
              >
                Edit/View
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





    <br /> <br />

  </CardBody>

</Card>
</Col> 

                       </Row>
                   ) }

{this.state.showEditExam && (
  <Card className="mx-1">
  <CardBody className="p-2">

    <h3 align="center"> Edit Item</h3>
                            <br />
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Item Name</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="examName"

                                id="examName"
                                value={this.state.examName.charAt(0).toUpperCase() + this.state.examName.slice(1)}
                                onChange={e => {
                                  this.setState(
                                    { examName: e.target.value }
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
                                  <b>Total Marks</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="number"
                                size="lg"
                                name="totalMarks"
                                 id="totalMarks"
                                value={this.state.totalMarks}
                                onChange={e => {
                                  this.setState(
                                    { totalMarks: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.totalMarksError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.totalMarksError} </p>
                                </h6>{" "}
                              </font>
                            )}


  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Passing Marks</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="number"
                                size="lg"
                                name="passingMarks"
                                 id="passingMarks"
                                value={this.state.passingMarks}
                                onChange={e => {
                                  this.setState(
                                    { passingMarks: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.passingMarksError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.passingMarksError} </p>
                                </h6>{" "}
                              </font>
                            )}

<InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Time Limit(hours)</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="number"
                                size="lg"
                                name="timeLimit"
                                 id="timeLimit"
                                value={this.state.timeLimit}
                                onChange={e => {
                                  this.setState(
                                    { timeLimit: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.timeLimitError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.timeLimitError} </p>
                                </h6>{" "}
                              </font>
                            )}



      <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Description</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="description"

                                id="description"
                                value={this.state.description}
                                onChange={e => {
                                  this.setState(
                                    { description: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>



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
                                  onClick={()=>{this.setState({showEditExam:false,examName:"" ,
                                  totalMarks:"",
                                  passingMarks:"",
                                  description:""})}}
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

export default ManageVehicles;
