import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ReactPhoneInput from "react-phone-input-2";
import DatePicker from 'react-date-picker';
import ReactLoading from 'react-loading';

//import {propTypes} from 'react/addons';

import Select from 'react-select';

import {
  Button,
  Card,
  CardBody,
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
  Modal,
  ModalHeader,
  FormGroup,
  Label
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import axios from "axios";




class RegisterUser extends Component {


  constructor(props) {

    super(props);
    this.getExistingTemplates();




    this.state = {
      class: "",
      section: "",

      classes: [],
      classDetails: {},
      sectionArray: [],
      classDetailsUpdatedFlag: false,
      studentsDataArray: [],

      sectionView: false,
      studentsView: false,

      loader: false,
      admintype: "Office Admin",
      username: "",
      email: "",
      firstname: "",
      fullName: "",
      lastname: "",
      password: "",
      password_con: "",
      parentpassword_con: "",
      role: ["student"],
      userdata: null,
      studentRegSuccess: false,

      empRegSuccess: false,
      modalSuccess: true,
      employeeno: "",
      errors: null,
      importErrors: null,
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
      parentfirstname: "",
      parentlastname: "",
      parentFullName: "",
      parentrelation: "",
      parentoccupation: "",
      parentusername: "",
      parentpassword: "",
      parentemail: "",
      parentphone1: "",
      parentphone2: "",
      parentaddress: "",
      parentcity: "",
      parentpostalcode: "",
      parentstate: "",
      address: "",
      city: "",
      postalcode: "",
      state: "",
      admissionno: "",
      rollno: "",
      doj: "",
      type: "",
      experiencedetails: "NA",
      department: "",
      designation: "",
      dob: "",
      gender: "",
      maritalstatus: "",
      qualification: "",
      photo: null,
      religion: "",
      nationality: "",
      bloodgroup: "",
      category: "",
      feeTemplate: [],
      selectedFeeTemplate: [],
      selectedFeeTemplateValue: [],
      corruptphoto: false,
      photoname: "",
      phone: "",
      parentaddresscheck: false,
      roleerror: false,
      photoerror: null,

    };

    this.changeHandler = this.changeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.roleHandler = this.roleHandler.bind(this);
    this.resetForm = this.resetForm.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);

    this.getExistingTemplates = this.getExistingTemplates.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.copyAddress = this.copyAddress.bind(this);
    this.photoUpload = this.photoUpload.bind(this);

    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);

    this.WarnToggleSuccess = this.WarnToggleSuccess.bind(this);
    this.updateClassDetails = this.updateClassDetails.bind(this);

    // Fetching class details on page load for class drop down
    this.fetchClassDetails();

  }



  getExistingTemplates() {

    axios
      .get("http://localhost:8001/api/existingTemplates")
      .then(result => {
        console.log("Existing Fee Templates: " + JSON.stringify(result.data));
        console.log("No of templates " + result.data.length);
        if (result.data) {
          var temp = [];
          for (var i = 0; i < result.data.length; i++) {
            temp.push({
              "value": result.data[i].templateName,
              "label": result.data[i].templateName.charAt(0).toUpperCase() + result.data[i].templateName.slice(1) + " (" + (result.data[i].templateType.toLowerCase()) + ")"
            });



          }
          console.log("Temp: " + JSON.stringify(temp));
          this.setState({ feeTemplate: temp });
        }
      });
  }


  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
    }); this.resetForm();

  }

  WarnToggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
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

  resetForm = e => {
    document.getElementById("photo").value = null;
    //document.getElementById("selectedFeeTemplate").value = null;
    document.getElementById("gender1").checked = false;
    document.getElementById("gender2").checked = false;


    this.setState({
      class: "",
      section: "",




      classDetailsUpdatedFlag: false,
      studentsDataArray: [],

      sectionView: false,
      studentsView: false,

      photoerror: null,
      loader: false,
      admintype: "Office Admin",



      empRegSuccess: false,
      modalSuccess: true,
      parentpassword_con: "",
      parentusername: "",
      occupation: "",
      relation: "",
      parentpassword: "",
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      password_con: "",
      role: ["student"],
      userdata: null,
      studentRegSuccess: false,
      employeeno: "",
      errors: null,
      importErrors: null,
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
      parentfirstname: "",
      parentlastname: "",
      parentrelation: "",
      parentoccupation: "",
      parentemail: "",
      parentphone1: "",
      parentphone2: "",
      parentaddress: "",
      parentcity: "",
      parentpostalcode: "",
      parentstate: "",
      address: "",
      city: "",
      postalcode: "",
      state: "",
      admissionno: "",
      rollno: "",
      doj: "",
      type: "",
      experiencedetails: "NA",
      department: "",
      designation: "",
      dob: "",
      gender: "",
      maritalstatus: "",
      qualification: "",
      photo: null,
      religion: "",
      nationality: "",
      bloodgroup: "",
      category: "",

      corruptphoto: false,
      photoname: "",
      phone: "",
      parentaddresscheck: false,
      roleerror: false
    });
  };

  /**
   * @description Handles the form submit request
   * @param {*} e
   */
   photoUpload() {

    this.setState({
      fullName: this.state.firstname + " " + this.state.lastname,
      parentFullName: this.state.parentfirstname + " " + this.state.parentlastname
    });

    console.log("in PhotoUpload for file - " + this.state.photoname)

    const data = new FormData();  //photo upload
    this.setState({ photoname: this.state.photo.name }, () => {

      data.append('file', this.state.photo, this.state.photoname);
      axios
        .post("http://localhost:8001/api/photoUploading", data)
        .then(res => {
          console.log("in Photo Res " + JSON.stringify(res.data));
          if (res.data.error_code === 1) {

            return this.setState({
              corruptphoto: true,
              loader: false

            });

          }

          else {

            if (!this.state.photoerror && this.state.corruptphoto === false && this.state.photo) {
              if (this.state.role[0] === "student") {
                console.log("in STUDENT");


                axios
                  .post("http://localhost:8001/api/studentRegister", this.state)
                  .then(result => {
                    console.log("RESULT.data " + JSON.stringify(result.data));
                    if (result.data.errors) {
                      this.setState({ loader: false });

                      return this.setState(result.data);
                    }



                    return this.setState({
                      userdata: result.data.data,
                      errors: null,
                      studentRegSuccess: true,
                      modalSuccess: true,
                      loader: false


                    },()=>{ this.updateClassDetails();
                     });
                  });



              } else if (this.state.role.indexOf("admin") !== -1 || this.state.role.indexOf("teacher") !== -1) {
                this.setState({ roleerror: false, errors: null });
                axios
                  .post("http://localhost:8001/api/empRegister", this.state)
                  .then(result => {
                    console.log("EMP-RESULT.DATA " + JSON.stringify(result.data));
                    if (result.data.errors) {
                      this.setState({ loader: false });
                      return this.setState(result.data);
                    }

                    return this.setState({
                      userdata: result.data.data,
                      errors: null,
                      empRegSuccess: true,
                      modalSuccess: true,
                      loader: false

                    });
                  });
              }
            }
          }


        })
    });


  }

  submitHandler(e) {
    //var tempdata = {"role":["student"],"userdata":null,"studentRegSuccess":false,"errors":null,"importErrors":null,"status":"Active","disabled":true,"checked":{"adminChecked":false,"teacherChecked":false,"studentChecked":true},"visible":true,"studentmodalSuccess":true,"admintype":"Office Admin","nophoto":false,"corruptphoto":false,"photoname":"Book1.xlsx","roleerror":false,"firstname":"dfdfd","lastname":"dfdf","dob":"2018-11-08","gender":"Female","bloodgroup":"B-","nationality":"Indian","religion":"Sikh","category":"OBC","photo":"tempphotodata","admissionno":"4545","rollno":"56565","doj":"2018-11-20","phone":"+91 56565-56565","address":"dfdf","city":"dfdf","postalcode":"dfdf","state":"dfdfdf","username":"yuyg","email":"fdfdf@df.co","password":"pass","password_con":"pass","parentfirstname":"fgfg","parentlastname":"hjhjhj","relation":"Father","occupation":"fgfgfg","parentemail":"dfdf@gh.cd","parentphone1":"+91 56656-56565","parentphone2":"+91 45454-54545","parentaddress":"dfdf","parentcity":"dfdf","parentpostalcode":"dfdf","parentstate":"dfdfdf","parentusername":"gngngn","parentpassword":"pass","parentpassword_con":"pass"};

    e.preventDefault();
    this.setState({ roleerror: false, errors: null, loader: true });
    // console.log(JSON.stringify(this.state));
    //console.log("in STUDENT" + this.state.role[0]);

    if (this.state.role.length === 0) {
      this.setState({ roleerror: true, loader: false });

    }

    if (this.state.photo === null)
      this.setState({ photoerror: "Please select Photo", loader: false })
    else
      this.photoUpload();




  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {
    // console.log("Name: "+e.target.name +" Value: "+e.target.value);
    this.setState({
      [e.target.name]: e.target.value
    });
    if (e.target.value === "Experienced")
      this.setState({ experiencedetails: "" });
    if (e.target.value === "Fresher")
      this.setState({ experiencedetails: "NA" });
    if (e.target.name === "username" || e.target.name === "parentusername")
      this.setState({
        [e.target.name]: String(e.target.value).toLowerCase()
      });
  }

  copyAddress(e) {
    if (e.target.checked === true) {
      console.log("address check true: " + e.target.checked);
      this.setState({
        parentaddress: this.state.address,
        parentcity: this.state.city,
        parentpostalcode: this.state.postalcode,
        parentstate: this.state.state,
        parentaddresscheck: true
      });
    } else if (e.target.checked === false) {
      console.log("address check false: " + e.target.checked);
      this.setState({
        parentaddress: "",
        parentcity: "",
        parentpostalcode: "",
        parentstate: "",
        parentaddresscheck: false
      });
    }
  }

  /**
   * @description Called when the role(s) are selected. To update role Array
   * @param {*} e
   */
  roleHandler = e => {

    this.setState({ roleerror: false })
    if (e.target.checked && this.state.role.indexOf(e.target.name) === -1) {
      const temp = this.state.role;
      temp.push(e.target.name);

      this.setState({ role: temp }, () => console.log(this.state.role));
    } else if (
      !e.target.checked &&
      this.state.role.indexOf(e.target.name) !== -1
    ) {
      const temp = this.state.role;
      temp.splice(this.state.role.indexOf(e.target.name), 1);

      this.setState({ role: temp }, () => console.log(this.state.role));
    }

    // Checked status
    var checkedStatus = e.target.checked;
    const tempCheckedStatus = this.state.checked;

    if (e.target.name === "admin" && e.target.checked) {
      tempCheckedStatus.adminChecked = true;
      this.setState({ checked: tempCheckedStatus });
    } else if (e.target.name === "admin" && !e.target.checked) {
      tempCheckedStatus.adminChecked = false;
      this.setState({ checked: tempCheckedStatus });
    }

    if (e.target.name === "teacher" && e.target.checked) {
      tempCheckedStatus.teacherChecked = true;
      this.setState({ checked: tempCheckedStatus });
    } else if (e.target.name === "teacher" && !e.target.checked) {
      tempCheckedStatus.teacherChecked = false;
      this.setState({ checked: tempCheckedStatus });
    }

    if (e.target.name === "student" && e.target.checked) {
      this.setState({
        checked: {
          studentChecked: true,
          adminChecked: false,
          teacherChecked: false
        },
        disabled: true,
        role: ["student"]
      });
    } else if (e.target.name === "student" && !e.target.checked) {
      console.log("not checked");

      this.setState({
        checked: {
          studentChecked: false,
          adminChecked: false,
          teacherChecked: false
        },
        disabled: false
      });
    }

    console.log(
      "studentChecked - " +
      this.state.checked.studentChecked +
      " adminChecked - " +
      this.state.checked.adminChecked +
      " teacherChecked - " +
      this.state.checked.teacherChecked
    );
  };

  /**
   * @description handles the file upload
   * @param {*} e
   */


  fileChange = event => {
    try {
      const file = event.target.files[0];
      this.setState(
        { photo: file, nophoto: false, photoerror: null, corruptphoto: false, photoname: file.name },
        () => console.log("file:  " + this.state.photoname)
      );
    }
    catch (err) {
      console.log("Photo Upload error: No file selected: " + err);
      this.setState({ photo: null, photoerror: null, corruptphoto: false });
      document.getElementById("photo").value = null;

    }
  };

  fetchClassDetails() {

    axios.get("http://localhost:8001/api/fetchAllClassDetails").then(cRes => {

      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ classDetails: cRes.data });

        console.log('ClassDetails - fetchClassDetails - All class details - ' + JSON.stringify(this.state.classDetails));

        this.fetchClasses();
      }
    });
  }

  /**
   * @description - fetches unique classes from the class detail from DB
   */
  fetchClasses() {

    var classArray = [];
    this.state.classDetails.forEach(element => {

      console.log("element.class - " + element.class);
      classArray.push(element.class);
    });
    console.log("classArray - " + classArray);
    var uniqueItems = Array.from(new Set(classArray));

    this.setState({ classes: uniqueItems });

    console.log("Unique classes - " + this.state.classes);
  }

  classChangeHandler(e) {

    var selectedClass = e.currentTarget.value;
    console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + selectedClass);
    this.setState({ class: selectedClass });

    var sectionArrayTemp = [];
    this.state.classDetails.forEach(element => {
      if (element["class"] === selectedClass) {

        sectionArrayTemp.push(element["section"]);

      }
    });

    // Sorting array alphabetically
    sectionArrayTemp.sort();

    this.setState({
       sectionArray: sectionArrayTemp,
      })

    console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp );

    // Switching view to section view
    this.setState({ sectionView: true });
  }

  async updateClassDetails() {

    var updateClassDetailsRequest = {
      "class": this.state.class,
      "section": this.state.section,
      "studentsData": {
        "rollno": this.state.rollno,
        "username": this.state.username,
        "firstname": this.state.firstname,
        "fullName": this.state.firstname + " " + this.state.lastname,
        "lastname": this.state.lastname,
        "email": this.state.email,
        "parentemail": this.state.parentemail
      }
    }

    console.log("RegisterUser - updateClassDetails - updateClassDetailsRequest - "
      + JSON.stringify(updateClassDetailsRequest));

    await axios.post("http://localhost:8001/api/updateClassDetails", updateClassDetailsRequest).then(res => {

      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      } else {

        this.setState({
          classDetailsUpdatedFlag: true
        });
      }
    });
  }

  render() {
    return (

      <div style={{ width: "1000px" }}>

        <Container style={{ width: "2500px" }}>

          <Row lg="4" style={{ width: "2500px" }}>
            <Col md="7">
              <Card className="mx-4">
                <CardBody className="p-2">

                  <Form>
                    {this.state.studentRegSuccess && (
                      <Modal
                        isOpen={this.state.modalSuccess}
                        className={"modal-success " + this.props.className}
                        toggle={this.toggleSuccess}
                      >
                        <ModalHeader toggle={this.toggleSuccess}>
                          Student: {this.state.userdata.firstname}{" "}
                          {this.state.userdata.lastname}{" "}
                          and Parent: {this.state.userdata.parentfirstname}{" "}
                          {this.state.userdata.parentlastname} Registered
                          Successfully!
                        </ModalHeader>
                      </Modal>
                    )}

{(this.state.feeTemplate.length===0||this.state.classes.length===0) && (
                      <Modal
                        isOpen={this.state.modalSuccess}
                        className={"modal-danger " + this.props.className}
                        toggle={this.WarnToggleSuccess}
                      >
                        <ModalHeader toggle={this.WarnToggleSuccess}>
                         WARNING: Please Make sure Classes and Fee Templates are created before Registering Students!
                        </ModalHeader>
                      </Modal>
                    )}




                    {this.state.empRegSuccess && (
                      <Modal
                        isOpen={this.state.modalSuccess}
                        className={"modal-success " + this.props.className}
                        toggle={this.toggleSuccess}
                      >
                        <ModalHeader toggle={this.toggleSuccess}>
                        Employee {this.state.userdata.firstname}{" "}
                          {this.state.userdata.lastname}{" "}
                          Registered Successfully!
                        </ModalHeader>
                      </Modal>
                    )}

                    <Row lg="2">
                      <Col>
                        <Card className="mx-1">
                          <CardHeader style={{ backgroundColor: 'lightgreen', borderColor: 'black' }}><h5>Select User Roles</h5></CardHeader>
                          <CardBody className="p-2">


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
                                {this.state.checked.adminChecked && (
                                  <tr>
                                    <td>
                                      <InputGroup className="mb-3">
                                        <InputGroupAddon addonType="prepend">
                                          <InputGroupText
                                            style={{ width: "120px" }}
                                          >
                                            Admin Type
                                          </InputGroupText>
                                        </InputGroupAddon>
                                        <Input
                                          name="admintype"
                                          id="admintype"
                                          type="select"
                                          onChange={this.changeHandler}
                                          value={this.state.admintype}
                                        >
                                          <option value="Office Admin">
                                            Office Admin
                                          </option>
                                          <option value="Library Admin">
                                            Library Admin
                                          </option>
                                          <option value="Transport Admin">
                                            Transport Admin
                                          </option>
                                        </Input>
                                      </InputGroup>
                                    </td>
                                  </tr>
                                )}

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
                                      checked={
                                        this.state.checked.teacherChecked
                                      }
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
                                      checked={
                                        this.state.checked.studentChecked
                                      }
                                    />
                                  </td>
                                </tr>
                              </tbody>
                            </Table>
                          </CardBody>
                        </Card>
                        {this.state.roleerror && (
                          <font color="red">
                            {" "}
                            <p>Please select atleast one role</p>
                          </font>
                        )}



                        <Card className="mx-1">
                          <CardBody className="p-2">
                            <CardHeader style={{ backgroundColor: 'lightgreen', borderColor: 'black' }}><h5>Basic Details</h5></CardHeader>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
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

                            {this.state.errors && this.state.errors.firstname && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.firstname.msg}</p>
                              </font>
                            )}
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
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

                            {this.state.errors && this.state.errors.lastname && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.lastname.msg}</p>
                              </font>
                            )}
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  Date of Brith
                                </InputGroupText>
                              </InputGroupAddon>

                              <DatePicker

                                name="dob"
                                id="dob"
                                value={this.state.dob}
                                onChange={date => { if(date){this.setState({ dob: new Date(date.getTime()-(date.getTimezoneOffset() * 60000)) }) }}}
                              />
                            </InputGroup>

                            {this.state.errors && this.state.errors.dob && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.dob.msg}</p>
                              </font>
                            )}

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "80px" }}>
                                  Gender
                                </InputGroupText>
                              </InputGroupAddon>
                              <Col md="9">
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="gender1"
                                    name="gender"
                                    value="Male"
                                    style={{ height: "35px", width: "25px" }}
                                    onChange={this.changeHandler}
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio1"
                                  >
                                    Male
                                  </Label>
                                </FormGroup>
                                <FormGroup check inline>
                                  <Input
                                    className="form-check-input"
                                    type="radio"
                                    id="gender2"
                                    name="gender"
                                    value="Female"
                                    style={{ height: "35px", width: "25px" }}
                                    onChange={this.changeHandler}
                                  />
                                  <Label
                                    className="form-check-label"
                                    check
                                    htmlFor="inline-radio1"
                                  >
                                    Female
                                  </Label>
                                </FormGroup>
                              </Col>
                            </InputGroup>

                            {this.state.errors && this.state.errors.gender && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.gender.msg}</p>
                              </font>
                            )}
                            {(this.state.role.indexOf("teacher") !== -1 ||
                              this.state.role.indexOf("admin") !== -1) && (
                                <p>
                                  <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                        Marital Status
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="maritalstatus"
                                      id="maritalstatus"
                                      type="select"
                                      onChange={this.changeHandler}
                                      value={this.state.maritalstatus}

                                    >
                                      <option value="">Select</option>
                                      <option value="Single">Single</option>
                                      <option value="Married">Married</option>
                                      <option value="Divorced">Divorced</option>
                                      <option value="Widowed">Widowed</option>
                                    </Input>
                                  </InputGroup>
                                  {this.state.errors &&
                                    this.state.errors.maritalstatus && (
                                      <font color="red">
                                        {" "}
                                        <p>
                                          {this.state.errors.maritalstatus.msg}
                                        </p>
                                      </font>
                                    )}

                                  <InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                        Qualification
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      type="text"
                                      name="qualification"
                                      id="qualification"
                                      value={this.state.qualification}
                                      autoComplete="qualification"
                                      onChange={this.changeHandler}
                                    />
                                  </InputGroup>
                                  {this.state.errors &&
                                    this.state.errors.qualification && (
                                      <font color="red">
                                        {" "}
                                        <p>
                                          {this.state.errors.qualification.msg}
                                        </p>
                                      </font>
                                    )}
                                </p>
                              )}
                            <InputGroup className="mb-4">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  Blood Group
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                name="bloodgroup"
                                id="bloodgroup"
                                type="select"
                                value={this.state.bloodgroup}
                                onChange={this.changeHandler}
                              >
                                <option value="">Select</option>
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
                            {this.state.errors && this.state.errors.bloodgroup && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.bloodgroup.msg}</p>
                              </font>
                            )}

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  Nationality
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                name="nationality"
                                id="nationality"
                                type="select"
                                onChange={this.changeHandler}
                                value={this.state.nationality}
                              >
                                <option value="">Select</option>
                                <option value="Indian">Indian</option>
                                <option value="Foreign">Foreign</option>
                              </Input>
                            </InputGroup>
                            {this.state.errors &&
                              this.state.errors.nationality && (
                                <font color="red">
                                  {" "}
                                  <p>{this.state.errors.nationality.msg}</p>
                                </font>
                              )}

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  Religion
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                name="religion"
                                id="religion"
                                type="select"
                                onChange={this.changeHandler}
                                value={this.state.religion}
                              >
                                <option value="">Select</option>
                                <option value="Hindu">Hindu</option>
                                <option value="Muslim">Muslim</option>
                                <option value="Christian">Christian</option>
                                <option value="Sikh">Sikh</option>
                                <option value="Jain">Jain</option>
                                <option value="Other">Other</option>
                              </Input>
                            </InputGroup>

                            {this.state.errors && this.state.errors.religion && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.religion.msg}</p>
                              </font>
                            )}

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  Category
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                name="category"
                                id="category"
                                type="select"
                                onChange={this.changeHandler}
                                value={this.state.category}
                              >
                                <option value="">Select</option>
                                <option value="General">General</option>
                                <option value="ST">ST</option>
                                <option value="SC">SC</option>
                                <option value="OBC">OBC</option>
                                <option value="Other">Other</option>
                              </Input>
                            </InputGroup>
                            {this.state.errors && this.state.errors.category && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.category.msg}</p>
                              </font>
                            )}

                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "150px" }}>
                                  Photo
                                </InputGroupText>

                                <Input
                                  type="file"
                                  name="photo"
                                  id="photo"
                                  style={{ paddingLeft: "20px" }}
                                  onChange={this.fileChange}
                                />
                              </InputGroupAddon>
                            </InputGroup>

                            {this.state.photoerror && (
                              <font color="red">
                                {" "}
                                <p>{this.state.photoerror}</p>
                              </font>
                            )}
                            {this.state.corruptphoto
                              && <font color="red">  <p>Please select only JPG file format </p></font>
                            }


                          </CardBody>
                        </Card>
                      </Col>
                      <Col>
                        <Card className="mx-1">
                          <CardBody className="p-2">
                            <CardHeader style={{ backgroundColor: 'lightgreen', borderColor: 'black' }}> <h5>Official Details</h5></CardHeader>

                            {this.state.role.indexOf("teacher") === -1 &&
                              this.state.role.indexOf("admin") === -1 && (
                                <p>
                                  <InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={{ width: "120px" }}
                                      >
                                        Admission No
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      type="number"
                                      name="admissionno"
                                      id="admissionno"
                                      autoComplete="admissionno"
                                      onChange={this.changeHandler}
                                      value={this.state.admissionno}
                                    />
                                  </InputGroup>

                                  {this.state.errors &&
                                    this.state.errors.admissionno && (
                                      <font color="red">
                                        {" "}
                                        <p>
                                          {this.state.errors.admissionno.msg}
                                        </p>
                                      </font>
                                    )}






                                  <InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={{ width: "120px" }}
                                      >
                                        Roll No
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      type="text"
                                      name="rollno"
                                      id="rollno"
                                      value={this.state.rollno}
                                      autoComplete="rollno"
                                      onChange={this.changeHandler}
                                    />
                                  </InputGroup>
                                  {this.state.errors &&
                                    this.state.errors.rollno && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.rollno.msg}</p>
                                      </font>
                                    )}

                                  <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                        Class
                                </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="class"
                                      id="class"
                                      type="select"
                                      value={this.state.class}
                                      onChange={this.classChangeHandler}
                                    >
                                      <option value="">Select</option>
                                      {this.state.classes.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                    </Input> &nbsp;
                                    <a href='#/admin/classmanagement/CreateClass'
                  >
                  <b>Create Class</b>
                </a>
                                  </InputGroup>
                                  {this.state.errors && this.state.errors.class && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.errors.class.msg}</p>
                                    </font>
                                  )}

                                  {this.state.sectionView && this.state.sectionArray && (
                                    <InputGroup className="mb-4">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "120px" }}>
                                          Section
                                </InputGroupText>
                                      </InputGroupAddon>
                                      <Input
                                        name="section"
                                        id="section"
                                        type="select"
                                        value={this.state.section}
                                        onChange={this.changeHandler}
                                      >
                                        <option value="">Select</option>
                                        {this.state.sectionArray.map(element => {
                                          return (<option key={element} value={element}>{element}</option>);
                                        }
                                        )}

                                      </Input>
                                    </InputGroup>
                                  )}
                                  {this.state.errors && this.state.errors.section && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.errors.section.msg}</p>
                                    </font>
                                  )}

                                  <Card className="mx-1">
                                    <CardBody className="p-2">
                                      <h6>Select Fee Templates</h6>


                                      <Select
                                        id="selectedFeeTemplate"
                                        name="selectedFeeTemplate"
                                        isMulti={true}
                                        placeholder="Select or Type to search"
                                        options={this.state.feeTemplate}
                                        closeMenuOnSelect={false}
                                        value={this.state.selectedFeeTemplateValue}

                                        isSearchable={true}
                                        onChange={selected => {
                                          console.log("Selected: " + JSON.stringify(selected));
                                          var temp = [];

                                          for (var i = 0; i < selected.length; i++) { temp.push(selected[i].value) }
                                          this.setState({
                                            selectedFeeTemplate: temp,
                                            selectedFeeTemplateValue: selected
                                          }, () => {
                                            console.log("Selected Fee Templ: " + JSON.stringify(this.state.selectedFeeTemplate));
                                          })







                                        }



                                        } />
                                                    <a href='#/admin/finance/FeeTemplates'
                  >
                  <b>Create Fee Template</b>
                </a>






                                    </CardBody>
                                  </Card>
                                  {this.state.errors && this.state.errors.selectedFeeTemplate && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.errors.selectedFeeTemplate.msg}</p>
                                    </font>
                                  )}


                                </p>
                              )}


                            <InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "120px" }}>
                                  Date of Joining
                                </InputGroupText>
                              </InputGroupAddon>


                              <DatePicker

                                name="doj"
                                id="doj"
                                value={this.state.doj}
                                onChange={date => { if (date)this.setState({ doj: new Date(date.getTime()-(date.getTimezoneOffset() * 60000)) }) }}
                              />
                            </InputGroup>
                            {this.state.errors && this.state.errors.doj && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.doj.msg}</p>
                              </font>
                            )}

                            {(this.state.role.indexOf("teacher") !== -1 ||
                              this.state.role.indexOf("admin") !== -1) && (
                                <p>
                                  <InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                        Employee No
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      type="text"
                                      name="employeeno"
                                      id="employeeno"
                                      value={this.state.employeeno}
                                      autoComplete="employeeno"
                                      onChange={this.changeHandler}
                                    />
                                  </InputGroup>
                                  {this.state.errors &&
                                    this.state.errors.employeeno && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.employeeno.msg}</p>
                                      </font>
                                    )}

                                  <InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "100px" }}>
                                        Type
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <Col md="9">
                                      <FormGroup check inline>
                                        <Input
                                          className="form-check-input"
                                          type="radio"
                                          id="type1"
                                          name="type"
                                          value="Fresher"
                                          style={{
                                            height: "35px",
                                            width: "25px"
                                          }}
                                          onChange={this.changeHandler}
                                        />
                                        <Label
                                          className="form-check-label"
                                          check
                                          htmlFor="inline-radio1"
                                        >
                                          Fresher
                                      </Label>
                                      </FormGroup>
                                      <FormGroup check inline>
                                        <Input
                                          className="form-check-input"
                                          type="radio"
                                          id="type2"
                                          name="type"
                                          value="Experienced"
                                          style={{
                                            height: "35px",
                                            width: "25px"
                                          }}
                                          onChange={this.changeHandler}
                                        />
                                        <Label
                                          className="form-check-label"
                                          check
                                          htmlFor="inline-radio1"
                                        >
                                          Experienced
                                      </Label>
                                      </FormGroup>
                                    </Col>
                                  </InputGroup>

                                  {this.state.errors && this.state.errors.type && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.errors.type.msg}</p>
                                    </font>
                                  )}

                                  {this.state.type === "Experienced" && (
                                    <InputGroup className="mb-3">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText
                                          style={{ width: "150px" }}
                                        >
                                          Experience Details
                                      </InputGroupText>
                                      </InputGroupAddon>
                                      <textarea
                                        style={{ width: "200px" }}
                                        name="experiencedetails"
                                        value={this.state.experiencedetails}
                                        onChange={this.changeHandler}
                                      />

                                      {this.state.errors &&
                                        this.state.errors.experiencedetails && (
                                          <font color="red">
                                            {" "}
                                            <p>
                                              {
                                                this.state.errors
                                                  .experiencedetails.msg
                                              }
                                            </p>
                                          </font>
                                        )}
                                    </InputGroup>
                                  )}

                                  <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                        Department
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="department"
                                      id="department"
                                      type="select"
                                      onChange={this.changeHandler}
                                      value={this.state.department}
                                    >
                                      <option value="">Select</option>
                                      <option value="Department1">
                                        Department1
                                    </option>
                                      <option value="Department2">
                                        Department2
                                    </option>
                                      <option value="Department3">
                                        Department3
                                    </option>
                                      <option value="Department4">
                                        Department4
                                    </option>
                                    </Input>
                                  </InputGroup>

                                  {this.state.errors &&
                                    this.state.errors.department && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.department.msg}</p>
                                      </font>
                                    )}

                                  <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                        Designation
                                    </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="designation"
                                      id="designation"
                                      type="select"
                                      onChange={this.changeHandler}
                                      value={this.state.designation}
                                    >
                                      <option value="">Select</option>
                                      <option value="designation1">
                                        designation1
                                    </option>
                                      <option value="designation2">
                                        designation2
                                    </option>
                                      <option value="designation3">
                                        designation3
                                    </option>
                                      <option value="designation4">
                                        designation4
                                    </option>
                                    </Input>
                                  </InputGroup>
                                  {this.state.errors &&
                                    this.state.errors.designation && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.designation.msg}</p>
                                      </font>
                                    )}
                                </p>
                              )}
                          </CardBody>
                        </Card>
                        <Card className="mx-1">
                          <CardBody className="p-2">
                            <CardHeader style={{ backgroundColor: 'lightgreen', borderColor: 'black' }}>  <h5>Login Details</h5></CardHeader>
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
                            {this.state.errors && this.state.errors.username && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.username.msg}</p>
                              </font>
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

                            {this.state.errors && this.state.errors.email && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.email.msg}</p>
                              </font>
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

                            {this.state.errors && this.state.errors.password && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.password.msg}</p>
                              </font>
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
                                <font color="red">
                                  <p>{this.state.errors.password_con.msg}</p>
                                </font>
                              )}
                          </CardBody>
                        </Card>


                        <Card className="mx-1">
                          <CardBody className="p-2">
                            <CardHeader> <h5>Contact Details</h5></CardHeader>


                            <Card className="mx-1">
                              <CardBody className="p-2">
                                <b>Address</b>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    id="street"
                                    placeholder="House No, Area"
                                    name="address"
                                    value={this.state.address}
                                    onChange={this.changeHandler}
                                  />
                                </FormGroup>
                                {this.state.errors &&
                                  this.state.errors.address && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.errors.address.msg}</p>
                                    </font>
                                  )}
                                <FormGroup row className="my-0">
                                  <Col xs="8">
                                    <FormGroup>
                                      <Input
                                        type="text"
                                        id="city"
                                        placeholder="City"
                                        name="city"
                                        value={this.state.city}
                                        onChange={this.changeHandler}
                                      />
                                    </FormGroup>
                                    {this.state.errors &&
                                      this.state.errors.city && (
                                        <font color="red">
                                          {" "}
                                          <p>{this.state.errors.city.msg}</p>
                                        </font>
                                      )}
                                  </Col>
                                  <Col xs="4">
                                    <FormGroup>
                                      <Input
                                        type="text"
                                        id="postal-code"
                                        placeholder="Postal Code"
                                        name="postalcode"
                                        value={this.state.postalcode}
                                        onChange={this.changeHandler}
                                      />
                                    </FormGroup>
                                    {this.state.errors &&
                                      this.state.errors.postalcode && (
                                        <font color="red">
                                          {" "}
                                          <p>
                                            {this.state.errors.postalcode.msg}
                                          </p>
                                        </font>
                                      )}
                                  </Col>
                                </FormGroup>
                                <FormGroup>
                                  <Input
                                    type="text"
                                    id="statename"
                                    placeholder="State"
                                    name="state"
                                    value={this.state.state}
                                    onChange={this.changeHandler}
                                  />
                                </FormGroup>

                                {this.state.errors && this.state.errors.state && (
                                  <font color="red">
                                    {" "}
                                    <p>{this.state.errors.state.msg}</p>
                                  </font>
                                )}
                              </CardBody>
                            </Card>
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText style={{ width: "125px" }}>
                                  Phone Number
                                </InputGroupText>
                                <ReactPhoneInput
                                  defaultCountry="in"
                                  value={this.state.phone}
                                  name="phone"
                                  onChange={phone => {
                                    console.log("phone value: " + phone);
                                    this.setState({ phone });
                                  }}
                                />
                              </InputGroupAddon>
                            </InputGroup>

                            {this.state.errors && this.state.errors.phone && (
                              <font color="red">
                                {" "}
                                <p>{this.state.errors.phone.msg}</p>
                              </font>
                            )}

                          </CardBody>
                        </Card>

                      </Col>
                      <Col>
                        {this.state.role.indexOf("student") !== -1 && (
                          <p>
                            <Card className="mx-1">
                              <CardBody className="p-2">
                                <CardHeader style={{ backgroundColor: 'lightgreen', borderColor: 'black' }}>   <h5>Parent Details</h5></CardHeader>
                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "110px" }}>
                                      First Name
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    type="text"
                                    name="parentfirstname"
                                    id="parentfirstname"
                                    value={this.state.parentfirstname}
                                    autoComplete="parentfirstname"
                                    onChange={this.changeHandler}
                                  />
                                </InputGroup>

                                {this.state.errors &&
                                  this.state.errors.parentfirstname && (
                                    <font color="red">
                                      {" "}
                                      <p>
                                        {this.state.errors.parentfirstname.msg}
                                      </p>
                                    </font>
                                  )}
                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "110px" }}>
                                      Last Name
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    type="text"
                                    name="parentlastname"
                                    id="parentlastname"
                                    value={this.state.parentlastname}
                                    autoComplete="parentlastname"
                                    onChange={this.changeHandler}
                                  />
                                </InputGroup>

                                {this.state.errors &&
                                  this.state.errors.parentlastname && (
                                    <font color="red">
                                      {" "}
                                      <p>
                                        {this.state.errors.parentlastname.msg}
                                      </p>
                                    </font>
                                  )}

                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "110px" }}>
                                      Relation
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    name="relation"
                                    id="relation"
                                    type="select"
                                    onChange={this.changeHandler}
                                    value={this.state.relation}
                                  >
                                    <option value="">Select</option>
                                    <option value="Father">Father</option>
                                    <option value="Mother">Mother</option>
                                    <option value="Guardian">Guardian</option>
                                  </Input>
                                </InputGroup>
                                {this.state.errors &&
                                  this.state.errors.relation && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.errors.relation.msg}</p>
                                    </font>
                                  )}

                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "110px" }}>
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
                                {this.state.errors &&
                                  this.state.errors.occupation && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.errors.occupation.msg}</p>
                                    </font>
                                  )}

                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "110px" }}>
                                      Email
                                    </InputGroupText>
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
                                {this.state.errors &&
                                  this.state.errors.parentemail && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.errors.parentemail.msg}</p>
                                    </font>
                                  )}

                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "150px" }}>
                                      Phone Number 1
                                    </InputGroupText>
                                    <ReactPhoneInput
                                      defaultCountry="in"
                                      value={this.state.parentphone1}
                                      name="parentphone1"
                                      onChange={parentphone1 => {
                                        console.log(
                                          "parentphone1 value: " + parentphone1
                                        );
                                        this.setState({ parentphone1 });
                                      }}
                                    />
                                  </InputGroupAddon>
                                </InputGroup>

                                {this.state.errors &&
                                  this.state.errors.parentphone1 && (
                                    <font color="red">
                                      {" "}
                                      <p>
                                        {this.state.errors.parentphone1.msg}
                                      </p>
                                    </font>
                                  )}

                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "150px" }}>
                                      Phone Number 2
                                    </InputGroupText>
                                    <ReactPhoneInput
                                      defaultCountry="in"
                                      value={this.state.parentphone2}
                                      name="parentphone2"
                                      onChange={parentphone2 => {
                                        console.log(
                                          "parentphone2 value: " + parentphone2
                                        );
                                        this.setState({ parentphone2 });
                                      }}
                                    />
                                  </InputGroupAddon>
                                </InputGroup>
                                {this.state.errors &&
                                  this.state.errors.parentphone2 && (
                                    <font color="red">
                                      {" "}
                                      <p>
                                        {this.state.errors.parentphone2.msg}
                                      </p>
                                    </font>
                                  )}
                                <Card className="mx-1">
                                  <FormGroup check inline>
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="parentaddresscheck"
                                      style={{ height: "35px", width: "25px" }}
                                      name="parentaddresscheck"
                                      checked={this.state.parentaddresscheck}
                                      onChange={this.copyAddress}
                                    />
                                    <Label
                                      className="form-check-label"
                                      check
                                      htmlFor="inline-checkbox1"
                                    >
                                      Address same as Student Address
                                    </Label>
                                  </FormGroup>
                                  <CardBody className="p-2">
                                    <b>Address</b>
                                    <FormGroup>
                                      <Input
                                        type="text"
                                        id="parentaddress"
                                        placeholder="House No, Area"
                                        name="parentaddress"
                                        value={this.state.parentaddress}
                                        onChange={this.changeHandler}
                                      />
                                    </FormGroup>

                                    {this.state.errors &&
                                      this.state.errors.parentaddress && (
                                        <font color="red">
                                          {" "}
                                          <p>
                                            {
                                              this.state.errors.parentaddress
                                                .msg
                                            }
                                          </p>
                                        </font>
                                      )}
                                    <FormGroup row className="my-0">
                                      <Col xs="8">
                                        <FormGroup>
                                          <Input
                                            type="text"
                                            id="parentcity"
                                            placeholder="City"
                                            name="parentcity"
                                            value={this.state.parentcity}
                                            onChange={this.changeHandler}
                                          />
                                        </FormGroup>

                                        {this.state.errors &&
                                          this.state.errors.parentcity && (
                                            <font color="red">
                                              {" "}
                                              <p>
                                                {
                                                  this.state.errors.parentcity
                                                    .msg
                                                }
                                              </p>
                                            </font>
                                          )}
                                      </Col>
                                      <Col xs="4">
                                        <FormGroup>
                                          <Input
                                            type="text"
                                            id="parentpostalcode"
                                            placeholder="Postal Code"
                                            name="parentpostalcode"
                                            value={this.state.parentpostalcode}
                                            onChange={this.changeHandler}
                                          />
                                        </FormGroup>
                                        {this.state.errors &&
                                          this.state.errors
                                            .parentpostalcode && (
                                            <font color="red">
                                              {" "}
                                              <p>
                                                {
                                                  this.state.errors
                                                    .parentpostalcode.msg
                                                }
                                              </p>
                                            </font>
                                          )}
                                      </Col>
                                    </FormGroup>
                                    <FormGroup>
                                      <Input
                                        type="text"
                                        id="parentstate"
                                        placeholder="State"
                                        name="parentstate"
                                        value={this.state.parentstate}
                                        onChange={this.changeHandler}
                                      />
                                    </FormGroup>
                                    {this.state.errors &&
                                      this.state.errors.parentstate && (
                                        <font color="red">
                                          {" "}
                                          <p>
                                            {this.state.errors.parentstate.msg}
                                          </p>
                                        </font>
                                      )}
                                  </CardBody>
                                </Card>
                              </CardBody>
                            </Card>

                            <Card className="mx-1">
                              <CardBody className="p-2">
                                <CardHeader style={{ backgroundColor: 'lightgreen', borderColor: 'black' }}> <h5>Parent Login Details</h5></CardHeader>
                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="icon-user" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    type="text"
                                    name="parentusername"
                                    id="parentusername"
                                    value={this.state.parentusername}
                                    placeholder="Username"
                                    autoComplete="username"
                                    onChange={this.changeHandler}
                                  />
                                </InputGroup>
                                {this.state.errors &&
                                  this.state.errors.parentusername && (
                                    <font color="red">
                                      {" "}
                                      <p>
                                        {this.state.errors.parentusername.msg}
                                      </p>
                                    </font>
                                  )}

                                <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="icon-lock" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    type="password"
                                    name="parentpassword"
                                    id="parentpassword"
                                    placeholder="Password"
                                    value={this.state.parentpassword}
                                    autoComplete="new-password"
                                    onChange={this.changeHandler}
                                  />
                                </InputGroup>

                                {this.state.errors &&
                                  this.state.errors.parentpassword && (
                                    <font color="red">
                                      {" "}
                                      <p>
                                        {this.state.errors.parentpassword.msg}
                                      </p>
                                    </font>
                                  )}

                                <InputGroup className="mb-4">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText>
                                      <i className="icon-lock" />
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    type="password"
                                    name="parentpassword_con"
                                    id="parentpassword_con"
                                    placeholder="Confirm Password"
                                    value={this.state.parentpassword_con}
                                    autoComplete="new-password"
                                    onChange={this.changeHandler}
                                  />
                                </InputGroup>

                                {this.state.errors &&
                                  this.state.errors.parentpassword_con && (
                                    <font color="red">
                                      <p>
                                        {
                                          this.state.errors.parentpassword_con
                                            .msg
                                        }
                                      </p>
                                    </font>
                                  )}
                              </CardBody>
                            </Card>
                          </p>
                        )}
                      </Col>
                    </Row>

                    <Row className="align-items-center">
                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        {!this.state.loader && <Button
                          type="submit"
                          onClick={this.submitHandler}
                          block
                          color="success"
                        >
                          {" "}
                          <h4>  Register</h4>
                        </Button>}


                        {this.state.loader &&
                          <div align="center"><ReactLoading type="spin"
                            color="	#006400"
                            height='2%' width='10%' />
                            <br />

                            <font color="DarkGreen">  <h4>Registering...</h4></font></div>}
                      </Col>
                      <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                        <Button block onClick={this.resetForm} color="info">
                          <h4>  Reset</h4>
                        </Button>
                      </Col>
                    </Row>
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
