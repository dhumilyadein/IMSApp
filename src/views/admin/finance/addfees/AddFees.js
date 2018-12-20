import React, { Component } from 'react';
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
            find: null,
            results: [],

            find: null,
            using: "firstname",
            role: "student",
            searchCriteria: "containsSearchCriteria",
            dataSource: [],

            usersDetails: null,
            studentsDetails: null,

            showSearchUserSectionFlag : false,

            actionTypeForSearchUser: "RedirectToAddFee"


        };
        this.changeHandler = this.changeHandler.bind(this);
        this.submitHandler = this.submitHandler.bind(this);
        this.resetForm = this.resetForm.bind(this);







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
    changeHandler(e) {
        this.setState({
            [e.target.name]: e.target.value
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
                                onChange={this.changeHandler}
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
                                onChange={this.changeHandler}
                              >
                                <option value="">Select</option>
                                <option value="A">A</option>
                                <option value="B">B</option>
                                <option value="C">C</option>
                                <option value="D">D</option>
                                <option value="E">E</option>

                                   </Input>
                            </InputGroup>
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

