import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
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
selectedFeeTemplate:[]

        };

        this.submitHandler = this.submitHandler.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);

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

    /**
     * @description Handles the form submit request
     * @param {*} e
     */
    submitHandler(e) {

        e.preventDefault();
        console.log(JSON.stringify(this.state));

        axios
            .post("http://localhost:8001/api/register", this.state)
            .then(result => {
                console.log("result.data " + result.data);
                if (result.data.errors) {

                    return this.setState(result.data);
                }
                this.resetForm();
                return this.setState({
                    userdata: result.data,
                    errors: null,
                    studentRegSuccess: true,
                    modalSuccess: true
                });

            });
    }

    /**
     * @description Called when the change event is triggered.
     * @param {*} e
     */
    classChangeHandler(e) {

      this.setState({class: e.target.value, error:"",feeTemplates:[],section:"",
       classError:"",studentResults:[],selectedStudent:[], selectedFeeTemplate:[]},

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

this.setState({selectedStudent:e},()=>{

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

          return this.setState({error:result.data.error.message});
      }





});})




    }

    }

    feeTemplateSelectHandler(e){
      if(e)
           { console.log("In Fee Template "+(e.value));

      this.setState({selectedFeeTemplate:e},()=>{

        axios
        .post("http://localhost:8001/api/getfeeTemplate", this.state)
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

                return this.setState({error:result.data.error.message});
            }





      });})




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

<Card><CardBody>
<Table bordered hover>
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
                                <th className="text-center">


                                </th>
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.editRows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h4>{idx + 1}</h4>
                                  </td>
                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        type="text"
                                        name="feeType"
                                        value={this.state.editRows[idx].feeType.charAt(0).toUpperCase()
                                           + this.state.editRows[idx].feeType.slice(1)}

                                        className="form-control"
                                        size="lg"
                                        id="feeType"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="amount"
                                        type="number"
                                        className="form-control"
                                        value={this.state.editRows[idx].amount}
                                        onChange={this.handleEditChange(idx)}
                                        id="amount"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleEditRemoveSpecificRow(
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
  </CardBody></Card>


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

