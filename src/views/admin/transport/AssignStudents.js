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

class AssignStudents extends Component {
  constructor(props) {
    super(props);

this.getExistingVehicles();
this.fetchClassDetails();


    this.state = {
        selectedStudent:[],
        studentError:"",
        classDetails:[],
        classes:[],
        sectionArray: [],
        studentsDataArray:[],
        sectionError:"",
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
      allSelectedStudents:[],
      showEditDetails:false,
      RouteNo:"",
      description:"",
      modalMessage:"",
      allVehicleDetails:[]
    };





    this.submitHandler = this.submitHandler.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);
    this.onDismiss = this.onDismiss.bind(this);

    this.getExistingStops = this.getExistingStops.bind(this);
   
    this.getExistingVehicles = this.getExistingVehicles.bind(this);
    
    this.deleteSpecificItem = this.deleteSpecificItem.bind(this);
    this.editHandler = this.editHandler.bind(this);
    this.classChangeHandler = this.classChangeHandler.bind(this);
         this.sectionChangeHandler = this.sectionChangeHandler.bind(this);
         this.fetchClassDetails=this.fetchClassDetails.bind(this);
         this.studentSelectedHandler=this.studentSelectedHandler.bind(this);
         this.addStudents=this.addStudents.bind(this);




  }

  addStudents()
  {var temp=this.state.allSelectedStudents;
    for(var i=0;i<this.state.selectedStudent.length;i++)
    temp.push(this.state.selectedStudent[i]);
    temp=Array.from(new Set(temp));
    this.setState({allSelectedStudents:temp,selectedStudent:[]})
    
    }


  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
       selectedStudent:[], allSelectedStudents:[],
       selectedStops:""
     
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
      modalSuccess: false, studentError:""
    }, () => {
      if (!this.state.vehicleNo) {
        this.setState({ vehicleNoError: "Please Select Vehicle No" });
        submit = false;}

        if (!this.state.selectedStops) {
            this.setState({ stopError: "Please Select Stop" });
            submit = false;}

            
        if (this.state.allSelectedStudents.length===0) {
            this.setState({ studentError: "Please Select Atleast 1 Student" });
            submit = false;}
        
           



      if (submit === true) {
        console.log("Adding Students: ");
        axios
          .post("http://localhost:8001/api/addStudent", {"vehicleNo":this.state.vehicleNo,"stopName":this.state.selectedStops,
          "students":this.state.allSelectedStudents})
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
                modalMessage:this.state.allSelectedStudents.length + " Students added to Stop: "+this.state.selectedStops+
                " for VehicleNo: "+this.state.vehicleNo+ " successfully!"
               

              });

          });
      }
    });
  }

 
  fetchClassDetails() {

    axios.get("http://localhost:8001/api/fetchAllClassDetails").then(cRes => {
console.log("Class Details: "+JSON.stringify(cRes.data))
      if (cRes.data.errors) {

        return this.setState({ errors: cRes.data.errors });

      } else {

        this.setState({ classDetails: cRes.data },()=>{

          var classArray = [];
    this.state.classDetails.forEach(element => {

      console.log("element.class - " + element.class);
      classArray.push(element.class);
    });
   // console.log("classArray - " + classArray);
   var uniqueItems = Array.from(new Set(classArray));



    this.setState({ classes: uniqueItems });
        });

        console.log('ClassDetails - fetchClassDetails - All class details - ' + JSON.stringify(this.state.classDetails));


      }
    });
  }

  /**
   * @description - fetches unique classes from the class detail from DB
   */


  classChangeHandler(e) {

    var selectedClass = e.currentTarget.value;
    console.log("e.target.name - " + [e.currentTarget.name] + " e.target.value - " + selectedClass);
    this.setState({ class: selectedClass,
    section:"",selectedStudent:[] });

    var sectionArrayTemp = [];
    this.state.classDetails.forEach(element => {
      if (element["class"] === selectedClass) {

        sectionArrayTemp.push(element["section"]);

      }
    });

    // Sorting array alphabetically
    sectionArrayTemp.sort();

    this.setState({
       sectionArray: sectionArrayTemp,
      })

    console.log("Selected class - " + selectedClass + " Sections - " + sectionArrayTemp );

    // Switching view to section view

  }

  sectionChangeHandler(e) {


    this.setState({ section: e.currentTarget.value,selectedStudent:[] },()=>{
      this.state.classDetails.forEach(element => {


        if (element.class === this.state.class && element.section === this.state.section) {
              this.setState({
            studentsDataArray : element.studentsData
           },()=>{ console.log("studentsDataArray: "+ JSON.stringify(this.state.studentsDataArray));
            var temp=[];
            this.state.studentsDataArray.forEach(element=>{
            temp.push({"value":element.username,
            "label":element.firstname.charAt(0).toUpperCase()+element.firstname.slice(1)+" "+element.lastname.charAt(0).toUpperCase()+element.lastname.slice(1)+" ("+element.username+")"})

            })
            temp.sort();
            this.setState({studentsDataArray:temp});

           });
        }
      });




    });







  }

studentSelectedHandler(e){
if(e)
 { console.log("In Student "+JSON.stringify(e));

this.setState({selectedStudent:e});


}

}

  editHandler(e) {
    var submit = true;
    console.log("in Submit State: " + JSON.stringify(this.state));

    this.setState({
      vehicleNoError: "", stopError:"",  success: false,
      modalSuccess: false
    }, () => {
     

        if (this.state.stopArray.length===0) {
            this.setState({ stopError: "Please Select Stops" });
            submit = false;}
        
        


      if (submit === true) {
        console.log("Updating Route: "+ JSON.stringify(this.state));
        axios
          .post("http://localhost:8001/api/editRoute", {"vehicleNo":this.state.vehicleNo,"route":this.state.stopArray,
          "description":this.state.description})
          .then(result => {
            console.log("RESULT.data " + JSON.stringify(result.data));
           if(result.data.error)
       
            this.setState({
              vehicleNoError:result.data.error
            });
           else  if (result.data.msg === "Route Updated")
              this.setState({

                success: true,
                modalSuccess: true,
                showEditDetails:false,
                vehicleNo:"",
                selectedStops:[],
                description:""
              


              },()=>{this.getExistingVehicles()});

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
        if (result.data) { var temp1=[];var temp2=[];
            for(var i=0;i<result.data.length;i++)
           { temp1.push(result.data[i].vehicleNo)
            for(var j=0;j<result.data[i].routeDetails.length;j++)
            temp2.push({"vehicleNo":result.data[i].vehicleNo, "route":result.data[i].routeDetails[j].route,
            "description":result.data[i].routeDetails[j].description})}

          this.setState({
            existingVehicles: temp1,
            allVehicleDetails:result.data,
            existingRoutes:temp2
          },()=>{console.log("Routes Details: "+ JSON.stringify(this.state.existingRoutes))});
        }
      });
  }


deleteSpecificItem= idx => () => {

  confirmAlert({
    title: 'Confirm to Remove',
    message: 'Are you sure to Remove this Route?',
    buttons: [
      {
        label: 'Yes',
        onClick: () =>

        axios
        .post("http://localhost:8001/api/deleteRoute",{"vehicleNo":this.state.existingRoutes[idx].vehicleNo,
        "route":this.state.existingRoutes[idx].route})
        .then(result => {
          console.log("Existing RESULT.data " + JSON.stringify(result.data));
          if (result.data.msg==="Route Deleted")
            this.getExistingVehicles();

        })
      },
      {
        label: 'No',
        onClick: () =>  {this.getExistingStops();}
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
                          <h3 align="center">Add/Edit Students Assignment</h3>
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
                                      onChange={e=>{this.setState({vehicleNo:e.target.value},()=>{this.getExistingStops();})}}
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

                                        this.setState({selectedStops:e.target.value,allSelectedStudents:temp})}}
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
<br/>

<InputGroup className="mb-4">
                                    <InputGroupAddon addonType="prepend">
                                      <InputGroupText style={{ width: "120px" }}>
                                      <b>  Class</b>
                                </InputGroupText>
                                    </InputGroupAddon>
                                    <Input
                                      name="class"
                                      id="class"
                                      type="select"
                                      value={this.state.class}
                                      onChange={this.classChangeHandler}
                                    >
                                      <option value="">Select</option>
                                      {this.state.classes.map(element => {
                                        return (<option key={element} value={element}>{element}</option>);
                                      }
                                      )}
                                    </Input>
                                  </InputGroup>
                                  { this.state.classError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.classError}</p>
                                    </font>
                                  )}

                                    <InputGroup className="mb-4">
                                      <InputGroupAddon addonType="prepend">
                                        <InputGroupText style={{ width: "120px" }}>
                                       <b>   Section</b>
                                </InputGroupText>
                                      </InputGroupAddon>
                                      <Input
                                        name="section"
                                        id="section"
                                        type="select"
                                        value={this.state.section}
                                        onChange={this.sectionChangeHandler}
                                      >
                                        <option value="">Select</option>
                                        {this.state.sectionArray.map(element => {
                                          return (<option key={element} value={element}>{element}</option>);
                                        }
                                        )}

                                      </Input>
                                    </InputGroup>

                                  {this.state.sectionError && (
                                    <font color="red">
                                      {" "}
                                      <p>{this.state.sectionError}</p>
                                    </font>
                                  )}



                   <Select
                            id="studentSelect"
                            name="studentSelect"
isMulti={true}
                          placeholder="Select Students or Type to search"
                            options={this.state.studentsDataArray}
                          
                         value={this.state.selectedStudent}
                         isClearable={true}
                         closeMenuOnSelect={false}
                            isSearchable={true}

                            onChange={this.studentSelectedHandler}
                            />   
 <br/>
<Row align="center">
                            <Col>
<Button
                            onClick={this.addStudents}
                            size="lg"
                            color="primary"

                          >
                            Add to Main list
                          </Button></Col></Row>
<br/> 
<Select
placeholder="All Selected/Existing Students"
                            id="allStudentSelect"
                            name="allStudentSelect"
isMulti={true}
                        
                           // options={this.state.studentsDataArray}
                          
                         value={this.state.allSelectedStudents}
                         isClearable={true}
                        
                         autosize

                            onChange={e=>{this.setState({allSelectedStudents:e})}}
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

export default AssignStudents;
