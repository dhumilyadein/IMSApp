import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Table,
  Alert,
  Modal,
  ModalHeader

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
          else if(JSON.stringify(res.data)==="Imported Successfully") {
            document.getElementById("file").value = "";
            return this.setState({

              errors: null,
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
    this.setState({ file: file, noFile: false, corruptFile: false, filename: file.name }, () => console.log("file:  " + this.state.file.name));



  }


  render() {
    return (
      <div>

        <Container>
          <Row lg="2">
            <Col md="6">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form >
                    <h1>Register</h1>
                    {this.state.regSuccess &&

                      <Modal isOpen={this.state.modalSuccess} className={'modal-success ' + this.props.className} toggle={this.toggleSuccess}>
                        <ModalHeader toggle={this.toggleSuccess}>Username: {this.state.userdata.username} Registered Successfully!</ModalHeader>

                      </Modal>}


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
                        <InputGroupText>
                          <i className="icon-menu" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="firstname"
                        id="firstname"
                        value={this.state.firstname}
                        placeholder="First Name"
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
                        <InputGroupText>
                          <i className="icon-menu" />
                        </InputGroupText>
                      </InputGroupAddon>
                      <Input
                        type="text"
                        name="lastname"
                        id="lastname"
                        value={this.state.lastname}
                        placeholder="Last Name"
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

                    <Card className="mx-1">
                      <CardBody className="p-2">
                        <InputGroup className="mb-2">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText>
                              <i className="icon-badge" />
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="label"
                            defaultValue="Select User Roles"
                            autoComplete="role"
                            disabled="disabled"
                            readOnly="true"
                          />
                        </InputGroup>

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

            <Col md="6">
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

                    { this.state.errors && 
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
