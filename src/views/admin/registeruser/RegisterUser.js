import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ReactPhoneInput from 'react-phone-input-2';

import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  CardHeader,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Table,
  Alert,
  Modal,
  ModalHeader,
  FormGroup,
  Label

} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import axios, { post } from "axios";

class RegisterUser extends Component {
  constructor(props) {
    super(props);
    this.state = {
      username: null,
      email: null,
      firstname: null,
      lastname: null,
      password: null,
      password_con: null,
      role: ["student"],
      userdata: null,
      regSuccess: false,
      impSuccess: false,
      errors: null,
      importErrors:null,
      status: "Active",
      disabled: true,
      checked: {
        adminChecked: false,
        teacherChecked: false,
        studentChecked: true,
        parentChecked: false
      },
      visible: true,
      modalSuccess: true,
      file: null,
      noFile: false,
      corruptFile: false,
      filename: null



    };
    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.roleHandler = this.roleHandler.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);

    this.fileHandler = this.fileHandler.bind(this);
    this.fileChange = this.fileChange.bind(this);


  }

  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
    });
  }

  /**
 * @description Dismisses the alert
 * @param {*} e
 */
  onDismiss() {
    this.setState({ visible: false });
  }

  /**
   * @description Resets the form
   * @param {*} e
   */

  resetForm = (e) => {
    this.setState({
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      password_con: "",
      errors: null
    });

  }


  /**
   * @description Handles the form submit request
   * @param {*} e
   */
  submitHandler(e) {

    e.preventDefault();
    console.log(JSON.stringify(this.state));

    axios
      .post("http://localhost:8001/api/register", this.state)
      .then(result => {
        console.log("result.data " + result.data);
        if (result.data.errors) {

          return this.setState(result.data);
        }
        this.resetForm();
        return this.setState({
          userdata: result.data,
          errors: null,
          regSuccess: true,
          modalSuccess: true
        });

      });
  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  /**
   * @description Called when the role(s) are selected. To update role Array
   * @param {*} e
   */
  roleHandler = e => {

    if (e.target.checked && this.state.role.indexOf(e.target.name) === -1) {
      const temp = this.state.role;
      temp.push(e.target.name);

      this.setState({ role: temp }, () => console.log(this.state.role));

    }
    else if (!e.target.checked && this.state.role.indexOf(e.target.name) !== -1) {
      const temp = this.state.role;
      temp.splice(this.state.role.indexOf(e.target.name), 1);

      this.setState({ role: temp }, () => console.log(this.state.role));
    }

    // Checked status
    var checkedStatus = e.target.checked;
    const tempCheckedStatus = this.state.checked;

    if (e.target.name === 'admin') {
      tempCheckedStatus.adminChecked = true;
      this.setState({ checked: tempCheckedStatus });
    }
    if (e.target.name === 'teacher') {
      tempCheckedStatus.teacherChecked = true;
      this.setState({ checked: tempCheckedStatus });
    }
    if (e.target.name === 'parent') {
      tempCheckedStatus.parentChecked = true;
      this.setState({ checked: tempCheckedStatus });
    }

    if (e.target.name === "student" && e.target.checked) {
      this.setState({
        checked: { studentChecked: true, adminChecked: false, teacherChecked: false, parentChecked: false },
        disabled: true,
        role: ["student"]

      });

    } else if (e.target.name === "student" && !e.target.checked) {
      console.log("not checked");
      this.setState({
        checked: { studentChecked: false, adminChecked: false, teacherChecked: false, parentChecked: false },
        disabled: false
      });
    }

    console.log("studentChecked - " + this.state.checked.studentChecked
      + " adminChecked - " + this.state.checked.adminChecked
      + " teacherChecked - " + this.state.checked.teacherChecked
      + " parentChecked - " + this.state.checked.parentChecked);

  }

  /**
     * @description handles the file upload
     * @param {*} e
     */
  fileHandler = e => {
    e.preventDefault() // Stop form submit
    const data = new FormData();
    console.log("file" + this.state.file);
    if (!this.state.file)

      this.setState({

        noFile: true,
        modalSuccess: true,
        corruptFile: false,
        impSuccess: false

      });
    else {
      data.append('file', this.state.file, this.state.filename);
      axios
        .post("http://localhost:8001/api/importExcel", data)
        .then(res => {
          console.log("in Res " + JSON.stringify(res.data));
          if (res.data.error_code === 1) {
            document.getElementById("file").value = "";
            this.setState({

              corruptFile: true,
              modalSuccess: true,
              file: null,
              noFile: false


            });
          }
          else if(res.data==="Imported Successfully") {

            //console.log("in sucess: "+res.data);
            document.getElementById("file").value = "";
            return this.setState({

              importErrors: null,
              impSuccess: true,
              modalSuccess: true,
              noFile: false,
              corruptFile: false,
              file: null
            });
          }
          else
{
           this.setState({

            errors: res.data.errors,

            noFile: false,
            corruptFile: false,
            file: null

          },() =>{
           // console.log("errors length: "+Object.keys(this.state.errors).length)
          });

        }

        })
    }
  }



  fileChange = event => {
    const file = event.target.files[0];
    this.setState({ file: file, noFile: false, corruptFile: false, filename: file.name, importErrors:null }, () => console.log("file:  " + this.state.file.name));



  }


  render() {
    return (
      <div style={{width:"1000px"}} >

        <Container style={{width:"2500px"}} >

          <Row lg="4" style={{width:"2500px"}}>
            <Col md="7"   >
                 <Card className="mx-4" >

                <CardBody className="p-2" >
                  <Form >

                    {this.state.regSuccess &&

                      <Modal isOpen={this.state.modalSuccess} className={'modal-success ' + this.props.className} toggle={this.toggleSuccess}>
                        <ModalHeader toggle={this.toggleSuccess}>Username: {this.state.userdata.username} Registered Successfully!</ModalHeader>

                      </Modal>}
                      <Row lg="2">
            <Col >
                    <Card className="mx-1">
                      <CardBody className="p-2">
                      <h5>Select User Roles</h5>

                        <Table responsive size="sm" hover>
                          <tbody>
                            <tr>
                              <td>Admin</td>
                              <td>



                                <AppSwitch
                                  name="admin"
                                  id="admin"
                                  className={"mx-1"}
                                  variant={"3d"}
                                  color={"primary"}
                                  size={"sm"}
                                  onChange={this.roleHandler}
                                  disabled={this.state.disabled}
                                  checked={this.state.checked.adminChecked}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Teacher</td>
                              <td>
                                <AppSwitch
                                  name="teacher"
                                  id="teacher"
                                  className={"mx-1"}
                                  variant={"3d"}
                                  color={"primary"}
                                  size={"sm"}
                                  onChange={this.roleHandler}
                                  disabled={this.state.disabled}
                                  checked={this.state.checked.teacherChecked}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Student</td>
                              <td>
                                <AppSwitch
                                  name="student"
                                  id="student"
                                  className={"mx-1"}
                                  variant={"3d"}
                                  color={"primary"}
                                  size={"sm"}
                                  onChange={this.roleHandler}
                                  checked={this.state.checked.studentChecked}
                                />
                              </td>
                            </tr>
                            <tr>
                              <td>Parent</td>
                              <td>
                                <AppSwitch
                                  name="parent"
                                  id="parent"
                                  className={"mx-1"}
                                  variant={"3d"}
                                  color={"primary"}
                                  size={"sm"}
                                  onChange={this.roleHandler}
                                  disabled={this.state.disabled}
                                  checked={this.state.checked.parentChecked}
                                />
                              </td>
                            </tr>
                          </tbody>
                        </Table>
                      </CardBody>
                    </Card>
                    {this.state.errors &&
                      this.state.errors.role && (
                        <font color="red"> <p>{this.state.errors.role.msg}</p></font>
                      )}

                      <Card className="mx-1">
                      <CardBody className="p-2">
                      <h5>Basic Details</h5>
                      <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}} >
                        First Name
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={this.state.firstname}

                        autoComplete="firstname"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>


                    {this.state.errors &&
                      this.state.errors.firstname && (
                        <font color="red">  <p>{this.state.errors.firstname.msg}</p></font>
                      )}
 <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                        Last Name
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={this.state.lastname}

                        autoComplete="lastname"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>

                    {this.state.errors &&
                      this.state.errors.lastname && (
                        <font color="red"> <p>{this.state.errors.lastname.msg}</p></font>
                      )}
<InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                        Date of Brith
                        </InputGroupText>
                      </InputGroupAddon>

                      <Input
                        type="date"
                        name="dob"
                        id="dob"
                        value={this.state.dob}
                        placeholder="Date of Birth"
                        autoComplete="Date of Brith"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                        Gender
                        </InputGroupText>
                      </InputGroupAddon>
                      <Col md="9">
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="male" name="male" value="option1" />
                        <Label className="form-check-label" check htmlFor="inline-radio1">Male</Label>
                      </FormGroup>
                      <FormGroup check inline>
                        <Input className="form-check-input" type="radio" id="female" name="female" value="option1" />
                        <Label className="form-check-label" check htmlFor="inline-radio1">Female</Label>
                      </FormGroup>

                    </Col>
                    </InputGroup>

                     <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                          Blood Group
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="bloodgroup"
                        id="bloodgroup"
                        type="select"
                        onChange={this.changeHandler}
                        >

                        <option value="select">Select</option>
                        <option value="A+">A+</option>
                        <option value="A-">A-</option>
                        <option value="A1+">A1+</option>
                        <option value="A1-">A1-</option>
                        <option value="A1B+">A1B+</option>
                        <option value="A1B-">A1B-</option>
                        <option value="A2+">A2+</option>
                        <option value="A2-">A2-</option>
                        <option value="A2B+">A2B+</option>
                        <option value="A2B-">A2B-</option>
                        <option value="B+">B+</option>
                        <option value="B-">B-</option>
                        <option value="B1+">B1+</option>
                        <option value="O+">O+</option>
                        <option value="O-">O-</option>
                        <option value="AB+">AB+</option>
                        <option value="AB-">AB-</option>

                      </Input>
                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                        Nationality
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="bloodgroup"
                        id="bloodgroup"
                        type="select"
                        onChange={this.changeHandler}
                        >

                        <option value="select">Select</option>
                        <option value="indian">Indian</option>
                        <option value="foreign">Foreign</option>


                      </Input>
                    </InputGroup>


                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                        Religion
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="religion"
                        id="religion"
                        type="select"
                        onChange={this.changeHandler}
                        >

                        <option value="select">Select</option>
                        <option value="indian">Hindu</option>
                        <option value="foreign">Muslim</option>
                        <option value="foreign">Christian</option>
                        <option value="foreign">Sikh</option>
                        <option value="foreign">Jain</option>
                        <option value="foreign">Other</option>


                      </Input>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">

                        <InputGroupText style={{width:"150px"}}>Photo</InputGroupText>

                        <Input
                        type="file"
                        name="photo"
                        id="photo"
                        style={ {paddingLeft: "20px"}}


                        onChange={this.fileChange}
                      />
                      </InputGroupAddon>
                    </InputGroup>



                      </CardBody>
                    </Card>

</Col>
<Col>
                      <Card className="mx-1">
                      <CardBody className="p-2">
                      <h5>Official Details</h5>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                        Admission No
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="admissionno"
                        id="admissionno"


                        autoComplete="admissionno"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>
                    {this.state.errors &&
                      this.state.errors.username && (
                        <font color="red">  <p>{this.state.errors.username.msg}</p></font>
                      )}


                  <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                        Date of Joining
                        </InputGroupText>
                      </InputGroupAddon>

                      <Input
                        type="date"
                        name="doj"
                        id="doj"
                        value={this.state.doj}

                        autoComplete="Date of Joining"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>


                    {this.state.errors &&
                      this.state.errors.email && (
                        <font color="red">  <p>{this.state.errors.email.msg}</p></font>
                      )}
<InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"120px"}}>
                        Roll No
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="rollno"
                        id="rollno"


                        autoComplete="rollno"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>

                      </CardBody>
                      </Card>
                      <Card className="mx-1">
                      <CardBody className="p-2">
                      <h5>Contact Details</h5>

                      <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"125px"}}>
                          Phone Number
                        </InputGroupText>
                        <ReactPhoneInput defaultCountry='in' id="phone"name ="phone" placeholder="Phone Number" />
                      </InputGroupAddon>

                    </InputGroup>

                    {this.state.errors &&
                      this.state.errors.username && (
                        <font color="red">  <p>{this.state.errors.username.msg}</p></font>
                      )}

<Card className="mx-1">

              <CardBody className="p-2">
              <b >Address</b>
                <FormGroup>

                  <Input type="text" id="street" placeholder="House No, Area" />
                </FormGroup>
                <FormGroup row className="my-0">
                  <Col xs="8">
                    <FormGroup>

                      <Input type="text" id="city" placeholder="City" />
                    </FormGroup>
                  </Col>
                  <Col xs="4">
                    <FormGroup>

                      <Input type="text" id="postal-code" placeholder="Postal Code" />
                    </FormGroup>
                  </Col>
                </FormGroup>
                <FormGroup>

                  <Input type="text" id="statename" placeholder="State" />
                </FormGroup>


              </CardBody>
            </Card>


                    {this.state.errors &&
                      this.state.errors.email && (
                        <font color="red">  <p>{this.state.errors.email.msg}</p></font>
                      )}



                      </CardBody>
                      </Card>




 <Card className="mx-1">
                      <CardBody className="p-2">
                      <h5>Login Details</h5>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-user" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="username"
                        id="username"
                        value={this.state.username}
                        placeholder="Username"
                        autoComplete="username"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>
                    {this.state.errors &&
                      this.state.errors.username && (
                        <font color="red">  <p>{this.state.errors.username.msg}</p></font>
                      )}


                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>@</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="email"
                        id="email"
                        value={this.state.email}
                        placeholder="Email"
                        autoComplete="email"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>


                    {this.state.errors &&
                      this.state.errors.email && (
                        <font color="red">  <p>{this.state.errors.email.msg}</p></font>
                      )}


                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        name="password"
                        id="password"
                        placeholder="Password"
                        value={this.state.password}
                        autoComplete="new-password"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>

                    {this.state.errors &&
                      this.state.errors.password && (
                        <font color="red">   <p>{this.state.errors.password.msg}</p></font>
                      )}

                    <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <i className="icon-lock" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="password"
                        name="password_con"
                        id="password_con"
                        placeholder="Confirm Password"
                        value={this.state.password_con}
                        autoComplete="new-password"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>

                    {this.state.errors &&
                      this.state.errors.password_con && (
                        <font color="red"><p>{this.state.errors.password_con.msg}</p></font>
                      )}
                      </CardBody>
                      </Card>

                      
                      </Col>
                      <Col>
                      <Card className="mx-1">
                      <CardBody className="p-2">
                      <h5>Parent Details</h5>
                      <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"110px"}}>
                        First Name
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={this.state.firstname}

                        autoComplete="firstname"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>


                    {this.state.errors &&
                      this.state.errors.firstname && (
                        <font color="red">  <p>{this.state.errors.firstname.msg}</p></font>
                      )}
 <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"110px"}}>
                        Last Name
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={this.state.lastname}

                        autoComplete="lastname"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>

                    {this.state.errors &&
                      this.state.errors.lastname && (
                        <font color="red"> <p>{this.state.errors.lastname.msg}</p></font>
                      )}



                     <InputGroup className="mb-4">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"110px"}}>
                          Relation
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        name="relation"
                        id="relation"
                        type="select"
                        onChange={this.changeHandler}
                        >

                        <option value="">Select</option>
                        <option value="Father">Father</option>
                        <option value="Mother">Mother</option>
                        <option value="Guardian">Guardian</option>
                        

                      </Input>
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"110px"}}>
                        Occupation
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="occupation"
                        id="occupation"
                        value={this.state.occupation}

                        autoComplete="occupation"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>
                    

                   <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend"  >
                        <InputGroupText style={{width:"110px"}}>Email</InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="parentemail"
                        id="parentemail"
                        value={this.state.parentemail}
                       
                        autoComplete="parentemail"
                        onChange={this.changeHandler}
                      />
                    </InputGroup>
                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText style={{width:"150px"}}>
                          Phone Number 1
                        </InputGroupText>
                        <ReactPhoneInput defaultCountry='in' id="parentphone1"name ="parentphone1" />
                      </InputGroupAddon>

                    </InputGroup>

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend" >
                        <InputGroupText style={{width:"150px"}}>
                          Phone Number 2
                        </InputGroupText>
                        <ReactPhoneInput defaultCountry='in' id="parentphone2"name ="parentphone2" />
                      </InputGroupAddon>

                    </InputGroup>
                  
                    <Card className="mx-1">
                    <FormGroup check inline>
                        <Input className="form-check-input" type="checkbox" id="parentaddress" name="parentaddress"  />
                        <Label className="form-check-label" check htmlFor="inline-checkbox1">Address same as Student Address</Label>
                      </FormGroup>
<CardBody className="p-2">
<b >Address</b>
  <FormGroup>

    <Input type="text" id="street" placeholder="House No, Area" />
  </FormGroup>
  <FormGroup row className="my-0">
    <Col xs="8">
      <FormGroup>

        <Input type="text" id="city" placeholder="City" />
      </FormGroup>
    </Col>
    <Col xs="4">
      <FormGroup>

        <Input type="text" id="postal-code" placeholder="Postal Code" />
      </FormGroup>
    </Col>
  </FormGroup>
  <FormGroup>

    <Input type="text" id="statename" placeholder="State" />
  </FormGroup>


</CardBody>
</Card>




                      </CardBody>
                    </Card>

                      </Col>
                      </Row>



                    <Row className="align-items-center">
                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <Button type="submit" onClick={this.submitHandler} block color="success"> Register</Button>
                      </Col>
                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <Button block onClick={this.resetForm} color="info">Reset</Button>
                      </Col></Row>

                  </Form>
                </CardBody>
              </Card>
            </Col>

            <Col md="2">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form  >
                    <h1>Import Users</h1>
                    {this.state.impSuccess &&

                      <Modal isOpen={this.state.modalSuccess} className={'modal-success ' + this.props.className} toggle={this.toggleSuccess}>
                        <ModalHeader toggle={this.toggleSuccess}>Excel sheet {this.state.filename} Imported Successfully!</ModalHeader>

                      </Modal>}



                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">

                      </InputGroupAddon>
                      <h3>upload excel file(XLS,XLSX)</h3>
                      <Input
                        type="file"
                        name="file"
                        id="file"


                        onChange={this.fileChange}
                      />
                    </InputGroup>

                    {this.state.noFile
                      && <font color="red">  <p>Please choose the excel file before submitting.</p></font>
                    }

                    {this.state.corruptFile
                      && <font color="red">  <p>Please select a valid XLS or XLSX file only.</p></font>
                    }
                    <Row className="align-items-center">
                      <Col col="6" sm="2" md="2" xl className="mb-3 mb-xl-0">
                        <Button type="submit" block color="success" onClick={this.fileHandler}> Import sheet</Button>
                      </Col>
                    </Row>

                    { this.state.importErrors &&
                    <Row className="align-items-center">
                      <Col col="6" sm="2" md="2" xl className="mb-3 mb-xl-0">
                      <font color="red">  <p>{Object.keys(this.state.errors).length} record(s) failed to import. For errors, click Errors</p></font>
                        <Button type="submit" block color="danger" onClick={
()=>{var data = "<p>This is 'myWindow'</p>";
var myWindow = window.open("data:text/json," + encodeURIComponent(this.state.errors),
                       "_blank");
myWindow.focus();

                        }}> Errors</Button>
                      </Col>
                    </Row>}

                  </Form>
                </CardBody>
              </Card>

            </Col>



          </Row>
        </Container>
      </div>
    );
  }
}

export default RegisterUser;
