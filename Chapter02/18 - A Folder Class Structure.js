var Folder = function(input) { 
    this.name = input.name || ""; 
    this.folders = input.folders || []; // Array of instances of the Folder class 
    this.messages = input.messages || []; // Array of EmailMessage instances 
    this.addMessage(message) = function(){
        this.messages.push(message); 
    },
	this.removeMessage(message) = function() { 
        // TODO: Remove the message from the folder 
    },
    this.listMessages = function() { 
        // TODO: Display a list of the messages in this folder 
    } 
}

// Example usage on a page 

// Create a new Inbox folder 
var inbox = new Folder({ 
    name: "Inbox" 
}); 

// Create a new message 
var myEmailMessage = new EmailMessage({ 
    from: "me@denodell.com", 
    to: ["test@denodell.com"], 
    subject: "Test message.", 
    body: "This is a test message. Please ignore." 
}); 

// Add the new message to the inbox folder 
inbox.addMessage(myEmailMessage); 