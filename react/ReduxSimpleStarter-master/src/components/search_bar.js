import React, { Component } from 'react';		// grab React.Component and turn it into its own variable

class SearchBar extends Component {

	constructor(props) {
		super(props);

		this.state = { term: ''};
	}


	render() {
		return (
			<div className = "search-bar" >
				<input 
					value={this.state.term}			// the state now sets the input value
					onChange={e => this.onInputChange(e.target.value)} />
			</div>
		);
	}

	onInputChange(term){
		this.setState({term})						// shortcut for {term: term}
		this.props.onSearchTermChange(term);
	}

}

export default SearchBar;