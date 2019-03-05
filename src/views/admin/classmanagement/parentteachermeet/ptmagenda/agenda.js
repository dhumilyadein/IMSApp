// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { guid, getUnique, getLast, getFirst } from 'react-agenda';
import {
  Button,
  ButtonDropdown,
  ButtonGroup,
  ButtonToolbar,
  Card,
  CardBody,
  CardHeader,
  Col,
  Container,
  DropdownItem,
  DropdownMenu,
  DropdownToggle,
  Input,
  InputGroup,
  InputGroupAddon,
  InputGroupText,
  Row,
  Table,
  Modal,
  ModalHeader
} from "reactstrap";

import ReactAgenda from '../ptmmodal/reactAgenda.js';
import ReactAgendaCtrl from '../ptmmodal/reactAgendaCtrl.js';
import Modal1 from '../ptmmodal/Modal.js';
import axios from "axios";

var now = new Date();

require('moment/locale/en-gb.js');
var colors = {
  'color-1': "rgba(102, 195, 131 , 1)",
  "color-2": "rgba(242, 177, 52, 1)",
  "color-3": "rgba(235, 85, 59, 1)",
  "color-4": "rgba(70, 159, 213, 1)",
  "color-5": "rgba(170, 59, 123, 1)"
}

class Agenda extends Component {

  constructor(props) {

    super(props);

    this.state = {
      items: [],
      selected: [],
      cellHeight: 30,
      showModal: false,
      locale: "en-gb",
      rowsPerHour: 4,
      numberOfDays: 6,
      startHour: 9,
      endHour: 15,
      // startDate: new Date()
      startDate: this.getCurrentWeek(),
      subjectsArray: this.props.subjects,
      selectedClass: this.props.selectedClass,
      selectedSection: this.props.selectedSection,
      // timeTable: this.props.timeTable,
      pTMeetSchedule: this.props.pTMeetSchedule,
      emailArray: this.props.emailArray,
      teachersDetailsArray: this.props.teachersDetailsArray,
      sectionArray: this.props.sectionArray,

      classDetailsUpdatedFlag: false,
      removeScheduleFlag: false,
      showModalFlag: false,
      modalMessage: '',
      modalColor: ''
    }
    this.handleRangeSelection = this.handleRangeSelection.bind(this)
    this.handleItemEdit = this.handleItemEdit.bind(this)
    this.zoomIn = this.zoomIn.bind(this)
    this.zoomOut = this.zoomOut.bind(this)
    this._openModal = this._openModal.bind(this)
    this._closeModal = this._closeModal.bind(this)
    this.addNewEvent = this.addNewEvent.bind(this)
    this.removeEvent = this.removeEvent.bind(this)
    this.editEvent = this.editEvent.bind(this)
    this.changeView = this.changeView.bind(this)
    this.handleCellSelection = this.handleCellSelection.bind(this)
    this.getCurrentWeek = this.getCurrentWeek.bind(this);
    this.updateClassDetails = this.updateClassDetails.bind(this);
    this.hourChangehandler = this.hourChangehandler.bind(this);
    this.removeSchedule = this.removeSchedule.bind(this);
    // this.copypTMeetScheduleToAllSections = this.copypTMeetScheduleToAllSections.bind(this);
    this.toggleModalSuccess = this.toggleModalSuccess.bind(this);
    this.sendMailToClass = this.sendMailToClass.bind(this);

    // Get first day of the current week.
    this.getCurrentWeek();

    // this.setState

  }

  getCurrentWeek() {

    var curr = new Date;
    var firstday = curr.getDate() - curr.getDay() + 1;
    var currentWeekStartDate = new Date(curr.setDate(firstday));
    return currentWeekStartDate;
  }

  toggleModalSuccess() {

    console.log("agenda - toggleModalSuccess this.state.showModalFlag - " + this.state.showModalFlag);
    // this.setState({
    //   showModalFlag: !this.state.showModalFlag
    // });
    //window.location.reload();

  }

  /*
these parameters go to reactAgendaItem.js and 
then are fetched in reactAgendaItem using {this.props.item.name} 
*/
  componentDidMount() {

    // this.setState({ items: items })
    this.setState({ items: this.state.pTMeetSchedule }, () => {
    
      console.log("Agenda.js - teachersDetailsArray - " + JSON.stringify(this.state.teachersDetailsArray)
      + "\npTMeetSchedule - " + JSON.stringify(this.state.pTMeetSchedule)
      + "\nthis.props.pTMeetSchedule - " + JSON.stringify(this.props.pTMeetSchedule));
    })

  }


  componentWillReceiveProps(next, last) {
    if (next.items) {

      this.setState({ items: next.items })
    }
  }
  handleItemEdit(item, openModal) {

    if (item && openModal === true) {

      this.setState({ selected: [item] })
      // console.log("Agenda.js - handleItemEdit - item - " + JSON.stringify(item));

      return this._openModal();
    }



  }
  handleCellSelection(item, openModal) {

    // console.log("Agenda.js - handleCellSelection");
    if (this.state.selected && this.state.selected[0] === item) {
      return this._openModal();
    }
    this.setState({ selected: [item] })

  }

  zoomIn() {
    var num = this.state.cellHeight + 15
    this.setState({ cellHeight: num })
  }
  zoomOut() {
    var num = this.state.cellHeight - 15
    this.setState({ cellHeight: num })
  }


  handleDateRangeChange(startDate, endDate) {

    // console.log("Agenda.js - handleDateRangeChange startDate - " + startDate + " enddate - " + endDate
    //   + " this.state.startDate" + this.state.startDate);

    /*
    Changing date range to next monday by adding 5 days
    */
    if (startDate > this.state.startDate) {

      this.setState({ startDate: moment(this.state.startDate).day(1 + 7) })

    } else if (startDate < this.state.startDate) {

      this.setState({ startDate: moment(this.state.startDate).day(1 - 7) })

    }

  }

  handleRangeSelection(selected) {

    // this.setState({ startDate: startDate })

    this.setState({ selected: selected, showCtrl: true })
    // console.log("agenda - handleRangeSelection selected - " + selected);
    this._openModal();

  }

  _openModal() {
    this.setState({ showModal: true })
  }
  _closeModal(e) {

    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({ showModal: false })
  }

  handleItemChange(items, item) {

    // console.log("agenda - handleItemChange");
    this.setState({ items: items })
  }

  handleItemSize(items, item) {

    // console.log("agenda - handleItemSize");
    this.setState({ items: items })

  }

  removeEvent(items, item) {

    // console.log("agenda - removeEvent - item - " + JSON.stringify(item) + " \nitems - " + JSON.stringify(items));
    this.setState({ items: items });

    this.removeSchedule(item);
  }

  addNewEvent(items, newItems) {

    console.log("Agenda.js - addNewEvent - " + " newItems - " + JSON.stringify(newItems) + " \nitems - " + items + " \nthis.state.items - " 
    + JSON.stringify(this.state.items) 
    + " \nthis.state.items - " + JSON.stringify(this.state.items));

    this.setState({ showModal: false, selected: [], items: items });
    this._closeModal();

    this.updateClassDetails(this.state.selectedClass, this.state.selectedSection, newItems);
  }
  editEvent(items, item) {

    // console.log("agenda - editEvent - " + JSON.stringify(item));
    this.setState({ showModal: false, selected: [], items: items });
    this._closeModal();

    this.updateClassDetails(this.state.selectedClass, this.state.selectedSection, item);
  }

  changeView(days, event) {
    this.setState({ numberOfDays: days })
  }

  async updateClassDetails(classStr, sectionStr, item) {

    var updateClassDetailsRequest = {
      "class": classStr,
      "section": sectionStr,
      "pTMeetSchedule": this.state.items
    }

    console.log("Agenda - updateClassDetails - updateClassDetailsRequest - "
      + JSON.stringify(updateClassDetailsRequest));

    await axios.post("http://localhost:8001/api/updateClassDetails", updateClassDetailsRequest).then(res => {

      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      } else {

        this.sendMailToClass(item);

        this.setState({
          classDetailsUpdatedFlag: true
        });
      }
    });
  }

  async removeSchedule(item) {

    var removeScheduleRequest = {
      "class": this.state.selectedClass,
      "section": this.state.selectedSection,
      "pTMeetSchedule": item
    }

    // console.log("Agenda - removeSchedule - removeScheduleRequest - "
    //   + JSON.stringify(removeScheduleRequest));

    await axios.post("http://localhost:8001/api/removeSchedule", removeScheduleRequest).then(res => {

      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      } else {

        this.setState({
          removeScheduleFlag: true
        });
      }
    });
  }

  hourChangehandler(e) {

    // console.log("agenda - hourChangehandler - e.target.name - " + [e.currentTarget.name] + " e.target.value - " + e.currentTarget.value);
    this.setState({ [e.currentTarget.name]: e.currentTarget.value });
  }

  sendMailToClass(item) {

    var startDateMoment = moment(new Date(item.startDateTime));
    var endDateMoment = moment(new Date(item.endDateTime));

    var subject = "Parent Teacher Meet on " + startDateMoment.date() + "-" + startDateMoment.month() + 1
    + "-" + startDateMoment.year() + " (" + startDateMoment.format("hh:mm a") + " - " + endDateMoment.format("hh:mm a") + ")";

    var mailBody = "Hi Sir/Madam, \nGreetings!\nThis mail is to inform you that Parent Tearcher Meet is scheduled for "
    + startDateMoment.date() + "-" + startDateMoment.month() + 1 + "-" + startDateMoment.year() + " between " 
    + startDateMoment.format("hh:mm a") + " and " + endDateMoment.format("hh:mm a") 
    + ".\n\nAgenda - " + item.name 
    + "\nTeacher - " + item.teacher
    + "\n\nRegards,\nSchool Staff";

    console.log("PTM Agenda - sendMailToClass - to - " + this.state.emailArray 
    + " \nsubject - " + subject + " \nmailBody - " + mailBody);

    var sendMailRequest = {
      "to": this.state.emailArray,
      "subject": subject,
      "text": mailBody
      // ,"html": this.state.mailHtml
    }

    console.log("SendMail - sendMailToClass - sendMailRequest " 
    + JSON.stringify(sendMailRequest));
    
    axios.post("http://localhost:8001/api/sendmail", sendMailRequest).then(seRes => {

      if (seRes.data.errors) {

        this.setState({
          loader: false,
          modalSuccess: false
        });

        console.log("SendMail - sendMailToClass - ERROR in send mail - " + seRes.data.Errors);
        return this.setState({ errors: seRes.data.Errors });

      } else {

        this.setState({
          loader: false,
          modalSuccess: false
        });
        // document.getElementById('sendMailRoot').style.display = 'block';
        console.log("SendMail - sendMailToClass - send email response - " + seRes.data.response.response);
      }
    });
  }

  // async copypTMeetScheduleToAllSections() {

  //   await console.log("Agenda - copypTMeetScheduleToAllSections - this.state.sectionArray - " + this.state.sectionArray);

  //   if(this.state.sectionArray) {

  //     this.state.sectionArray.forEach(section => {

  //       if (section !== this.state.selectedSection) {
  //         console.log("Agenda - copypTMeetScheduleToAllSections - section - " + section);

  //         this.updateClassDetails(this.state.selectedClass, section);
  //       }
  //     });

  //     alert("Refreshing the page to reflect the pTMeetSchedule changes in UI");

  //     // var msg = "pTMeetSchedule copied to all sections of Class ' " + this.state.selectedClass + " '";
  //     // this.setState({
  //     //   showModalFlag: true,
  //     //   modalColor: "modal-success",
  //     //   modalMessage: msg
  //     // });
  //     window.location.reload();
  //   }
  // }

  render() {

    var AgendaItem = function (props) {
      // console.log(' item component props', props)
      return <div style={{ display: 'block', position: 'absolute', background: '#FFF' }}>{props.item.name} <button onClick={() => props.edit(props.item)}>Edit </button></div>
    }
    return (

      <div>

      {/* {this.state.showModalFlag && (
        <Modal
          isOpen={this.state.showModalFlag}
          className={this.state.modalColor}
          toggle={this.toggleModalSuccess}
        >
          <ModalHeader
            toggle={this.toggleModalSuccess}
          >
            {this.state.modalMessage}
          </ModalHeader>
        </Modal>
      )} */}

        <Container >

          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Classes <small className="text-muted">Select a Class</small>
            </CardHeader>
            <CardBody>

              <div >

                <div className="control-buttons">
                  <InputGroupText>
                    Start Hour
                                </InputGroupText>
                  <Input
                    name="startHour"
                    id="startHour"
                    type="text"
                    value={this.state.startHour}
                    onChange={this.hourChangehandler}
                  />
                  <InputGroupText>
                    End Hour
                                </InputGroupText>
                  <Input
                    name="endHour"
                    id="endHour"
                    type="text"
                    value={this.state.endHour}
                    onChange={this.hourChangehandler}
                  />
                </div>

                <div className="control-buttons">
                  <button className="button-control" onClick={this.zoomIn}> <i className="zoom-plus-icon"></i> </button>
                  <button className="button-control" onClick={this.zoomOut}> <i className="zoom-minus-icon"></i> </button>
                  <button className="button-control" onClick={this._openModal}> <i className="schedule-icon"></i> </button>
                  <button className="button-control" onClick={this.changeView.bind(null, 7)}> {moment.duration(7, "days").humanize()}  </button>
                  <button className="button-control" onClick={this.changeView.bind(null, 6)}> {moment.duration(6, "days").humanize()}  </button>
                  <button className="button-control" onClick={this.changeView.bind(null, 5)}> {moment.duration(5, "days").humanize()}  </button>
                  <button className="button-control" onClick={this.changeView.bind(null, 1)}> {moment.duration(1, "day").humanize()} </button>
                </div>

                <ReactAgenda
                  minDate={new Date(now.getFullYear() - 1, now.getMonth() - 3)}
                  maxDate={new Date(now.getFullYear() + 1, now.getMonth() + 3)}
                  // minDate={new Date(now.getFullYear() - 1, now.getFullYear() + 1)}
                  // maxDate={new Date(now.getFullYear() - 1, now.getFullYear() + 1)}
                  startDate={this.state.startDate}
                  startAtTime={0}
                  startHour={this.state.startHour} //Time table start time
                  endHour={this.state.endHour}     //Time table end time
                  cellHeight={this.state.cellHeight}
                  locale="en-gb"
                  items={this.state.items}
                  numberOfDays={this.state.numberOfDays}
                  headFormat={"ddd DD MMM YY"}
                  rowsPerHour={this.state.rowsPerHour}
                  itemColors={colors}
                  //itemComponent={AgendaItem}
                  view="calendar"
                  autoScale={false}
                  fixedHeader={true}
                  onRangeSelection={this.handleRangeSelection.bind(this)}
                  onChangeEvent={this.handleItemChange.bind(this)}
                  onChangeDuration={this.handleItemSize.bind(this)}
                  onItemEdit={this.handleItemEdit.bind(this)}
                  onCellSelect={this.handleCellSelection.bind(this)}
                  onItemRemove={this.removeEvent.bind(this)}
                  onDateRangeChange={this.handleDateRangeChange.bind(this)} />
                {
                  this.state.showModal ? <Modal1 clickOutside={this._closeModal} >
                    <div className="modal-nude ">
                      {/* For pop up Modal */}
                      <ReactAgendaCtrl items={this.state.items} itemColors={colors}
                        selectedCells={this.state.selected} Addnew={this.addNewEvent}
                        edit={this.editEvent} subjectsArray={this.props.subjects}
                        teachersDetailsArray= {this.state.teachersDetailsArray} />

                    </div>
                  </Modal1> : ''
                }

<br/>
{/* <Row>
<Col className="col-md-3"></Col>
  <Col className="col-md-6">
<Button color="success" block onClick={this.copypTMeetScheduleToAllSections}>
                      Set same Parent Teacher Meet for all sections of Class ' {this.state.selectedClass} '
                    </Button>
                    </Col>
        <Col className="col-md-3"></Col>
        </Row> */}

              </div>
            </CardBody>
          </Card>
        </Container>
      </div>

    );
  }
}

export default Agenda;