import React from 'react';

const VideoListItem = ({video, onVideoSelect}) => {			// same as const video = props.video


	const imageUrl = video.snippet.thumbnails.default.url;


		/* this is a little weird - we're doing this because there's JS inside of HTML inside of JS:
			li onClick {}					<--- JS code inside of HTML
			onClick{() => function(arg)}	<---  onClick = function(arg)
			above, we're calling the onVideoSelect function with the argument video

		*/

	return (
		<li onClick={() => onVideoSelect(video)} className="list-group-item">		
			<div className="video-list-media">
				<div className="media-left">
					<img className="media-object" src={imageUrl} />
				</div>

				<div className="media-body">
					<div className="media-heading">{video.snippet.title}</div>
				</div>



			</div>
		</li>
	)
}

export default VideoListItem