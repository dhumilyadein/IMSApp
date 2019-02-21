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
      this.fetchClassDetails();
        this.state = {

class:"",
section:"",
classError:"",
divToPrint:"",


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
showViewCard:false,
month:"",
quarter:"",
halfYear:"",
totalDueAmount:"",
lateFeeFine:"0",
paidAmount:"",
pastPendingDue:"0",
paidAmount:"",
remarks:"",
dos:Date(Date.now()).toString(),
yearError:"",
quarterError:"",
halfYearError:"",
monthError:"",
paidAmountError:"",
dosError:"",
dateError:"",
sectionError:"",
modalSuccess:false,
success:false,
studentName:"",
rollNo:"",
showRollFeeTemplate:false,
showFeeRecords:false,
feeRecords:[],
defaulters:[],
classDetails:[],
classes:[],
sectionArray: [],
studentsDataArray:[],
startDate:"",
endDate:new Date(Date.now()),
        };

       


        this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);

         this.studentSelectedHandler = this.studentSelectedHandler.bind(this);
         this.toggle = this.toggle.bind(this);
         this.downloadPDF = this.downloadPDF.bind(this);
         this.printPDF = this.printPDF.bind(this);
         this.getStudentByRollNo = this.getStudentByRollNo.bind(this);
this.reset=this.reset.bind(this);
this.feeCollection=this.feeCollection.bind(this);
 this.getFeeDefaulters=this.getFeeDefaulters.bind(this);

 
    }

    reset()
    {
      this.setState( {
        class:"",
        section:"",
        classError:"",
        divToPrint:"",
        
        
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
        showViewCard:false,
        month:"",
        quarter:"",
        halfYear:"",
        totalDueAmount:"",
        lateFeeFine:"0",
        paidAmount:"",
        pastPendingDue:"0",
        paidAmount:"",
        remarks:"",
        dos:Date(Date.now()).toString(),
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
        feeRecords:[],
        defaulters:[],
        classDetails:[],
        classes:[],
        sectionArray: [],
        studentsDataArray:[],
                
        
                });


    }

    feeCollection(){
      var submit = true;
      console.log("in Fee Collection State: " + JSON.stringify(this.state));
  
      this.setState({
        dateError: "",
      }, () => {
        if (!this.state.startDate) {
          this.setState({ dateError: "Please select Start Date" });
          submit = false;}
  
          if (!this.state.endDate) {
              this.setState({  dateError: "Please select End Date"});
              submit = false;}
  
              if(new Date(this.state.startDate).getTime()>new Date(this.state.endDate).getTime())
              {
                  this.setState({  dateError: "Start Date can't be Greater than End Date!"});
                  submit = false;}
  
  
  
  
        if (submit === true) {
  
        
              console.log("Getting Fee Collection ");
              axios
                .post("http://localhost:8001/api/feeCollection", {"doe":this.state.endDate,"dos":this.state.startDate,
                "class":this.state.class,"section":this.state.section})
                .then(result => {
                  console.log("RESULT.data " + JSON.stringify(result.data));
  
                  if(result.data.error)
                  this.setState({
                      dateError:result.data.error
                    });
  
                  if(result.data.data.length===0)
                  {
  
                    this.setState({
                      dateError:"No Records Found!"
                    });}
                  else if(result.data.data.length>0)
                  {
                      this.setState({
                          showSearchResults:true,
                          existingAddedItems:result.data.data
                        });
  
                  }
  
  
  
                });
  
          
  
        
  
  
        }
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
        this.setState({studentName: result.data.firstname.charAt(0).toUpperCase() + result.data.firstname.slice(1)+" "+
        result.data.lastname.charAt(0).toUpperCase() + result.data.lastname.slice(1)+
         " ("+(result.data.username.toLowerCase())+")", showRollFeeTemplate:true},()=>
         {
          var tempStudentdetails={"value":result.data.username, 
          "label":this.state.studentName}

this.studentSelectedHandler(tempStudentdetails);

         });

         
      }

      else if (result.data.error) {

        return this.setState({error:"Roll Number not Found!",showRollFeeTemplate:false});
      }


  });

}

        }

    toggle(tab) { this.reset();
      this.fetchClassDetails();
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        },()=>{if(this.state.activeTab==="3") this.getFeeDefaulters();});
      }
    }

    downloadPDF(){

      const input = document.getElementById(this.state.divToPrint);
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg');
        const pdf = new jsPDF("l");
        var width = pdf.internal.pageSize.getWidth();
var height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'JPEG', 10, 10,width,height);
        // pdf.output('dataurlnewwindow');
        pdf.save("feeReceipt.pdf");
      })
    ;
    }

    printPDF(){

      const input = document.getElementById(this.state.divToPrint);
    html2canvas(input)
      .then((canvas) => {
        const imgData = canvas.toDataURL('image/jpeg');
        const pdf = new jsPDF("landscape");
        var width = pdf.internal.pageSize.getWidth();
        var height = pdf.internal.pageSize.getHeight();
        pdf.addImage(imgData, 'JPEG', 10, 10,width,height);
       
      
        pdf.autoPrint();
        pdf.save("Save&OpenToPrint.pdf");
        //pdf.output('dataurlnewwindow');
      
       // window.open(pdf.output('datauristring'));
      })
    ;
    }


    fetchClassDetails() {

      axios.get("http://localhost:8001/api/fetchAllClassDetails").then(cRes => {
  
        if (cRes.data.errors) {
  
          return this.setState({ errors: cRes.data.errors });
  
        } else {
  
          this.setState({ classDetails: cRes.data },()=>{

            var classArray = [];
      this.state.classDetails.forEach(element => {
  
        console.log("element.class - " + element.class);
        classArray.push(element.class);
      });
     // console.log("classArray - " + classArray);
     var uniqueItems = Array.from(new Set(classArray));
   


      this.setState({ classes: uniqueItems });
          });
  
          console.log('ClassDetails - fetchClassDetails - All class details - ' + JSON.stringify(this.state.classDetails));
  
        
        }
      });
    }
  
    /**
     * @description - fetches unique classes from the class detail from DB
     */
  
  
    classChangeHandler(e) {
  
      var selectedClass = e.currentTarget.value;
      console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + selectedClass);
      this.setState({ class: selectedClass,
      section:"",selectedStudent:[],showFeeTemplate:false, selectedFeeTemplate:[] });
  
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
     
    }
  
    sectionChangeHandler(e) {
  
     
      this.setState({ section: e.currentTarget.value },()=>{
        this.state.classDetails.forEach(element => {
  
         
          if (element.class === this.state.class && element.section === this.state.section) {
                this.setState({
              studentsDataArray : element.studentsData
             },()=>{ console.log("studentsDataArray: "+ JSON.stringify(this.state.studentsDataArray));
              var temp=[];
              this.state.studentsDataArray.forEach(element=>{
              temp.push({"value":element.username,
              "label":element.firstname+" "+element.lastname+"("+element.username+")"})
              
              })
              this.setState({studentsDataArray:temp});

             });
          }
        });


        

      });
  
     
                
  
     
  
   
    }


    studentSelectedHandler(e){
if(e)
     { console.log("In Student "+JSON.stringify(e));

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

    getFeeDefaulters()

    {   axios
      .get("http://localhost:8001/api/getFeeDefaulters")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data.length>0) {
          this.setState({
            defaulters: result.data
          },()=>{console.log("Defaulters: "+JSON.stringify(this.state.defaulters[0].name))});
        }
      });

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


          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}

            >
            <h5>  Fee Dafaulters</h5>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '4' })}
              onClick={() => { this.toggle('4'); }}

            >
            <h5> Fee Collection</h5>
            </NavLink>
          </NavItem>
          
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>

              <Col sm="9">
        {  !this.state.showViewCard &&    <Card className="mx-5">
                          <CardBody className="p-1">

                            <br/>

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
                                    </Input>
                                  </InputGroup>
                                  { this.state.classError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.classError}</p>
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
                                        onChange={this.sectionChangeHandler}
                                      >
                                        <option value="">Select</option>
                                        {this.state.sectionArray.map(element => {
                                          return (<option key={element} value={element}>{element}</option>);
                                        }
                                        )}

                                      </Input>
                                    </InputGroup>
                                  
                                  {this.state.sectionError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.sectionError}</p>
                                    </font>
                                  )}


                     <Select
                            id="studentSelect"
                            name="studentSelect"

                          placeholder="Select Student or Type to search"
                            options={this.state.studentsDataArray}
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
                                        dos:this.state.feeRecords[idx].dos.substr(0,10),
                                        remarks:this.state.feeRecords[idx].remarks,
                                        divToPrint: "divToPrint1"






                                      },()=>{console.log("Div To print: "+this.state.divToPrint)})}}


                                      size="lg"
                                    >
                                      View
                                    </Button>
                                    &nbsp;&nbsp;

                                    <Button
                                      color="warning"
                                     
                                      onClick={()=>{
                                        this.setState({
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
                                        dos:this.state.feeRecords[idx].dos.substr(0,10),
                                        remarks:this.state.feeRecords[idx].remarks,
                                        divToPrint: "divToPrint1"






                                      },()=>{ this.printPDF();});
                                     
                                    }
                                    
                                    }

                                      size="lg"
                                    >
                                      Print
                                    </Button>
                                    &nbsp;&nbsp;
                                    <Button
                                      color="danger"
                                      
                                      onClick={()=>{
                                        this.setState({
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
                                        dos:this.state.feeRecords[idx].dos.substr(0,10),
                                        remarks:this.state.feeRecords[idx].remarks,
                                        divToPrint: "divToPrint1"






                                      },()=>{ this.downloadPDF();});
                                     
                                    }
                                    
                                    }

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
{this.state.showViewCard && <Card><CardBody>

<div id="divToPrint1">
          

         <div textAlign="center">  <h3>         Fee Receipt     </h3></div>
         <br/>
        <Card><CardBody>   <Row>        <h5>Sudent Name:</h5> 
                      
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
                      <font color="blue"> <h5>{this.state.dos} </h5></font>
                           


                           
                           </Row>
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
                      {this.state.remarks && <Row>
                        
                        <h5>Remarks</h5> 
                      
                      &nbsp; &nbsp;
                      <font color="blue"> <h5>{this.state.remarks} </h5></font>
                      
                       </Row> }
                      </CardBody></Card>
                      <br/>
                      <Table  bordered hover
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
                                    <h4>Total Fee Amount(Rs.): </h4>
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
                                    <h4>Total Paid Amount(Rs.):</h4>
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
                                   onClick={this.printPDF}
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
              <Col sm="9">

         {!this.state.showViewCard  &&  <Card>

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

                        </CardBody></Card>}

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
                                          showRollFeeTemplate:false,
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
                                          dos:this.state.feeRecords[idx].dos.substr(0,10),
                                          remarks:this.state.feeRecords[idx].remarks,
                                          divToPrint:"divToPrint2"
  
  
  
  
  
  
                                        },()=>{console.log("Student name: "+this.state.quarter)})}}
  
  
                                        size="lg"
                                      >
                                        View
                                      </Button>
                                      &nbsp;&nbsp;
                                      <Button
                                        color="warning"
                                       
                                        onClick={()=>{
                                          this.setState({
                                            showViewCard:true,
                                            showRollFeeTemplate:false,
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
                                          dos:this.state.feeRecords[idx].dos.substr(0,10),
                                          remarks:this.state.feeRecords[idx].remarks,
                                          divToPrint:"divToPrint2"
  
  
  
  
  
  
                                        },()=>{ this.printPDF();});
                                       
                                      }
                                      
                                      }
  
                                        size="lg"
                                      >
                                        Print
                                      </Button>
                                      &nbsp;&nbsp;
                                      <Button
                                        color="danger"
                                        
                                        onClick={()=>{
                                          this.setState({
                                            showViewCard:true,
                                            showRollFeeTemplate:false,
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
                                          dos:this.state.feeRecords[idx].dos.substr(0,10),
                                          remarks:this.state.feeRecords[idx].remarks,
                                          divToPrint:"divToPrint2"
  
  
  
  
  
  
                                        },()=>{ this.downloadPDF();});
                                       
                                      }
                                      
                                      }
  
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





  </CardBody>

  </Card>}

{this.state.showViewCard &&
  <Card><CardBody>
  
  <div id="divToPrint2">
           <Card><CardBody>    
  
           <div textAlign="center">  <h3>         Fee Receipt     </h3></div>
           <br/>
                       <Card><CardBody>   <Row>        <h5>Sudent Name:</h5> 
                        
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
                        {this.state.remarks && <Row>
                          
                          <h5>Remarks</h5> 
                        
                        &nbsp; &nbsp;
                        <font color="blue"> <h5>{this.state.remarks} </h5></font>
                        
                         </Row> }
                        </CardBody></Card>
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
                                      <h4>Total Fee Amount(Rs.): </h4>
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
                                      <h4>Total Paid Amount(Rs.):</h4>
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
  <br/>
  <br/>
                       
                         </CardBody> </Card> </div>
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
                                     onClick={this.printPDF}
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
                                     onClick={()=>{this.setState({showViewCard:false,showRollFeeTemplate:true})}}
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
      <TabPane tabId="3">
      
<Card><CardBody>
  
<Table bordered hover
>
                            <thead>
                              <tr style={{ 'backgroundColor': "palevioletred" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Student Name</h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Class </h4>
                                </th>
                                <th className="text-center">
                                  <h4> Roll No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  <h4> Total Due Amount(Rs.)</h4>{" "}
                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.defaulters.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td align="center">
                                <h5>   {this.state.defaulters[idx].name}</h5>

                                        
                                  </td>
                                  <td align="center">
                                  <h5>   {this.state.defaulters[idx].class}</h5>
                                       
                                  </td>

                                  <td align="center">
                                  <h5>   {this.state.defaulters[idx].rollNo}</h5>
                                       
                                  </td>



                                  <td align="center">
                                  <h5>   {this.state.defaulters[idx].pendingFeeAmount}</h5>
                                       
                                  </td>

                                
                                </tr>
                              ))}
                            </tbody>
                          </Table>

  
  </CardBody></Card>
      
      </TabPane>
      <TabPane tabId="4">
            <Row>

              <Col sm="12">







                          <h5> Choose Date Period</h5>
                          <br/>
                          <Row>
                          <InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b> Start Date</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="startDate"
                                id="startDate"
                                value={this.state.startDate}
                                onChange={date=>{this.setState({startDate:new Date(date.getTime()-(date.getTimezoneOffset() * 60000))},()=>{console.log("DOS: "+this.state.dos)})}}
                              />
&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
<InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b> End Date</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="endDate"
                                id="endDate"
                                value={this.state.endDate}
                                onChange={date=>{this.setState({endDate:new Date(date.getTime()-(date.getTimezoneOffset() * 60000))},()=>{console.log("DOe: "+this.state.doe)})}}
                              />
                            </InputGroup>



 </Row>
 {this.state.dateError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.dateError}</p></h6>
                                </font>
                              )}
<br/>
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
                                      onChange={e=>{this.setState({class:e.target.value})}}
                                    >
                                      <option value="">All Classes</option>
                                      {this.state.classes.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                    </Input>
                                  </InputGroup>
                                  { this.state.classError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.classError}</p>
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
                                        onChange={e=>{this.setState({section:e.target.value})}}
                                      >
                                        <option value="">All Sections</option>
                                        {this.state.sectionArray.map(element => {
                                          return (<option key={element} value={element}>{element}</option>);
                                        }
                                        )}

                                      </Input>
                                    </InputGroup>
                                 


<Row >
                            <Col>
                              <Button
                                onClick={this.feeCollection}
                                size="lg"
                                color="success"

                              >
                                Search
                              </Button>
                            </Col>


                          </Row>
                          <br /> <br />

{(this.state.showSearchResults && this.state.existingAddedItems.length>0) &&<p>

<h3 align="center"> Search Results</h3>
                          <br />


                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>List Name </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Date</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Paid Amount(Rs)</h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Remarks</h4>
                                </th>

                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingAddedItems.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingAddedItems[idx].listName.charAt(0).toUpperCase() +
                                      this.state.existingAddedItems[idx].listName.slice(1)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingAddedItems[idx].dos.substring(0,10)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingAddedItems[idx].grandTotal}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingAddedItems[idx].remarks}</h5>
                                  </td>

                                  <td align="center">
                                  <Button
                                      color="primary"
                                      onClick={e=>{
                                        this.setState({
                                            showSearchResults:false,
                                            showAddedItem:true,
                                            viewItem:this.state.existingAddedItems[idx]
                                        })}
                                    }


                                      size="lg"
                                    >
                                      View Details
                                    </Button>
                                    &nbsp; &nbsp;




                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>


                          </p>     }



{this.state.showAddedItem && <p>

<Card className="mx-1">
<CardBody className="p-2">
  <h3 align="center"> Added Item Details</h3>
  <br />
  <InputGroup className="mb-3">
    <InputGroupAddon addonType="prepend">
      <InputGroupText >
        <b>List Name</b>
      </InputGroupText>
    </InputGroupAddon>
    <Input


      value={this.state.viewItem.listName.charAt(0).toUpperCase() + this.state.viewItem.listName.slice(1)}
     disabled
    />
  </InputGroup>


<InputGroup className="mb-2">
      <InputGroupAddon addonType="prepend">
        <InputGroupText >
        <b>  Date of Submission</b>
        </InputGroupText>
      </InputGroupAddon>

      &nbsp; &nbsp; &nbsp;
      <Input

        value={this.state.viewItem.dos.substring(0,10)}
       disabled
      />


    </InputGroup>

  <Table bordered hover>
    <thead>
      <tr style={{ 'backgroundColor': "palevioletred" }}>
        <th className="text-center">
          <h5> S.No.</h5>{" "}
        </th>
        <th className="text-center">
          {" "}
          <h5>Item Name </h5>
        </th>
        <th className="text-center">
          <h5>Unit</h5>{" "}
        </th>
        <th className="text-center">
          <h5>Quantity</h5>{" "}
        </th>

        <th className="text-center">
          <h5>Cost/Unit(Rs)</h5>{" "}
        </th>
        <th className="text-center">
          <h5>Total(Rs)</h5>{" "}
        </th>



      </tr>
    </thead>
    <tbody>
      {this.state.viewItem.itemRows.map((item, idx) => (
        <tr id="addr0" key={idx}>
          <td align="center">
            <h4>{idx + 1}</h4>
          </td>
          <td   >

          {this.state.viewItem.itemRows[idx].itemName.label}


          </td>



          <td>
           {this.state.viewItem.itemRows[idx].unit}


          </td>

          <td>
          {this.state.viewItem.itemRows[idx].quantity}
          </td>

          <td>
          {this.state.viewItem.itemRows[idx].costPerItem}
          </td>

          <td>
          {this.state.viewItem.itemRows[idx].totalAmount}
          </td>


        </tr>
      ))}
    </tbody>
  </Table>


<InputGroup className="mb-3">
    <InputGroupAddon addonType="prepend">
      <InputGroupText >
        <b>Grand Total Amount(Rs)</b>
      </InputGroupText>
    </InputGroupAddon>
    <Input
      type="text"
      size="lg"
     name="grandTotal"
      id="grandTotal"
     value={this.state.viewItem.grandTotal}
      disabled


    />
  </InputGroup>

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
     value={this.state.viewItem.remarks}
    disabled

    />
  </InputGroup>

  <br /> <br />
  <Row>
    <Col>
      <Button
        onClick={e=>{this.setState({showSearchResults:true,
        showAddedItem:false})}}
        size="lg"
        color="secondary"
        block
      >
        Go back
      </Button>
    </Col>


  </Row>
</CardBody>

</Card>
</p>}






              </Col>
            </Row>
          </TabPane>
         
        </TabContent>



            </div>
        );
    }
}

export default AddFees;

