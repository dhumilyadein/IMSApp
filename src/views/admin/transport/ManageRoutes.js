import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Select from 'react-select';
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

class ManageRoutes extends Component {
  constructor(props) {
    super(props);

this.getExistingVehicles();


    this.state = {

      erorrs: null,
      success: null,
      vehicleNo: "",
      existingVehicles:[],
      selectedStops:[],
      stopError:"",
      stopArray:[],
      vehicleNoError: "",
      stopError:"",
      success: false,
      modalSuccess: false,
      visible: false,
     existingRoutes:[],
      existingStops:[],
      showEditRoute:false,
      RouteNo:"",
      description:""
    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

    this.getExistingStops = this.getExistingStops.bind(this);
   
    this.getExistingVehicles = this.getExistingVehicles.bind(this);
    
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
      vehicleNoError: "", stopError:"",  success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.vehicleNo) {
        this.setState({ vehicleNoError: "Please Select Vehicle No" });
        submit = false;}

        if (this.state.stopArray.length===0) {
            this.setState({ stopError: "Please Select Stops" });
            submit = false;}
        



      if (submit === true) {
        console.log("Creating Route: ");
        axios
          .post("http://localhost:8001/api/addRoute", {"vehicleNo":this.state.vehicleNo,"route":this.state.stopArray})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

            if(result.data.errors)
            {
           
              this.setState({
                errors:result.data.errors
              });}
             else if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,

              },()=>{this.getExistingVehicles()});

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
            var temp=[];
            for(var i=0;i<result.data.length;i++)
            temp.push({"value":result.data[i].stopName, "label":result.data[i].stopName})
          this.setState({
            existingStops: temp
          });
        }
      });
  }

  getExistingVehicles() {

    axios
      .get("http://localhost:8001/api/existingVehicles")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) { var temp=[];
            for(var i=0;i<result.data.length;i++)
            temp.push(result.data[i].vehicleNo)

          this.setState({
            existingVehicles: temp
          });
        }
      });
  }


deleteSpecificItem= idx => () => {

  confirmAlert({
    title: 'Confirm to Remove',
    message: 'Are you sure to Remove this Route?',
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
                        Route for Vehicle: {this.state.vehicleNo} Saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}



                  {!this.state.showEditRoute &&  (

                      <Card className="mx-1">
                        <CardBody className="p-2">
                        <Card>
                          <h3 align="center"> Add Route</h3>
                          <br />
                         
                          <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                      <b>  Vehicle No</b>
                                </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="vehicleNo"
                                      id="vehicleNo"
                                      type="select"
                                      value={this.state.vehicleNo}
                                      onChange={e=>{this.setState({vehicleNo:e.target.value},()=>{this.getExistingStops();})}}
                                    >
                                      <option value="">Select</option>
                                      {this.state.existingVehicles.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                    </Input>
                                  </InputGroup>
                                  { this.state.vehicleNoError && (
                                    <font color="red">
                                      {" "}
                                     <b> <p>{this.state.vehicleNoError}</p></b>
                                    </font>
                                  )}


<Select
                                        id="stop"
                                        name="stop"
                                        isMulti={true}
                                        placeholder="Select Multiple Stops"
                                        options={this.state.existingStops}
                                        closeMenuOnSelect={false}
                                        value={this.state.selectedStops}

                                        isSearchable={true}
                                        onChange={selected => {
                                          console.log("Selected: " + JSON.stringify(selected));
                                          var temp1=[];var temp2 = [];

                                          for (var i = 0; i < selected.length; i++) {
                                           temp1.push(selected[i]) ;
                                            temp2.push(selected[i].value)
                                          }
                                          this.setState({
                                            selectedStops: temp1,
                                            stopArray:temp2
                                            
                                          }, () => {
                                            console.log("Selected Stops: " + JSON.stringify(this.state.selectedStops));
                                          })







                                        }



                                        } />
                                 
                                  {this.state.stopError && (
                                    <font color="red">
                                      {" "}
                                     <b> <p>{this.state.stopError}</p></b>
                                    </font>
                                  )}
<br/>

<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b> description</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                              name="description"
                               id="description"
                              value={this.state.stopArray.description}
                              onChange={e => { var temp=this.state.stopArray;
                                temp.push({"description":e.target.value})
                                this.setState(
                                  { stopArray: temp },
                                  () => {
                                    console.log(
                                      "Stop Array: " +
                                     JSON.stringify( this.state.stopArray)
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

<h3 align="center"> Existing Routes</h3>
                          <br />


                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Vehicle Number </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Route</h4>
                                </th>
                               
                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingRoutes.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingRoutes[idx].vehicleNo.toUpperCase()}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingRoutes[idx].routes}</h5>
                                  </td>

                               

                                  <td align="center">
                                  <Button
                                      color="primary"
                                        onClick={ ()=>{ this.setState({showEditRoute:true,
                                       vehicleNo: this.state.existingRoutes[idx].vehicleNo,
                                      selectedStops:this.state.existingRoutes[idx].route,
                                    routeNo:idx,
                                  vehicleNoError:"",
                               },()=>{console.log("showEditStop "+this.state.showEditRoute)});}}


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

export default ManageRoutes;
