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
    Table,
    TabContent, TabPane, Nav, NavItem, NavLink,   CardTitle, CardText
} from 'reactstrap';
import { AutoComplete } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import axios, { post } from "axios";
import SearchUser from '../../searchuser/SearchUser';

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
pastPendingDue:"",
paidAmount:"0",
remarks:"",
dos:Date.now(),
yearError:"",
quarterError:"",
halfYearError:"",
monthError:"",
paidAmountError:"",
dosError:""

        };


        this.resetForm = this.resetForm.bind(this);
        this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
         this.feeSubmitHandler = this.feeSubmitHandler.bind(this);
         this.studentSelectedHandler = this.studentSelectedHandler.bind(this);
         this.toggle = this.toggle.bind(this);
         this.feeTemplateSelectHandler = this.feeTemplateSelectHandler.bind(this);



    }


    resetForm = (e) => {
        this.setState({
            username: "",
            email: "",
            firstname: "",
            lastname: "",
            password: "",
            password_con: "",
            errors: null
        });

    }
    toggle(tab) {
      if (this.state.activeTab !== tab) {
        this.setState({
          activeTab: tab
        });
      }
    }


    feeSubmitHandler(e){
      e.preventDefault();
console.log("In FeeSubmit:"+ JSON.stringify(this.state));
var submit=true;

if(!this.state.year)
{
this.setState({yearError:"Please Enter Year (Eg. 2018-19)"})
submit=false;

}
if(this.state.templateType==="Monthly")
if(!this.state.month)
{
this.setState({monthError:"Please Select month"})
submit=false;

}
if(this.state.templateType==="Quarterly")
if(!this.state.quarter)
{
this.setState({quarterError:"Please Select Quarter"})
submit=false;

}

if(this.state.templateType==="Half Yearly")
if(!this.state.halfYear)
{
this.setState({halfYearError:"Please Select Half Year"})
submit=false;

}

if(!this.state.paidAmount)
{
  this.setState({paidAmountError:"Please Enter Paid Amount"})
  submit=false;

  }

  if(!this.state.dos)
{
  this.setState({dos:"Please Enter Date of Submission"})
  submit=false;

  }









    }


    classChangeHandler(e) {

      this.setState({class: e.target.value, error:"",feeTemplates:[],section:"",
       classError:"",studentResults:[],selectedStudent:[], selectedFeeTemplate:[], showFeeTemplate:false},

       ()=>{console.log("in Class change: "+this.state.class);

      axios
      .post("http://localhost:8001/api/selectStudentByClass", this.state)
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
if(!this.state.class)
{this.setState({classError:"Please select Class first"});
return;}

if(!e.target.value)
{ axios
  .post("http://localhost:8001/api/selectStudentByClass", this.state)
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
      .post("http://localhost:8001/api/selectStudentBySection", this.state)
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

this.setState({selectedStudent:e,selectedFeeTemplate:[],showFeeTemplate:false},()=>{

  axios
  .post("http://localhost:8001/api/selectfeeTemplate", this.state)
  .then(result => {
      console.log("result.data " + JSON.stringify(result.data));

      if (result.data.length>0) {
        var temp=[];
       for(var i=0;i<result.data.length;i++)
       {
        temp.push({"value":result.data[i],
        "label":result.data[i]
       });

      }
        this.setState({feeTemplates:temp});
      }

      else if (result.data.error) {

         this.setState({error:result.data.error.message});
      }





});




})




    }

    }

    feeTemplateSelectHandler(e){
      if(e)
           { console.log("In Fee Template "+(e.value));

this.setState({selectedFeeTemplate:e, showMonth:false, showQuarter:false, showHalfYearly:false},()=>{

  axios
  .post("http://localhost:8001/api/getfeeTemplate", this.state)
  .then(result => {
      console.log("result.data " + JSON.stringify(result.data));

      if (result.data.error) {
        return this.setState({error:result.data.error.message});
    }

var tempAmount=0;
for(var i=0;i<result.data.templateRows.length;i++)
tempAmount=tempAmount+parseInt(result.data.templateRows[i].amount);




if(result.data.templateType==="Monthly")
  this.setState({showMonth:true})
  else if(result.data.templateType==="Quarterly")
  this.setState({showQuarter:true})
  else if(result.data.templateType==="Half Yearly")
  this.setState({showHalfYearly:true})


        this.setState({templateRows:result.data.templateRows,showFeeTemplate:true,
                            templateType:result.data.templateType, totalAmount:tempAmount});









});

axios
.post("http://localhost:8001/api/getpendingFeeAmount", this.state)
.then(result => {
    console.log("result.data " + JSON.stringify(result.data));

    if (result.data.error) {
      return this.setState({error:result.data.error.message});
  }


      this.setState({pastPendingDue:result.data});









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
              <Card className="mx-5">
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
<Select
                            id="feeTemplates"
                            name="feeTemplates"

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



{this.state.showMonth&&
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
                                   {this.state.monthError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.monthError}</p>
                              </font>
                            )}
                            </InputGroup>




                          }

{this.state.showQuarter&&
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

           {this.state.quarterError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.quarterError}</p>
                              </font>
                            )}
    </InputGroup>}

    {this.state.showHalfYearly&&
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

           {this.state.halfYearError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.halfYearError}</p>
                              </font>
                            )}
    </InputGroup>}


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
                                  <td>
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
                                      />
                                    </InputGroup>
                                  </td>
                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="amount"
                                        type="number"
                                        className="form-control"
                                        value={this.state.templateRows[idx].amount}

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
                             {this.state.paidAmountError &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.paidAmountError}</p>
                              </font>
                            )}
                          </InputGroup>



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
                              {this.state.dosError &&(
                                <font color="red">
                                  {" "}
                                  <p>{this.state.dosError}</p>
                                </font>
                              )}

                            </InputGroup>


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
                                  this.setState({
                                    showFeeTemplate: false,
selectedFeeTemplate:[],
selectedStudent:[],
class:"",

                                    templateRows: []
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

                          </p>
                        }



<br/>
{this.state.error &&(
                              <font color="red">
                                {" "}
                                <p>{this.state.error}</p>
                              </font>
                            )}

</CardBody></Card>
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
                                      type="text"
                                      name="rollno"
                                      id="rollno"
                                      value={this.state.rollno}
                                      autoComplete="rollno"
                                      onChange={this.changeHandler}
                                    />
                                  </InputGroup>

                                  <Button
                          type="submit"
                         // onClick={this.submitHandler}
                          block
                          color="success"
                        >
                          {" "}
                           <h4>  Search</h4>
                        </Button>

                        </CardBody></Card>

              </Col>
            </Row>
          </TabPane>
        </TabContent>



            </div>
        );
    }
}

export default AddFees;

