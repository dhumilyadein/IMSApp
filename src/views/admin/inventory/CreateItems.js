import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
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

class CreateItems extends Component {
  constructor(props) {
    super(props);
this.getExistingItems();
    this.state = {

      erorrs: null,
      success: null,
      itemName: "",
      unit:"",
      itemNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      unitError:"",
      existingItems:[],
      showEditItem:false,
      itemNo:""
    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


    this.getExistingItems = this.getExistingItems.bind(this);
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);




  }



  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
      itemName:"",
      unit:""
    });

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
      itemNameError: "", unitError: "", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.itemName) {
        this.setState({ itemNameError: "Please Enter Item Name" });
        submit = false;}

        if (!this.state.unit) {
            this.setState({ unitError: "Please Enter Unit" });
            submit = false;}



      if (submit === true) {
        console.log("Creating Item: ");
        axios
          .post("http://localhost:8001/api/createItem", {"itemName":this.state.itemName,"unit":this.state.unit})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

            if(result.data.errors)
            {
            if(result.data.errors.itemName)
              this.setState({
                itemNameError:result.data.errors.itemName.message
              });}
             else if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,

              },()=>{this.getExistingItems()});

          });
      }
    });
  }

  editHandler(e) {
    var submit = true;
    console.log("in Edit State: " + JSON.stringify(this.state));

    this.setState({
      itemNameError: "", unitError: "", success: false,
      modalSuccess: false
    }, () => {
      if (!this.state.itemName) {
        this.setState({ itemNameError: "Please Enter Item Name" });
        submit = false;}

        if (!this.state.unit) {
            this.setState({ unitError: "Please Enter Unit" });
            submit = false;}



      if (submit === true) {
        console.log("Updating Item: "+ JSON.stringify(this.state));
        axios
          .post("http://localhost:8001/api/editItem", {"itemName":this.state.itemName,"unit":this.state.unit,
          "existingItems":this.state.existingItems,"itemNo":this.state.itemNo})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
           if(result.data.error)
          {  if(result.data.error.code===11000)
            this.setState({
              itemNameError:"Item name already in use"
            });}
           else  if (result.data.msg === "Item Updated")
              this.setState({

                success: true,
                modalSuccess: true,
                showEditItem:false

              },()=>{this.getExistingItems()});

          });
      }
    });
  }

  getExistingItems() {

    axios
      .get("http://localhost:8001/api/existingItems")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
          this.setState({
            existingItems: result.data
          });
        }
      });
  }



deleteSpecificItem= idx => () => {

  confirmAlert({
    title: 'Confirm to Remove',
    message: 'Are you sure to Remove this Item?',
    buttons: [
      {
        label: 'Yes',
        onClick: () =>

        axios
        .post("http://localhost:8001/api/deleteItem",{"itemName":this.state.existingItems[idx].itemName})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Item Deleted")
            this.getExistingItems();

        })
      },
      {
        label: 'No',
        onClick: () =>  {this.getExistingItems();}
      }
    ]
  })


}







  render() {
    return (
      <div>
        <Container>
          <Row className="justify-content-center" lg="2">
            <Col md="12">

             <Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Inventory Management</h1>
                  <br /> <br />
                  {this.state.success && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={"modal-success " + this.props.className}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                        Item: {this.state.itemName} Saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}



                  {!this.state.showEditItem &&  (

                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Create Item</h3>
                          <br />
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Item Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"

                              name="itemName"

                              id="itemName"
                              value={this.state.itemName.charAt(0).toUpperCase() + this.state.itemName.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { itemName: e.target.value },
                                  () => {
                                    console.log(
                                      "Item name: " +
                                      this.state.itemName
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.itemNameError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.itemNameError} </p>
                              </h6>{" "}
                            </font>
                          )}

<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Item Unit</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                              name="unit"
                               id="unit"
                              value={this.state.unit.charAt(0).toUpperCase() + this.state.unit.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { unit: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.unit
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.unitError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.unitError} </p>
                              </h6>{" "}
                            </font>
                          )}
<br/>
<Row >
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"

                              >
                                Create
                              </Button>
                            </Col>


                          </Row>
                          <br /> <br />

<h3 align="center"> Existing Items</h3>
                          <br />


                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Item Name </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Unit</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Quantity</h4>
                                </th>

                                <th className="text-center">
                                 <h4> Actions</h4>


                                </th>

                              </tr>
                            </thead>
                            <tbody>
                              {this.state.existingItems.map((item, idx) => (
                                <tr id="addr0" key={idx}>
                                  <td align="center">
                                    <h5>{idx + 1}</h5>
                                  </td>
                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].itemName.charAt(0).toUpperCase() +
                                      this.state.existingItems[idx].itemName.slice(1)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].unit}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].quantity}</h5>
                                  </td>

                                  <td align="center">
                                  <Button
                                      color="primary"
                                        onClick={ ()=>{ this.setState({showEditItem:true,
                                       itemName: this.state.existingItems[idx].itemName,
                                      unit:this.state.existingItems[idx].unit,
                                    itemNo:idx,
                                  itemNameError:"",
                                unitError:""},()=>{console.log("showEditItem "+this.state.showEditItem)});}}


                                      size="lg"
                                    >
                                      Edit
                                    </Button>
                                    &nbsp; &nbsp;

                                    <Button
                                      color="danger"
                                        onClick={ this.deleteSpecificItem(idx)}


                                      size="lg"
                                    >
                                      Remove
                                    </Button>




                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>





                          <br /> <br />

                        </CardBody>

                      </Card>

                   ) }

{this.state.showEditItem && (
  <Card className="mx-1">
  <CardBody className="p-2">

    <h3 align="center"> Edit Item</h3>
                            <br />
                            <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Item Name</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"

                                name="itemName"

                                id="itemName"
                                value={this.state.itemName.charAt(0).toUpperCase() + this.state.itemName.slice(1)}
                                onChange={e => {
                                  this.setState(
                                    { itemName: e.target.value }
                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.itemNameError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.itemNameError} </p>
                                </h6>{" "}
                              </font>
                            )}

  <InputGroup className="mb-3">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                  <b>Item Unit</b>
                                </InputGroupText>
                              </InputGroupAddon>
                              <Input
                                type="text"
                                size="lg"
                                name="unit"
                                 id="unit"
                                value={this.state.unit.charAt(0).toUpperCase() + this.state.unit.slice(1)}
                                onChange={e => {
                                  this.setState(
                                    { unit: e.target.value }

                                  );
                                }}
                              />
                            </InputGroup>
                            {this.state.unitError && (
                              <font color="red">
                                <h6>
                                  {" "}
                                  <p>{this.state.unitError} </p>
                                </h6>{" "}
                              </font>
                            )}
  <br/>
  <Row >
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
                                  onClick={()=>{this.setState({showEditItem:false,itemName:"",unit:""})}}
                                  size="lg"
                                  color="secondary"
  block
                                >
                                  Cancel
                                </Button>
                              </Col>


                            </Row>




    </CardBody></Card>

)}

                </CardBody>
              </Card>

              </Col>
          </Row>
        </Container>





      </div>
    );
  }
}

export default CreateItems;
