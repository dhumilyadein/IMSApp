import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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
  TabContent, TabPane, Nav, NavItem, NavLink, CardTitle, CardText
} from 'reactstrap';

import axios, { post } from "axios";
import { allSettled } from 'q';


class ViewPayslip extends Component {

  constructor(props) {
    super(props);
    this.state = {
      empType: "",

      empArray: [],
     
      selectedEmp: [],
      error: "",

      totalEarning: "",
      totalDeduction: "",
      paidAmount: "",
      dop:  new Date(new Date().getTime() - (new Date().getTimezoneOffset() * 60000)),
      year: new Date().getFullYear() + "-" + (new Date().getFullYear() + 1),
      paidAmount: "",
      remarks: "",
      month: "",
      paidAmountError: "",
      dopError: "",
      
     
      
      empArray: [],
      empDetails: [],
      salaryRows: [],
      deductRows: [],showPaySlip:false,      empDetailsResponse:{},
    };


    this.empChangeHandler = this.empChangeHandler.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.fetchEmployees = this.fetchEmployees.bind(this);
    this.downloadPDF = this.downloadPDF.bind(this);

  }








  fetchEmployees(e) {
    console.log("EmpType - " + e.target.value);

    this.setState({ empType: e.target.value, selectedEmp: [] });
    axios.post("http://localhost:8001/api/fetchEmployees", { "empType": e.target.value }).then(cRes => {
      console.log("Result Emp - " + JSON.stringify(cRes));

      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ empDetails: cRes.data }, () => {

          var empArray = [];
          this.state.empDetails.forEach(element => {

            console.log("element.class - " + element.username);
            empArray.push({
              "label": element.firstname + " " + element.lastname + "(" + element.username + ")",
              "value": element.firstname + " " + element.lastname + "(" + element.username + ")"
            });
          });
          // console.log("classArray - " + classArray);
          var uniqueItems = Array.from(new Set(empArray));



          this.setState({ empArray: uniqueItems });
        });



      }
    });
  }

  /**
   * @description - fetches Employees
   */






  submitHandler(e) {
    e.preventDefault();
    console.log("In PAySalrySubmit:" + JSON.stringify(this.state));
    var submit = true;

    this.setState({
      error: "", 
      modalSuccess: false,monthError:"", empError:"",yearError:""
    })

    if (!this.state.year || this.state.year.length != 9) {
      this.setState({ yearError: "Please Enter Year correctly (Eg. 2018-19)" });
      submit = false;

    }

    if (!this.state.month) {
      this.setState({ monthError: "Please Select month" });
      submit = false;

    }
  

    if (!this.state.selectedEmp.value) {
      this.setState({ empError: "Please Select Employee" });
      submit = false;

    }

    if (submit) {

      axios
        .post("http://localhost:8001/api/getPayslip", {
          "selectedEmp": this.state.selectedEmp.value, "month": this.state.month,  "year": this.state.year

        }
        )
        .then(result => {
          console.log("result.data Pay " + JSON.stringify(result.data));

          if (result.data[0])
            this.setState({
empDetailsResponse:result.data[0],
showPaySlip:true



            });

          else if (result.data.length===0) {

            return this.setState({ error: "No record Found!" });
          }



        })


    }








  }

  downloadPDF(){

    const input = document.getElementById('divToPrint1');
  html2canvas(input)
    .then((canvas) => {
      const imgData = canvas.toDataURL('image/jpeg');
      const pdf = new jsPDF("l");
      var width = pdf.internal.pageSize.getWidth();
var height = pdf.internal.pageSize.getHeight();
console.log("before add image");
      pdf.addImage(imgData, 'JPEG', 10, 10,width,height);
      // pdf.output('dataurlnewwindow');
      pdf.save("PaySlip-"+this.state.selectedEmp.value.split(' ').join('_')+".pdf");


    });
  
  }



  empChangeHandler(e) {
    if (e) {
      console.log("In Emp change " + (e.value));

      this.setState({ selectedEmp: e,  })




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

                
          <Col sm="12">
          {!this.state.showPaySlip &&
            <Card className="mx-5">
              <h3 align="center">View Payslip</h3>
              <CardBody className="p-1">

                <br />

                <InputGroup className="mb-4">
                  <InputGroupAddon addonType="prepend">
                    <InputGroupText >
                  <b>    Employee Type</b>
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
                {this.state.empTypeError && (
                  <font color="red">
                    {" "}
                    <p>{this.state.empTypeError}</p>
                  </font>
                )}

                <InputGroupAddon addonType="prepend">
                  <InputGroupText >
                <b>    Employee/Staff</b>
                                </InputGroupText>
                </InputGroupAddon>
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

                <br />
                {this.state.empError && (
                  <font color="red">
                    {" "}
                    <p>{this.state.empError}</p>
                  </font>
                )}
                <br />

            
                <InputGroup className="mb-3">
                    <InputGroupAddon addonType="prepend">
                      <InputGroupText >
                        <b> For Month</b>
                      </InputGroupText>
                    </InputGroupAddon>
                    <Input
                      name="month"
                      id="month"
                      type="select"
                      value={this.state.month}
                      onChange={e => { this.setState({ month: e.target.value }) }}
                    >
                      <option value="">Select Month</option>
                      <option value="January">January</option>
                      <option value="February">February</option>
                      <option value="March">March</option>
                      <option value="April">April</option>
                      <option value="May">May</option>
                      <option value="June">June</option>
                      <option value="July">July</option>
                      <option value="August">August</option>
                      <option value="September">September</option>
                      <option value="October">October</option>
                      <option value="November">November</option>
                      <option value="December">December</option>
                    </Input>

                  </InputGroup>
                  {this.state.monthError && (
                    <font color="red">
                      {" "}
                      <p>{this.state.monthError}</p>
                    </font>
                  )}

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



<Row>
                    <Col>
                      <Button
                        onClick={this.submitHandler}
                        size="lg"
                        color="success"
                        block
                      >
                        View Payslip
                              </Button>
                    </Col>

                  
                  </Row>
                  {this.state.error && (
                    <font color="red">
                      {" "}
                      <p>{this.state.error}</p>
                    </font>
                  )}


                <br />


              </CardBody></Card>
          }
          </Col>

        </Row>

        {this.state.showPaySlip && (<p>
<div id='divToPrint1'>


<div >  <h3 align="center">        Payslip For {this.state.empDetailsResponse.month}({this.state.year})  </h3></div>
         <br/>
         <Card className="mx-5">
         
         <CardBody className="p-1">

           <br />

           <Card><CardBody>   <Row>        <h5>Employee Name:</h5> 
                      
                      &nbsp; &nbsp;
                   <font color="blue"> <h5>{this.state.empDetailsResponse.empDetails.empName
                  .toLowerCase()
                  .split(' ')
                  .map((s) => s.charAt(0).toUpperCase() + s.substring(1))
                  .join(' ')} </h5></font>
                    &nbsp; &nbsp; &nbsp; &nbsp;
                    <h5>Emp. No:</h5> 
               
               &nbsp; &nbsp;
               <font color="blue"> <h5>{this.state.empDetailsResponse.empDetails.empNo} </h5></font>

             &nbsp; &nbsp; &nbsp; &nbsp;
                    <h5>Date of Joining:</h5> 
               
               &nbsp; &nbsp;
               <font color="blue"> <h5>{this.state.empDetailsResponse.empDetails.doj.substring(0,10)} </h5></font>

               &nbsp; &nbsp; &nbsp; &nbsp;
                    <h5>Payment Date:</h5> 
               
               &nbsp; &nbsp;
               <font color="blue"> <h5>{this.state.empDetailsResponse.dop.substring(0,10)} </h5></font>
                    


                    
                    </Row>
                     <Row>     <h5>For Month of</h5> 
               
               &nbsp; &nbsp;
               <font color="blue"> <h5>{this.state.empDetailsResponse.month} </h5></font>
               &nbsp; &nbsp; &nbsp; &nbsp;
               <h5>Year:</h5> 
               
               &nbsp; &nbsp;
               <font color="blue"> <h5>{this.state.empDetailsResponse.year} </h5></font>
               &nbsp; &nbsp; &nbsp; &nbsp;


               </Row>
          
               </CardBody></Card>
             

        

        



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
                   {this.state.empDetailsResponse.salaryRows.map((item, idx) => (
                     <tr id="addr0" key={idx}>
                       <td align="center">
                         <h4>{idx + 1}</h4>
                       </td>


                       <td align="center">
                         <h4>  {this.state.empDetailsResponse.salaryRows[idx].earnType}</h4>

                       </td>

                       <td align="center">
                         <h4> {this.state.empDetailsResponse.salaryRows[idx].amount}</h4>
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
                     {this.state.empDetailsResponse.deductRows.map((item, idx) => (
                       <tr id="addr0" key={idx}>
                         <td align="center">
                           <h4>{idx + 1}</h4>
                         </td>


                         <td align="center">
                           <h4> {this.state.empDetailsResponse.deductRows[idx].deductType}</h4>
                         </td>

                         <td align="center">
                           <h4> {this.state.empDetailsResponse.deductRows[idx].amount}</h4>
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
                 value={this.state.empDetailsResponse.totalEarning}
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
                 value={this.state.empDetailsResponse.totalDeduction}
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
                 value={this.state.empDetailsResponse.paidAmount}
                 disabled
               />
             </InputGroup>





     {this.state.empDetailsResponse.remarks && 
                 
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
                      value={this.state.empDetailsResponse.remarks}
disabled



                    />
                  </InputGroup>
               
                 }

             <br />
             
             
            
             
             
             
            


           <br />


         </CardBody></Card>  </div>

<Row>
<Col>
  <Button
    onClick={this.downloadPDF}
    size="lg"
    color="success"
    block
  >
    Download as PDF
          </Button>
</Col>

<Col>
  <Button
    onClick={() => {
      this.setState({
        showPaySlip:false,
          selectedSalaryTemplate: [],
         showSalaryTemplate: false,
         paidAmount: "",
         remarks: "",
         month: "" ,
         selectedEmp:[]

      });
    }}
    size="lg"
    color="secondary"
    block
  >
    Cancel
          </Button>
</Col>
</Row>



    
         </p>) }





      </div>
    );
  }
}

export default ViewPayslip;

