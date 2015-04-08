var $ = function() {};

$.prototype.onDomReady = function(callback){ // callback should be a function 
    if (document.addEventListener) { 
        // If the browser supports the DOMContentLoaded event, 
        // assign the callback function to execute when that event fires 
        document.addEventListener("DOMContentLoaded", callback, false); 
    } else { 
        if(document.body && document.body.lastChild){ 
            // If the DOM is available for access, execute the callback function 
            callback(); 
        } else { 
            // Reexecute the current function, denoted by arguments.callee, 
            // after waiting a brief nanosecond so as not to lock up the browser
            var onDomReadyFunction = arguments.callee;
            window.setTimeout(function() {
            	onDomReadyFunction(callback);
            }, 0); 
        } 
    } 
} 

// Example usage 
// Instantiate the $ library object as a singleton for use on a page 
$ = new $(); 
// Outputs "The DOM is ready!" when the DOM is ready for access 
$.onDomReady(function() { 
    alert("The DOM is ready!"); 
}); 