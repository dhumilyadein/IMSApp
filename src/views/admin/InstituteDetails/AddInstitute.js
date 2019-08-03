import React, { Component } from "react";
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css';

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
this.getExistingDetails();
    this.state = {

      erorrs: null,
      success: null,

      success: false,
      modalSuccess: false,
      visible: false,


    };







    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.reset = this.reset.bind(this);
    this.getExistingDetails = this.getExistingDetails.bind(this);





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
      instituteNameError: "", addressError: "", cityError:"", stateError: false,
      pinCodeError: false, telephoneError:"", vendorPhoneError:"", noFile:false,emailError:""
    }, () => {
      if (!this.state.instituteName) {
        this.setState({ instituteNameError: "Please Enter Institute Name" });
        submit = false;}

        if (!this.state.address) {
          this.setState({ addressError: "Please Enter Address" });
          submit = false;}

          if (!this.state.city) {
            this.setState({ cityError: "Please Enter City name" });
            submit = false;}

            if (!this.state.state) {
              this.setState({ stateError: "Please Enter State name" });
              submit = false;}

              if (!this.state.pinCode) {
                this.setState({ pinCodeError: "Please Enter Pincode" });
                submit = false;}

                if (!this.state.telephone && !this.state.mobile) {
                  this.setState({ telephoneError: "Please Enter Telephone or Mobile Number" });
                  submit = false;}

                  if (!this.state.email) {
                    this.setState({ emailError: "Please Enter Email" });
                    submit = false;}
                    else if(!/^\w+([\.-]?\w+)*@\w+([\.-]?\w+)*(\.\w{2,3})+$/.test(this.state.email))
                    {this.setState({ emailError: "Please Enter Correct Email" });
                    submit = false;}


                    if (!this.state.file) {
                      this.setState({ noFile: true });
                      submit = false;}



                      if (submit === true) {
                        console.log("Updating Vehicle: "+ JSON.stringify(this.state));

                        const data = new FormData();  //photo upload
                        this.setState({ logoName: this.state.logo.name }, () => {

                          data.append('file', this.state.logo, this.state.logoName);
                        axios
                          .post("http://localhost:8001/api/logoUploading", data)
                          .then(result => {
                            console.log("in Logo Res " + JSON.stringify(result.data));
                            if (result.data.error_code === 1) {

                              return this.setState({
                                corruptFile: true,

                              });

                            }

                            else if(result.data.message)

                            { console.log("Logo file uploaded to server!... Submitting other details");

                            axios
                            .post("http://localhost:8001/api/addInstitute", this.state)
                            .then(result => {
                              console.log("addInstitute.Result. data " + JSON.stringify(result.data));
                              if (result.data) {

                                                 if (result.data.msg==="Success")
                                                return this.setState({  success: true, modalSuccess: true, modalMessage:"Details Updated Successfully!"});
                              }




                            });



                            }








                  });});}
    });
  }


  getExistingDetails() {

    axios
      .get("http://localhost:8001/api/existingDetails")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
           instituteName:result.data[0].instituteName,
           address:result.data[0].address,
             city:result.data[0].city,
             state:result.data[0].state,
             pinCode:result.data[0].pincode,
             telephone:result.data[0].telephone,
             mobile:result.data[0].mobile,
             faxNo:result.data[0].fax,
             email:result.data[0].email,
             website:result.data[0].website,

          });
        }
      });
  }

  fileChange = event => {
    if(document.getElementById('logo').value)
    try {

      this.setState(
        {

          noFile: false,
          corruptFile: false,

        });

      var allowedExtension = ['jpeg', 'jpg', 'png', 'bmp'];
      var fileExtension = document.getElementById('logo').value.split('.').pop().toLowerCase();
      var isValidFile = false;

          for(var index in allowedExtension) {

              if(fileExtension === allowedExtension[index]) {
                  isValidFile = true;
                  break;
              }
          }

          if(!isValidFile) {document.getElementById('logo').value=null;
              this.setState({ corruptFile: true,file:null})
                  }
else

{const file = URL.createObjectURL(event.target.files[0])
  this.setState(
    {
      file: file,
      logo: event.target.files[0],
      noFile: false,
      corruptFile: false,
      filename: file.name,

    },
    () => console.log("file:  " + this.state.file.name)
  );
  }






    }


    catch (err) {
      console.log(
        "File Upload error: " + JSON.stringify(err)
      );
    }
  };









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
                    <h3 align="center"> Update Institute Details</h3>
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
                                type="text"
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

{this.state.stateError && (
  <font color="red">
    <h6>
      {" "}
      <p>{this.state.stateError} </p>
    </h6>{" "}
  </font>
)}

      <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Pin Code</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="number"
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
                                type="number"
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
                            {this.state.telephoneError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.telephoneError} </p>
                                </h6>{" "}
                              </font>
                            )}

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

      {this.state.emailError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.emailError} </p>
                                </h6>{" "}
                              </font>
                            )}

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

   <Card> <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend" />
                      <h4>Upload Logo</h4>
                      <Input
                        type="file"
                        name="logo"
                        id="logo"
                        onChange={this.fileChange}
                      />
                    </InputGroup>

                    {this.state.noFile && (
                      <font color="red">
                        {" "}
                        <h6>Please select the logo file</h6>
                      </font>
                    )}

                    {this.state.corruptFile && (
                      <font color="red">
                        {" "}
                        <h6> Only 'jpeg', 'jpg', 'png', 'bmp' files are supported!</h6>
                      </font>
                    )}


<img style={{ width: "50%" }} src={this.state.file} />

</Card>


<br/>


  </CardBody>

</Card>
{this.state.error && (
                      <font color="red">
                        {" "}
                        <h6>this.state.error</h6>
                      </font>
                    )}
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








                          <br /> <br />
                       </p>


                    }







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
