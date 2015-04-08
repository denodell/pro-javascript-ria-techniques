// Initialize the Flash shared object  by referencing the DOM element on the page 
// that contains the Flash storage file - you can find this file on my web site at 
// http://www.denodell.com/ 
$.Storage.Flash.initialize(document.getElementById("flash-object")); 

// Save an email address 
$.Storage.Flash.set({ 
    name: "email", 
    value: "me@denodell.com" 
}); 

// Output the "email" value we created earlier. 
// After a browser restart, the data will still be there 
alert($.Storage.Flash.get("email")); 

// Delete the "email" data value permanently 
$.Storage.Flash.remove("email"); 

// Outputs an empty string since the "email" data no longer exists 
alert($.Storage.Flash.get("email")); 