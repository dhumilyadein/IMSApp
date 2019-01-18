import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import './classmanagementcss/index.css';
import Agenda from './agenda/agenda.js'

class ClassTimeTable extends Component {
  constructor(props) {
    super(props);
    this.state = {
      
    }
  }


  render() {

    return (

       <Agenda />
      // <Modal clickOutside={this._closeModal} >
      //               <div className="modal-content">
      //                 <ReactAgendaCtrl items={this.state.items} selectedCells={this.state.selected} Addnew={this.addNewEvent} edit={this.editEvent} />

      //               </div>
      //             </Modal>

    );
  }
}

export default ClassTimeTable;