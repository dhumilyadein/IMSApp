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
//this.getExistingItems();
    this.state = {

      erorrs: null,
      success: null,
      leaveName: "",
      leaveType:"",
      leaveCycle:"",
      leaveCount:"",
      carryForward:false,
      maxLeaveCount:"",
      leaveNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      unitError:"",
      existingItems:[],
      showEditItem:false,
      itemNo:""
    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


    this.getExistingItems = this.getExistingItems.bind(this);
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);




  }



  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
      leaveName:"",
      unit:""
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
      leaveNameError: "", unitError: "", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.leaveName) {
        this.setState({ leaveNameError: "Please Enter Item Name" });
        submit = false;}

        if (!this.state.unit) {
            this.setState({ unitError: "Please Enter Unit" });
            submit = false;}



      if (submit === true) {
        console.log("Creating Item: ");
        axios
          .post("http://localhost:8001/api/createItem", {"leaveName":this.state.leaveName,"unit":this.state.unit})
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

              },()=>{this.getExistingItems()});

          });
      }
    });
  }

  editHandler(e) {
    var submit = true;
    console.log("in Edit State: " + JSON.stringify(this.state));

    this.setState({
      leaveNameError: "", unitError: "", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.leaveName) {
        this.setState({ leaveNameError: "Please Enter Item Name" });
        submit = false;}

        if (!this.state.unit) {
            this.setState({ unitError: "Please Enter Unit" });
            submit = false;}



      if (submit === true) {
        console.log("Updating Item: "+ JSON.stringify(this.state));
        axios
          .post("http://localhost:8001/api/editItem", {"leaveName":this.state.leaveName,"unit":this.state.unit,
          "existingItems":this.state.existingItems,"itemNo":this.state.itemNo})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
           if(result.data.error)
          {  if(result.data.error.code===11000)
            this.setState({
              leaveNameError:"Item name already in use"
            });}
           else  if (result.data.msg === "Item Updated")
              this.setState({

                success: true,
                modalSuccess: true,
                showEditItem:false

              },()=>{this.getExistingItems()});

          });
      }
    });
  }

  getExistingItems() {

    axios
      .get("http://localhost:8001/api/existingItems")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
            existingItems: result.data
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
        .post("http://localhost:8001/api/deleteItem",{"leaveName":this.state.existingItems[idx].leaveName})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Item Deleted")
            this.getExistingItems();

        })
      },
      {
        label: 'No',
        onClick: () =>  {this.getExistingItems();}
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
                        Leave: {this.state.leaveName} Saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}



                  {!this.state.showEditItem &&  (

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
                                  <b>Leave Count</b>
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
                                             showMaxLeaveCount:true
                                            });
                                          } else if (e.target.checked === false) {
                                            console.log("carryForward false: " + e.target.checked);
                                            this.setState({
                                                showMaxLeaveCount:false
                                            });
                                          }

                                      }}
                                    />
                                    <Label
                                      className="form-check-label"
                                      check
                                      htmlFor="inline-checkbox1"
                                    >
                                      Carry Forward
                                    </Label>
                                  </FormGroup>
                                      



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

<h3 align="center"> Existing Items</h3>
                          <br />


                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Item Name </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Unit</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Quantity</h4>
                                </th>

                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingItems.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].leaveName.charAt(0).toUpperCase() +
                                      this.state.existingItems[idx].leaveName.slice(1)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].unit}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].quantity}</h5>
                                  </td>

                                  <td align="center">
                                  <Button
                                      color="primary"
                                        onClick={ ()=>{ this.setState({showEditItem:true,
                                       leaveName: this.state.existingItems[idx].leaveName,
                                      unit:this.state.existingItems[idx].unit,
                                    itemNo:idx,
                                  leaveNameError:"",
                                unitError:""},()=>{console.log("showEditItem "+this.state.showEditItem)});}}


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





                          <br /> <br />

                        </CardBody>

                      </Card>

                   ) }

{this.state.showEditItem && (
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
                                  onClick={()=>{this.setState({showEditItem:false,leaveName:"",unit:""})}}
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
