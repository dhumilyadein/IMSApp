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
this.reset=this.reset.bind(this);
this.deleteCategory=this.deleteCategory.bind(this);




  }

  reset(){

    this.setState({  erorrs: null,


      category:[],

      newCategory:"",

 categoryError:"",
 showEdit:false,
 showOptions:false,

       success: false,
       modalSuccess: false,
       visible: false,

       defaultcategories:[]})
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

  deleteCategory()
  {

    confirmAlert({
      title: 'Confirm to Proceed',
      message: 'Are you sure to Delete this Category?',
      buttons: [
        {size:"lg",
          label: 'Yes',
          onClick: () =>

        {

              console.log("Deleting Category: ");
              axios
                .post("http://localhost:8001/api/deleteCategory", {"category":this.state.category.value})
                .then(result => {
                  console.log("RESULT.data " + JSON.stringify(result.data));
                if (result.data.msg === "Deleted")
                    this.setState({
                      success: true,
                      modalSuccess: true,
                      showOptions: false,
                      showEdit: false,
                      modelMessage:this.state.category.label+" Deleted Successfully!"

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
      if (!this.state.newCategory) {
        this.setState({ categoryError: "Please Enter New Category Name" });
        submit = false;}

   if (submit === true) {


                console.log("Updating Category: ");
                axios
                  .post("http://localhost:8001/api/editCategory", {"oldCategory":this.state.category.value,
                  "newCategory":this.state.newCategory})
                  .then(result => {
                    console.log("RESULT.data " + JSON.stringify(result.data));

                      if (result.data.msg === "Updated")
                   {   this.setState({

                        success: true,
                        modalSuccess: true,
                        modelMessage:this.state.newCategory+" Saved Successfully!"

                      } );}
                      else if(result.data.error)
                      if(result.data.error.code===11000)
                      this.setState({

                      categoryError:"Category already exist"

                      } );


                  });
              }

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
                          <h3 align="center"> Edit Category</h3>
                          <br />
                                                 <Row><Col>      <Select

                value={this.state.category}
                onChange={selected=>{  console.log("category: "+JSON.stringify(selected));
                this.setState({category:selected,
                newCategory:selected.label,
              showOptions:true,showEdit:false});}}

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

                                this.setState(
                                  { newCategory: e.target.value},
                                  () => {
                                    console.log(
                                      "Category: " +
                                      JSON.stringify(this.state.newCategory)
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>


{this.state.categoryError && (
  <font color="red">
    <h6>
      {" "}
      <p>{this.state.categoryError} </p>
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

export default EditCategory;
