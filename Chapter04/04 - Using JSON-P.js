// The loadJSONP method mimics the existing loadScript method but allows 
// the returned JSON data to be available to the callback method as an input. 
// Add this method to our $ JavaScript library code. 

$.prototype.Remote.loadJSONP = function(url, callback){ 
    // The callback function needs to exist within the global window object 
    window.tempFunction = callback;
	
	// Append the jsonp=tempFunction query string parameter to the URL. 
    // The server should wrap the returned JSON data in a call to the function 
    // of the name specified in this parameter, so it is executed when 
    // the data is returned 
    url = url.contains("?") ? url + "&jsonp=tempFunction" : "?jsonp=tempFunction"; 
	
    // Call the existing loadScript method to place the <script> tag on the page 
    this.loadScript(url); 
} 

// Example usage 
// Assuming an instance of the $ library exists on the page 

// Make a request for the file my-script.php?jsonp=tempFunction, which 
// returns the JSON data wrapped in a call to the tempFunction method 
$.Remote.loadJSONP("my-script.php", function(data) { 
    // Outputs "object" denoting an object literal has been returned 
    alert(typeof data); 
}); 