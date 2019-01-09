import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';

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
 
    this.state = {

      erorrs: null,
     

     bookId:"",
     bookName:"",
     author:"",
     publisher:"",
     quantity:"",
     doa:new Date(Date.now()),
     category:"",
     location:"",
     description:"",
     cost:"",
referenceUniqueId: [],
     
      success: false,
      modalSuccess: false,
      visible: false,
      doaError:"",
     

    };




    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.reset = this.reset.bind(this);
    




  }

 

  reset()
  {
this.setState({
    erorrs: null,
      success: null,

     grandTotal:"",
     dos:new Date(Date.now()),
      listName: "",
      rows: [{ itemName:"",
      quantity:"",
      unit:"",
      costPerItem:"",
      totalAmount:""

      }],
      remarks:"",
      rowError: false,
      listNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      dosError:""


});

  }

  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
    this.reset();
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
    console.log("Row Length: " + this.state.rows.length);
    this.setState({
      rowError: "", listNameError: "", success: false,
      modalSuccess: false, dosError:""
    }, () => {
      if (!this.state.listName) {
        this.setState({ listNameError: "Please Enter List Name" });
        submit = false;}

        if (!this.state.dos) {
            this.setState({ dosError: "Please Enter Date of Submission" });
            submit = false;}

        if (this.state.rows.length === 0) {
        this.setState({ rowError: "Please add atleast one Row" });
        submit = false;
      } else
        for (var i = 0; i < this.state.rows.length; i++) {
          if (
            this.state.rows[i].itemName === "" ||
            this.state.rows[i].costPerItem === ""||
            this.state.rows[i].quantity === ""||
            this.state.rows[i].totalAmount === ""||
            this.state.rows[i].unit === ""

          ) {
            this.setState({
              rowError: "Please fill all the table fields first"
            });
            submit = false;

            break;
          }
        }
        if (submit === true) {

    confirmAlert({
        title: 'Confirm to Proceed',
        message: 'Are you sure to Add these Items?',
        buttons: [
          {
            label: 'Yes',
            onClick: () => 
            
          {
           
                console.log("Submitting Items: ");
                axios
                  .post("http://localhost:8001/api/addItems", this.state)
                  .then(result => {
                    console.log("RESULT.data " + JSON.stringify(result.data));
                    if(result.data.errors)
                    {if (result.data.errors.listName)
                      this.setState({
                        listNameError:result.data.errors.listName.message
                      });}
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
                        Book: {this.state.bookName} saved Successfully!
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
                              value={this.state.bookName}
                              onChange={e => {
                                this.setState(
                                  { bookName: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.bookNameError
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
                              value={this.state.bookId}
                              onChange={e => {
                                this.setState(
                                  { bookId: e.target.value },
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



                          
                          <Row><Col> <Select
                            id="itemName"
                            name="itemName"
                           autoSize={true}
                          placeholder="Select Item"
                            options={this.state.items}
                          closeMenuOnSelect={true}
                        // value={this.state.rows[idx].itemName}

                              isSearchable={true}

                            onChange={selectedItem=>{
var tempUnit,tempQuantity;
                                             for(var i=0;i<this.state.existingItems.length;i++)
                                             {if(this.state.existingItems[i].itemName===selectedItem.value)
                                             { tempUnit=this.state.existingItems[i].unit;
                                              tempQuantity= this.state.existingItems[i].quantity;
                                              break;}
                                            }


                                this.setState(
                                  {
                                    itemName: selectedItem.value,
                                    unit:tempUnit,
                                    availableQuantity:tempQuantity
                                  })

                            }}
                            />

</Col>&nbsp;    <Col> <Input type= "text"/> </Col> <Col col="6" sm="4" md="2" xl className="mb-3 mb-xl-0">
                <Button block color="success" className="btn-pill">Add</Button>
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
                                      "List name: " +
                                      this.state.quantity
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>

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
                              type="number"
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
                                <b>ReferenceUniqueId</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
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
                                onChange={date=>{this.setState({doa:date},()=>{console.log("DOS: "+this.state.doa)})}}
                              />


                            </InputGroup>
                          










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
