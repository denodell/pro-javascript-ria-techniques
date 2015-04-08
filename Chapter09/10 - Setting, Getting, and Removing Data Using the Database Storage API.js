// Initialize the client-side database 
$.Storage.DBStorage.initialize(); 

// Save an email address 
$.Storage.DBStorage.set({ 
    name: "email", 
    value: "me@denodell.com" 
}); 

// Output the "email" value we created earlier. 
// After a browser restart, the data will still be there 
$.Storage.DBStorage.get("email", function(value) { 
    alert(value); 
}); 

// Delete the "email" data value permanently 
$.Storage.DBStorage.remove("email"); 

// Outputs an empty string since the "email" data no longer exists 
$.Storage.DBStorage.get("email", function(value) { 
    alert(value); 
});