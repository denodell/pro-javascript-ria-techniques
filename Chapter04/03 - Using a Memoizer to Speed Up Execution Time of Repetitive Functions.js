// memoize expects a function as an input and returns the same function 
// with storage capabilities added 

$.prototype.Utils.memoize = function(func) { 
    return function() { 
        // Add a memory object property to this function, if it does not exist 
        func.memory = func.memory || {}; 
		
        // Create a key to use to store and retrieve function results within 
        // the memory object property. The key should be based on a combination 
        // of all the arguments passed to the function to ensure it is unique based 
        // on all combinations of inputs 
        arguments.join = Array.prototype.join;
        var key = arguments.join("|"); 
		
        // Does the key exist in the memory object? 
        if (key in func.memory) { 
            // If it does, then return the associated value to avoid recomputation 
            return func.memory[key];
		} else { 
            // If it doesn't, execute the associated function then save the result 
            // to the memory object 
            func.memory[key] = func.apply(this, arguments); 
			
            // Return the newly saved value, the result of the function's execution 
            return func.memory[key]; 
        } 
    } 
}; 

// Example usage 
// Assuming an instance of the $ library exists on the page 

// Write a function that computes the factorial of a given number 
// - execute it 99999 times to exaggerate the effect of a slow-running function 
var computeFactorial = function(input) { 
    var result; 
    for (var count = 0; count < 99999; count++) { 
        result = 1; 
        for (var num = 2; num <= input; num++) { 
            result *= num; 
        } 
    } 
    return result; 
} 

// Add memoize capability to the factorial function 
computeFactorial = $.Utils.memoize(computeFactorial); 

// Measure the speed of the factorial function's execution 
computeFactorial(100); // Execution takes ~945 milliseconds 
computeFactorial(50); // Execution takes ~506 milliseconds 
computeFactorial(100); // Execution takes 0-1 milliseconds - using stored value 
computeFactorial(50); // Execution takes 0-1 milliseconds - using stored value 