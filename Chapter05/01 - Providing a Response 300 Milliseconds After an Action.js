$.onDomReady(function() { 
    // Outputs "Please wait..." if the Ajax request does not complete 
    // within 300 milliseconds 
	
    var visualFeedback = function() { 
        alert("Please wait..."); 
    }; 
	
    // Listen for the submit event on the first <form> tag on the current page 
    $.Events.add(document.getElementsByTagName("form")[0], "submit", function(e) { 
        // Stop the default form submission from occurring 
        e.preventDefault(); 
		
        // Execute the visualFeedback function after 300 milliseconds, storing a 
        // reference to the timer within a variable named reaction 
        var reaction = window.setTimeout(visualFeedback, 300); 
		
        // Save the form data to the server via Ajax 
        $.Remote.save({ 
            url:  "/save-form.php", 
            data: "...", // TODO: Real form data goes here 
            callback: function(response) { 
                // Terminate the execution of the visualFeedback function. If 300 
                // milliseconds have not passed, it will not have been executed. If 
                // they have, it will have executed already, providing feedback to 
                // the end user 
                window.clearTimer(reaction); 
				
                // TODO: Perform actions on the Ajax response 
            } 
        }); 
    }); 
});