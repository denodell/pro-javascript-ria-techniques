// Using multiple arguments in a specific order 
var sendEmail = function(to, from, subject, body) { 
    alert("Message '" + subject + "' from '" + from + "' sent to '" + to + "'!"); 
} 
// Arguments must be in the correct order when calling the function. 
// Outputs "Message 'Dinner this week?' from 'me@denodell.com' sent to 
// 'you@denodell.com'!" 
sendEmail("you@denodell.com", "me@denodell.com", "Dinner this week?", "Do you want to come over for dinner this week? Let me know."); 
	
// Same function, but a single object literal argument containing named properties 
var sendEmail = function(message) { 
    alert("Message '" + message.subject + "' from '" + message.from + "' sent to '" + message.to + "'!"); 
}

// One object literal argument with named property values in no specific order 
// Outputs "Message 'Dinner this week?' from 'me@denodell.com" sent to 
// 'you@denodell.com'!" 
sendEmail({ 
    from: 'me@denodell.com', 
    to: 'you@denodell.com', 
    subject: 'Dinner this week?', 
    body: 'Do you want to come over for dinner this week? Let me know.' 
}); 