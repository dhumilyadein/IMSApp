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
  ModalHeader
} from "reactstrap";

import axios from "axios";

class ManageStops extends Component {
  constructor(props) {
    super(props);
this.getExistingStops();
    this.state = {

      erorrs: null,
      success: null,
      stopName: "",
      description:"",
      stopNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
     
      existingStops:[],
      showEditStop:false,
      stopNo:""
    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


    this.getExistingStops = this.getExistingStops.bind(this);
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);




  }



  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
      stopName:"",
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
      stopNameError: "",  success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.stopName) {
        this.setState({ stopNameError: "Please Enter Stop Name" });
        submit = false;}

        



      if (submit === true) {
        console.log("Creating Stop: ");
        axios
          .post("http://localhost:8001/api/addStop", {"stopName":this.state.stopName,"description":this.state.description})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

            if(result.data.errors)
            {
            if(result.data.errors.stopName)
              this.setState({
                stopNameError:result.data.errors.stopName.message
              });}
             else if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,

              },()=>{this.getExistingStops()});

          });
      }
    });
  }

  editHandler(e) {
    var submit = true;
    console.log("in Edit State: " + JSON.stringify(this.state));

    this.setState({
      stopNameError: "", descriptionError: "", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.stopName) {
        this.setState({ stopNameError: "Please Enter Stop Name" });
        submit = false;}

        


      if (submit === true) {
        console.log("Updating Stop: "+ JSON.stringify(this.state));
        axios
          .post("http://localhost:8001/api/editStop", {"stopName":this.state.stopName,"description":this.state.description,
          "existingStops":this.state.existingStops,"stopNo":this.state.stopNo})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
           if(result.data.error)
          {  if(result.data.error.code===11000)
            this.setState({
              stopNameError:"Stop name already in use"
            });}
           else  if (result.data.msg === "Stop Updated")
              this.setState({

                success: true,
                modalSuccess: true,
                showEditStop:false

              },()=>{this.getExistingStops()});

          });
      }
    });
  }

  getExistingStops() {

    axios
      .get("http://localhost:8001/api/existingStops")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
            existingStops: result.data
          });
        }
      });
  }



deleteSpecificItem= idx => () => {

  confirmAlert({
    title: 'Confirm to Remove',
    message: 'Are you sure to Remove this Stop?',
    buttons: [
      {
        label: 'Yes',
        onClick: () =>

        axios
        .post("http://localhost:8001/api/deleteStop",{"stopName":this.state.existingStops[idx].stopName})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Stop Deleted")
            this.getExistingStops();

        })
      },
      {
        label: 'No',
        onClick: () =>  {this.getExistingStops();}
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
                        Stop: {this.state.stopName} Saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}



                  {!this.state.showEditStop &&  (

                      <Card className="mx-1">
                        <CardBody className="p-2">
                        <Card>
                          <h3 align="center"> Add Stop</h3>
                          <br />
                         
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Stop Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"

                              name="stopName"

                              id="stopName"
                              value={this.state.stopName.charAt(0).toUpperCase() + this.state.stopName.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { stopName: e.target.value },
                                  () => {
                                    console.log(
                                      "Stop name: " +
                                      this.state.stopName
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.stopNameError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.stopNameError} </p>
                              </h6>{" "}
                            </font>
                          )}

<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Stop description</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                              name="description"
                               id="description"
                              value={this.state.description.charAt(0).toUpperCase() + this.state.description.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { description: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.description
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                        

<Row align="center">
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"

                              >
                                Create
                              </Button>
                            </Col>


                          </Row> <br />
                       </Card>    <br /><br />

<h3 align="center"> Existing Stops</h3>
                          <br />


                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Stop Name </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>description</h4>
                                </th>
                               
                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingStops.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingStops[idx].stopName.charAt(0).toUpperCase() +
                                      this.state.existingStops[idx].stopName.slice(1)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingStops[idx].description}</h5>
                                  </td>

                               

                                  <td align="center">
                                  <Button
                                      color="primary"
                                        onClick={ ()=>{ this.setState({showEditStop:true,
                                       stopName: this.state.existingStops[idx].stopName,
                                      description:this.state.existingStops[idx].description,
                                    stopNo:idx,
                                  stopNameError:"",
                               },()=>{console.log("showEditStop "+this.state.showEditStop)});}}


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

{this.state.showEditStop && (
  <Card className="mx-1">
  <CardBody className="p-2">

    <h3 align="center"> Edit Stop</h3>
                            <br />
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Stop Name</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="stopName"

                                id="stopName"
                                value={this.state.stopName.charAt(0).toUpperCase() + this.state.stopName.slice(1)}
                                onChange={e => {
                                  this.setState(
                                    { stopName: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.stopNameError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.stopNameError} </p>
                                </h6>{" "}
                              </font>
                            )}

  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Stop description</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"
                                name="description"
                                 id="description"
                                value={this.state.description.charAt(0).toUpperCase() + this.state.description.slice(1)}
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
                                  onClick={()=>{this.setState({showEditStop:false,stopName:"",description:""})}}
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

export default ManageStops;
