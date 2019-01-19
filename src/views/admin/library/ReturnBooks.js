import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
import DatePicker from 'react-date-picker';

import { confirmAlert } from 'react-confirm-alert';



import 'react-confirm-alert/src/react-confirm-alert.css';
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


class IssueBooks extends Component {

    constructor(props) {
        super(props);
        this.fetchClassDetails();

        this.state = {
          lateFineDisabled:false,
            class:"",
            section:"",
            classError:"",
rowError:"",
            studentsDataArray:[],
                        studentOpen:true,

                        activeTab:"1",

            selectedStudent:[],
            error:"",
loader:false,


            year:new Date().getFullYear()+"-"+(new Date().getFullYear()+1),
showBooks:false,
            remarks:"",
            dor:new Date(Date.now()),

            dorError:"",
            sectionError:"",
            modalSuccess:false,
            success:false,
            studentName:"",
            rollNo:"",


            studentError:"",
            classDetails:[],
            classes:[],
            sectionArray: [],
            studentsDataArray:[],
            existingBooks:[],
            allBooksData:[],

            rows: [{ bookName:"",
            quantity:"",
            uniqueBookId:"",

            }],
            existingStaff:[],
            selectedStaff:[],
            staffError:"",
            modalMessage:"",
            wholeClass:false,
            hideStudents:false
        };


        this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
         this.studentSubmitHandler = this.studentSubmitHandler.bind(this);
         this.staffSubmitHandler = this.staffSubmitHandler.bind(this);

         this.studentSelectedHandler = this.studentSelectedHandler.bind(this);
         this.toggle = this.toggle.bind(this);

         this.toggleSuccess = this.toggleSuccess.bind(this);


this.fetchStaff=this.fetchStaff.bind(this);

    }







    toggle(tab) { this.reset();
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }


    }

    toggleSuccess() {

      this.setState({
        modalSuccess: !this.state.modalSuccess
      });

    }


    studentSubmitHandler(e){
      e.preventDefault();
console.log("In FeeSubmit:"+ JSON.stringify(this.state));
var submit=true;

this.setState({classError:"", studentError:"", doiError:"",rowError:"" ,sectionError:"", error:"", success: false,
modalSuccess: false,loader:true})



if(!this.state.class)
{
  this.setState({classError:"Please Select Class", loader:false});
  submit=false;


  }



  if(!this.state.section)
{
  this.setState({sectionError:"Please Select Section",loader:false});
  submit=false;

  }

  if(!this.state.doi)
{
  this.setState({doiError:"Please Enter Date of Issue",loader:false});
  submit=false;

  }

  if(!this.state.selectedStudent.value)
  {
    this.setState({studentError:"Please Select Student",loader:false});
    submit=false;

    }


this.state.rows.forEach(element=>{
if (!element.bookName){
this.setState({rowError:"Please select the book(s) in each row",loader:false});
submit=false;
return;}

if (!element.dor){
  this.setState({rowError:"Please select the Return Due date in each row",loader:false});
  submit=false;
  return;}


})

for(var i=0;i<this.state.rows.length;i++)

{for(var j=0;j<this.state.rows.length;j++)
{
  if(this.state.rows[i].bookName.label===this.state.rows[j].bookName.label&&(i!=j))
{
  this.setState({rowError:"Duplicate Books found in Rows: "+(j+1)+" and  "+(i+1)+". Duplcate books Not allowed!",loader:false});
submit=false;
break;
}


}
}


  if(submit)
  {
console.log("Issuing Book ");
    axios
    .post("http://localhost:8001/api/issueBook", {"issuedBookDetails":this.state.rows,"class":this.state.class,
"section":this.state.section, "doi":this.state.doi,"remarks":this.state.remarks, "issuedTo":this.state.selectedStudent.label })
    .then(result => {
        console.log("result.data " + JSON.stringify(result.data));

        if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,
                modalMessage:this.state.rows.length+ "books issued to Student: "+this.state.selectedStudent.label



              });

              else if (result.data.error) {

                 this.setState({error:JSON.stringify(result.data.error)});
            }


    });



  }








    }

    staffSubmitHandler(e){
      e.preventDefault();
console.log("In Staff Issue:"+ JSON.stringify(this.state));
var submit=true;

this.setState({ staffError:"", doiError:"",rowError:"" , error:"", success: false,
modalSuccess: false});




  if(!this.state.doi)
{
  this.setState({doiError:"Please Enter Date of Issue"});
  submit=false;

  }

  if(!this.state.selectedStaff.value)
  {
    this.setState({staffError:"Please Select Staff/Employee"});
    submit=false;

    }


for(var i =0;i<this.state.rows.length;i++){
if (!this.state.rows[i].bookName){
this.setState({rowError:"Please select the book(s) in each row"});
submit=false;
return;}

if (!this.state.rows[i].dor){
  this.setState({rowError:"Please select the Return Due date in each row"});
  submit=false;
  return;}







}

for(var i=0;i<this.state.rows.length;i++)

{for(var j=0;j<this.state.rows.length;j++)
{
  if(this.state.rows[i].bookName.label===this.state.rows[j].bookName.label&&(i!=j))
{
  this.setState({rowError:"Duplicate Books found in Rows: "+(j+1)+" and  "+(i+1)+". Duplcate books Not allowed!"});
submit=false;
break;
}


}
}

  if(submit)
  {
console.log("Issuing Book  Staff");
    axios
    .post("http://localhost:8001/api/issueBook", {"issuedBookDetails":this.state.rows,"class":"NA",
"section":"NA", "doi":this.state.doi,"remarks":this.state.remarks, "issuedTo":this.state.selectedStaff.label })
    .then(result => {
        console.log("result.data " + JSON.stringify(result.data));

        if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,
                modalMessage:this.state.rows.length+ " books issued to: "+this.state.selectedStaff.label



              });

              else if (result.data.error) {

                 this.setState({error:JSON.stringify(result.data.error)});
            }


    });



  }








    }

    fetchStaff()
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
            existingStaff: temp,

          });
        }
      });

    }

    fetchClassDetails() {

        axios.get("http://localhost:8001/api/fetchAllClassDetails").then(cRes => {
console.log("Class Details: "+JSON.stringify(cRes.data))
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
        console.log('ClassDetails - fetchClassDetails - All class details - ' + JSON.stringify(this.state.classDetails));
            });




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
        section:"",selectedStudent:[] });

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
                "label":element.firstname.charAt(0).toUpperCase()+element.firstname.slice(1)+" "+element.lastname.charAt(0).toUpperCase()+element.lastname.slice(1)+" ("+element.username+")"})

                })
                temp.sort();
                this.setState({studentsDataArray:temp});

               });
            }
          });




        });







      }

    studentSelectedHandler(e){
if(e)
     { console.log("In Student "+JSON.stringify(e));
     this.setState({
      selectedStudent: e

    });

     axios
     .post("http://localhost:8001/api/gettingIssuedBooks",{"issuedTo":e.label})
     .then(result => {
       console.log("Issued book data " + JSON.stringify(result.data));
       if (result.data) {
var temp=[];
for(var i=0;i<result.data.length;i++)
for(var j=0;j<result.data[i].issuedBookDetails.length;j++)
{

  temp.push({"bookName":result.data[i].issuedBookDetails[j].bookName.label,
			"uniqueBookId":result.data[i].issuedBookDetails[j].uniqueBookId,
			"doi":result.data[i].doi.substring(0,10),
			"dor":result.data[i].issuedBookDetails[j].dor.substring(0,10),
			"delay":Math.ceil((new Date(this.state.dor).getTime() - new Date(result.data[i].issuedBookDetails[j].dor).getTime())/ (1000 * 3600 * 24))

 });

console.log(JSON.stringify(temp[j].delay));
if(temp[j].delay<0)
temp[j]["delay"]=0;



}


           this.setState({
           rows: temp,
           showBooks:true

         });
       }
       else if(result.data.error)
       this.setState({
        error: result.data.error

      });
     });


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
            <h5>  Return Book from Student </h5>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}

            >
            <h5> Return Book from Staff</h5>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
{this.state.success && (
  <Modal
    isOpen={this.state.modalSuccess}
    className={"modal-success " + this.props.className}
    toggle={this.toggleSuccess}
  >
    <ModalHeader toggle={this.toggleSuccess}>
     {this.state.modalMessage}
    </ModalHeader>
  </Modal>
)}
              <Col sm="12">
              <Card className="mx-5">
                          <CardBody className="p-1">

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
   {this.state.studentError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.studentError}</p>
                                    </font>
                                  )}


<br/>
<InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Date of Return</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="dor"
                                id="dor"
                                value={this.state.dor}
                                onChange={date=>{this.setState({dor:date},()=>{
                                  console.log("DOR: "+this.state.dor);
                                  this.studentSelectedHandler(this.state.selectedStudent)})}}
                              />


                            </InputGroup>
                            {this.state.dorError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.dorError}</p></h6>
                                </font>
                              )}

<br/>
{this.state.showBooks && <p>
<Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "palevioletred" }}>
                                <th className="text-center">
                                  <h5> S.No.</h5>{" "}
                                </th>
                                <th className="text-center">

                                  <h5>Book Name </h5>
                                </th>
                                <th className="text-center">
                                  <h5>Unique Book Id</h5>
                                </th>

                                <th className="text-center">
                                  <h5>Date of Issue</h5>
                                </th>

                                <th className="text-center">
                                  <h5>Expected Return Date</h5>
                                </th>
                                <th className="text-center">
                                  <h5>Delay(in Day)</h5>
                                </th>
                                <th className="text-center">
                                  <h5>Late Fine/Day(Rs)</h5>
                                </th>
                                <th className="text-center">
                                  <h5>Total Fine(Rs)</h5>
                                </th>



                                <th className="text-center">
                                <h5>Actions</h5>

                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td   align="center">
{this.state.rows[idx].bookName}



                                  </td>



                                  <td align="center">
                                  {this.state.rows[idx].uniqueBookId}
                                  </td>

                                  <td align="center">
                                  {this.state.rows[idx].doi}
                                  </td>



                                  <td align="center">

{this.state.rows[idx].dor}
                                  </td>

                                  <td align="center">

{this.state.rows[idx].delay}
                                  </td>

                                  <td align="center">


                                      <Input
                                        name="lateFine"
                                        type="text"
                                        className="form-control"
                                        value={this.state.rows[idx].lateFine}

                                        style={{textAlign:'center'}}
                                        id="lateFine"
                                        size="sm"

                                        onChange={e=>{ e.preventDefault();

                                          const { name, value } = e.target;
                                          const temp = this.state.rows;
                                          temp[idx][name] = value;

                                          temp[idx]["totalFine"]= value * temp[idx].delay;


                                          this.setState(
                                            {
                                              rows: temp
                                            }

                                          );}}

                                      />

                                  </td>
                                  <td align="center">

{this.state.rows[idx].totalFine}
                                  </td>


                                  <td align="center">
                                                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={e=>{ var submit= true;
                                        this.setState({rowError:""});
                                        console.log(this.state.rows[idx].lateFine);
if(!this.state.rows[idx].lateFine && this.state.rows[idx].delay>0)
{
  this.setState({rowError: "Please enter Late Fine/day for Book: "+this.state.rows[idx].bookName});
  submit=false;
}


if (submit === true) {

  confirmAlert({
      title: 'Confirm to Proceed',
      message: 'Are you sure to Return this Book?',
      buttons: [
        {
          label: 'Yes',
          onClick: () =>

        {

              console.log("Returning Book ");

              axios
              .post("http://localhost:8001/api/returnBook", {"issuedBook":this.state.rows[idx],"dor": this.state.dor,
              "issuedTo":this.state.selectedStudent.label})
              .then(result => {
                  console.log("result.data " + JSON.stringify(result.data));

                  if (result.data.msg === "Success")
                        this.setState({

                          success: true,
                          modalSuccess: true,
                          modalMessage:"Book: "+ this.state.rows[idx].bookName + " Returned to Library! "


                        },()=>  this.studentSelectedHandler(this.state.selectedStudent));

                        else if (result.data.error) {

                           this.setState({error:JSON.stringify(result.data.error)});
                      }


              });


                          }

        },
        {
          label: 'No',

        }
      ]
    })}








                                      }}
                                      size="lg"
                                    >
                                      Return
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          {this.state.rowError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.rowError} </p>
                              </h6>{" "}
                            </font>
                          )}
</p>}



{this.state.error &&
                              <font color="red">
                                {" "}
                                <p>{JSON.stringify(this.state.error)}</p>
                              </font>
                            }



</CardBody></Card>
              </Col>
            </Row>


          </TabPane>
          <TabPane tabId="2">

          <Row>

              <Col sm="12">
              <Card className="mx-5">
                          <CardBody className="p-1">

                                         <Select
                            id="staffSelect"
                            name="staffSelect"

                          placeholder="Select Staff/Employee or Type to search"
                            options={this.state.existingStaff}
                          closeMenuOnSelect={true}
                         value={this.state.selectedStaff}
                         isClearable={true}
                         //menuIsOpen ={this.state.studentOpen}
                            isSearchable={true}

                            onChange={selected=>{this.setState({selectedStaff:selected})}}
                            />
   {this.state.staffError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.staffError}</p>
                                    </font>
                                  )}

<br/>

<InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Date of Issue</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="doi"
                                id="doi"
                                value={this.state.doi}
                                onChange={date=>{this.setState({doi:date},()=>{console.log("DOS: "+this.state.doi)})}}
                              />


                            </InputGroup>
                            {this.state.doiError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.doiError}</p></h6>
                                </font>
                              )}

<br/>
<Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "palevioletred" }}>
                                <th className="text-center">
                                  <h5> S.No.</h5>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h5>Book Name </h5>
                                </th>
                                <th className="text-center">
                                  <h5>Available Quantity</h5>{" "}
                                </th>
                                <th className="text-center">
                                  <h5>Unique Book Id</h5>{" "}
                                </th>
                                <th className="text-center">
                                  <h5>Return due date</h5>{" "}
                                </th>



                                <th className="text-center">
                                  <Button
                                    onClick={this.handleAddRow}
                                    className="btn btn-primary"
                                    color="primary"


                                  >

                                    Add Row
                          </Button>

                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td   style={{width:"200px"}}>

                                   <Select                            id="bookName"
                            name="bookName"

                          placeholder="Select Book"
                            options={this.state.existingBooks}
                          closeMenuOnSelect={true}
                         value={this.state.rows[idx].bookName}
                         isClearable={true}
                              isSearchable={true}

                            onChange={selectedItem=>{


                                const temp = this.state.rows;
                                temp[idx]["bookName"] = {"label":selectedItem.value.charAt(0).toUpperCase()+
                                selectedItem.value.slice(1),"value":selectedItem.value};

                                for(var i=0;i<this.state.allBooksData.length;i++)
                                {
                                    if(this.state.allBooksData[i].bookName===selectedItem.value)
                                    {
                                      for(var u=0;u<this.state.allBooksData[i].uniqueBookIds.length;u++)
{

  if(!this.state.allBooksData[i].uniqueBookIds[u].isIssued)
 { console.log(this.state.allBooksData[i].uniqueBookIds[u].isIssued);
  temp[idx]["uniqueBookId"]=this.state.allBooksData[i].uniqueBookIds[u].value;
  break;}
}

                                        temp[idx]["quantity"]=this.state.allBooksData[i].quantity;


                                    }
                                }


                                this.setState(
                                  {
                                    rows: temp
                                  })

                            }}
                            />


                                  </td>



                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="quantity"
                                        type="text"
                                        className="form-control"
                                        value={this.state.rows[idx].quantity}

                                        style={{textAlign:'center'}}
                                        id="quantity"
                                        size="lg"
                                        disabled
                                      />
                                    </InputGroup>
                                  </td>

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="uniqueBookId"
                                        type="text"
                                        className="form-control"
                                        value={this.state.rows[idx].uniqueBookId}
                                        disabled
                                        style={{textAlign:'center'}}
                                        id="quantity"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>



                                  <td align="center">

                                  <DatePicker

name="dor"
id="dor"
value={this.state.rows[idx].dor}
onChange={date=>{ var temp=this.state.rows;
temp[idx]["dor"]=date;

this.setState({rows:temp})}

}
/>
                                  </td>



                                  <td align="center">
                                  { idx>0 &&
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      //onClick={this.handleRemoveSpecificRow(idx)}
                                      size="lg"
                                    >
                                      Remove
                                    </Button>}
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                          {this.state.rowError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.rowError} </p>
                              </h6>{" "}
                            </font>
                          )}


<br/>
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

{this.state.error &&
                              <font color="red">
                                {" "}
                                <p>{JSON.stringify(this.state.error)}</p>
                              </font>
                            }
<Row>
                            <Col>
                              <Button
                                onClick={this.staffSubmitHandler}
                                size="lg"
                                color="success"
                                block
                              >
                                Submit
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={this.reset}
                                size="lg"
                                color="secondary"
                                block
                              >
                             Reset
                              </Button>
                            </Col>
                          </Row>


</CardBody></Card>
              </Col>
            </Row>

           </TabPane>
        </TabContent>



            </div>
        );
    }
}

export default IssueBooks;

