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
      zipFile:null,
      noZipFile:false,
      corruptZipFile:false



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
    const data = new FormData();
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
    else {
      data.append('file', this.state.file, this.state.filename);
      axios
        .post("http://localhost:8001/api/importExcel", data)
        .then(res => {
          console.log("in Res " + JSON.stringify(res.data));
          if (res.data.error_code === 1) {
            document.getElementById("file").value = "";
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
           this.setState({

            importErrors: res.data.errors,

            noFile: false,
            corruptFile: false,
            file: null,
            loader:false

          },() =>{
           // console.log("errors length: "+Object.keys(this.state.errors).length)
          });

        }

        })
    }
  }



  fileChange = event => {
    const file = event.target.files[0];
    if(event.target.name==="file")
    this.setState({ file: file, noFile: false, corruptFile: false,
       filename: file.name, importErrors:null },
        () => console.log("file:  " + this.state.file.name));
        else
        this.setState({ zipFile: file, noZipFile: false, corruptZipFile: false,
          ZipFilename: file.name, importErrors:null },
           () => console.log("file:  " + this.state.zipFile.name));



  }


  render() {
    return (
      <div style={{width:"1000px"}} >

        <Container style={{width:"2500px"}} >

          <Row lg="4" style={{width:"2500px"}}>


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

                      </InputGroupAddon>
                      <h3>upload excel file(XLS,XLSX)</h3>
                      <Input
                        type="file"
                        name="file"
                        id="file"


                        onChange={this.fileChange}
                      />
                    </InputGroup>

                    {this.state.noFile
                      && <font color="red">  <p>Please choose the excel file before submitting.</p></font>
                    }

                    {this.state.corruptFile
                      && <font color="red">  <p>Please select a valid XLS or XLSX file only.</p></font>
                    }

                    <InputGroup className="mb-3">
                      <InputGroupAddon addonType="prepend">

                      </InputGroupAddon>
                      <h3>upload Photos Zip</h3>
                      <Input
                        type="file"
                        name="zipfile"
                        id="zipfile"


                        onChange={this.fileChange}
                      />
                    </InputGroup>
                    {this.state.noZipFile
                      && <font color="red">  <p>Please choose the Photos zip file before submitting.</p></font>
                    }

                    {this.state.corruptZipFile
                      && <font color="red">  <p>Please select a valid zip file only.</p></font>
                    }
                    
                    <Row className="align-items-center">
                      <Col col="6" sm="2" md="2" xl className="mb-3 mb-xl-0">
                        <Button type="submit" block color="success" onClick={this.fileHandler}> Import sheet</Button>
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
