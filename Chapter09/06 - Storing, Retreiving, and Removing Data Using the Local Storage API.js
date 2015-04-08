// Save an email address 
$.Storage.LocalStorage.set({ 
    name: "email", 
    value: "me@denodell.com" 
}); 

// Output the "email" value we saved earlier. 
// After a browser restart, the data will still be there 
alert($.Storage.LocalStorage.get("email")); 

// Delete the "email" data value permanently 
$.Storage.LocalStorage.remove("email"); 

// Outputs an empty string since the "email" data no longer exists 
alert($.Storage.LocalStorage.get("email")); 
