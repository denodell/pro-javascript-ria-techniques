var EmailMessage = function(subject) { 
    this.subject = subject; 
    this.send = function() { 
        alert("Email message sent!"); 
    } 
} 

// Inherit EventInvitation class from EmailMessage 
var EventInvitation = function() {}; 
EventInvitation.prototype = new EmailMessage("You are cordially invited to..."); 
EventInvitation.prototype.constructor = EventInvitation; 

// Override the inherited send method 
EventInvitation.prototype.send = function() { 
    alert("Event invitation sent!"); 
} 

var myEmailMessage = new EmailMessage("A new email coming your way."); 
var myEventInvitation = new EventInvitation(); 

myEmailMessage.send(); // Outputs "Email message sent!" 
myEventInvitation.send(); // Outputs "Event invitation sent!"