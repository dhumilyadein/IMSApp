import React, { Component } from "react";
import "bootstrap/dist/css/bootstrap.css";
import ReactPhoneInput from "react-phone-input-2";
import DatePicker from 'react-date-picker';
import classnames from 'classnames';
import Select from 'react-select';

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Modal,
  ModalHeader,
  FormGroup,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane

} from "reactstrap";
import axios from "axios";

var imageContext = require.context('../../../photoTemp', true);

const whiteTextFieldStyle = {
  background: "white"
}

class UserDetails extends Component {

  constructor(props) {

    super(props);

    this.state = {

      class: "",
      section: "",

      classes: [],
      classDetails: {},
      sectionArray: [],
      classDetailsUpdatedFlag: false,
      studentsDataArray: [],
      previousClass: null,
      previousSection: null,

      sectionView: false,
      studentsView: false,

      admintype: "Office Admin",
      username: "",
      email: "",
      firstname: "",
      lastname: "",
      password: "",
      password_con: "",
      parentpassword_con: "",
      role: ["student"],
      userdata: null,
      studentRegSuccess: false,

      empRegSuccess: false,
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
      parentfirstname: "",
      parentlastname: "",
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
      feeTemplatesFromDBLabel: [],
      selectedFeeTemplate: [],
      selectedFeeTemplateLabel: [],

      corruptphoto: false,
      photoname: "",
      phone: "",
      parentaddresscheck: false,
      roleerror: false,
      photoerror: null,

      // To make tab 1 on focus
      activeTab: 'Student',

      // For changing fields to non editable when screen mode is "display"
      editMode: "disabled", // {"disable", ""}

      // Data fetched from users table on the username
      fetchedUserDetails: [{}],

      // Data fetched from students table on the username
      fetchedStudentsDetails: [],

      // Data fetched from Parents table on the parentusername
      fetchedParentDetail: {},

      // For hiding fields which are meant to be displayed only in "edit" mode, fields like password, confirm password, roles, etc.
      screenmode: "display", // {"dispaly", "edit"}

      // UserDetailsUpdate Modal will be displayed if this flag is true
      userDetailsUpdatedFlag: false,

      // For the Gender check box - default value false means both will be unselected by default. 
      // Depending on the gender from DB 1 of these 2 will be set to true
      maleGender: false,
      femaleGender: false,

    };

    this.changeHandler = this.changeHandler.bind(this);
    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);
    this.toggle = this.toggle.bind(this);
    this.fetchUserDataOnPageLoad = this.fetchUserDataOnPageLoad.bind(this);
    this.mapStudentResponseToState = this.mapStudentResponseToState.bind(this);
    this.switchToEditMode = this.switchToEditMode.bind(this);
    this.updateUserDetails = this.updateUserDetails.bind(this);
    this.copyAddress = this.copyAddress.bind(this);
    this.switchToDisplayMode = this.switchToDisplayMode.bind(this);
    this.getExistingTemplates = this.getExistingTemplates.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.fetchClassDetails = this.fetchClassDetails.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.setInitialClassSections = this.setInitialClassSections.bind(this);
    this.updateClassDetails = this.updateClassDetails.bind(this);

    // Fetching data from Mongo on page load
    this.fetchUserDataOnPageLoad();

  }

  getExistingTemplates() {

    axios
      .get("http://localhost:8001/api/existingTemplates")
      .then(result => {

        // console.log("Existing Fee Templates: " + JSON.stringify(result.data));
        // console.log("No of templates " + result.data.length);

        if (result.data) {
          var feeTemplatesFromDBLabelTemp = [];
          var usersFeeTemplatesLabelTemp = [];
          for (var i = 0; i < result.data.length; i++) {
            feeTemplatesFromDBLabelTemp.push({
              "value": result.data[i].templateName,
              "label": result.data[i].templateName.charAt(0).toUpperCase() + result.data[i].templateName.slice(1) + " (" + (result.data[i].templateType.toLowerCase()) + ")"
            });

            // console.log("this.state.selectedFeeTemplate - " + this.state.selectedFeeTemplate);
            this.state.selectedFeeTemplate.forEach(function (element) {

              if (element === result.data[i].templateName) {

                usersFeeTemplatesLabelTemp.push({
                  "value": result.data[i].templateName,
                  "label": result.data[i].templateName.charAt(0).toUpperCase() + result.data[i].templateName.slice(1) + " (" + (result.data[i].templateType.toLowerCase()) + ")"
                });
              }

            });
          }
          // console.log("feeTemplatesFromDBLabelTemp - " + JSON.stringify(feeTemplatesFromDBLabelTemp)
          // + " usersFeeTemplatesLabelTemp - " + JSON.stringify(usersFeeTemplatesLabelTemp));

          this.setState({ feeTemplatesFromDBLabel: feeTemplatesFromDBLabelTemp });
          this.setState({ selectedFeeTemplateLabel: usersFeeTemplatesLabelTemp });
        }
      });
  }

  /**
   * For tab toggle
   */
  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  }

  async fetchUserDataOnPageLoad() {

    // console.log("fetchUserDataOnPageLoad ENTER: " + this.props.match.params.username);

    var searchUserRequest = {
      "find": this.props.match.params.username,
      "using": "username",
      "role": "anyRole",
      "searchCriteria": "equalsSearchCriteria"
    }
    // console.log("Submit Request - " + JSON.stringify(searchUserRequest));

    await axios.post("http://localhost:8001/api/searchUsers", searchUserRequest).then(res => {

      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      } else {

        this.setState({
          fetchedUserDetails: res.data
        });
      }
    });

    if (this.state.fetchedUserDetails && this.state.fetchedUserDetails[0]
      && this.state.fetchedUserDetails[0].role && this.state.fetchedUserDetails[0].role.includes("student")) {

      var searchStudentsRequest = {
        "find": this.props.match.params.username,
        "using": "username",
        "searchCriteria": "equalsSearchCriteria"
      }

      await axios.post("http://localhost:8001/api/searchStudents", searchStudentsRequest).then(res => {

        if (res.data.errors) {
          return this.setState({ errors: res.data.errors });
        } else {

          this.setState({
            fetchedStudentsDetails: res.data
          });
        }
        this.mapStudentResponseToState();
      });


      // console.log("this.state.fetchedStudentsDetails[0].parentusername - " + this.state.fetchedStudentsDetails[0].parentusername);
      var searchParentRequest = {
        "find": this.state.parentusername,
        "using": "parentusername",
        "searchCriteria": "equalsSearchCriteria"
      }

      await axios.post("http://localhost:8001/api/searchParent", searchParentRequest).then(pRes => {

        if (pRes.data.errors) {
          return this.setState({ errors: pRes.data.errors });
        } else {

          // console.log("Parent data pRes.data - " + JSON.stringify(pRes.data));
          this.setState({
            fetchedParentDetail: pRes.data
          });
        }
        this.mapParentResponseToState();
      });

    }

    // Fetching fee templates on page load
    await this.getExistingTemplates();

    // Fetching class details on page load for class drop down
    await this.fetchClassDetails();
  }

  mapStudentResponseToState() {

    // console.log("Mapping the students response with the state to show details on the page");

    var studentData = this.state.fetchedStudentsDetails[0];

    this.setState({
      username: studentData.username,
      email: studentData.email,
      firstname: studentData.firstname,
      lastname: studentData.lastname,
      //password: studentData.password,
      parentfirstname: studentData.parentfirstname,
      parentlastname: studentData.parentlastname,
      parentusername: studentData.parentusername,
      parentemail: studentData.parentemail,
      parentphone1: studentData.parentphone1,
      parentphone2: studentData.parentphone2,
      parentpostalcode: studentData.parentpostalcode,
      address: studentData.address,
      city: studentData.city,
      postalcode: studentData.postalcode,
      state: studentData.state,
      admissionno: studentData.admissionno,
      rollno: studentData.rollno,
      doj: new Date(studentData.doj),
      dob: new Date(studentData.dob),
      gender: studentData.gender,
      religion: studentData.religion,
      nationality: studentData.nationality,
      bloodgroup: studentData.bloodgroup,
      category: studentData.category,
      phone: studentData.phone,
      photo: studentData.photo,
      class: studentData.class,
      section: studentData.section,
      selectedFeeTemplate: studentData.feeTemplate
    });

    if (studentData.gender && studentData.gender === "Male") {
      this.setState({
        maleGender: true
      });
    } else {
      this.setState({
        femaleGender: true
      });
    }

    console.log("student details username - " + studentData.username + " fee template - " + this.state.selectedFeeTemplate + " password - "
      + studentData.password + " " + this.state.firstname + " "
      + this.state.lastname + " dob - " + this.state.dob + " " + this.state.doj + " " + this.state.parentusername
      + " " + this.state.gender + " " + this.state.parentfirstname + " " + this.state.address + " " + this.state.city
      + " CLASS - " + this.state.class + " SECTION - " + this.state.section);
  }

  mapParentResponseToState() {

    // console.log("Mapping the Parent response with the state to show details on the page");

    var parentData = this.state.fetchedParentDetail;

    this.setState({

      parentfirstname: parentData.parentfirstname,
      parentlastname: parentData.parentlastname,
      relation: parentData.relation,
      occupation: parentData.occupation,
      parentemail: parentData.parentemail,
      parentphone1: parentData.parentphone1,
      parentphone2: parentData.parentphone2,
      parentaddress: parentData.parentaddress,
      parentcity: parentData.parentcity,
      parentpostalcode: parentData.parentpostalcode,
      parentstate: parentData.parentstate,
      parentusername: parentData.parentusername
    });

    // console.log("Parent details - " + parentData.parentusername);
  }

  switchToEditMode() {

    this.setState({
      editMode: "",
    });
    this.setState({
      screenmode: "edit",
    });

  }

  switchToDisplayMode() {

    this.setState({
      editMode: "disabled",
    });
    this.setState({
      screenmode: "display",
    });
  }

  async updateUserDetails() {

    var updateUserDetailsRequest = this.state;

    // console.log("UserDetails - updateUserDetails - updateUserDetailsRequest - "
    //   + JSON.stringify(updateUserDetailsRequest));

    await axios.post("http://localhost:8001/api/updateUserDetails", updateUserDetailsRequest).then(res => {

      if (res.data.errors) {
        console.log("UserDetails.js updateUserDetails - Error in DB Operation")
        return this.setState({ errors: res.data.errors });
      } else {

        console.log('Updated user details in the Database');
        this.setState({
          userDetailsUpdatedFlag: true
        });
      }
    });

    await this.updateClassDetails();

    //Switching mode after updating the details
    this.switchToDisplayMode();

  }

  toggleModalSuccess() {
    this.setState({
      userDetailsUpdatedFlag: !this.state.userDetailsUpdatedFlag
    });
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

    // console.log('maleGender ' + this.state.maleGender + ' femaleGender ' + this.state.femaleGender + ' current value - ' + e.target.value);

    if (e.target.value === "Male" && this.state.femaleGender) {
      this.setState({ maleGender: true });
      this.setState({ femaleGender: false });
    } else if (e.target.value === "Female" && this.state.maleGender) {
      this.setState({ femaleGender: true });
      this.setState({ maleGender: false });
    }
  }

  classChangeHandler(e) {

    var selectedClass = e.currentTarget.value;
    // console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + selectedClass);
    
    var previousClass = this.state.class;
    this.setState({ previousClass: previousClass });
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

    // console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp );

    // Switching view to section view
    this.setState({ sectionView: true });
  }

  sectionChangeHandler(e) {

    var previousSection = this.state.section;
    this.setState({ previousSection : previousSection });
      this.setState({ section: e.target.value });
  }

  // Fetching section of the class initially populated for the user
  setInitialClassSections() {

    var selectedClass = this.state.class;

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

    // console.log("Initiallly Selected class - " + selectedClass + " Sections - " + sectionArrayTemp );
  }

  fetchClassDetails() {

    axios.get("http://localhost:8001/api/fetchAllClassDetails").then(cRes => {

      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ classDetails: cRes.data });

        // console.log('ClassDetails - fetchClassDetails - All class details - ' + JSON.stringify(this.state.classDetails));

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

      // console.log("element.class - " + element.class);
      classArray.push(element.class);
    });
    // console.log("classArray - " + classArray);
    var uniqueItems = Array.from(new Set(classArray));

    this.setState({ classes: uniqueItems });

    this.setInitialClassSections();
    // console.log("Unique classes - " + this.state.classes);
  }

  /**
   * Auto copy parent address if the 'Address is same' check box slelected
   **/
  copyAddress(e) {
    if (e.target.checked === true) {
      // console.log("address check true: " + e.target.checked);
      this.setState({
        parentaddress: this.state.address,
        parentcity: this.state.city,
        parentpostalcode: this.state.postalcode,
        parentstate: this.state.state,
        parentaddresscheck: true
      });
    } else if (e.target.checked === false) {
      // console.log("address check false: " + e.target.checked);
      this.setState({
        parentaddress: this.state.parentaddress,
        parentcity: this.state.parentcity,
        parentpostalcode: this.state.parentpostalcode,
        parentstate: this.state.parentstate,
        parentaddresscheck: false
      });
    }
  }

  async updateClassDetails() {

    var updateClassDetailsRequest = {
      "class": this.state.class,
      "section": this.state.section,
      "studentsData": {
        "rollno": this.state.rollno,
        "username": this.state.username,
        "firstname": this.state.firstname,
        "lastname": this.state.lastname,
        "email": this.state.email,
        "parentemail": this.state.parentemail
      },
      "previousClass" : this.state.previousClass,
      "previousSection" : this.state.previousSection
    }

    // console.log("UserDetails - updateClassDetails - updateClassDetailsRequest - "
    //   + JSON.stringify(updateClassDetailsRequest));

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

  removeUserFromPreviousClass () {

    
  }

  render() {

    let imgSource = null;
    if (this.state.username) {
      imgSource = imageContext(`./${this.state.username}.jpg`);
    }

    return (
      <div style={{ width: "1000px" }}>

        <Container style={{ width: "2500px" }}>

          {this.state.userDetailsUpdatedFlag && (
            <Modal
              isOpen={this.state.userDetailsUpdatedFlag}
              className={"modal-success " + this.props.className}
              toggle={this.toggleModalSuccess}
            >
              <ModalHeader
                toggle={this.toggleModalSuccess}
              >
                {"User ("}{this.state.username}{") details updated successfully!"}
              </ModalHeader>
            </Modal>
          )}

          {this.state.screenmode && this.state.screenmode === 'display' && (
            <Row lg="4" style={{ width: "2500px" }}>
              <Col md="7">

                <Card className="mx-4">
                  <CardBody className="p-2">

                    <Button
                      type="submit"
                      onClick={this.switchToEditMode}
                      block
                      color="success"
                    >
                      {" "}
                      Edit
                        </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}

          <Row lg="4" style={{ width: "2500px" }}>
            <Col xs="12" md="7" className="mb-4">

              <Nav tabs>
                {this.state.fetchedUserDetails && this.state.fetchedUserDetails[0] && this.state.fetchedUserDetails[0].role
                  && this.state.fetchedUserDetails[0].role.includes("student") && (
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === 'Student' })}
                        onClick={() => { this.toggle('Student'); }}
                      >
                        Student
                </NavLink>
                    </NavItem>
                  )}
                {this.state.fetchedUserDetails && this.state.fetchedUserDetails[0] && this.state.fetchedUserDetails[0].role
                  && this.state.fetchedUserDetails[0].role.includes("admin") && (
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === 'Admin' })}
                        onClick={() => { this.toggle('Admin'); }}
                      >
                        Admin
                </NavLink>
                    </NavItem>
                  )}
                {this.state.fetchedUserDetails && this.state.fetchedUserDetails[0] && this.state.fetchedUserDetails[0].role
                  && this.state.fetchedUserDetails[0].role.includes("teacher") && (
                    <NavItem>
                      <NavLink
                        className={classnames({ active: this.state.activeTab === 'Teacher' })}
                        onClick={() => { this.toggle('Teacher'); }}
                      >
                        Teacher
                </NavLink>
                    </NavItem>
                  )}
              </Nav>

              <TabContent activeTab={this.state.activeTab}>

                {this.state.fetchedUserDetails && this.state.fetchedUserDetails[0] && this.state.fetchedUserDetails[0].role
                  && this.state.fetchedUserDetails[0].role.includes("student") && (
                    <TabPane tabId="Student">

                      <Card className="mx-4">
                        <CardBody className="p-2">
                          <Form>

                            <Row lg="2">
                              <Col>
                                <Card className="mx-1">
                                  <CardBody className="p-2">
                                    <h5>Basic Details</h5>
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
                                        //value={this.props.match.params.username}
                                        autoComplete="firstname"
                                        onChange={this.changeHandler}
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
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
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
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
                                          Date of Birth
                                </InputGroupText>
                                      </InputGroupAddon>

                                      <DatePicker

                                        name="dob"
                                        id="dob"
                                        value={this.state.dob}
                                        onChange={date=>{this.setState({dob:date})}}
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
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
                                            disabled={this.state.editMode}
                                            checked={this.state.maleGender}
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
                                            disabled={this.state.editMode}
                                            checked={this.state.femaleGender}
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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
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
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
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
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
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
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
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
                                          disabled={this.state.editMode}
                                          style={whiteTextFieldStyle}
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
                                      && <font color="red">  <p>Please select JPEG/PNG/JPG file format </p></font>
                                    }


                                  </CardBody>
                                </Card>

                                <Card className="mx-1">
                                  <CardBody className="p-2">
                                    <h5>Contact Details</h5>

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
                                            disabled={this.state.editMode}
                                            style={whiteTextFieldStyle}
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
                                                disabled={this.state.editMode}
                                                style={whiteTextFieldStyle}
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
                                                disabled={this.state.editMode}
                                                style={whiteTextFieldStyle}
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
                                            disabled={this.state.editMode}
                                            style={whiteTextFieldStyle}
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
                                            // console.log("phone value: " + phone);
                                            this.setState({ phone });
                                          }}
                                          disabled={this.state.editMode}
                                          style={whiteTextFieldStyle}
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

                                <Card className="mb-3">
                                  <CardBody className="p-2">
                                    {imgSource && (
                                      <img id="displayImage" src={imgSource} />
                                    )}
                                    {/* <img id="displayImage1" src={require('../../../photoTemp/kapil.jpg')} widht="200px" height="200px"/> */}

                                  </CardBody>
                                </Card>

                                <Card className="mx-1">
                                  <CardBody className="p-2">
                                    <h5>Official Details</h5>

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
                                              type="text"
                                              name="admissionno"
                                              id="admissionno"
                                              autoComplete="admissionno"
                                              onChange={this.changeHandler}
                                              value={this.state.admissionno}
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
                                            >
                                              <option value="">Select</option>
                                      {this.state.classes.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                            </Input>
                                          </InputGroup>
                                          {this.state.errors && this.state.errors.class && (
                                            <font color="red">
                                              {" "}
                                              <p>{this.state.errors.class.msg}</p>
                                            </font>
                                          )}

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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
                                            >
                                              <option value="">Select</option>
                                        {this.state.sectionArray.map(element => {
                                          return (<option key={element} value={element}>{element}</option>);
                                        }
                                        )}

                                            </Input>
                                          </InputGroup>
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
                                                options={this.state.feeTemplatesFromDBLabel}
                                                closeMenuOnSelect={false}
                                                value={this.state.selectedFeeTemplateLabel}

                                                isSearchable={true}
                                                isDisabled={this.state.editMode}
                                              onChange={selected => {
                                                
                                                var temp = [];

                                                for (var i = 0; i < selected.length; i++) { temp.push(selected[i].value) }
                                                this.setState({
                                                  selectedFeeTemplate: temp,
                                                  selectedFeeTemplateLabel: selected
                                                }, () => {
                                                  // console.log("selectedFeeTemplate - " + JSON.stringify(this.state.selectedFeeTemplate) 
                                                  // + "selectedFeeTemplateLabel - " + JSON.stringify(this.state.selectedFeeTemplateLabel));
                                                })
                                              }
                                              } 
                                              />
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
                                    <InputGroup className="mb-3">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "120px" }}>
                                          Date of Joining
                                </InputGroupText>
                                      </InputGroupAddon>

                                      <DatePicker

                                        name="doj"
                                        id="doj"
                                        value={this.state.doj}
                                        onChange={date=>{this.setState({doj:date})}}
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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
                                                  disabled={this.state.editMode}
                                                  style={whiteTextFieldStyle}
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
                                                  disabled={this.state.editMode}
                                                  style={whiteTextFieldStyle}
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
                                                disabled={this.state.editMode}
                                                style={whiteTextFieldStyle}
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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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
                                    <h5>Login Details</h5>
                                    <InputGroup className="mb-3">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "120px" }}>
                                          {/* <i className="icon-user" /> */}
                                          Username
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
                                        disabled="disabled"
                                        style={whiteTextFieldStyle}
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
                                        {/* <InputGroupText>@</InputGroupText> */}
                                        <InputGroupText style={{ width: "120px" }}>Email</InputGroupText>
                                      </InputGroupAddon>
                                      <Input
                                        type="text"
                                        name="email"
                                        id="email"
                                        value={this.state.email}
                                        placeholder="Email"
                                        autoComplete="email"
                                        onChange={this.changeHandler}
                                        disabled={this.state.editMode}
                                        style={whiteTextFieldStyle}
                                      />
                                    </InputGroup>

                                    {this.state.errors && this.state.errors.email && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.email.msg}</p>
                                      </font>
                                    )}

                                    {/* Hiding the field if screenmode is "display" */}
                                    {(this.state.screenmode !== "display") && (
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
                                          disabled={this.state.editMode}
                                          style={whiteTextFieldStyle}
                                        />
                                      </InputGroup>
                                    )}

                                    {this.state.errors && this.state.errors.password && (
                                      <font color="red">
                                        {" "}
                                        <p>{this.state.errors.password.msg}</p>
                                      </font>
                                    )}

                                    {/* Hiding the field if screenmode is "display" */}
                                    {(this.state.screenmode !== "display") && (

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
                                          disabled={this.state.editMode}
                                          style={whiteTextFieldStyle}
                                        />
                                      </InputGroup>

                                    )}

                                    {this.state.errors &&
                                      this.state.errors.password_con && (
                                        <font color="red">
                                          <p>{this.state.errors.password_con.msg}</p>
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
                                        <h5>Parent Details</h5>
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
                                            disabled={this.state.editMode}
                                            style={whiteTextFieldStyle}
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
                                            disabled={this.state.editMode}
                                            style={whiteTextFieldStyle}
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
                                            disabled={this.state.editMode}
                                            style={whiteTextFieldStyle}
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
                                            disabled={this.state.editMode}
                                            style={whiteTextFieldStyle}
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
                                            disabled={this.state.editMode}
                                            style={whiteTextFieldStyle}
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
                                                // console.log(
                                                //   "parentphone1 value: " + parentphone1
                                                // );
                                                this.setState({ parentphone1 });
                                              }}
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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
                                                // console.log(
                                                //   "parentphone2 value: " + parentphone2
                                                // );
                                                this.setState({ parentphone2 });
                                              }}
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
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

                                          {/* Hiding the field if screenmode is "display" */}
                                          {(this.state.screenmode !== "display") && (

                                            <FormGroup check inline>
                                              <Input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="parentaddresscheck"
                                                style={{ height: "35px", width: "25px" }}
                                                name="parentaddresscheck"
                                                checked={this.state.parentaddresscheck}
                                                onChange={this.copyAddress}
                                                disabled={this.state.editMode}
                                                style={whiteTextFieldStyle}
                                              />
                                              <Label
                                                className="form-check-label"
                                                check
                                                htmlFor="inline-checkbox1"
                                              >
                                                Address same as Student Address
                                    </Label>
                                            </FormGroup>
                                          )}

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
                                                disabled={this.state.editMode}
                                                style={whiteTextFieldStyle}
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
                                                    disabled={this.state.editMode}
                                                    style={whiteTextFieldStyle}
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
                                                    disabled={this.state.editMode}
                                                    style={whiteTextFieldStyle}
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
                                                disabled={this.state.editMode}
                                                style={whiteTextFieldStyle}
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
                                        <h5>Parent Login Details</h5>
                                        <InputGroup className="mb-3">
                                          <InputGroupAddon addonType="prepend">
                                            <InputGroupText style={{ width: "120px" }}>
                                              {/* <i className="icon-user" /> */}
                                              Username
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
                                            disabled="disabled"
                                            style={whiteTextFieldStyle}
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

                                        {/* Hiding the field if screenmode is "display" */}
                                        {(this.state.screenmode !== "display") && (

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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
                                            />
                                          </InputGroup>
                                        )}

                                        {this.state.errors &&
                                          this.state.errors.parentpassword && (
                                            <font color="red">
                                              {" "}
                                              <p>
                                                {this.state.errors.parentpassword.msg}
                                              </p>
                                            </font>
                                          )}

                                        {/* Hiding the field if screenmode is "display" */}
                                        {(this.state.screenmode !== "display") && (

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
                                              disabled={this.state.editMode}
                                              style={whiteTextFieldStyle}
                                            />
                                          </InputGroup>
                                        )}

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

                          </Form>
                        </CardBody>
                      </Card>

                    </TabPane>
                  )}

                {this.state.fetchedUserDetails && this.state.fetchedUserDetails[0] && this.state.fetchedUserDetails[0].role
                  && this.state.fetchedUserDetails[0].role.includes("admin") && (
                    <TabPane tabId="Admin">
                      2. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
              </TabPane>
                  )}

                {this.state.fetchedUserDetails && this.state.fetchedUserDetails[0] && this.state.fetchedUserDetails[0].role
                  && this.state.fetchedUserDetails[0].role.includes("teacher") && (
                    <TabPane tabId="Teacher">
                      3. Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed do eiusmod tempor incididunt ut labore
                      et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco laboris nisi ut
                      aliquip ex ea commodo consequat. Duis aute irure dolor in reprehenderit in voluptate velit esse cillum
                      dolore eu fugiat nulla pariatur. Excepteur sint occaecat cupidatat non proident, sunt in culpa qui
                      officia deserunt mollit anim id est laborum.
              </TabPane>
                  )}
              </TabContent>

            </Col>
          </Row>

          {this.state.screenmode && this.state.screenmode === 'edit' && (
            <Row lg="4" style={{ width: "2500px" }}>
              <Col md="7">

                <Card className="mx-4">
                  <CardBody className="p-2">

                    <Button
                      type="submit"
                      onClick={this.updateUserDetails}
                      block
                      color="success"
                    >
                      {" "}
                      Update Details
                        </Button>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          )}
        </Container>
      </div>
    );
  }
}

export default UserDetails;
