var EmailMessage = function(subject) { 
    this.subject = subject; 
} 

// We wish to be able to extend this method later, 
// so it must be declared using the prototype keyword 
EmailMessage.prototype.send = function() { 
    alert("Email message sent!"); 
}

// Inherit EventInvitation class from EmailMessage 
var EventInvitation = function() {}; 
EventInvitation.prototype = new EmailMessage("You are cordially invited to..."); 
EventInvitation.constructor.prototype = EventInvitation; 

// Override the inherited send method 
EventInvitation.prototype.send = function() { 
    // Add code to the EventInvitation send method 
    alert("Event invitation sent!"); 
	
    // Find and execute the send method from the EmailMessage class 
    // this.constructor.prototype refers to the EmailMessage class 
    this.constructor.prototype.send.call(this); 
} 

var myEmailMessage = new EmailMessage("A new email coming your way."); 
var myEventInvitation = new EventInvitation(); 

// Outputs "Email message sent!" 
myEmailMessage.send(); 

// Outputs "Event invitation sent!" followed by "Email message sent!" 
myEventInvitation.send(); 