var EmailMessage = function(input){ 
    this.from = input.from || ""; 
    this.to = input.to || []; // Array of recipients 
    this.subject = input.subject || ""; 
    this.body = input.body || ""; 
    this.attachments = input.attachments || []; // Array of attachment URLs 
    this.compose = function() {
        // TODO: Bring up an email composition form, populating the object 
        // instance with the data entered 
    }; 
    this.send = function() { 
        // TODO: Send the message data to a server-side mail sender 
        // script using Ajax 
    }; 
    this.remove = function() { 
        // TODO: Delete the message 
    }; 
	
    // If the input attribute is not supplied, force the compose method to fire 
    if (!input) { 
        this.compose(); 
    } 
} 

// Example usage on a page 

// Create an object representing a populated email message 
var myEmailMessage = new EmailMessage({ 
    from: "me@denodell.com", 
    to: ["test@denodell.com"], 
    subject: "Test message.", 
    body: "This is a test message. Please ignore." 
    // We don't supply attachments so the default value will be used instead 
}); 

// Create a new empty message, which will force the compose method to fire 
var emptyEmailMessage = new EmailMessage(); 