import React, { Component } from "react";
import DatePicker from 'react-date-picker';


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
    this.state = {

    
      existingItems:[],
      showSearchResults:false,
   
      dos:"",
      doe:new Date(Date.now()),
      activeTab: '1',
      viewItem:{},
      showAddedItem:false

    };




    this.toggle = this.toggle.bind(this);
    this.submitHandler = this.submitHandler.bind(this);



   
 

    


  }

  toggle(tab) {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
        doe:new Date(Date.now()),
        dos:"",
        dateError:""
      });
    }
  }

 

  submitHandler(e) {
    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state.activeTab));

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

        if(this.state.activeTab==="1")

        {
            console.log("Getting Added Items: ");
            axios
              .post("http://localhost:8001/api/getAddedItems", {"doe":this.state.doe,"dos":this.state.dos})
              .then(result => {
                console.log("RESULT.data " + JSON.stringify(result.data));

                if(result.data.error)
                this.setState({
                    dateError:result.data.error
                  });
    
                if(result.data.data.length===0)
                { 
               
                  this.setState({
                    dateError:"No Records Found!"
                  });}
                else if(result.data.data.length>0)
                {
                    this.setState({
                        showSearchResults:true,
                        existingItems:result.data.data
                      });

                }


    
              });

        }

        if(this.state.activeTab==="2")

        {}

       
      }
    });
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

{this.state.showSearchResults && <p>

<h3 align="center"> Search Results</h3>
                          <br />


                          <Table bordered hover>
                            <thead>
                              <tr style={{ 'backgroundColor': "lightgreen" }}>
                                <th className="text-center">
                                  <h4> S.No.</h4>{" "}
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>List Name </h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Date</h4>
                                </th>

                                <th className="text-center">
                                  {" "}
                                  <h4>Paid Amount(Rs)</h4>
                                </th>
                                <th className="text-center">
                                  {" "}
                                  <h4>Remarks</h4>
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
                                    <h5> {this.state.existingItems[idx].listName.charAt(0).toUpperCase() +
                                      this.state.existingItems[idx].listName.slice(1)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].dos.substring(0,10)}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].grandTotal}</h5>
                                  </td>

                                  <td align="center">
                                    <h5> {this.state.existingItems[idx].remarks}</h5>
                                  </td>

                                  <td align="center">
                                  <Button
                                      color="primary"
                                      onClick={
                                        this.setState({
                                            showSearchResults:false,
                                            showAddedItem:true,
                                            viewItem:this.state.existingItems[idx]
                                        })
                                    }

                                        
                                      size="lg"
                                    >
                                      View
                                    </Button>
                                    &nbsp; &nbsp;

                                   


                                  </td>
                                </tr>
                              ))}
                            </tbody>
                          </Table>
                       

                          </p>     }


                       
{this.state.showAddedItem && <p>

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
     
    
      value={this.state.viewItem.listName.charAt(0).toUpperCase() + this.state.viewItem.listName.slice(1)}
     disabled
    />
  </InputGroup>
 

<InputGroup className="mb-2">
      <InputGroupAddon addonType="prepend">
        <InputGroupText >
        <b>  Date of Submission</b>
        </InputGroupText>
      </InputGroupAddon>

      &nbsp; &nbsp; &nbsp;
      <Input

        value={this.state.viewItem.dos.substring(0,10)}
       disabled
      />


    </InputGroup>
 
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


       
      </tr>
    </thead>
    <tbody>
      {this.state.viewItem.itemRows.map((item, idx) => (
        <tr id="addr0" key={idx}>
          <td align="center">
            <h4>{idx + 1}</h4>
          </td>
          <td   >
          
          {this.state.viewItem.itemRows[idx].itemName.label}


          </td>
         


          <td>
           {this.state.viewItem.itemRows[idx].unit}
              
            
          </td>

          <td>
          {this.state.viewItem.itemRows[idx].quantity}
          </td>

          <td>
          {this.state.viewItem.itemRows[idx].costPerItem}
          </td>

          <td>
          {this.state.viewItem.itemRows[idx].totalAmount}
          </td>

       
        </tr>
      ))}
    </tbody>
  </Table>


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
     value={this.state.viewItem.grandTotal}
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
     value={this.state.viewItem.remarks}
    disabled

    />
  </InputGroup>

  <br /> <br />
  <Row>
    <Col>
      <Button
        onClick={e=>{this.setState({showSearchResults:true,
        showAddedItem:false})}}
        size="lg"
        color="secondary"
        block
      >
        Go back
      </Button>
    </Col>

   
  </Row>
</CardBody>

</Card>
</p>}
                                        
               


 

              </Col>
            </Row>
          </TabPane>
          <TabPane tabId="2">
        </TabPane>
        </TabContent>

        
        </CardBody>
              </Card>
      </div>
                  );
}}

export default ItemHistory;
