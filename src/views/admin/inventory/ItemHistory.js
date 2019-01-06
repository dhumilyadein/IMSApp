import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
import Select from 'react-select';
import classnames from 'classnames';
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
  ModalHeader, TabContent, TabPane, Nav, NavItem, NavLink,   CardTitle, CardText,
} from "reactstrap";

import axios from "axios";

class ItemHistory extends Component {
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
      showSearchResults:false,
      itemNo:"",
      dos:"",
      doe:new Date(Date.now()),
      activeTab: '1'
    };




    this.toggle = this.toggle.bind(this);
    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);


    this.getExistingItems = this.getExistingItems.bind(this);
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);

    


  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        doe:new Date(Date.now()),
      });
    }
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
      dateError: "",
    }, () => {
      if (!this.state.dos) {
        this.setState({ dateError: "Please select Start Date" });
        submit = false;}

        if (!this.state.doe) {
            this.setState({  dateError: "Please select End Date"});
            submit = false;}

            if(new Date(this.state.dos).getTime()>new Date(this.state.doe).getTime())
            {
                this.setState({  dateError: "Start Date can't be Greater than End Date!"});
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

<Card className="mx-4">
                <CardBody className="p-4">
                  <h1>Inventory Items History</h1>
                 

            <br/>

        <Nav tabs>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '1' })}
              onClick={() => { this.toggle('1'); }}
            >
             <h5>Added items</h5>
            </NavLink>
          </NavItem>
          <NavItem>
            <NavLink
              className={classnames({ active: this.state.activeTab === '2' })}
              onClick={() => { this.toggle('2'); }}
            >
              <h5>Consumed items</h5>
            </NavLink>
          </NavItem>
        </Nav>
        <TabContent activeTab={this.state.activeTab}>
          <TabPane tabId="1">
            <Row>
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
              <Col sm="12">
             
                 
                 

              
                          

                          <h5> Choose Date Period</h5>
                          <br/>
                          <Row>
                          <InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b> Start Date</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="dos"
                                id="dos"
                                value={this.state.dos}
                                onChange={date=>{this.setState({dos:date},()=>{console.log("DOS: "+this.state.dos)})}}
                              />
&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
<InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b> End Date</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="doe"
                                id="doe"
                                value={this.state.doe}
                                onChange={date=>{this.setState({doe:date},()=>{console.log("DOe: "+this.state.doe)})}}
                              />
                            </InputGroup>
                        
                          
                         
 </Row>
 {this.state.dateError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.dateError}</p></h6>
                                </font>
                              )}


<Row >
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"

                              >
                                Search
                              </Button>
                            </Col>


                          </Row>
                          <br /> <br />

{this.state.showSearchResults && <p>

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
                       

                          </p>     }


                       
                    
                                        
               


 

              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
          <Row>
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
              <Col sm="12">
             
                 
                 

              
                          

                          <h5> Choose Date Period</h5>
                          <br/>
                          <Row>
                          <InputGroup className="mb-2">
                              <InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b> Start Date</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="dos"
                                id="dos"
                                value={this.state.dos}
                                onChange={date=>{this.setState({dos:date},()=>{console.log("DOS: "+this.state.dos)})}}
                              />
&nbsp; &nbsp; &nbsp; &nbsp;&nbsp; &nbsp; &nbsp; &nbsp;
<InputGroupAddon addonType="prepend">
                                <InputGroupText >
                                <b> End Date</b>
                                </InputGroupText>
                              </InputGroupAddon>

                              &nbsp; &nbsp; &nbsp; &nbsp;
                              <DatePicker

                                name="doe"
                                id="doe"
                                value={this.state.doe}
                                onChange={date=>{this.setState({doe:date},()=>{console.log("DOe: "+this.state.doe)})}}
                              />
                            </InputGroup>
                          
                           {this.state.dateError &&(
                                <font color="red"><h6>
                                  {" "}
                                  <p>{this.state.dateError}</p></h6>
                                </font>
                              )}
 </Row>


<br/>
<Row >
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"

                              >
                                Search
                              </Button>
                            </Col>


                          </Row>
                          <br /> <br />


{ this.state.showSearchResults &&  <p>
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
                       
</p>

      }

                                      
                                        
               


 

              </Col>
            </Row></TabPane>
        </TabContent>

        
        </CardBody>
              </Card>
      </div>
                  );
}}

export default ItemHistory;
