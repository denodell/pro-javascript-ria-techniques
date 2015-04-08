$.onDomReady(function() { 
    // To include the player onto our page, we simply use 
    // SWFObject to embed the YouTube player onto our page 
	
    var movieURL = "http://www.youtube.com/apiplayer?enablejsapi=1"; 
    var tagIDToReplace = "movie"; 
    var width = 320; 
    var height = 240; 
    var flashVersionRequired = "8"; 
    var expressInstallURL = null; 
    var flashVars = null; 
    var parameters = { 
        allowScriptAccess: "always" 
    }; 
    var attributes = { 
        id:  "flash-movie" 
    }; 
	
    // Actually embed the video player onto the page 
    swfobject.embedSWF(movieURL, tagIDToReplace, width, height, flashVersionRequired, expressInstallURL, flashVars, parameters, attributes);
	
	// Now we have the player embedded within our page, we 
    // need to point it to the video file we wish to play. As 
    // you may imagine, we can only link to videos hosted via 
    // the YouTube service itself. We load the video based 
    // on the unique identifier assigned to each movie using 
    // the player's loadVideoById() method. When the YouTube 
    // player is ready to be interacted with, it calls a 
    // function with the specific name onYouTubePlayerReady. 
    // We hook into this event by adding our own 
    // initialization code to a function of that name. 
	
    function onYouTubePlayerReady() { 
        // We created the element with id of flash-movie with SWFObject earlier 
        var youTubePlayer = document.getElementById("flash-movie"); 
        // This is the unique YouTube identifier for the video we wish to display 
        var videoID = "u1zgFlCw8Aw"; 
        // Start the video at the beginning 
        var startTime = 0; 
        // Load the video into the player 
        youTubePlayer.loadVideoById(videoID, startTime); 
		
        // Let's wire up the controls on our page to the video 
        // player. Let's start with the play/pause button. When 
        // this button is pressed, we want to start playing the video if it 
        // is paused and pause it if it is already playing. The 
        // playVideo() and pauseVideo() methods of the YouTube 
        // JavaScript API are quite  self-explanatory. We just 
        // need to detect whether the video is playing to 
        // switch our logic. The way we do this is to use the 
        // getPlayerState() method, which returns a number 
        // representing the current state of the player, 
        // whether the movie is playing, paused, buffering, etc. 
		
        var playPauseControl = document.getElementById("play-pause"); 
        $.Events.add(playPauseControl, "click", function() { 
            var playingState = 1; 
            var pausedState = 2; 
            var currentPlayerState = youTubePlayer.getPlayerState(); 
            if (currentPlayerState == playingState) { 
                youTubePlayer.pauseVideo(); 
            } else if (currentPlayerState == pausedState) { 
                youTubePlayer.playVideo(); 
            } 
        });
		
		// Now we are able to play and pause the movie to our 
        // heart's content. Let's display the duration of the 
        // movie, which we show next to the video on our 
        // example page. This information is not made 
        // available to us until the video's associative 
        // metadata has been loaded, which, according to 
        // Google, occurs just after the video begins playing. 
        // We'll write our code, therefore, to wait for the 
        // video to start playing and, when it does, get the 
        // duration value and write it to the browser. We can 
        // listen for the player state change event and write 
        // code to update the duration value on the page when 
        // the event fires. 
		
        youTubePlayer.addEventListener("onStateChange", function(newState) { 
            var playingState = 1; 
            if (newState == playingState) { 
			
                // If the video is now playing, get the 
                // duration of the movie, make it more user- 
                // friendly, and display it on the page 
                var durationField = document.getElementById("duration"); 
                var durationInSeconds = youTubePlayer.getDuration(); 
                var durationInMinutes = durationInSeconds / 60; 
                var durationFullMinutes = Math.ceil(durationInMinutes); 
                var durationRemainder = durationInMinutes - Math.floor(durationInMinutes); 
                var durationRemainderInSeconds = durationRemainder * 60; 
                var durationText = "Duration: " + durationFullMinutes + "m " + durationRemainderInSeconds + "s"; 
                durationField.innerHTML = durationText; 
            } 
        }); 
		
        // Now we need to connect up our playhead control so 
        // we can show our users the progress of playback 
        // through the movie, using the technique for progress 
        // controls presented in Chapter 5 
		
        // Execute this routine on an interval, once a second 
        window.setInterval(function() {
			// Calculate the current playback position in the 
            // movie as a percentage of the total duration 
            var playheadPosition =  document.getElementById("playhead-position"); 
            var currentPlaybackPositionInSeconds = youTubePlayer.getCurrentTime(); 
            var durationInSeconds = youTubePlayer.getDuration(); 
            var playbackPositionAsPercentage = (currentPlaybackPositionInSeconds / durationInSeconds) * 100; 
			
            // Update the width of the progress bar to reflect this percentage 
            playheadPosition.style.width = playbackPositionAsPercentage + "%"; 
        }, 1000); // Executed once every 1000 milliseconds = 1 second 
    } 
}); 