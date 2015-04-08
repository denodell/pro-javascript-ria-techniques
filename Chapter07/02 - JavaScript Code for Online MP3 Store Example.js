// Execute this code once the SoundManager component has initialized so that we do 
// not generate any timing errors

soundManager.onload = function() { 

    // Define two audio tracks we wish to play later 
    var track1 = soundManager.createSound({ 
	
        // Internal identifier for this track 
        id:  "track-one", 
		
        // Location of MP3 file 
        url: "/track1.mp3", 
		
        // Volume level, out of 100 
        volume: 50 
    }); 
	
    var track2 = soundManager.createSound({ 
        id:  "track-two", 
        url: "/track2.mp3", 
        volume: 50 
    }); 
	
    $.Events.add(document.getElementById("track1"), "click", function() { 
        // When the user clicks the HTML element with an id of track1, the first 
        // MP3 file plays 
        track1.play(); 
		
        // Other SoundManager methods include: stop(), pause(), resume(), 
        // setVolume(x) and mute() 
    }); 
	
    $.Events.add(document.getElementById("track2"), "click", function(){
		// When the user clicks the HTML element with an id of track2, the 
		// second MP3 file plays 
		track2.play();
	}); 
} 
