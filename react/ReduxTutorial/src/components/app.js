import React, { Component } from 'react';
import { connect } from 'react-redux';

import BookList from "../containers/book_list";

class App extends Component {
  render() {
    return (
      <div>
      	<BookList />
      </div>
    );
  }
}


function mapStateToProps(state) {
	return {
		books: state.books
	}
}


export default connect(mapStateToProps)(BookList);