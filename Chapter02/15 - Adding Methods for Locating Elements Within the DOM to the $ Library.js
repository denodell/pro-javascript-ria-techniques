// Add a new Elements namespace to the $ library 

$.prototype.Elements = { 

    // The getElementsByClassName method returns an array of DOM elements 
    // which all have the same given CSS class name applied. To improve the speed 
    // of the method, an optional contextElement can be supplied which restricts the 
    // search to only those child nodes within that element in the node hierarchy 
	
    getElementsByClassName: function(className, contextElement){ 
        var allElements = null; 
        if (contextElement) { 
            // Get an array of all elements within the contextElement 
            // The * wildcard value returns all tags 
            allElements = contextElement.getElementsByTagName("*"); 
        } else { 
            // Get an array of all elements, if no contextElement was supplied 
            allElements = document.getElementsByTagName("*"); 
        } 
		
        var results = []; 
        for (var elementIndex = 0; elementIndex < allElements.length; elementIndex++) { 
            // Loop through every element found 
            var element = allElements[elementIndex]; 

            // If the element has the specified class, add that element to 
            // the output array 
            if ($.CSS.hasClass(element, className)) { 
                results.push(element); 
            } 
        } 

        // Return the list of elements that contain the specific CSS class name 
        return results; 
    } 
} 