// The loadBinary method loads a binary file from a specified URL and executes a 
// callback function, passing it the returned raw binary data. If an optional length 
// parameter is specified, only a portion of the file is downloaded, up to the 
// number of bytes specified in that parameter
$.prototype.Remote.loadBinary = function(request){
    var url = request.url || "";
    var length = request.length || -1;
    var callback = request.callback || function(){};
    
    // The this keyword here refers to the Remote namespace 
    var self = this;
    
    if (length > -1) {
        // If a data length has been specified, meaning that only part of 
        // the file should be downloaded, perform an HTTP HEAD request, 
        // which returns only the HTTP Response headers 
        self.load({
            url: url,
            type: "HEAD",
            callback: function(){
            
                // Create a new Ajax connector object and open 
                // the connection 
                var connector = self.getConnector();
                connector.open("GET", url, true);
                
                // Find out if the web server supports the HTTP Range header 
                // by testing the value of the HTTP Accept-Ranges 
                // response header 
                if (this.getResponseHeader("Accept-Ranges") == "bytes") {
                
                    // If the web server supports the selection of ranges of 
                    // data, check that the length specified does not 
                    // exceed the length of all the data in the file 
                    var fileLength = this.getResponseHeader("Content-Length");
                    if (length > parseInt(fileLength, 10)) {
                        length = parseInt(fileLength, 10);
                    }
                    
                    // Configure the new connector so that it specifies the 
                    // length of data to retrieve from the file. This data 
                    // is then passed to the callback function 
                    self.configureBinaryConnector({
                        connector: connector,
                        length: length,
                        callback: callback
                    });
                } else {
					
                    // The web server does not support the selection of 
                    // ranges of data, so we'll leave out specifying a 
                    // length when we configure the new connector, 
                    // so that all the data inside the file is passed to 
                    // the callback function 
                    self.configureBinaryConnector({
                        connector: connector,
                        callback: callback
                    });
                }
                
                // Make the request for the binary file using the settings 
                // configured in the new connector object 
                connector.send("");
            }
        });
    } else {
		
        // If no length has been specified, load the entire binary file and 
        // pass this to the callback function 
        var connector = this.getConnector();
        connector.open("GET", url, true);
        this.configureBinaryConnector({
            connector: connector,
            callback: callback
        });
        connector.send("");
    }
}