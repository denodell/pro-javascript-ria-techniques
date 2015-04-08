$.onDomReady(function() { 
    // Create duration control, <p id="duration">, insert after <h2> tag 
	
    var durationControl = $.Elements.create("p"); 
    p.id = "duration"; 
    durationControl.insertAfter(document.getElementsByTagName("h2")[0]); 
	
    // Create play / pause control element, <div id="play-pause">, insert within 
    // the <div id="controls"> tag
	
	var playPauseControl = $.Elements.create("div"); 
    playPauseControl.id = "play-pause"; 
    playPauseControl.innerHTML = "play / pause"; 
    document.getElementById("controls").appendChild(playPauseControl); 
	
    // Create playhead control, <div id="playhead"><div id="playhead-position"> 
    // </div></div>, insert within <div id="controls"> element on the page 
	
    var playheadControl = $.Elements.create("div"); 
    playheadControl.id = "playhead"; 
    var playheadPositionControl = $.Elements.create("div"); 
    playheadPositionControl.id =  "playhead-position"; 
    playheadControl.appendChild(playheadPositionControl); 
    document.getElementById("controls").appendChild(playheadControl); 
}); 