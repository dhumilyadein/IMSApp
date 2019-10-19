// NOT IN USE - DELETE - CAN BE DELETED

import {authenticationService} from './';

var timeoutID;

export const autologout = {
    setup
};

function setup() {

  console.log('autologout - setup - listening activity events and setting up Logout timer');

  window.addEventListener("mousemove", resetTimer, false);
  window.addEventListener("mousedown", resetTimer, false);
  window.addEventListener("keypress", resetTimer, false);
  window.addEventListener("DOMMouseScroll", resetTimer, false);
  window.addEventListener("mousewheel", resetTimer, false);
  window.addEventListener("touchmove", resetTimer, false);
  window.addEventListener("MSPointerMove", resetTimer, false);

  startTimer();
}

function startTimer() {

    console.log('autologout - startTimer - timer started');
    timeoutID = window.setTimeout(goInactive, 10 * 1000);
}

function resetTimer() {

    console.log('autologout - restTimer - timer reset on activity');
    window.clearTimeout(timeoutID);

    // As activity is done.. calling goActive method
    goActive();
}

function goInactive() {

    console.log('autologout - goInactive - calling logout as no activity happened for the specified time');

    // logout on inactivity
    authenticationService.logout();
}

function goActive() {

    console.log('autologout - goActive - goActive called as activity happened');

    startTimer();
}