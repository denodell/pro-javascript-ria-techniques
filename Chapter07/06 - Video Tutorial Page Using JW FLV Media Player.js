$.onDomReady(function() { 
    // The JW FLV Player is represented as player.swf, 
    // downloaded from the project web site 
    var movieURL = "player.swf"; 
    var tagIDToReplace = "movie"; 
    var width = 320; 
    var height = 240; 
    var flashVersionRequired = "8"; 
    var expressInstallURL = null; 
	
    // Specify the video file we wish to display, and 
    // instruct the player to begin playing immediately 
    // without displaying the player's default controls 
    // within the Flash movie 
    var flashVars = { 
        file:  "my-video.flv", 
        autostart: "true", 
        controlbar: "none", 
        icons: "false" 
    }; 
    var parameters = { 
        allowScriptAccess: "always" 
    }; 
    var attributes = { 
        id:  "flash-movie" 
    }; 
	
    // Embed the media player onto the page 
    swfobject.embedSWF(movieURL, tagIDToReplace, width, height, flashVersionRequired, expressInstallURL, flashVars, parameters, attributes);
	
	// Once the player has initialized, it calls a 
    // function on the page named playerReady. We write 
    // our code to connect up our controls by adding our 
    // code into a function of this name 
	
    function playerReady(playerInstance) { 
 
        // playerInstance is an object representing the 
        // media player on the page. Its id represents the 
        // id of the page element within HTML 
        var myJWPlayer = document.getElementById(playerInstance["id"]); 
        var playPauseControl = document.getElementById("play-pause"); 
        $.Events.add(playPauseControl, "click", function() { 
            // When the user clicks the play/pause button, 
            // send the PLAY event to the player, which 
            // toggles its playback mode between play and pause 
            myJWPlayer.sendEvent("PLAY"); 
        }); 
		
        // The player allows us to write code to hook onto 
        // certain events that get fired from within the 
        // Flash component itself. 
		
        // Here, we assign the function named setDuration, 
        // which we define later, to be called when the 
        // LOADED event is fired by the component - which 
        // happens when the video file has loaded - which 
        // we will use to populate our duration element on the page 
        myJWPlayer.addModelListener("LOADED", "setDuration"); 
		
        // The setPlayheadPosition function, defined 
        // later, will be called when the TIME event fires 
        // within the player component - this occurs at a 
        // fixed interval, once every 100 milliseconds - 
        // and we can use this to update our progress bar 
        myJWPlayer.addModelListener("TIME", "setPlayheadPosition"); 
    } 
}); 

// The setDuration method will be called by the Flash 
// component when the video file has loaded, passing it an 
// object literal containing the id of the player on the 
// page that fired the event 
function setDuration(options) { 
    var durationField = document.getElementById("duration");
	
	// Find the player component using the id passed to this function 
    var myJWPlayer = document.getElementById(options.id); 
	
    // Get the current status of the player component and 
    // establish from this the duration of the video file 
    var durationInSeconds = myJWPlayer.getConfig().duration; 
	
    // Make the duration more user-friendly 
    var durationInMinutes = durationInSeconds / 60; 
    var durationFullMinutes = Math.ceil(durationInMinutes); 
    var durationRemainder = durationInMinutes - Math.floor(durationInMinutes); 
    var durationRemainderInSeconds = durationRemainder * 60; 
    var durationText = "Duration: " + durationFullMinutes + "m " + durationRemainderInSeconds + "s"; 
	
    // Output the duration to the element on the page 
    durationField.innerHTML = durationText; 
} 

// The setPlayheadPosition method will be called by the 
// Flash component once every 100 milliseconds, passing it 
// an object literal containing the current position of 
// playback within the video and the total duration of the 
// video 
function setPlayheadPosition(options) { 
    var playheadPosition = document.getElementById("playhead-position"); 
	
    // Get the current position of playback within the 
    // video as a percentage of the total duration 
    var currentPlaybackPositionInSeconds = options.position; 
    var durationInSeconds = options.duration; 
    var playbackPositionAsPercentage = (currentPlaybackPositionInSeconds / durationInSeconds) * 100; 
	
    // Move the progress bar on the page to the correct 
    // position based on the percentage calculated 
    // previously 
    playheadPosition.style.width = playbackPositionAsPercentage + "%"; 
} 