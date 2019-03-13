import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Select from 'react-select';
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
          .post("http://localhost:8001/api/addRoute", {"vehicleNo":this.state.vehicleNo,"route":this.state.stopArray,
          "description":this.state.description})
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
                vehicleNo:"",
                selectedStops:[],
                description:""

              },()=>{this.getExistingVehicles()});

          });
      }
    });
  }

 

  editHandler(e) {
    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state));

    this.setState({
      vehicleNoError: "", stopError:"",  success: false,
      modalSuccess: false
    }, () => {
     

        if (this.state.stopArray.length===0) {
            this.setState({ stopError: "Please Select Stops" });
            submit = false;}
        
        


      if (submit === true) {
        console.log("Updating Route: "+ JSON.stringify(this.state));
        axios
          .post("http://localhost:8001/api/editRoute", {"vehicleNo":this.state.vehicleNo,"route":this.state.stopArray,
          "description":this.state.description})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
           if(result.data.error)
       
            this.setState({
              vehicleNoError:result.data.error
            });
           else  if (result.data.msg === "Route Updated")
              this.setState({

                success: true,
                modalSuccess: true,
                showEditRoute:false,
                vehicleNo:"",
                selectedStops:[],
                description:""
              


              },()=>{this.getExistingVehicles()});

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
        if (result.data) { var temp1=[];var temp2=[];
            for(var i=0;i<result.data.length;i++)
           { temp1.push(result.data[i].vehicleNo)
            for(var j=0;j<result.data[i].routeDetails.length;j++)
            temp2.push({"vehicleNo":result.data[i].vehicleNo, "route":result.data[i].routeDetails[j].route,
            "description":result.data[i].routeDetails[j].description})}

          this.setState({
            existingVehicles: temp1,
            existingRoutes:temp2
          },()=>{console.log("Routes Details: "+ JSON.stringify(this.state.existingRoutes))});
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
        .post("http://localhost:8001/api/deleteRoute",{"vehicleNo":this.state.existingRoutes[idx].vehicleNo,
        "route":this.state.existingRoutes[idx].route})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Route Deleted")
            this.getExistingVehicles();

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
                                        placeholder="Select or type to Search Multiple Stops"
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
                              value={this.state.description}
                              onChange={e => { 
                                this.setState(
                                  { description: e.target.value }
                            
                                   
                                    );
                                  }
                                
                              }
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
                                  <h4>Vehicle No</h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Route Details</h4>
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
                                    <h5> {this.state.existingRoutes[idx].route.join(" -> ")}</h5>
                                  </td>

                               

                                  <td align="center">
                                  <Button
                                      color="primary"
                                        onClick={ ()=>{this.getExistingStops(); var temp=[];
                                            for(var i=0;i<this.state.existingRoutes[idx].route.length;i++)
                                            temp.push({"label":this.state.existingRoutes[idx].route[i],
                                            "value":this.state.existingRoutes[idx].route[i]})
                                            
                                            this.setState({showEditRoute:true,
                                       vehicleNo: this.state.existingRoutes[idx].vehicleNo,
                                      selectedStops:temp,
                                    routeNo:idx, 
                                  vehicleNoError:"",
                                  description:this.state.existingRoutes[idx].description,
                                  stopError:""
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

{this.state.showEditRoute && (
  <Card className="mx-1">
  <CardBody className="p-2">

    <h3 align="center"> Edit Route</h3>
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
                                      type="text"
                                      value={this.state.vehicleNo}
                                     disabled="true"
                                    >
                                    
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
                                        placeholder="Select or type to Search Multiple Stops"
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
                              value={this.state.description}
                              onChange={e => { 
                                this.setState(
                                  { description: e.target.value }
                            
                                   
                                    );
                                  }
                                
                              }
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
                                  onClick={()=>{this.setState({showEditRoute:false,vehicleNo:"",selectedStops:[], description:""})}}
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
