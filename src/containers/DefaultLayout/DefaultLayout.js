import React, { Component } from 'react';
import { Redirect, Route, Switch } from 'react-router-dom';
import { Container } from 'reactstrap';

import {
  AppAside,
  AppBreadcrumb,
  AppFooter,
  AppHeader,
  AppSidebar,
  AppSidebarFooter,
  AppSidebarForm,
  AppSidebarHeader,
  AppSidebarMinimizer,
  AppSidebarNav,
} from '@coreui/react';
// sidebar nav config
import navigation from '../../navigationjs/admin_nav';
// routes config
import routes from '../../routes';
import DefaultAside from './DefaultAside';
import DefaultFooter from './DefaultFooter';
import DefaultHeader from './DefaultHeader';


class DefaultLayout extends Component {

  constructor(props) {

    console.log("DefaultLayout - Constructer called");

    super(props);

    this.state = {
    };

    this.setSideBarBasedOnRole = this.setSideBarBasedOnRole.bind(this);
    this.fetchLoggedInUserDetailsFromLocalStorage = this.fetchLoggedInUserDetailsFromLocalStorage.bind(this);

    //this.fetchLoggedInUserDetailsFromLocalStorage();

  }

  fetchLoggedInUserDetailsFromLocalStorage() {


    console.log("DefaultLayout - fetchLoggedInUserDetailsFromLocalStorage - Details of logged in user - " + localStorage.getItem('currentUser'));

    var currentUser =  JSON.parse(localStorage.getItem('currentUser'));
    var username = currentUser.username;
    var roles = currentUser.role;

    console.log("DefaultLayout - fetchLoggedInUserDetailsFromLocalStorage - Roles of logged in user - " + roles);

  }

  setSideBarBasedOnRole() {

    console.log("DefaultLayout - fetchLoggedInUserDetailsFromLocalStorage - Details of logged in user - " + localStorage.getItem('currentUser'));

    var currentUser =  JSON.parse(localStorage.getItem('currentUser'));
    var username = currentUser.username;
    var roles = currentUser.role;

    console.log("DefaultLayout - fetchLoggedInUserDetailsFromLocalStorage - Roles of logged in user - " + roles);

    if(roles.includes('admin')) {

      console.log("DefaultLayout - setSideBarBasedOnRole - User is admin");
      return (<AppSidebarNav navConfig={navigation} {...this.props} />);
    } else if (roles.includes('teacher')) {
      console.log("DefaultLayout - setSideBarBasedOnRole - User is teacher");
      return null;
    } else if (roles.includes('student')) {
      console.log("DefaultLayout - setSideBarBasedOnRole - User is student");
      return null;
    }

  }

  render() {
    return (
     
      <div className="app">
        <AppHeader fixed>
          <DefaultHeader />
        </AppHeader>
        <div className="app-body">
          <AppSidebar fixed display="lg">
            <AppSidebarHeader />
            <AppSidebarForm />
            {this.setSideBarBasedOnRole()}
            {/* <AppSidebarNav navConfig={navigation} {...this.props} /> */}
            <AppSidebarFooter />
            <AppSidebarMinimizer />
          </AppSidebar>
          <main className="main">
            <AppBreadcrumb appRoutes={routes}/>
            {/* <Container fluid  style={{'overflow-x': 'scroll'}}> */}
            <Container fluid>
              <Switch>
                {routes.map((route, idx) => {
                    return route.component ? (<Route key={idx} path={route.path} exact={route.exact} name={route.name} render={props => (
                        <route.component {...props} />
                      )} />)
                      : (null);
                  },
                )}
                <Redirect from="/" to="/admin" />
              </Switch>
            </Container>
          </main>
          <AppAside fixed>
            <DefaultAside />
          </AppAside>
        </div>
        <AppFooter>
          <DefaultFooter />
        </AppFooter>
      </div>
    
    
    
    );
  }
}

export default DefaultLayout;
