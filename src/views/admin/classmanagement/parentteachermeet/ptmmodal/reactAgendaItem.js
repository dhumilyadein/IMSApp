/**
 * For showing appointment
 */
import moment from 'moment'
import PropTypes from 'prop-types';
import React, {Component} from 'react';
import {getLast, getFirst} from './helpers.js';
import '../ptmclassmanagementcss/reactAgendaItem.css';
import axios from "axios";

const blueColor = {
  'color': 'blue',
  // 'font-size': '14px'
}
export default class ReactAgendaItem extends Component {
  constructor(props) {
    super(props);
    this.state = {

      teacher: '',
      teachersDetailsArray: [],
      wrapper:{
        width: '150px',
        marginLeft: '0px',
        zIndex: 5,
        borderLeft: null

      },
      controls:{

      }


    };
    this.updateDimensions = this.updateDimensions.bind(this)
    this.raiseZindex = this.raiseZindex.bind(this)
    this.lowerZindex = this.lowerZindex.bind(this)
    this.fetchAllTeachersSpecificDetails = this.fetchAllTeachersSpecificDetails.bind(this);

    this.fetchAllTeachersSpecificDetails();
  }

  fetchAllTeachersSpecificDetails() {

    var fetchAllTeachersSpecificDetailsRequest = {
      "username":"1",
      "firstname":"1",
      "lastname":"1",
    }

    axios.post("http://localhost:8001/api/fetchAllTeachersSpecificDetails", fetchAllTeachersSpecificDetailsRequest).then(res => {
      
            if (res.data.errors) {
      
              console.log('ReactAgendaItem - fetchAllTeachersSpecificDetails - ERROR - ' + JSON.stringify(res.data.errors));
              return this.setState({ errors: res.data.errors });
            } else {
      
              this.setState({ 
                teachersDetailsArray: res.data,
              }, () => {

                console.log("ReactAgendaItem - fetchClassSpecificDetails - teachersDetailsArray - " 
                + JSON.stringify(this.state.teachersDetailsArray));

                var teacher = this.props.item.teacher;
                this.state.teachersDetailsArray.forEach(function(element) {

                  if (element.username === teacher) {

                   teacher = element.firstname.charAt(0).toUpperCase() + element.firstname.slice(1) 
                   + " " + element.lastname.charAt(0).toUpperCase() + element.lastname.slice(1);

                   return
                  }
                });

                this.setState({ 
                  teacher: teacher,
                });
              });
            }
          });
  }

  updateDimensions() {
var elem = document.getElementById(this.props.parent)
if(elem){
  var nwidh = (elem.offsetWidth / 1.4)
  var nmrgl = this.props.padder > 0
    ? (nwidh / 5) + this.props.padder * 8
    : (nwidh / 5)

  return this.setState({wrapper:{
    width: nwidh + 'px',
    marginLeft: nmrgl + 'px',
    marginTop: (this.props.padder * 8) + 'px',
    zIndex: 5,
  }
  })

}

  }

  componentWillReceiveProps(props, next) {
    setTimeout(function() {
      this.updateDimensions();
    }.bind(this), 50);

  }

  componentDidMount() {
    window.addEventListener("resize", this.updateDimensions);

    this.updateDimensions();

  }

  componentWillUnmount() {
    window.removeEventListener("resize", this.updateDimensions);
  }

  lowerZindex(e) {
    let sty = this.state.wrapper;

    if (sty.zIndex === 8) {
      var newState = { wrapper: Object.assign({} , sty , {zIndex:5} ) };
      return this.setState(newState)
    }

  }
  raiseZindex(e) {
    let sty = this.state.wrapper;

    if (sty.zIndex === 5) {

      var newState = { wrapper: Object.assign({} , sty , {zIndex:8} )};
      return this.setState(newState)
    }

  }

  render() {

    var duratH = moment.duration(this.props.item.duration._milliseconds, 'Milliseconds').humanize();
    var duratL = moment(this.props.item.startDateTime).format("HH:mm")
    var duratE = moment(this.props.item.endDateTime).format("HH:mm")

    // {this.props.item.teacher} is used to fetch parameters that are set in 
    // agends.js class items[]

    return <div style={this.state.wrapper} className="agenda-cell-item" onMouseEnter={this.raiseZindex} onMouseLeave={this.lowerZindex}>

              <div className="agenda-controls-item" style={this.state.controls}>
               {this.props.edit?
                <div className="agenda-edit-event">
                  <a onClick={() => this.props.edit(this.props.item)} className="agenda-edit-modele">
                    <i className="edit-item-icon"></i>
                  </a>
                </div>:''}
                {this.props.remove?
                <div className="agenda-delete-event">
                  <a onClick={() => this.props.remove(this.props.item)} className="agenda-delete-modele">
                    <i className="remove-item-icon"></i>
                  </a>
                </div>:''}
              </div>

            <div className="agenda-item-description">
              <section>{this.props.item.name}</section>
              <section style={blueColor}>{this.state.teacher}</section>
            <small>
              {duratL} - {duratE} 
              {/* {duratH} */}
            </small>
          </div>

    </div>

  }
}

ReactAgendaItem.propTypes = {
  parent: PropTypes.string,
  item: PropTypes.object,
  padder: PropTypes.number,
  edit: PropTypes.func,
  remove: PropTypes.func

};

ReactAgendaItem.defaultProps = {
  parent: 'body',
  item: {},
  padder: 0
}
