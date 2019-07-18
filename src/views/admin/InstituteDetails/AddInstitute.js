import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';
import ImagesUploader from 'react-images-uploader';
import 'react-images-uploader/styles.css';
import 'react-images-uploader/font.css';
import ReactPhoneInput from "react-phone-input-2";
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

class AddInstitute extends Component {
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
      vendorAddress:"",
vNo:""

    };







    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.reset = this.reset.bind(this);
    this.getExistingVehicles = this.getExistingVehicles.bind(this);
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);




  }



  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,

    });
    this.reset();


  }

  reset(){

    this.setState({
      erorrs: null,
      success: null,
      vNo:"",
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
      driverNameError: "", driverPhoneError: "", vehicleNoError:"", vehicleRegNoError: false,
      modalSuccess: false, vendorNameError:"", vendorPhoneError:""
    }, () => {
      if (!this.state.vehicleNo) {
        this.setState({ vehicleNoError: "Please Enter Vehicle No" });
        submit = false;}

        if (!this.state.vehicleRegNo) {
          this.setState({ vehicleRegNoError: "Please Enter Registration No" });
          submit = false;}

          if (!this.state.driverName) {
            this.setState({ driverNameError: "Please Enter Driver Name" });
            submit = false;}

            if (!this.state.driverPhone) {
              this.setState({ driverPhoneError: "Please Enter Driver Phone No" });
              submit = false;}

              if (!this.state.vendorName) {
                this.setState({ vendorNameError: "Please Enter Vendor Name" });
                submit = false;}

                if (!this.state.vendorPhone) {
                  this.setState({ vendorPhoneError: "Please Enter Vendor Phone No" });
                  submit = false;}




      if (submit === true) {
        console.log("Adding Bus : ");
        axios
          .post("http://localhost:8001/api/addVehicle", this.state)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

            if(result.data.errors)
            {
            if(result.data.errors.vehicleNo)
              this.setState({
                vehicleNoError:result.data.errors.vehicleNo.message
              });

            else  if(result.data.errors.vehicleRegNo)
              this.setState({
                vehicleRegNoError:result.data.errors.vehicleRegNo.message
              });

            }
             else if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,
                modalMessage:"Vehicle: "+ this.state.vehicleNo+" Saved Successfully!"

              },()=>{this.getExistingVehicles()});

          });
      }
    });
  }

  editHandler(e) {
    var submit = true;
    console.log("in Edit State: " + JSON.stringify(this.state));

    this.setState({
      driverNameError: "", driverPhoneError: "", vehicleNoError:"", vehicleRegNoError: false,
      modalSuccess: false, vendorNameError:"", vendorPhoneError:""
    }, () => {
      if (!this.state.vehicleNo) {
        this.setState({ vehicleNoError: "Please Enter Vehicle No" });
        submit = false;}

        if (!this.state.vehicleRegNo) {
          this.setState({ vehicleRegNoError: "Please Enter Registration No" });
          submit = false;}

          if (!this.state.driverName) {
            this.setState({ driverNameError: "Please Enter Driver Name" });
            submit = false;}

            if (!this.state.driverPhone) {
              this.setState({ driverPhoneError: "Please Enter Driver Phone No" });
              submit = false;}

              if (!this.state.vendorName) {
                this.setState({ vendorNameError: "Please Enter Vendor Name" });
                submit = false;}

                if (!this.state.vendorPhone) {
                  this.setState({ vendorPhoneError: "Please Enter Vendor Phone No" });
                  submit = false;}




      if (submit === true) {
        console.log("Updating Vehicle: "+ JSON.stringify(this.state));
        axios
          .post("http://localhost:8001/api/editVehicle", this.state)
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
           if(result.data.error)
          {  if(result.data.error.errmsg.indexOf("vehicleNo")!==-1)
            this.setState({
              vehicleNoError:"Vehicle No already in use"
            });

            else if(result.data.error.errmsg.indexOf("vehicleRegNo")!==-1)
            this.setState({
              vehicleRegNoError:"Vehicle Reg No already in use"
            });


          }
           else  if (result.data.msg === "Vehicle Updated")
              this.setState({

                success: true,
                modalSuccess: true,
                showEditVehicle:false,
                modalMessage:"Vehicle: "+ this.state.vehicleNo+" Updated Successfully!"

              },()=>{this.getExistingVehicles()});

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
    message: 'Are you sure to Remove this Vehicle?',
    buttons: [
      {
        label: 'Yes',
        onClick: () =>

        axios
        .post("http://localhost:8001/api/deleteVehicle",{"examName":this.state.existingVehicles[idx].vehicleNo})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Vehicle Deleted")
            this.getExistingVehicles();

        })
      },
      {
        label: 'No',
        onClick: () =>  {this.getExistingVehicles();}
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
                  <h1>Institute Management</h1>
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



                  {!this.state.showEditVehicle &&  <p>
                    <Card>
                    <h3 align="center"> Add Institute Details</h3>
                     <Row lg="2">

                     <Col>

                      <Card className="mx-1">
                        <CardBody className="p-2">

                          <br />
                          <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Institute Name</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="instituteName"

                                id="instituteName"
                                value={this.state.instituteName}
                                onChange={e => {
                                  this.setState(
                                    { instituteName: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.instituteNameError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.instituteNameError} </p>
                                </h6>{" "}
                              </font>
                            )}

  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Address</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="textarea"
                                size="lg"
                                name="address"
                                 id="address"
                                value={this.state.address}
                                onChange={e => {
                                  this.setState(
                                    { address: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.addressError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.addressError} </p>
                                </h6>{" "}
                              </font>
                            )}


  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>City</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"
                                name="city"
                                 id="city"
                                value={this.state.city}
                                onChange={e => {
                                  this.setState(
                                    { city: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.cityError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.cityError} </p>
                                </h6>{" "}
                              </font>
                            )}


<InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>State</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="number"
                                size="lg"
                                name="state"
                                 id="state"
                                value={this.state.state}
                                onChange={e => {
                                  this.setState(
                                    { state: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>



      <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Pin Code</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="pinCode"

                                id="pinCode"
                                value={this.state.pinCode}
                                onChange={e => {
                                  this.setState(
                                    { pinCode: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.pinCodeError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.pinCodeError} </p>
                                </h6>{" "}
                              </font>
                            )}



                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText  >
                                  <b>Telephone</b>
                                </InputGroupText>


                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="telephone"

                                id="telephone"
                                value={this.state.telephone}
                                onChange={e => {
                                  this.setState(
                                    { telephone: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.telephoneError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.telephoneError} </p>
                                </h6>{" "}
                              </font>
                            )}


<InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <b>Mobile</b>
                                </InputGroupText>


                              <ReactPhoneInput
                                  defaultCountry="in"
                                  value={this.state.mobile}
                                  name="mobile"
                                  size="lg"
                                  onChange={mobile => {

                                    this.setState({ mobile });
                                  }}
                                /> </InputGroupAddon>
                            </InputGroup>


                            <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Fax No.</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"

          name= "conductorName"

          id="conductorName"
          value={this.state.faxNo}
          onChange={e => {
            this.setState(
              { faxNo: e.target.value }
            );
          }}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Email</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"
          name="email"
           id="email"
          value={this.state.email}
          onChange={e => {
            this.setState(
              { email: e.target.value }

            );
          }}
        />
      </InputGroup>

      <InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Website</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"
          name="website"
           id="website"
          value={this.state.website}
          onChange={e => {
            this.setState(
              { website: e.target.value }

            );
          }}
        />
      </InputGroup>


                        </CardBody>

                      </Card>
                      </Col>

                      <Col>

<Card className="mx-1">
  <CardBody className="p-2">

    <br />
    <ImagesUploader
                url="http://localhost:9090/multiple"
                optimisticPreviews
                onLoadEnd={(err) => {
                    if (err) {
                        console.error(err);
                    }
                }}
                label="Upload multiple images"
                />



<InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Vendor Address</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="textarea"
          size="lg"

          name="vendorAddress"

          id="vendorAddress"
          value={this.state.vendorAddress}
          onChange={e => {
            this.setState(
              { vendorAddress: e.target.value }
            );
          }}
        />
      </InputGroup>

<br/>


  </CardBody>

</Card>
</Col>

                       </Row>


<Row align="center" >
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"
block
                              >
                                Add Details
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={this.reset}
                                size="lg"
                                color="secondary"
                                block

                              >
                                Reset
                              </Button>
                            </Col>


                          </Row><br />  </Card>


<h3 align="center"> Existing Vehicles</h3>



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
                                  <h4>Reg. No</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Driver Name</h4>
                                </th>

                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingVehicles.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingVehicles[idx].vehicleNo.toUpperCase()}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingVehicles[idx].vehicleRegNo.toUpperCase()}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingVehicles[idx].driverName.toUpperCase()}</h5>
                                  </td>

                                  <td align="center">
                                  <Button
                                      color="primary"
                                        onClick={ ()=>{ this.setState({showEditVehicle:true,
                                       vehicleNo: this.state.existingVehicles[idx].vehicleNo,
                                      vehicleRegNo:this.state.existingVehicles[idx].vehicleRegNo,
                                      vehicleMake:this.state.existingVehicles[idx].vehicleMake,
                                      capacity:this.state.existingVehicles[idx].capacity,
                                    vNo:idx,
                                    driverName:this.state.existingVehicles[idx].driverName,
                                    driverPhone:this.state.existingVehicles[idx].driverPhone,
                                    conductorName:this.state.existingVehicles[idx].conductorName,
                                    conductorPhone:this.state.existingVehicles[idx].conductorPhone,
                                    vendorName:this.state.existingVehicles[idx].vendorName,
                                    vendorPhone:this.state.existingVehicles[idx].vendorPhone,
                                    vendorAddress:this.state.existingVehicles[idx].vendorAddress,
                                  driverNameError:"",
                                driverPhoneError:"",vehicleNoError:"", vehicleRegNoError:"",vendorNameError:"", vendorPhoneError:""
                            },()=>{console.log("showEditVehi"+this.state.vNo)});}}


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
                       </p>


                    }





{this.state.showEditVehicle && (
  <Card className="mx-1">
  <CardBody className="p-2">

    <h3 align="center"> Edit Vehicle Details</h3>
                            <br />
                            <Row lg="2">

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
                                  <b>Driver Name</b>
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
                            {this.state.driverNameError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.driverNameError} </p>
                                </h6>{" "}
                              </font>
                            )}



                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText  >
                                  <b>Driver Phone</b>
                                </InputGroupText>
                             &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;

                              <ReactPhoneInput
                                  defaultCountry="in"
                                  value={this.state.driverPhone}
                                  name="driverPhone"
                                  size="lg"
                                  onChange={driverPhone => {
                                    console.log("phone value: " + driverPhone);
                                    this.setState({ driverPhone });
                                  }}
                                /> </InputGroupAddon>
                            </InputGroup>
                            {this.state.driverPhoneError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.driverPhoneError} </p>
                                </h6>{" "}
                              </font>
                            )}





<br/>

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
            <b>Conductor Name</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"

          name= "conductorName"

          id="conductorName"
          value={this.state.conductorName}
          onChange={e => {
            this.setState(
              { conductorName: e.target.value }
            );
          }}
        />
      </InputGroup>


      <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <b>Conductor Phone</b>
                                </InputGroupText>


                              <ReactPhoneInput
                                  defaultCountry="in"
                                  value={this.state.conductorPhone}
                                  name="conductorPhone"
                                  size="lg"
                                  onChange={conductorPhone => {
                                    console.log("phone value: " + conductorPhone);
                                    this.setState({ conductorPhone });
                                  }}
                                /> </InputGroupAddon>
                            </InputGroup>



<InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Vendor Name</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="text"
          size="lg"
          name="vendorName"
           id="vendorName"
          value={this.state.vendorName}
          onChange={e => {
            this.setState(
              { vendorName: e.target.value }

            );
          }}
        />
      </InputGroup>
      {this.state.vendorNameError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.vendorNameError} </p>
                                </h6>{" "}
                              </font>
                            )}


     <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText>
                                  <b>Vendor Phone</b>
                                </InputGroupText>


                              <ReactPhoneInput
                                  defaultCountry="in"
                                  value={this.state.vendorPhone}
                                  name="vendorPhone"
                                  size="lg"
                                  onChange={vendorPhone => {
                                    console.log("phone value: " + vendorPhone);
                                    this.setState({ vendorPhone });
                                  }}
                                /> </InputGroupAddon>
                            </InputGroup>
      {this.state.vendorPhoneError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.vendorPhoneError} </p>
                                </h6>{" "}
                              </font>
                            )}



<InputGroup className="mb-3">
        <InputGroupAddon addonType="prepend">
          <InputGroupText >
            <b>Vendor Address</b>
          </InputGroupText>
        </InputGroupAddon>
        <Input
          type="textarea"
          size="lg"

          name="vendorAddress"

          id="vendorAddress"
          value={this.state.vendorAddress}
          onChange={e => {
            this.setState(
              { vendorAddress: e.target.value }
            );
          }}
        />
      </InputGroup>

<br/>


  </CardBody>

</Card>
</Col>

                       </Row>



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
                                  onClick={()=>{this.setState({showEditVehicle:false}); this.reset();}}
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

export default AddInstitute;
