$.prototype.Elements.create = function(tagName) { 
    // This method utilizes the memoizer technique 
    this.memory = this.memory || {}; 
    if (tagName in this.memory) { 
        // If we have stored an element of this tag name already, duplicate it 
        return this.memory[tagName].cloneNode(true); 
    } else { 
        // Create a new element of the tag name and store it 
        this.memory[tagName] = document.createElement(tagName); 
        return this.memory[tagName].cloneNode(true); 
    } 
}; 

// Example usage 
// Assuming an instance of the $ library exists on the page 

// Create two elements from scratch 
var newH2Tag = $.Elements.create("h2"); 
var newPTag = $.Elements.create("p"); 

// Create another element of the same type as one already created. 
// Duplicates the stored element, boosting performance over creating 
// the element from scratch again 
var anotherH2Tag = $.Elements.create("h2"); // Uses a duplicate