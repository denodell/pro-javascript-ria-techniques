var EmailMessage = function(subject) { 
    // Publically accessible properties and methods 
    this.subject = subject; 
    this.send = function() { 
        alert("Message sent!"); 
    } 
	
    // Private properties and methods. 
    // Use of var instead of the this keyword to set a property means that the 
    // scope of that variable is restricted to the function it sits inside of and is 
    // not accessible externally 
    var messageHeaders = ""; 
    var addEncryption = function() { 
        // TODO: Add encryption method 
        return true; 
    } 
	
    // Protecting a property, making it  read-only from outside of the class 
    // achieved by creating a private property and a public method 
    var messageSize = 1024; 
    this.getMessageSize = function() { 
        alert(messageSize); 
    } 
} 

var myEmailMessage = new EmailMessage("Save these dates..."); 

alert(myEmailMessage.subject); // Outputs "Save these dates..." 
myEmailMessage.send(); // Outputs "Message sent!" 

// Outputs "undefined" as messageHeaders is not a publically visible property 
alert(myEmailMessage.messageHeaders); 

// Causes an exception to occur since the method does not exist 
try { 
    myEmailMessage.addEncryption(); 
} catch (e) { 
    alert("Method does not exist publically!"); 
}

// Outputs "undefined" since messageSize is not accessible outside of the class 
alert(myEmailMessage.messageSize); 

// Outputs "1024", the value of the private messageSize variable 
myEmailMessage.getMessageSize();