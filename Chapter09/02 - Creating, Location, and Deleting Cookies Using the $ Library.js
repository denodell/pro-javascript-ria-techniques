// Create a new cookie which will expire, by default, in 10 years 
$.Storage.Cookies.set({ 
    name: "email", 
    value: "me@denodell.com" 
}); 

// Output the value of the cookie named "email" we created earlier. 
// After a browser restart, the data will still be there 
alert($.Storage.Cookies.get("email")); 

// Delete the "email" cookie 
$.Storage.Cookies.remove("email"); 

// Outputs an empty string, since the cookie no longer exists 
alert($.Storage.Cookies.get("email")); 
