var User = function() { 
    this.username = ""; 
    this.password = ""; 
    this.login = function() { 
        return true; 
    } 
} 

// Create an instance of the User class, storing it in the same variable used to 
// define the class initially. The original class has now been removed from the 
// code, leaving only the single object instance of it 
User = new User(); 

// Example method call on the single instance of User 
User.login(); 

// Example of a  self-instantiating class 
var Inbox = new function() { 
    this.messageCount = 0; 
    this.refresh = function() { 
        return true; 
    } 
}(); 

// The new keyword and braces force the function to immediately execute, 
// meaning the Inbox variable now contains the single object instance, 
// not the class 

// Example method call on the single instance of Inbox 
Inbox.refresh(); 