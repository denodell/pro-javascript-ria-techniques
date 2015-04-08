// Initialize the userData store 
$.Storage.UserData.initialize(); 

// Save an email address to the data store 
$.Storage.UserData.set({ 
    name: "email", 
    value: "me@denodell.com" 
}); 

// Output the "email" value we created earlier. 
// After a browser restart, the data will still be there 
alert($.Storage.UserData.get("email")); 

// Delete the "email" data value permanently from the data store 
$.Storage.UserData.remove("email"); 

// Outputs an empty string since the data no longer exists 
alert($.Storage.UserData.get("email"));