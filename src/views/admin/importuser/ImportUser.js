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

class ImportUser extends Component {
  constructor(props) {
    super(props);
    this.state = {

      userdata: null,

      impSuccess: false,
      errors: null,
      importErrors:null,
      visible: true,
      modalSuccess: true,
      file: null,
      noFile: false,
      corruptFile: false,
      filename: null,
      loader:false,
      zipFile: null,
      noZipFile: false,
      corruptZipFile: false,
      zipFilename:null





    };

    this.onDismiss = this.onDismiss.bind(this);
    this.toggleSuccess = this.toggleSuccess.bind(this);

    this.fileHandler = this.fileHandler.bind(this);
    this.fileChange = this.fileChange.bind(this);


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
    this.setState({ visible: false });
  }


  fileHandler = e => {
    e.preventDefault() // Stop form submit
    const excel = new FormData();
    const zip = new FormData();
    console.log("file" + this.state.file);
    this.setState({loader:true});
    if (!this.state.file)

      this.setState({

        noFile: true,
        modalSuccess: true,
        corruptFile: false,
        impSuccess: false,
        loader:false

      });
 if(!this.state.zipFile)

this.setState({

  noZipFile: true,
  modalSuccess: true,
  corruptZipFile: false,
  impSuccess: false,
  loader:false

});

    if(this.state.noZipFile===false && this.state.corruptZipFile===false && this.state.noFile===false && this.state.corruptFile===false)

    {

      zip.append('file', this.state.zipFile, this.state.zipFilename);

      axios
      .post("http://localhost:8001/api/photoZipUploading", zip)
      .then(res => {
        console.log("in Res " + JSON.stringify(res.data));
        if (res.data.error_code === 1) {
          document.getElementById("zipfile").value = "";
          this.setState({

            corruptZipFile: true,
            modalSuccess: true,
            zipFile: null,
            noZipFile: false,
            loader:false


          });
        }
      if(res.data.success===true)
      {
        this.setState({

          corruptZipFile: false,
          modalSuccess: true,
          zipFile: null,
          noZipFile: false,
          loader:false
            });
            excel.append('file', this.state.file, this.state.filename);
            //excel.append('zipfilename', this.state.zipFilename.replace(/\.[^/.]+$/, ""));
            axios
            .post("http://localhost:8001/api/importExcel", excel)
            .then(res => {
              console.log("in Res " + JSON.stringify(res.data));
              if (res.data.error_code === 1) {
                document.getElementById("file").value = "";
                document.getElementById("zipfile").value = "";
                this.setState({

                  corruptFile: true,
                  modalSuccess: true,
                  file: null,
                  noFile: false,
                  loader:false


                });
              }
              else if(res.data==="Imported Successfully") {

                //console.log("in sucess: "+res.data);
                document.getElementById("file").value = "";
                document.getElementById("zipfile").value = "";
                return this.setState({

                  importErrors: null,
                  impSuccess: true,
                  modalSuccess: true,
                  noFile: false,
                  corruptFile: false,
                  file: null,
                  loader:false
                });
              }
              else
    {document.getElementById("file").value = "";
    document.getElementById("zipfile").value = "";

               this.setState({

                importErrors: res.data.errors,

                noFile: false,
                corruptFile: false,
                file: null,
                loader:false

              },() =>{
               console.log("errors length: "+Object.keys(this.state.importErrors).length)
              });

            }

            })


      }


      });









    }
  }



  fileChange = event => {
    const file = event.target.files[0];
if(event.target.name==="file")
    this.setState({ file: file, noFile: false, corruptFile: false, filename: file.name, importErrors:null }, () => console.log("file:  " + this.state.file.name));
else
this.setState({ zipFile: file, noZipFile: false, corruptZipFile: false, zipFilename: file.name, importErrors:null }, () => console.log("zipfile:  " + this.state.zipFile.name));

  }


  render() {
    return (
      <div style={{width:"1000px"}} >

        <Container style={{width:"3500px"}} >

          <Row lg="4" style={{width:"6000px"}}>


            <Col md="2">
              <Card className="mx-4">
                <CardBody className="p-4">
                  <Form  >
                    <h1>Import Users</h1>
                    {this.state.impSuccess &&

                      <Modal isOpen={this.state.modalSuccess} className={'modal-success ' + this.props.className} toggle={this.toggleSuccess}>
                        <ModalHeader toggle={this.toggleSuccess}>Excel sheet {this.state.filename} Imported Successfully!</ModalHeader>

                      </Modal>}



                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">
                     <div> <font color="red">  Please make sure the number of records in excel sheet matches the total number of photos in zip file. </font>
                     <br />
                      <font color="red">  Please make sure the photo name matches the username in the excel sheet.</font>
                      <br />
                      <font color="red">  Please make sure Photos.zip contains only photo(s) and no folder(s).</font>
                      <br /><br />
                      </div>

                      </InputGroupAddon>
                      <h5>Upload excel file(XLS,XLSX)</h5>
                      <Input
                        type="file"
                        name="file"
                        id="file"


                        onChange={this.fileChange}
                      />
                    </InputGroup>

                    {this.state.noFile
                      && <font color="red">  <p>Please choose the Excel file</p></font>
                    }

                    {this.state.corruptFile
                      && <font color="red">  <p>Please select a valid XLS or XLSX file only.</p></font>
                    }

 <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">

                      </InputGroupAddon>
                      <h5>Upload Photos Zip</h5>
                      <Input
                        type="file"
                        name="zipfile"
                        id="zipfile"


                        onChange={this.fileChange}
                      />
                    </InputGroup>

 {this.state.noZipFile
                      && <font color="red">  <p>Please choose the Photos Zip file</p></font>
                    }

                    {this.state.corruptZipFile
                      && <font color="red">  <p>Please select a valid Zip file only.</p></font>
                    }


                    <Row className="align-items-center">
                      <Col col="6" sm="2" md="3" xl className="mb-3 mb-xl-0">
                        <Button type="submit" block color="success" onClick={this.fileHandler}  style={{width:"200px"}}> Import sheet</Button>
                      </Col>
                    </Row>

 {this.state.loader &&<font color="Green">  <h5>Importing sheet...</h5></font>}
                    {this.state.loader &&
                     <ReactLoading type="bars"
                      color="	#006400"
    height='2%' width='100%' />
                      }

                    { this.state.importErrors &&
                    <Row className="align-items-center">
                      <Col col="6" sm="2" md="2" xl className="mb-3 mb-xl-0">
                      <font color="red">  <p>{Object.keys(this.state.importErrors).length} record(s) failed to import. For errors, click Errors</p></font>
                        <Button type="submit" block color="danger" onClick={
()=>{var data = "<p>This is 'myWindow'</p>";
var myWindow = window.open("","data:html/json," + this.state.errors,
                       "_blank");
myWindow.focus();

                        }}> Errors</Button>
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

export default ImportUser;
