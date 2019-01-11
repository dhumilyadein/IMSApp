import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import Select from 'react-select';
import { confirmAlert } from 'react-confirm-alert';
import { Creatable } from "react-select";


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

class EditCategory extends Component {
  constructor(props) {

    super(props);
 this.getCategories();
    this.state = {

      erorrs: null,


     category:[],

     newCategory:"",

categoryError:"",
showEdit:false,
showOptions:false,

      success: false,
      modalSuccess: false,
      visible: false,

      defaultcategories:[]


    };




    this.editHandler = this.editHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

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

  editHandler(e) {

    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state));

    this.setState({
       success: false,
      modalSuccess: false, categoryError:""
    }, () => {
      if (!this.state.EditCategory) {
        this.setState({ categoryError: "Please Enter New Category Name" });
        submit = false;}



        if (Object.keys(this.state.category).length===0) {
            this.setState({ categoryError: "Please Select Category" });
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
                     if (result.data.error.errors.bookId)
                    this.setState({
                      bookIdError:result.data.error.errors.bookId.message
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
                      {this.state.category} Category saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}
                  <Form>




                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Edit Category</h3>
                          <br />
                                                 <Row><Col>      <Select

                value={this.state.category}
                onChange={selected=>{  console.log("category: "+JSON.stringify(selected));
                this.setState({category:selected,
                newCategory:selected.label,
              showOptions:true});}}

                autosize

                options={this.state.defaultcategories}
                isSearchable={true}
                placeholder="Select or type Category to Search"       />

</Col></Row>
                          <br/>
{this.state.showOptions && <div>
                          <Row>
                            <Col>
                              <Button
                                onClick={e=>{this.setState({showEdit:true, showOptions:false})}}
                                size="lg"
                                color="success"
                                block
                              >
                                Edit
                              </Button>
                            </Col>

                            <Col>
                              <Button
                                onClick={this.deleteCategory}
                                size="lg"
                                color="danger"
                                block
                              >
                             Delete
                              </Button>
                            </Col>
                          </Row> </div>}
{this.state.showEdit && <div>
<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Edit Category</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"


                              name="bookName"
                              id="bookName"
                              value={this.state.newCategory}
                              onChange={e => {
                                var temp={"value":e.target.value,"label":e.target.value}
                                this.setState(
                                  { category: temp},
                                  () => {
                                    console.log(
                                      "Category: " +
                                      JSON.stringify(this.state.category)
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>











                          <br /> <br />
                          <Row>
                            <Col>
                              <Button
                                onClick={this.editHandler}
                                size="lg"
                                color="success"
block
                              >
                                Submit
                              </Button>
                            </Col>
                            <Col>
                              <Button
                                onClick={e=>{this.setState({showEdit:false, showOptions:false})}}
                                size="lg"
                                color="success"
block
                              >
                                Cancel
                              </Button>
                            </Col>


    </Row></div>}

{this.state.categoryError && (
  <font color="red">
    <h6>
      {" "}
      <p>{this.state.categoryError} </p>
    </h6>{" "}
  </font>
)}
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

export default EditCategory;
