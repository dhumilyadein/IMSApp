import React from "react";
import { render } from "react-dom";
import Paper from "@material-ui/core/Paper";
import { ViewState } from "@devexpress/dx-react-scheduler";
import {
  Scheduler,
  WeekView,
  Appointments
} from "@devexpress/dx-react-scheduler-material-ui";
import { MuiThemeProvider, createMuiTheme } from "@material-ui/core/styles";
import { blue } from "@material-ui/core/colors";
import { appointments } from "./data";
import {
  Card,
  CardBody,
  CardHeader,
  Container,
} from "reactstrap";

const theme = createMuiTheme({ palette: { type: "light", primary: blue } });

class ClassTimeTable extends React.PureComponent {
  constructor(props) {
    super(props);

    this.state = {
      data: appointments
    };

    this.appointmentClicked = this.appointmentClicked.bind(this);
  }

  appointmentClicked(e) {

    console.log("Appointment - " + e + " is clicked");
  }

  appointmentClicked() {

    console.log("Appointment - is clicked");
  }


  render() {
    const { data } = this.state;

    return (

      <div>
        <Container >

          <Card>
            <CardHeader>
              <i className="fa fa-align-justify"></i> Classes <small className="text-muted">Select a Class</small>
            </CardHeader>
            <CardBody>

              <MuiThemeProvider theme={theme}>
                <Paper>
                  <Scheduler data={data}>
                    <ViewState currentDate="2018-06-28" />
                    <WeekView excludedDays={[6,0]} firstDayOfWeek={1} startDayHour={9} endDayHour={19} />
                    {/* <Appointments onClick={this.appointmentClicked} /> */}
                    <Appointments onClick={this.appointmentClicked}  />
                  </Scheduler>
                </Paper>
              </MuiThemeProvider>

            </CardBody>
          </Card>

        </Container>
      </div>
    );
  }
}

export default ClassTimeTable;
