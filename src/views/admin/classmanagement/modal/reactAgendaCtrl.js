/**
 * For Pop up Modal UI
 */
import React, { Component } from 'react';
import PropTypes from 'prop-types';
import moment from 'moment';
import {guid , getUnique , getLast , getFirst } from './helpers.js';
import Rdate from 'react-datetime';
import '../classmanagementcss/reactAgendaCtrl.css';
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
  InputGroupText,
  Row,
  Modal,
  ModalHeader,
  FormGroup,
  Label,
  Nav,
  NavItem,
  NavLink,
  TabContent,
  TabPane

} from "reactstrap";
import { Creatable } from "react-select";

var now = new Date();

const whiteTextFieldStyle = {
  background: "white"
}

export default class ReactAgendaCtrl extends Component {
  
  constructor() {
  
    super();
  
    this.state = {
      editMode: false,
      showCtrl: false,
      multiple: {},
      name: '', // this is actually subject name
      classes: 'priority-1',
      startDateTime: now,
      endDateTime: now,

      teacher: '',
      defaultSubjects: null,
      subjects: [],
      selectedSubject: []
    }
    this.handleDateChange = this.handleDateChange.bind(this)
    this.addEvent = this.addEvent.bind(this)
    this.updateEvent = this.updateEvent.bind(this)
    this.dispatchEvent = this.dispatchEvent.bind(this)
    this.handleSubmit = this.handleSubmit.bind(this)
    this.handleEdit = this.handleEdit.bind(this)
    this.handleSubjectChange = this.handleSubjectChange.bind(this);
    this.handleSubjectCreate = this.handleSubjectCreate.bind(this);
    this.setDefaultSubjects = this.setDefaultSubjects.bind(this);
    this.repeatScheduleEveryWeekChange = this.repeatScheduleEveryWeekChange.bind(this);
  }

  setDefaultSubjects() {

    // console.log("reactAgendaCtrl - setDefaultSubjects setDefaultSubjects - " + this.props.subjectsArray);
    var defaultSubjectsTemp = [];

    this.props.subjectsArray.forEach(function(key) {

      var subjectJSON= {};
      if (key) {
        subjectJSON.value = key;
        subjectJSON.label = key;
      }
      if(subjectJSON) {
        defaultSubjectsTemp.push(subjectJSON);
      }

    })

    this.setState({
      defaultSubjects : defaultSubjectsTemp
    }, () => {
      // console.log("ReactAgendaCtrl defaultSubjects - " + JSON.stringify(defaultSubjectsTemp));
  });
 
}

  componentDidMount() {

    // console.log("ReactAgendaCtrl - componentDidMount - this.props.selectedCells[0].name - " + this.props.selectedCells[0].name);

  if (this.props.itemColors) {

    // console.log("this.props this.props.itemColors - " + this.props.itemColors);
    this.setState({
      classes: Object.keys(this.props.itemColors)[0]
    })

  }

  if (this.props.subjectsArray && this.state.defaultSubjects === null) {

    // console.log("this.props.subjectsArray - " + this.props.subjectsArray);
    this.setDefaultSubjects();
  }

  setTimeout(function() {
    if(this.refs.eventName){
        this.refs.eventName.focus()
    }

  }.bind(this), 50);

  if (!this.props.selectedCells) {
    let start = now
    let endT = moment(now).add(15, 'Minutes');
    return this.setState({editMode: false, selectedSubject:'', name: '', teacher:'', startDateTime: start, endDateTime: endT});
  }

  if (this.props.selectedCells && this.props.selectedCells[0] && this.props.selectedCells[0]._id) {

    let start = moment(this.props.selectedCells[0].startDateTime);
    let endT = moment(this.props.selectedCells[0].endDateTime);

    return this.setState({editMode: true, 
      selectedSubject: {"value": this.props.selectedCells[0].name, "label": this.props.selectedCells[0].name} , 
    name: this.props.selectedCells[0].name, teacher: this.props.selectedCells[0].teacher, 
    classes: this.props.selectedCells[0].classes, startDateTime: start, endDateTime: endT});

  }

  if (this.props.selectedCells && this.props.selectedCells.length === 1) {
    let start = moment(getFirst(this.props.selectedCells));
    let endT = moment(getLast(this.props.selectedCells)).add(15, 'Minutes');
    return this.setState({editMode: false, selectedSubject: '', name: '', teacher:'', startDateTime: start, endDateTime: endT});
  }

  if (this.props.selectedCells && this.props.selectedCells.length > 0) {
    let start = moment(getFirst(this.props.selectedCells));
    let endT = moment(getLast(this.props.selectedCells)) || now;
    this.setState({editMode: false, selectedSubject: '', name: '', teacher:'', startDateTime: start, endDateTime: endT});
  }

}

  handleChange(event) {

    // console.log("handleChange");
    if(event.target.tagName === 'BUTTON'){
      event.preventDefault();
    }

    var data = this.state;
    if("name" === event.target.name) {
    data[event.target.name] = event.target.value.value;
    } else {
      data[event.target.name] = event.target.value;
    }

    // console.log("handleChange - " + event.target.name + " " + event.target.value.value);

    this.setState(data);
  }

  handleDateChange(ev, date) {
    var endD = moment(this.state.endDateTime)
  var data = this.state;
  data[ev] = date;

  if(ev === 'startDateTime' && endD.diff(date)< 0 ){
    data['endDateTime'] = moment(date).add(15 , 'minutes');
  }

  this.setState(data);

  }


dispatchEvent(obj) {
  var newAdded = []
  var items = this.props.items;
  if (obj['multiple']) {
    var array = obj['multiple']
    Object.keys(array).forEach(function(key) {
      var newAr = array[key].filter(function(val, ind) {
        return array[key].indexOf(val) == ind;
      })
      var start = newAr[0];
      var endT = newAr[newAr.length - 1] || now;
      var lasobj = {
        _id: guid(),
        name: obj.name,
        teacher: obj.teacher,
        startDateTime: new Date(start),
        endDateTime: new Date(endT),
        classes: obj.classes
      }
      items.push(lasobj)
      newAdded.push(lasobj)
    }.bind(this));
    return this.props.Addnew(items, newAdded)
  }

  obj._id = guid();
  items.push(obj)
  this.props.Addnew(items, obj)
}

addEvent(e) {

  // console.log("ReactAgendaCtrl.js - addEvent");

  if (this.state.name.length < 1 || this.state.teacher.length < 1) {
    return;
  }

  if(this.props.selectedCells && this.props.selectedCells.length > 0){

    var obj = this.props.selectedCells.reduce((r, v, i, a, k = v.substring(0, 10)) => ((r[k] = r[k] || []).push(v), r), {});

    if (Object.values(obj).length > 1) {
      var newObj = {
        name: this.state.name,
        teacher: this.state.teacher,
        startDateTime: new Date(this.state.startDateTime),
        endDateTime: new Date(this.state.endDateTime),
        classes: this.state.classes,
        repeatScheduleEveryWeek: this.state.repeatScheduleEveryWeek,
        multiple: obj
      }

      return this.dispatchEvent(newObj);

    }

  }

  var newObj = {
    name: this.state.name,
    teacher: this.state.teacher,
    startDateTime: new Date(this.state.startDateTime),
    endDateTime: new Date(this.state.endDateTime),
    classes: this.state.classes,
    repeatScheduleEveryWeek: this.state.repeatScheduleEveryWeek,

  }

  this.dispatchEvent(newObj);
}

updateEvent(e) {

  // console.log("reactAgendaCtrl - updateEvent");
  
  if (this.props.selectedCells[0]._id && this.props.items) {

    var newObj = {
      _id: this.props.selectedCells[0]._id,
      name: this.state.name,
      teacher: this.state.teacher,
      startDateTime: new Date(this.state.startDateTime),
      endDateTime: new Date(this.state.endDateTime),
      classes: this.state.classes,
      repeatScheduleEveryWeek: this.state.repeatScheduleEveryWeek,

    }
    var items = this.props.items
    for (var i = 0; i < items.length; i++) {
      if (items[i]._id === newObj._id)
        items[i] = newObj;
      }
    if (this.props.edit) {
      this.props.edit(items, newObj);
    }

  }

}


handleSubmit(e) {
  e.preventDefault();
  this.addEvent(e);
}

handleEdit(e) {
  e.preventDefault();
  this.updateEvent(e);
}

repeatScheduleEveryWeekChange(e) {

  if (e.target.checked === true) {
    this.setState({
      repeatScheduleEveryWeek: true
    });
  } else if (e.target.checked === false) {
    this.setState({
      repeatScheduleEveryWeek: false
    });
  }
}

handleSubjectChange = (newValue, actionMeta) => {
  
  // console.log("reactAgendaCtrl - selected value - " + JSON.stringify(newValue) + " action - " + actionMeta.action);
  
  this.setState({ name: newValue.value,
    selectedSubject: newValue
   }, () => {
    // console.log(`state name : ${JSON.stringify(this.state.name)}`)
  });
  // console.groupEnd();
};

handleSubjectCreate = (createdSubject) => {

  alert("This newly created subject will not be saved in the database."
  + "\nThis feature is for periods like Lunch, Assembly, etc."
  + "\nTo add subject permanently, please use UpdateClass module.");

  var subjectsTemp = [];

  // We do not assume how users would like to add newly created options to the existing options list.
  // Instead we pass users through the new value in the onCreate prop
  this.setState({ isLoading: true });
  this.setState({ subjects: this.state.defaultSubjects });

  // console.log('Wait a moment... input value -  ' + createdSubject);
  // console.log("Initial Available subjects - " + JSON.stringify(this.state.subjects));

  var createdOption = { "label": createdSubject, "value": createdSubject };

  subjectsTemp = this.state.defaultSubjects;
  subjectsTemp.push(createdOption);
  this.setState({
    subjects: subjectsTemp,
  }, () => {
    // console.log("Available subjects - " + JSON.stringify(this.state.subjects));
  });

  // console.log("check check name - " + JSON.stringify(this.state.name));
  this.setState({
    name: createdOption.value,
    selectedSubject: createdOption
  }, () => {
    // console.log("Selected Subject - " + JSON.stringify(this.state.name.value));
  });

};



render() {
  var itc = Object.keys(this.props.itemColors)
  var colors = itc.map(function(item, idx) {

    return <div style={{
      background: this.props.itemColors[item]
    }} className="agendCtrls-radio-buttons" key={item}>
      <button name="classes"  value={item} className={this.state.classes === item?'agendCtrls-radio-button--checked':'agendCtrls-radio-button'} onClick={this.handleChange.bind(this)}/>
    </div>
  }.bind(this))

  const divStyle = {};

  if (this.state.editMode) {

    var select = this.props.selectedCells[0];

    return (
      <div className="agendCtrls-wrapper" style={divStyle}>
        <form onSubmit={this.handleEdit}>

        <div className="agendCtrls-label-wrapper">
            <div className="agendCtrls-label-inline">
              <label>Teacher</label>
              <input type="text" name="teacher" autoFocus ref="teacher" className="agendCtrls-event-input" 
              value={this.state.teacher} onChange={this.handleChange.bind(this)} placeholder="Teacher Name"/>
            </div>
          </div>

          <div className="agendCtrls-label-wrapper">
            <div className="agendCtrls-label-inline">
              <label>Subject name edit</label>
              {/* <input type="text" name="name" autoFocus ref="eventName" className="agendCtrls-event-input" 
              value={this.state.name} onChange={this.handleChange.bind(this)} placeholder="Event Name"/> */}
              
              <Creatable
                simpleValue
                name="name"
                value={this.state.selectedSubject}
                onChange={this.handleSubjectChange}
                isMulti={false}
                isOpen={false}
                closeMenuOnSelect={true}
                autosize
                onCreateOption={this.handleSubjectCreate}
                options={this.state.defaultSubjects}
              />

              {this.state.dbErrors && this.state.dbErrors.subjects && (
                <font color="red">
                  <h6>
                    {" "}
                    <p>{this.state.dbErrors.subjects.msg}</p>
                  </h6>{" "}
                </font>
              )}
            </div>
            <div className="agendCtrls-label-inline ">
              <label>Color</label>
              <div className="agendCtrls-radio-wrapper">
                {colors}</div>
            </div>
          </div>
          
          <div className="agendCtrls-timePicker-wrapper">
            <div className="agendCtrls-time-picker">
              <label >Start Date</label>
              <Rdate value={this.state.startDateTime} onChange={this.handleDateChange.bind(null, 'startDateTime')} input={false} viewMode="time" ></Rdate>
            </div>
            <div className="agendCtrls-time-picker">
              <label >End Date</label>
              <Rdate value={this.state.endDateTime} onChange={this.handleDateChange.bind(null, 'endDateTime')} input={false} viewMode="time" ></Rdate>
              </div>
              </div>

            <Input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="repeatScheduleEveryWeek"
                                                // style={{ height: "35px", width: "25px" }}
                                                name="repeatScheduleEveryWeek"
                                                checked={this.state.repeatScheduleEveryWeek}
                                                onChange={this.repeatScheduleEveryWeekChange}
                                                // style={whiteTextFieldStyle}
                                              />
                                              <Label
                                                className="form-check-label"
                                                check
                                                htmlFor="inline-checkbox1"
                                              >
                                                Repeat appointment
                                    </Label>
          
<br /> <br />
          <input type="submit" value="Save"/>
        </form>
      </div>
    );

  }

  return (
    <div className="agendCtrls-wrapper" style={divStyle}>
      <form onSubmit={this.handleSubmit}>
        
        <div className="agendCtrls-label-wrapper">
            <div className="agendCtrls-label-inline">
              <label>Teacher</label>
              <input type="text" name="teacher" autoFocus ref="teacher" className="agendCtrls-event-input" 
              value={this.state.teacher} onChange={this.handleChange.bind(this)} placeholder="Teacher Name"/>
            </div>
          </div>
          <div className="agendCtrls-label-wrapper">
          <div className="agendCtrls-label-inline">
            <label>Subject name non edit</label>
            {/* <input type="text" ref="eventName" autoFocus name="name" className="agendCtrls-event-input" 
            value={this.state.name} onChange={this.handleChange.bind(this)} placeholder="Event Name"/> */}

<Creatable
                simpleValue
                name="name"
                value={this.state.selectedSubject}
                onChange={this.handleSubjectChange}
                isMulti={false}
                isOpen={false}
                closeMenuOnSelect={true}
                autosize
                onCreateOption={this.handleSubjectCreate}
                options={this.state.defaultSubjects}
              />
          </div>
          <div className="agendCtrls-label-inline">
            <label>Color</label>
            <div className="agendCtrls-radio-wrapper">
              {colors}</div>
          </div>
        </div>
        <div className="agendCtrls-timePicker-wrapper">
          <div className="agendCtrls-time-picker">
            <label >Start Date</label>
            <Rdate value={this.state.startDateTime} onChange={this.handleDateChange.bind(null, 'startDateTime')} input={false} viewMode="time" ></Rdate>
          </div>
          <div className="agendCtrls-time-picker">
            <label >End Date</label>
            <Rdate value={this.state.endDateTime} onChange={this.handleDateChange.bind(null, 'endDateTime')} input={false} viewMode="time" ></Rdate>
          </div>
        </div>

        <Input
                                                className="form-check-input"
                                                type="checkbox"
                                                id="repeatScheduleEveryWeek"
                                                // style={{ height: "35px", width: "25px" }}
                                                name="repeatScheduleEveryWeek"
                                                checked={this.state.repeatScheduleEveryWeek}
                                                onChange={this.repeatScheduleEveryWeekChange}
                                                // style={whiteTextFieldStyle}
                                              />
                                              <Label
                                                className="form-check-label"
                                                check
                                                htmlFor="inline-checkbox1"
                                              >
                                                Repeat appointment
                                    </Label>

                                    <br />
                                    <br />
        <input type="submit" value="Save"/>
      </form>
    </div>
  );
}
}


ReactAgendaCtrl.propTypes = {
  items: PropTypes.array,
  itemColors: PropTypes.object,
  selectedCells: PropTypes.array,
  edit: PropTypes.func,
  Addnew: PropTypes.func

};

ReactAgendaCtrl.defaultProps = {
  items: [],
  itemColors: {},
  selectedCells: []
  }
