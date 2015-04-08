$.onDomReady(function() { 
    // This function executes as soon as the DOM is ready for access 
	
    // Load two JavaScript files, my-script.js and my-other-script.js, simultaneously 
    $.Remote.loadScript("my-script.js", function() { 
        // my-script.js loaded 
    });
	 $.Remote.loadScript("my-other-script.js", function() { 
        // my-other-script.js loaded 
    }); 
}); 
