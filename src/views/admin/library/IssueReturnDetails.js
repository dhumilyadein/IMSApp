import React, { Component } from 'react';
import classnames from 'classnames';
import DatePicker from 'react-date-picker';
import {
    Button,
    Card,
    CardBody,
    Col,
    Input,
    InputGroup,
    InputGroupAddon,
    InputGroupText,
    Row,
    Table,
    TabContent, TabPane, Nav, NavItem, NavLink,
} from 'reactstrap';

import axios from "axios";


class IssueReturnDetails extends Component {

    constructor(props) {
        super(props);
      this.fetchClassDetails();
        this.state = {

class:"",
section:"",


            studentResults: [],
            studentOpen:true,

            activeTab:"1",

selectedStudent:[],
error:"",


remarks:"",
dos:Date(Date.now()).toString(),

dosError:"",
dateError:"",
modalSuccess:false,
success:false,
studentName:"",


defaulters:[],
classDetails:[],
classes:[],
sectionArray: [],
studentsDataArray:[],
startDate:"",
endDate:new Date(Date.now()),
searchResults:[]
        };

       


        this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);

         this.studentSelectedHandler = this.studentSelectedHandler.bind(this);
         this.toggle = this.toggle.bind(this);
       
this.reset=this.reset.bind(this);
this.getIssuedBooks=this.getIssuedBooks.bind(this);
 this.getBookDefaulters=this.getBookDefaulters.bind(this);
 this.getReturnedBooks=this.getReturnedBooks.bind(this);

 
    }

    reset()
    {
      this.setState( {
  
                
        
                    activeTab:"1",
        
        selectedStudent:[],
        error:"",
        
        
        remarks:"",
        dos:Date(Date.now()).toString(),
        
        dosError:"",
        dateError:"",
        modalSuccess:false,
        success:false,
        studentName:"",
        
        
        defaulters:[],
        classDetails:[],
        classes:[],
        sectionArray: [],
        studentsDataArray:[],
        startDate:"",
        endDate:new Date(Date.now()),
        searchResults:[]
                
        
                });


    }

    getIssuedBooks(){
      var submit = true;
      console.log("in getIssuedBooks State: " + JSON.stringify({"doe":this.state.endDate,"dos":this.state.startDate,
      "class":this.state.class,"section":this.state.section}));
  
      this.setState({
        dateError: "",searchResults:[]
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
  
        
              console.log("Getting getIssuedBooks ");
              axios
                .post("http://localhost:8001/api/getIssuedBooks", {"doe":this.state.endDate,"dos":this.state.startDate,
                "class":this.state.class,"section":this.state.section})
                .then(result => {
                  
  
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
                  {var temp=[];
                    for(var i=0;i<result.data.data.length;i++)
                    for(var j=0;j<result.data.data[i].issuedBookDetails.length;j++)
                    temp.push({"bookNameId":result.data.data[i].issuedBookDetails[j].bookName.label+
                    "/"+result.data.data[i].issuedBookDetails[j].uniqueBookId,
                    
                    "issuedTo":result.data.data[i].issuedTo,
                    "class":result.data.data[i].class+" "+result.data.data[i].section,
                    "doi":result.data.data[i].doi.substring(0,10),
                    "dor":result.data.data[i].issuedBookDetails[j].dor.substring(0,10)
                })
                console.log("Temp.data " + JSON.stringify(temp));
                      this.setState({
                          showSearchResults:true,
                          searchResults:temp,
                        
                        });
  
                  }
  
  
  
                });
  
          
  
        
  
  
        }
      });
    }


    getReturnedBooks(){
        var submit = true;
        console.log("in getReturnedBooks State: " + JSON.stringify({"doe":this.state.endDate,"dos":this.state.startDate,
        "class":this.state.class,"section":this.state.section}));
    
        this.setState({
          dateError: "",searchResults:[]
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
    
          
                console.log("Getting getReturnedBooks ");
                axios
                  .post("http://localhost:8001/api/getReturnedBooks", {"doe":this.state.endDate,"dos":this.state.startDate,
                  "class":this.state.class,"section":this.state.section})
                  .then(result => {
                    
    
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
                    {var temp=[];
                      for(var i=0;i<result.data.data.length;i++)
                      for(var j=0;j<result.data.data[i].issuedBookDetails.length;j++)
                      temp.push({"bookNameId":result.data.data[i].issuedBookDetails[j].bookName.label+
                      "/"+result.data.data[i].issuedBookDetails[j].uniqueBookId,
                      
                      "issuedTo":result.data.data[i].issuedTo,
                      "class":result.data.data[i].class+" "+result.data.data[i].section,
                      "doi":result.data.data[i].doi,
                      "dor":result.data.data[i].issuedBookDetails[j].actualReturnedDate,
                      "delayFine":result.data.data[i].issuedBookDetails[j].delayInReturn+
                      "/"+result.data.data[i].issuedBookDetails[j].totalFine
                  })
                  console.log("Temp.data " + JSON.stringify(temp));
                        this.setState({
                            showSearchResults:true,
                            searchResults:temp,
                          
                          });
    
                    }
    
    
    
                  });
    
            
    
          
    
    
          }
        });
      }


    toggle(tab) { this.reset();
      this.fetchClassDetails();
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        },()=>{if(this.state.activeTab==="3") this.getBookDefaulters();});
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
         sectionArray: sectionArrayTemp, class:e.target.value
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

    getBookDefaulters()

    {   axios
      .get("http://localhost:8001/api/getBookDefaulters")
      .then(result => {
                  
  
       if(result.data.data.length>0)
        {var temp=[];
          for(var i=0;i<result.data.data.length;i++)
          for(var j=0;j<result.data.data[i].issuedBookDetails.length;j++)
          temp.push({"bookNameId":result.data.data[i].issuedBookDetails[j].bookName.label+
          "/"+result.data.data[i].issuedBookDetails[j].uniqueBookId,
          
          "issuedTo":result.data.data[i].issuedTo,
          "class":result.data.data[i].class+" "+result.data.data[i].section,
          "doi":result.data.data[i].doi.substring(0,10),
          "dor":result.data.data[i].issuedBookDetails[j].dor.substring(0,10)
      })
      console.log("Temp.data " + JSON.stringify(temp));
            this.setState({
                showSearchResults:true,
                searchResults:temp,
              
              });

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
            <h5> Issued Book Details</h5>
            </NavLink>
          </NavItem>

          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}

            >
            <h5>Returned Book Details</h5>
            </NavLink>
          </NavItem>
          
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '3' })}
              onClick={() => { this.toggle('3'); }}

            >
            <h5> Book Defaulters</h5>
            </NavLink>
          </NavItem>

        </Nav>
        <TabContent activeTab={this.state.activeTab}>
       
        <TabPane tabId="1">
            <Row>

              <Col sm="12">







                          <h5> Choose Issued Date Period</h5>
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
                                      onChange={this.classChangeHandler}
                                    >
                                      <option value="">All Classes</option>
                                      {this.state.classes.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                    </Input>
                                  </InputGroup>
                                

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
                                onClick={this.getIssuedBooks}
                                size="lg"
                                color="success"

                              >
                                Search
                              </Button>
                            </Col>


                          </Row>
                          <br /> <br />

{(this.state.showSearchResults && this.state.searchResults.length>0) &&<p>

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
                                  <h4>Book Name/id </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Issued To</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Class</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Issue Date</h4>
                                </th>
                              
                                <th className="text-center">
                                  {" "}
                                  <h4>Expected Return Date</h4>
                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.searchResults.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].bookNameId
                                      }</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].issuedTo}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].class}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].doi}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].dor}</h5>
                                  </td>

                                
                                </tr>
                              ))}
                            </tbody>
                          </Table>

                        
                          </p>     }








              </Col>
            </Row>
          </TabPane>
         
          <TabPane tabId="2">
            <Row>

              <Col sm="12">







                          <h5> Choose Return Date Period</h5>
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
                                      onChange={this.classChangeHandler}
                                    >
                                      <option value="">All Classes</option>
                                      {this.state.classes.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                    </Input>
                                  </InputGroup>
                                

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
                                onClick={this.getReturnedBooks}
                                size="lg"
                                color="success"

                              >
                                Search
                              </Button>
                            </Col>


                          </Row>
                          <br /> <br />

{(this.state.showSearchResults && this.state.searchResults.length>0) &&<p>

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
                                  <h4>Book Name/id </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Issued To</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Class</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Issue Date</h4>
                                </th>
                              
                                <th className="text-center">
                                  {" "}
                                  <h4>Return Date</h4>
                                </th>

                                  
                                <th className="text-center">
                                  {" "}
                                  <h4>Delay(days)/Fine(Rs)</h4>
                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.searchResults.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].bookNameId}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].issuedTo}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].class}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].doi}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].dor}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.searchResults[idx].delayFine}</h5>
                                  </td>

                                
                                </tr>
                              ))}
                            </tbody>
                          </Table>

                        
                          </p>     }








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
                                  <h4>Class/Roll No </h4>
                                </th>
                                <th className="text-center">
                                  <h4>Book Name/Id</h4>{" "}
                                </th>
                                <th className="text-center">
                                  <h4> Expected Return Date</h4>{" "}
                                </th>

                                <th className="text-center">
                                  <h4> Delay(Days)</h4>{" "}
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
     
        </TabContent>



            </div>
        );
    }
}

export default IssueReturnDetails;

