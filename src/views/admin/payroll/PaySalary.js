import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
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

    Table,
    TabContent, TabPane, Nav, NavItem, NavLink,   CardTitle, CardText
} from 'reactstrap';

import axios, { post } from "axios";
import { allSettled } from 'q';


class PaySalary extends Component {

    constructor(props) {
        super(props);
        this.state = {
empType:"",

empArray:[],
            studentOpen:true,

            activeTab:"1",
salaryTemplates:[],
selectedEmp:[],
error:"",
showSalaryTemplate:false,

totalEarning:"",
totalDeduction:"",
paidAmount:"",


paidAmount:"",
remarks:"",
dop:new Date(Date.now()),

paidAmountError:"",
dosError:"",

modalSuccess:false,
success:false,
studentName:"",
rollNo:"",
showRollFeeTemplate:false
,
empArray:[],
empDetails:[],
AllSalaryTemplateDetails:[],
salaryRows:[],
deductRows:[]
        };


        this.empChangeHandler = this.empChangeHandler.bind(this);
         this.feeSubmitHandler = this.feeSubmitHandler.bind(this);
         this.salaryTemplateSelectHandler = this.salaryTemplateSelectHandler.bind(this);
         this.toggleSuccess = this.toggleSuccess.bind(this);
this.fetchEmployees=this.fetchEmployees.bind(this);

    }

  
  
  

    toggleSuccess() {

      this.setState({
        modalSuccess: !this.state.modalSuccess
      });
  
    }


    fetchEmployees(e) {
        console.log("EmpType - " + e.target.value);

        this.setState({ empType:e.target.value});
      axios.post("http://localhost:8001/api/fetchEmployees",{"empType":e.target.value}).then(cRes => {
        console.log("Result Emp - " +JSON.stringify(cRes));

        if (cRes.data.errors) {

          return this.setState({ errors: cRes.data.errors });

        } else {

          this.setState({ empDetails: cRes.data },()=>{

            var empArray = [];
      this.state.empDetails.forEach(element => {

        console.log("element.class - " + element.username);
        empArray.push({"label":element.firstname+" "+element.lastname+"("+element.username+")",
        "value":element.firstname+" "+element.lastname+"("+element.username+")"});
      });
     // console.log("classArray - " + classArray);
     var uniqueItems = Array.from(new Set(empArray));



      this.setState({ empArray: uniqueItems });
          });



        }
      });
    }

    /**
     * @description - fetches unique classes from the class detail from DB
     */


   



    feeSubmitHandler(e){
      e.preventDefault();
console.log("In FeeSubmit:"+ JSON.stringify(this.state));
var submit=true;

this.setState({yearError:"", quarterError:"",studentError:"", monthError:"",halfYearError:"",dosError:"", paidAmountError:"",sectionError:"", error:"", success: false,
modalSuccess: false})

if(!this.state.year||this.state.year.length!=9)
{
this.setState({yearError:"Please Enter Year correctly (Eg. 2018-19)"});
submit=false;

}
if(this.state.templateType==="Monthly")
if(!this.state.month)
{
this.setState({monthError:"Please Select month"});
submit=false;

}
if(this.state.templateType==="Quarterly")
if(!this.state.quarter)
{
this.setState({quarterError:"Please Select Quarter"});
submit=false;

}

if(this.state.templateType==="Half Yearly")
if(!this.state.halfYear)
{
this.setState({halfYearError:"Please Select Half Year"});
submit=false;

}

if(!this.state.paidAmount)
{
  this.setState({paidAmountError:"Please Enter Paid Amount"});
  submit=false;

  }

  if(!this.state.section)
{
  this.setState({sectionError:"Please Select Section"});
  submit=false;

  }

  if(!this.state.dos)
{
  this.setState({dosError:"Please Enter Date of Submission"});
  submit=false;

  }

  if(!this.state.selectedStudent.value)
  {
    this.setState({studentError:"Please Select Student"});
    submit=false;

    }

  if(submit)
  { this.setState({totalDueAmount:document.getElementById("totalDueAmount").value,
                    studentName:this.state.selectedStudent.label},()=>{

    axios
    .post("http://localhost:8001/api/feeSubmit", this.state)
    .then(result => {
        console.log("result.data " + JSON.stringify(result.data));

        if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,
                class:"",
                section:"",

                selectedSalaryTemplate:[],
                showSalaryTemplate:false,
                paidAmount:"",

                studentResults: [],


                halfYear:"",
                remarks:"",
                quarter:"",
                month:""



              });

              else if (result.data.error) {

                return this.setState({error:result.data.error});
            }


    });
  })


  }








    }



    empChangeHandler(e){
if(e)
     { console.log("In Emp change "+(e.value));

this.setState({selectedEmp:e,selectedSalaryTemplate:[],showSalaryTemplate:false},()=>{

  axios
  .get("http://localhost:8001/api/getSalaryTemplate")
  .then(result => {
      console.log("result.data " + JSON.stringify(result.data));

      if (result.data) {
        var temp=[];
       for(var i=0;i<result.data.length;i++)
       {
        temp.push({"value":result.data[i].templateName,
        "label":result.data[i].templateName
       });

      }
        this.setState({salaryTemplates:temp, AllSalaryTemplateDetails:result.data});
      }

      else if (result.data.error) {

         this.setState({error:result.data.error.message});
      }





});




})




    }

    }

    salaryTemplateSelectHandler(e){
      if(e)
           { console.log("In Salary Template "+(e.value));

this.setState({selectedSalaryTemplate:e, },()=>{

  for(var i=0;i<this.state.AllSalaryTemplateDetails.length;i++)
  { if(this.state.AllSalaryTemplateDetails[i].templateName===this.state.selectedSalaryTemplate.value)
        this.setState({salaryRows:this.state.AllSalaryTemplateDetails[i].salaryRows, 
            deductRows:this.state.AllSalaryTemplateDetails[i].deductRows, showSalaryTemplate:true,
        totalDeduction:this.state.AllSalaryTemplateDetails[i].totalDeduction,
        totalEarning:this.state.AllSalaryTemplateDetails[i].totalEarning,
        paidAmount:this.state.AllSalaryTemplateDetails[i].paidAmount})

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

            <Row>
                
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
              <Col sm="12">
              <Card className="mx-5">
              <h1 align="center">Pay Salary</h1>
                          <CardBody className="p-1">

                            <br/>

                            <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                        Employee Type
                                </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="empType"
                                      id="empType"
                                      type="select"
                                      value={this.state.empType}
                                      onChange={this.fetchEmployees}
                                    >
                                      <option value="">Select</option>
                                      <option value="Staff">Staff</option>
                                      <option value="Admin">Admin</option>
                                   
                                    </Input>
                                  </InputGroup>
                                  { this.state.empTypeError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.empTypeError}</p>
                                    </font>
                                  )}


                     <Select
                            id="selectedEmp"
                            name="selectedEmp"

                          placeholder="Select Employee/Staff or Type to search"
                            options={this.state.empArray}
                          closeMenuOnSelect={true}
                         value={this.state.selectedEmp}
                         isClearable={true}
                         //menuIsOpen ={this.state.studentOpen}
                            isSearchable={true}

                            onChange={this.empChangeHandler}
                            />

<br/>
{this.state.empError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.empError}</p>
                              </font>
                            )}
                            <br/>



<Select
                            id="salaryTemplates"
                            name="salaryTemplates"

                          placeholder="Select Salary Template"
                            options={this.state.salaryTemplates}
                          closeMenuOnSelect={true}
                         value={this.state.selectedSalaryTemplate}
                         isClearable={true}
                         //menuIsOpen ={this.state.studentOpen}
                            isSearchable={true}

                            onChange={this.salaryTemplateSelectHandler}
                            />


  <br/>

  {this.state.showSalaryTemplate&& <p>

   
<Row><Col>


<h4 align="center"> Earnings</h4>



                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                               
                                <th className="text-center">
                                  {" "}
                                  <h4>Earning Type</h4>
                                </th>
                                <th className="text-center">
                                  <h4> Amount(Rs)</h4>{" "}
                                </th>
                           
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.salaryTemplates.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                 

                                  <td align="center">
                                <h4>  {this.state.salaryRows[idx].earnType}</h4>
                                    
                                  </td>

                                  <td align="center">
                                 <h4> {this.state.salaryRows[idx].amount}</h4>
                                  </td>
                           
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                   
</Col><Col>


<h4 align="center"> Deductions</h4>






                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "red" }}>

                              <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                               
                                <th className="text-center">
                                  {" "}
                                  <h4>Deduction Type</h4>
                                </th>
                                <th className="text-center">
                                  <h4> Amount(Rs)</h4>{" "}
                                </th>
                         
                                
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.deductRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                 

                                  <td align="center">
                                 <h4> {this.state.deductRows[idx].deductType}</h4>
                                  </td>

                                  <td align="center">
                                 <h4> {this.state.deductRows[idx].amount}</h4>
                                  </td>
                                
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                       
</Col></Row>

<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Earnings(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="totalEarning"
                              id="totalEarning"
                              value={this.state.totalEarning}
                             disabled
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Deductions(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="totalDeduction"
                              id="totalDeduction"
                              value={this.state.totalDeduction}
                             disabled
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Total Paid Amount(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                             
                              name="paidAmount"
                              id="paidAmount"
                              value={this.state.paidAmount}
                             disabled
                            />
                          </InputGroup>
                         
                                          
                         







                          <InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Date of Payment</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="dop"
                                id="dop"
                                value={this.state.dop}
                                onChange={date=>{this.setState({dop:new Date(date.getTime()-(date.getTimezoneOffset() * 60000))})}}
                              />


                            </InputGroup>
                            {this.state.dosError &&(
                                <font color="red">
                                  {" "}
                                  <p>{this.state.dosError}</p>
                                </font>
                              )}

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Remarks</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="textarea"
                              size="lg"
                             name="remarks"
                              id="remarks"
                              value={this.state.remarks}
                              onChange={e=>{this.setState({remarks:e.target.value})}}




                            />
                          </InputGroup>

<br/> <Row>
                            <Col>
                              <Button
                                onClick={this.feeSubmitHandler}
                                size="lg"
                                color="success"
                                block
                              >
                                Submit
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={() => {
                                  this.reset();
                                }}
                                size="lg"
                                color="secondary"
                                block
                              >
                                Cancel
                              </Button>
                            </Col>
                          </Row>

                          </p>
                        }



<br/>

{this.state.error &&
                              <font color="red">
                                {" "}
                                <p>{this.state.error}</p>
                              </font>
                            }

</CardBody></Card>
              </Col>
            </Row>
     
     
    


            </div>
        );
    }
}

export default PaySalary;

