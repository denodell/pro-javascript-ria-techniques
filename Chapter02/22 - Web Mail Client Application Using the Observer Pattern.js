// We will inherit the Observer pattern later, bringing in the listen 
// and fire methods to the WebMail constructor 
var WebMail = function() { 

    // Define an object literal constant to represent the list of different 
    // events that are allowable within the application 
    this.EVENT = { 
        UI_READY: 0, 
        MESSAGES_LOADED: 1, 
        DELETE_MESSAGE: 2 
    } 
	
    // Define a code block called Data to house all data storage and manipulation 
    // properties and methods. This block does not know about any others, it is 
    // only aware of the list of EVENTs and listen and fire events of the WebMail 
    // application, which is passed into the code block as the app input variable, 
    var Data = new function(app) {
		var EmailMessage = function(){ 
            // TODO: define EmailMessage class 
        }; 
        var Folder = function(){ 
            // TODO: define Folder class 
        }; 
		
        // Execute the attached function when the UI_READY event is fired 
        app.listen(app.EVENT.UI_READY, function() { 
		
            // TODO: Insert code to load messages from the server via Ajax 
            // into the messages variable 
            var messages = []; 
			
            // Inform any code block listening to the MESSAGES_LOADED event 
            // that the messages have been loaded from the server, passing 
            // across the list of messages also 
            app.fire(app.EVENT.MESSAGES_LOADED, messages); 
        }); 
		
        // Execute the function when the DELETE_MESSAGE event is fired 
        app.listen(app.EVENT.DELETE_MESSAGE, function(messageId) { 
            // TODO: Insert code to actually delete message 
        });
    // This self-instantiation makes the app variable equal to the 
    // this keyword value, which is WebMail itself 
    }(this); 
	
    // Define a code block called UserInterface to house all user interface-
    // related properties and methods. This block is agnostic of all others and 
    // knows only about the events being fired around the application 
    var UserInterface = new function(app) { 
        // TODO: Build user interface components within the browser 
		
         $.Events.add(document.getElementById("delete-button"), "click", function(e) { 
            // Stop the default action of the delete button within HTML 
            e.preventDefault(); 
			
            // TODO: Establish the real id of the message being deleted 
            var messageId = 0; 
			
            // Inform any code block listening for the DELETE_MESSAGE event that 
            // a message with the given message ID needs to be deleted 
            app.fire(app.EVENT.DELETE_MESSAGE, messageId); 
        });
		
		app.listen(app.EVENT.MESSAGES_READY, function (messages) { 
            // TODO: Display the messages passed in from the event 
        }); 
		
        // Inform any code block listening that the UI has been constructed 
        // and is ready for use 
        app.fire(app.EVENT.UI_READY); 
    }(this); //  Self-instantiate, as we did with Data previously 
} 

// Inherit the Observer pattern, adopting its listen and fire events 
WebMail.prototype = new $.Observer(); 

// Create the WebMail application as a singleton, executing the code within 
WebMail = new WebMail(); 