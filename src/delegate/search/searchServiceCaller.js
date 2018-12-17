import axios, { post } from "axios";

class SearchServiceCaller {

  callSearchStudents(searchStudentsRequest) {

    axios.post("http://localhost:8001/api/searchStudents", searchStudentsRequest).then(res => {

      if (res.data.errors) {
        return this.setState({ errors: res.data.errors });
      } else {
        return res.data;
        this.setState({
          fetchedStudentsDetails: res.data
        });

      }
      this.mapStudentResponseToState();
    });

  }

}