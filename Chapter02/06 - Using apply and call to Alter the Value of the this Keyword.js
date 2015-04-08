var showSubject = function() { 
    alert(this.subject); 
}

var setSubjectAndFrom = function(subject, from) { 
    this.subject = subject; 
    this.from = from; 
} 

// Executed against the global window object 
showSubject(); // Outputs "undefined" 
setSubjectAndFrom("Global subject", "me@denodell.com"); 
showSubject(); // Outputs "Global subject" 

// Create EmailMessage class 
var EmailMessage = function() { 
    this.subject = ""; 
    this.from = ""; 
}; 

// Instantiate class 
var myEmailMessage = new EmailMessage(); 

// Execute setSubjectAndFrom function, forcing the this keyword within the function 
// to refer to myEmailMessage instead of the window object. Parameters are 
// passed in series after the object to apply as the owner, setting the subject to 
// "New subject" and the from property to "den@denodell.com" 
setSubjectAndFrom.call(myEmailMessage, "New subject", "den@denodell.com"); 

// As a demonstration, we will do the same thing now using apply instead of call; 
// apply expects an array of arguments, unlike call. 
// You can use either apply or call in your code 
setSubjectAndFrom.apply(myEmailMessage, [ "New subject", "den@denodell.com" ]); 

// Outputs "New subject" 
showSubject.call(myEmailMessage); 