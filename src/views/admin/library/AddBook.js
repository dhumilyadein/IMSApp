import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';
//import { Creatable } from 'react-select/creatable';


import 'react-confirm-alert/src/react-confirm-alert.css';

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
  CardHeader,
  Label,
  Row,
  Table,
  Modal,
  ModalHeader
} from "reactstrap";

import axios from "axios";

class AddBook extends Component {
  constructor(props) {

    super(props);
 this.getCategories();
    this.state = {

      erorr: "",

      uniqueBookIds:[],
     bookId:"",
     bookName:"",
     author:"",
     publisher:"",
     quantity:"",
     doa:new Date(Date.now()),
     category:[],
     location:"",
     description:"",
     cost:"",
quantityError:"",
categoryError:"",
bookIdError:"",
bookNameError:"",
uniqueBookIdsError:"",

      success: false,
      modalSuccess: false,
      visible: false,

      defaultcategories:[]


    };




    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.reset = this.reset.bind(this);
    this.getCategories=this.getCategories.bind(this);





  }

  getCategories()
  {

    axios
    .get("http://localhost:8001/api/getCategories")
    .then(result => {
      console.log("Existing RESULT.data " + JSON.stringify(result.data));
      if (result.data) {
var temp=[];
for(var i=0;i<result.data.length;i++)
 temp.push({"label":result.data[i].category.charAt(0).toUpperCase()+result.data[i].category.slice(1),
"value": result.data[i].category})

          this.setState({
          defaultcategories: temp,

        });
      }
    });

  }

  reset()
  {
this.setState({
  erorr: "",

  uniqueBookIds:[],
 bookId:"",
 bookName:"",
 author:"",
 publisher:"",
 quantity:"",
 doa:new Date(Date.now()),
 category:[],
 location:"",
 description:"",
 cost:"",
quantityError:"",
categoryError:"",
bookIdError:"",
bookNameError:"",
uniqueBookIdsError:"",

  success: false,
  modalSuccess: false,
  visible: false,

  defaultcategories:[]



});

  }

  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
    this.reset();
    this.getCategories();
  }

  /**
   * @description Dismisses the alert
   * @param {*} e
   */
  onDismiss() {
    this.setState({ visible: !this.state.visible });
  }

  submitHandler(e) {

    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state));

    this.setState({
      bookNameError: "", bookIdError: "", success: false,
      modalSuccess: false, quantityError:"",categoryError:"", uniqueBookIdsError:""
    }, () => {
      if (!this.state.bookName) {
        this.setState({ bookNameError: "Please Enter Book Name" });
        submit = false;}

        if (!this.state.bookId) {
            this.setState({ bookIdError: "Please Enter Book id" });
            submit = false;}

        if (Object.keys(this.state.category).length===0) {
            this.setState({ categoryError: "Please Select Category" });
            submit = false;}

            if (!this.state.quantity) {
                this.setState({ quantityError: "Please Enter Quantity" });
                submit = false;}


               else if (this.state.uniqueBookIds.length!=parseInt(this.state.quantity)) {
                    this.setState({ uniqueBookIdsError: "No of Unique Books Ids should be equal to Quantity" });
                    submit = false;}


        if (submit === true) {

    confirmAlert({
        title: 'Confirm to Proceed',
        message: 'Are you sure to Add this Book?',
        buttons: [
          {
            label: 'Yes',
            onClick: () =>

          {

                console.log("Submitting Items: ");
                axios
                  .post("http://localhost:8001/api/addBook", this.state)
                  .then(result => {
                    console.log("RESULT.data " + JSON.stringify(result.data));
                    if(result.data.error)
                    {if (result.data.error.errors.bookName)
                      this.setState({
                        bookNameError:result.data.error.errors.bookName.message
                      });
                     else if (result.data.error.errors.bookId)
                    this.setState({
                      bookIdError:result.data.error.errors.bookId.message
                    });

                    else
                    this.setState({
                      error:result.data.error
                    });
                  }
                     else if (result.data.msg === "Success")
                      this.setState({

                        success: true,
                        modalSuccess: true,

                      });

                  });
              }

          },
          {
            label: 'No',

          }
        ]
      })}




  });
  }










  render() {

    return (
      <div>
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="12">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Library Management</h1>
                  <br /> <br />
                  {this.state.success && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={"modal-success " + this.props.className}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                      {this.state.quantity} {this.state.bookName} Books saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}
                  <Form>




                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Add Book</h3>
                          <br />
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Book Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"


                              name="bookName"
                              id="bookName"
                              value={this.state.bookName.charAt(0).toUpperCase()+this.state.bookName.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { bookName: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.bookName
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.bookNameError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.bookNameError} </p>
                              </h6>{" "}
                            </font>
                          )}


<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Book ID</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"


                              name="bookId"
                              id="bookId"
                              value={this.state.bookId.charAt(0).toUpperCase()+
                                this.state.bookId.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { bookId: e.target.value,
                                quantity:"" },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.bookId
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.bookIdError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.bookIdError} </p>
                              </h6>{" "}
                            </font>
                          )}




                          <Row><Col>      <Select.Creatable

                value={this.state.category}
                onChange={selected=>{  console.log("category: "+JSON.stringify(selected));
                this.setState({category:selected});}}

                autosize
                //onCreateOption={this.handleSubjectCreate}
                options={this.state.defaultcategories}
                isSearchable={true}
                placeholder="Select or type to Add new Category"       />

</Col></Row>
                          <br/>

                          {this.state.categoryError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.categoryError} </p>
                              </h6>{" "}
                            </font>
                          )}



<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Author</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"


                              name="author"
                              id="author"
                              value={this.state.author}
                              onChange={e => {
                                this.setState(
                                  { author: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.author
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>


<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Publisher</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"


                              name="publisher"
                              id="publisher"
                              value={this.state.publisher}
                              onChange={e => {
                                this.setState(
                                  { publisher: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.publisher
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Quantity</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"


                              name="quantity"
                              id="quantity"
                              value={this.state.quantity}
                              onChange={e => {
                                this.setState(
                                  { quantity: e.target.value },
                                  () => {
                                    console.log(
                                      "Quantity: " +
                                      this.state.quantity
                                    );
if(this.state.bookId){ var temp=[];
                                    for(var i=0;i<this.state.quantity;i++)
                                    {
                                        temp.push({"label":this.state.bookId.charAt(0).toUpperCase()+
                                        this.state.bookId.slice(1)
                                        +"-"+(i+1),
                                    "value":this.state.bookId.charAt(0).toUpperCase()+
                                    this.state.bookId.slice(1)
                                    +"-"+(i+1),"isIssued":false})


                                    }
                                    console.log(JSON.stringify(temp));
                                    this.setState({uniqueBookIds:temp});
                                }

                                else{this.setState({quantityError:"Please enter Book Id first",
                                bookIdError:"Please enter Book Id", quantity:""})}

                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.quantityError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.quantityError} </p>
                              </h6>{" "}
                            </font>
                          )}

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Location</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"


                              name="location"
                              id="location"
                              value={this.state.location}
                              onChange={e => {
                                this.setState(
                                  { location: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.location
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Cost/book</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"


                              name="cost"
                              id="cost"
                              value={this.state.cost}
                              onChange={e => {
                                this.setState(
                                  { cost: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.cost
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Description</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                               name="description"
                              id="description"
                              value={this.state.description}
                              onChange={e => {
                                this.setState(
                                  { description: e.target.value },

                                );
                              }}
                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Unique Book Ids</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Select.Creatable

                value={this.state.uniqueBookIds}
                onChange={selected=>{  console.log("category: "+JSON.stringify(selected));
                this.setState({uniqueBookIds:selected});}}
                isMulti={true}
                autosize
                isClearable={false}
                onCreateOption={e=>{
                this.state.uniqueBookIds.push({"label":e,"value":e,"isIssued":false})
                console.log(JSON.stringify(this.state.uniqueBookIds));}}


                    />
                          </InputGroup>
                          {this.state.uniqueBookIdsError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.uniqueBookIdsError} </p>
                              </h6>{" "}
                            </font>
                          )}


<InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Date of Addition</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="doa"
                                id="doa"
                                value={this.state.doa}
                                onChange={date=>{this.setState({doa:new Date(date.getTime()-(date.getTimezoneOffset() * 60000))},()=>{console.log("DOS: "+this.state.doa)})}}
                              />


                            </InputGroup>




                            {this.state.error && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.error} </p>
                              </h6>{" "}
                            </font>
                          )}






                          <br /> <br />
                          <Row>
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"
                                block
                              >
                                Submit
                              </Button>
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
                        </CardBody>

                      </Card>




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

export default AddBook;
