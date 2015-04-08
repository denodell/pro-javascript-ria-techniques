// Define a new namespace within the $ library, called Remote, to store 
// our Ajax methods 

$.prototype.Remote = { 

    // The getConnector method returns the base object for performing 
    // dynamic browser-server communication through JavaScript 
	
    getConnector: function() { 
        var connectionObject = null; 
        if (window.XMLHttpRequest) { 
            // If the W3C-supported request object is available, use that 
            connectionObject = new XMLHttpRequest(); 
        } else if (window.ActiveXObject) { 
            // Otherwise, if the IE-proprietary object is available, use that 
            connectionObject = new ActiveXObject('Microsoft.XMLHTTP'); 
        } 
		
        // Both objects contain virtually identical properties and methods 
        // so it's just a case of returning the correct one that's supported 
        // within the current browser 
        return connectionObject; 
    }, 
	
    // The configureConnector method defines what should happen while the 
    // request is taking place, and ensures that a callback  method is executed 
    // when the response is successfully received from the server 
	
    configureConnector: function(connector, callback) { 
        // The readystatechange event fires at different points in the life cycle 
        // of the request, when loading starts, while it is continuing and 
        // again when it ends 
        connector.onreadystatechange = function() { 
		
            // If the current state of the request informs us that the 
            // current request has completed 
            if (connector.readyState == 4) { 
			
                // Ensure the HTTP status denotes successful download of content 
                if (connector.status == 200) { 
				
                    // Execute the callback method, passing it an object 
                    // literal containing two properties, the raw text of the
					// downloaded content and the same content in XML format, 
                    // if the content requested was able to be parsed as XML. 
                    // We also set its owner to be the connector in case this 
                    // object is required in the callback function 
					
                    callback.call(connector, { 
                        text: connector.responseText, 
                        xml: connector.responseXML 
                    }); 
                } 
            } 
        } 
    }, 
	
    // The load method takes an object literal containing a URL to load and a method 
    // to execute once the content has been downloaded from that URL. Since the 
    // Ajax technique is asynchronous, the rest of the code does not wait for the 
    // content to finish downloading before continuing, hence the need to pass in 
    // the method to execute once the content has downloaded in the background. 
	
    load: function(request) { 
        // Take the url from the request object literal input, 
        // or use an empty string value if it doesn't exist 
        var url = request.url || ""; 
		
        // Take the callback method from the request input object literal, 
        // or use an empty function if it is not supplied 
        var callback = request.callback || function() {}; 
		
        // Get our cross-browser connection object 
        var connector = this.getConnector(); 
		
        if (connector) { 
            // Configure the connector to execute the callback method once the 
            // content has been successfully downloaded 
            this.configureConnector(connector, callback); 
			
            // Now actually make the request for the contents found at the URL 
            connector.open("GET", url, true); 
            connector.send(""); 
        } 
    }, 
	
    // The save method performs an HTTP POST action, effectively sending content, 
    // such as a form's field values, to a server-side script for processing
	
	save: function(request) { 
        var url = request.url || ""; 
        var callback = request.callback || function() {}; 
		
        // The data variable is a string of URL-encoded name-value pairs to send to 
        // the server in the following format: 
        // "parameter1=value1&parameter2=value2&..." 
        var data = request.data || ""; 
		
        var connector = this.getConnector(); 
        if (connector) { 
            this.configureConnector(connector, callback); 
			
            // Now actually send the data to script found at the URL 
            connector.open("POST", url, true); 
             connector.setRequestHeader("Content-type", "application/x-www-form-urlencoded"); 
             connector.setRequestHeader("Content-length", data.length); 
            connector.setRequestHeader("Connection", "close"); 
            connector.send(data); 
        } 
    } 
} 

// Example usage 

// Instantiate the library as a singleton 
$ = new $(); 

// Load the contents of the URL index.html from the root of the web server 
$.Remote.load({ 
    url: "/index.html", 
    callback: function(response) { 
        // Get the plain text contents of the file 
        var text = response.text; 
		
        // If the HTML file was written in XHTML format, it would be available 
        // in XML format through the response.xml property 
        var xml = response.xml; 
		
        // Output the contents of the index.html file as plain text 
        alert(text); 
    } 
});

// Send some data to a server-side script at the URL process-form.php 
$.Remote.save({ 
    url: "/process.form.php", 
    data: "name=Den&surname=Odell", 
    callback: function(response) { 
        // Output the server-side script's response to the form submission 
        alert(response.text); 
    } 
}); 