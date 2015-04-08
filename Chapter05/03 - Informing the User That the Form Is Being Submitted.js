$.onDomReady(function() { 
    // Listen for the submit event to fire within the page - this can only 
    // occur on <form> tags 
	
    $.Events.add(document.getElementsByTagName("form")[0], "submit", function(e) { 
	
        // Locate the submit button within the current form, 
        // which should have a class of  submit-button assigned to it 
        var buttons = $.Elements.getElementsByClassName("submit-button", e.target); 
		
        // Code defensively 
        if (buttons.length > 0) { 
		
            // Disable the submit button so it cannot be submitted twice. This 
            // visually grays out the button 
            buttons[0].disabled = "disabled"; 
			
            // Set the submit button text to reflect that fact that the form is 
            // now being submitted 
            buttons[0].value = "Saving..."; 
        } 
    }); 
}); 