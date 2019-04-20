import React, { Component } from "react";
import Select from "react-select";

import moment from "moment";

import DatePicker from "react-date-picker";
import {
  Badge,
  Button,
  ButtonDropdown,
  Card,
  CardBody,
  CardFooter,
  CardHeader,
  Col,
  Collapse,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Fade,
  Form,
  FormGroup,
  FormText,
  FormFeedback,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Modal,
  ModalHeader,
  Container,
  Table,
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  CardTitle,
  CardText
} from "reactstrap";

import axios, { post } from "axios";
import { allSettled } from "q";

class ViewLeave extends Component {
  constructor(props) {
    super(props);
    this.fetchEmployees();

    this.state = {
      error: "",

      doa: new Date(
        new Date().getTime() - new Date().getTimezoneOffset() * 60000
      ),
      year: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),

      remarks: "",
      showApplyLeave: false,

      modelMessage: "",
      modalSuccess: false,
      success: false,
      pendingLeaves: [],
      existingLeaveTypes: [],
      existingEmp: [],
      showEmpLeaveDetails: false,
      leaveDetails:[]
    };

    this.getEmpAllLeaveDetails = this.getEmpAllLeaveDetails.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.getExistingLeaveTypes = this.getExistingLeaveTypes.bind(this);
    this.leaveChangeHandler = this.leaveChangeHandler.bind(this);
  }

  getExistingLeaveTypes() {
    axios
      .get("http://localhost:8001/api/getExistingLeaveTypes")
      .then(result => {
        if (result.data) {
          this.setState(
            {
              existingLeaveTypes: result.data
            },
            () => {
              console.log(
                "existingLeaveTypes: " +
                  JSON.stringify(this.state.existingLeaveTypes)
              );
              this.getEmpAllLeaveDetails();
            }
          );
        }
      });
  }

  getEmpAllLeaveDetails() {
    axios
      .post("http://localhost:8001/api/getEmpAllLeaveDetails", {
        empName: this.state.selectedEmp.label,
        year: this.state.year
      })
      .then(result => {
        if (result.data) {
          this.setState(
            {
              empAllLeaveDetails: result.data.data
            },
            () => {
              console.log(
                "empAllLeaveDetails: " +
                  JSON.stringify(this.state.empAllLeaveDetails)
              );
              var temp = [];
              for (var i = 0; i < this.state.existingLeaveTypes.length; i++) {
                var count=0;
                for (var j = 0; j < this.state.empAllLeaveDetails.length; j++) {

                  if (this.state.existingLeaveTypes[i].leaveName ===this.state.empAllLeaveDetails[j].leaveType)
                         count=count+this.state.empAllLeaveDetails[j].selectedLeaveCount; console.log("count: "+count);
                }
                temp.push({"leaveType":this.state.existingLeaveTypes[i].leaveName,"total":this.state.existingLeaveTypes[i].leaveCount,"used":count,"balance":this.state.existingLeaveTypes[i].leaveCount-count})
              }
                this.setState({leaveDetails:temp, showEmpLeaveDetails:true});

            }
          );
        }
      });
  }

  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,

      modelMessage: "",
      showApplyLeave: false,
      selectedEmp: "",
      selectedLeaveType: "",
      leavesAvailable: "",
      selectedLeaveCount: "",
      dof: "",
      dot: "",
      remarks: ""
      /*  selectedSalaryTemplate: [],
      showSalaryTemplate: false,
      paidAmount: "",
      remarks: "",
      month: "" */
    });
  }

  fetchEmployees() {
    axios.get("http://localhost:8001/api/gettingStaff").then(result => {
      console.log("Existing Staff data " + JSON.stringify(result.data));
      if (result.data) {
        var temp = [];
        for (var i = 0; i < result.data.length; i++)
          temp.push({
            label:
              result.data[i].firstname.charAt(0).toUpperCase() +
              result.data[i].firstname.slice(1) +
              " " +
              result.data[i].lastname.charAt(0).toUpperCase() +
              result.data[i].lastname.slice(1) +
              " (" +
              result.data[i].username +
              ")",
            value: result.data[i].username
          });

        this.setState({
          existingEmp: temp
        });
      }
    });
  }

  /**
   * @description - fetches unique classes from the class detail from DB
   */

  submitHandler(e) {
    e.preventDefault();
    console.log("In ApplyLeaveSubmit:" + JSON.stringify(this.state));
    var submit = true;

    this.setState({
      monthError: "",
      doaError: "",
      error: "",
      success: false,
      modalSuccess: false,
      leaveTypeError: "",
      yearError: "",
      dateError: ""
    });

    if (!this.state.year || this.state.year.length != 9) {
      this.setState({ yearError: "Please Enter Year correctly (Eg. 2018-19)" });
      submit = false;
    }

    var years = this.state.year.split("-");
    if (parseInt(years[0]) !== parseInt(years[1]) - 1) {
      this.setState({
        yearError:
          "Year Format is not correct! It should be in format like- 2018-2019"
      });
      submit = false;
    }

    if (!this.state.selectedLeaveType) {
      this.setState({ leaveTypeError: "Please Select Leave Type" });
      submit = false;
    }
    if (!this.state.doa) {
      this.setState({ doaError: "Please Select Date of Apply" });
      submit = false;
    }

    if (!this.state.dof) {
      this.setState({ dateError: "Please Select From Date" });
      submit = false;
    }

    if (!this.state.dot) {
      this.setState({ dateError: "Please Select To Date" });
      submit = false;
    }

    if (!this.state.selectedEmp.value) {
      this.setState({ empError: "Please Select Employee" });
      submit = false;
    }

    if (this.state.leavesAvailable === 0) {
      this.setState({ error: "No Leaves Available!" });
      submit = false;
    }

    if (submit) {
      axios
        .post("http://localhost:8001/api/applyLeave", {
          empName: this.state.selectedEmp.label,
          leaveType: this.state.selectedLeaveType,
          year: this.state.year,
          doa: this.state.doa,
          remarks: this.state.remarks,
          dof: this.state.dof,
          dot: this.state.dot,
          selectedLeaveCount: this.state.selectedLeaveCount
        })
        .then(result => {
          console.log("result.data ApplyLeave " + JSON.stringify(result.data));

          if (result.data.msg === "Success")
            this.setState({
              success: true,
              modalSuccess: true,
              modelMessage:
                this.state.selectedLeaveCount +
                " Leaves applied for " +
                this.state.selectedEmp.label
            });
          else if (result.data.error) {
            return this.setState({ error: result.data.error });
          }
        });
    }
  }

  leaveChangeHandler(e) {
    if (e) {
      console.log("In leave change " + e.target.value);

      this.setState(
        {
          error: "",
          showApplyLeave: false,
          selectedLeaveType: e.target.value,
          yearError: ""
        },
        () => {
          var years = this.state.year.split("-");

          if (parseInt(years[0]) !== parseInt(years[1]) - 1)
            return this.setState({
              yearError:
                "Year Format is not correct! It should be in format like- 2018-2019"
            });
          axios
            .post("http://localhost:8001/api/getAvailableLeaveCount", {
              leaveType: this.state.selectedLeaveType,
              year: this.state.year,
              empName: this.state.selectedEmp.label
            })
            .then(result => {
              console.log(
                "getAvailableLeaveCount.data " +
                  JSON.stringify(result.data.data)
              );

              if (result.data.error) {
                return this.setState({ error: result.data.error.message });
              }
              var totalAppliedLeaveCount = 0;
              for (var i = 0; i < result.data.data.length; i++)
                totalAppliedLeaveCount =
                  totalAppliedLeaveCount +
                  result.data.data[i].selectedLeaveCount;

              for (var i = 0; i < this.state.existingLeaveTypes.length; i++)
                if (
                  this.state.existingLeaveTypes[i].leaveName ===
                  this.state.selectedLeaveType
                ) {
                  if (
                    this.state.existingLeaveTypes[i].leaveCount -
                      totalAppliedLeaveCount >=
                    0
                  )
                    this.setState({
                      leavesAvailable:
                        this.state.existingLeaveTypes[i].leaveCount -
                        totalAppliedLeaveCount
                    });
                  else this.setState({ leavesAvailable: 0 });
                  if (this.state.leavesAvailable > 0)
                    this.setState({ showApplyLeave: true });
                  else
                    this.setState({
                      error:
                        "No " +
                        this.state.selectedLeaveType +
                        " Leaves Avalable!"
                    });
                }
            });
        }
      );
    }
  }
  /**
   * @description Called when the role(s) are selected. To update role Array
   * @param {*} e
   */

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="12">
              <Card>
                {" "}
                <CardBody>
                  <h1>Leave Management</h1>
                  {this.state.success && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={"modal-success " + this.props.className}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                        {this.state.modelMessage}
                      </ModalHeader>
                    </Modal>
                  )}

                  <Card className="mx-1">
                    <CardBody className="p-1">
                      <h3 align="center"> View Leave Details</h3>
                      <br />
                      <InputGroupAddon addonType="prepend">
                        <InputGroupText>
                          <b> Select/Search Employee</b>
                        </InputGroupText>
                      </InputGroupAddon>

                      <Select
                        id="staffSelect"
                        name="staffSelect"
                        placeholder="Select Staff/Employee or Type to search"
                        options={this.state.existingEmp}
                        closeMenuOnSelect={true}
                        value={this.state.selectedEmp}
                        isClearable={true}
                        //menuIsOpen ={this.state.studentOpen}
                        isSearchable={true}
                        onChange={selected => {
                          this.setState(
                            {
                              selectedEmp: selected,
                              showApplyLeave: false,
                              selectedLeaveType: "",
                              leavesAvailable: "",
                              error: ""
                            },
                            () => {
                              this.getExistingLeaveTypes();
                            }
                          );
                        }}
                      />
                      <br />
                      <InputGroup className="mb-3">
                        <InputGroupAddon addonType="prepend">
                          <InputGroupText>
                            <b>Year</b>
                          </InputGroupText>
                        </InputGroupAddon>
                        <Input
                          type="text"
                          size="lg"
                          name="year"
                          id="year"
                          value={this.state.year}
                          disabled
                        />
                      </InputGroup>

                      {this.state.showEmpLeaveDetails && (
                        <p>
                          <h4 align="center"> Leave Balance Details</h4>

                          <br />
                          <Table bordered hover>
                            <thead>
                              <tr style={{ backgroundColor: "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Leave Type </h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Total Count </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Used Count</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Balance</h4>
                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.leaveDetails.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5>
                                      {" "}
                                      {this.state.leaveDetails[idx].leaveType
                                        .charAt(0)
                                        .toUpperCase() +
                                        this.state.leaveDetails[idx].leaveType.slice(1)}
                                    </h5>
                                  </td>

                                  <td align="center">
                                    <h5>
                                      {" "}
                                      {this.state.leaveDetails[idx].total}
                                    </h5>
                                  </td>

                                  <td align="center">
                                    <h5>
                                      {" "}
                                      {
                                        this.state.leaveDetails[idx].used
                                      }
                                    </h5>
                                  </td>

                                  <td align="center">
                                    <h5>
                                      {" "}
                                      {this.state.leaveDetails[idx].balance}
                                    </h5>
                                  </td>



                                </tr>
                              ))}
                            </tbody>
                          </Table>
                        </p>
                      )}

                      {this.state.error && (
                        <font color="red">
                          {" "}
                          <p>{JSON.stringify(this.state.error)}</p>
                        </font>
                      )}
                    </CardBody>
                  </Card>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default ViewLeave;
