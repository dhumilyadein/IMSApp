import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import Select from 'react-select';
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

class AddItems extends Component {
  constructor(props) {
    super(props);
    this.getExistingItems();
    this.state = {

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
      dosError:"",
      existingItems:[],
      allItemsData:[]


    };



    this.handleChange = this.handleChange.bind(this);
    this.handleAddRow = this.handleAddRow.bind(this);
    this.handleRemoveSpecificRow = this.handleRemoveSpecificRow.bind(this);

    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);
    this.reset = this.reset.bind(this);
    this.getExistingItems = this.getExistingItems.bind(this);
    




  }

  getExistingItems() {

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
            existingItems: temp,
            allItemsData:result.data
          });
        }
      });
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
            onClick: () =>  {this.getExistingItems();}
          }
        ]
      })}



  
  });
  }


  handleChange = idx => e => {
    e.preventDefault();
    var targetname=e.target.name;
    const { name, value } = e.target;
    const temp = this.state.rows;
    temp[idx][name] = value;

    this.setState(
      {
        rows: temp
      },
      () => {
        console.log("Change State: " + JSON.stringify(this.state));

        if(targetname==="quantity"||targetname==="costPerItem")

{ const totalAmount="totalAmount";
    const temp = this.state.rows;
    temp[idx][totalAmount] = temp[idx].quantity*temp[idx].costPerItem;
    this.setState(
        {
          rows: temp
        },()=>{
            var amount=0;
            for(var i=0;i<this.state.rows.length;i++)

            amount=amount+this.state.rows[i].totalAmount;
this.setState({grandTotal:amount})

        }

      );

}
      }
    );


  };
  handleAddRow = e => {
    e.preventDefault();
    this.setState({ rowError: "" });
    const item = { itemName:"",
    quantity:"",
    unit:"",
    costPerItem:"",
    totalAmount:""

    };
    this.setState({
      rows: [...this.state.rows, item]
    });
  };

  handleRemoveSpecificRow = idx => () => {

   this.setState({ grandTotal:this.state.grandTotal-this.state.rows[idx].totalAmount},
    ()=>{const temp = [...this.state.rows];
        temp.splice(idx, 1);
        this.setState({ rows: temp,
        });})

  };








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
                        Items saved Successfully!
                      </ModalHeader>
                    </Modal>
                  )}
                  <Form>




                      <Card className="mx-1">
                        <CardBody className="p-2">
                          <h3 align="center"> Add Items</h3>
                          <br />
                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>List Name</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                              label="List Name"
                              name="listName"
                              name="listName"
                              id="listName"
                              value={this.state.listName.charAt(0).toUpperCase() + this.state.listName.slice(1)}
                              onChange={e => {
                                this.setState(
                                  { listName: e.target.value },
                                  () => {
                                    console.log(
                                      "List name: " +
                                      this.state.listName
                                    );
                                  }
                                );
                              }}
                            />
                          </InputGroup>
                          {this.state.listNameError && (
                            <font color="red">
                              <h6>
                                {" "}
                                <p>{this.state.listNameError} </p>
                              </h6>{" "}
                            </font>
                          )}


<InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b>  Date of Submission</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="dos"
                                id="dos"
                                value={this.state.dos}
                                onChange={date=>{this.setState({dos:date},()=>{console.log("DOS: "+this.state.dos)})}}
                              />


                            </InputGroup>
                            {this.state.dosError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.dosError}</p></h6>
                                </font>
                              )}









                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "palevioletred" }}>
                                <th className="text-center">
                                  <h5> S.No.</h5>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h5>Item Name </h5>
                                </th>
                                <th className="text-center">
                                  <h5>Unit</h5>{" "}
                                </th>
                                <th className="text-center">
                                  <h5>Quantity</h5>{" "}
                                </th>
                               
                                <th className="text-center">
                                  <h5>Cost/Unit(Rs)</h5>{" "}
                                </th>
                                <th className="text-center">
                                  <h5>Total(Rs)</h5>{" "}
                                </th>


                                <th className="text-center">
                                  <Button
                                    onClick={this.handleAddRow}
                                    className="btn btn-primary"
                                    color="primary"

                                    block
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
                                  <td   style={{width:"200px"}}>
                                  
                                   <Select                            id="itemName"
                            name="itemName"
                              
                          placeholder="Select Item"
                            options={this.state.existingItems}
                          closeMenuOnSelect={true}
                         value={this.state.rows[idx].itemName}
                         isClearable={true}
                              isSearchable={true}
                            
                            onChange={selectedItem=>{

                              
                                const temp = this.state.rows;
                                temp[idx]["itemName"] = {"label":selectedItem.value.charAt(0).toUpperCase()+
                                selectedItem.value.slice(1),"value":selectedItem.value};

                                for(var i=0;i<this.state.allItemsData.length;i++)
                                {
                                    if(this.state.allItemsData[i].itemName===selectedItem.value)
                                    {
                                        temp[idx]["unit"]=this.state.allItemsData[i].unit;
                                        break;
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
                                        name="unit"
                                        type="text"
                                        className="form-control"
                                        value={this.state.rows[idx].unit}
                                      
                                        style={{textAlign:'center'}}
                                        id="unit"
                                        size="lg"
                                        disabled
                                      />
                                    </InputGroup>
                                  </td>

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="quantity"
                                        type="number"
                                        className="form-control"
                                        value={this.state.rows[idx].quantity}
                                        onChange={this.handleChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="quantity"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="costPerItem"
                                        type="number"
                                        className="form-control"
                                        value={this.state.rows[idx].costPerItem}
                                        onChange={this.handleChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="costPerItem"
                                        size="lg"
                                      />
                                    </InputGroup>
                                  </td>

                                  <td>
                                    <InputGroup className="mb-3">
                                      <Input
                                        name="totalAmount"
                                        type="number"
                                        className="form-control"
                                        value={this.state.rows[idx].totalAmount}
                                        onChange={this.handleChange(idx)}
                                        style={{textAlign:'center'}}
                                        id="totalAmount"
                                        size="lg"
                                        disabled
                                      />
                                    </InputGroup>
                                  </td>

                                  <td align="center">
                                    <Button
                                      className="btn btn-danger btn-sg"
                                      onClick={this.handleRemoveSpecificRow(
                                        idx
                                      )}
                                      size="lg"
                                    >
                                      Remove
                                    </Button>
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
                          )}


<InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Grand Total Amount(Rs)</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                             name="grandTotal"
                              id="grandTotal"
                             value={this.state.grandTotal}
                              disabled


                            />
                          </InputGroup>

                          <InputGroup className="mb-3">
                            <InputGroupAddon addonType="prepend">
                              <InputGroupText >
                                <b>Remarks</b>
                              </InputGroupText>
                            </InputGroupAddon>
                            <Input
                              type="text"
                              size="lg"
                             name="remarks"
                              id="remarks"
                             value={this.state.remarks}
                             onChange={e => {
                                this.setState(
                                  { remarks: e.target.value })}}


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

export default AddItems;
