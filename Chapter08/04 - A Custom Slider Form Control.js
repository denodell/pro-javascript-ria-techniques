// We start by declaring the Slider class which represents the slider control, as we 
// did with the Calendar control, previously 

var Slider = function(options) {
	
	// Declare the event types that define the slider's behavior 
    this.eventType = { 
	
        // The INITIALIZE event kicks everything off and is fired after all the code 
        // blocks are instantiated 
        INITIALIZE: 0, 
		
        // The READY event is fired when the data has been initialized and is ready 
        // to be rendered to the page 
        READY: 1, 
		
        // The HTML_RENDERED event is fired once the control has been 
        // rendered to the page 
        HTML_RENDERED: 2, 
		
        // The HANDLE_MOVED event is fired when the user has dragged 
        // the control's handle 
        HANDLE_MOVED: 3, 
		
        // The VALUE_CHANGED event is fired when the slider's value has been altered 
        VALUE_CHANGED: 4, 
		
        // The MOVE event is fired when the code wishes to update the position of 
        // the slider to represent a new value 
        MOVE: 5 
    } 
	
    // The initialize self-instantiating function instantiates the two code blocks: 
    // Data, which represents the data storage and manipulation code, and UI, 
    // which represents the control on the page and its interactions with the user 
    var initialize = function(options) { 
        new this.Data(options, this); 
        new this.UI(options, this); 
		
        // Once the code blocks are instantiated, we fire the INITIALIZE event 
        this.fire(this.eventType.INITIALIZE); 
		
        return this; 
    }.call(this, options); 
} 

// Inherit the Observer pattern's listen and fire events 
Slider.prototype = new $.Observer; 

// The Data code block represents the data storage and manipulation part of the 
// slider control's code base 
Slider.prototype.Data = function(options, thisSlider){

	// Store a reference to the master slider object instance in order to refer to 
    // its events list, and declare a property to store an array of possible values 
    // represented on the slider and a property to store the currently selected 
    // index within that array of values 
    this.thisSlider = this; 
    this.values = []; 
    this.selectedIndex = 0; 
	
    // A series of getters and setters provide a method for the rest of the code to 
    // access the stored data properties safely 
    this.getSliderInstance = function() { 
        return this.thisSlider; 
    } 
	
    this.setSliderInstance = function(thisSlider) { 
        this.thisSlider = thisSlider || this; 
        return this; 
    } 
	
    this.getValues = function() { 
        return this.values; 
    } 
	
    this.setValues = function(values) { 
        this.values = values || this.getValues(); 
        return this; 
    } 
	
    this.getSelectedIndex = function() { 
        return this.selectedIndex; 
    } 
	
    this.setSelectedIndex = function(newIndex) { 
        this.selectedIndex = newIndex || this.getSelectedIndex(); 
        return this; 
    } 
    // The getIndexByPercentage method provides a useful way of establishing 
    // the index in the array of slider values that is represented by the position 
    // the slider handle has been dragged within the control, specified as a 
    // percentage. If the handle is dragged to the far left, the first index of the 
    // array would be returned; if dragged to the far right, the last index would 
    // be returned 
    this.getIndexByPercentage = function(percentage) { 
        var values = this.getValues(); 
        var index = Math.round((percentage / 100) * (values.length - 1)); 
        return index; 
    }
	
	// The getPercentageByIndex method returns the percentage position through 
    // the slider the handle should be located, based on a specific index of the 
    // array of values. An index of 0 would return 0 percent. The final index 
    // of the array would represent 100 percent. 
    this.getPercentageByIndex = function(index) { 
        var values = this.getValues(); 
        var percentage = ((index / (values.length - 1)) * 100); 
        return percentage; 
    } 
	
    // The getValueByPercentage locates the value represented within the array 
    // of values for a given percentage position of the handle through the 
    // slider control 
    this.getValueByPercentage = function(percentage) { 
        var values = this.getValues(); 
        var index = this.getIndexByPercentage(percentage); 
        return values[index]; 
    } 
	
    // The addObservers method listens for events fired within the slider control 
    // and reacts to them 
    this.addObservers = function() { 
        var self = this; 
        var thisSlider = this.getSliderInstance(); 
        var eventType = thisSlider.eventType; 
		
        // Listen for the INITIALIZE event and immediately fire the READY event, 
        // passing it the array of values to represent on the control and the 
        // selected index within that array of the currently selected item 
        thisSlider.listen(eventType.INITIALIZE, function() { 
            thisSlider.fire(eventType.READY, { 
                values: self.getValues(), 
                index: self.getSelectedIndex() 
            }); 
        }); 
		
        // Listen for the HANDLE_MOVED event, which receives the current percentage 
        // position of the handle through the control. Fire the VALUE_CHANGED event, 
        // passing it the array of values and the index within that array that 
        // should be represented at the position of the handle 
        thisSlider.listen(eventType.HANDLE_MOVED, function(percentage) { 
            thisSlider.fire(eventType.VALUE_CHANGED, { 
                values: self.getValues(), 
                index: self.getIndexByPercentage(percentage) 
            }); 
        });
		
		// Listen for the MOVE event, which receives the new index position to move 
        // the control to. Fire the VALUE_CHANGED event, passing it the array of 
        // values and the new index within that array so that the UI can be updated 
        thisSlider.listen(eventType.MOVE, function(index) { 
            thisSlider.fire(eventType.VALUE_CHANGED, { 
                values: self.getValues(), 
                index: index 
            }); 
        }); 
		
        // Listen for the VALUE_CHANGED event, setting the selected index from the 
        // value passed to the event 
        thisSlider.listen(eventType.VALUE_CHANGED, function(results) { 
            self.setSelectedIndex(results.index); 
        }); 
		
        return this; 
    }; 
	
    // Initialize the Data code block within the slider control by setting its 
    // default values and begin to listen for events fired in the system 
    var initialize = function(options, thisSlider){ 
        this 
            .setSliderInstance(thisSlider) 
            .setValues(options.values) 
            .setSelectedIndex(options.selectedIndex) 
            .addObservers(); 
			
            return this; 
    }.call(this, options, thisSlider); 
} 

// The UI code block contains the code necessary to render the slider control to the 
// page and provide user interaction with that control 
Slider.prototype.UI = function(options, thisSlider){ 

    // Define the  UI-related properties for the slider control, including a 
    // reference to the master Slider object instance to connect to its events, 
    // a reference to the DOM element to place the control within on the page, 
    // and references to the handle element, its container and the labels to 
    // display beneath the handle 
    this.thisSlider = this; 
    this.destinationElement = null; 
    this.handleElement = null; 
    this.handleRangeElement = null; 
    this.valueLabelsElement = null;
	
	// Create getter and setter methods to protect the values in the properties 
    this.getSliderInstance = function() { 
        return this.thisSlider; 
    } 
	
    this.setSliderInstance = function(thisSlider) { 
        this.thisSlider = thisSlider || this; 
        return this; 
    } 
	
    this.getDestinationElement = function() { 
        return this.destinationElement; 
    } 
	
    this.setDestinationElement = function(destinationElement) { 
        this.destinationElement = destinationElement || $.Elements.create("div"); 
        return this; 
    } 
	
    this.getHandleElement = function() { 
        return this.handleElement; 
    } 
	
    this.setHandleElement = function(handleElement) { 
        this.handleElement = handleElement || $.Elements.create("div"); 
        return this; 
    } 
	
    this.getHandleRangeElement = function() { 
        return this.handleRangeElement; 
    } 
	
    this.setHandleRangeElement = function(handleRangeElement) { 
        this.handleRangeElement = handleRangeElement || $.Elements.create("div"); 
        return this; 
    } 
	
    this.getValueLabelsElement = function() { 
        return this.valueLabelsElement; 
    } 
	
    this.setValueLabelsElement = function(valueLabelsElement) { 
        this.valueLabelsElement = valueLabelsElement || $.Elements.create("div"); 
        return this; 
    }
	
	// The generateSliderElement method generates a DOM object containing the 
    // elements required to render a slider control on the page 
    this.generateSliderElement = function(values) { 
	
        // Create a single container element within which to place all 
        // other elements 
        var container = $.Elements.create("div"); 
		
        // Create an element to store the set of value labels associated with the 
        // array of possible data values represented within the slider control 
        var valueLabels = $.Elements.create("div"); 
        valueLabels.className =  "value-labels"; 
		
        // Loop through the array of values passed to this method, creating a 
        // DOM element for each one containing the text value to show on the 
        // slider control's label row 
        for (var index = 0, length = values.length; index < length; index++) { 
            var valueLabel = $.Elements.create("div"); 
            valueLabel.className =  "value-label"; 
            valueLabel.innerHTML = values[index]; 
            valueLabels.appendChild(valueLabel); 
        } 
		
        // Add the valueLabels element, complete with the value labels within, to 
        // the container DOM element 
        container.appendChild(valueLabels); 
		
        // Create a DOM element to use as the handle for the user to drag to select 
        // values along the slider control 
        var handle = $.Elements.create("div"); 
        handle.className = "handle"; 
		
        // Create a DOM element to use as a container for the handle, allowing us to 
        // later use CSS to restrict how far the handle can be moved within 
        // the slider 
        var handleRange = $.Elements.create("div"); 
        handleRange.className =  "handle-range"; 
		
        // Add the handle to its container element 
        handleRange.appendChild(handle); 
		
        // Add the handle container to the container element surrounding the 
        // whole slider control 
        container.appendChild(handleRange);
		
		// Return the single DOM element containing the slider's HTML elements 
        return container; 
    } 
	
    // The render method draws the slider component onto the page within the 
    // specified page element 
    this.render = function(values) { 
        var thisSlider = this.getSliderInstance(); 
        var eventType = thisSlider.eventType; 
		
        // Get the DOM elements for the slider control and add them to the page 
        var documentFragment = document.createDocumentFragment(); 
        documentFragment.appendChild(this.generateSliderElement(values)); 
        this.getDestinationElement().appendChild(documentFragment.cloneNode(true)); 
		
        // Fire the HTML_RENDERED event now that the control is on the page 
        thisSlider.fire(eventType.HTML_RENDERED); 
		
        return this; 
    } 
	
    // The applyStyle method adds a class name to the page element to allow the 
    // slider control to be styled in the appropriate way 
    this.applyStyle = function() { 
        $.CSS.addClass(this.getDestinationElement(), "slider"); 
		
        // To ensure that the handle is always displayed within the handle range 
        // container element, we specify the handle to use absolute positioning 
        // relative to its container element. This ensures the slider should work 
        // in the case where the CSS style rule for this has been neglected 
        this.getHandleRangeElement().style.position = "relative"; 
        this.getHandleElement().style.position = "absolute"; 
		
        return this; 
    } 
	
    // The positionLabels method sets the position of the value label elements along 
    // the width of the slider control from left to right, filling all available 
    // space 
    this.positionLabels = function() { 
	
        // Find the width of the container element, encompassing the 
        // individual labels 
        var labelContainerWidth = parseInt($.CSS.getAppliedStyle(this.getValueLabelsElement(), "width"));
		
		// Get an array of all the label value elements in the slider control 
        var labels = $.Elements.getElementsByClassName("value-label", this.getDestinationElement()); 
		
        // Make a pretty good estimate of the width of each of the value elements 
        var defaultWidth = Math.round(labelContainerWidth / labels.length); 
		
        // Loop through each label element 
        for (var index = 0, length = labels.length; index < length; index++) { 
		
            // Ensure each label uses absolute positioning or it will not 
            // display correctly 
            labels[index].style.position = "absolute"; 
			
            // Try to get the actual width of each label element based on the 
            // text within it 
            var width = parseInt($.CSS.getAppliedStyle(labels[labelIndex], "width")); 
			
            // Sometimes, Internet Explorer does not return a width in this way. 
            // If no value is returned, use the estimated width calculated 
            // earlier instead 
            if (isNaN(width)) { 
                width = defaultWidth; 
            } 
			
            // We want to center the label text around the position we're trying 
            // to find, so we need to calculate half the width of the label in order 
            // to shift it that distance to the left of the central point - making 
            // the text appear centered 
            var halfWidth = Math.round(width / 2); 
            var proportionThroughSlider = labelIndex / (labels.length - 1); 
            var position = (Math.round(proportionThroughSlider * labelContainerWidth) - halfWidth); 
				
            // Position this label element correctly using CSS 
            labels[labelIndex].style.width = width + "px"; 
            labels[labelIndex].style.left = position + "px"; 
        } 
		
        // We need to set the label wrapper element's CSS positioning to relative, 
        // so that the label elements display correctly within it 
        this.getValueLabelsElement().style.position = "relative"; 
		
        return this; 
    }
	
	// The setHandlePositionByPercentage method positions the handle within its 
    // container element based on the supplied percentage value 
    this.setHandlePositionByPercentage = function(percentage) { 
        this.getHandleElement().style.left = percentage + "%"; 
        return this; 
    } 
	
    // The setHandlePosition moves the handle element to the position represented by 
    // the selected index and data value array passed to it. If the selected index 
    // is 0, the handle is moved all the way to the left. If the selected index is 
    // the last in the array, the handle is moved all the way to the right 
    this.setHandlePosition = function(data) { 
        var percentage = (data.index / (data.values.length - 1)) * 100; 
        this.setHandlePositionByPercentage(percentage); 
		
        return this; 
    }; 
	
    // The wireUpUserEvents method provides the user interactions with the 
    // slider control, allowing the handle to be dragged to a new position 
    this.wireUpUserEvents = function() { 
        var self = this; 
		
        // Execute methods when the mouse is pressed down on the handle, and 
        // released and moved anywhere on the page 
        $.Events.add(this.getHandleElement(), "mousedown", function(e) { 
            self.onMouseDown(e); 
        }); 
		
        $.Events.add(document.body, "mouseup", function(e) { 
            self.onMouseUp(e); 
        }); 
		
        $.Events.add(document.body, "mousemove", function(e) { 
            self.onMouseMove(e); 
        }); 
    } 
	
    // Define a value to store whether the mouse button is currently 
    // depressed – only gets set if the initial button press occurred over 
    // the handle element 
    this.mouseButtonHeldDown = false; 
	
    // Executed when the mouse is pressed down on the handle element 
    this.onMouseDown = function(e) {

		// Prevent the default mouse down action on the handle element 
        e.preventDefault(); 
        // Denote that the mouse button is now held down on the handle 
        this.mouseButtonHeldDown = true; 
    } 
	
    // Executed when the mouse button is lifted up anywhere on the page 
    this.onMouseUp = function(e) { 
	
        // Signify that the mouse button is no longer being held down 
        this.mouseButtonHeldDown = false; 
    } 
	
    // Executed when the mouse is being moved anywhere on the page 
    this.onMouseMove = function(e) { 
	
        // If the mouse button is still being held down on the handle and the mouse 
        // is being moved, this can be considered a drag of the handle, so execute 
        // a new onDrag method 
        if (this.mouseButtonHeldDown) { 
            this.onDrag(e); 
        } 
    } 
	
    // The onDrag method allows the slider handle to be moved horizontally within 
    // its container, updating the selected value within the control when it is 
    // moved to a new position 
    this.onDrag = function(e) { 
        var thisSlider = this.getSliderInstance(); 
        var eventType = thisSlider.eventType; 
		
        // Get the width of the handle's container element 
        var handleHolderWidth = parseInt($.CSS.getAppliedStyle(this.getHandleRangeElement(), "width")); 
		
        // Get the current x-position of the mouse 
        var mouseX = e.pageX; 
		
        // Get the current x-position of the handle's container element 
        var elementWrapperX = parseInt($.CSS.getPosition( this.getHandleRangeElement()).x); 
		
        // Calculate the difference between these two values, which represents the 
        // distance in pixels of the current handle position from the leftmost point 
        // of the container element 
        var distanceFromLeft = mouseX - elementWrapperX;
		
		// Restrict dragging of the handle to within the confines of the 
        // container element 
        if (distanceFromLeft >= 0 && distanceFromLeft <= handleHolderWidth) { 
		
            // Calculate the percentage position the handle lies within 
            // its container 
            var percentage = Math.round((distanceFromLeft / handleHolderWidth) * 100); 
			
            // Fire the HANDLE_MOVED event, passing it the new percentage position 
            // of the handle 
            thisSlider.fire(eventType.HANDLE_MOVED, percentage); 
        } 
    } 
	
    // The addObservers method listens for events fired within the slider control as 
    // a whole and acts upon them to update the UI of the control 
    this.addObservers = function(){ 
        var self = this; 
        var thisSlider = this.getSliderInstance(); 
        var eventType = thisSlider.eventType; 
		
        // Listen for the READY event to fire, which passes across the data values 
        // and selected index, and use these to render the control and set the 
        // initial position of the handle 
        thisSlider.listen(eventType.READY, function(data) { 
            self.render(data.values); 
            self.setHandlePosition(data); 
        }); 
		
        // Listen for the HTML_RENDERED event to fire, and use it to locate and 
        // store references to some of the new controls added. Position the labels 
        // within the control and set up the controls for user interaction within 
        // the browser 
        thisSlider.listen(eventType.HTML_RENDERED, function(){ 
            var destinationElement = self.getDestinationElement(); 
			
            self 
                .setHandleElement($.Elements.getElementsByClassName("handle", self.getDestinationElement())[0]) 
                .setHandleRangeElement($.Elements.getElementsByClassName("handle-range", self.getDestinationElement())[0]) 
                .setValueLabelsElement($.Elements.getElementsByClassName("value-labels", self.getDestinationElement())[0]) 
                .applyStyle() 
                .positionLabels() 
                .wireUpUserEvents(); 
        });
		
		// Listen for the VALUE_CHANGED event to fire and update the handle position 
        // to snap to the appropriate position based on the newly selected 
        // data value 
        thisSlider.listen(eventType.VALUE_CHANGED, function(data){ 
            self.setHandlePosition(data); 
        }); 
		
        return this; 
    }; 
	
    // Initialize the UI data block, setting the default properties and begin 
    // listening for events 
    var initialize = function(){ 
        this 
            .setSliderInstance(thisSlider) 
            .setDestinationElement(options.destinationElement) 
            .addObservers(); 
    }.call(this, options, thisSlider) 
} 