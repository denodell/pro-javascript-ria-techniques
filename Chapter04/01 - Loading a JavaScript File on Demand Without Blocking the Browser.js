$.prototype.Remote.loadScript = function(fileName, callback) { 
    var scriptTag = document.createElement("script"); 
    scriptTag.src = fileName; 
	
    if (callback) { 
        scriptTag.onload = callback; 
        scriptTag.onreadystatechange = function() { 
            if (scriptTag.readyState == 4) { 
                callback(); 
            } 
        } 
    } 
	
    document.getElementsByTagName("head")[0].appendChild(scriptTag); 
} 

// Example usage 
// Assuming an instance of the $ library exists on the page 

// Loads  my-script.js, then outputs "script loaded and available" when complete 
$.Remote.loadScript("my-script.js", function() { 
    alert("script loaded and available!"); 
}); 