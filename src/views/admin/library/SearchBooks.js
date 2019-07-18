import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';
//import { Creatable } from "react-select";


import 'react-confirm-alert/src/react-confirm-alert.css';

import {
  Button,
  Card,
  CardBody,
  Col,
  Container,
  Form,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Modal,
  ModalHeader
} from "reactstrap";

import axios from "axios";

class Searchbooks extends Component {
  constructor(props) {

    super(props);
 this.gettingAllBooks();
    this.state = {

      erorrs: null,


      selectedBook:[],

      uniqueBookIds:[],
     bookId:"",
     bookName:"",
     author:"",
     publisher:"",
     quantity:"",
     doa:"",
     category:[],
     location:"",
     description:"",
     cost:"",
quantityError:"",
categoryError:"",
bookIdError:"",
bookNameError:"",
uniqueBookIdsError:"",
lastUpdated:"",


      defaultcategories:[],

bookError:"",
showEdit:false,
showOptions:false,

      success: false,
      modalSuccess: false,
      visible: false,

      defaultBooks:[],
      allBooksData:[]


    };




    this.editHandler = this.editHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
this.getCategories=this.getCategories.bind(this);
    this.gettingAllBooks=this.gettingAllBooks.bind(this);
this.reset=this.reset.bind(this);
this.deleteBook=this.deleteBook.bind(this);




  }

  reset(){

    this.setState({  erorrs: null,


        erorrs: null,


        selectedBook:[],

        uniqueBookIds:[],
       bookId:"",
       bookName:"",
       author:"",
       publisher:"",
       quantity:"",
       doa:"",
       category:[],
       location:"",
       description:"",
       cost:"",
  quantityError:"",
  categoryError:"",
  bookIdError:"",
  bookNameError:"",
  uniqueBookIdsError:"",
  lastUpdated:"",


        defaultcategories:[],

  bookError:"",
  showEdit:false,
  showOptions:false,

        success: false,
        modalSuccess: false,
        visible: false,

        defaultBooks:[],
        allBooksData:[]

  })
  }

  gettingAllBooks()
  {

    axios
    .get("http://localhost:8001/api/gettingAllBooks")
    .then(result => {
      console.log("Existing RESULT.data " + JSON.stringify(result.data));
      if (result.data) {
var temp=[];
for(var i=0;i<result.data.length;i++)
 temp.push({"label":result.data[i].bookName.charAt(0).toUpperCase()+result.data[i].bookName.slice(1),
"value": result.data[i].bookName})

          this.setState({
          defaultBooks: temp,
          allBooksData:result.data


        });
      }
    });

  }

  deleteBook()
  {

    confirmAlert({
      title: 'Confirm to Proceed',
      message: 'Are you sure to Delete this Book?',
      buttons: [
        {size:"lg",
          label: 'Yes',
          onClick: () =>

        {

              console.log("Deleting Category: ");
              axios
                .post("http://localhost:8001/api/deleteBook", {"bookName":this.state.selectedBook.value})
                .then(result => {
                  console.log("RESULT.data " + JSON.stringify(result.data));
                if (result.data.msg === "Deleted")
                    this.setState({
                      success: true,
                      modalSuccess: true,
                      showOptions: false,
                      showEdit: false,
                      modelMessage:"Book "+ this.state.selectedBook.label+" Deleted Successfully!"

                    });


                });
            }

        },
        {
          label: 'No',

        }
      ]
    })


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

  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess
    });
    this.reset();

    this.gettingAllBooks();
  }

  /**
   * @description Dismisses the alert
   * @param {*} e
   */
  onDismiss() {
    this.setState({ visible: !this.state.visible });
  }

  editHandler(e) {

    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state.category));

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
        message: 'Are you sure to Update this Book?',
        buttons: [
          {
            label: 'Yes',
            onClick: () =>

          {

                console.log("Updating Book: ");
                axios
                  .post("http://localhost:8001/api/updateBook", this.state)
                  .then(result => {
                    console.log("RESULT.data " + JSON.stringify(result.data));
                    if(result.data.error)
                    {if (result.data.error.errmsg.includes("bookName"))
                      this.setState({
                        bookNameError:"Book name exists alreay!"
                      });
                     else if (result.data.error.errmsg.includes("bookId"))
                     this.setState({
                       bookIdError:"Book Id exists alreay!"
                     });

                    else
                    this.setState({
                      error:result.data.error
                    });
                  }
                     else if (result.data.msg === "Updated")
                      this.setState({

                        success: true,
                        modalSuccess: true,
                        modelMessage:"Book "+this.state.bookName+" updated successfully!"

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
                      {this.state.modelMessage}
                      </ModalHeader>
                    </Modal>
                  )}
                  <Form>




                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Search/Edit Book</h3>
                          <br />
                                                 <Row><Col>      <Select

                value={this.state.selectedBook}
                onChange={selected=>{
                this.setState({selectedBook:selected,

              showOptions:true,showEdit:false},()=>{ console.log("Book: "+JSON.stringify(selected))});}}

                autosize

                options={this.state.defaultBooks}
                isSearchable={true}
                placeholder="Select or type Book Name to Search"       />

</Col></Row>
                          <br/>
{this.state.showOptions && <div>
                          <Row>
                            <Col>
                              <Button
                                onClick={e=>{
                                    var temp=[]; this.getCategories();
                                    for(var i=0;i<this.state.allBooksData.length;i++)
                        { if(this.state.allBooksData[i].bookName===this.state.selectedBook.value)
{
temp=this.state.allBooksData[i];break}
                        }var tempIds=[];
for(var j=0;j<temp.uniqueBookIds.length;j++)
tempIds.push({"value":temp.uniqueBookIds[j].value,"label":(temp.uniqueBookIds[j].value+" Issued: "+temp.uniqueBookIds[j].isIssued)})


                                    this.setState({showEdit:true, showOptions:false,bookName: temp.bookName,
                                        bookId:temp.bookId,
                                         category:{"label":temp.category.charAt(0).toUpperCase()+temp.category.slice(1),
                                        "value":temp.category},
                                          author:temp.author,
                                        publisher:temp.publisher,
                                        quantity:temp.quantity, cost:temp.cost, doa:temp.doa,
                                         description:temp.description, lastUpdated:temp.updatedAt,
                                         location:temp.location, uniqueBookIds:tempIds

                                })}}
                                size="lg"
                                color="success"
                                block
                              >
                                Edit/View
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={this.deleteBook}
                                size="lg"
                                color="danger"
                                block
                              >
                             Delete
                              </Button>
                            </Col>
                          </Row> </div>}
{this.state.showEdit && <div><h3 align="center">Book Details</h3>
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
                              disabled
                            />
                          </InputGroup>





                          <Row><Col>      <Select.Creatable

                value={this.state.category}
                onChange={selected=>{  console.log("category: "+JSON.stringify(selected));
                this.setState({category:selected});}}

                autosize
               // onCreateOption={this.handleSubjectCreate}
                options={this.state.defaultcategories}
                isSearchable={true}
                placeholder="Select or type Category to Add"       />

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
                                <b>Available Quantity</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"

disabled
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
                            <Select

                value={this.state.uniqueBookIds}
               disabled
                isMulti={true}
                autosize



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
                                disabled
                              />


                            </InputGroup>


                            <InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Last updated on</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="lastUpdated"
                                id="lastUpdated"
                                value={this.state.lastUpdated}
                               disabled />


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
                                onClick={this.editHandler}
                                size="lg"
                                color="success"
block
                              >
                                Update
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                onClick={e=>{this.setState({showEdit:false, showOptions:true})}}
                                size="lg"
                                color="secondary"
block
                              >
                                Cancel
                              </Button>
                            </Col>


    </Row></div>}

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

export default Searchbooks;
