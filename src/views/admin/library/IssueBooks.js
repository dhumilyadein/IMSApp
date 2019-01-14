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


class IssueBooks extends Component {

    constructor(props) {
        super(props);
        this.fetchClassDetails();
        this.getExistingBooks();
        this.state = {

            class:"",
            section:"",
            classError:"",
rowError:"",
            studentsDataArray:[],
                        studentOpen:true,

                        activeTab:"1",

            selectedStudent:[],
            error:"",



            year:new Date().getFullYear()+"-"+(new Date().getFullYear()+1),

            remarks:"",
            doi:new Date(Date.now()),

            doiError:"",
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
            availableQuantity:"",
            uniqueBookId:"",

            }],

        };


        this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
         this.submitHandler = this.submitHandler.bind(this);
         this.studentSelectedHandler = this.studentSelectedHandler.bind(this);
         this.toggle = this.toggle.bind(this);

         this.toggleSuccess = this.toggleSuccess.bind(this);
          this.getExistingBooks=this.getExistingBooks.bind(this);
this.reset=this.reset.bind(this);

    }

    getExistingBooks() {

      axios
        .get("http://localhost:8001/api/gettingBooks")
        .then(result => {
          console.log("Existing Book.data " + JSON.stringify(result.data));
          if (result.data) {
   var temp=[];
    for(var i=0;i<result.data.length;i++)
     temp.push({"label":result.data[i].bookName.charAt(0).toUpperCase()+result.data[i].bookName.slice(1),
    "value": result.data[i].bookName})

              this.setState({
              existingBooks: temp,
              allBooksData:result.data
            });
          }
        });
    }

    reset()
    {
      this.fetchClassDetails();
      this.getExistingBooks();
      this.setState( {

        class:"",
        section:"",
        classError:"",

        studentsDataArray:[],
                    studentOpen:true,

                    activeTab:"1",
        feeTemplates:[],
        selectedStudent:[],
        error:"",
        showFeeTemplate:false,
        bookRows: [{ feeType: "", amount: "" }],
        templateType:"",
        totalAmount:"",
        year:new Date().getFullYear()+"-"+(new Date().getFullYear()+1),

        remarks:"",
        doi:new Date(Date.now()),

        doiError:"",
        sectionError:"",
        modalSuccess:false,
        success:false,
        studentName:"",
        rollNo:"",
        showRollFeeTemplate:false
        ,
        studentError:"",
        classDetails:[],
        classes:[],
        sectionArray: [],
        studentsDataArray:[],
        existingBooks:[],
        allBooksData:[],

        rows: [{ bookName:"",
        availableQuantity:"",
        uniqueBookId:"",

        }],
                });


    }

    handleChange = idx => e => {
      e.preventDefault();

      const { name, value } = e.target;
      const temp = this.state.rows;
      temp[idx][name] = value;

      this.setState(
        {
          rows: temp
        },
        () => {
          console.log("Change State: " + JSON.stringify(this.state));


        }
      );


    };
    handleAddRow = e => {
      e.preventDefault();
      this.setState({ rowError: "" });
      const item = { bookName:"",
      availableQuantity:"",
      uniqueBookId:"",


      };
      this.setState({
        rows: [...this.state.rows, item]
      });
    };

    handleRemoveSpecificRow = idx => () => {

    const temp = [...this.state.rows];
          temp.splice(idx, 1);
          this.setState({ rows: temp,
          });

    };


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
      this.reset();
    }


    submitHandler(e){
      e.preventDefault();
console.log("In FeeSubmit:"+ JSON.stringify(this.state));
var submit=true;

this.setState({classError:"", studentError:"", doiError:"",rowError:"" ,sectionError:"", error:"", success: false,
modalSuccess: false})



if(!this.state.class)
{
  this.setState({classError:"Please Select Class"});
  submit=false;

  }



  if(!this.state.section)
{
  this.setState({sectionError:"Please Select Section"});
  submit=false;

  }

  if(!this.state.doi)
{
  this.setState({doiError:"Please Enter Date of Issue"});
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
                this.setState({studentsDataArray:temp});

               });
            }
          });




        });







      }

    studentSelectedHandler(e){
if(e)
     { console.log("In Student "+(e.value));

this.setState({selectedStudent:e});


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
            <h5>  Issue Books to Student </h5>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}

            >
            <h5> Issue Book to Staff</h5>
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
                       {this.state.modelMessage}
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
                         value={this.state.rows[idx].BookName}
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

  if(this.state.allBooksData[i].uniqueBookIds[u].isIssued===false)
  temp[idx]["uniqueBookId"]=this.state.allBooksData[i].uniqueBookIds[u].value;
  break;
}

                                        temp[idx]["quantity"]=this.state.allBooksData[i].quantity;

                                        break;
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
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificRow(
                                        idx
                                      )}
                                      size="lg"
                                    >
                                      Remove
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
                                <p>{this.state.error}</p>
                              </font>
                            }
<Row>
                            <Col>
                              <Button
                                onClick={this.submitHandler}
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
          <TabPane tabId="2">
            <Row>
              <Col sm="6">

              <Card>

<CardBody>

{this.state.success && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={"modal-success " + this.props.className}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                        Student: {this.state.studentName}'s Fee Submitted Successfully!
                      </ModalHeader>
                    </Modal>
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

export default IssueBooks;

