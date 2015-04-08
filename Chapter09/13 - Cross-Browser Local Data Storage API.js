// Stores a reference to the technique's code object, set with the initialize method 
$.prototype.Storage.dataStore = null; 

// The initialize method selects the technique to use for local data storage. Takes 
// a parameter that specifies the Flash element on the page in order to support 
// Flash Shared Objects. If this parameter is not provided, Flash will not attempt 
// to be used to store the data 
$.prototype.Storage.initialize = function(flashElement) { 

    // Work through our order of preference 
    if (window.localStorage) {

		// If local storage API is available, set the dataStore to point to the 
        // local storage API namespace we created earlier 
        this.dataStore = $.Storage.LocalStorage; 
		
    } else if (window.openDatabase) { 
	
        // If the  client-side database API is supported, assign the dataStore to the 
        // DBStorage namespace and initialize it 
        this.dataStore = $.Storage.DBStorage; 
        this.dataStore.initialize(); 
		
    } else if (window.globalStorage) { 
	
        // If the global storage API is supported, set dataStore to point to the 
        // appropriate namespace 
        this.dataStore = $.Storage.GlobalStorage; 
        this.dataStore.initialize(); 
		
    } else if (window.ActiveXObject) { 
	
        // If Internet Explorer's userData mechanism is present, 
        // initialize that for use 
        this.dataStore = $.Storage.UserData; 
        this.dataStore.initialize(); 
		
    } else if (flashElement) { 
	
        // If Flash 8 is supported, set the dataStore to use Flash Shared Objects 
        this.dataStore = $.Storage.Flash; 
        this.dataStore.initialize(flashElement); 
		
    } else { 
	
        // If all else fails, use cookies 
        this.dataStore = $.Storage.Cookies; 
    } 
}; 

// The get method retrieves a previously stored value and passes it to the 
// specified callback function. Because the callback technique is used in the 
//  client-side database API, we need to use it throughout 
$.prototype.Storage.get = function(name, callback) { 

    // Only one object (client-side database API) actually uses the callback 
    // parameter as part of the data retrieval process. Other namespaces specified 
    // in the dataStore will just ignore it 
    var value = this.dataStore.get(name, callback);
	
	// If a value is returned (which it isn't with the client-side database API), 
    // execute the callback function, passing it the value found. 
    if (value && callback) { 
        callback(value); 
    } 
}; 

// The set method stores a value against a specified name 
$.prototype.Storage.set = function(name, value) { 

    // All the different techniques accept the same inputs for setting data, so this 
    // universal method is fairly simple 
    this.dataStore.set(name, value); 
}; 

// The remove method permanently deletes data by a specified name 
$.prototype.Storage.remove = function(name) { 

    // Each technique accepts the same inputs for removing data 
    this.dataStore.remove(name); 
}; 