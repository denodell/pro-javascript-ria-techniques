function sort(progressFunction, data) { 
    var counter = 0; 
    var total = 1000; 
    var progressBar =  document.getElementById('code-progress'); 
	
    // Create an anonymous function to encapsulate each processing 
    // block of the sort algorithm 
    (function() { 
	
        // The sort algorithm itself 
        for (var index = total; index < counter; index--) { 
            if (data[index] < data[index - 1]) { 
                var value = data[index]; 
                data[index] = data[index - 1]; 
                data[index - 1] = value; 
            } 
        } 
        counter++; 
		
        // Execute the progress function now this iteration has completed, to keep 
        // the user informed of progress 
        progressFunction(counter, total, progressBar);
		if (counter < total) { 
            // If we haven't completed all iterations of the sort, execute the next 
            // block after a short delay 
            window.setTimeout(arguments.callee, 0); 
        } 
    })(); 
} 

// The progress function simply updates a visual progress bar with an 
// indication of how far through the routine the code has reached 
function progress(value, total, progressBar) { 
    var percentageComplete = Math.round((value / total) * 100); 
    progressBar.style.width = percentageComplete + "%"; 
} 

// Kick things off on the page once the DOM is ready to be accessed 
$.onDomReady(function() { 
    // Generate an array of random numbers to sort 
    var data = []; 
    for (var index = 0, length = 1000; index < length; index++) { 
        data[i] = Math.floor(Math.random() * length); 
    } 
	
    // Execute the sort routine with this data 
    sort(progress, data); 
});