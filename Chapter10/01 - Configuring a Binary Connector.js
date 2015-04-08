// The method configureBinaryConnector takes three input parameters: 
// - A  cross-browser Ajax connector object 
// - An optional length to specify how much data the server should 
//       return, in bytes 
// - A callback function to pass the downloaded binary data to 

$.prototype.Remote.configureBinaryConnector = function(input) { 
    // Create fallback values for each of the inputs in case they are not specified 
    var connector = input.connector || this.getConnector(); 
    var length = input.length || -1; 
    var callback = input.callback || function() {}; 
	
    // By default, Firefox will attempt to convert the binary data received into a 
    // different format if it is of a known type. We will force Firefox to believe 
    // the data is of an unknown type, so it does not perform any conversion on the 
    // raw binary data returned by the server
	if (connector.overrideMimeType) { 
        connector.overrideMimeType("text/plain; charset=x-user-defined"); 
    } 
	
    // If a length has been specified, set the HTTP Range request header to return 
    // only the specified amount of data from the start of the file - otherwise we 
    // would have to download the entire file, which would slow down any 
    // processing we wish to perform upon it 
    if (length > -1) { 
        connector.setRequestHeader("Range", "bytes=0-" + length); 
    } 
    
    // Internet Explorer returns the binary data in the connector.responseBody 
    // property. Other browsers return it in the connector.responseText property 
    if (typeof connector.onload != "undefined") { 
	
        // The connector.onload event handler exists within the W3C XmlHttpRequest 
        // object but not Microsoft's XMLHTTP ActiveX object. 
        connector.onload = function(){ 
		
            // HTTP status 200 means the file downloaded successfully in its 
            // entirety, and 206 means that the portion of the file specified with 
            // the HTTP Range request header was returned successfully 
            if (connector.status == 200 || connector.status == 206) { 
			
                // In those browsers that support connector.onload, the binary data 
                // from the file is returned in connector.responseText 
                var binaryData = connector.responseText; 
				
                // Wrap the data in a BinaryReader object, which we will define, 
                // later, which will expose methods and properties for interacting 
                // with the data within the binary file. 
                // The this keyword refers to $.Remote 
                var binaryReader = new this.BinaryReader(binaryData); 
				
                // Execute the callback function passed into this routine, passing 
                // it the new binaryReader object as a parameter 
                callback(binaryReader); 
            } 
        } 
    } else { 
	
        // The connector.onload event handler does not exist, so this should be 
        // Internet Explorer - we'll use the cross-browser Ajax onreadystatechange 
        // event handler instead in this case
		connector.onreadystatechange = function() { 
            if (connector.readyState == 4) { 
                if (connector.status == 200 || connector.status == 206) { 
				
                    // The file, or part of the file requested, was returned. 
                    // successfully. The binary data in Internet Explorer is 
                    // returned in the connector.responseBody property 
                    var binaryData = connector.responseBody; 
					
                    // Create a new instance of the BinaryReader constructor, 
                    // defined later, which will allow chunks of data to be looked 
                    // up from within the binary file as a whole. 
                    // The this keyword refers to $.Remote 
                    var binaryReader = new this.BinaryReader(binaryData); 
					
                    // Execute the callback function passed into the routine, 
                    // passing it the binaryReader object instance to allow the 
                    // callback to access the data within the file 
                    callback(binaryData); 
                } 
            } 
        } 
    } 
} 