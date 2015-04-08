var showSubject = function() { 
    // Output the subject property with the same owner as this function 
    alert(this.subject); 
} 

// Outputs "undefined" since the this keyword refers to the global window object 
// which has no variable named subject 
showSubject();

// Set the a global subject property 
this.subject = "Global subject"; 

// Outputs "Global subject" now that the property has been set 
showSubject(); 

// Define the EmailMessage class 
var EmailMessage = function(subject) { 
    this.subject = subject; 
} 

// Copy and assign the showSubject function to the EmailMessage class, 
// making the EmailMessage class the owner of the function. 
// Note the lack of braces after the function, which copies the code of the 
// function rather than executing it straight away 
EmailMessage.prototype.showSubject = showSubject; 

// Create a new instance of the class 
var myEmailMessage = new EmailMessage("I am the subject."); 

// Outputs "I am the subject.", since the owner of the function is the class 
myEmailMessage.showSubject(); 

// Outputs "Global subject" just to demonstrate that this has not been lost 
showSubject(); 

// Now let's add another method to the class, calling showSubject differently 
EmailMessage.prototype.outputSubject = function() { 
    showSubject(); 
} 

// Outputs "Global subject" since this method calls the function 
// that is associated with the window object 
myEmailMessage.outputSubject(); 