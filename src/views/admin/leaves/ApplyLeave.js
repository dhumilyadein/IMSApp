import React, { Component } from 'react';
import Select from 'react-select';

import moment from 'moment';

import DatePicker from 'react-date-picker';
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
  TabContent, TabPane, Nav, NavItem, NavLink, CardTitle, CardText
} from 'reactstrap';

import axios, { post } from "axios";
import { allSettled } from 'q';


class ApplyLeave extends Component {

  constructor(props) {
    super(props);
    this.fetchEmployees();

    this.state = {

      error: "",

      doa:  new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
      year: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),

      remarks: "",
    showApplyLeave:false,

      modelMessage: "",
      modalSuccess: false,
      success: false,

     existingLeaveTypes:[],
     existingEmp:[]

    };


    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.getExistingLeaveTypes = this.getExistingLeaveTypes.bind(this);
this.leaveChangeHandler=this.leaveChangeHandler.bind(this);
  }


  getExistingLeaveTypes() {

    axios
      .get("http://localhost:8001/api/getExistingLeaveTypes")
      .then(result => {

        if (result.data) {
          this.setState({
            existingLeaveTypes: result.data
          },()=>{ console.log("Existing RESULT.data " + JSON.stringify(this.state.existingLeaveTypes));});
        }
      });

      axios
      .post("http://localhost:8001/api/getEmployeeLeaveDetails",{"empName": this.state.selectedEmp.label.toLowerCase()})
      .then(result => {

        if (result.data) {
          this.setState({
            employeeLeaveDetails: result.data
          },()=>{ console.log("employeeLeaveDetails RESULT.data " + JSON.stringify(this.state.employeeLeaveDetails));});
        }
      });

  }

  toggleSuccess() {

    this.setState({
      modalSuccess: !this.state.modalSuccess,

      modelMessage: "",
showApplyLeave:false,
selectedEmp:"",
selectedLeaveType:"",
leavesAvailable:"",
selectedLeaveCount:"",
dof:"",
dot:"",
remarks:""


    });

  }


  fetchEmployees()
    {
      axios
      .get("http://localhost:8001/api/gettingStaff")
      .then(result => {
        console.log("Existing Staff data " + JSON.stringify(result.data));
        if (result.data) {
 var temp=[];
  for(var i=0;i<result.data.length;i++)
   temp.push({"label":result.data[i].firstname.charAt(0).toUpperCase()+result.data[i].firstname.slice(1)+
   " "+result.data[i].lastname.charAt(0).toUpperCase()+result.data[i].lastname.slice(1)+" ("+result.data[i].username+")",
  "value": result.data[i].username})

            this.setState({
            existingEmp: temp,

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
      monthError: "", doaError: "", error: "", success: false,
      modalSuccess: false, leaveTypeError:"",yearError:"", dateError:""
    })

    if (!this.state.year || this.state.year.length != 9) {
      this.setState({ yearError: "Please Enter Year correctly (Eg. 2018-2019)" });
      submit = false;

    }

     var  years = this.state.year.split("-")
    if( parseInt(years[0]) !== (parseInt(years[1]) - 1))
   {this.setState({yearError:"Year Format is not correct! Correct Format: 2018-2019"});
  submit=false}

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

    if (this.state.leavesAvailable===0) {
      this.setState({ error: "No Leaves Available!" });
      submit = false;

    }



    if (submit) {

      axios
        .post("http://localhost:8001/api/applyLeave", {
          "empName": this.state.selectedEmp.label, "leaveType": this.state.selectedLeaveType,
          "year": this.state.year, "doa": this.state.doa, "remarks": this.state.remarks,
          "dof":this.state.dof, "dot":this.state.dot, "selectedLeaveCount": this.state.selectedLeaveCount

        }
        )
        .then(result => {
          console.log("result.data ApplyLeave " + JSON.stringify(result.data));

          if (result.data.msg === "Success")
            this.setState({
              success: true,
              modalSuccess: true,
              modelMessage: this.state.selectedLeaveCount+ " Leaves applied for " + this.state.selectedEmp.label



            });

          else if (result.data.error) {

            return this.setState({ error: result.data.error });
          }



        })


    }








  }







  leaveChangeHandler(e) {
    if (e) {
      console.log("In leave change " + (e.target.value));


      this.setState({error:"", showApplyLeave:false, selectedLeaveType: e.target.value , yearError:"",leavesAvailable:""}, () => {
      
       axios
          .post("http://localhost:8001/api/getAvailableLeaveCount",
          {
            "leaveType":this.state.selectedLeaveType,
            "empName":this.state.selectedEmp.label
          })
          .then(result => {
            console.log("getAvailableLeaveCount.data " + JSON.stringify(result.data));

            if (result.data.error)
             return( this.setState({ error: result.data.error.message }));

        else
        {

           if(parseInt(result.data.remaining)>0)
           this.setState({showApplyLeave:true,leavesAvailable:result.data.remaining})
           else

           this.setState({leavesAvailable:0, error:"No "+this.state.selectedLeaveType+" leaves Avalable!"})



        }



          });




      })




    }

  }
 
  render() {

    return (
      <div>
   <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="12">
            <Card> <CardBody>
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
                          <h3 align="center"> Apply Leave</h3>
                          <br/>
                          <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Select/Search Employee</b>
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

                            onChange={selected=>{this.setState({selectedEmp:selected, showApplyLeave:false,selectedLeaveType:"", leavesAvailable:"",error:""},()=>{
                              this.getExistingLeaveTypes();
                            });}}
                            />
   {this.state.empError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.empError}</p>
                                    </font>
                                  )}

<br/>

<InputGroup className="mb-3">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText style={{ width: "120px" }}>
                    <b> Leave Type</b>
                                </InputGroupText>
                  </InputGroupAddon>
                  <Input
                    name="selectedLeaveType"
                    id="selectedLeaveType"
                    type="select"
                    value={this.state.selectedLeaveType}
                    onChange={this.leaveChangeHandler}
                  >
                    <option value="">Select</option>
                    {this.state.existingLeaveTypes.map(element => {
                      return (<option key={element.leaveName} value={element.leaveName}>{element.leaveName}</option>);
                    }
                    )}
                  </Input>
                </InputGroup>


              {this.state.leaveTypeError && (
                <font color="red">
                  {" "}
                  <p>{this.state.leaveTypeError}</p>
                </font>
              )}


<InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <b>Available leaves</b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="number"
                      size="lg"
                      name="leavesAvailable"
                      id="leavesAvailable"
                      value={this.state.leavesAvailable}
                     disabled



                    />
                  </InputGroup>
{this.state.showApplyLeave && <p>

                          <InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b> From Date</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="dof"
                                id="dof"
                                value={this.state.dof}
                                onChange={date=>{this.setState({dof:new Date(date.getTime()-(date.getTimezoneOffset() * 60000))},()=>{console.log("DOS: "+this.state.dof)})}}
                              />
&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
<InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b> To Date</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp; &nbsp;
                              <DatePicker
                                name="dot"
                                id="dot"
                                value={this.state.dot}
                                onChange={date=>{this.setState({dateError:"",submitDisabled:false,selectedLeaveCount :"",dot:new Date(date.getTime()-(date.getTimezoneOffset() * 60000))},()=>{

if(!this.state.dof) this.setState({dateError:"Please Select From Date First!",dot:"",submitDisabled:true});
else   if(new Date(this.state.dof).getTime()>new Date(this.state.dot).getTime())
{
    this.setState({  dateError: "Start Date can't be Greater than End Date!",submitDisabled:true});
   }
   else if(moment(new Date(this.state.dot)).diff(new Date(this.state.dof), 'days')>=this.state.leavesAvailable)
   this.setState({  dateError: "You can't apply more than "+this.state.leavesAvailable+" leaves!",
   submitDisabled:true, dot:""});
  else
  this.setState({selectedLeaveCount:moment(new Date(this.state.dot)).diff(new Date(this.state.dof), 'days')+1})

  })


  }}
                              />
                            </InputGroup>




 {this.state.dateError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.dateError}</p></h6>
                                </font>
                              )}

<InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <b>Total Leaves Selected</b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="number"
                      size="lg"
                      name="selectedLeaveCount"
                      id="selectedLeaveCount"
                      value={this.state.selectedLeaveCount}
                     disabled



                    />
                  </InputGroup>

<InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <b>Year</b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="text"
                      size="lg"
                      name="year"
                      id="year"
                      value={this.state.year}
                      onChange={e => { this.setState({ year: e.target.value }) }}




                    />
                  </InputGroup>
                  {this.state.yearError && (
                    <font color="red">
                      {" "}
                      <p>{this.state.yearError}</p>
                    </font>
                  )}

<InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Date of Apply</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="doa"
                                id="doa"
                                value={this.state.doa}
                                onChange={date=>{this.setState({doa:new Date(date.getTime()-(date.getTimezoneOffset() * 60000))},()=>{console.log("DOS: "+this.state.doa)})}}
                              />


                            </InputGroup>
                            {this.state.doaError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.doaError}</p></h6>
                                </font>
                              )}


<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Remarks</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                             name="remarks"
                              id="remarks"
                             value={this.state.remarks}
                             onChange={e => {
                                this.setState(
                                  { remarks: e.target.value })}}


                            />
                          </InputGroup>





<Row>
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"
                                block
                                disabled={this.state.submitDisabled}
                              >
                                Submit
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={e=>{ this.setState({showApplyLeave:false, selectedEmp:"", selectedLeaveType:"", leavesAvailable:""})}}
                                size="lg"
                                color="secondary"
                                block
                              >
                             Reset
                              </Button>
                            </Col>
                          </Row> </p>}

{this.state.error &&
  <font color="red">
    {" "}
    <p>{JSON.stringify(this.state.error)}</p>
  </font>
}

</CardBody></Card>



      </CardBody>
       </Card>
</Col>
        </Row>




</Container>
      </div>
    );
  }
}

export default ApplyLeave;

