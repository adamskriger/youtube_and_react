import React, { Component } from 'react';
import ReactDOM from 'react-dom';


class SearchBar extends Component {
  constructor(props){
    super(props);

    this.state = { term: '' };
  }


  render() {

    var searchBar = {

      width: '100%',
      height: '5rem',
      lineHeight: '3.5rem',
      marginBottom: '3rem',
      fontSize: '3.5rem',
      border: '1px solid black'
    }

    return (
    <div >
    <input
      
      style={searchBar}
      value={this.state.term}
      onChange={event => this.onInputChange(event.target.value)} />
    </div>
  );
  }

  onInputChange(term) {
    this.setState({term})
    this.props.onSearchTermChange(term);
  }
}





export default SearchBar;
