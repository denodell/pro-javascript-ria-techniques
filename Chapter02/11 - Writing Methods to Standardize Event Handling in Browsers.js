// Add a new namespace to the $ library to hold all event-related code, 
// using an object literal notation to add multiple methods at once 
$.prototype.Events = { 
    // The add method allows us to assign a function to execute when an 
    // event of a specified type occurs on a specific element

    add: function (element, eventType, callback) { 
        // Store the current value of this to use within subfunctions 
        var self = this; 
        eventType = eventType.toLowerCase(); 
		
        if (element.addEventListener) { 
            // If the W3C event listener method is available, use that 
            element.addEventListener(eventType, function(e){ 
                // Execute callback function, passing it a standardized version of 
                // the event object, e. The standardize method is defined later 
                callback(self.standardize(e)); 
            }, false); 
        } else if (element.attachEvent) { 
            // Otherwise use the Internet Explorer-proprietary event handler 
            element.attachEvent("on" + eventType, function() { 
                // IE uses window.event to store the current event's properties 
                callback(self.standardize(window.event)); 
            }); 
        } 
    }, 

	// The remove method allows us to remove previously assigned code 
    // from an event 
    remove: function (element, eventType, callback) { 
        eventType = eventType.toLowerCase(); 
        if (element.removeEventListener) { 
            // If the W3C-specified method is available, use that 
            element.removeEventListener(element, eventType, callback); 
        } else if (element.detachEvent) { 
            // Otherwise, use the Internet Explorer-specific method 
            element.detachEvent("on" + eventType, callback); 
        } 
    }, 
	
    // The standardize method produces a unified set of event 
    // properties, regardless of the browser 
    standardize: function(event) { 

    	// These two methods, defined later, return the current position of the 
        // mouse pointer, relative to the document as a whole, and relative to the 
        // element the event occurred within 
        var page = this.getMousePositionRelativeToDocument(event); 
        var offset = this.getMousePositionOffset(event);
		
		// Let's stop events from firing on element nodes above the current 
        if (event.stopPropagation) { 
            event.stopPropagation(); 
        } else { 
            event.cancelBubble = true; 
        } 
        // We return an object literal containing seven properties and one method 
        return { 
            // The target is the element the event occurred on 
            target: this.getTarget(event), 
            // The relatedTarget is the element the event was listening for, 
            // which can be different from the target if the event occurred on an 
            // element located within the relatedTarget element in the DOM 
            relatedTarget: this.getRelatedTarget(event), 
            // If the event was a  keyboard-related one, key returns the character 
            key: this.getCharacterFromKey(event), 
            // Return the x and y coordinates of the mouse pointer, 
            // relative to the document 
            pageX: page.x, 
            pageY: page.y, 
            // Return the x and y coordinates of the mouse pointer, 
            // relative to the element the current event occurred on 
            offsetX: offset.x, 
            offsetY: offset.y, 
            // The preventDefault method stops the default event of the element 
            // we're acting upon from occurring. If we were listening for click 
            // events on a hyperlink, for example, this method would stop the 
            // link from being followed 
            preventDefault: function() { 
                if (event.preventDefault) { 
                    event.preventDefault(); // W3C method 
                } else { 
                    event.returnValue = false; // Internet Explorer method 
                } 
            } 
        }; 
    }, 

	// The getTarget method locates the element the event occurred on
	 getTarget: function(event) { 
        // Internet Explorer value is srcElement, W3C value is target 
        // If the event has no target, the event occurred outside of the
        // DOM and therefore on the browser 'window' itself
        var target = event.srcElement || event.target || window; 
        // Fix legacy Safari bug which reports events occurring on a text 
        // node instead of an element node 
        if (target.nodeType == 3) { // 3 denotes a text node 
            target = target.parentNode; // Get parent node of text node 
        } 
        // Return the element node the event occurred on 
        return target; 
    }, 
	
    // The getCharacterFromKey method returns the character pressed when 
    // keyboard events occur. You should use the keypress event 
    // as others vary in reliability 
    getCharacterFromKey: function(event) { 
        var character = ""; 
        if (event.keyCode) { // Internet Explorer 
            character = String.fromCharCode(event.keyCode); 
        } else if (event.which) { // W3C 
            character = String.fromCharCode(event.which); 
        } 
        return character; 
    }, 
	
    // The getMousePositionRelativeToDocument method returns the current 
    // mouse pointer position relative to the top left edge of the current page 
    getMousePositionRelativeToDocument: function(event) { 
        var x = 0, y = 0; 
        if (event.pageX) { 
            // pageX gets coordinates of pointer from left of entire document 
            x = event.pageX; 
            y = event.pageY; 
        } else if (event.clientX) { 
            // clientX gets coordinates from left of current viewable area 
            // so we have to add the distance the page has scrolled onto this value 
            x = event.clientX + document.body.scrollLeft + document.documentElement.scrollLeft; 
            y = event.clientY + document.body.scrollTop + document.documentElement.scrollTop; 
        }
		
		// Return an object literal containing the x and y mouse coordinates 
        return { 
            x: x, 
            y: y 
        } 
    }, 
	
    // The getMousePositionOffset method returns the distance of the mouse 
    // pointer from the top left of the element the event occurred on 
    getMousePositionOffset: function(event) { 
        var x = 0, y = 0; 
        if (event.layerX) { 
            x = event.layerX; 
            y = event.layerY; 
        } else if (event.offsetX) { 
            // Internet Explorer-proprietary 
            x = event.offsetX; 
            y = event.offsetY; 
        } 
		
        // Returns an object literal containing the x and y coordinates of the 
        // mouse relative to the element the event fired on 
        return { 
            x: x, 
            y: y 
        } 
    }, 
	
    // The getRelatedTarget method returns the element node the event was set up to 
    // fire on, which can be different from the element the event actually fired on 
    getRelatedTarget: function(event) {
        // If there is no related target element, the event must have occurred
        // outside of the DOM and therefore must be the browser 'window' itself
        var relatedTarget = event.relatedTarget || window; 
        if (event.fromElement && event.type == "mouseover") { 
            // With mouseover events in IE, relatedTarget is not set by default 
            relatedTarget = event.fromElement; 
        } else if (event.toElement && event.type == "mouseout") { 
            // With mouseout events in IE, relatedTarget is not set by default 
            relatedTarget = event.toElement; 
        } 
        return relatedTarget; 
    } 
};

// Example usage 

// Instantiate the library as a singleton for use on a page 
$ = new $(); 

// Clicking anywhere on the page will output the current coordinates 
// of the mouse pointer 
$.Events.add(document.body, "click", function(e) { 
    alert("Mouse clicked at 'x' position " + e.pageX + " and 'y' position "+ e.pageY); 
}); 
