// Define the CSS namespace within the $ library to store style-related methods 

$.prototype.CSS = { 

    // The getAppliedStyle method returns the current value of a specific 
    // CSS style property on a particular element 

    getAppliedStyle: function(element, styleName) { 
        var style = ""; 
        if (window.getComputedStyle) { 
            //  W3C-specific method. Expects a style property with hyphens 
            style = element.ownerDocument.defaultView.getComputedStyle(element, null).getPropertyValue($.Utils.toHyphens(styleName)); 
        } else if (element.currentStyle) { 
            // Internet Explorer-specific method. Expects style property names 
            // in camel case 
            style = element.currentStyle[$.Utils.toCamelCase(styleName)]; 
        }
		
		// Return the value of the style property found 
        return style; 
    }, 
	
    // The getArrayOfClassNames method is a utility method which returns an 
    // array of all the CSS class names assigned to a particular element. 
    // Multiple class names are separated by a space character 
    
	getArrayOfClassNames: function(element) { 
        var classNames = []; 
        if (element.className) { 
            // If the element has a CSS class specified, create an array 
            classNames = element.className.split(' '); 
        } 
        return classNames; 
    }, 
    
	// The addClass method adds a new CSS class of a given name to a 
    // particular element 
    
	addClass: function(element, className) { 
        // Get a list of the current CSS class names applied to the element 
        var classNames = this.getArrayOfClassNames(element); 
    
	    // Add the new class name to the list 
        classNames.push(className); 
        
		// Convert the list in space-separated string and assign to the element 
        element.className = classNames.join(' '); 
    }, 
	
    // The removeClass method removes a given CSS class name from 
    // a given element 
    
	removeClass: function(element, className) { 
        var classNames = this.getArrayOfClassNames(element); 
    
	    // Create a new array for storing all the final CSS class names in 
        var resultingClassNames = []; 
    
	    for (var index = 0; index < classNames.length; index++) { 
            // Loop through every class name in the list 
            if (className != classNames[index]) { 
                // Add the class name to the new list if it isn't the one specified 
                resultingClassNames.push(classNames[index]); 
            } 
        }
		
		// Convert the new list into a  space-separated string and assign it 
        element.className = resultingClassNames.join(" "); 
    }, 
	
    // The hasClass method returns true if a given class name exists on a 
    // specific element, false otherwise 
	
    hasClass: function(element, className) { 
        // Assume by default that the class name is not applied to the element 
        var isClassNamePresent = false; 
		
        var classNames = this.getArrayOfClassNames(element); 
        for (var index = 0; index < classNames.length; index++) { 
            // Loop through each CSS class name applied to this element 
            if (className == classNames[index]) { 
                // If the specific class name is found, set the return value to true 
                isClassNamePresent = true; 
            } 
        } 
		
        // Return true or false, depending on if the specified class name was found 
        return isClassNamePresent; 
    }, 
	
    // The getPosition method returns the x and y coordinates of the  top-left 
    // position of a page element within the current page, along with the 
    // current width and height of that element 
	
    getPosition: function(element) { 
        var x = 0,
            y = 0,
            width = element.offsetWidth || 0,
            height = element.offsetHeight || 0; 
		
        if (element.offsetParent) { 
            // The offsetLeft and offsetTop properties get the position of the 
            // element with respect to its parent node. To get the position with 
            // respect to the page itself, we need to go up the tree, adding the 
            // offsets together each time until we reach the node at the top of 
            // the document, by which point, we'll have coordinates for the 
            // position of the element in the page 
            do { 
                x += element.offsetLeft; 
                y += element.offsetTop; 
				
               // Deliberately using = to force the loop to execute on the next 
               // parent node in the page hierarchy 
            } while (element = element.offsetParent) 
        }
		
		// Return an object literal with the x and y coordinates of the element, 
        // along with the actual width and height of the element 
        return { 
            x: x, 
            y: y, 
            height: height, 
            width: width 
        } 
    } 
}; 

// Example usage on a page 

// Instantiate the library as a singleton 
$ = new $(); 

// Locate the first <hr> element within the page 
var horizontalRule = document.getElementsByTagName("hr")[0]; 

// Output the current width of the <hr> element 
alert($.CSS.getAppliedStyle(horizontalRule, "width")); 

// Add the hide CSS class to the <hr> element 
$.CSS.addClass(horizontalRule, "hide"); 

// Remove the hide CSS class from the <hr> element 
$.CSS.removeClass(horizontalRule, "hide"); 

// Outputs true if the hide CSS class exists on the <hr> element 
alert($.CSS.hasClass(horizontalRule, "hide")); 

// Outputs the x and y coordinates of the <hr> element 
var position = $.CSS.getPosition(horizontalRule) 
alert("The element is at 'x' position '" + position.x + "' and 'y' position '" + position.y + "'. It also has a width of '" + position.width + "' and a height of '" + position.height + "'");