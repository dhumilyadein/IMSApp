import React, { Component } from "react";
import DatePicker from 'react-date-picker';
import { confirmAlert } from 'react-confirm-alert';
import 'react-confirm-alert/src/react-confirm-alert.css'
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

class DeleteStudents extends Component {
  constructor(props) {
    super(props);

this.getExistingVehicles();


    this.state = {
        
        
      
      erorrs: null,
      success: null,
      vehicleNo: "",
      existingVehicles:[],
      selectedStops:"",
      stopError:"",
      stopArray:[],
      vehicleNoError: "",
      stopError:"",
      success: false,
      modalSuccess: false,
      visible: false,
     existingRoutes:[],
      existingStops:[],
      allStudentsOfSelectedStop:[],
     
     
     
      modalMessage:"",
      allVehicleDetails:[],
      seats:"",seatError:"",
      allAssignedStudents:[]
    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

    this.getExistingStops = this.getExistingStops.bind(this);
   
    this.getExistingVehicles = this.getExistingVehicles.bind(this);
    
   
   




  }

 

  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
      allStudentsOfSelectedStop:[],
       selectedStops:"",vehicleNo:"",seats:""
     
    });

    this.getExistingVehicles();

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
      vehicleNoError: "", stopError:"",  success: false,
      modalSuccess: false,
    }, () => {
      if (!this.state.vehicleNo) {
        this.setState({ vehicleNoError: "Please Select Vehicle No" });
        submit = false;}

        if (!this.state.selectedStops) {
            this.setState({ stopError: "Please Select Stop" });
            submit = false;}

      
           



      if (submit === true) {
        console.log("Editing Students: ");
        axios
          .post("http://localhost:8001/api/addStudent", {"vehicleNo":this.state.vehicleNo,"stopName":this.state.selectedStops,
          "students":this.state.allStudentsOfSelectedStop})
          .then(result => {
            console.log("Added Students" + JSON.stringify(result.data));

            if(result.data.errors)
            {
           
              this.setState({
                errors:result.data.errors
              });}
             else if (result.data.msg === "Success")
              this.setState({

                success: true,
                modalSuccess: true,
                modalMessage:" Students Details Updated for Stop: "+this.state.selectedStops+
                " for VehicleNo: "+this.state.vehicleNo+ " successfully!"
               

              });

          });
      }
    });
  }

 
  


  

  getExistingStops() {

   
            var temp=[];
            for(var i=0;i<this.state.existingRoutes.length;i++)
            if(this.state.existingRoutes[i].vehicleNo===this.state.vehicleNo)
            for(var j=0;j<this.state.existingRoutes[i].route.length;j++)
            temp.push(this.state.existingRoutes[i].route[j]);

            temp=Array.from(new Set(temp));
          this.setState({
            existingStops: temp
          });
        }
      
  

  getExistingVehicles() {

    axios
      .get("http://localhost:8001/api/existingVehicles")
      .then(result => {
        console.log("Existing RESULT.data " + JSON.stringify(result.data));
        
        if (result.data) { var temp1=[];var temp2=[]; var allAssigned=[];
            for(var i=0;i<result.data.length;i++)
           { temp1.push(result.data[i].vehicleNo)
            for(var j=0;j<result.data[i].routeDetails.length;j++)
            temp2.push({"vehicleNo":result.data[i].vehicleNo, "route":result.data[i].routeDetails[j].route,
            "description":result.data[i].routeDetails[j].description});

            for(var j=0;j<result.data[i].studentDetails.length;j++)
            for(var k =0; k<result.data[i].studentDetails[j].students.length;k++)
            allAssigned.push({"value":result.data[i].studentDetails[j].students[k], "label":result.data[i].studentDetails[j].students[k]
          })
          
          }

          this.setState({
            existingVehicles: temp1,
            allVehicleDetails:result.data,
            existingRoutes:temp2, allAssignedStudents:allAssigned
          },()=>{console.log("Routes Details: "+ JSON.stringify(this.state.existingRoutes))});
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
                  <h1>Transport Management</h1>
                  <br /> <br />
                  {this.state.success && (
                    <Modal
                      isOpen={this.state.modalSuccess}
                      className={"modal-success " + this.props.className}
                      toggle={this.toggleSuccess}
                    >
                      <ModalHeader toggle={this.toggleSuccess}>
                      {this.state.modalMessage}
                      </ModalHeader>
                    </Modal>
                  )}



               

                      <Card className="mx-1">
                        <CardBody className="p-2">
                        <Card>
                          <h3 align="center">View/Edit Students Assignment</h3>
                          <br />
                         
                          <InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                      <b>  Vehicle No</b>
                                </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="vehicleNo"
                                      id="vehicleNo"
                                      type="select"
                                      value={this.state.vehicleNo}
                                      onChange={e=>{ var count = 0; var capacity;
                                        for(var i=0;i<this.state.allVehicleDetails.length;i++)
                                        {if(this.state.allVehicleDetails[i].vehicleNo===e.target.value)

                                          {  capacity= this.state.allVehicleDetails[i].capacity;
                                           var temp=[];
                                            for(var j=0;j<this.state.allVehicleDetails[i].studentDetails.length;j++){
                                             // temp.push(this.state.allVehicleDetails[i].studentDetails[i].)
                                            count=count +this.state.allVehicleDetails[i].studentDetails[j].students.length}
                                          }
                
                                        }
                                        
                                        this.setState({vehicleNo:e.target.value, studentsDataArray:[], selectedStudent:[],section:"",
                                           seats: capacity-count,allStudentsOfSelectedStop:[]},()=>{this.getExistingStops();})}}
                                    >
                                      <option value="">Select</option>
                                      {this.state.existingVehicles.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                    </Input>
                                  </InputGroup>
                                  { this.state.vehicleNoError && (
                                    <font color="red">
                                      {" "}
                                     <b> <p>{this.state.vehicleNoError}</p></b>
                                    </font>
                                  )}




<InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                      <b>  Stop Name</b>
                                </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="stop"
                                      id="stop"
                                      type="select"
                                      value={this.state.selectedStops}
                                      onChange={e=>{ console.log("All value"+JSON.stringify(this.state.allVehicleDetails));
                                      var temp=[];
                                          for(var i=0;i<this.state.allVehicleDetails.length;i++)
                                         { if(this.state.allVehicleDetails[i].vehicleNo===this.state.vehicleNo)
                                         { for(var j=0;j<this.state.allVehicleDetails[i].studentDetails.length;j++)
                                        {    console.log("stop value2"+JSON.stringify(this.state.allVehicleDetails[i].studentDetails[j].stopName));

                                            if(this.state.allVehicleDetails[i].studentDetails[j].stopName===e.target.value)
                                               {
                                                 for(var k=0;k<this.state.allVehicleDetails[i].studentDetails[j].students.length;k++)
                                                temp.push({"value":this.state.allVehicleDetails[i].studentDetails[j].students[k],
                                                "label":this.state.allVehicleDetails[i].studentDetails[j].students[k]
                                            })}

                                        }}}

                                        this.setState({selectedStops:e.target.value,allStudentsOfSelectedStop:temp,section:""})}}
                                    >
                                      <option value="">Select</option>
                                      {this.state.existingStops.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                    </Input>
                                  </InputGroup>

                                 
                                  {this.state.stopError && (
                                    <font color="red">
                                      {" "}
                                     <b> <p>{this.state.stopError}</p></b>
                                    </font>
                                  )}



<InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                      <b>  Seats Available</b>
                                </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="seats"
                                      id="seats"
                                      type="Number"
                                      value={this.state.seats}
                                     disabled
                                    >
                                     
                                    </Input>
                                  </InputGroup>
                                 


                                





<br/> 
<Select
placeholder="All Selected/Existing Students"
                            id="allStudentSelect"
                            name="allStudentSelect"
isMulti={true}
                        
                           
                          
                         value={this.state.allStudentsOfSelectedStop}
                         isClearable={true}
                        
                         autosize

                            onChange={e=>{
                              var currentCount=this.state.allStudentsOfSelectedStop.length;
                              this.setState({allStudentsOfSelectedStop:e, section:"", 
                              seats:this.state.seats+(currentCount-e.length)}
                             )}}
                            />  
                              {this.state.studentError && (
                                    <font color="red">
                                      {" "}
                                     <b> <p>{this.state.studentError}</p></b>
                                    </font>
                                  )}
  <br/>
                        

<Row align="center">
                            <Col>
                              <Button
                                onClick={this.submitHandler}
                                size="lg"
                                color="success"
disabled={parseInt(this.state.seats)<=0}
                              >
                                Add All Students
                              </Button>
                            </Col>


                          </Row> <br />
                       </Card>    <br /><br />

                     

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

export default DeleteStudents;
