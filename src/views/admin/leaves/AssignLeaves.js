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


class AssignLeaves extends Component {

  constructor(props) {
    super(props);
    this.getExistingLeaveTypes();

    this.state = {

      error: "",
      
      doa:  new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
      year: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
forAllEmp:false,
      remarks: "",
   CFLC:"",
      modelMessage: "",
      modalSuccess: false,
      success: false,
maxLeaveCount:"",
     existingLeaveTypes:[],
     existingEmp:[],
     selectedEmp:[]

    };


    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.getExistingLeaveTypes = this.getExistingLeaveTypes.bind(this);
    this.leaveChangeHandler=this.leaveChangeHandler.bind(this);
  }

leaveChangeHandler(e)
{ 
  this.setState({  selectedLeaveType: e.target.value,leaveCount:"",CFLcFromLastYear:false},
    ()=>{

      for(var i=0;i<this.state.existingLeaveTypes.length;i++)
      {if(this.state.existingLeaveTypes[i].leaveName===this.state.selectedLeaveType)
       { this.setState({carryForward:this.state.existingLeaveTypes[i].carryForward,leaveCount:this.state.existingLeaveTypes[i].leaveCount});
         if(this.state.existingLeaveTypes[i].carryForward)
         this.setState({maxLeaveCount:this.state.existingLeaveTypes[i].maxLeaveCount,CFLcFromLastYear:true})
      }

      }
            this.fetchEmployees();})

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
  }

  toggleSuccess() {

    this.setState({
      modalSuccess: !this.state.modalSuccess,
CFLcFromLastYear:false,
      modelMessage: "",
selectedEmp:"",
selectedLeaveType:"",
leaveCount:"",
forAllEmp:false,
CFLC:"",
maxLeaveCount:""


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
    console.log("In AssignLeaveSubmit:" + JSON.stringify(this.state));
    var submit = true;

    this.setState({
      leaveTypeError: "", empError: "", error: "", success: false,
      modalSuccess: false})

   

    if (!this.state.selectedLeaveType) {
      this.setState({ leaveTypeError: "Please Select Leave Type" });
      submit = false;

    }
    if (this.state.selectedEmp.length===0) {
      this.setState({ empError: "Please Select Employee" });
      submit = false;

    }

   


    if (submit) {

      axios
        .post("http://localhost:8001/api/assignLeave", {
          "selectedEmp": this.state.selectedEmp, "leaveType": this.state.selectedLeaveType,
         "leaveCount":this.state.leaveCount,"carryForward":this.state.carryForward, "maxLeaveCount":this.state.maxLeaveCount,"CFLC":this.state.CFLC}
        )
        .then(result => {
          console.log("result.data ApplyLeave " + JSON.stringify(result.data));

          if (result.data.msg === "Leave Assigned")
            this.setState({
              success: true,
              modalSuccess: true,
              modelMessage: "Leave Assgined succesfully"



            });

          else if (result.data.error) {

            return this.setState({ error: result.data.error });
          }



        })


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
                          <h3 align="center"> Assign Leaves to Employee</h3>
                          <br/>

                   
                          <div> <h5><font color="blue">NOTE:</font></h5> <font color="red"> <h5> Leaves should be assigned/reset only once every year.</h5> </font></div>
                          <div> <font color="red"> <h5> Carry Forwarded LC's value should be provided only for the 1st year. System will automatically manages this value, hence forth. </h5> </font></div>

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

{ !this.state.forAllEmp &&<p>

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
                            isMulti={true}

                            onChange={selected=>{this.setState({selectedEmp:selected},()=>{
                             
                            });}}
                            />
   {this.state.empError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.empError}</p>
                                    </font>
                                  )}</p>}


<FormGroup check inline>
                                    <Input
                                      className="form-check-input"
                                      type="checkbox"
                                      id="forAllEmp"
                                      style={{ height: "35px", width: "25px" }}
                                      name="forAllEmp"
                                      checked={this.state.forAllEmp}
                                      onChange={e=>{
                                        if (e.target.checked === true) {
                                            console.log("forAllEmp true: " + e.target.checked);
                                            this.setState({
                                           
                                             forAllEmp:true,
                                             selectedEmp:this.state.existingEmp
                                            });
                                          } else if (e.target.checked === false) {
                                            console.log("forAllEmp false: " + e.target.checked);
                                            this.setState({
                                               
                                                forAllEmp:false,
                                                selectedEmp:[]
                                               
                                            });
                                          }

                                      }}
                                    />
                                    <Label
                                      className="form-check-label"
                                      check
                                      htmlFor="inline-checkbox1"
                                    >
                                     <b> Select All Employee</b>
                                    </Label>
                                  </FormGroup>

<br/>

<InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <b>Leave Count/Year</b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="number"
                      size="lg"
                      name="leaveCount"
                      id="leaveCount"
                      value={this.state.leaveCount}
                    
disabled

                    />
                  </InputGroup>

{this.state.CFLcFromLastYear &&
                  <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <b>Carry Forwarded LC from last year<i>(Optional)</i></b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      type="number"
                      size="lg"
                      name="leaveCount"
                      id="leaveCount"
                      value={this.state.CFLC}
                    
onChange={e=>{this.setState({CFLC:e.target.value})}}

                    />
</InputGroup>     }

{this.state.error &&
  <font color="red">
    {" "}
    <p>{JSON.stringify(this.state.error)}</p>
  </font>
}

<br/>
<Row align="center" >
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"

                              >
                                Submit
                              </Button>
                            </Col>


                          </Row>

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

export default AssignLeaves;

