function myLongRoutine(progressFunction [, other arguments]) { 
    // Initialize the routine's data variables here 
    // The following anonymous function represents a single set of 
    // operations on the data 
    (function () { 
        // Process or operate on the data here
		if (still data left to process) { 
            // If there is still data left to process, execute the progressFunction 
            // passing it the current value and total, allowing it to present this 
            // information to the end user as, for example, a progress bar 
            progressFunction(currentValue, total); 
            // Execute the next set of operations on the data after a brief 
            // pause to enable the browser to remain responsive. A value of 0 
            // milliseconds is used, which ensures the briefest possible pause 
            // allowed within the browser before the next operation begins. 
            // arguments.callee represents the anonymous function 
            window.setTimeout(arguments.callee, 0); 
        } 
    })(); // Begin executing the anonymous function immediately 
} 