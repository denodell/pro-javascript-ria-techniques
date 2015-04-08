$.prototype.Observer = function() { 
    // Create an array to store the events 
    this.events = [];
	
	// The listen method listens for an event of a specific name to fire, assigning 
    // a method to execute when it does 
    this.listen = function(eventName, method) { 
        if (typeof method == "function") { 
            if (!this.events[eventName]) { 
                this.events[eventName] = [] 
            } 
            this.events[eventName].push(method); 
        } 
    }; 
	
    // The fire method fires an event of a specific name, executing all methods 
    // that have been associated with that event in turn, passing in any optional 
    // parameters that have been sent along with the request to fire 
    this.fire = function(eventName, params, scope) { 
        scope = scope || window; 
        for (var methodIndex = 0; methodIndex < this.events[eventName].length; methodIndex++) { 
            this.events[eventName][methodIndex].call(scope, params); 
        } 
    } 
} 
