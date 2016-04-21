import _ from 'lodash'
import React, { Component } from 'react';
import ReactDOM from 'react-dom';
import SearchBar from './components/search_bar'
import YTSearch from 'youtube-api-search';
import VideoList from './components/video_list'
import VideoDetail from './components/video_detail'
import Heading from './components/heading'

const API_KEY = 'AIzaSyCaLXE-zhjlb7xvd40W_c673QTTirBpfrs';




// Create a new component
// Should produce some HTML
class App extends Component {

constructor(props) {
  super(props);

  this.state = { videos : [],
                selectedVideo: null
   };

   this.videoSearch('surfboards');

}


  videoSearch(term) {
    YTSearch({key: API_KEY, term: term}, (videos) => {
        this.setState( {
          videos: videos,
          selectedVideo: videos[0]
        } );
      });

  }

  render() {
    const videoSearch = _.debounce((term) => {this.videoSearch(term)}, 300);

  return (
    <div>
    <Heading />
    <SearchBar onSearchTermChange={videoSearch} />
    <VideoDetail video={this.state.selectedVideo}/>
    <VideoList
    onVideoSelect={selectedVideo => this.setState({selectedVideo})}
    videos={this.state.videos}/>
    </div>
      );
    }
}


// Show the componenent's generated HTML on the DOM
ReactDOM.render(<App />, document.querySelector('.container'));
