import React, { Component } from "react";
import 'bootstrap/dist/css/bootstrap.css';
import ReactLoading from 'react-loading';


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

  Row,

  Modal,
  ModalHeader,


} from "reactstrap";

import axios from "axios";

class importBulkBooks extends Component {
  constructor(props) {
    super(props);
    this.state = {

      userdata: null,

      impSuccess: false,
      errors: null,
      importErrors: null,
      visible: true,
      modalSuccess: true,
      file: null,
      noFile: false,
      corruptFile: false,
      filename: null,
      loader: false,
     
      showErrors: false,
  





    };

    this.onDismiss = this.onDismiss.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);

    this.fileHandler = this.fileHandler.bind(this);
    this.fileChange = this.fileChange.bind(this);
    this.reset = this.reset.bind(this);


  }

  reset = e => {

    document.getElementById("file").value = null;
    this.setState({
      userdata: null,

      impSuccess: false,
      errors: null,
      importErrors: null,
      visible: true,
      modalSuccess: true,
      file: null,
      noFile: false,
      corruptFile: false,
      filename: null,
      loader: false,
      zipFile: null,
      noZipFile: false,
      corruptZipFile: false,
      zipFilename: null,
      showErrors: false,
      zipFile: null,
      disableButton: false
    })


  }


  toggleSuccess() {
    this.setState({
      modalSuccess: !this.state.modalSuccess,
    });
  }

  /**
 * @description Dismisses the alert
 * @param {*} e
 */
  onDismiss() {
    this.setState({ visible: !this.state.visible });
  }


  fileHandler = e => {
    e.preventDefault() // Stop form submit
    const excel = new FormData();
   var submit=true;
    console.log("file" + this.state.filename);
    this.setState({ loader: true, importErrors: null, showErrors: false, disableButton: true,impSuccess:false });
    if (!this.state.file)
{submit=false
      this.setState({

        noFile: true,
        modalSuccess: true,
        corruptFile: false,
        impSuccess: false,
        loader: false,
        disableButton: false

      });}
  

    if (submit) {
      console.log("importing books");

              excel.append('file', this.state.file, this.state.filename);
             
              axios
                .post("http://localhost:8001/api/importBooks", excel)
                .then(res => {
                  console.log("in Import Res " + JSON.stringify(res.data));
                  if (res.data.error_code === 1) {

                   
                    this.setState({

                      corruptFile: true,
                      modalSuccess: true,
                      noFile: false,
                      loader: false,
                      disableButton: false,
                      impSuccess: false,



                    });
                  }
                  else if (res.data.msg === "Imported Successfully") {

                    //console.log("in sucess: "+res.data);
                    this.reset();
                    return this.setState({

                      importErrors: null,
                      impSuccess: true,
                      modalSuccess: true,
                      noFile: false,
                      corruptFile: false,
                      file: null,
                      filename:res.data.excelfilename,
                      loader: false,
                      disableButton: false
                    });
                  }
                  else if (res.data.errors) {
                    console.log("in import errors");
                   
                    document.getElementById("file").value = null;
                    this.setState({

                      importErrors: res.data.errors,
                      file: null,
                      zipFile: null,
                      impSuccess: false,
                      corruptFile: false,
                      loader: false,
                      disableButton: false

                    }, () => {
                      console.log("errors length: " + Object.keys(this.state.importErrors).length)
                    });

                  }

                })


            }


         
  }



  fileChange = event => {
    try {
      const file = event.target.files[0];
     
        this.setState({ file: file, noFile: false, corruptFile: false, filename: file.name, importErrors: null }, () => console.log("file:  " + this.state.file.name));
     
    }
    catch (err) {
      console.log("File Upload error: No file selected: " + JSON.stringify(err));
    }
  }


  render() {
    return (
      <div style={{ width: "1000px" }} >

        <Container style={{ width: "3500px" }} >

          <Row lg="4" style={{ width: "6000px" }}>


            <Col md="2">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form  >
                    <h1>Import Books</h1>
                    {this.state.impSuccess &&

                      <Modal isOpen={this.state.modalSuccess} className={'modal-success ' + this.props.className} toggle={this.toggleSuccess}>
                        <ModalHeader toggle={this.toggleSuccess}>Excel sheet {this.state.filename} Imported Successfully!</ModalHeader>

                      </Modal>}



                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                        <div> 
                        <font color="red"><h6>  BookName, BookId, Category and Quantity are mandatory fields</h6></font>
                          
                          <font color="red"><h6>  If you face any unexpected behaviour, click Reset or Refresh your browser's tab and try again.</h6></font>
                          <br />
                        
                        </div>

                      </InputGroupAddon>
                      <h4>Upload excel file(XLS,XLSX)</h4>
                      <Input
                        type="file"
                        name="file"
                        id="file"


                        onChange={this.fileChange}
                      />
                    </InputGroup>

                    {this.state.noFile
                      && <font color="red">  <h5>Please choose the Excel file</h5></font>
                    }

                    {this.state.corruptFile
                      && <font color="red">  <h5>Please select a valid XLS or XLSX file only.</h5></font>
                    }

                   

                    <Row className="align-items-center">
                      <Col col="6" sm="2" md="3" xl className="mb-3 mb-xl-0">
                       
                      {!this.state.loader && 
                        <Button type="submit" block color="success"
                         onClick={this.fileHandler} disabled={this.state.disableButton}
                          style={{ width: "200px" }}><h4> Import Books </h4>  </Button>}

                        {this.state.loader && <font color="Green">  <h5>Importing sheet...</h5></font>}
                        {this.state.loader &&
                          <ReactLoading type="bars"
                            color="	#006400"
                            height='2%' width='20%' />

                        }
                      </Col>
                      <Col><Button block onClick={this.reset} color="info" style={{ width: "200px" }}>
                         <h4> Reset </h4> 
                        </Button ></Col>
                    </Row>

                    <br />

                    {this.state.importErrors &&
                      <Row className="align-items-center">
                        <Col col="6" sm="2" md="2" xl className="mb-3 mb-xl-0">
                          <font color="red">  <p>{Object.keys(this.state.importErrors).length} record(s) failed to import. For errors, click Errors</p></font>
                          <Button type="submit" block color="danger" style={{ width: "200px" }} onClick={(e) => { e.preventDefault(); this.setState({ showErrors: true }) }}> Errors</Button>

                          <br /><br />
                          {this.state.showErrors &&
                            <font color="red">  <div>Errors:  <pre> <h5> {JSON.stringify(this.state.importErrors, null, "\t")}</h5></pre></div></font>}

                        </Col>
                      </Row>}



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

export default importBulkBooks;
