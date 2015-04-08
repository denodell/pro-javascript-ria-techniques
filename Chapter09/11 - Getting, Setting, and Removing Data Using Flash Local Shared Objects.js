// Create a Flash namespace to contain all Flash cookie-related storage methods 

$.prototype.Storage.Flash = { 

    // Object used to store a reference to the Flash movie element on the page 
    flashComponent: null, 
	
    // The initialize method sets the internal flashComponent object to the one 
    // passed in from the page - use SWFObject to load in the movie on the page. 
    // Chapter 7 shows how to use SWFObject to embed a Flash movie 
	
    initialize: function(flashComponent) { 
        this.flashComponent = flashComponent; 
    }, 
	
    // The set method stores a value by name into a Flash shared object 
    set: function(input) { 
	
        // Expect an object literal as an input, containing name and value to set 
        var name = input.name || ""; 
        var value = input.value || ""; 
		
        // Save the data using the set method within the Flash movie object 
        this.flashComponent.set(name, value); 
    },
	
	 // The get method retrieves a previously stored value by name 
    get: function(name) { 
	
        // Return an empty string if the value requested does not exist 
        return this.flashComponent.get(name) || ""; 
    }, 
	
    // The remove method deletes the value with the given name from the Flash 
    // shared object 
    remove: function(name) { 
        this.flashComponent.remove(name); 
    } 
} 