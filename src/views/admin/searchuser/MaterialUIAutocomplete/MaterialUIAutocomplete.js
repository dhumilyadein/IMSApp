import React, { Component } from 'react';
import { AutoComplete } from 'material-ui';
import getMuiTheme from 'material-ui/styles/getMuiTheme';
import MuiThemeProvider from 'material-ui/styles/MuiThemeProvider';
import JSONP from 'jsonp';
import SearchUser from '../SearchUser';

const googleAutoSuggestURL = `
  //suggestqueries.google.com/complete/search?client=youtube&ds=yt&q=`;

class MaterialUIAutocomplete extends Component {

  constructor(props) {
    super(props);
    this.onUpdateInput = this.onUpdateInput.bind(this);
    this.state = {
      dataSource: [],
      inputValue: '',
      tempParentState:''
    }
  }

  onUpdateInput(inputValue) {
    const self = this;
    this.setState({
      inputValue: inputValue
    }, function () {
      self.performSearch();
    });
  }

  performSearch() {
    const
      self = this,
      url = googleAutoSuggestURL + this.state.inputValue;

    if (this.state.inputValue !== '') {

      var jsonObj = [];
      var item = {}
      item["find"] = this.state.inputValue;
      item["using"] = "username";
      item["searchCriteria"] = "equalsSearchCriteria";

      jsonObj.push(item);

      console.log("response - " + JSON.stringify(jsonObj));
      console.log("SearchUser state in MaterialUIAutoComplete - " + JSON.stringify(this.state.tempParentState));

      // axios.post("http://localhost:8001/api/searchUsers", this.state).then(res => {
      //   console.log("response - " + JSON.stringify(res.data));
      //   console.log("res.data.errors - " + res.data.errors);
      //   console.log("res.data.message - " + res.data.message);
      //   console.log("res.data.error - " + res.data.errors);

      //   if (res.data.errors) {
      //     return this.setState({ errors: res.data.errors });
      //   } else {

      //     this.props.history.push("/users");

      //   }
      // });

      JSONP(url, function (error, data) {
        let searchResults, retrievedSearchTerms;

        if (error) return error;

        searchResults = data[1];

        retrievedSearchTerms = searchResults.map(function (result) {
          return result[0];
        });

        self.setState({
          dataSource: retrievedSearchTerms
        });
      });
    }
  }

  render() {
    return (<MuiThemeProvider muiTheme={getMuiTheme()}>
      <AutoComplete
        hintText="Enter Search text"
        dataSource={this.state.dataSource}
        onUpdateInput={this.onUpdateInput}
        floatingLabelText="Find"
        fullWidth={true}
      />
    </MuiThemeProvider>);
  }
}

export default MaterialUIAutocomplete;