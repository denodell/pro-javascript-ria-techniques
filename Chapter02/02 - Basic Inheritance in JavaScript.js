var EmailMessage = function(subject) { 
    this.subject = subject; 
    this.send = function() { 
        alert("Message '" + this.subject + "' sent!"); 
    } 
} 

// Create a new, empty class 
var EventInvitation = function() {}; 

// Inherit properties and methods from the EmailMessage class 
EventInvitation.prototype = new EmailMessage(); 

// EventInvitation thinks it is the EmailMessage class, so correct this... 
EventInvitation.prototype.constructor = EventInvitation; 

// Define the subject for all instances of the EventInvitation class 
EventInvitation.prototype.subject = "You are cordially invited to..."; 

// Create an instance of the EventInvitation class 
var myEventInvitation = new EventInvitation(); 

// Outputs "Message 'You are cordially invited to...' sent!" 
myEventInvitation.send();