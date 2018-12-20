import React, { Component } from 'react';
import Select from 'react-select';
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




        };

        this.submitHandler = this.submitHandler.bind(this);
        this.resetForm = this.resetForm.bind(this);
        this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);

         this.studentSelectedHandler = this.studentSelectedHandler.bind(this);





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

      this.setState({class: e.target.value, classError:""},()=>{console.log("in Class change: "+this.state.class);

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

              return this.setState(result.data);
          }

          return this.setState({

          });

      });

    });




    }

    sectionChangeHandler(e) {

if(!this.state.class)
{this.setState({classError:"Please select Class first"});
return;}

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

          else if (result.data.errors) {

              return this.setState(result.data);
          }

          return this.setState({

          });

      });

    });




    }

    /**
     * @description Called when the role(s) are selected. To update role Array
     * @param {*} e
     */


    render() {

          return (
            <div>


                <Row lg="2">
                    <Col md="6">
                        <Card>
                            <CardHeader>
                                <h3>Add Student Fee</h3>
                            </CardHeader>
                            <CardBody>
                                <Form>
                                <Card className="mx-5">
                          <CardBody className="p-1">
                          <CardHeader style={{backgroundColor: 'lightgreen', borderColor: 'black'}}> <h5>Select Student by Class & Section</h5></CardHeader>
                            <br/><InputGroup className="mb-4">
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
                            // isMulti={true}
                          placeholder="Select Student or Type to search"
                            options={this.state.studentResults}
                         // closeMenuOnSelect={false}
                         //value={this.state.selectedStudent}
                         isClearable={true}
                         menuIsOpen ={true}
                            isSearchable={true}

                            onChange={this.studentSelectedHandler}
                            /* var temp=[];

                            for(var i=0;i<selected.length;i++)
                            {temp.push(selected[i].value)}
                            this.setState({selectedFeeTemplate:temp,
                            selectedFeeTemplateValue:selected},()=>
                            {console.log("Selected Fee Templ: "+JSON.stringify(this.state.selectedFeeTemplate));  })*/








                          }



                             />
                            <br/>



</CardBody></Card>

{/* <Card>            <CardHeader style={{backgroundColor: 'lightgreen', borderColor: 'black'}}> <h5>Select Student by Roll No</h5></CardHeader>
<br/>
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

                        </CardBody></Card> */}

<br/><br/><br/><br/><br/><br/>
                                </Form>
                            </CardBody>

                        </Card>
                    </Col>
                </Row>



            </div>
        );
    }
}

export default AddFees;

