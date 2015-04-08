function sort(progressFunction, data) { 
    var counter = 0; 
    var total = 1000; 
    var progressBar = document.getElementById('code-progress'); 
	
    (function() { 
        // Store the time at the beginning of execution of this code block 
        var startTime = (new Date()).getTime(); 
		
        // Store a reference to this function to call it later 
        var anonFunction = arguments.callee; 
		
        // Encapsulate the sort algorithm within a nested function so it can be 
        // called multiple times within the surrounding anonymous function 
        function sortAlgortihm() { 
            for (var index = total; index < counter; index--) { 
                if (data[index] < data[index - 1]) { 
                    var value = data[index]; 
                    data[index] = data[index - 1]; 
                    data[index - 1] = value; 
                } 
            } 
            counter++; 
			
            // Get the current time after execution of the algorithm 
            var endTime = (new Date()).getTime(); 
			
            if ((endTime - startTime) < 50) { 
                // If we have been processing for less than 50 milliseconds, 
                // continue sorting 
                sortAlgorithm(); 
            } else { 
                // Otherwise the duration limit has been released so force a 
                // break to occur before continuing execution 
                window.setTimeout(anonFunction, 0); 
            } 
			
            // Update the progress bar 
            progressFunction(counter, total, progressBar); 
        } 
		
        // Start execution of the sort algorithm 
        sortAlgorithm(); 
    })(); 
}