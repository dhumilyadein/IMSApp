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

        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.onUpdateInput = this.onUpdateInput.bind(this);
        this.performSearch = this.performSearch.bind(this);
        this.selectedItem = this.selectedItem.bind(this);
        this.searchStudentsDetails = this.searchStudentsDetails.bind(this);
        this.showSearchUserSection = this.showSearchUserSection.bind(this);

    }

    onUpdateInput(inputValue, datasource, params) {

        if (params.source == 'touchTap' || params.source == 'click') return;

        this.setState({
            find: inputValue
        }, function () {
            this.performSearch();
        });
    }

    performSearch() {

        var fetchedUsernames = [];

        if (this.state.find !== '') {

            console.log("AddFee search bar request - " + JSON.stringify(this.state));

            axios.post("http://localhost:8001/api/searchUsers", this.state).then(res => {

                console.log("AddFee res.data.errors - " + res.data.errors);
                console.log("AddFee res.data.message - " + res.data.message);
                console.log("AddFee res.data.error - " + res.data.errors);

                if (res.data.errors) {
                    return this.setState({ errors: res.data.errors });
                } else {

                    var resData = res.data;

                    // Setting response data in state so that it can be used in the onclick event of search bar items (selectedItem method)
                    console.log("AddFee Setting searchBarResponse with " + JSON.stringify(resData));
                    this.setState({ searchBarResponse: resData });

                    //this.props.history.push("/users");
                    console.log("AddFee final response search bar - " + JSON.stringify(res.data));

                    var i = 1;
                    res.data.forEach(function (item) {

                        console.log("AddFee Fetched username - " + item.username);
                        console.log("AddFee Fetched Full Name - " + item.firstname + " " + item.lastname);

                        let displayText = item.firstname + " " + item.lastname + " (" + item.username + ")";
                        fetchedUsernames.push(displayText);

                    });

                    console.log("AddFee Fetched usernames on search - " + fetchedUsernames);

                    this.setState({
                        dataSource: fetchedUsernames
                    });

                    console.log("AddFee this.state.dataSource - " + this.state.dataSource);

                    console.log("AddFee this.state.searchBarResponse 1 - " + JSON.stringify(this.state.searchBarResponse));

                    console.log("AddFee this.state before - " + JSON.stringify(this.state));
                }
            });
        }
    }

    /**
     * @description For getting search bar selected value
     */
    async selectedItem(chosenSearchValue, index) {

        var searchBarResponse;
        var selectedUsername;

        this.setState({ chosenSearchValue: chosenSearchValue });
        console.log("AddFee this.state.chosenSearchValue - " + this.statechosenSearchValue);

        selectedUsername = chosenSearchValue.split("(")[1].split(")")[0];
        console.log("AddFee username retrieved from chosen field after removing () " + selectedUsername);

        searchBarResponse = this.state.searchBarResponse;
        console.log("AddFee this.state.searchBarResponse 2 - " + JSON.stringify(searchBarResponse));

        var tempArrayForUser = [];
        console.log("AddFee AAAAAAAAAAAAAAAAAAAAAAAAAAAAAAAA");
        for (var i = 0; i < searchBarResponse.length; i++) {

            console.log("searchBarResponse[i][\"username\"] - " + searchBarResponse[i]["username"] + " selectedUsername - " + selectedUsername + " searchBarResponse.length - " + searchBarResponse.length);
            console.log("searchBarResponse[i] - " + JSON.stringify(searchBarResponse));

            if (searchBarResponse[i]["username"].toLowerCase() === String(selectedUsername).toLowerCase()) {

                console.log("searchBarResponse[i][\"username\"] BBBBBBBBBBBBBBBBBBB - " + searchBarResponse[i]["username"] + " selectedUsername - " + selectedUsername);

                // tempArrayForUser.push(searchBarResponse[i]);
                // this.props.history.push(
                //     {
                //         pathname: '/admin/users',
                //         state: tempArrayForUser
                //     });
                // return searchBarResponse[i];

                this.setState({
                    usersDetails: searchBarResponse[i]
                });

                console.log("Selected Student's USER details " + JSON.stringify(this.state.usersDetails));

                await this.searchStudentsDetails(selectedUsername, "username", "equalsSearchCriteria");
            }
        }


    }

    searchStudentsDetails(find, using, searchCriteria) {

        var searchStudentsRequest = {
            "find": find,
            "using": using,
            "searchCriteria": searchCriteria
        }

        axios.post("http://localhost:8001/api/searchStudents", searchStudentsRequest).then(res => {

            console.log("AddFee Submit Request - " + JSON.stringify(searchStudentsRequest));

            console.log("AddFee submit response data - " + JSON.stringify(res.data));
            console.log("AddFee  res.data.errors - " + res.data.errors);
            console.log("AddFee  res.data.message - " + res.data.message);
            console.log("AddFee  res.data.error - " + res.data.errors);

            if (res.data.errors) {
                return this.setState({ errors: res.data.errors });
            } else {

                this.setState({
                    studentsDetails: res.data
                });

                console.log("Selected Student's STUDENT details " + JSON.stringify(this.state.studentsDetails));
            }
        });
    }

    showSearchUserSection(e) {

        e.preventDefault();
        this.setState({
            showSearchUserSectionFlag : true
        });
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

{!this.state.showSearchUserSectionFlag && (
                <Row lg="2">
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <strong>Fees Form</strong>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Search Student</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Row>
                                                <MuiThemeProvider muiTheme={getMuiTheme()} className="mb-4">
                                                    <AutoComplete
                                                        hintText="Enter Search text"
                                                        dataSource={this.state.dataSource}
                                                        onUpdateInput={this.onUpdateInput}
                                                        fullWidth={true}
                                                        filter={AutoComplete.noFilter}
                                                        maxSearchResults={5}
                                                        onNewRequest={this.selectedItem}
                                                        autoFocus="true"
                                                    />
                                                </MuiThemeProvider>
                                            </Row>
                                            <Row>
                                                {/* <Button color="success" block onClick={this.searchHandler} disabled="disabled">
                                                    Advanced Serch (ye abhi change hoga)
                                                </Button> */}
                                                {/* <Badge href='#/admin/searchUser' color='success'>Advanced Serch</Badge> */}
                                                <a href='#' onClick={this.showSearchUserSection}>Advanced Serch</a>
                                            </Row>

                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="email-input">Email Input</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="email" id="email-input" name="email-input" placeholder="Enter Email" autoComplete="email" />
                                            <FormText className="help-block">Please enter your email</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="password-input">Password</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="password" id="password-input" name="password-input" placeholder="Password" autoComplete="new-password" />
                                            <FormText className="help-block">Please enter a complex password</FormText>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="date-input">Date Input <Badge>NEW</Badge></Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="date" id="date-input" name="date-input" placeholder="date" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="disabled-input">Disabled Input</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="text" id="disabled-input" name="disabled-input" placeholder="Disabled" disabled />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="textarea-input">Textarea</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="textarea" name="textarea-input" id="textarea-input" rows="9"
                                                placeholder="Content..." />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="select">Select</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="select" name="select" id="select">
                                                <option value="0">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="selectLg">Select Large</Label>
                                        </Col>
                                        <Col xs="12" md="9" size="lg">
                                            <Input type="select" name="selectLg" id="selectLg" bsSize="lg">
                                                <option value="0">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="selectSm">Select Small</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="select" name="selectSm" id="SelectLm" bsSize="sm">
                                                <option value="0">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                                <option value="4">Option #4</option>
                                                <option value="5">Option #5</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="disabledSelect">Disabled Select</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="select" name="disabledSelect" id="disabledSelect" disabled autoComplete="name">
                                                <option value="0">Please select</option>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="multiple-select">Multiple select</Label>
                                        </Col>
                                        <Col md="9">
                                            <Input type="select" name="multiple-select" id="multiple-select" multiple>
                                                <option value="1">Option #1</option>
                                                <option value="2">Option #2</option>
                                                <option value="3">Option #3</option>
                                                <option value="4">Option #4</option>
                                                <option value="5">Option #5</option>
                                                <option value="6">Option #6</option>
                                                <option value="7">Option #7</option>
                                                <option value="8">Option #8</option>
                                                <option value="9">Option #9</option>
                                                <option value="10">Option #10</option>
                                            </Input>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Radios</Label>
                                        </Col>
                                        <Col md="9">
                                            <FormGroup check className="radio">
                                                <Input className="form-check-input" type="radio" id="radio1" name="radios" value="option1" />
                                                <Label check className="form-check-label" htmlFor="radio1">Option 1</Label>
                                            </FormGroup>
                                            <FormGroup check className="radio">
                                                <Input className="form-check-input" type="radio" id="radio2" name="radios" value="option2" />
                                                <Label check className="form-check-label" htmlFor="radio2">Option 2</Label>
                                            </FormGroup>
                                            <FormGroup check className="radio">
                                                <Input className="form-check-input" type="radio" id="radio3" name="radios" value="option3" />
                                                <Label check className="form-check-label" htmlFor="radio3">Option 3</Label>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Inline Radios</Label>
                                        </Col>
                                        <Col md="9">
                                            <FormGroup check inline>
                                                <Input className="form-check-input" type="radio" id="inline-radio1" name="inline-radios" value="option1" />
                                                <Label className="form-check-label" check htmlFor="inline-radio1">One</Label>
                                            </FormGroup>
                                            <FormGroup check inline>
                                                <Input className="form-check-input" type="radio" id="inline-radio2" name="inline-radios" value="option2" />
                                                <Label className="form-check-label" check htmlFor="inline-radio2">Two</Label>
                                            </FormGroup>
                                            <FormGroup check inline>
                                                <Input className="form-check-input" type="radio" id="inline-radio3" name="inline-radios" value="option3" />
                                                <Label className="form-check-label" check htmlFor="inline-radio3">Three</Label>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3"><Label>Checkboxes</Label></Col>
                                        <Col md="9">
                                            <FormGroup check className="checkbox">
                                                <Input className="form-check-input" type="checkbox" id="checkbox1" name="checkbox1" value="option1" />
                                                <Label check className="form-check-label" htmlFor="checkbox1">Option 1</Label>
                                            </FormGroup>
                                            <FormGroup check className="checkbox">
                                                <Input className="form-check-input" type="checkbox" id="checkbox2" name="checkbox2" value="option2" />
                                                <Label check className="form-check-label" htmlFor="checkbox2">Option 2</Label>
                                            </FormGroup>
                                            <FormGroup check className="checkbox">
                                                <Input className="form-check-input" type="checkbox" id="checkbox3" name="checkbox3" value="option3" />
                                                <Label check className="form-check-label" htmlFor="checkbox3">Option 3</Label>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label>Inline Checkboxes</Label>
                                        </Col>
                                        <Col md="9">
                                            <FormGroup check inline>
                                                <Input className="form-check-input" type="checkbox" id="inline-checkbox1" name="inline-checkbox1" value="option1" />
                                                <Label className="form-check-label" check htmlFor="inline-checkbox1">One</Label>
                                            </FormGroup>
                                            <FormGroup check inline>
                                                <Input className="form-check-input" type="checkbox" id="inline-checkbox2" name="inline-checkbox2" value="option2" />
                                                <Label className="form-check-label" check htmlFor="inline-checkbox2">Two</Label>
                                            </FormGroup>
                                            <FormGroup check inline>
                                                <Input className="form-check-input" type="checkbox" id="inline-checkbox3" name="inline-checkbox3" value="option3" />
                                                <Label className="form-check-label" check htmlFor="inline-checkbox3">Three</Label>
                                            </FormGroup>
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="file-input">File input</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="file" id="file-input" name="file-input" />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="file-multiple-input">Multiple File input</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Input type="file" id="file-multiple-input" name="file-multiple-input" multiple />
                                        </Col>
                                    </FormGroup>
                                    <FormGroup row hidden>
                                        <Col md="3">
                                            <Label className="custom-file" htmlFor="custom-file-input">Custom file input</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Label className="custom-file">
                                                <Input className="custom-file" type="file" id="custom-file-input" name="file-input" />
                                                <span className="custom-file-control"></span>
                                            </Label>
                                        </Col>
                                    </FormGroup>
                                </Form>
                            </CardBody>
                            <CardFooter>
                                <Button type="submit" size="sm" color="primary"><i className="fa fa-dot-circle-o"></i> Submit</Button>
                                <Button type="reset" size="sm" color="danger"><i className="fa fa-ban"></i> Reset</Button>
                            </CardFooter>
                        </Card>
                    </Col>
                </Row>
    )}

    { this.state.showSearchUserSectionFlag && (
                <Row lg="2">
                    <Col md="12">
                        <SearchUser data={this.state.actionTypeForSearchUser}/>
                    </Col>
                </Row>
    )}
            </div>
        );
    }
}

export default AddFees;

