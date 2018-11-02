import React, { Component } from 'react';
import { HashRouter, Route, Switch } from 'react-router-dom';
import './App.scss';

// Containers
import { DefaultLayout } from './containers';
// Pages
import { Login, Page404, Page500, Register } from './views/Pages';
//import RegisterUser from './views/admin/registeruser';

// import { renderRoutes } from 'react-router-config';

class App extends Component {
  render() {
    return (
      <HashRouter>
        <Switch>
          <Route exact path="/login" name="Login Page" component={Login} />
          <Route exact path="/" name="Login Page" component={Login} />
          <Route exact path="/register" name="Register Page" component={Register} />
          <Route exact path="/404" name="Page 404" component={Page404} />
          <Route exact path="/500" name="Page 500" component={Page500} />

          <Route path="/admin/registeruser" name="Register User" component={DefaultLayout} />

          <Route path="/Dashboard" name="Home" component={DefaultLayout} />
          <Route path="/:path(base|buttons|charts|dashboard|icons|notifications|pages|theme|Users|widgets)" name="Home" component={DefaultLayout} />

        </Switch>
      </HashRouter>
    );
  }
}

export default App;
