$.prototype.Events.add =  function (element, eventType, callback) {
    var self = this; 
    eventType = eventType.toLowerCase();

    if (element.addEventListener) {

        // If the W3C-standard addEventListener method is supported, then associate 
        // the event as normal - the final parameter of the method is set to true if the 
        // event type is either focus or blur
        element.addEventListener(eventType, function(e){
            callback(self.standardize(e));
        }, (eventType == "focus" || eventType == "blur"));

    } else if (element.attachEvent) {	

        // Detect the event type and switch behavior for focus and blur event types to 
        // use the IE-proprietary focusin and focusout event types in their place
        switch (eventType) {
            case "focus":
                element.onfocusin = function(){
                    callback(self.standardize(window.event));
                }
                break;
            case "blur":
                element.onfocusout = function(){
                    callback(self.standardize(window.event));
                }
                break;
            default:
                element.attachEvent("on" + eventType, function(){
                    callback(self.standardize(window.event));
                });
                break;
        }
    }
}