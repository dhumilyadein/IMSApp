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

        console.log("Hey DUDE this.state.studentsDetails - " + this.state.studentsDetails);

        if(this.props.match.params.username) {
            console.log("AddFee this.props.match.params - " + this.props.match.params.username);

            this.searchStudentsDetails(this.props.match.params.username, "username", "equalsSearchCriteria");
        }

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

        if(this.props.location.state && this.props.location.state.studentDetails) {
            console.log("this.props.location.state.studentDetails - " + this.props.location.state.studentDetails);
        }

        return (
            <div>

{!this.state.showSearchUserSectionFlag && (
                <Row lg="2">
                    <Col md="12">
                        <Card>
                            <CardHeader>
                                <h3>Fees Form</h3>
                            </CardHeader>
                            <CardBody>
                                <Form action="" method="post" encType="multipart/form-data" className="form-horizontal">
                                    <FormGroup row>
                                        <Col md="3">
                                            <Label htmlFor="text-input">Search Student</Label>
                                        </Col>
                                        <Col xs="12" md="9">
                                            <Row>
                                            {!this.state.studentsDetails && (
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
                                            )}
                                                {this.state.studentsDetails && (
                                                <MuiThemeProvider muiTheme={getMuiTheme()} className="mb-4">
                                                    <AutoComplete searchText={this.state.studentsDetails[0].firstname
                                                    + " " + this.state.studentsDetails[0].lastname
                                                    + " (" + this.state.studentsDetails[0].username + ")"}
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
                                                )}
                                            </Row>
                                            <Row>
                                                {/* <Button color="success" block onClick={this.searchHandler} disabled="disabled">
                                                    Advanced Serch (ye abhi change hoga)
                                                </Button> */}
                                                {/* <Badge href='#/admin/searchUser' color='success'>Advanced Serch</Badge> */}
                                                <a href='#' onClick={this.showSearchUserSection}>Advanced Search</a>
                                            </Row>

                                        </Col>


                                    </FormGroup>
                                </Form>
                            </CardBody>

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

