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

    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);


  }


  getEmpAllLeaveDetails() {

    this.setState({error:"", showApplyLeave:false,showEmpLeaveDetails:false})
    axios
      .post("http://localhost:8001/api/getEmpAllLeaveDetails", {
        empName: this.state.selectedEmp.label,
        year: this.state.year
      })
      .then(result => {
        console.log("Result Data: " + JSON.stringify(result.data));
        if (result.data) {
          this.setState(
            {
              empAllLeaveDetails: result.data.empLeaveDetails,

            },
            () => {
              console.log(
                "empAllLeaveDetails: " +
                  JSON.stringify(this.state.empAllLeaveDetails)
              );
              var temp1 = [], temp2=[];

              if(this.state.empAllLeaveDetails)
{
                for (var j = 0; j < this.state.empAllLeaveDetails.leaveDetails.length; j++) {


                temp1.push({"leaveType":this.state.empAllLeaveDetails.leaveDetails[j].leaveType,"total":this.state.empAllLeaveDetails.leaveDetails[j].total,"used":this.state.empAllLeaveDetails.leaveDetails[j].used,"balance":this.state.empAllLeaveDetails.leaveDetails[j].remaining})
                }
for(var i=0;i<result.data.leaveHistory.length;i++)
{

  temp2.push({"leaveType":result.data.leaveHistory[i].leaveType,"appliedOn":result.data.leaveHistory[i].doa.substring(0,10),"period":result.data.leaveHistory[i].dof.substring(0,10)+"   To   "+result.data.leaveHistory[i].dot.substring(0,10)+"   ("+result.data.leaveHistory[i].selectedLeaveCount+" days)","status":result.data.leaveHistory[i].status});


}




                this.setState({leaveDetails:temp1, leaveHistory:temp2, showEmpLeaveDetails:true});

            }
          else
          {
            this.setState({error:"No Leaves Assigned!"});
          }
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

                            },()=>{this.getEmpAllLeaveDetails();}
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

                          <br />
                          <h4 align="center">Leaves History</h4>
                          <h6 >Showing upto Last 10 records  </h6>

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
        <h4>Applied On</h4>
      </th>
      <th className="text-center">
        {" "}
        <h4>Leave Period</h4>
      </th>

      <th className="text-center">
        {" "}
        <h4>Status</h4>
      </th>
    </tr>
  </thead>
  <tbody>
    {this.state.leaveHistory.map((item, idx) => (
      <tr id="addr0" key={idx}>
        <td align="center">
          <h5>{idx + 1}</h5>
        </td>
        <td align="center">
          <h5>
            {" "}
            {this.state.leaveHistory[idx].leaveType
              .charAt(0)
              .toUpperCase() +
              this.state.leaveHistory[idx].leaveType.slice(1)}
          </h5>
        </td>
        <td align="center">
          <h5>
            {" "}
            {this.state.leaveHistory[idx].appliedOn}
          </h5>
        </td>

        <td align="center">
          <h5>
            {" "}
            {this.state.leaveHistory[idx].period}
          </h5>
        </td>

        <td align="center">
          <h5>
            {" "}
            {
              this.state.leaveHistory[idx].status
            }
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
