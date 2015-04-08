var WebMail = new function() { 
    this.folders = []; 
    this.loadFolders = function() { 
        // TODO: Load list of folders via Ajax from the server and populate Folder 
        // object instances from this information 
    }; 
    this.loadMessagesIntoFolders = function() { 
        // TODO: Load list of messages via Ajax from the server, create EmailMessage 
        // object instances and populate the folder instances with these messages 
    }; 
	
    // Initialize the data, loading messages into folders, ready for use 
    this.folders = this.loadFolders(); 
    this.loadMessagesIntoFolders();
	 
	// Initialize the user interface. When the user clicks the create-mail-button 
    // element, a new EmailMessage is created, which launches the new mail 
    // composition form automatically 
     $.Events.add(document.getElementById("create-mail-button"), "click", function() { 
        new EmailMessage(); 
    }); 
}(); 
