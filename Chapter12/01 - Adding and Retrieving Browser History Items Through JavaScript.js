// Create a History namespace for managing browser history items
// within our RIAs
$.prototype.History = {

    // The currentValue property holds the current hash value from the URL,
    // which is found via the global location.hash property. This property
    // value contains the # character, so we remove this as it is not needed
    currentValue: location.hash.replace(/#/g, ""),

    // To overcome an issue in Internet Explorer’s history handling, we need to
    // add and read back our history items from an <iframe> tag on the page in
    // that browser. Here, we maintain a reference to that element, which we
    // define later
    iframe: null,

    // We will want to perform some action when the user clicks the Back
    // and Forward buttons in their browser and the current history item
    // changes. The onChange method will be called when this change occurs
    onChange: function() {},
    
    // The enable method starts listening for changes occurring to the current 
    // hash portion of the URL and hence the browser’s history item list itself
    enable: function() {

        // Internet Explorer behaves differently from the other browsers, so we 
        // need to create an <iframe> to contain the changes to the hash
        if (window.ActiveXObject) {

            // Create a hidden <iframe> and add it to the page
            this.iframe = $.Elements.create("iframe");
            this.iframe.style.display = "none";
            this.iframe.src = "javascript:false;";
            document.body.appendChild(this.iframe);

            // Initialize the <iframe> with a history item to start with. The add
            // method is defined later
            this.add(this.currentValue);
        }
        
        var self = this;
        
        // The detectHistoryChange function detects when the current hash value 
        // differs the last and executes the onChange method when it does
        var detectHistoryChange = function() {

            // Get the last saved and latest hash values
            var lastValue = self.currentValue;
            var latestValue = location.hash.replace(/#/g, "");
            
            // Get the hash slightly different in Internet Explorer
            if (self.iframe) {
                var latestValue = ~CCC
                    self.iframe.contentWindow.document.location.hash.replace(/#/g, "");
            } 
            
            // If the latest and last hash values differ, save the new value and call
            // the onChange property, passing it the latest and previous hash values
            if (latestValue != lastValue) {
                self.currentValue = latestValue;
                self.onChange(latestValue, lastValue);
            }
        }

        // Execute the detectHistoryChange function once every 300 milliseconds - 
        // see Chapter 5 for the importance of this number - and begin listening for 
        // changes occuring to the hash value
        window.setInterval(detectHistoryChange, 300);
    },

    // The add method takes a specified text string value and adds it to the URL 
    // hash, creating a new browser history item with that value
    add: function(newValue) {
        if (this.iframe) {
            // Add the hash to Internet Explorer’s <iframe> tag
            var iframeDocument = this.iframe.contentWindow.document;
            iframeDocument.open();
            iframeDocument.close();
            iframeDocument.location.hash = newValue;
        } else {
            // All other browser’s can access the hash property of the current page
            location.hash = newValue;
        }
    }
}