/*
	1. create component
	2. component produces HTML
	3. tell React to put the generated HTML on the page
*/
import React, {Component} from 'react';
import _ from 'lodash'
import ReactDOM from 'react-dom'
import YTSearch from 'youtube-api-search'
import SearchBar from "./components/search_bar"
import VideoList from "./components/video_list"
import VideoDetail from "./components/video_detail"
const API_KEY = "AIzaSyAjPmw6RDL5DTcSeELzg8N8GNIZ9XydhGI";


class App extends Component {							// function(){}  --> () => {}

	constructor(props){
		super(props);

		this.state = { 
			videos: [],
			selectedVideo: null 
		};

		this.videoSearch("surfboards");

	}

	videoSearch(searchTerm){
		YTSearch({key: API_KEY, term: searchTerm}, (videos) => {
			this.setState({ 
				videos: videos,
				selectedVideo: videos[0] 
			})					
		})
	}

	render() {

		const videoSearch = _.debounce((term) => { this.videoSearch(term) }, 300 )
						 // _.debounce(function(term){ this...}, 300)		

		return (
			<div>
				<SearchBar 
					onSearchTermChange={videoSearch} />
				<VideoDetail video={this.state.selectedVideo} />
				<VideoList 
					onVideoSelect={selectedVideo => this.setState({selectedVideo})}
					videos={this.state.videos} />		
			</div>
		);
	} 
}

var component = React.createElement(App, null);

ReactDOM.render(<App />, document.querySelector(".container")); 