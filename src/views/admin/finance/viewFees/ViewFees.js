import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
import DatePicker from 'react-date-picker';
import html2canvas from "html2canvas";
import jsPDF from "jspdf";
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


class AddFees extends Component {

    constructor(props) {
        super(props);
        this.state = {

class:"",
section:"",
classError:"",

            studentResults: [],
            studentOpen:true,

            activeTab:"1",
feeTemplates:[],
selectedStudent:[],
error:"",
showFeeTemplate:false,
templateRows: [{ feeType: "", amount: "" }],
templateType:"",
totalAmount:"",
year:new Date().getFullYear()+"-"+(new Date().getFullYear()+1),
showMonth:false,
showQuarter: false,
showHalfYearly:false,
month:"",
quarter:"",
halfYear:"",
totalDueAmount:"",
lateFeeFine:"0",
paidAmount:"",
pastPendingDue:"0",
paidAmount:"",
remarks:"",
dos:Date.now(),
yearError:"",
quarterError:"",
halfYearError:"",
monthError:"",
paidAmountError:"",
dosError:"",
sectionError:"",
modalSuccess:false,
success:false,
studentName:"",
rollNo:"",
showRollFeeTemplate:false,
showFeeRecords:false,
feeRecords:[]

        };


        this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);

         this.studentSelectedHandler = this.studentSelectedHandler.bind(this);
         this.toggle = this.toggle.bind(this);
         this.downloadPDF = this.downloadPDF.bind(this);
         this.getStudentByRollNo = this.getStudentByRollNo.bind(this);
this.reset=this.reset.bind(this);

    }

    reset()
    {
      this.setState( {

        class:"",
        section:"",
        classError:"",
selectedFeeTemplate:[],
                    studentResults: [],
                    studentOpen:true,

                    activeTab:"1",
        feeTemplates:[],
        selectedStudent:[],
        error:"",
        showFeeTemplate:false,
        templateRows: [{ feeType: "", amount: "" }],
        templateType:"",
        totalAmount:"",
        year:new Date().getFullYear()+"-"+(new Date().getFullYear()+1),
        showMonth:false,
        showQuarter: false,
        showHalfYearly:false,
        month:"",
        quarter:"",
        halfYear:"",
        totalDueAmount:"",
        lateFeeFine:"0",
        paidAmount:"",
        pastPendingDue:"",
        paidAmount:"",
        remarks:"",
        dos:Date.now(),
        yearError:"",
        quarterError:"",
        halfYearError:"",
        monthError:"",
        paidAmountError:"",
        dosError:"",
        sectionError:"",
        modalSuccess:false,
        success:false,
        studentName:"",
        rollNo:"",
        showRollFeeTemplate:false

                });


    }

    getStudentByRollNo()
        {
console.log("In GetBy RollNo: ", this.state.rollNo);
this.setState({rollNoError:"", error:""});
var submit=true;

if(!this.state.rollNo)
{this.setState({rollNoError:"Please Enter Roll Number"})
submit=false}

if(submit)

{
  axios
  .post("http://localhost:8001/api/getStudentByRollNo", {"rollNo":this.state.rollNo})
  .then(result => {
      console.log(" Roll no result.data " + JSON.stringify(result.data));

      if (result.data.firstname) {
        var temp=[];
       for(var i=0;i<result.data.feeTemplate.length;i++)
       {
        temp.push({"value":result.data.feeTemplate[i],
        "label":result.data.feeTemplate[i]
       });

      }
        this.setState({feeTemplates:temp, showRollFeeTemplate:true,
          studentName:  result.data.firstname.charAt(0).toUpperCase() + result.data.firstname.slice(1)+ " "+
          result.data.lastname.charAt(0).toUpperCase() + result.data.lastname.slice(1)+ " ("+result.data.username+")",
          class:result.data.class, section:result.data.section, selectedFeeTemplate:[],
          selectedStudent:{"value":result.data.username, "label":result.data.firstname.charAt(0).toUpperCase() + result.data.firstname.slice(1)+ " "+
          result.data.lastname.charAt(0).toUpperCase() + result.data.lastname.slice(1)+ " ("+result.data.username+")"}

      });}

      else if (result.data.error) {

        return this.setState({error:"Roll Number not Found!",showRollFeeTemplate:false});
      }


  });

}

        }

    toggle(tab) { this.reset();
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }

    downloadPDF(){

      const input = document.getElementById("divToPrint");
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'JPEG', 0, 0);
        // pdf.output('dataurlnewwindow');
        pdf.save("download.pdf");
      })
    ;
    }



    classChangeHandler(e) {

      this.setState({class: e.target.value, error:"",feeTemplates:[],section:"",
       classError:"",studentResults:[],selectedStudent:[], selectedFeeTemplate:[], showFeeTemplate:false},

       ()=>{console.log("in Class change: "+this.state.class);

      axios
      .post("http://localhost:8001/api/selectStudentByClass", {"class": this.state.class})
      .then(result => {
          console.log("result.data " + JSON.stringify(result.data));

          if (result.data.length>0) {
            var temp=[];
           for(var i=0;i<result.data.length;i++)
           {
             temp.push({"value":result.data[i].username,
             "label":result.data[i].firstname.charAt(0).toUpperCase() + result.data[i].firstname.slice(1)+" "+
             result.data[i].lastname.charAt(0).toUpperCase() + result.data[i].lastname.slice(1)+
              " ("+(result.data[i].username.toLowerCase())+")"
            });}
            this.setState({studentResults:temp});
          }

          else if (result.data.errors) {

            return this.setState({error:result.data.errors});
          }


      });

    });




    }

    sectionChangeHandler(e) {
      console.log("in section change: "+e.target.value);
      this.setState({selectedStudent:[]});
if(!this.state.class)
{this.setState({classError:"Please select Class first"});

return;}

if(!e.target.value)
{ axios
  .post("http://localhost:8001/api/selectStudentByClass", {"class": this.state.class})
  .then(result => {
      console.log("result.data " + JSON.stringify(result.data));

      if (result.data.length>0) {
        var temp=[];
       for(var i=0;i<result.data.length;i++)
       {
         temp.push({"value":result.data[i].username,
         "label":result.data[i].firstname.charAt(0).toUpperCase() + result.data[i].firstname.slice(1)+" "+
         result.data[i].lastname.charAt(0).toUpperCase() + result.data[i].lastname.slice(1)+
          " ("+(result.data[i].username.toLowerCase())+")"
        });}
        this.setState({studentResults:temp});
      }

      else if (result.data.errors) {

        return this.setState({error:result.data.errors});
      }


  });}

      this.setState({section: e.target.value, studentResults:[]},()=>{console.log("in section change: "+this.state.section);

      axios
      .post("http://localhost:8001/api/selectStudentBySection", {"class": this.state.class, "section":this.state.section})
      .then(result => {
          console.log("result.data " + JSON.stringify(result.data));

          if (result.data.length>0) {
            var temp=[];
           for(var i=0;i<result.data.length;i++)
           {
             temp.push({"value":result.data[i].username,
             "label":result.data[i].firstname.charAt(0).toUpperCase() + result.data[i].firstname.slice(1)+" "+
             result.data[i].lastname.charAt(0).toUpperCase() + result.data[i].lastname.slice(1)+
              " ("+(result.data[i].username.toLowerCase())+")"
            });}
            this.setState({studentResults:temp});
          }

          else if (result.data.error) {

              return this.setState({error:result.data.error});
          }



      });

    });




    }

    studentSelectedHandler(e){
if(e)
     { console.log("In Student "+(e.value));

this.setState({selectedStudent:e,showFeeRecords:false,error:""},()=>{

  axios
  .post("http://localhost:8001/api/getFeesDetails", {"selectedStudent":this.state.selectedStudent})
  .then(result => {
      console.log("result.data " + JSON.stringify(result.data));

          if(result.data)
          this.setState({feeRecords:result.data, showFeeRecords:true});
          
if(result.data.length===0)
{this.setState({error:"No Record found!",showFeeRecords:false})};



});




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




                <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}

            >
            <h5>  Select Student by Class & Section</h5>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}

            >
            <h5>  Select Student by Roll No</h5>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>

              <Col sm="12">
        {  !this.state.showViewCard &&    <Card className="mx-5">
                          <CardBody className="p-1">

                            <br/><InputGroup className="mb-3">
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
                                onChange={ this.classChangeHandler}
                              >
                                <option value="">Select</option>
                                <option value="LKG">LKG</option>
                                <option value="UKG">UKG</option>
                                <option value="I">I</option>
                                <option value="II">II</option>
                                <option value="III">III</option>
                                <option value="IV">IV</option>
                                <option value="V">V</option>
                                <option value="VI">VI</option>
                                <option value="VII">VII</option>
                                <option value="VIII">VIII</option>
                                <option value="IX">IX</option>
                                <option value="X">X</option>
                                <option value="XI">XI</option>
                                <option value="XII">XII</option>
                                   </Input>
                            </InputGroup>

                            {this.state.classError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.classError}</p>
                              </font>
                            )}

                            <InputGroup className="mb-3">
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
                                onChange={this.sectionChangeHandler}
                              >
                                <option value="">Select</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>

                                   </Input>
                            </InputGroup>
                            {this.state.sectionError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.sectionError}</p>
                              </font>
                            )}


                     <Select
                            id="studentSelect"
                            name="studentSelect"

                          placeholder="Select Student or Type to search"
                            options={this.state.studentResults}
                          closeMenuOnSelect={true}
                         value={this.state.selectedStudent}
                         isClearable={true}
                         //menuIsOpen ={this.state.studentOpen}
                            isSearchable={true}

                            onChange={this.studentSelectedHandler}
                            />
<br/>


  {this.state.showFeeRecords&& <p>




<Table bordered hover
>
                            <thead>
                              <tr style={{ 'backgroundColor': "palevioletred" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Fee Template </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Template Type </h4>
                                </th>
                                <th className="text-center">
                                  <h4> Date of Submission</h4>{" "}
                                </th>
                                <th className="text-center">
                                  <h4> Actions</h4>{" "}
                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.feeRecords.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td align="center">
                                <h5>   {this.state.feeRecords[idx].templateName.charAt(0).toUpperCase()
                                           + this.state.feeRecords[idx].templateName.slice(1)}</h5>

                                        
                                  </td>
                                  <td align="center">
                                  <h5> {this.state.feeRecords[idx].templateType}</h5>
                                       
                                  </td>


                                  <td align="center">
                                <h5>  {this.state.feeRecords[idx].dos.substr(0,10)}</h5>
                                       
                                  </td>

                                  <td align="center">


                                  <Button
                                     color="primary"
                                      onClick={()=>{this.setState({
                                        showViewCard:true,
                                        studentName:this.state.feeRecords[idx].studentDetails[0].name,
                                        class:this.state.feeRecords[idx].class,
                                        section:this.state.feeRecords[idx].section,
                                        templateName: this.state.feeRecords[idx].templateName,
                                        templateType: this.state.feeRecords[idx].templateType,
                                        year:this.state.feeRecords[idx].year,
                                        templateRows:this.state.feeRecords[idx].templateRows,
                                        month:this.state.feeRecords[idx].month,
                                        quarter: this.state.feeRecords[idx].quarter,
                                        halfYear:this.state.feeRecords[idx].halfYear,
                                        totalAmount:this.state.feeRecords[idx].totalFeeAmount,
                                        lateFeeFine:this.state.feeRecords[idx].lateFeeFine,
                                        pastPendingDue:this.state.feeRecords[idx].pastPendingDue,
                                        paidAmount:this.state.feeRecords[idx].paidAmount,
                                        totalDueAmount:this.state.feeRecords[idx].totalDueAmount,
                                        dos:this.state.feeRecords[idx].dos,
                                        remarks:this.state.feeRecords[idx].remarks






                                      },()=>{console.log("Student name: "+this.state.quarter)})}}


                                      size="lg"
                                    >
                                      View
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                      color="warning"
                                      onClick={()=>{this.setState({
                                       
                                        
                                        templateNo: idx,
                                        templateName: this.state.existingRows[idx].templateName,
                                        templateType: this.state.existingRows[idx].templateType,
                                        showCreateTemplate:false,
                                        showCreateButton:false,
                                        showExistingTemplate:false,
                                        templateNameError:"",
                                        templateTypeError:"",
                                        rowError:""


                                      },()=>{console.log("Updated State: "+JSON.stringify(this.state));})
                                      }}

                                      size="lg"
                                    >
                                      Print
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                      color="danger"
                                      onClick={()=>{this.setState({
                                        editRows:this.state.existingRows[idx].templateRows,
                                        showEditTemplate: false,
                                        showCopyTemplate: true,
                                        templateNo: idx,
                                        templateName: this.state.existingRows[idx].templateName,
                                        templateType: this.state.existingRows[idx].templateType,
                                        showCreateTemplate:false,
                                        showCreateButton:false,
                                        showExistingTemplate:false,
                                        templateNameError:"",
                                        templateTypeError:"",
                                        rowError:""


                                      },()=>{console.log("Updated State: "+JSON.stringify(this.state));})
                                      }}

                                      size="lg"
                                    >
                                      DownLoad
                                    </Button>
                                   

                                  </td>

                                </tr>
                              ))}
                            </tbody>
                          </Table>

                          </p>
                        }



<br/>

{this.state.error &&
                              <font color="red">
                                {" "}
                                <h5>{this.state.error}</h5>
                              </font>
                            }

</CardBody></Card>
        }
{this.state.showViewCard &&
<Card><CardBody>

<div id="divToPrint">
                           
                        <Row>        <h5>Sudent Name:</h5> 
                      
                             &nbsp; &nbsp;
                          <font color="blue"> <h5>{this.state.studentName} </h5></font>
                           &nbsp; &nbsp; &nbsp; &nbsp;
                           <h5>Class:</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.class} </h5></font>

                    &nbsp; &nbsp; &nbsp; &nbsp;
                           <h5>Section:</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.section} </h5></font>

                      &nbsp; &nbsp; &nbsp; &nbsp;
                           <h5>Date:</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.dos.substr(0,10)} </h5></font>
                           
                           
                           </Row>
                           &nbsp; &nbsp; &nbsp; &nbsp;
                      <Row>     <h5>Fee Type:</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.templateName} ({this.state.templateType}) </h5></font>
                      &nbsp; &nbsp; &nbsp; &nbsp;
                      <h5>Year:</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.year} </h5></font>
                      &nbsp; &nbsp; &nbsp; &nbsp;
{this.state.month && <Row>
                      <h5>Month:</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.month} </h5></font> </Row>}

                      {this.state.halfYear &&<Row>
                      <h5>Half Year:</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.halfYear} </h5></font></Row>}

{this.state.quarter &&<Row>
                      <h5>Quarter:</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.quarter} </h5></font></Row>}

                      </Row>
                      <br/>
                      <Table bordered hover
>
                            <thead>
                              <tr style={{ 'backgroundColor': "palevioletred" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Fee Category </h4>
                                </th>
                                <th className="text-center">
                                  <h4> Amount(Rs)</h4>{" "}
                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.templateRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td align="center">
                              <h4>     {this.state.templateRows[idx].feeType.charAt(0).toUpperCase()
                                           + this.state.templateRows[idx].feeType.slice(1)}</h4>

                                       
                                  </td>
                                  <td align="center">
                        <h4>           {this.state.templateRows[idx].amount}</h4>
                                       
                                  </td>

                                </tr>
                              ))}
                            </tbody>
                          </Table>
<br/>


<Table bordered hover
>
                            
                            <tbody>
                             
                                <tr id="addr0">
                                  <td align="center">
                                    <h4>Totoal Fee Amount(Rs.): </h4>
                                  </td>
                                  <td align="center">
                              <h4>     <font color="blue"> {this.state.totalAmount} </font></h4>

                                       
                                  </td></tr>
                               <tr>   <td align="center">
                                    <h4>Late Fee Fine(Rs.): </h4>
                                  </td>
                                  <td align="center">
                              <h4>     <font color="blue"> {this.state.lateFeeFine} </font></h4>
                                      
                                  </td></tr>

                               <tr>   <td align="center">
                                    <h4>Past Due Amount(Rs.): </h4>
                                  </td>
                                  <td align="center">
                              <h4>     <font color="blue"> {this.state.pastPendingDue} </font></h4>
                                 
                                  </td></tr>

                           <tr>       <td align="center">
                                    <h4>Totoal Paid Amount(Rs.):</h4>
                                  </td>
                                  <td align="center">
                              <h4>     <font color="blue"> {this.state.paidAmount} </font></h4>
                                 
                                  </td></tr>

                               <tr>   <td align="center">
                                    <h4>Current Due Amount(Rs.):</h4>
                                  </td>
                                  <td align="center">
                              <h4>     <font color="blue"> {this.state.totalDueAmount} </font></h4>
                                 
                                  </td></tr>


                                  

                               
                                                        </tbody>
                          </Table>

<br/>
                      {this.state.remarks && <Row>
                        
                        <h5>Remarks</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.remarks} </h5></font>
                      
                       </Row> }
                       </div>
                   <br/>      <br/>

                   <Row> <Col><Button
                                   onClick={this.downloadPDF}
                                size="lg"
                                color="success"
                                block
                              >
                                Download
                              </Button></Col>

                              &nbsp;&nbsp;&nbsp;&nbsp;
<Col>
                              <Button
                                   onClick={()=>{this.setState({showViewCard:false})}}
                                size="lg"
                                color="primary"
                                block
                              >
                                Print
                              </Button>
</Col>
                              &nbsp;&nbsp;&nbsp;&nbsp;
                     
                     
                     <Col>
                       <Button
                                   onClick={()=>{this.setState({showViewCard:false})}}
                                size="lg"
                                color="danger"
                                block
                              >
                                Cancel
                              </Button> </Col> </Row>

 
 
 
 
 
 
 
 
 
 
 
 
 
 
        
  
  </CardBody></Card>

}
              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
            <Row>
              <Col sm="6">

              <Card>

<CardBody>



<InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={{ width: "120px" }}
                                      >
                                        Roll No
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      type="number"
                                      name="rollno"
                                      id="rollno"
                                      value={this.state.rollNo}
                                      autoComplete="rollno"
                                      onChange={e=>{this.setState({rollNo:e.target.value})}}
                                    />
                                  </InputGroup>
                                  {this.state.rollNoError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.rollNoError} </p>
                              </h6>{" "}
                            </font>)}


                          <Button
                          type="submit"
                          onClick={this.getStudentByRollNo}
                          block
                          color="success"
                        >
                          {" "}
                           <h4>  Search</h4>
                        </Button>
         <br/>
{this.state.error &&
  <font color="red">
    {" "}
    <p>{this.state.error}</p>
  </font>
}

                        </CardBody></Card>

{this.state.showRollFeeTemplate && <Card> <CardBody>

  <InputGroup className="mb-3">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText
                                        style={{ width: "120px" }}
                                      >
                                        Student Name
                                      </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      type="text"
                                      name="studentName"
                                      id="studentName"
                                      value={this.state.studentName}
                                      autoComplete="studentName"
                                     disabled
                                     />
                                  </InputGroup>

                                  <br/>
                                  <Select
                            id="rollFeeTemplates"
                            name="rollFeeTemplates"

                          placeholder="Select Fee Template"
                            options={this.state.feeTemplates}
                          closeMenuOnSelect={true}
                         value={this.state.selectedFeeTemplate}
                         isClearable={true}
                         //menuIsOpen ={this.state.studentOpen}
                            isSearchable={true}

                            onChange={this.feeTemplateSelectHandler}
                            />
                            <br/>

{this.state.showFeeTemplate&& <p>

  <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >
                              <b>Template Type</b>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            size="lg"
                           name="templateType"
                            id="templateType"
                            value={this.state.templateType}
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
                            onChange={e => {this.setState({year:e.target.value})}}




                          />
                        </InputGroup>
                        {this.state.yearError &&(
                            <font color="red">
                              {" "}
                              <p>{this.state.yearError}</p>
                            </font>
                          )}



{this.state.showMonth&&(<p>
                        <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText style={{ width: "120px" }}>
                             <b>  Month</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              name="month"
                              id="month"
                              type="select"
                              value={this.state.month}
                              onChange={e=>{this.setState({month:e.target.value})}}
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
                          {this.state.monthError &&(
                            <font color="red">
                              {" "}
                              <p>{this.state.monthError}</p>
                            </font>
                          )}
                          </p>


                          )





                        }

{this.state.showQuarter&& <p>
<InputGroup className="mb-3">
    <InputGroupAddon addonType="prepend">
      <InputGroupText style={{ width: "120px" }}>
     <b>  Quarter</b>
      </InputGroupText>
    </InputGroupAddon>
    <Input
      name="quarter"
      id="quarter"
      type="select"
      value={this.state.quarter}
      onChange={e=>{this.setState({quarter:e.target.value})}}
    >
      <option value="">Select Quarter</option>
      <option value="Apr-Jun">Apr-Jun</option>
      <option value="Jul-Sep">Jul-Sep</option>
      <option value="Oct-Dec">Oct-Dec</option>
      <option value="Jan-Mar">Jan-Mar</option>

         </Input>


  </InputGroup>
  {this.state.quarterError &&(
                            <font color="red">
                              {" "}
                              <p>{this.state.quarterError}</p>
                            </font>
                          )}
  </p>}

  {this.state.showHalfYearly&& <p>
<InputGroup className="mb-3">
    <InputGroupAddon addonType="prepend">
      <InputGroupText style={{ width: "120px" }}>
     <b>  Half Year</b>
      </InputGroupText>
    </InputGroupAddon>
    <Input
      name="halfYear"
      id="halfYear"
      type="select"
      value={this.state.halfYear}
      onChange={e=>{this.setState({halfYear:e.target.value})}}
    >
      <option value="">Select Half Year</option>
      <option value="Apr-Sep">Apr-Sep</option>
      <option value="Oct-Mar">Oct-Mar</option>


         </Input>


  </InputGroup>
  {this.state.halfYearError &&(
                            <font color="red">
                              {" "}
                              <p>{this.state.halfYearError}</p>
                            </font>
                          )}
  </p>}


<Table bordered hover
>
                          <thead>
                            <tr style={{ 'backgroundColor': "palevioletred" }}>
                              <th className="text-center">
                                <h4> S.No.</h4>{" "}
                              </th>
                              <th className="text-center">
                                {" "}
                                <h4>Fee Category </h4>
                              </th>
                              <th className="text-center">
                                <h4> Amount(Rs)</h4>{" "}
                              </th>

                            </tr>
                          </thead>
                          <tbody>
                            {this.state.templateRows.map((item, idx) => (
                              <tr id="addr0" key={idx}>
                                <td align="center">
                                  <h4>{idx + 1}</h4>
                                </td>
                                <td align="center">
                                  <InputGroup className="mb-3">
                                    <Input
                                      type="text"
                                      name="feeType"
                                      value={this.state.templateRows[idx].feeType.charAt(0).toUpperCase()
                                         + this.state.templateRows[idx].feeType.slice(1)}

                                      className="form-control"
                                      size="lg"
                                      id="feeType"
                                      disabled
                                     style={{textAlign:'center'}}
                                    />
                                  </InputGroup>
                                </td>
                                <td align="center">
                                  <InputGroup className="mb-3">
                                    <Input
                                      name="amount"
                                      type="number"
                                      className="form-control"
                                      value={this.state.templateRows[idx].amount}
                                      style={{textAlign:'center'}}
                                      id="amount"
                                      size="lg"
                                      disabled
                                    />
                                  </InputGroup>
                                </td>

                              </tr>
                            ))}
                          </tbody>
                        </Table>

                      <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >
                              <b>Total Fee Amount(Rs)</b>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            size="lg"
                           name="totalAmount"
                            id="totalAmount"
                            value={this.state.totalAmount}
                          disabled



                          />
                        </InputGroup>

                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >
                              <b>Late Fee Fine(Rs)</b>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="number"
                            size="lg"
                           name="lateFeeFine"
                            id="lateFeeFine"
                            value={this.state.lateFeeFine}
                            onChange={e=>{this.setState({lateFeeFine:e.target.value})}}



                          />
 </InputGroup>



 <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >
                              <b>Past Due Amount(Rs)</b>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="number"
                            size="lg"
                           name="pastPendingDue"
                            id="pastPendingDue"
                            value={this.state.pastPendingDue}
                            onChange={e=>{this.setState({pastPendingDue:e.target.value})}}



                          />
                        </InputGroup>

<InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >
                              <b>Total Due Amount(Rs)</b>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="text"
                            size="lg"
                           name="totalDueAmount"
                            id="totalDueAmount"
                            value={
                            ( parseInt(this.state.totalAmount)+(parseInt(this.state.pastPendingDue)||0)+
                              (parseInt(this.state.lateFeeFine)||0))-(parseInt(this.state.paidAmount)||0)
                           }
                            disabled


                          />
                        </InputGroup>




                        <InputGroup className="mb-3">
                          <InputGroupAddon addonType="prepend">
                            <InputGroupText >
                              <b>Paid Fee Amount (Rs)</b>
                            </InputGroupText>
                          </InputGroupAddon>
                          <Input
                            type="number"
                            size="lg"
                           name="paidAmount"
                            id="paidAmount"
                            value={this.state.paidAmount}
                            onChange={e=>{this.setState({paidAmount:e.target.value})}}

                         />

                        </InputGroup>

                        {this.state.paidAmountError &&(
                            <font color="red">
                              {" "}
                              <p>{this.state.paidAmountError}</p>
                            </font>
                          )}

                        <InputGroup className="mb-2">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                              <b>  Date of Submission</b>
                              </InputGroupText>
                            </InputGroupAddon>

                            &nbsp; &nbsp; &nbsp;
                            <DatePicker

                              name="doj"
                              id="doj"
                              value={this.state.dos}
                              onChange={date=>{this.setState({dos:date})}}
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
                              type="submit"
                            >
                              Submit
                            </Button>
                          </Col>

                          <Col>
                            <Button
                              onClick={() => {
                                this.reset();
                                this.setState({activeTab:"2"})

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





  </CardBody>

  </Card>}


              </Col>
            </Row>
          </TabPane>
        </TabContent>



            </div>
        );
    }
}

export default AddFees;

