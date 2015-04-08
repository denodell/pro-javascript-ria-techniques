$.onDomReady(function() { 
    // Define a function to retrieve the full navigation HTML via Ajax 
    var getNavigationHTML = function() { 
         $.Remote.load("full-navigation.html", function(response) { 
            // Set the HTML in the correct place on the page 
             document.getElementById("top-navigation").innerHTML = response.text; 
        });
		
		// Never execute this again when the mouse moves over the navigation 
         $.Events.remove(document.getElementById("top-navigation"), "mouseover", getNavigationHTML); 
    } 
	
    // Execute this function when the mouse is brought over the top of the 
    // navigation element 
     $.Events.add(document.getElementById("top-navigation"), "mouseover", getNavigationHTML); 
}); 