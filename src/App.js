import React, { Component } from 'react';
import { HashRouter, Route, Switch, Redirect, DefaultRoute } from 'react-router-dom';
import './App.scss';

// Containers
import { DefaultLayout } from './containers';
import Dashboard from './views/Dashboard/Dashboard';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';
import { authenticationService } from './auth';
import Role from 'constants';

var timeoutID;

class App extends Component {

  constructor(props) {

    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false
    };

    this.setup = this.setup.bind(this);
    this.startTimer = this.startTimer.bind(this);
    this.resetTimer = this.resetTimer.bind(this);
    this.goInactive = this.goInactive.bind(this);
    this.goActive = this.goActive.bind(this);

    this.setup();
  }

  componentDidMount() {

    authenticationService.currentUser.subscribe(x => this.setState({
      currentUser: x,
      isAdmin: x && x.role === Role.ADMIN,
      isStudent: x && x.role === Role.STUDENT,
      isTeacher: x && x.role === Role.TEACHER,
      isParent: x && x.role === Role.PARENT,
    }, () => {
      console.log('App.js - componentDidMount - currentUser - ' + JSON.stringify(this.state.currentUser));
    }));


  }

  setup() {

    console.log('autologout - setup - listening activity events and setting up Logout timer');
  
    // Activity event on the browser screen
    window.addEventListener("mousemove", this.resetTimer, false);
    window.addEventListener("mousedown", this.resetTimer, false);
    window.addEventListener("keypress", this.resetTimer, false);
    window.addEventListener("DOMMouseScroll", this.resetTimer, false);
    window.addEventListener("mousewheel", this.resetTimer, false);
    window.addEventListener("touchmove", this.resetTimer, false);
    window.addEventListener("MSPointerMove", this.resetTimer, false);

    // Browser close button click event
    window.addEventListener("beforeunload", authenticationService.logout, false);
  
    this.startTimer();
  }
  
  startTimer() {
  
      console.log('autologout - startTimer - timer started');
      timeoutID = window.setTimeout(this.goInactive, 10 * 1000);
  }
  
  resetTimer() {
  
      console.log('autologout - restTimer - timer reset on activity');
      window.clearTimeout(timeoutID);
  
      // As activity is done.. calling goActive method
      this.goActive();
  }
  
  goInactive() {
  
      console.log('autologout - goInactive - calling logout as no activity happened for the specified time');
  
      // logout on inactivity
      authenticationService.logout();
  }
  
  goActive() {
  
      console.log('autologout - goActive - goActive called as activity happened');
  
      this.startTimer();
  }

  render() {
    return (
      <HashRouter>

        {this.state.currentUser ? (

          <Switch>

            {/* Redirect to various component as the user is logged in */}
            {/* <Route exact path="/login" name="Login Page" component={Dashboard} /> */}
            {/* <Route exact path="/" name="Login Page" component={Dashboard} /> */}

            {/* Redirect to /dashboard if user is logged in */}
            
            <Route exact path="/login" name="Login Page" >
              <Redirect to="/dashboard" />
            </Route>
            <Route exact path="/" name="Login Page" >
              <Redirect to="/dashboard" />
            </Route>

            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />

            <Route path="/dashboard" name="Home" component={DefaultLayout} />
            <Route path="/:path(admin|base|buttons|charts|dashboard|icons|notifications|pages|theme|Users|widgets)" name="Home" component={DefaultLayout} />

            {/* Redirect to /dashboard if the request is general */}
            <Route>
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        ) : (
            // Redirect to /login if user is not logged in
            <Switch>
              <Route path="/" name="Login Page" component={Login} />
              <Route>
                <Redirect to="/login" />
              </Route>
            </Switch>
          )}
      </HashRouter>
    );
  }
}

export default App;
