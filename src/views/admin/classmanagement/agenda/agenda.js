// @flow
import React, { Component } from 'react';
import moment from 'moment';
import { ReactAgenda, guid, getUnique, getLast, getFirst } from 'react-agenda';
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


var items = [
  {
    _id: guid(),
    name: 'Meeting , dev staff!',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 10, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate(), 12, 0),
    classes: 'color-1 color-4'
  },
  {
    _id: guid(),
    name: 'Working lunch , Holly',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 13, 0),
    classes: 'color-2'
  },
  {
    _id: guid(),
    name: 'Conference , plaza',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 11, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 1, 14, 30),
    classes: 'color-4'
  },
  {
    _id: 'event-4',
    name: 'Customers issues review',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 10, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 2, 15, 0),
    classes: 'color-3'

  },
  {
    _id: 'event-5',
    name: 'Group activity',
    startDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 10, 0),
    endDateTime: new Date(now.getFullYear(), now.getMonth(), now.getDate() + 3, 16, 30),
    classes: 'color-4'
  },
  {
    _id: 'event-6',
    name: 'Fun Day !',
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
      startDate: this.getCurrentWeek()
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

  }

  getCurrentWeek() {

    var curr = new Date;
    var firstday = curr.getDate() - curr.getDay() + 1;
    console.log("curr.getDate() - " + curr.getDate() + " curr.getDay - " + curr.getDay());
    var currentWeekStartDate = new Date(curr.setDate(firstday));
    console.log("current date - " + new Date() + " currentWeekStartDate - " + currentWeekStartDate);
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

    if (item && openModal === true) {
      this.setState({ selected: [item] })
      return this._openModal();
    }



  }
  handleCellSelection(item, openModal) {

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

    console.log("handleDateRangeChange startDate - " + startDate + " enddate - " + endDate
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

    this.setState({ items: items })
  }

  handleItemSize(items, item) {

    this.setState({ items: items })

  }

  removeEvent(items, item) {

    this.setState({ items: items });
  }

  addNewEvent(items, newItems) {

    this.setState({ showModal: false, selected: [], items: items });
    this._closeModal();
  }
  editEvent(items, item) {

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
                  startAtTime={10}
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
                      <ReactAgendaCtrl items={this.state.items} itemColors={colors} selectedCells={this.state.selected} Addnew={this.addNewEvent} edit={this.editEvent} />

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
