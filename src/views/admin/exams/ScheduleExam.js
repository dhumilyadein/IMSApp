import React, { Component } from 'react';
import Select from 'react-select';
import classnames from 'classnames';
import DatePicker from 'react-date-picker';
import ReactLoading from 'react-loading';
import moment from 'moment';
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
  Container,
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
  TabContent, TabPane, Nav, NavItem, NavLink, CardTitle, CardText
} from 'reactstrap';

import axios, { post } from "axios";
import { stat } from 'fs';



class ScheduleExam extends Component {

  constructor(props) {

    super(props);

    this.state = {

      classesView: true,
      sectionView: false,

      classesAndSections: [],
      classDetails: {},
      classes: [],
      class: "",

      sectionArray: [],
      sectionLabelValueArray: [],
      selectedSectionsArray: [],
      selectedSectionsLabelValueArray: [],
      disableSectionsFlag: false,
      allSectionCheck: false
    };

    this.fetchAllClassesAndSections = this.fetchAllClassesAndSections.bind(this);
    this.fetchClasses = this.fetchClasses.bind(this);
    this.fetchClassSpecificDetails = this.fetchClassSpecificDetails.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
    this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
    this.allSectionCheckHandler = this.allSectionCheckHandler.bind(this);

    this.fetchAllClassesAndSections();
  }

  /**
 * Fetches all the classes and section details and nothing else
 */
  fetchAllClassesAndSections() {

    axios.get("http://localhost:8001/api/fetchAllClassesAndSections").then(cRes => {

      console.log("ClassFeeTemplate - fetchAllClassesAndSections - cRes.data - " + JSON.stringify(cRes.data));

      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ classesAndSections: cRes.data }, () => {

          console.log('ScheduleExam - fetchAllClassesAndSections - All class details - ' + JSON.stringify(this.state.classesAndSections));

          // Fetching unique classes from the classesAndSections 
          this.fetchClasses();
        });

      }
    });
  }

  async fetchClassSpecificDetails(classStr, sectionStr) {

    this.setState({
      subjectArray: [],
      pTMeetScheduleArray: [],
      pTMeetScheduleView: false,
      emailArray: []
    });

    var fetchClassSpecificDetailsRequest = {
      "class": this.state.class,
      "section": this.state.section,
      "subjects": 1,
    }

    console.log("ScheduleExam - fetchClassSpecificDetails - fetchClassSpecificDetailsRequest - "
      + JSON.stringify(fetchClassSpecificDetailsRequest));

    await axios.post("http://localhost:8001/api/fetchClassSpecificDetails", fetchClassSpecificDetailsRequest).then(res => {

      if (res.data.errors) {

        console.log('ScheduleExam - fetchClassSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
        return this.setState({ errors: res.data.errors });
      } else {

        this.setState({
          classDetails: res.data,
          subjectArray: res.data.subjects,
        }, () => {

          console.log('ScheduleExam - fetchClassSpecificDetails - All class details classDetails - ' + JSON.stringify(this.state.classDetails));
        });
      }
    });
  }

  /**
   * @description - fetches unique classes from the class detail from DB
   */
  fetchClasses() {

    var classArray = [];
    this.state.classesAndSections.forEach(element => {

      classArray.push(element.class);
    });
    console.log("classArray - " + classArray);
    var uniqueItems = Array.from(new Set(classArray));

    this.setState({ classes: uniqueItems });

    console.log("Unique classes - " + this.state.classes);
  }

  classChangeHandler(e) {

    var selectedClass = e.currentTarget.value;

    this.setState({ class: selectedClass });

    var sectionArrayTemp = [];
    var sectionLabelValueArray = [];
    this.state.classesAndSections.forEach(element => {
      if (element["class"] === selectedClass) {

        var sectionLabelValue = {};

        var section = element["section"];
        sectionArrayTemp.push(section);

        sectionLabelValue.value = section;
        sectionLabelValue.label = section;

        sectionLabelValueArray.push(sectionLabelValue);

      }
    });

    // Sorting array alphabetically
    sectionArrayTemp.sort();

    this.setState({ 
      sectionArray: sectionArrayTemp,
      sectionLabelValueArray: sectionLabelValueArray,
      sectionView: true,
      selectedSectionsArray: [],
      selectedSectionsLabelValueArray: [],
      disableSectionsFlag: false,
      allSectionCheck: false
    }, () => {

      console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp 
      + " \nsectionLabelValueArray - " + JSON.stringify(this.state.sectionLabelValueArray));
    })
  }

  sectionChangeHandler = (newValue, actionMeta) => {

    console.log("ScheduleExam - sectionChangeHandler - newValue - " + JSON.stringify(newValue) + " action - " + actionMeta.action);

    var sectionArrayTemp = [];
    newValue.forEach(element => {
      sectionArrayTemp.push(element.value);
    });
    this.setState({
      selectedSectionsArray: sectionArrayTemp.sort(),
      selectedSectionsLabelValueArray: newValue
    }, () => {
      console.log("ScheduleExam - sectionChangeHandler - selectedSectionsLabelValueArray - " + JSON.stringify(this.state.selectedSectionsLabelValueArray));
      console.log("\nScheduleExam - sectionChangeHandler - selected class - " + JSON.stringify(this.state.class) 
      + " selected sections - " + this.state.selectedSectionsArray);
    });

  };

  allSectionCheckHandler(e) {

    if (e.target.checked) {
      this.setState({ 
        allSectionCheck: true, 
      selectedSectionsArray: this.state.sectionArray,
      selectedSectionsLabelValueArray: this.state.sectionLabelValueArray,
      disableSectionsFlag: true
       }, () => {
        console.log("\nScheduleExam - sectionChangeHandler - selected class - " + JSON.stringify(this.state.class) 
        + " selected sections - " + this.state.selectedSectionsArray);
       });
    } else {
      this.setState({ 
        allSectionCheck: false,
        disableSectionsFlag: false
      }, () => {
        console.log("\nScheduleExam - sectionChangeHandler - selected class - " + JSON.stringify(this.state.class) 
      + " selected sections - " + this.state.selectedSectionsArray);
      })
    }
  }

  render() {

    return (
      <div>
        <Container >


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
              {this.state.classError && (
                <font color="red">
                  {" "}
                  <p>{this.state.classError}</p>
                </font>
              )}

              {this.state.sectionView && 
<div>

                <Select
                  id="section"
                  name="section"
                  isMulti={true}
                  placeholder="Select Single or Multiple Section(s)"
                  options={this.state.sectionLabelValueArray}
                  closeMenuOnSelect={false}
                  value={this.state.selectedSectionsLabelValueArray}
                  isDisabled={this.state.disableSectionsFlag}
                  isSearchable={true}
                  onChange={this.sectionChangeHandler} />

                {this.state.sectionError && (
                  <font color="red">
                    {" "}
                    <p>{this.state.sectionError}</p>
                  </font>
                )} 

              <FormGroup check inline>
                <Input
                  className="form-check-input"
                  type="checkbox"
                  id="allSectionCheck"
                  style={{ height: "35px", width: "25px" }}
                  name="allSectionCheck"
                  checked={this.state.allSectionCheck}
                  onChange={this.allSectionCheckHandler}
                />
                <Label
                  className="form-check-label"
                  check
                  htmlFor="inline-checkbox1"
                >
                  For All Sections
                                    </Label>
              </FormGroup>
</div>
}

              <br />
              {/* <Table bordered hover>
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
                      <td style={{ width: "200px" }}>

                        <Select id="bookName"
                          name="bookName"

                          placeholder="Select Book"
                          options={this.state.existingBooks}
                          closeMenuOnSelect={true}
                          value={this.state.rows[idx].bookName}
                          isClearable={true}
                          isSearchable={true}

                          onChange={selectedItem => {


                            const temp = this.state.rows;
                            temp[idx]["bookName"] = {
                              "label": selectedItem.value.charAt(0).toUpperCase() +
                                selectedItem.value.slice(1), "value": selectedItem.value
                            };

                            for (var i = 0; i < this.state.allBooksData.length; i++) {
                              if (this.state.allBooksData[i].bookName === selectedItem.value) {
                                for (var u = 0; u < this.state.allBooksData[i].uniqueBookIds.length; u++) {

                                  if (!this.state.allBooksData[i].uniqueBookIds[u].isIssued) {
                                    console.log(this.state.allBooksData[i].uniqueBookIds[u].isIssued);
                                    temp[idx]["uniqueBookId"] = this.state.allBooksData[i].uniqueBookIds[u].value;
                                    break;
                                  }
                                }

                                temp[idx]["quantity"] = this.state.allBooksData[i].quantity;


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

                            style={{ textAlign: 'center' }}
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
                            style={{ textAlign: 'center' }}
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
                          onChange={date => {
                            var temp = this.state.rows;
                            temp[idx]["dor"] = new Date(date.getTime() - (date.getTimezoneOffset() * 60000));

                            this.setState({ rows: temp }, () => console.log(JSON.stringify(this.state.rows)))
                          }

                          }
                        />
                      </td>



                      <td align="center">
                        {idx > 0 &&
                          <Button
                            className="btn btn-danger btn-sg"
                            onClick={this.handleRemoveSpecificRow(
                              idx
                            )}
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
              )} */}

              <Row>
                <Col>
                  {!this.state.loader && <Button
                    onClick={this.studentSubmitHandler}
                    size="lg"
                    color="success"
                    block
                  >
                    Submit
                              </Button>}

                  {this.state.loader &&
                    <div align="center"><ReactLoading type="spin"
                      color="	#006400"
                      height='2%' width='10%' />
                      <br />

                      <font color="DarkGreen">  <h4>Submitting...</h4></font></div>}

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

        </Container>
      </div>
    );
  }
}

export default ScheduleExam;

