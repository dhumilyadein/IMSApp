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

class App extends Component {

  constructor(props) {
    super(props);

    this.state = {
      currentUser: null,
      isAdmin: false
    };
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

  render() {
    return (
      <HashRouter>

        {this.state.currentUser ? (

          <Switch>

            {/* <Route exact path="/login" name="Login Page" component={Dashboard} /> */}
            {/* <Route exact path="/" name="Login Page" component={Dashboard} /> */}

            <Route exact path="/login" name="Login Page" >
              <Redirect to="/dashboard" />
            </Route>
            <Route exact path="/" name="Login Page" >
              <Redirect to="/dashboard" />
            </Route>

            <Route exact path="/404" name="Page 404" component={Page404} />
            <Route exact path="/500" name="Page 500" component={Page500} />

            <Route path="/Dashboard" name="Home" component={DefaultLayout} />
            <Route path="/:path(admin|base|buttons|charts|dashboard|icons|notifications|pages|theme|Users|widgets)" name="Home" component={DefaultLayout} />

            <Route>
              <Redirect to="/dashboard" />
            </Route>
          </Switch>
        ) : (
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
