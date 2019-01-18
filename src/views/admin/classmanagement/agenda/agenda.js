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
  Table
} from "reactstrap";
import ReactAgenda from '../modal/reactAgenda.js';
import ReactAgendaCtrl from '../modal/reactAgendaCtrl.js';
import Modal from '../modal/Modal.js'


var now = new Date();

require('moment/locale/en-gb.js');
var colors = {
  'color-1': "rgba(102, 195, 131 , 1)",
  "color-2": "rgba(242, 177, 52, 1)",
  "color-3": "rgba(235, 85, 59, 1)",
  "color-4": "rgba(70, 159, 213, 1)",
  "color-5": "rgba(170, 59, 123, 1)"
}

/*
these parameters go to reactAgendaItem.js and 
then are fetched in reactAgendaItem using {this.props.item.name} 
*/
var items = [
  {
    _id: guid(),
    name: 'English',
    teacher: 'Aman',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
    classes: 'color-1 color-4'
  },
  {
    _id: guid(),
    name: 'Hindi',
    teacher: 'Ravi',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
    classes: 'color-2'
  },
  {
    _id: guid(),
    name: 'Maths',
    teacher: 'Prashant',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 30),
    classes: 'color-4'
  },
  {
    _id: 'event-4',
    name: 'Science',
    teacher: 'Surbhi',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 0),
    classes: 'color-3'

  },
  {
    _id: 'event-5',
    name: 'Social',
    teacher: 'Tina',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 16, 30),
    classes: 'color-4'
  },
  {
    _id: 'event-6',
    name: 'Sanskrit',
    teacher: 'Deepak',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 9, 14),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7, 17),
    classes: 'color-3'
  }
];

export default class Agenda extends Component {
  
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
      // startDate: new Date()
      startDate: this.getCurrentWeek(),
      subjectsArray: this.props.subjects
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

    // Get first day of the current week.
    this.getCurrentWeek();

    // this.setState
    console.log("Agenda.js - subjects - " + this.state.subjectsArray);

  }

  getCurrentWeek() {

    var curr = new Date;
    var firstday = curr.getDate() - curr.getDay() + 1;
    var currentWeekStartDate = new Date(curr.setDate(firstday));
    return currentWeekStartDate;
  }

  componentDidMount() {

    this.setState({ items: items })


  }


  componentWillReceiveProps(next, last) {
    if (next.items) {

      this.setState({ items: next.items })
    }
  }
  handleItemEdit(item, openModal) {

    console.log("handleItemEdit");
    if (item && openModal === true) {

      this.setState({ selected: [item] })
      console.log("handleItemEdit - item" + JSON.stringify([item]));

      return this._openModal();
    }



  }
  handleCellSelection(item, openModal) {

    console.log("handleCellSelection");
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

    console.log("Agenda.js - handleDateRangeChange startDate - " + startDate + " enddate - " + endDate
      + " this.state.startDate" + this.state.startDate);

    if (startDate > this.state.startDate) {

      console.log("date is after");
      console.log("today - " + moment(this.state.startDate) + " next - " + moment().day(1 + 7));

      this.setState({ startDate: moment(this.state.startDate).day(1 + 7) })

    } else if (startDate < this.state.startDate) {

      console.log("date is before");
      console.log("today - " + moment(this.state.startDate) + " next - " + moment().day(-6 + 7));

      this.setState({ startDate: moment(this.state.startDate).day(1 - 7) })

    }

  }

  handleRangeSelection(selected) {

    console.log("handleRangeSelection ");
    // this.setState({ startDate: startDate })
    this.setState({ selected: selected, showCtrl: true })
    console.log("handleRangeSelection selected - " + selected);
    this._openModal();

  }

  _openModal() {
    this.setState({ showModal: true })
  }
  _closeModal(e) {

    console.log("_closeModal _closeModal _closeModal");
    if (e) {
      e.stopPropagation();
      e.preventDefault();
    }
    this.setState({ showModal: false })
  }

  handleItemChange(items, item) {

    console.log("handleItemChange");
    this.setState({ items: items })
  }

  handleItemSize(items, item) {

    console.log("handleItemSize");
    this.setState({ items: items })

  }

  removeEvent(items, item) {

    console.log("removeEvent");
    this.setState({ items: items });
  }

  addNewEvent(items, newItems) {

    console.log("Agenda.js - addNewEvent - " + " newItems - " + JSON.stringify(newItems) + " \nitems - " + items + " \nthis.state.items - " 
    + JSON.stringify(this.state.items) 
    + " \nthis.state.items - " + JSON.stringify(this.state.items));
    
    this.setState({ showModal: false, selected: [], items: items });
    this._closeModal();
  }
  editEvent(items, item) {

    console.log("editEvent");
    this.setState({ showModal: false, selected: [], items: items });
    this._closeModal();
  }

  changeView(days, event) {
    this.setState({ numberOfDays: days })
  }


  render() {

    var AgendaItem = function (props) {
      console.log(' item component props', props)
      return <div style={{ display: 'block', position: 'absolute', background: '#FFF' }}>{props.item.name} <button onClick={() => props.edit(props.item)}>Edit </button></div>
    }
    return (

      <div>
        <Container >



          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Classes <small className="text-muted">Select a Class</small>
            </CardHeader>
            <CardBody>

              <div className="content-expanded ">

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
                  this.state.showModal ? <Modal clickOutside={this._closeModal} >
                    <div className="modal-nude ">
                    {/* For pop up Modal */}
                      <ReactAgendaCtrl items={this.state.items} itemColors={colors} 
                      selectedCells={this.state.selected} Addnew={this.addNewEvent} 
                      edit={this.editEvent} subjectsArray={this.props.subjects}/>

                    </div>
                  </Modal> : ''
                }


              </div>
            </CardBody>
          </Card>
        </Container>
      </div>

    );
  }
}
