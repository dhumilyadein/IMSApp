import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import Select from 'react-select';
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

this.getItems();
    this.state = {

      erorrs: null,
      success: null,
      itemName: "",
      unit:"",
      itemNameError: "",
      success: false,
      modalSuccess: false,
      visible: false,
      
      existingItems:[],
   docError:"",
      itemNo:"",
      items:[],
      doc:Date.now(),
     quantityError: "",
     availableQuantity:""

    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


   


    


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
      itemNameError: "", quantityError: "", success: false,
      modalSuccess: false, docError:""
    }, () => {
      if (!this.state.itemName) {
        this.setState({ itemNameError: "Please Select Item" });
        submit = false;}

        if (!this.state.quantity) {
            this.setState({ quantityError: "Please Enter Quantity" });
            submit = false;}

            if (!this.state.doc) {
              this.setState({ docError: "Please Select Date" });
              submit = false;}

              if(parseInt(this.state.availableQuantity)<0)
              {
                this.setState({ quantityError: "You can't consume more than Available quantity" });
                submit=false;
              }

      if (submit === true) {
        console.log("Consuming Item: ");
        axios
          .post("http://localhost:8001/api/consumeItem", {"itemName":this.state.itemName,"consumedQuantity":this.state.quantity,
        "availableQuantity":this.state.availableQuantity,"doc":this.state.doc, "unit":this.state.unit
      })
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));

           if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,

              },()=>{this.getItems()});

          });
      }
    });
  }


  


  getItems() {

    axios
      .get("http://localhost:8001/api/existingItems")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        if (result.data) {
 var temp=[];
  for(var i=0;i<result.data.length;i++)
   temp.push({"label":result.data[i].itemName.charAt(0).toUpperCase()+result.data[i].itemName.slice(1),
  "value": result.data[i].itemName})

            this.setState({
            items: temp,
            existingItems: result.data
          
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
                  <h1>Inventory Management</h1>
                  <br /> <br />
                  {this.state.success && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={"modal-success " + this.props.className}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                        Changes Saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}
                 



                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Consume Item</h3>
                          <br />
                         
                            <Select  
                            id="itemName"
                            name="itemName"
                              
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
                       
                          {this.state.itemNameError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.itemNameError} </p>
                              </h6>{" "}
                            </font>
                          )}
                          <br/>

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
                            disabled
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
                              name="availableQuantity"
                               id="availableQuantity"
                              value={this.state.availableQuantity}
                           disabled                            />
                          </InputGroup>
                        
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Consumed Quantity</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="number"
                              size="lg"
                              name="quantity"
                               id="quantity"
                              value={this.state.quantity}
                            onChange={e=>{
                              if(e.target.value)
                              
                              this.setState({quantity:e.target.value,
                              availableQuantity: parseInt(this.state.availableQuantity)- e.target.value})}}
                            />
                          </InputGroup>
{this.state.quantityError &&(
  <font color="red"><h6>
    {" "}
    <p>{this.state.quantityError}</p></h6>
  </font>
)}


<InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Date of Consumption</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="dos"
                                id="dos"
                                value={this.state.doc}
                                onChange={date=>{this.setState({doc:date},()=>{console.log("DOS: "+this.state.doc)})}}
                              />


                            </InputGroup>
                            {this.state.docError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.docError}</p></h6>
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
                                Consume
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

                                </tr>
                              ))}
                            </tbody>
                          </Table>
                       




                          <br /> <br />

                        </CardBody>

                      </Card>
                                        
               



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
