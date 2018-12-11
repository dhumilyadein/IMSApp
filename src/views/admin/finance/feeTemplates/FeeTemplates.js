import React, { Component } from "react";
import {
  Button,
  Card,
  CardBody,
  CardFooter,
  Col,
  Container,
  Form,
  FormGroup,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Label,
  Row,
  Table
} from "reactstrap";
import { AppSwitch } from "@coreui/react";
import axios from "axios";
import {
  AvForm,
  AvField,
  AvGroup,
  AvInput
} from "availity-reactstrap-validation";

class FeeTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateTemplate: false,
      status: null,
      erorrs: null,
      success: null,
      userdata: null,
      templateName: "",
      rows: [{}],
      showCreateButton:true
    };

    this.handleChange = this.handleChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleRemoveRow = this.handleRemoveRow.bind(this);
    this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
  }

  /**
   * @description Handles the form search request
   * @param {*} e
   */

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */

  submitHandler(e)
  {
console.log("in Submit State: "+JSON.stringify(this.state));

  }

  handleChange = idx => e => {
    e.preventDefault();
    const { name, value } = e.target;
    const rows = [...this.state.rows];
    rows[idx] = {
      [name]: value
    };
    this.setState({
      rows
    });
  };
  handleAddRow = e => {
    e.preventDefault();
    const item = {
      name: "",
      mobile: ""
    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };
  handleRemoveRow = e => {
    e.preventDefault();
    this.setState({
      rows: this.state.rows.slice(0, -1)
    });
  };
  handleRemoveSpecificRow = idx => () => {
    const rows = [...this.state.rows];
    rows.splice(idx, 1);
    this.setState({ rows });
  };

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="10">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Fee Templates</h1>

                    <br /> <br />
                  <AvForm>
                  {this.state.showCreateButton &&
                   <div className="justify-content-center"> <Button
                      color="success"
                        size="lg"
                      onClick={() => {
                        this.setState({ showCreateTemplate: true, showCreateButton:false });
                      }}
                    >
                      Create Template
                    </Button>
                    </div>
                  }

                    <br />
                    {this.state.showCreateTemplate && (
                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h4 align="center"> Fee Template</h4>

                          <AvField

                            required
                            errorMessage="Please enter Template name"
                            type="text"
                            label="Template Name"
                            name="templateName"
                            id="templateName"
                            value={this.state.templateName}
                            onChange={( e) => {
                              this.setState({ templateName:e.target.value },()=>{console.log("Template name: "+this.state.templateName);});

                            }}
                          />



                          <table
                            className="table table-bordered table-hover"
                            id="tab_logic"
                          >
                            <thead>
                              <tr>
                                <th className="text-center"> S.No. </th>
                                <th className="text-center"> Fee Type </th>
                                <th className="text-center"> Amount(Rs) </th>
                                <th />
                              </tr>
                            </thead>
                            <tbody>
                              {this.state.rows.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">{idx+1}</td>
                                  <td>
                                    <AvField
                                      required
                                      errorMessage="Enter Fee type"
                                      type="text"
                                      name="feeType"
                                      value={this.state.rows[idx].feetype}
                                      onChange={this.handleChange(idx)}

                                      id="feeType"
                                    />
                                  </td>
                                  <td>


                                    <AvField
                                      name="amount"
                                      required
                                      errorMessage="Enter Fee Amount"
                                      type="number"

                                      value={this.state.rows[idx].amount}
                                      onChange={this.handleChange(idx)}

                                      id="amount"
                                    />
                                  </td>
                                  <td align="center">
                                    <Button
                                      className="btn btn-outline-danger btn-sg"
                                      onClick={this.handleRemoveSpecificRow(
                                        idx
                                      )}
                                    >
                                      Remove
                                    </Button>
                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </table>
                          <Button
                            onClick={this.handleAddRow}
                            className="btn btn-primary"
                            color="success"
                          >                           Add Row
                          </Button>


                          <Button
                            onClick={this.handleRemoveRow}
                            className="btn btn-danger float-right"
                          >
                            Delete Last Row
                          </Button>
                          <br /> <br />

<Row><Col>
                          <Button
                            onClick={this.submitHandler}
                            size="lg"
                            color="info"
                            block
                          >
                           Create
                          </Button></Col>

<Col>
                          <Button
                            onClick={() => {
                        this.setState({ showCreateTemplate: false, showCreateButton:true, rows:[{}] });
                      }}
                            size="lg"
                            color="secondary"
                            block
                          >
                           Cancel
                          </Button></Col>

</Row>



                        </CardBody>
                      </Card>
                    )}
                  </AvForm>
                </CardBody>
              </Card>
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h3>Existing Fee Templates</h3>
                  <Form />
                </CardBody>
              </Card>
            </Col>
          </Row>
        </Container>
      </div>
    );
  }
}

export default FeeTemplates;
