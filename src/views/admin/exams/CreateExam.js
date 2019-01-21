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

class CreateExam extends Component {
  constructor(props) {
    super(props);
this.getExistingExams();
    this.state = {

      erorrs: null,
      success: null,
      examName: "",
examNo:"",
      examNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      totalMarksError:"",
      passingMarksError:"",
      existingExams:[],
      totalMarks:"",
      passingMarks:"",
      showEditExam:false,
      examNo:""

    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


    this.getExistingExams = this.getExistingExams.bind(this);
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);




  }



  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
      examName:"",
      totalMarks:"",
      passingMarks:"",
      description:""
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
      modalSuccess: false
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




      if (submit === true) {
        console.log("Creating Item: ");
        axios
          .post("http://localhost:8001/api/createExam", {"examName":this.state.examName,"totalMarks":this.state.totalMarks,
          "passingMarks":this.state.passingMarks, "description":this.state.description})
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
      modalSuccess: false
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

  getExistingExams() {

    axios
      .get("http://localhost:8001/api/existingExams")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
            existingExams: result.data
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
                  <h1>Exam Management</h1>
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



                  {!this.state.showEditExam &&  (

                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Create Exam</h3>
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

export default CreateExam;
