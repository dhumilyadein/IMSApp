import { BehaviorSubject } from 'rxjs';
import axios from "axios";
import {autologout} from './';

const currentUserSubject = new BehaviorSubject(JSON.parse(localStorage.getItem('currentUser')));

export const authenticationService = {
    login,
    logout,
    currentUser: currentUserSubject.asObservable(),
    get currentUserValue () { return currentUserSubject.value }
};

async function login(username, password) {
    
    var loginRequest = {
        "username": username,
        "password" : password
    };

    var response = await axios.post("http://localhost:8001/api/login", loginRequest).then(res => {

      console.log("response - " + JSON.stringify(res.data));
      console.log("response errors - " + res.data.errors);
      console.log("response message - " + res.data.message);

      if (res.data.error || res.data.errors) {

        console.log("authentication.service.js - login failed - " + JSON.stringify(res.data));
        return res.data;
      } else {

        var roles = "";
        if (res.data.userData && res.data.userData.role.length > 1) {
          for (var i = 0; i < res.data.userData.role.length; i++) {
            roles = roles + "#" + res.data.userData.role[i];
          }
        } else {
          roles = res.data.userData.role[0];
        }
        
        var currentUserDetails = {

            id: res.data.userData.id,
            username: res.data.userData.username,
            firstName: res.data.userData.firstName,
            lastName: res.data.userData.lastName,
            role: res.data.userData.role,
            token: `fake-jwt-token.${roles}`
          }

        localStorage.setItem('currentUser', JSON.stringify(currentUserDetails));
        currentUserSubject.next(currentUserDetails);

        // Setting up the automatic logout timer on right after login 
        // NOT IN USE - DELETE - CAN BE DELETED
        // autologout.setup();

        console.log("Number of roles - " + res.data.userData.role.length + " Roles - " + res.data.userData.role);

        if (res.data.userData.role.length === 1) {

          if (res.data.userData.role == 'admin') {

            console.log('redirecting to registeruser page');
            return (window.location = "/#/admin/registeruser");
          } else {
            return (window.location = "/#/Dashboard");
          }
        } else if (res.data.userData.role.length > 1) {
          return (window.location = "/#/Dashboard");
        } else {
          return (window.location = "/#/Dashboard");
        }
      }

      //return (window.location = "/AdminPage");
    });

    return response;
    
}

function logout() {
    // remove user from local storage to log user out

    console.log("authentication.srevice.js - logout - Entry");
    
    localStorage.removeItem('currentUser');
    currentUserSubject.next(null);
}
