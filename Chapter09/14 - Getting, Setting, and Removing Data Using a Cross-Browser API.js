// Execute the code that makes the decision about which of the various techniques 
// to use within the current browser. In this case, no parameter is supplied to the 
// initialize method, which means that Flash will not be used to store data 
$.Storage.initialize(); 

// Save an email address using whichever technique was selected previously 
$.Storage.set({ 
    name: "email", 
    value: "me@denodell.com" 
}); 

// Output the "email" value we saved earlier. 
// After a browser restart, the data will still be there 
$.Storage.get("email", function(value) { 
    alert(value); 
}); 

// Delete the "email" data value permanently 
$.Storage.remove("email");

// Outputs an empty string since the "email" data no longer exists 
$.Storage.get("email", function(value) { 
    alert(value); 
});