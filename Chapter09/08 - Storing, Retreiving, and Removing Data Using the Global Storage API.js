// Initialize GlobalStorage for use 
$.Storage.GlobalStorage.initialize(); 

// Save an email address 
$.Storage.GlobalStorage.set({ 
    name: "email", 
    value: "me@denodell.com" 
}); 

// Output the "email" value we created earlier. 
// After a browser restart, the data will still be there 
alert($.Storage.GlobalStorage.get("email"));
 
// Delete the "email" data value permanently 
$.Storage.GlobalStorage.remove("email"); 

// Outputs an empty string since the "email" data no longer exists 
alert($.Storage.GlobalStorage.get("email")); 