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

class FeeTemplates extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showCreateTemplate:false,
      status: null,
      erorrs: null,
      success: null,
      userdata: null,
      templateName:null
    };
    this.changeHandler = this.changeHandler.bind(this);
    this.searchHandler = this.searchHandler.bind(this);
  }

  /**
   * @description Handles the form search request
   * @param {*} e
   */
  searchHandler(e) {
    console.log("searchHandler ENTER:  " + JSON.stringify(this.state));

    e.preventDefault();

    axios.post("http://localhost:8001/api/searchUsers", this.state).then(res => {
      console.log("response - " + JSON.stringify(res.data));
      console.log("response errors - " + res.data.errors);
      console.log("response message - " + res.data.message);

      if (res.data.error) {
        return this.setState({ error: res.data.message });
      }
      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      }
    });
  }

  /**
   * @description Called when the change event is triggered.
   * @param {*} e
   */
  changeHandler(e) {

    this.setState(
      {
        [e.target.name]: e.target.value
      },

    );
  }

  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="10">
              <Card className="mx-4">

                <CardBody className="p-4">
                <h1>Fee Templates</h1>
                  <Form>



                    <Button color="success" block onClick={()=>{this.setState({showCreateTemplate:true});}}>
                      Create Template
                    </Button>
                    <br/>
{this.state.showCreateTemplate &&

  <Card className="mx-1">
  <CardBody className="p-2">
    <b>Create Fee Template</b>


  <InputGroup className="mb-3">
                                  <InputGroupAddon addonType="prepend">
                                    <InputGroupText style={{ width: "120px" }}>
                                      Name
                                    </InputGroupText>
                                  </InputGroupAddon>
                                  <Input
                                    type="text"
                                    name="templateName"
                                    id="templateName"
                                    value={this.state.templateName}
                                    placeholder="Template Name"
                                    onChange={this.changeHandler}
                                  />
                                </InputGroup>

    {this.state.errors &&
      this.state.errors.address && (
        <font color="red">
          {" "}
          <p>{this.state.errors.address.msg}</p>
        </font>
      )}

  </CardBody>
</Card>}

                  </Form>
                </CardBody>
              </Card>
              <Card className="mx-4">

<CardBody className="p-4">
<h3>Existing Fee Templates</h3>
  <Form>




  </Form>
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
